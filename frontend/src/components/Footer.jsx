import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Cpu, Code2, Server, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: '#070a12',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '60px 0 30px',
      color: '#94a3b8'
    }}>
      <div className="container-xl">
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px', marginBottom: '40px' }}>
          
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
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                NeoBank<span style={{ color: '#06b6d4' }}>.AI</span>
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#64748b', margin: 0 }}>
              Predictive Credit Risk Engine leveraging machine learning risk classification and AI underwriter synthesis.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px' }}>
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
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.82rem',
          color: '#64748b'
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
  color: '#94a3b8',
  fontSize: '0.9rem',
  cursor: 'pointer',
  padding: 0,
  textAlign: 'left',
  textDecoration: 'none'
};
