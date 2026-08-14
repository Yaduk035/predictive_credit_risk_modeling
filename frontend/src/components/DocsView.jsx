import React from 'react';
import { Server, Code, FileText, CheckCircle2, ShieldCheck, Database } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function DocsView() {
  return (
    <div style={{ padding: '36px 0 60px' }}>
      <div className="container-xl">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            fontSize: '0.85rem',
            color: '#06b6d4',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '8px'
          }}>
            Technical Architecture & API Reference
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold mb-6" style={{ color: '#ffffff' }}>
            FastAPI Risk Engine Integration Docs
          </h1>

          <div className="glass-panel p-5 sm:p-8 mb-6">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#38bdf8', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <Server size={18} />
              1. Single Evaluation Endpoint (/api/predict)
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '16px' }}>
              Accepts a JSON dictionary of applicant features. Features are scaled using the trained <code>scaler.pkl</code> and passed to the XGBoost multi-class classifier.
            </p>
            <pre className="table-scroll-wrapper" style={{
              background: '#070a12',
              padding: '14px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#34d399',
              fontSize: '0.82rem',
              fontFamily: 'var(--font-mono)'
            }}>
{`POST ${API_BASE_URL}/api/predict
Content-Type: application/json

{
  "features": {
    "NETMONTHLYINCOME": 7500,
    "Tot_Missed_Pmnt": 0,
    "Tot_Active_TL": 6,
    "AGE": 32,
    "tot_enq": 1
  }
}

Response:
{
  "status": "success",
  "risk_tier": "P1",
  "probability": 97.45
}`}
            </pre>
          </div>

          <div className="glass-panel p-5 sm:p-8 mb-6">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fbbf24', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <Database size={18} />
              2. Bulk CSV Prediction Endpoint (/api/predict-csv)
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '16px' }}>
              Accepts a multipart form file upload containing a <code>.csv</code> file. Returns batch evaluation results with appended columns <code>Predicted_Risk_Tier</code> and <code>Confidence_Probability</code>.
            </p>
            <pre className="table-scroll-wrapper" style={{
              background: '#070a12',
              padding: '14px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#fbbf24',
              fontSize: '0.82rem',
              fontFamily: 'var(--font-mono)'
            }}>
{`POST ${API_BASE_URL}/api/predict-csv
Form-Data: file=@applicants_batch.csv

Response:
{
  "status": "success",
  "total_records": 150,
  "results": [ ... ]
}`}
            </pre>
          </div>

          <div className="glass-panel p-5 sm:p-8">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#c084fc', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <FileText size={18} />
              3. Gemini AI Underwriter Summary (/api/generate-summary)
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '16px' }}>
              Translates applicant feature keys into plain English via <code>Data_Dictionary.json</code> and prompts Gemini 3.6 Flash for a 3-sentence underwriter synthesis.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

