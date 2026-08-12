import React from 'react';
import { Server, Code, FileText, CheckCircle2, ShieldCheck, Database } from 'lucide-react';

export default function DocsView() {
  return (
    <div style={{ padding: '60px 0' }}>
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
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '24px' }}>
            FastAPI Risk Engine Integration Docs
          </h1>

          <div className="glass-panel" style={{ padding: '32px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#38bdf8', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Server size={20} />
              1. Single Evaluation Endpoint (/predict)
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '16px' }}>
              Accepts a JSON dictionary of applicant features. Features are scaled using the trained <code>scaler.pkl</code> and passed to the XGBoost multi-class classifier.
            </p>
            <pre style={{
              background: '#070a12',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#34d399',
              fontSize: '0.85rem',
              overflowX: 'auto',
              fontFamily: 'var(--font-mono)'
            }}>
{`POST http://localhost:8000/predict
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

          <div className="glass-panel" style={{ padding: '32px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fbbf24', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={20} />
              2. Bulk CSV Prediction Endpoint (/predict-csv)
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '16px' }}>
              Accepts a multipart form file upload containing a <code>.csv</code> file. Returns batch evaluation results with appended columns <code>Predicted_Risk_Tier</code> and <code>Confidence_Probability</code>.
            </p>
            <pre style={{
              background: '#070a12',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#fbbf24',
              fontSize: '0.85rem',
              overflowX: 'auto',
              fontFamily: 'var(--font-mono)'
            }}>
{`POST http://localhost:8000/predict-csv
Form-Data: file=@applicants_batch.csv

Response:
{
  "status": "success",
  "total_records": 150,
  "results": [ ... ]
}`}
            </pre>
          </div>

          <div className="glass-panel" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#c084fc', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={20} />
              3. Gemini AI Underwriter Summary (/generate-summary)
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '16px' }}>
              Translates applicant feature keys into plain English via <code>Data_Dictionary.json</code> and prompts Gemini 3.6 Flash for a 3-sentence underwriter synthesis.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
