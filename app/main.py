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

# 1. Initialize the App
app = FastAPI(title="NeoBank Risk Engine API")

# 2. CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://predictive-credit-risk-modeling.vercel.app","http://localhost:3000","http://localhost:3001"],  # In production, restrict this to your React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load environment variables (your API key)
load_dotenv()

# 3. Load ML Assets on Startup
print("Loading Model Assets...")
try:
    model = joblib.load('../models/xgboost_model.pkl')
    scaler = joblib.load('../models/scaler.pkl')
    
    with open('../models/feature_columns.json', 'r') as f:
        feature_columns = json.load(f)
        
    # --- UPDATED: Load the flattened Data Dictionary ---
    with open('../data/datasets/Data_Dictionary.json', 'r') as f:
        raw_list = json.load(f)
        
    # Create the lookup table directly from the list of objects
    feature_descriptions = {}
    for item in raw_list:
        feature_descriptions[item['variable']] = item['description']
            
    print("Assets loaded successfully! Ready for predictions.")
except Exception as e:
    print(f"Error loading assets: {e}")

ai_client = genai.Client()

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


class SummaryRequest(BaseModel):
    risk_tier: str
    probability: float
    applicant_data: dict

@app.post("/api/generate-summary")
async def generate_ai_summary(request: SummaryRequest):
    try:
        # 1. Translate the raw data into English using your dictionary
        translated_data_lines = []
        for key, value in request.applicant_data.items():
            # Look up the English description, fallback to the raw key if not found
            description = feature_descriptions.get(key, key)
            translated_data_lines.append(f"- {description} ({key}): {value}")
            
        # Join it all into a readable string
        formatted_applicant_data = "\n".join(translated_data_lines)
        
        # 2. Inject the translated data into the prompt
        prompt = f"""
        You are an expert FinTech Underwriting AI. A machine learning model (XGBoost) has just 
        evaluated a loan applicant and classified them as {request.risk_tier} with a {request.probability}% probability.
        
        Tier Definitions:
        - P1/P2 = Safe to Moderate (Good)
        - P3/P4 = Subprime to High Risk (Bad)
        
        Here is the applicant's financial data (with exact feature definitions):
        {formatted_applicant_data}
        
        Task:
        Write a concise, professional 3-sentence underwriter summary explaining exactly WHICH financial variables 
        likely drove this {request.risk_tier} classification. Do not use generic advice; point 
        directly to the numbers (e.g., missed payments, inquiries, income vs. utilization).
        """
        
        # Call the Gemini model
        interaction = ai_client.interactions.create(
            model='gemini-3.6-flash',
            input=prompt,
        )
        
        return {
            "status": "success",
            "ai_summary": interaction.output_text
        }
        
    except Exception as e:
        print(f"[ERROR in /generate-summary]: {e}")
        raise HTTPException(status_code=500, detail=str(e))
