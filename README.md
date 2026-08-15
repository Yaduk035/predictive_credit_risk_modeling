# 🏦 Credit Risk Assessment Engine & Compliance Hub

A machine-learning-powered credit scoring and automated underwriting platform. This system evaluates loan applicant profiles across 90+ credit metrics (Internal Bank + External CIBIL data), classifies applicants into discrete risk tiers (**P1 to P4**), supports bulk CSV batch evaluations, generates **RAG-Grounded Executive Underwriter Summaries**, and features a dedicated **Interactive RAG AI Policy & Regulatory Chatbot** for real-time compliance co-piloting.

Developed as a capstone project for the **Executive Program in Advanced AI/ML** at **ICT Academy of Kerala**.

---

## 📌 Links & Repositories

- **Frontend:** [underwrite.ai](https://predictive-credit-risk-modeling.vercel.app/)
- **Dataset Source:** [Leading Indian Bank & CIBIL Real-World Dataset](https://www.kaggle.com/datasets/saurabhbadole/leading-indian-bank-and-cibil-real-world-dataset)

---

## 👥 Team Members

- **Anisha B Nair** — [`@Anisha-B-Nair`](https://github.com/Anisha-B-Nair)
- **Ann Maria** — [`@annm-github`](https://github.com/annm-github)
- **Yadukrishna S** — [`@yaduk035`](https://github.com/Yaduk035)

---

## 🚀 Key Features

- **Tuned Machine Learning Engine:** Utilizes an **XGBoost Classifier** fine-tuned via `GridSearchCV` for optimal multi-class risk classification across 89 credit metrics.
- **Neutral Mean Scaling Engine:** Handles incomplete financial payloads by imputing missing features with training means ($z\text{-score} = 0.0$), preventing model skewing and class-collapse bugs.
- **Case-Insensitive Feature Matching:** Automatically normalizes incoming JSON and CSV column names to ensure seamless mapping against dataset schemas.
- **Bulk Batch Evaluation:** Upload multi-row CSV files via multipart form-data to receive batch risk evaluations and confidence probabilities instantly.
- **RAG-Grounded AI Underwriter Summaries:** Generates automated underwriter syntheses by querying **Pinecone** vector database (retrieving relevant clauses from **Credit Policy 2026** and **RBI Digital Lending Guidelines**) paired with Google Gemini LLM for structured policy explainability.
- **Interactive RAG AI Policy Chatbot:** Dedicated real-time conversational chatbot interface (available as a floating assistant overlay and embedded report tab) grounded in 109 Pinecone vector chunk embeddings of official credit policy manuals. Supports interactive Q&A on RBI norms, credit metrics, and risk tier criteria with automated clause citation badges (`📚 Grounding Policy References`), conversation history memory, and domain guardrails.

---

## 🎯 Risk Classification Matrix

| Tier   | Category                     |
| :----- | :--------------------------- |
| **P1** | **Prime / Low Risk**         |
| **P2** | **Standard Risk**            |
| **P3** | **Subprime / Moderate-High** |
| **P4** | **Severe High Risk**         |

---

## 🛠️ Tech Stack

### Machine Learning & Data Processing

- **Environment:** Google Colab
- **Language:** Python 3.10+
- **Core Libraries & Tuning:** `scikit-learn` (`GridSearchCV`), `xgboost`, `pandas`, `numpy`, `joblib`
- **Data Visualization:** `matplotlib`, `seaborn`

### Backend API Infrastructure

- **Framework:** FastAPI (ASGI)
- **Server:** Uvicorn
- **Data Validation:** Pydantic
- **Vector Database & RAG:** Pinecone (Vector database for RAG context retrieval)
- **AI Integration:** Google GenAI SDK (`google-genai`), Gemini 3.6 / Interactions API

### Frontend Application

- **Framework & Build Tool:** React 18, Vite

### Cloud Infrastructure & Hosting

- **Backend API:** AWS EC2
- **Frontend Web App:** Vercel

---

## 💻 Getting Started & Execution Guide

### Prerequisites

#### Machine Learning & Backend API
- **Python 3.10+** (with `pip` package manager and `venv`)
- **Google Gemini API Key** (Required for Generative AI underwriting briefs)
- **Pinecone API Key** (Required for vector database RAG context retrieval)
- **Git**

#### Frontend Web Application
- **Node.js 18+** (with `npm` package manager — required for React + Vite UI)

---

### 1. Clone the Repository

```bash
git clone https://github.com/Yaduk035/predictive_credit_risk_modeling.git
cd predictive_credit_risk_modeling
```

---

### 2. Backend API Setup (FastAPI)

1. **Create & activate a Python virtual environment:**

   ```bash
   # Linux/macOS:
   python3 -m venv env
   source env/bin/activate

   # Windows (Command Prompt):
   python -m venv env
   env\Scripts\activate
   ```

2. **Install Python dependencies:**

   ```bash
   pip install -r requirements-prod.txt
   ```

3. **Navigate to the app directory:**

   ```bash
   cd app
   ```

4. **Configure Environment Variables:**
   Create a `.env` file inside `app/`:

   ```env
   GEMINI_API_KEY=your_google_gemini_api_key
   PINECONE_API_KEY=your_pinecone_api_key
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
   The application will run live at `http://localhost:3000`.

