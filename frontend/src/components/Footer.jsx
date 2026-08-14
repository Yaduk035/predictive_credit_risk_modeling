import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Cpu, Code2, Server, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-card-solid)',
      borderTop: '1px solid var(--border-glass)',
      padding: '36px 0 20px',
      color: 'var(--text-muted)',
      transition: 'background-color 0.3s ease, border-color 0.3s ease'
    }}>
      <div className="container-xl">
        <div className="flex flex-col md:flex-row justify-between gap-6 sm:gap-8 mb-8">
          
          {/* Brand */}
          <div style={{ maxWidth: '420px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldCheck size={20} color="#ffffff" />
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                underwrite<span style={{ color: '#38bdf8' }}>.ai</span>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text-muted)', margin: 0 }}>
              Next-Gen AI Credit Risk Engine leveraging Machine Learning risk classification and executive AI underwriter syntheses.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px' }}>
              Platform Navigation
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
              <li><Link to="/" style={linkStyle}>Overview</Link></li>
              <li><Link to="/single" style={linkStyle}>Single Assessment</Link></li>
              <li><Link to="/bulk" style={linkStyle}>Bulk CSV Batch</Link></li>
              <li><Link to="/about" style={linkStyle}>About Project</Link></li>
            </ul>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-2 pt-4 border-t border-glass text-xs" style={{
          color: 'var(--text-dim)'
        }}>
          <div>© {new Date().getFullYear()} underwrite.ai. All rights reserved.</div>
          <div>Automated Underwriting & Credit Risk Engine</div>
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
