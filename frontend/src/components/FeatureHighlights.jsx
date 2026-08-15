import React from 'react';
import { Cpu, Bot, Sliders, FileSpreadsheet, Server, Lock } from 'lucide-react';

export default function FeatureHighlights() {
  const features = [
    {
      title: 'XGBoost ML Credit Scoring Engine',
      description: 'Multi-class Machine Learning model evaluating 26 credit bureau metrics to classify applicants into 4 distinct risk tiers (P1 Prime Safe to P4 High Risk).',
      icon: Cpu,
      color: '#06b6d4',
      badge: 'ML Engine'
    },
    {
      title: 'RAG-Grounded AI Underwriter Summaries',
      description: 'Generates automated executive underwriter syntheses explicitly pairing human-readable variable descriptions with raw bureau codes grounded in Pinecone vector policy context.',
      icon: Bot,
      color: '#c084fc',
      badge: 'RAG Summary'
    },
    {
      title: 'Interactive RAG AI Policy Chatbot',
      description: 'Real-time conversational chatbot interface (floating overlay & report tab) powered by Pinecone vector search over Credit Policy 2026 & RBI guidelines with automated clause citation badges.',
      icon: Bot,
      color: '#38bdf8',
      badge: 'RAG Chatbot'
    },
    {
      title: 'Bulk CSV Portfolio Analytics',
      description: 'Decoupled batch upload engine with interactive Recharts pie charts, CSV prediction export, and on-demand Batch Portfolio AI Synthesis.',
      icon: FileSpreadsheet,
      color: '#fbbf24',
      badge: 'Batch Engine'
    },
    {
      title: 'Data Dictionary Integration',
      description: 'Mapped 90+ credit bureau features directly from dictionary metadata to translate complex codes like Tot_Closed_TL into clear human terms.',
      icon: Sliders,
      color: '#34d399',
      badge: 'Dictionary Mapping'
    },
    {
      title: 'Z-Score Neutral Imputation',
      description: 'Automated missing variable handling aligns missing applicant fields against training mean Z-scores to guarantee zero failed evaluations.',
      icon: Server,
      color: '#6366f1',
      badge: 'Robustness'
    },
    {
      title: 'FastAPI Production Endpoint',
      description: 'High-performance Python ASGI backend with CORS middleware support, API rate limit protection, and real-time JSON validation.',
      icon: Lock,
      color: '#f43f5e',
      badge: 'API Backend'
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
            underwrite.ai Capabilities
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-4" style={{ color: 'var(--text-main)' }}>
            Institutional Credit Risk & Underwriting Platform
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Combining machine learning risk tier scoring with AI underwriter syntheses for transparent, high-speed credit decisioning.
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

