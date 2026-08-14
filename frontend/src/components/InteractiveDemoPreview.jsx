import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Sparkles, RefreshCw, ArrowRight, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function InteractiveDemoPreview() {
  const navigate = useNavigate();
  // Demo interactive state inputs
  const [netIncome, setNetIncome] = useState(65000);
  const [missedPayments, setMissedPayments] = useState(0);
  const [activeTradeLines, setActiveTradeLines] = useState(5);
  const [recentInquiries, setRecentInquiries] = useState(1);
  const [age, setAge] = useState(34);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [predictionResult, setPredictionResult] = useState({
    risk_tier: 'P1',
    probability: 96.4,
    ai_summary: 'Applicant has a solid financial profile with ₹65,000 monthly income and 0 missed payments. Low credit inquiry frequency further validates strong creditworthiness.'
  });

  const handleSimulateRisk = async () => {
    setLoading(true);
    setError(null);
    
    // Prepare test payload matching features expected by backend
    const sampleFeatures = {
      NETMONTHLYINCOME: Number(netIncome),
      Tot_Missed_Pmnt: Number(missedPayments),
      Tot_Active_TL: Number(activeTradeLines),
      tot_enq: Number(recentInquiries),
      AGE: Number(age),
      Total_TL: Number(activeTradeLines) + 3,
      Tot_Closed_TL: 3,
      pct_active_tl: 0.62,
      num_times_delinquent: Number(missedPayments) > 0 ? 1 : 0
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features: sampleFeatures })
      });

      if (response.ok) {
        const data = await response.json();
        
        let summaryText = '';
        try {
          const summaryRes = await fetch(`${API_BASE_URL}/api/generate-summary`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              risk_tier: data.risk_tier,
              probability: data.probability,
              applicant_data: sampleFeatures
            })
          });
          if (summaryRes.ok) {
            const summaryData = await summaryRes.json();
            summaryText = summaryData.ai_summary;
          }
        } catch (e) {
          console.warn('AI summary call issue:', e);
        }

        setPredictionResult({
          risk_tier: data.risk_tier,
          probability: data.probability,
          ai_summary: summaryText || 'API prediction complete.'
        });
      } else {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Server returned status ${response.status}`);
      }
    } catch (err) {
      console.error('Prediction API call failed:', err);
      setError('Unable to reach the server. Please try again later.');
      setPredictionResult(null);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeStyle = (tier) => {
    switch (tier) {
      case 'P1': return { badgeClass: 'badge-p1', text: 'P1 - SAFE', color: '#10b981' };
      case 'P2': return { badgeClass: 'badge-p2', text: 'P2 - MODERATE', color: '#3b82f6' };
      case 'P3': return { badgeClass: 'badge-p3', text: 'P3 - SUBPRIME', color: '#f59e0b' };
      default: return { badgeClass: 'badge-p4', text: 'P4 - HIGH RISK', color: '#ef4444' };
    }
  };

  const badgeInfo = predictionResult ? getBadgeStyle(predictionResult.risk_tier) : null;

  return (
    <section style={{ position: 'relative', minHeight: 'calc(100vh - 40px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 0' }}>
      <div className="container-xl">
        <div className="glass-panel p-5 sm:p-10" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            
            {/* Input Controls */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Sparkles size={18} color="#06b6d4" />
                <span style={{ fontSize: '0.85rem', color: '#06b6d4', fontWeight: 700, textTransform: 'uppercase' }}>
                  Interactive Simulator
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-4" style={{ color: 'var(--text-main)' }}>
                Test the Model in Real-Time
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '28px', lineHeight: 1.5 }}>
                Adjust applicant parameters below to observe instant AI risk re-classification and underwriting commentary.
              </p>

              {/* Slider / Numeric inputs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <span>Net Monthly Income</span>
                    <strong style={{ color: '#06b6d4' }}>₹{netIncome.toLocaleString()}</strong>
                  </div>
                  <input 
                    type="range" 
                    min="10000" 
                    max="250000" 
                    step="5000" 
                    value={netIncome}
                    onChange={(e) => setNetIncome(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#06b6d4', cursor: 'pointer' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <span>Total Missed Payments (Delinquency)</span>
                    <strong style={{ color: missedPayments > 0 ? '#ef4444' : '#34d399' }}>{missedPayments} payments</strong>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="6" 
                    step="1" 
                    value={missedPayments}
                    onChange={(e) => setMissedPayments(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#ef4444', cursor: 'pointer' }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      Active Trade Lines
                    </label>
                    <input 
                      type="number"
                      value={activeTradeLines}
                      onChange={(e) => setActiveTradeLines(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        background: 'var(--input-bg)',
                        border: '1px solid var(--border-glass)',
                        color: 'var(--text-main)',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      Recent Inquiries (12M)
                    </label>
                    <input 
                      type="number"
                      value={recentInquiries}
                      onChange={(e) => setRecentInquiries(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        background: 'var(--input-bg)',
                        border: '1px solid var(--border-glass)',
                        color: 'var(--text-main)',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>
                </div>

                <button 
                  onClick={handleSimulateRisk}
                  disabled={loading}
                  className="btn-primary" 
                  style={{ width: '100%', justifyContent: 'center', marginTop: '12px', padding: '14px' }}
                >
                  {loading ? <RefreshCw className="animate-spin" size={18} /> : <Play size={18} />}
                  {loading ? 'Evaluating Model...' : 'Execute Risk Prediction'}
                </button>

                {error && (
                  <div style={{
                    marginTop: '14px',
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#f87171',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.88rem'
                  }}>
                    <AlertCircle size={18} color="#f87171" style={{ flexShrink: 0 }} />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Output Display Card */}
            <div className="p-5 sm:p-7" style={{
              background: 'var(--bg-card)',
              borderRadius: '16px',
              border: '1px solid var(--border-glass)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              {error ? (
                <div style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#f87171',
                  padding: '20px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '0.95rem'
                }}>
                  <AlertCircle size={24} color="#f87171" style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              ) : predictionResult ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Model Output Result</span>
                    <span className={badgeInfo.badgeClass} style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 800 }}>
                      {badgeInfo.text}
                    </span>
                  </div>

                  {/* Meter gauge representation */}
                  <div style={{ background: 'var(--input-bg)', padding: '20px', borderRadius: '12px', marginBottom: '24px', textAlign: 'center', border: '1px solid var(--border-glass)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                      Classification Certainty
                    </div>
                    <div className="text-3xl sm:text-4xl font-extrabold" style={{ color: badgeInfo.color }}>
                      {predictionResult.probability}%
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Predicted Risk Tier: <strong style={{ color: badgeInfo.color }}>Tier {predictionResult.risk_tier}</strong>
                    </div>
                  </div>

                  {/* AI Summary Box */}
                  <div style={{
                    background: 'var(--bg-card-solid)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '12px',
                    padding: '18px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <Sparkles size={16} color="#818cf8" />
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        Executive AI Underwriter Summary
                      </span>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.6, margin: 0 }}>
                      "{predictionResult.ai_summary}"
                    </p>
                  </div>
                </div>
              ) : null}

              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-glass)' }}>
                <button 
                  onClick={() => navigate('/single')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#38bdf8',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  Open Full Underwriting Assessment Form
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

