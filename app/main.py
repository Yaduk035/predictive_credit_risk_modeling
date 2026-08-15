import json
import io
import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from google import genai
from google.genai import types
from rag_service import query_policy_rag, format_policy_context, get_pinecone_client, get_or_create_index

# 1. Initialize the App
app = FastAPI(title="NeoBank Risk Engine API")

# 2. CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://predictive-credit-risk-modeling.vercel.app","http://localhost:3000","http://localhost:3001"],  # In production, restrict this to your React frontend URL
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load environment variables (your API key)
load_dotenv()

# 3. Load ML Assets on Startup
print("Loading Model Assets...")
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.abspath(os.path.join(BASE_DIR, '..', 'models'))
DATA_DIR = os.path.abspath(os.path.join(BASE_DIR, '..', 'data', 'datasets'))

try:
    model = joblib.load(os.path.join(MODELS_DIR, 'gradient_boosting_model.pkl'))
    scaler = joblib.load(os.path.join(MODELS_DIR, 'scaler.pkl'))
    
    with open(os.path.join(MODELS_DIR, 'feature_columns.json'), 'r') as f:
        feature_columns = json.load(f)
        
    # --- UPDATED: Load the flattened Data Dictionary ---
    with open(os.path.join(DATA_DIR, 'Data_Dictionary.json'), 'r') as f:
        raw_list = json.load(f)
        
    # Create the lookup table directly from the list of objects
    feature_descriptions = {}
    for item in raw_list:
        feature_descriptions[item['variable']] = item['description']
            
    print("Assets loaded successfully! Ready for predictions.")
except Exception as e:
    print(f"Error loading assets: {e}")

ai_client = genai.Client()

def generate_ai_summary_with_fallback(prompt_text: str) -> str:
    models_to_try = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.6-flash', 'gemini-3.7-flash']
    last_err = None
    for model_name in models_to_try:
        try:
            interaction = ai_client.interactions.create(
                model=model_name,
                input=prompt_text,
            )
            return interaction.output_text
        except Exception as e:
            last_err = str(e)
            print(f"[AI Model Fallback]: Model '{model_name}' returned error: {e}. Trying next model...")
            continue
    raise Exception(last_err or "All AI summary models are currently unavailable.")

# Helper Function: Process a DataFrame through the Scaler and Model
def process_dataframe_predictions(df_input: pd.DataFrame):
    # Normalize input columns to lowercase for case-insensitive matching
    input_cols_lower = {str(col).strip().lower(): col for col in df_input.columns}
    
    processed_rows = []
    
    for idx, row in df_input.iterrows():
        row_dict = {}
        for i, col in enumerate(feature_columns):
            col_lower = str(col).strip().lower()
            if col_lower in input_cols_lower:
                original_col_name = input_cols_lower[col_lower]
                val = row[original_col_name]
                # If value is missing/NaN, fallback to mean
                row_dict[col] = scaler.mean_[i] if pd.isna(val) else val
            else:
                # Fill missing features with training mean (neutral z-score)
                row_dict[col] = scaler.mean_[i]
        processed_rows.append(row_dict)
        
    # Reconstruct DataFrame with exact feature ordering
    df_aligned = pd.DataFrame(processed_rows)[feature_columns]
    
    # Scale features
    scaled_features = scaler.transform(df_aligned)
    
    # Model Predictions
    predictions = model.predict(scaled_features)
    probabilities = model.predict_proba(scaled_features)
    
    # Class mapping setup
    tier_mapping = {0: "P1", 1: "P2", 2: "P3", 3: "P4"}
    
    results = []
    for i in range(len(df_input)):
        pred_val = predictions[i]
        max_prob = float(np.max(probabilities[i]))
        
        # Explicitly map the integer to P1, P2, P3, or P4
        try:
            pred_key = int(pred_val)
            predicted_tier = tier_mapping.get(pred_key, f"Unknown ({pred_val})")
        except ValueError:
            # Fallback if the model already outputs strings
            predicted_tier = str(pred_val)
            
        results.append({
            "risk_tier": predicted_tier,
            "probability": round(max_prob * 100, 2)
        })
        
    return results

