import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Cpu, Code2, Server, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-card-solid)',
      borderTop: '1px solid var(--border-glass)',
      padding: '48px 0 24px',
      color: 'var(--text-muted)',
      transition: 'background-color 0.3s ease, border-color 0.3s ease'
    }}>
      <div className="container-xl">
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '32px', marginBottom: '32px' }}>
          
          {/* Brand */}
          <div style={{ maxWidth: '420px' }}>
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
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                NeoBank<span style={{ color: '#06b6d4' }}>.AI</span>
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-muted)', margin: 0 }}>
              Predictive Credit Risk Engine leveraging machine learning risk classification and AI underwriter synthesis.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{ color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px' }}>
              Platform Navigation
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li><Link to="/" style={linkStyle}>Overview</Link></li>
              <li><Link to="/single" style={linkStyle}>Single Assessment</Link></li>
              <li><Link to="/bulk" style={linkStyle}>Bulk CSV Batch</Link></li>
              <li><Link to="/about" style={linkStyle}>About Project</Link></li>
            </ul>
          </div>

        </div>

        <div style={{
          borderTop: '1px solid var(--border-glass)',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.82rem',
          color: 'var(--text-dim)'
        }}>
          <div>© {new Date().getFullYear()} NeoBank AI Risk Engine. All rights reserved.</div>
          <div>Automated Underwriting & Credit Risk Scoring Platform</div>
        </div>
      </div>
    </footer>
  );
}

const linkStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--text-muted)',
  fontSize: '0.9rem',
  cursor: 'pointer',
  padding: 0,
  textAlign: 'left',
  textDecoration: 'none'
};
