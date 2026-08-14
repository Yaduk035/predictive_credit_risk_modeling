import React, { useState } from 'react';
import { API_BASE_URL } from '../config';
import { 
  Sparkles, 
  Dices, 
  RotateCcw, 
  Send, 
  User, 
  Briefcase, 
  CreditCard, 
  AlertOctagon, 
  Search,
  Zap,
  CheckCircle2,
  ShieldAlert,
  ChevronDown,
  Sliders
} from 'lucide-react';
import PredictionModal from './PredictionModal';

// Feature definitions with exact Data_Dictionary.json descriptions
export const FEATURE_CONFIGS = [
  // Section 1: Demographics & Employment
  { key: 'AGE', label: 'Applicant Age (Years)', category: 'Demographics & Income', type: 'number', defaultVal: 28, min: 18, max: 80, step: 1 },
  { key: 'NETMONTHLYINCOME', label: 'Net Monthly Income (₹)', category: 'Demographics & Income', type: 'number', defaultVal: 65000, min: 10000, max: 500000, step: 1000 },
  { key: 'Time_With_Curr_Empr', label: 'Time With Current Employer (Months)', category: 'Demographics & Income', type: 'number', defaultVal: 18, min: 0, max: 360, step: 1 },

  // Section 2: Trade Lines Portfolio
  { key: 'Total_TL', label: 'Total Bureau Trade Lines', category: 'Trade Lines & Portfolio', type: 'number', defaultVal: 9, min: 0, max: 50, step: 1 },
  { key: 'Tot_Active_TL', label: 'Total Active Trade Lines', category: 'Trade Lines & Portfolio', type: 'number', defaultVal: 6, min: 0, max: 40, step: 1 },
  { key: 'Tot_Closed_TL', label: 'Total Closed Trade Lines', category: 'Trade Lines & Portfolio', type: 'number', defaultVal: 3, min: 0, max: 30, step: 1 },
  { key: 'PL_TL', label: 'Personal Loan Trade Lines', category: 'Trade Lines & Portfolio', type: 'number', defaultVal: 3, min: 0, max: 20, step: 1 },
  { key: 'CC_TL', label: 'Credit Card Trade Lines', category: 'Trade Lines & Portfolio', type: 'number', defaultVal: 2, min: 0, max: 20, step: 1 },
  { key: 'Secured_TL', label: 'Secured Trade Lines', category: 'Trade Lines & Portfolio', type: 'number', defaultVal: 1, min: 0, max: 15, step: 1 },
  { key: 'Unsecured_TL', label: 'Unsecured Trade Lines', category: 'Trade Lines & Portfolio', type: 'number', defaultVal: 5, min: 0, max: 25, step: 1 },
  { key: 'pct_currentBal_all_TL', label: 'Current Balance Ratio across TLs (0.0 - 1.0)', category: 'Trade Lines & Portfolio', type: 'number', defaultVal: 0.74, min: 0, max: 1, step: 0.01 },
  { key: 'Age_Oldest_TL', label: 'Age of Oldest Trade Line (Months)', category: 'Trade Lines & Portfolio', type: 'number', defaultVal: 36, min: 0, max: 300, step: 1 },
  { key: 'Age_Newest_TL', label: 'Age of Newest Trade Line (Months)', category: 'Trade Lines & Portfolio', type: 'number', defaultVal: 4, min: 0, max: 120, step: 1 },

  // Section 3: Payment Delinquencies & Asset Class
  { key: 'Tot_Missed_Pmnt', label: 'Total Missed Payments', category: 'Delinquencies & History', type: 'number', defaultVal: 3, min: 0, max: 30, step: 1 },
  { key: 'num_times_delinquent', label: 'Number of Times Delinquent', category: 'Delinquencies & History', type: 'number', defaultVal: 3, min: 0, max: 30, step: 1 },
  { key: 'num_deliq_6mts', label: 'Delinquencies in Last 6 Months', category: 'Delinquencies & History', type: 'number', defaultVal: 2, min: 0, max: 15, step: 1 },
  { key: 'num_deliq_12mts', label: 'Delinquencies in Last 12 Months', category: 'Delinquencies & History', type: 'number', defaultVal: 3, min: 0, max: 20, step: 1 },
  { key: 'num_times_30p_dpd', label: 'Times 30+ Days Past Due (DPD)', category: 'Delinquencies & History', type: 'number', defaultVal: 3, min: 0, max: 20, step: 1 },
  { key: 'num_times_60p_dpd', label: 'Times 60+ Days Past Due (DPD)', category: 'Delinquencies & History', type: 'number', defaultVal: 0, min: 0, max: 15, step: 1 },
  { key: 'num_std', label: 'Standard Accounts (STD)', category: 'Delinquencies & History', type: 'number', defaultVal: 14, min: 0, max: 100, step: 1 },
  { key: 'num_sub', label: 'Substandard Accounts (SUB)', category: 'Delinquencies & History', type: 'number', defaultVal: 0, min: 0, max: 10, step: 1 },
  { key: 'num_dbt', label: 'Doubtful Accounts (DBT)', category: 'Delinquencies & History', type: 'number', defaultVal: 0, min: 0, max: 10, step: 1 },
  { key: 'num_lss', label: 'Loss Accounts (LSS)', category: 'Delinquencies & History', type: 'number', defaultVal: 0, min: 0, max: 10, step: 1 },

  // Section 4: Bureau Inquiries
  { key: 'tot_enq', label: 'Total Bureau Credit Inquiries', category: 'Credit Bureau Inquiries', type: 'number', defaultVal: 9, min: 0, max: 40, step: 1 },
  { key: 'enq_L6m', label: 'Bureau Inquiries in Last 6 Months', category: 'Credit Bureau Inquiries', type: 'number', defaultVal: 5, min: 0, max: 20, step: 1 },
  { key: 'PL_enq_L6m', label: 'Personal Loan Inquiries (L6M)', category: 'Credit Bureau Inquiries', type: 'number', defaultVal: 3, min: 0, max: 15, step: 1 }
];

