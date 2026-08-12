# 🏦 Credit Risk Assessment Engine & Compliance Hub

A machine-learning-powered credit scoring and automated underwriting platform. This system evaluates loan applicant profiles across 90+ credit metrics (Internal Bank + External CIBIL data), classifies applicants into discrete risk tiers (**P1 to P4**), supports bulk CSV evaluation, and leverages Generative AI (Google Gemini) for automated underwriter briefs and explainability.

Developed as a capstone project for the **Executive Program in Advanced AI/ML** at **ICT Academy of Kerala**.

---

## 📌 Links & Repositories

* **Frontend:** `[Insert Frontend Link]`
* **Dataset Source:** [Leading Indian Bank & CIBIL Real-World Dataset](https://www.kaggle.com/datasets/saurabhbadole/leading-indian-bank-and-cibil-real-world-dataset)

---

## 👥 Team Members

* **Anisha B Nair** — [`@github_username`](https://github.com/[placeholder_1])
* **Ann Maria** — [`@github_username`](https://github.com/[placeholder_2])
* **Yadukrishna S** — [`@yaduk035`](https://github.com/Yaduk035)

---

## 🚀 Key Features

* **Tuned Machine Learning Engine:** Utilizes an **XGBoost Classifier** fine-tuned via `GridSearchCV` for optimal multi-class risk classification.
* **Neutral Mean Scaling Engine:** Handles incomplete financial payloads by imputing missing features with training means ($z\text{-score} = 0.0$), preventing model skewing and class-collapse bugs.
* **Case-Insensitive Feature Matching:** Automatically normalizes incoming JSON and CSV column names to ensure seamless mapping against dataset schemas.
* **Bulk Batch Evaluation (`/predict-csv`):** Upload multi-row CSV files via multipart form-data to receive batch risk evaluations and confidence probabilities instantly.
* **AI Underwriter Summaries (`/generate-summary`):** Integrates Google Gemini via the **Google GenAI Interactions API** to translate raw numeric risk factors into concise, human-readable underwriting briefs.
* **Context-Grounded Explanations:** Grounded via a structured `Data_Dictionary.json` mapping to eliminate LLM hallucinations on technical credit variables (e.g., `num_times_30p_dpd`, `pct_currentBal_all_TL`).

---

## 🎯 Risk Classification Matrix

| Tier | Category |
| :--- | :--- |
| **P1** | **Prime / Low Risk** |
| **P2** | **Standard Risk** |
| **P3** | **Subprime / Moderate-High** |
| **P4** | **Severe High Risk** |

---

## 🛠️ Tech Stack

### Machine Learning & Data Processing
* **Language:** Python 3.10+
* **Core Libraries:** `scikit-learn`, `xgboost`, `pandas`, `numpy`, `joblib`
* **Optimization:** `GridSearchCV` (GPU-accelerated training)

### Backend API Infrastructure
* **Framework:** FastAPI (ASGI)
* **Server:** Uvicorn
* **Data Validation:** Pydantic
* **AI Integration:** Google GenAI SDK (`google-genai`), Gemini 3.6 / Interactions API

### Frontend Application
* **Framework & Build Tool:** React 18, Vite

### Cloud Infrastructure & Hosting
* **Backend API:** AWS EC2
* **Frontend Web App:** Vercel

---

## 💻 Getting Started & Execution Guide

### Prerequisites
* **Python 3.10+** (with `pip` and `venv`)
* **Node.js 18+** (with `npm`)
* **Git**

---

### 1. Clone the Repository
```bash
git clone https://github.com/Yaduk035/predictive_credit_risk_modeling.git
cd bank_analytics
```

---

### 2. Backend API Setup (FastAPI)

1. **Navigate to the app directory:**
   ```bash
   cd app
   ```

2. **Create & activate a Python virtual environment:**
   ```bash
   # Linux/macOS:
   python3 -m venv venv
   source venv/bin/activate

   # Windows (Command Prompt):
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **(Optional) Configure Gemini AI Key:**
   Create a `.env` file inside `app/`:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

5. **Start the FastAPI server:**
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   The backend API will run live at `http://localhost:8000`.

---

### 3. Frontend Web App Setup (React + Vite)

1. **Open a new terminal and navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Configure Frontend Environment:**
   Create a `.env` file inside `frontend/`:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. **Start the Vite development server:**
   ```bash
   npm run dev
   ```
   The application will run live at `http://localhost:5173` (or `http://localhost:3001`).