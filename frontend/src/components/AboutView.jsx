import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Bot, 
  Server, 
  Database, 
  Users, 
  Layers, 
  CheckCircle2, 
  ExternalLink,
  Code2,
  Cloud
} from 'lucide-react';

export default function AboutView() {
  const teamMembers = [
    { name: 'Anisha B Nair', github: 'https://github.com/anishabnair' },
    { name: 'Ann Maria', github: 'https://github.com/annmaria' },
    { name: 'Yadukrishna S', github: 'https://github.com/Yaduk035' }
  ];

  const techStack = [
    {
      category: 'Machine Learning & Data Science',
      icon: Cpu,
      color: '#06b6d4',
      items: [
        { name: 'XGBoost Classifier', desc: 'Fine-tuned multi-class gradient boosted decision tree classifier tuned via GridSearchCV.' },
        { name: 'scikit-learn & joblib', desc: 'StandardScaler feature scaling pipeline and serialized model inference persistence.' },
        { name: 'pandas & numpy', desc: 'Data ingestion, Z-score neutral mean imputation, and matrix computations.' }
      ]
    },
    {
      category: 'Generative AI & Explainability',
      icon: Bot,
      color: '#c084fc',
      items: [
        { name: 'Google Gemini 3.6 Flash', desc: 'Large language model utilizing Google GenAI Interactions API for underwriting briefs.' },
        { name: 'Context-Grounded Explanations', desc: 'Structured Data_Dictionary.json grounding to eliminate LLM hallucinations on credit variables.' }
      ]
    },
    {
      category: 'Backend & API Infrastructure',
      icon: Server,
      color: '#6366f1',
      items: [
        { name: 'FastAPI (ASGI)', desc: 'High-speed Python web framework with asynchronous non-blocking request handling.' },
        { name: 'Pydantic Validation', desc: 'Strict runtime data validation and schema enforcement for single and bulk batch requests.' }
      ]
    },
    {
      category: 'Cloud Infrastructure & Hosting',
      icon: Cloud,
      color: '#34d399',
      items: [
        { name: 'AWS EC2', desc: 'Backend FastAPI ASGI server and machine learning model hosting on Amazon Web Services.' },
        { name: 'Vercel', desc: 'High-availability global edge deployment for the React single page application.' }
      ]
    }
  ];

  return (
    <div style={{ padding: '60px 0 100px' }}>
      <div className="container-xl">
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          
          {/* Header Banner */}
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '30px',
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              color: '#38bdf8',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '16px'
            }}>
              <ShieldCheck size={16} color="#38bdf8" />
              <span>Capstone Project Specification</span>
            </div>
            
            <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '16px' }}>
              About Credit Risk Assessment Engine
            </h1>

            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '720px', margin: '0 auto 20px' }}>
              Developed as a capstone project for the <strong>Executive Program in Advanced AI/ML</strong> at <strong>ICT Academy of Kerala</strong>.
            </p>

            <a 
              href="https://github.com/Yaduk035/predictive_credit_risk_modeling"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{
                fontSize: '0.9rem',
                padding: '8px 20px',
                borderColor: 'rgba(56, 189, 248, 0.3)',
                color: '#38bdf8',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none'
              }}
            >
              <span>GitHub Repository</span>
              <ExternalLink size={15} />
            </a>
          </div>

          {/* Project Overview Card */}
          <div className="glass-panel" style={{ padding: '36px', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Layers size={22} color="#06b6d4" />
              System Purpose & Architecture
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.98rem', marginBottom: '20px' }}>
              The Credit Risk Assessment Engine & Compliance Hub is a machine-learning-powered credit scoring and automated underwriting platform. It evaluates loan applicant profiles across 90+ credit metrics (Internal Bank + External CIBIL bureau data), classifies applicants into discrete risk tiers (<strong>P1 to P4</strong>), supports bulk CSV evaluation, and leverages Generative AI (Google Gemini) for automated underwriter briefs and explainability.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-glass)' }}>
              <div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
                  Project Repository
                </div>
                <a 
                  href="https://github.com/Yaduk035/predictive_credit_risk_modeling" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600, fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  GitHub Project Repository
                  <ExternalLink size={14} />
                </a>
              </div>

              <div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
                  Dataset Source
                </div>
                <a 
                  href="https://www.kaggle.com/datasets/saurabhbadole/leading-indian-bank-and-cibil-real-world-dataset" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600, fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  Leading Indian Bank & CIBIL Dataset
                  <ExternalLink size={14} />
                </a>
              </div>

              <div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
                  Institution Program
                </div>
                <span style={{ color: 'var(--text-main)', fontSize: '0.92rem', fontWeight: 600 }}>
                  Executive Program in Advanced AI/ML (ICTAK)
                </span>
              </div>
            </div>
          </div>

          {/* Model & AI Technology Stack */}
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Code2 size={24} color="#6366f1" />
              Detailed Model & Technology Stack
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
              {techStack.map((sec, idx) => {
                const Icon = sec.icon;
                return (
                  <div key={idx} className="glass-panel" style={{ padding: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: `${sec.color}15`,
                        border: `1px solid ${sec.color}30`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icon size={20} color={sec.color} />
                      </div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                        {sec.category}
                      </h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {sec.items.map((item, itemIdx) => (
                        <div key={itemIdx}>
                          <div style={{ fontSize: '0.92rem', fontWeight: 700, color: sec.color, marginBottom: '4px' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                            {item.desc}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team Members Section */}
          <div className="glass-panel" style={{ padding: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={22} color="#fbbf24" />
              Project Team Members
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              {teamMembers.map((member, idx) => (
                <div key={idx} style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                    {member.name}
                  </div>
                  <a 
                    href={member.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      color: '#38bdf8',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    GitHub Profile
                    <ExternalLink size={12} />
                  </a>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