export default function SingleView() {
  // Initialize form state with sample default values
  const getInitialState = () => {
    const state = {};
    FEATURE_CONFIGS.forEach(item => {
      state[item.key] = item.defaultVal;
    });
    return state;
  };

  const [formData, setFormData] = useState(getInitialState);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [error, setError] = useState(null);
  const [presetMenuOpen, setPresetMenuOpen] = useState(false);

  const handleInputChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value === '' ? '' : Number(value)
    }));
  };

  // --- ⚡ Randomize / Preset Generator Feature ---
  const handleRandomize = () => {
    const randomized = {};
    FEATURE_CONFIGS.forEach(item => {
      if (item.key === 'pct_currentBal_all_TL') {
        randomized[item.key] = Number((Math.random() * 0.9).toFixed(2));
      } else {
        const randVal = Math.floor(Math.random() * (item.max - item.min + 1)) + item.min;
        randomized[item.key] = randVal;
      }
    });
    // Logical consistency adjustments
    randomized['Tot_Active_TL'] = Math.min(randomized['Tot_Active_TL'], randomized['Total_TL']);
    randomized['Tot_Closed_TL'] = Math.max(0, randomized['Total_TL'] - randomized['Tot_Active_TL']);
    randomized['Age_Newest_TL'] = Math.min(randomized['Age_Newest_TL'], randomized['Age_Oldest_TL']);
    setFormData(randomized);
  };

  // Preset Profile Loaders
  const loadPresetProfile = (tier) => {
    let preset = { ...getInitialState() };

    switch (tier) {
      case 'P1': // Prime Safe
        preset = {
          AGE: 38,
          NETMONTHLYINCOME: 75000,
          Time_With_Curr_Empr: 48,
          Total_TL: 12,
          Tot_Active_TL: 8,
          Tot_Closed_TL: 4,
          PL_TL: 1,
          CC_TL: 3,
          Secured_TL: 3,
          Unsecured_TL: 1,
          Tot_Missed_Pmnt: 0,
          num_times_delinquent: 0,
          num_deliq_6mts: 0,
          num_deliq_12mts: 0,
          num_times_30p_dpd: 0,
          num_times_60p_dpd: 0,
          num_std: 24,
          num_sub: 0,
          num_dbt: 0,
          num_lss: 0,
          tot_enq: 2,
          enq_L6m: 0,
          PL_enq_L6m: 0,
          pct_currentBal_all_TL: 0.22,
          Age_Oldest_TL: 72,
          Age_Newest_TL: 12
        };
        break;

      case 'P2': // Moderate Risk
        preset = {
          AGE: 30,
          NETMONTHLYINCOME: 42000,
          Time_With_Curr_Empr: 24,
          Total_TL: 8,
          Tot_Active_TL: 5,
          Tot_Closed_TL: 3,
          PL_TL: 2,
          CC_TL: 2,
          Secured_TL: 1,
          Unsecured_TL: 3,
          Tot_Missed_Pmnt: 0,
          num_times_delinquent: 0,
          num_deliq_6mts: 0,
          num_deliq_12mts: 0,
          num_times_30p_dpd: 0,
          num_times_60p_dpd: 0,
          num_std: 12,
          num_sub: 0,
          num_dbt: 0,
          num_lss: 0,
          tot_enq: 5,
          enq_L6m: 2,
          PL_enq_L6m: 1,
          pct_currentBal_all_TL: 0.55,
          Age_Oldest_TL: 42,
          Age_Newest_TL: 6
        };
        break;

      case 'P3': // Subprime
        preset = {
          AGE: 26,
          NETMONTHLYINCOME: 28000,
          Time_With_Curr_Empr: 12,
          Total_TL: 10,
          Tot_Active_TL: 7,
          Tot_Closed_TL: 3,
          PL_TL: 4,
          CC_TL: 3,
          Secured_TL: 0,
          Unsecured_TL: 7,
          Tot_Missed_Pmnt: 2,
          num_times_delinquent: 2,
          num_deliq_6mts: 1,
          num_deliq_12mts: 2,
          num_times_30p_dpd: 1,
          num_times_60p_dpd: 0,
          num_std: 8,
          num_sub: 1,
          num_dbt: 0,
          num_lss: 0,
          tot_enq: 11,
          enq_L6m: 6,
          PL_enq_L6m: 4,
          pct_currentBal_all_TL: 0.82,
          Age_Oldest_TL: 28,
          Age_Newest_TL: 2
        };
        break;

      case 'P4': // High Risk Subprime
        preset = {
          AGE: 24,
          NETMONTHLYINCOME: 18000,
          Time_With_Curr_Empr: 6,
          Total_TL: 14,
          Tot_Active_TL: 10,
          Tot_Closed_TL: 4,
          PL_TL: 6,
          CC_TL: 4,
          Secured_TL: 0,
          Unsecured_TL: 10,
          Tot_Missed_Pmnt: 7,
          num_times_delinquent: 6,
          num_deliq_6mts: 4,
          num_deliq_12mts: 6,
          num_times_30p_dpd: 5,
          num_times_60p_dpd: 2,
          num_std: 4,
          num_sub: 3,
          num_dbt: 1,
          num_lss: 1,
          tot_enq: 18,
          enq_L6m: 9,
          PL_enq_L6m: 6,
          pct_currentBal_all_TL: 0.96,
          Age_Oldest_TL: 18,
          Age_Newest_TL: 1
        };
        break;

      default:
        preset = getInitialState();
        break;
    }

    setFormData(preset);
  };

  const handleClear = () => {
    setFormData(getInitialState());
  };

  // Submit assessment form to FastAPI backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const predRes = await fetch(`${API_BASE_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features: formData })
      });

      if (!predRes.ok) {
        const errData = await predRes.json().catch(() => ({}));
        throw new Error(errData.detail || `API error: ${predRes.statusText}`);
      }

      const predData = await predRes.json();

      setPredictionResult({
        risk_tier: predData.risk_tier,
        probability: predData.probability
      });

      setModalOpen(true);
    } catch (err) {
      console.error('Prediction request failed:', err);
      setError('Unable to reach the server. Please try again later.');
      setPredictionResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Group fields by category
  const categories = [
    { title: '1. Demographics & Income', icon: User, items: FEATURE_CONFIGS.filter(f => f.category === 'Demographics & Income') },
    { title: '2. Trade Lines & Portfolio', icon: CreditCard, items: FEATURE_CONFIGS.filter(f => f.category === 'Trade Lines & Portfolio') },
    { title: '3. Delinquencies & History', icon: AlertOctagon, items: FEATURE_CONFIGS.filter(f => f.category === 'Delinquencies & History') },
    { title: '4. Credit Bureau Inquiries', icon: Search, items: FEATURE_CONFIGS.filter(f => f.category === 'Credit Bureau Inquiries') }
  ];

  return (
    <div style={{ padding: '24px 0 60px' }}>
      <div className="container-xl">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div style={{ fontSize: '0.85rem', color: '#06b6d4', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
              Underwriting Assessment Mode
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold" style={{ color: 'var(--text-main)' }}>
              Single Applicant Credit Risk Assessment
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
              Key 26 predictive features derived from bureau credit dictionary.
            </p>
          </div>

          {/* Presets & Actions Dropdown Menu */}
          <div style={{ position: 'relative' }}>
            <button 
              type="button"
              onClick={() => setPresetMenuOpen(!presetMenuOpen)} 
              className="btn-secondary w-full sm:w-auto justify-center"
              style={{ 
                padding: '10px 18px', 
                fontSize: '0.88rem', 
                borderColor: 'rgba(6, 182, 212, 0.4)', 
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Sliders size={16} />
              <span>Auto-Fill Tools & Presets</span>
              <ChevronDown size={16} style={{ transform: presetMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
            </button>

            {presetMenuOpen && (
              <>
                <div 
                  onClick={() => setPresetMenuOpen(false)}
                  style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 30 }}
                />
                <div 
                  className="max-w-[calc(100vw-32px)]"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    zIndex: 40,
                    minWidth: '260px',
                    background: 'var(--bg-card-solid)',
                    border: '1px solid var(--border-glass-hover)',
                    borderRadius: '14px',
                    padding: '8px',
                    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)'
                  }}
                >
                  <div style={{ padding: '6px 12px 6px', fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Profile Generator
                  </div>

                  <button
                    type="button"
                    onClick={() => { handleRandomize(); setPresetMenuOpen(false); }}
                    style={dropdownItemStyle}
                  >
                    <Dices size={16} color="#38bdf8" />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>⚡ Randomize Parameters</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Generate randomized valid profile</div>
                    </div>
                  </button>

                  <div style={{ height: '1px', background: 'var(--border-glass)', margin: '4px 0' }}></div>

                  <div style={{ padding: '6px 12px 4px', fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Preset Risk Tiers
                  </div>

                  <button
                    type="button"
                    onClick={() => { loadPresetProfile('P1'); setPresetMenuOpen(false); }}
                    style={dropdownItemStyle}
                  >
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', flexShrink: 0 }}></span>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Prime Safe (Tier P1)</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Low risk, clean credit record</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { loadPresetProfile('P2'); setPresetMenuOpen(false); }}
                    style={dropdownItemStyle}
                  >
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }}></span>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Standard Moderate (Tier P2)</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Standard credit history</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { loadPresetProfile('P3'); setPresetMenuOpen(false); }}
                    style={dropdownItemStyle}
                  >
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', flexShrink: 0 }}></span>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Subprime Risk (Tier P3)</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Elevated inquiries & balance</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { loadPresetProfile('P4'); setPresetMenuOpen(false); }}
                    style={dropdownItemStyle}
                  >
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', flexShrink: 0 }}></span>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>High Risk (Tier P4)</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Severe delinquencies</div>
                    </div>
                  </button>

                  <div style={{ height: '1px', background: 'var(--border-glass)', margin: '4px 0' }}></div>

                  <button
                    type="button"
                    onClick={() => { handleClear(); setPresetMenuOpen(false); }}
                    style={dropdownItemStyle}
                  >
                    <RotateCcw size={15} color="var(--text-muted)" />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Reset Form Defaults</div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Input Form Grid */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {categories.map((cat, catIdx) => {
              const CategoryIcon = cat.icon;
              return (
                <div key={catIdx} className="glass-panel p-4 sm:p-7">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '14px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'rgba(6, 182, 212, 0.15)',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <CategoryIcon size={18} color="#06b6d4" />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {cat.title}
                    </h3>
                  </div>

                  <div className="grid-3">
                    {cat.items.map((field) => (
                      <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
                          <span>{field.label}</span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>{field.key}</span>
                        </label>
                        <input
                          type={field.type}
                          step={field.step}
                          value={formData[field.key]}
                          onChange={(e) => handleInputChange(field.key, e.target.value)}
                          style={{
                            padding: '10px 14px',
                            borderRadius: '10px',
                            background: 'var(--input-bg)',
                            border: '1px solid var(--input-border)',
                            color: 'var(--text-main)',
                            fontSize: '0.92rem',
                            outline: 'none',
                            transition: 'border-color 0.2s ease'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form Actions Footer */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 sm:p-7 mt-8" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-glass)',
            borderRadius: '16px'
          }}>
            {error && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#f87171',
                padding: '12px 18px',
                borderRadius: '10px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.9rem'
              }}>
                <ShieldAlert size={18} color="#f87171" style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <Zap size={18} color="#06b6d4" style={{ flexShrink: 0 }} />
              <span>Features will be normalized via Z-score scaling before risk classification.</span>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full sm:w-auto justify-center" 
              style={{ padding: '14px 28px', fontSize: '0.95rem' }}
            >
              {loading ? (
                <>Evaluating Risk Prediction...</>
              ) : (
                <>
                  <Send size={18} />
                  Execute Underwriting Assessment
                </>
              )}
            </button>
          </div>
        </form>

      </div>

      {/* Prediction Output Modal */}
      <PredictionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        result={predictionResult}
        applicantData={formData}
      />
    </div>
  );
}

const dropdownItemStyle = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: '8px',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  textAlign: 'left',
  transition: 'background 0.15s ease'
};
