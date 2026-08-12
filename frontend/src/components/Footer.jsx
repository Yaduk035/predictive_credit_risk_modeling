import React from 'react';
import { ShieldCheck, Cpu, Code2, Server, ExternalLink } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer style={{
      background: '#070a12',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '60px 0 30px',
      color: '#94a3b8'
    }}>
      <div className="container-xl">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '40px' }}>
          
          {/* Column 1: Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldCheck size={22} color="#ffffff" />
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                NeoBank<span style={{ color: '#06b6d4' }}>.AI</span>
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#64748b', maxWidth: '360px', marginBottom: '20px' }}>
              Predictive Credit Risk Engine leveraging XGBoost Multi-Class Machine Learning models and Google Gemini 3.6 Flash GenAI underwriter intelligence.
            </p>
            {/* Tech Stack Pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['FastAPI', 'XGBoost', 'Gemini 3.6 Flash', 'Vite React'].map((tech, i) => (
                <span key={i} style={{
                  fontSize: '0.75rem',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#cbd5e1'
                }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px' }}>
              Platform Navigation
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li><button onClick={() => onNavigate('landing')} style={linkBtnStyle}>Overview</button></li>
              <li><button onClick={() => onNavigate('single')} style={linkBtnStyle}>Single Assessment</button></li>
              <li><button onClick={() => onNavigate('bulk')} style={linkBtnStyle}>Bulk CSV Batch</button></li>
              <li><button onClick={() => onNavigate('docs')} style={linkBtnStyle}>API Endpoints</button></li>
            </ul>
          </div>

          {/* Column 3: API Reference */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px' }}>
              FastAPI Endpoints
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
              <li style={{ color: '#34d399' }}>POST /predict</li>
              <li style={{ color: '#38bdf8' }}>POST /predict-csv</li>
              <li style={{ color: '#c084fc' }}>POST /generate-summary</li>
            </ul>
          </div>

          {/* Column 4: System Specs */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px' }}>
              Model Specs
            </h4>
            <div style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#64748b' }}>
              <div>Target Variable: <strong style={{ color: '#cbd5e1' }}>Risk Tier (P1-P4)</strong></div>
              <div>Scaler: <strong style={{ color: '#cbd5e1' }}>StandardScaler (joblib)</strong></div>
              <div>Input Dimensions: <strong style={{ color: '#cbd5e1' }}>80+ Variables</strong></div>
            </div>
          </div>

        </div>

        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.82rem',
          color: '#64748b'
        }}>
          <div>© {new Date().getFullYear()} NeoBank AI Risk Engine. All rights reserved.</div>
          <div>Built with React, Vite & FastAPI</div>
        </div>
      </div>
    </footer>
  );
}

const linkBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#94a3b8',
  fontSize: '0.9rem',
  cursor: 'pointer',
  padding: 0,
  textAlign: 'left'
};
