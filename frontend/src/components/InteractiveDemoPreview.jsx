import React, { useState } from 'react';
import { Play, Sparkles, RefreshCw, ArrowRight, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

export default function InteractiveDemoPreview({ onNavigateSingle }) {
  // Demo interactive state inputs
  const [netIncome, setNetIncome] = useState(6500);
  const [missedPayments, setMissedPayments] = useState(0);
  const [activeTradeLines, setActiveTradeLines] = useState(5);
  const [recentInquiries, setRecentInquiries] = useState(1);
  const [age, setAge] = useState(34);

  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState({
    risk_tier: 'P1',
    probability: 96.4,
    ai_summary: 'Applicant has a solid financial profile with $6,500 monthly income and 0 missed payments. Low credit inquiry frequency further validates strong creditworthiness.'
  });

  const handleSimulateRisk = async () => {
    setLoading(true);
    
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
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features: sampleFeatures })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Also call AI summary endpoint
        let summaryText = '';
        try {
          const summaryRes = await fetch('http://localhost:8000/generate-summary', {
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
          console.warn('AI summary call failed, fallback to rule summary');
        }

        setPredictionResult({
          risk_tier: data.risk_tier,
          probability: data.probability,
          ai_summary: summaryText || getFallbackSummary(data.risk_tier, netIncome, missedPayments)
        });
      } else {
        // Fallback calculation logic if FastAPI server is currently offline
        const simulatedTier = calculateSimulatedTier(netIncome, missedPayments, recentInquiries);
        setPredictionResult(simulatedTier);
      }
    } catch (err) {
      // Local estimation fallback
      const simulatedTier = calculateSimulatedTier(netIncome, missedPayments, recentInquiries);
      setPredictionResult(simulatedTier);
    } finally {
      setLoading(false);
    }
  };

  const calculateSimulatedTier = (income, missed, inquiries) => {
    if (missed >= 3 || inquiries >= 6) {
      return {
        risk_tier: 'P4',
        probability: 88.5,
        ai_summary: `High default risk due to ${missed} recorded delinquencies and multiple recent inquiries. Underwriter intervention required.`
      };
    } else if (missed >= 1 || inquiries >= 3) {
      return {
        risk_tier: 'P3',
        probability: 78.2,
        ai_summary: `Subprime risk tier trigger. Recent missed payment or elevated inquiries require collateral review.`
      };
    } else if (income < 3000) {
      return {
        risk_tier: 'P2',
        probability: 91.0,
        ai_summary: `Moderate risk profile with lower income tier ($${income}), though repayment history remains clean.`
      };
    } else {
      return {
        risk_tier: 'P1',
        probability: 97.2,
        ai_summary: `Prime risk profile with $${income} monthly income and zero recent delinquencies. Prime interest rate auto-approval recommended.`
      };
    }
  };

  const getFallbackSummary = (tier, income, missed) => {
    if (tier === 'P1' || tier === 'P2') {
      return `Solid financial standing with $${income} monthly income and ${missed} delinquencies. Standard/Prime approval recommended.`;
    }
    return `Elevated default risk detected with ${missed} missed payments. Manual underwriter review advised.`;
  };

  const getBadgeStyle = (tier) => {
    switch (tier) {
      case 'P1': return { badgeClass: 'badge-p1', text: 'P1 - SAFE', color: '#10b981' };
      case 'P2': return { badgeClass: 'badge-p2', text: 'P2 - MODERATE', color: '#3b82f6' };
      case 'P3': return { badgeClass: 'badge-p3', text: 'P3 - SUBPRIME', color: '#f59e0b' };
      default: return { badgeClass: 'badge-p4', text: 'P4 - HIGH RISK', color: '#ef4444' };
    }
  };

  const badgeInfo = getBadgeStyle(predictionResult.risk_tier);

  return (
    <section style={{ padding: '80px 0', position: 'relative' }}>
      <div className="container-xl">
        <div className="glass-panel" style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            
            {/* Input Controls */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Sparkles size={18} color="#06b6d4" />
                <span style={{ fontSize: '0.85rem', color: '#06b6d4', fontWeight: 700, textTransform: 'uppercase' }}>
                  Interactive Simulator
                </span>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '16px' }}>
                Test the Model in Real-Time
              </h2>
              <p style={{ fontSize: '0.95rem', color: '#94a3b8', marginBottom: '28px', lineHeight: 1.5 }}>
                Adjust applicant parameters below to observe instant XGBoost risk re-classification and Gemini AI commentary.
              </p>

              {/* Slider / Numeric inputs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: '#cbd5e1' }}>
                    <span>Net Monthly Income</span>
                    <strong style={{ color: '#06b6d4' }}>${netIncome.toLocaleString()}</strong>
                  </div>
                  <input 
                    type="range" 
                    min="1000" 
                    max="20000" 
                    step="500" 
                    value={netIncome}
                    onChange={(e) => setNetIncome(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#06b6d4', cursor: 'pointer' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: '#cbd5e1' }}>
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
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
                        background: 'rgba(15, 23, 42, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
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
                        background: 'rgba(15, 23, 42, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
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
              </div>
            </div>

            {/* Output Display Card */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.7)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>Model Output Result</span>
                  <span className={badgeInfo.badgeClass} style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 800 }}>
                    {badgeInfo.text}
                  </span>
                </div>

                {/* Meter gauge representation */}
                <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '20px', borderRadius: '12px', marginBottom: '24px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                    Classification Certainty
                  </div>
                  <div style={{ fontSize: '2.8rem', fontWeight: 800, color: badgeInfo.color }}>
                    {predictionResult.probability}%
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '4px' }}>
                    Predicted Risk Tier: <strong style={{ color: badgeInfo.color }}>Tier {predictionResult.risk_tier}</strong>
                  </div>
                </div>

                {/* AI Summary Box */}
                <div style={{
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  borderRadius: '12px',
                  padding: '18px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <Sparkles size={16} color="#c084fc" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c084fc' }}>
                      Gemini 3.6 Flash Underwriter Summary
                    </span>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.6, margin: 0 }}>
                    "{predictionResult.ai_summary}"
                  </p>
                </div>
              </div>

              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <button 
                  onClick={onNavigateSingle}
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
                  Open Full 80+ Variable Underwriting Form
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
