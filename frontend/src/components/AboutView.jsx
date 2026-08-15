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
    { name: 'Anisha B Nair', github: 'https://github.com/Anisha-B-Nair' },
    { name: 'Ann Maria', github: 'https://github.com/annm-github' },
    { name: 'Yadukrishna S', github: 'https://github.com/Yaduk035' }
  ];

  const techStack = [
    {
      category: 'Machine Learning & Data Science',
      icon: Cpu,
      color: '#06b6d4',
      items: [
        { name: 'Google Colab', desc: 'Cloud Jupyter Notebook environment used for model training and hyperparameter optimization.' },
        { name: 'XGBoost Classifier', desc: 'Fine-tuned multi-class gradient boosted decision tree classifier tuned via GridSearchCV.' },
        { name: 'scikit-learn & joblib', desc: 'StandardScaler feature scaling pipeline, GridSearchCV tuning, and serialized model inference persistence.' },
        { name: 'pandas, numpy, matplotlib & seaborn', desc: 'Data ingestion, Z-score neutral mean imputation, matrix computations, and EDA visualizations.' }
      ]
    },
    {
      category: 'Generative AI & RAG Explainability',
      icon: Bot,
      color: '#c084fc',
      items: [
        { name: 'Pinecone Vector Database & RAG', desc: 'Vector database for Retrieval-Augmented Generation (RAG) retrieving context from official RBI policy PDFs.' },
        { name: 'Google Gemini 3.6 / Interactions API', desc: 'Large language model utilizing Google GenAI SDK for automated underwriting briefs.' },
        { name: 'Context-Grounded Explanations', desc: 'Structured Data_Dictionary.json mapping and RBI compliance context grounding to eliminate LLM hallucinations on credit variables.' }
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
    <div style={{ padding: '36px 0 80px' }}>
      <div className="container-xl">
        
        {/* Header Banner */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '30px',
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              color: '#38bdf8',
              fontSize: '0.8rem',
              fontWeight: 600,
              marginBottom: '14px'
            }}>
              <ShieldCheck size={16} color="#38bdf8" />
              <span>Capstone Project Specification</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-extrabold mb-4" style={{ color: 'var(--text-main)' }}>
              About underwrite.ai Platform
            </h1>

            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '720px', margin: '0 auto 18px' }}>
              Developed as a capstone project for the <strong>Executive Program in Advanced AI/ML</strong> at <strong>ICT Academy of Kerala</strong>.
            </p>

            <a 
              href="https://github.com/Yaduk035/predictive_credit_risk_modeling"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{
                fontSize: '0.88rem',
                padding: '8px 18px',
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
          <div className="glass-panel p-5 sm:p-9 mb-8">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Layers size={22} color="#06b6d4" />
              System Purpose & Architecture
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.65, fontSize: '0.95rem', marginBottom: '18px' }}>
              The Credit Risk Assessment Engine & Compliance Hub is a machine-learning-powered credit scoring and automated underwriting platform. It evaluates loan applicant profiles across 90+ credit metrics (Internal Bank + External CIBIL bureau data), classifies applicants into discrete risk tiers (<strong>P1 to P4</strong>), supports bulk CSV evaluation, and leverages Generative AI (Google Gemini) combined with <strong>Pinecone RAG</strong> (Retrieval-Augmented Generation using official RBI policy PDFs) for automated underwriter briefs and regulatory explainability.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4" style={{ borderTop: '1px solid var(--border-glass)' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                  Project Repository
                </div>
                <a 
                  href="https://github.com/Yaduk035/predictive_credit_risk_modeling" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600, fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  GitHub Project Repository
                  <ExternalLink size={14} />
                </a>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                  Dataset Source
                </div>
                <a 
                  href="https://www.kaggle.com/datasets/saurabhbadole/leading-indian-bank-and-cibil-real-world-dataset" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600, fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  Leading Indian Bank & CIBIL Dataset
                  <ExternalLink size={14} />
                </a>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                  Institution Program
                </div>
                <span style={{ color: 'var(--text-main)', fontSize: '0.88rem', fontWeight: 600 }}>
                  Executive Program in Advanced AI/ML (ICTAK)
                </span>
              </div>
            </div>
          </div>

          {/* Model & AI Technology Stack */}
          <div style={{ marginBottom: '40px' }}>
            <h2 className="text-xl sm:text-2xl font-extrabold mb-5" style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Code2 size={24} color="#6366f1" />
              Detailed Model & Technology Stack
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {techStack.map((sec, idx) => {
                const Icon = sec.icon;
                return (
                  <div key={idx} className="glass-panel p-5 sm:p-7">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: `${sec.color}15`,
                        border: `1px solid ${sec.color}30`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Icon size={20} color={sec.color} />
                      </div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                        {sec.category}
                      </h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {sec.items.map((item, itemIdx) => (
                        <div key={itemIdx}>
                          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: sec.color, marginBottom: '2px' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
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
          <div className="glass-panel p-5 sm:p-9">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={22} color="#fbbf24" />
              Project Team Members
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {teamMembers.map((member, idx) => (
                <div key={idx} style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                    {member.name}
                  </div>
                  <a 
                    href={member.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      color: '#38bdf8',
                      textDecoration: 'none',
                      fontSize: '0.82rem',
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
  );
}

