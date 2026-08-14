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
    <section style={{ position: 'relative', minHeight: 'calc(100vh - 75px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '30px 0', overflow: 'hidden' }}>
      {/* Radial Glow Background Effects */}
      <div className="glow-bg-primary" style={{ top: '-100px', left: '10%' }}></div>
      <div className="glow-bg-indigo" style={{ top: '50px', right: '5%' }}></div>

      <div className="container-xl" style={{ position: 'relative', zIndex: 10 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div>
            {/* Pill Tag */}
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
              marginBottom: '20px'
            }}>
              <Sparkles size={14} color="#38bdf8" />
              <span>underwrite.ai — Next-Gen AI Credit Risk Engine</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-5" style={{ color: 'var(--text-main)' }}>
              Automated Credit Risk & Underwriting with{' '}
              <span className="gradient-text-primary">Machine Learning AI</span>
            </h1>

            <p style={{
              fontSize: '1rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              marginBottom: '28px',
              maxWidth: '560px'
            }}>
              underwrite.ai evaluates loan applicant creditworthiness across 26 key credit bureau variables, assigns 4-tier risk classifications (P1 Prime Safe to P4 High Risk) with Gradient Boosting machine learning, runs single & bulk portfolio predictions, and generates executive AI underwriter summaries.
            </p>

            {/* CTA Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '36px' }}>
              <button onClick={() => navigate('/single')} className="btn-primary" style={{ padding: '12px 22px', fontSize: '0.95rem' }}>
                Single Applicant Risk Check
                <ArrowRight size={18} />
              </button>

              <button onClick={() => navigate('/bulk')} className="btn-secondary" style={{ padding: '12px 22px', fontSize: '0.95rem' }}>
                Batch CSV Prediction
              </button>
            </div>

            {/* Feature Check List */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {['XGBoost ML Risk Scoring', '4-Tier Risk Classification', 'Bulk CSV Batch Engine', 'Executive AI Underwriting'].map((feature, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <CheckCircle2 size={15} color="#34d399" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Hero Visual Card */}
          <div style={{ position: 'relative' }}>
            <div className="glass-panel p-5 sm:p-8 animate-float" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#10b981',
                    boxShadow: '0 0 10px #10b981'
                  }}></div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Real-time Risk Evaluation</span>
                </div>
                <span className="badge-p1" style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                  TIER P1 - SAFE
                </span>
              </div>

              {/* Sample applicant preview box */}
              <div style={{
                background: 'var(--input-bg)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid var(--border-glass)',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>Applicant ID: #NK-89241</span>
                  <span>Confidence: <strong style={{ color: '#34d399' }}>97.8%</strong></span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div style={{ background: 'var(--bg-card)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Monthly Income</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>₹85,000</div>
                  </div>
                  <div style={{ background: 'var(--bg-card)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Delinquency</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399' }}>0 Missed</div>
                  </div>
                  <div style={{ background: 'var(--bg-card)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Active TLs</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>6 Accounts</div>
                  </div>
                </div>
              </div>

              {/* AI Summary Highlight */}
              <div style={{
                background: 'var(--bg-card-solid)',
                border: '1px solid var(--border-glass)',
                borderRadius: '12px',
                padding: '14px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Sparkles size={15} color="#818cf8" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>AI Executive Underwriter Output</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  "Applicant displays strong financial stability with ₹85k Net Monthly Income (NETMONTHLYINCOME) and zero recent delinquencies across active accounts. Recommended for immediate prime interest rate approval."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Metric Stats Banner */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10 sm:mt-14 p-4 sm:p-6" style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-glass)',
          borderRadius: '16px'
        }}>
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={20} color={stat.color} />
                </div>
                <div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 500 }}>
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

