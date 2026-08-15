import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { FEATURE_CONFIGS } from '../config/featureConfigs';
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
  Zap,
  Bot,
  Layers,
  Search,
  MessageSquare,
  ChevronRight,
  BookOpen,
  AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from 'recharts';
import RAGChatOverlay from './RAGChatOverlay';

export default function PredictionModal({ isOpen, onClose, result, applicantData }) {
  if (!isOpen || !result) return null;

  const { risk_tier, probability } = result;

  // Active Tab state: 'overview' | 'summary' | 'audit'
  const [activeTab, setActiveTab] = useState('overview');
  
  // State for AI Summary (manual trigger only)
  const [aiSummary, setAiSummary] = useState(null);
  const [policyCitations, setPolicyCitations] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState(null);

  // State for RAG Chat Overlay
  const [chatOpen, setChatOpen] = useState(false);
  const [chatExternalPrompt, setChatExternalPrompt] = useState(null);

  // Search term for Audit Grid
  const [auditSearch, setAuditSearch] = useState('');

  // Reset state when modal opens or result changes
  useEffect(() => {
    setActiveTab('overview');
    setAiSummary(null);
    setPolicyCitations([]);
    setLoadingSummary(false);
    setSummaryError(null);
    setChatOpen(false);
    setChatExternalPrompt(null);
    setAuditSearch('');
  }, [result, isOpen]);

  // Handler to manually fetch AI Summary on button click
  const handleFetchAiSummary = async () => {
    setLoadingSummary(true);
    setSummaryError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-summary`, {
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
        setPolicyCitations(data.policy_citations || []);
      } else {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.detail || `Server returned status ${response.status}`);
      }
    } catch (err) {
      console.error('AI summary call failed:', err);
      setSummaryError(err.message || 'Failed to generate AI summary.');
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
          color: '#10b981',
          bgGlow: 'rgba(16, 185, 129, 0.15)',
          borderColor: 'rgba(16, 185, 129, 0.35)',
          recommendation: 'Immediate Auto-Approval recommended at prime competitive rates.',
          decisionStatus: 'APPROVED (PRIME)',
          decisionIcon: ShieldCheck
        };
      case 'P2':
        return {
          title: 'Tier P2 - Standard Moderate',
          color: '#3b82f6',
          bgGlow: 'rgba(59, 130, 246, 0.15)',
          borderColor: 'rgba(59, 130, 246, 0.35)',
          recommendation: 'Auto-Approval recommended at standard lending rates.',
          decisionStatus: 'APPROVED (STANDARD)',
          decisionIcon: ShieldCheck
        };
      case 'P3':
        return {
          title: 'Tier P3 - Subprime Risk',
          color: '#f59e0b',
          bgGlow: 'rgba(245, 158, 11, 0.15)',
          borderColor: 'rgba(245, 158, 11, 0.35)',
          recommendation: 'Manual Underwriter Review required. Consider income verification & collateral.',
          decisionStatus: 'MANUAL REVIEW REQUIRED',
          decisionIcon: ShieldAlert
        };
      default:
        return {
          title: 'Tier P4 - Severe High Risk',
          color: '#ef4444',
          bgGlow: 'rgba(239, 68, 68, 0.15)',
          borderColor: 'rgba(239, 68, 68, 0.35)',
          recommendation: 'Decline application or require high security collateral deposit.',
          decisionStatus: 'HIGH RISK (DECLINE)',
          decisionIcon: AlertTriangle
        };
    }
  };

  const tierMeta = getTierMeta(risk_tier);
  const DecisionIcon = tierMeta.decisionIcon;

  // Recharts Trade Line Data
  const tradeLineData = [
    { name: 'Active', count: Number(applicantData.Tot_Active_TL || 0), fill: '#10b981' },
    { name: 'Closed', count: Number(applicantData.Tot_Closed_TL || 0), fill: '#64748b' },
    { name: 'Personal', count: Number(applicantData.PL_TL || 0), fill: '#3b82f6' },
    { name: 'Cards', count: Number(applicantData.CC_TL || 0), fill: '#06b6d4' },
    { name: 'Secured', count: Number(applicantData.Secured_TL || 0), fill: '#8b5cf6' },
    { name: 'Unsecured', count: Number(applicantData.Unsecured_TL || 0), fill: '#f59e0b' }
  ];

  // Recharts Delinquency & Risk Indicators Data
  const deliqData = [
    { name: 'Missed Payments', value: Number(applicantData.Tot_Missed_Pmnt || 0), fill: '#ef4444' },
    { name: '30p DPD Times', value: Number(applicantData.num_times_30p_dpd || 0), fill: '#f97316' },
    { name: '60p DPD Times', value: Number(applicantData.num_times_60p_dpd || 0), fill: '#dc2626' },
    { name: 'Inquiries (L6M)', value: Number(applicantData.enq_L6m || 0), fill: '#fbbf24' }
  ];

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-3 sm:p-6 select-none animate-fadeIn"
      style={{
        zIndex: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div 
        className="w-full flex flex-col overflow-hidden shadow-2xl relative"
        style={{
          width: 'min(960px, 95vw)',
          height: 'min(840px, 92vh)',
          borderRadius: '24px',
          background: 'var(--bg-card-solid)',
          border: '1px solid var(--border-glass-hover)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(99, 102, 241, 0.15)',
          color: 'var(--text-main)'
        }}
      >
        {/* Modal Top Navigation Bar */}
        <div 
          className="px-5 py-4 flex items-center justify-between shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.12) 100%)',
            borderBottom: '1px solid var(--border-glass)'
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: tierMeta.bgGlow,
                border: `1px solid ${tierMeta.borderColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: tierMeta.color
              }}
            >
              <DecisionIcon size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-wide" style={{ color: 'var(--text-main)', margin: 0 }}>
                  Credit Risk Assessment Report
                </h2>
                <span 
                  className="text-[11px] px-2.5 py-0.5 rounded-full font-bold"
                  style={{
                    background: tierMeta.bgGlow,
                    border: `1px solid ${tierMeta.borderColor}`,
                    color: tierMeta.color
                  }}
                >
                  {tierMeta.title}
                </span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)', margin: 0 }}>
                Prospect ID: #UP-2026-981 • Model Evaluation Scorecard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 text-white"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)'
              }}
            >
              <Bot size={15} />
              <span>Ask AI Assistant</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl transition-colors hover:bg-white/10"
              style={{ color: 'var(--text-muted)' }}
              title="Close Report"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 3 Tab Switcher Bar */}
        <div 
          className="px-5 py-2.5 flex items-center gap-2 shrink-0 border-b border-white/10"
          style={{ background: 'var(--input-bg)' }}
        >
          <button
            onClick={() => setActiveTab('overview')}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
            style={
              activeTab === 'overview'
                ? { background: 'var(--bg-card-solid)', border: '1px solid var(--border-glass-hover)', color: '#38bdf8' }
                : { color: 'var(--text-muted)', background: 'transparent' }
            }
          >
            <BarChart3 size={14} /> Executive Overview
          </button>

          <button
            onClick={() => setActiveTab('summary')}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
            style={
              activeTab === 'summary'
                ? { background: 'var(--bg-card-solid)', border: '1px solid var(--border-glass-hover)', color: '#a855f7' }
                : { color: 'var(--text-muted)', background: 'transparent' }
            }
          >
            <Sparkles size={14} /> AI Policy Summary {aiSummary && "✓"}
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
            style={
              activeTab === 'audit'
                ? { background: 'var(--bg-card-solid)', border: '1px solid var(--border-glass-hover)', color: '#10b981' }
                : { color: 'var(--text-muted)', background: 'transparent' }
            }
          >
            <Layers size={14} /> Full 89-Metric Audit
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'overview' && (
            /* TAB 1: EXECUTIVE OVERVIEW */
            <div className="flex flex-col gap-5">
              
              {/* Risk Scorecard Banner */}
              <div 
                className="p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                style={{
                  background: tierMeta.bgGlow,
                  border: `1px solid ${tierMeta.borderColor}`
                }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-extrabold uppercase tracking-wider" style={{ color: tierMeta.color }}>
                      {tierMeta.decisionStatus}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold" style={{ color: 'var(--text-main)', margin: 0 }}>
                    {tierMeta.title}
                  </h3>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)', margin: 0 }}>
                    {tierMeta.recommendation}
                  </p>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span className="text-3xl font-black" style={{ color: tierMeta.color }}>
                    {probability}%
                  </span>
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                    Model Confidence Score
                  </span>
                </div>
              </div>

              {/* Action Banners for AI Summary & AI Assistant */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* AI Executive Summary Trigger Card */}
                <div 
                  className="p-4 rounded-2xl border flex flex-col justify-between gap-3 group transition-all"
                  style={{
                    background: 'var(--input-bg)',
                    borderColor: 'var(--border-glass)'
                  }}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles size={16} className="text-purple-400" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white margin-0">
                        AI Executive Summary
                      </h4>
                    </div>
                    <p className="text-xs text-gray-400 margin-0">
                      Generate a detailed credit policy analysis grounded in RBI guidelines.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('summary');
                      if (!aiSummary) handleFetchAiSummary();
                    }}
                    className="w-full py-2 px-3 rounded-xl text-xs font-bold text-white flex items-center justify-between transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)'
                    }}
                  >
                    <span>{aiSummary ? 'View Generated Summary' : '⚡ Generate AI Summary'}</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                {/* AI Assistant RAG Chatbot Trigger Card */}
                <div 
                  className="p-4 rounded-2xl border flex flex-col justify-between gap-3 group transition-all"
                  style={{
                    background: 'var(--input-bg)',
                    borderColor: 'var(--border-glass)'
                  }}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Bot size={16} className="text-indigo-400" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white margin-0">
                        RAG AI Policy Chatbot
                      </h4>
                    </div>
                    <p className="text-xs text-gray-400 margin-0">
                      Query internal bank policy manuals or CIBIL metric definitions.
                    </p>
                  </div>

                  <button
                    onClick={() => setChatOpen(true)}
                    className="w-full py-2 px-3 rounded-xl text-xs font-bold text-white flex items-center justify-between transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)'
                    }}
                  >
                    <span>💬 Open AI Policy Assistant</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Key Evaluated Financial Metrics (8 Cards) */}
              <div 
                className="p-5 rounded-2xl flex flex-col gap-3"
                style={{
                  background: 'var(--input-bg)',
                  border: '1px solid var(--border-glass)'
                }}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-main)', margin: 0 }}>
                    Key Evaluated Financial Metrics
                  </h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl border border-white/5 bg-white/5 flex flex-col">
                    <span className="text-[11px] text-gray-400">Monthly Income</span>
                    <span className="text-sm font-bold text-cyan-400 mt-0.5">₹{Number(applicantData.NETMONTHLYINCOME || 0).toLocaleString()}</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-white/5 bg-white/5 flex flex-col">
                    <span className="text-[11px] text-gray-400">Applicant Age</span>
                    <span className="text-sm font-bold text-indigo-400 mt-0.5">{applicantData.AGE || 0} Yrs</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-white/5 bg-white/5 flex flex-col">
                    <span className="text-[11px] text-gray-400">Employer Tenure</span>
                    <span className="text-sm font-bold text-indigo-400 mt-0.5">{applicantData.Time_With_Curr_Empr || 0} Mts</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-white/5 bg-white/5 flex flex-col">
                    <span className="text-[11px] text-gray-400">Total Accounts</span>
                    <span className="text-sm font-bold text-blue-400 mt-0.5">{applicantData.Total_TL || 0} TLs</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-white/5 bg-white/5 flex flex-col">
                    <span className="text-[11px] text-gray-400">Missed Payments</span>
                    <span className={`text-sm font-bold mt-0.5 ${Number(applicantData.Tot_Missed_Pmnt || 0) > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {applicantData.Tot_Missed_Pmnt || 0}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-white/5 bg-white/5 flex flex-col">
                    <span className="text-[11px] text-gray-400">30+ Days DPD</span>
                    <span className={`text-sm font-bold mt-0.5 ${Number(applicantData.num_times_30p_dpd || 0) > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {applicantData.num_times_30p_dpd || 0}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-white/5 bg-white/5 flex flex-col">
                    <span className="text-[11px] text-gray-400">Total Bureau Inquiries</span>
                    <span className="text-sm font-bold text-purple-400 mt-0.5">{applicantData.tot_enq || 0}</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-white/5 bg-white/5 flex flex-col">
                    <span className="text-[11px] text-gray-400">Balance Ratio</span>
                    <span className="text-sm font-bold text-teal-400 mt-0.5">
                      {(Number(applicantData.pct_currentBal_all_TL || 0) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Charts Row: Trade Line Distribution & Delinquency Indicators Side-by-Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Trade Lines Recharts Breakdown */}
                <div 
                  className="p-4 sm:p-5 rounded-2xl flex flex-col gap-3"
                  style={{
                    background: 'var(--input-bg)',
                    border: '1px solid var(--border-glass)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-main)', margin: 0 }}>
                      Bureau Trade Line Distribution
                    </h4>
                    <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      Total Accounts: <strong>{Number(applicantData.Total_TL || 0)}</strong>
                    </span>
                  </div>

                  <div style={{ width: '100%', height: '160px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={tradeLineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ 
                            background: 'var(--bg-card-solid)', 
                            border: '1px solid var(--border-glass)', 
                            borderRadius: '8px', 
                            fontSize: '11px',
                            color: 'var(--text-main)'
                          }} 
                        />
                        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                          {tradeLineData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Delinquency & Risk Indicators Chart */}
                <div 
                  className="p-4 sm:p-5 rounded-2xl flex flex-col gap-3"
                  style={{
                    background: 'var(--input-bg)',
                    border: '1px solid var(--border-glass)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-main)', margin: 0 }}>
                      Delinquency & Risk Indicators
                    </h4>
                  </div>

                  <div style={{ width: '100%', height: '160px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={deliqData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ 
                            background: 'var(--bg-card-solid)', 
                            border: '1px solid var(--border-glass)', 
                            borderRadius: '8px', 
                            fontSize: '11px',
                            color: 'var(--text-main)'
                          }} 
                        />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                          {deliqData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'summary' && (
            /* TAB 2: MANUAL AI EXECUTIVE SUMMARY */
            <div className="flex flex-col gap-4">
              <div 
                className="p-5 rounded-2xl border flex flex-col gap-3"
                style={{
                  background: 'var(--input-bg)',
                  borderColor: 'var(--border-glass)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-purple-400" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white margin-0">
                      Gemini RAG Underwriting Synthesis
                    </h3>
                  </div>

                  <button
                    onClick={handleFetchAiSummary}
                    disabled={loadingSummary}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
                    style={{
                      background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)'
                    }}
                  >
                    <RefreshCw size={14} className={loadingSummary ? "animate-spin" : ""} />
                    <span>{aiSummary ? 'Re-generate Summary' : '⚡ Generate AI Executive Summary'}</span>
                  </button>
                </div>

                {!aiSummary && !loadingSummary && !summaryError && (
                  <div className="py-12 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-xl">
                    <Sparkles size={36} className="text-purple-400 mb-3 opacity-60 animate-bounce" />
                    <h4 className="text-sm font-bold text-white mb-1">Click above to generate AI Policy Narrative</h4>
                    <p className="text-xs text-gray-400 max-w-md">
                      Gemini will analyze applicant metrics against Credit Policy 2026 guidelines, RBI digital lending rules, and bureau data dictionary standards.
                    </p>
                  </div>
                )}

                {loadingSummary && (
                  <div className="py-12 flex flex-col items-center justify-center gap-3 text-xs text-purple-400 font-semibold">
                    <RefreshCw size={24} className="animate-spin" />
                    <span>Analyzing applicant metrics against credit policy & RBI guidelines...</span>
                  </div>
                )}

                {summaryError && (
                  <div className="p-3 rounded-xl text-xs flex items-center gap-2" style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' }}>
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{summaryError}</span>
                  </div>
                )}

                {aiSummary && !loadingSummary && (
                  <div className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--text-main)' }}>
                    <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{aiSummary}</p>

                    {policyCitations && policyCitations.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-white/10">
                        <p className="text-[11px] font-bold text-gray-400 mb-2 flex items-center gap-1">
                          <BookOpen size={12} className="text-indigo-400" /> Grounding Policy Manual Citations:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {policyCitations.map((cite, idx) => (
                            <span
                              key={idx}
                              style={{
                                fontSize: '0.7rem',
                                background: 'rgba(99, 102, 241, 0.15)',
                                border: '1px solid rgba(99, 102, 241, 0.3)',
                                color: '#818cf8',
                                padding: '3px 10px',
                                borderRadius: '12px',
                                fontWeight: 600
                              }}
                            >
                              {cite.doc_name} • {cite.clause}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            /* TAB 3: FULL 89-METRIC AUDIT TABLE */
            <div className="flex flex-col h-full overflow-hidden gap-3">
              <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/5 border border-white/10 shrink-0">
                <div className="flex items-center gap-2">
                  <Search size={16} className="text-cyan-400" />
                  <input
                    type="text"
                    value={auditSearch}
                    onChange={(e) => setAuditSearch(e.target.value)}
                    placeholder="Search all 89 payload metrics by key or description..."
                    className="bg-transparent border-none text-xs focus:outline-none text-white w-72"
                  />
                </div>
                <span className="text-xs text-gray-400 font-semibold">
                  Total Payload Features: 89
                </span>
              </div>

              <div className="flex-1 overflow-y-auto rounded-xl border border-white/10 bg-gray-950/60 max-h-[500px]">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-gray-900 text-gray-400 uppercase font-semibold text-[10px] border-b border-white/10">
                    <tr>
                      <th className="px-4 py-2.5">Variable Key</th>
                      <th className="px-4 py-2.5">Description</th>
                      <th className="px-4 py-2.5">Category</th>
                      <th className="px-4 py-2.5 text-right">Submitted Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {FEATURE_CONFIGS.filter(f => 
                      !auditSearch || 
                      f.key.toLowerCase().includes(auditSearch.toLowerCase()) || 
                      f.label.toLowerCase().includes(auditSearch.toLowerCase())
                    ).map((f) => (
                      <tr key={f.key} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-2 font-mono text-cyan-400 font-semibold">{f.key}</td>
                        <td className="px-4 py-2 text-gray-300">{f.label}</td>
                        <td className="px-4 py-2 text-gray-400">{f.category}</td>
                        <td className="px-4 py-2 text-right font-bold text-white font-mono">
                          {applicantData[f.key] !== undefined ? applicantData[f.key] : f.defaultVal}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Floating RAG Chat Overlay attached to Modal */}
      <RAGChatOverlay
        isOpen={chatOpen}
        onToggle={() => setChatOpen(!chatOpen)}
        applicantData={applicantData}
        predictionResult={result}
        externalPrompt={chatExternalPrompt}
        onClearExternalPrompt={() => setChatExternalPrompt(null)}
      />
    </div>
  );
}
