import os
import re
import json
import time
from dotenv import load_dotenv
from google import genai
from pinecone import Pinecone, ServerlessSpec



try:
    import pypdf
except ImportError:
    pypdf = None

# Load environment variables
load_dotenv()

INDEX_NAME = "neobank-credit-policy"
EMBED_MODEL = "gemini-embedding-001"
EMBED_DIMENSION = 3072

def parse_markdown_clauses(file_path: str, doc_label: str):
    if not os.path.exists(file_path):
        return []

    with open(file_path, "r", encoding="utf-8") as f:
        text = f.read()

    raw_sections = re.split(r'\n(?=#{2,3}\s)', text)
    chunks = []

    for idx, sec in enumerate(raw_sections):
        sec = sec.strip()
        if not sec:
            continue

        lines = sec.split("\n")
        title_line = lines[0].lstrip("#").strip()
        body = "\n".join(lines[1:]).strip() if len(lines) > 1 else sec

        chunks.append({
            "id": f"{doc_label.lower().replace(' ', '_')}_chunk_{idx}",
            "doc_name": doc_label,
            "clause": title_line,
            "content": f"{title_line}\n{body}"
        })

    return chunks

def parse_pdf_document(file_path: str, doc_label: str):
    if not os.path.exists(file_path) or pypdf is None:
        return []

    chunks = []
    try:
        reader = pypdf.PdfReader(file_path)
        for page_num, page in enumerate(reader.pages):
            text = page.extract_text()
            if not text or len(text.strip()) < 50:
                continue

            page_text = text.strip()
            paragraphs = [p.strip() for p in page_text.split("\n\n") if p.strip()]

            for p_idx, para in enumerate(paragraphs):
                chunks.append({
                    "id": f"{doc_label.lower().replace(' ', '_')}_p{page_num + 1}_c{p_idx}",
                    "doc_name": doc_label,
                    "clause": f"Page {page_num + 1}",
                    "content": f"[{doc_label} - Page {page_num + 1}]\n{para}"
                })
    except Exception as e:
        print(f"[PDF Parse Error for {file_path}]: {e}")

    return chunks

def parse_data_dictionary(file_path: str):
    if not os.path.exists(file_path):
        return []
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            raw_list = json.load(f)
        chunks = []
        for idx, item in enumerate(raw_list):
            var_name = item.get("variable", "")
            desc = item.get("description", var_name)
            sheet = item.get("source_sheet", "")
            chunks.append({
                "id": f"data_dict_{var_name.lower()}_{idx}",
                "doc_name": "Bureau Data Dictionary",
                "clause": f"{desc} ({var_name})",
                "content": f"Bureau Metric Definition: {desc} ({var_name})\nSource Sheet: {sheet}"
            })
        return chunks
    except Exception as e:
        print(f"[Data Dictionary Parse Error]: {e}")
        return []

def run_ingestion():
    api_key = os.getenv("PINECONE_API_KEY")
    if not api_key:
        print("[INGEST ERROR]: PINECONE_API_KEY environment variable is not set in app/.env!")
        return

    print("Initializing Pinecone client...")
    pc = Pinecone(api_key=api_key)

    existing = [idx.name for idx in pc.list_indexes()]
    if INDEX_NAME in existing:
        desc = pc.describe_index(INDEX_NAME)
        if desc.dimension != EMBED_DIMENSION:
            print(f"Re-creating index '{INDEX_NAME}' to match embedding dimension {EMBED_DIMENSION}...")
            pc.delete_index(INDEX_NAME)
            existing.remove(INDEX_NAME)

    if INDEX_NAME not in existing:
        print(f"Creating Pinecone index '{INDEX_NAME}' (dim={EMBED_DIMENSION})...")
        pc.create_index(
            name=INDEX_NAME,
            dimension=EMBED_DIMENSION,
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1")
        )
        print("Index created successfully!")

    index = pc.Index(INDEX_NAME)

    print("Initializing Google GenAI client...")
    genai_client = genai.Client()

    base_dir = os.path.dirname(os.path.abspath(__file__))
    kb_dir = os.path.join(base_dir, "knowledge_base")
    dict_file = os.path.join(os.path.dirname(base_dir), "data", "datasets", "Data_Dictionary.json")

    # Load SOURCES.json metadata if available
    sources_map = {}
    sources_file = os.path.join(kb_dir, "SOURCES.json")
    if os.path.exists(sources_file):
        try:
            with open(sources_file, "r", encoding="utf-8") as sf:
                sources_list = json.load(sf)
                for item in sources_list:
                    sources_map[item["filename"]] = item.get("doc_name", item["filename"])
        except Exception as e:
            print(f"[SOURCES.json Error]: {e}")

    all_chunks = []

    # Ingest Data_Dictionary.json
    if os.path.exists(dict_file):
        print(f"Ingesting Data Dictionary: {dict_file}...")
        all_chunks += parse_data_dictionary(dict_file)

    # Ingest Markdown & PDF policy documents
    if os.path.exists(kb_dir):
        for fn in os.listdir(kb_dir):
            fp = os.path.join(kb_dir, fn)
            doc_label = sources_map.get(fn, fn.replace(".md", "").replace("_", " ").title())

            if fn.endswith(".md"):
                print(f"Ingesting Markdown: {fn} ({doc_label})...")
                all_chunks += parse_markdown_clauses(fp, doc_label)
            elif fn.endswith(".pdf"):
                print(f"Ingesting PDF: {fn} ({doc_label})...")
                all_chunks += parse_pdf_document(fp, doc_label)

    print(f"Total parsed policy & dictionary chunks: {len(all_chunks)}")

    vectors_to_upsert = []
    for chunk in all_chunks:
        print(f"Embedding: {chunk['doc_name']} - {chunk['clause']}...")
        try:
            res = genai_client.models.embed_content(
                model=EMBED_MODEL,
                contents=chunk["content"]
            )
            embedding = res.embeddings[0].values

            vectors_to_upsert.append({
                "id": chunk["id"],
                "values": embedding,
                "metadata": {
                    "doc_name": chunk["doc_name"],
                    "clause": chunk["clause"],
                    "content": chunk["content"]
                }
            })
            time.sleep(0.7)  # Sleep to stay within 100 requests/minute free tier rate limit
        except Exception as e:
            print(f"[Embedding Error for {chunk['id']}]: {e}")
            time.sleep(2)

    if vectors_to_upsert:
        print(f"Upserting {len(vectors_to_upsert)} vectors to Pinecone...")
        index.upsert(vectors=vectors_to_upsert)
        print("✓ Ingestion complete! All PDF and Markdown policy documents indexed into Pinecone.")

if __name__ == "__main__":
    run_ingestion()


