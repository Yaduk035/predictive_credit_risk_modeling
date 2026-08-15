import os
import re
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec

# Load environment variables
load_dotenv()

INDEX_NAME = "neobank-credit-policy"
EMBED_MODEL = "gemini-embedding-001"
EMBED_DIMENSION = 3072


def get_pinecone_client():
    api_key = os.getenv("PINECONE_API_KEY")
    if not api_key:
        return None
    try:
        return Pinecone(api_key=api_key)
    except Exception as e:
        print(f"[Pinecone Setup Error]: {e}")
        return None

def get_or_create_index(pc: Pinecone):
    if pc is None:
        return None
    try:
        existing = [idx.name for idx in pc.list_indexes()]
        if INDEX_NAME not in existing:
            print(f"Creating serverless Pinecone index '{INDEX_NAME}'...")
            pc.create_index(
                name=INDEX_NAME,
                dimension=EMBED_DIMENSION,
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1")
            )
        return pc.Index(INDEX_NAME)
    except Exception as e:
        print(f"[Pinecone Index Error]: {e}")
        return None

def generate_embedding(genai_client, text: str):
    try:
        res = genai_client.models.embed_content(
            model=EMBED_MODEL,
            contents=text
        )
        return res.embeddings[0].values
    except Exception as e:
        print(f"[Embedding Error]: {e}")
        return None

def query_policy_rag(genai_client, risk_tier: str, probability: float, applicant_data: dict, user_question: str = "", top_k: int = 3):
    pc = get_pinecone_client()
    if pc is None:
        return []

    index = get_or_create_index(pc)
    if index is None:
        return []

    # Build targeted semantic query combining user question and applicant attributes
    income = applicant_data.get('NETMONTHLYINCOME', 'N/A')
    missed = applicant_data.get('Tot_Missed_Pmnt', 0)
    dpd30 = applicant_data.get('num_times_30p_dpd', 0)
    inquiries = applicant_data.get('tot_enq', 0)
    balance_ratio = applicant_data.get('pct_currentBal_all_TL', 0.0)

    query_components = []
    if user_question:
        query_components.append(f"User Query: {user_question}")
    
    query_components.append(
        f"Underwriting credit policy rules and regulatory compliance guidelines for "
        f"Risk Tier {risk_tier} ({probability}% confidence). "
        f"Net Monthly Income: ₹{income}, Missed Payments: {missed}, "
        f"30+ DPD Occurrences: {dpd30}, Bureau Inquiries: {inquiries}, Balance Ratio: {balance_ratio}."
    )

    query_str = "\n".join(query_components)

    query_vec = generate_embedding(genai_client, query_str)
    if not query_vec:
        return []

    try:
        res = index.query(
            vector=query_vec,
            top_k=top_k,
            include_metadata=True
        )

        matches = []
        for match in res.matches:
            meta = match.metadata or {}
            matches.append({
                "id": match.id,
                "score": round(float(match.score), 4),
                "doc_name": meta.get("doc_name", "Policy Document"),
                "clause": meta.get("clause", "Section Clause"),
                "content": meta.get("content", "")
            })
        return matches
    except Exception as e:
        print(f"[RAG Query Error]: {e}")
        return []

def format_policy_context(matches: list) -> str:
    if not matches:
        return ""

    context_blocks = []
    for m in matches:
        clause_str = f"[{m['doc_name']} - {m['clause']}]"
        context_blocks.append(f"### {clause_str}\n{m['content']}")

    return "\n\n".join(context_blocks)
