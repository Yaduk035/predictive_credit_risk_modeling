import React from 'react';
import { Cpu, Bot, Sliders, FileSpreadsheet, Server, Lock } from 'lucide-react';

export default function FeatureHighlights() {
  const features = [
    {
      title: 'Predictive ML Architecture',
      description: 'Trained on comprehensive bureau banking features with robust multi-class probability scoring for precision tier classification.',
      icon: Cpu,
      color: '#06b6d4',
      badge: 'ML Engine'
    },
    {
      title: 'Generative AI Executive Briefs',
      description: 'Generates concise, 3-sentence professional underwriter rationales that pinpoint exact debt, inquiry, and payment triggers.',
      icon: Bot,
      color: '#c084fc',
      badge: 'GenAI Intelligence'
    },
    {
      title: 'Z-Score Feature Imputation',
      description: 'Automated missing variable handling aligns incoming applicant data against training mean Z-scores to ensure zero failed predictions.',
      icon: Sliders,
      color: '#34d399',
      badge: 'Preprocessing'
    },
    {
      title: 'Bulk CSV Batch Processing',
      description: 'Upload CSV datasets with thousands of rows for rapid multi-record inference, featuring live progress and instant tabular output.',
      icon: FileSpreadsheet,
      color: '#fbbf24',
      badge: 'Batch Engine'
    },
    {
      title: 'FastAPI Production Endpoint',
      description: 'High-performance Python ASGI backend with CORS middleware support, async non-blocking prediction endpoints, and JSON schema validation.',
      icon: Server,
      color: '#6366f1',
      badge: 'Backend API'
    },
    {
      title: 'Enterprise Security & Audit',
      description: 'Strict input sanitization, data dictionary mapping, and complete risk scoring audit trails for underwriting compliance.',
      icon: Lock,
      color: '#f43f5e',
      badge: 'Compliance'
    }
  ];

  return (
    <section style={{ position: 'relative', minHeight: 'calc(100vh - 40px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 0', background: 'var(--bg-card-solid)' }}>
      <div className="container-xl">
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 36px' }}>
          <div style={{
            fontSize: '0.85rem',
            color: '#6366f1',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '8px'
          }}>
            Platform Core Architecture
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-4" style={{ color: 'var(--text-main)' }}>
            Built for High-Scale FinTech Underwriting
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Combining state-of-the-art predictive Machine Learning classifiers with Generative AI for automated, interpretable credit decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx}
                className="glass-card p-5 sm:p-7"
                style={{ position: 'relative' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: `${feat.color}15`,
                    border: `1px solid ${feat.color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={22} color={feat.color} />
                  </div>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: feat.color,
                    background: `${feat.color}10`,
                    padding: '4px 10px',
                    borderRadius: '20px',
                    border: `1px solid ${feat.color}25`
                  }}>
                    {feat.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                  {feat.title}
                </h3>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

