from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import json
import numpy as np

# 1. Initialize the App
app = FastAPI(title="NeoBank Risk Engine API")

# 2. Allow your React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Load ML Assets on Startup
print("Loading Model Assets...")
try:
    model = joblib.load('../models/xgboost_model.pkl')
    scaler = joblib.load('../models/scaler.pkl')
    
    with open('../models/feature_columns.json', 'r') as f:
        feature_columns = json.load(f)
    print("Assets loaded successfully! Ready for predictions.")
except Exception as e:
    print(f"Error loading assets: {e}")

# 4. Define the Input Data Structure (What React will send)
class ApplicantData(BaseModel):
    # Instead of defining 91 variables manually, we accept a dictionary
    features: dict

# 5. The Prediction Endpoint
@app.post("/predict")
async def evaluate_applicant(data: ApplicantData):
    try:
        # Convert the incoming JSON into a Pandas DataFrame
        input_dict = data.features
        df = pd.DataFrame([input_dict])
        
        # Ensure the columns match the exact order the model expects
        # If the React form missed a column, this fills it with 0 to prevent crashes
        for col in feature_columns:
            if col not in df.columns:
                df[col] = 0
        df = df[feature_columns]
        
        # Scale the data using your saved training scaler
        scaled_features = scaler.transform(df)
        
        # Make the Prediction
        prediction_num = model.predict(scaled_features)[0]
        
        # Get the probability (e.g., 85% sure it's P4)
        probabilities = model.predict_proba(scaled_features)[0]
        max_prob = float(np.max(probabilities))
        
        # Map the numeric output back to risk tiers
        tier_mapping = {0: "P1", 1: "P2", 2: "P3", 3: "P4"}
        predicted_tier = tier_mapping.get(prediction_num, "Unknown")
        
        return {
            "status": "success",
            "risk_tier": predicted_tier,
            "probability": round(max_prob * 100, 2)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))