# 4. Input Schema for Single Evaluation
class ApplicantData(BaseModel):
    features: dict


# 5. Single Prediction Endpoint
@app.post("/api/predict")
async def evaluate_applicant(data: ApplicantData):
    try:
        df = pd.DataFrame([data.features])
        results = process_dataframe_predictions(df)
        
        return {
            "status": "success",
            "risk_tier": results[0]["risk_tier"],
            "probability": results[0]["probability"]
        }
    except Exception as e:
        print(f"[ERROR in /predict]: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# 6. Bulk CSV Upload Prediction Endpoint
@app.post("/api/predict-csv")
async def evaluate_batch_csv(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")
        
    try:
        # Read uploaded CSV file
        contents = await file.read()
        df_raw = pd.read_csv(io.BytesIO(contents))
        
        # Generate predictions for all rows
        predictions = process_dataframe_predictions(df_raw)
        
        # Combine original data with prediction outputs
        records = df_raw.to_dict(orient="records")
        output_data = []
        
        for i, record in enumerate(records):
            record["Predicted_Risk_Tier"] = predictions[i]["risk_tier"]
            record["Confidence_Probability"] = f"{predictions[i]['probability']}%"
            output_data.append(record)
            
        return {
            "status": "success",
            "total_records": len(output_data),
            "results": output_data
        }
        
    except Exception as e:
        print(f"[ERROR in /predict-csv]: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# 7. RAG Health Check Endpoint
@app.get("/api/rag-status")
async def check_rag_status():
    try:
        pc = get_pinecone_client()
        if pc is None:
            return {
                "status": "disabled",
                "message": "PINECONE_API_KEY is not configured in app/.env."
            }
        index = get_or_create_index(pc)
        if index is None:
            return {
                "status": "error",
                "message": "Unable to connect to Pinecone vector index."
            }
        stats = index.describe_index_stats()
        return {
            "status": "active",
            "vector_count": stats.total_vector_count,
            "dimension": stats.dimension,
            "index_name": "neobank-credit-policy"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


class SummaryRequest(BaseModel):
    risk_tier: str
    probability: float
    applicant_data: dict

@app.post("/api/generate-summary")
async def generate_ai_summary(request: SummaryRequest):
    try:
        # 1. Translate the raw data into English using dictionary
        translated_data_lines = []
        for key, value in request.applicant_data.items():
            description = feature_descriptions.get(key, key)
            translated_data_lines.append(f"- {description} ({key}): {value}")
            
        formatted_applicant_data = "\n".join(translated_data_lines)
        
        # 2. Retrieve relevant Bank Credit Policy & RBI Clauses using Pinecone RAG
        rag_matches = query_policy_rag(
            genai_client=ai_client,
            risk_tier=request.risk_tier,
            probability=request.probability,
            applicant_data=request.applicant_data,
            top_k=3
        )
        
        policy_context_str = format_policy_context(rag_matches)
        
        policy_section = ""
        if policy_context_str:
            policy_section = f"""
            Retrieved Bank Credit Policy & Regulatory Clauses (Grounding Context):
            {policy_context_str}
            """

        # 3. Construct RAG-augmented prompt
        prompt = f"""
        You are an expert FinTech Executive Underwriting AI. A machine learning model (XGBoost) has just 
        evaluated a loan applicant and classified them as {request.risk_tier} with a {request.probability}% confidence probability.
        
        Tier Definitions:
        - P1/P2 = Safe to Moderate Risk (Approved profile)
        - P3/P4 = Subprime to High Risk (Requires manual review / decline)
        
        Applicant Financial Data (with exact feature definitions):
        {formatted_applicant_data}

        {policy_section}
        
        STRICT OUTPUT CONSTRAINTS & FORMATTING RULES:
        1. LENGTH & FORMAT: Write a clear, professional executive underwriter synthesis around 120 words (3 to 4 well-structured sentences).
        2. NO TABLES OR HEADERS: Do NOT include markdown tables, headings, titles, memorandums, bullet lists, or raw data dumps. Output ONLY clear paragraph text.
        3. VARIABLE CITATIONS: Whenever you mention any financial metric or variable, ALWAYS format it as: "Human Description (VARIABLE_NAME)", for example:
           - "Number of times 30+ Days Past Due (num_times_30p_dpd)"
           - "Total Missed Payments (Tot_Missed_Pmnt)"
           - "Percentage of Current Balance across All Trade Lines (pct_currentBal_all_TL)"
           - "Net Monthly Income (NETMONTHLYINCOME)"
        4. POLICY CITATIONS: Include concise policy citations in brackets, e.g. [Credit Policy §2.1].
        """
        
        ai_summary = generate_ai_summary_with_fallback(prompt)

        citation_badges = []
        for m in rag_matches:
            citation_badges.append({
                "doc_name": m["doc_name"],
                "clause": m["clause"],
                "score": m["score"]
            })
        
        return {
            "status": "success",
            "ai_summary": ai_summary,
            "policy_citations": citation_badges
        }
        
    except Exception as e:
        err_msg = str(e)
        print(f"[ERROR in /generate-summary]: {err_msg}")
        if "429" in err_msg or "RESOURCE_EXHAUSTED" in err_msg or "quota" in err_msg.lower():
            raise HTTPException(
                status_code=429, 
                detail="AI summary rate limit reached (20 requests/minute). Please wait 15-30 seconds before re-generating."
            )
        raise HTTPException(status_code=500, detail=err_msg)


class BulkSummaryRequest(BaseModel):
    total_records: int
    tier_counts: dict
    portfolio_metrics: dict = {}

@app.post("/api/generate-bulk-summary")
async def generate_bulk_portfolio_summary(request: BulkSummaryRequest):
    try:
        total = request.total_records if request.total_records > 0 else 1
        p1 = request.tier_counts.get("P1", 0)
        p2 = request.tier_counts.get("P2", 0)
        p3 = request.tier_counts.get("P3", 0)
        p4 = request.tier_counts.get("P4", 0)

        p1_pct = round((p1 / total) * 100, 1)
        p2_pct = round((p2 / total) * 100, 1)
        p3_pct = round((p3 / total) * 100, 1)
        p4_pct = round((p4 / total) * 100, 1)

        prompt = f"""
        You are an expert FinTech Executive Portfolio Risk Analyst. A machine learning model (XGBoost) has just 
        evaluated a batch of {request.total_records} loan applicants in a bulk CSV upload.

        Portfolio Risk Tier Breakdown:
        - Tier P1 (Prime Safe): {p1} applicants ({p1_pct}%)
        - Tier P2 (Standard Moderate): {p2} applicants ({p2_pct}%)
        - Tier P3 (Subprime Risk): {p3} applicants ({p3_pct}%)
        - Tier P4 (Severe High Risk): {p4} applicants ({p4_pct}%)

        Task:
        Write a concise, professional executive portfolio summary (around 100 to 120 words in clear paragraph text) analyzing:
        1. Overall portfolio credit health and the ratio of Prime (P1/P2: {p1 + p2} total, {round(p1_pct + p2_pct, 1)}%) vs Subprime (P3/P4: {p3 + p4} total, {round(p3_pct + p4_pct, 1)}%).
        2. High-level underwriting action plan for credit officers (e.g., auto-approval rate for P1/P2 vs manual audit/decline rate for P3/P4).
        3. Do NOT use markdown tables or memorandum headers. Write clean, direct paragraph text.
        """

        ai_summary = generate_ai_summary_with_fallback(prompt)

        return {
            "status": "success",
            "ai_summary": ai_summary
        }

    except Exception as e:
        err_msg = str(e)
        print(f"[ERROR in /generate-bulk-summary]: {err_msg}")
        if "429" in err_msg or "RESOURCE_EXHAUSTED" in err_msg or "quota" in err_msg.lower():
            raise HTTPException(
                status_code=429, 
                detail="AI summary rate limit reached (20 requests/minute). Please wait 15-30 seconds before re-generating."
            )
        raise HTTPException(status_code=500, detail=err_msg)


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    question: str
    history: list[ChatMessage] = []
    risk_tier: str | None = None
    probability: float | None = None
    applicant_data: dict | None = None

@app.post("/api/chat-rag")
async def chat_with_policy_rag(request: ChatRequest):
    try:
        # 1. Format applicant data context if provided
        applicant_context_str = ""
        applicant_dict = request.applicant_data or {}
        if applicant_dict:
            translated_lines = []
            for key, val in applicant_dict.items():
                desc = feature_descriptions.get(key, key)
                translated_lines.append(f"- {desc} ({key}): {val}")
            applicant_context_str = "\n".join(translated_lines)

        # 2. Query Pinecone vector DB using user's question + applicant attributes
        rag_matches = query_policy_rag(
            genai_client=ai_client,
            risk_tier=request.risk_tier or "General",
            probability=request.probability or 0.0,
            applicant_data=applicant_dict,
            user_question=request.question,
            top_k=4
        )
        
        policy_context_str = format_policy_context(rag_matches)
        
        # 3. Build chat history representation
        formatted_history = ""
        if request.history:
            history_lines = []
            for msg in request.history[-6:]:  # Keep last 6 exchanges for context window efficiency
                role_label = "User" if msg.role == "user" else "Assistant"
                history_lines.append(f"{role_label}: {msg.content}")
            formatted_history = "\n".join(history_lines)

        # 4. Construct RAG System Prompt
        prompt = f"""
You are the **NeoBank AI Underwriter & Compliance Co-Pilot**, an expert assistant trained on RBI (Reserve Bank of India) lending regulations, bank credit policy guidelines, and CIBIL bureau metrics.

### Contextual Knowledge & Grounding Guidelines:
1. Ground your answers in official bank policies, RBI guidelines, and credit dictionary definitions whenever applicable.
2. If the user is asking about a specific loan applicant, refer to their evaluation details provided below.
3. Be professional, clear, concise, and direct (use bullet points or markdown bold formatting where helpful).
4. When citing metrics, use the format: "Description (VARIABLE_NAME)", e.g. "Total Missed Payments (Tot_Missed_Pmnt)".
5. Cite policy clauses when applicable, e.g. [Credit Policy §3.2] or [RBI Digital Lending Guidelines].
6. Treat the machine learning model's prediction (Risk Tier P1-P4 and confidence probability) as the primary assessment. Explain how the applicant's metrics align with the policy guidelines rather than asserting a compliance error or misclassification.

--- Active Applicant Details ---
Risk Tier: {request.risk_tier if request.risk_tier else "N/A (General Query)"}
Model Confidence Probability: {request.probability if request.probability else "N/A"}%
Applicant Financial Profile:
{applicant_context_str if applicant_context_str else "No active applicant profile selected."}

--- Grounding Retrieved Policy & Regulatory Clauses ---
{policy_context_str if policy_context_str else "No specific policy clause match found."}

--- Conversation History ---
{formatted_history if formatted_history else "Starting new conversation."}

User Question: {request.question}
Assistant Answer:
"""

        answer_text = generate_ai_summary_with_fallback(prompt)

        citation_badges = []
        for m in rag_matches:
            citation_badges.append({
                "doc_name": m["doc_name"],
                "clause": m["clause"],
                "score": m["score"]
            })

        return {
            "status": "success",
            "answer": answer_text,
            "policy_citations": citation_badges
        }
    except Exception as e:
        err_msg = str(e)
        print(f"[ERROR in /chat-rag]: {err_msg}")
        if "429" in err_msg or "RESOURCE_EXHAUSTED" in err_msg or "quota" in err_msg.lower():
            raise HTTPException(
                status_code=429,
                detail="AI rate limit reached. Please wait a few seconds before sending another message."
            )
        raise HTTPException(status_code=500, detail=err_msg)


