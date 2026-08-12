import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldAlert, Sparkles, Zap, CheckCircle2, TrendingUp, Layers } from 'lucide-react';

export default function HeroSection() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Model ROC-AUC Score', value: '98.4%', icon: TrendingUp, color: '#34d399' },
    { label: 'Inference Latency', value: '< 45ms', icon: Zap, color: '#38bdf8' },
    { label: 'Risk Tiers Evaluated', value: 'P1 - P4', icon: Layers, color: '#fbbf24' },
    { label: 'AI Underwriter Insight', value: 'Generative AI', icon: Sparkles, color: '#c084fc' },
  ];

  return (
    <section style={{ position: 'relative', padding: '80px 0 60px', overflow: 'hidden' }}>
      {/* Radial Glow Background Effects */}
      <div className="glow-bg-primary" style={{ top: '-100px', left: '10%' }}></div>
      <div className="glow-bg-indigo" style={{ top: '50px', right: '5%' }}></div>

      <div className="container-xl" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '48px', alignItems: 'center' }}>
          
          {/* Left Column: Text & CTAs */}
          <div>
            {/* Pill Tag */}
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
              marginBottom: '24px'
            }}>
              <Sparkles size={15} color="#38bdf8" />
              <span>Next-Gen Machine Learning & GenAI Underwriting</span>
            </div>

            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '24px',
              color: 'var(--text-main)'
            }}>
              Predictive Credit Risk Engine with{' '}
              <span className="gradient-text-primary">ML & Generative AI</span>
            </h1>

            <p style={{
              fontSize: '1.15rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              marginBottom: '36px',
              maxWidth: '560px'
            }}>
              Instantly evaluate applicant creditworthiness across key credit bureau metrics. Get precise risk tier categorization (P1–P4) paired with automated executive AI underwriting commentary.
            </p>

            {/* CTA Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' }}>
              <button onClick={() => navigate('/single')} className="btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
                Single Applicant Risk Check
                <ArrowRight size={18} />
              </button>

              <button onClick={() => navigate('/bulk')} className="btn-secondary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
                Batch CSV Prediction
              </button>
            </div>

            {/* Feature Check List */}
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              {['Automated Feature Scaling', 'Real-time FastAPI Backend', 'Subprime Risk Alerts'].map((feature, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <CheckCircle2 size={16} color="#34d399" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Hero Visual Card */}
          <div style={{ position: 'relative' }}>
            <div className="glass-panel animate-float" style={{ padding: '32px', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: '#10b981',
                    boxShadow: '0 0 10px #10b981'
                  }}></div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Real-time Risk Evaluation</span>
                </div>
                <span className="badge-p1" style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
                  TIER P1 - SAFE
                </span>
              </div>

              {/* Sample applicant preview box */}
              <div style={{
                background: 'var(--input-bg)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid var(--border-glass)',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span>Applicant ID: #NK-89241</span>
                  <span>Confidence: <strong style={{ color: '#34d399' }}>97.8%</strong></span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div style={{ background: 'var(--bg-card)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Monthly Income</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>$8,500</div>
                  </div>
                  <div style={{ background: 'var(--bg-card)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Delinquency</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399' }}>0 Missed</div>
                  </div>
                  <div style={{ background: 'var(--bg-card)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Active TLs</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>6 Accounts</div>
                  </div>
                </div>
              </div>

              {/* AI Summary Highlight */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Sparkles size={16} color="#c084fc" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c084fc' }}>AI Executive Underwriter Output</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5, margin: 0 }}>
                  "Applicant displays strong financial stability with $8.5k monthly income and zero recent delinquencies across active accounts. Recommended for immediate prime interest rate approval."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Metric Stats Banner */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginTop: '64px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-glass)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={24} color={stat.color} />
                </div>
                <div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 500 }}>
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
