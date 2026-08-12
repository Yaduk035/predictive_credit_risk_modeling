import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  PieChart as PieIcon, 
  BarChart3, 
  FileText,
  Download,
  RefreshCw,
  Zap
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  PieChart, 
  Pie, 
  Legend 
} from 'recharts';

export default function PredictionModal({ isOpen, onClose, result, applicantData }) {
  if (!isOpen || !result) return null;

  const { risk_tier, probability } = result;
  
  // State for manual AI Summary trigger
  const [aiSummary, setAiSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState(null);

  // Reset AI summary state whenever result changes or modal reopens
  useEffect(() => {
    setAiSummary(null);
    setLoadingSummary(false);
    setSummaryError(null);
  }, [result]);

  // Handler to manually fetch AI Summary on button click
  const handleFetchAiSummary = async () => {
    setLoadingSummary(true);
    setSummaryError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/generate-summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          risk_tier: risk_tier,
          probability: probability,
          applicant_data: applicantData
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiSummary(data.ai_summary);
      } else {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.detail || `Server returned status ${response.status}`);
      }
    } catch (err) {
      console.error('AI summary call failed:', err);
      setSummaryError('Unable to reach the server to generate summary. Please try again later.');
    } finally {
      setLoadingSummary(false);
    }
  };

  // Tier metadata styling
  const getTierMeta = (tier) => {
    switch (tier) {
      case 'P1':
        return {
          title: 'Tier P1 - Prime Safe',
          badgeClass: 'badge-p1',
          color: '#10b981',
          glow: 'rgba(16, 185, 129, 0.25)',
          recommendation: 'Immediate Auto-Approval recommended at prime competitive interest rates.',
          riskLevel: 'Very Low Risk (< 5% Default)'
        };
      case 'P2':
        return {
          title: 'Tier P2 - Low / Moderate',
          badgeClass: 'badge-p2',
          color: '#3b82f6',
          glow: 'rgba(59, 130, 246, 0.25)',
          recommendation: 'Auto-Approval recommended at standard lending rates.',
          riskLevel: 'Moderate Risk (5-15% Default)'
        };
      case 'P3':
        return {
          title: 'Tier P3 - Subprime Risk',
          badgeClass: 'badge-p3',
          color: '#f59e0b',
          glow: 'rgba(245, 158, 11, 0.25)',
          recommendation: 'Manual Underwriter Review required. Consider income verification & collateral.',
          riskLevel: 'Elevated Risk (15-35% Default)'
        };
      default:
        return {
          title: 'Tier P4 - High Risk Subprime',
          badgeClass: 'badge-p4',
          color: '#ef4444',
          glow: 'rgba(239, 68, 68, 0.25)',
          recommendation: 'Decline application or require high security collateral deposit.',
          riskLevel: 'High Default Risk (> 35% Default)'
        };
    }
  };

  const tierMeta = getTierMeta(risk_tier);

  // Data for Recharts Trade Line Breakdown
  const tradeLineData = [
    { name: 'Active', count: Number(applicantData.Tot_Active_TL || 0), fill: '#10b981' },
    { name: 'Closed', count: Number(applicantData.Tot_Closed_TL || 0), fill: '#64748b' },
    { name: 'Personal (PL)', count: Number(applicantData.PL_TL || 0), fill: '#3b82f6' },
    { name: 'Credit Cards', count: Number(applicantData.CC_TL || 0), fill: '#06b6d4' },
    { name: 'Secured', count: Number(applicantData.Secured_TL || 0), fill: '#8b5cf6' },
    { name: 'Unsecured', count: Number(applicantData.Unsecured_TL || 0), fill: '#f59e0b' }
  ];

  // Data for Delinquencies & Asset Class
  const deliqData = [
    { name: 'Missed Payments', value: Number(applicantData.Tot_Missed_Pmnt || 0), color: '#ef4444' },
    { name: '30p DPD Times', value: Number(applicantData.num_times_30p_dpd || 0), color: '#f97316' },
    { name: '60p DPD Times', value: Number(applicantData.num_times_60p_dpd || 0), color: '#dc2626' },
    { name: 'Inquiries L6M', value: Number(applicantData.enq_L6m || 0), color: '#fbbf24' }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 8, 15, 0.85)',
      backdropFilter: 'blur(12px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      overflowY: 'auto'
    }}>
      <div 
        className="glass-panel" 
        style={{
          width: '100%',
          maxWidth: '960px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '24px',
          border: `1px solid ${tierMeta.color}40`,
          boxShadow: `0 20px 60px ${tierMeta.glow}`,
          padding: '36px',
          position: 'relative',
          background: '#0e1526'
        }}
      >
        {/* Close Icon Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94a3b8',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <X size={20} />
        </button>

        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: `${tierMeta.color}20`,
            border: `1px solid ${tierMeta.color}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {risk_tier === 'P1' || risk_tier === 'P2' ? (
              <ShieldCheck size={32} color={tierMeta.color} />
            ) : (
              <ShieldAlert size={32} color={tierMeta.color} />
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
                Credit Risk Decision Report
              </h2>
              <span className={tierMeta.badgeClass} style={{ padding: '4px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 800 }}>
                {tierMeta.title}
              </span>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '4px' }}>
              XGBoost Evaluation Score: <strong style={{ color: tierMeta.color }}>{probability}% Confidence</strong> • {tierMeta.riskLevel}
            </div>
          </div>
        </div>

        {/* --- Gemini AI Summary Section with Manual Trigger Button --- */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.12) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={20} color="#c084fc" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#c084fc' }}>
                Gemini 3.6 Flash Underwriter Summary
              </h3>
            </div>

            {aiSummary && (
              <button
                onClick={handleFetchAiSummary}
                disabled={loadingSummary}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <RefreshCw size={14} className={loadingSummary ? 'animate-spin' : ''} />
                Re-generate
              </button>
            )}
          </div>

          {/* Render Condition 1: Not yet fetched -> Show Button */}
          {!aiSummary && !loadingSummary && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', paddingTop: '8px' }}>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: 0, maxWidth: '580px' }}>
                Click below to send applicant metrics to Gemini 3.6 Flash for an automated 3-sentence underwriter synthesis pointing directly to key risk drivers.
              </p>
              <button
                onClick={handleFetchAiSummary}
                className="btn-primary"
                style={{
                  background: 'linear-gradient(135deg, #c084fc 0%, #6366f1 100%)',
                  boxShadow: '0 4px 16px rgba(192, 132, 252, 0.35)',
                  padding: '12px 24px',
                  fontSize: '0.92rem'
                }}
              >
                <Sparkles size={18} color="#ffffff" />
                Generate AI Summary
              </button>
            </div>
          )}

          {/* Render Condition 2: Currently loading */}
          {loadingSummary && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', color: '#c084fc' }}>
              <RefreshCw size={20} className="animate-spin" />
              <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                Querying Gemini 3.6 Flash model with 26 applicant variables...
              </span>
            </div>
          )}

          {/* Render Condition 3: Summary fetched */}
          {aiSummary && !loadingSummary && (
            <p style={{ fontSize: '0.98rem', color: '#f1f5f9', lineHeight: 1.65, margin: 0, fontStyle: 'italic' }}>
              "{aiSummary}"
            </p>
          )}
        </div>

        {/* Grid Charts Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          
          {/* Chart 1: Trade Lines Breakdown */}
          <div style={{
            background: 'rgba(17, 24, 39, 0.6)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <BarChart3 size={18} color="#38bdf8" />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                Bureau Trade Line Portfolio Breakdown
              </h4>
            </div>

            <div style={{ width: '100%', height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tradeLineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} 
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {tradeLineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Delinquencies & Inquiries Breakdown */}
          <div style={{
            background: 'rgba(17, 24, 39, 0.6)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <PieIcon size={18} color="#f59e0b" />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                Delinquency & Risk Indicators
              </h4>
            </div>

            <div style={{ width: '100%', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deliqData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <XAxis type="number" stroke="#64748b" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} width={110} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {deliqData.map((entry, index) => (
                      <Cell key={`deliq-cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Applicant Feature Snapshot Grid */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '20px',
          marginBottom: '28px'
        }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="#34d399" />
            Key Evaluated Financial Metrics
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            <MetricItem label="Monthly Income" value={`$${Number(applicantData.NETMONTHLYINCOME || 0).toLocaleString()}`} />
            <MetricItem label="Applicant Age" value={`${applicantData.AGE || 0} Yrs`} />
            <MetricItem label="Employer Tenure" value={`${applicantData.Time_With_Curr_Empr || 0} Mts`} />
            <MetricItem label="Total Accounts" value={`${applicantData.Total_TL || 0} TLs`} />
            
            <MetricItem label="Missed Payments" value={`${applicantData.Tot_Missed_Pmnt || 0}`} color={Number(applicantData.Tot_Missed_Pmnt) > 0 ? '#ef4444' : '#34d399'} />
            <MetricItem label="30+ Days DPD" value={`${applicantData.num_times_30p_dpd || 0}`} color={Number(applicantData.num_times_30p_dpd) > 0 ? '#ef4444' : '#34d399'} />
            <MetricItem label="Total Bureau Inquiries" value={`${applicantData.tot_enq || 0}`} />
            <MetricItem label="Balance Ratio" value={`${(Number(applicantData.pct_currentBal_all_TL || 0) * 100).toFixed(0)}%`} />
          </div>
        </div>

        {/* Underwriting Recommendation Banner */}
        <div style={{
          background: `${tierMeta.color}15`,
          border: `1px solid ${tierMeta.color}40`,
          borderRadius: '14px',
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: tierMeta.color, fontWeight: 700, textTransform: 'uppercase' }}>
              Policy Underwriting Guidance
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>
              {tierMeta.recommendation}
            </div>
          </div>
          <span className={tierMeta.badgeClass} style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 800 }}>
            {risk_tier} APPROVAL PROFILE
          </span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '12px 24px' }}>
            Close Report
          </button>
          <button 
            onClick={() => window.print()} 
            className="btn-primary" 
            style={{ padding: '12px 24px' }}
          >
            <Download size={16} />
            Export Underwriting Report
          </button>
        </div>

      </div>
    </div>
  );
}

function MetricItem({ label, value, color = '#ffffff' }) {
  return (
    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
      <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: '1rem', fontWeight: 700, color, marginTop: '2px' }}>{value}</div>
    </div>
  );
}
