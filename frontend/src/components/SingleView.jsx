import React, { useState } from 'react';
import { API_BASE_URL } from '../config';
import { FEATURE_CONFIGS } from '../config/featureConfigs';
import { PRESET_PROFILES, CSV_SAMPLE_ROWS } from '../config/presetProfiles';
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
  Sliders,
  Filter,
  X
} from 'lucide-react';
import PredictionModal from './PredictionModal';

export default function SingleView() {
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
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value === '' ? '' : Number(value)
    }));
  };

  // --- ⚡ Randomize Profile from Real CSV Dataset Rows ---
  const handleRandomize = () => {
    if (CSV_SAMPLE_ROWS && CSV_SAMPLE_ROWS.length > 0) {
      const randomRow = CSV_SAMPLE_ROWS[Math.floor(Math.random() * CSV_SAMPLE_ROWS.length)];
      const randomized = {};
      FEATURE_CONFIGS.forEach(item => {
        randomized[item.key] = randomRow[item.key] !== undefined ? randomRow[item.key] : item.defaultVal;
      });
      setFormData(randomized);
    }
  };

  // --- High-Confidence CSV Preset Loaders ---
  const loadPresetProfile = (tier) => {
    const preset = PRESET_PROFILES[tier] || getInitialState();
    const loadedState = {};
    FEATURE_CONFIGS.forEach(item => {
      loadedState[item.key] = preset[item.key] !== undefined ? preset[item.key] : item.defaultVal;
    });
    setFormData(loadedState);
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

  // Organize all 89 fields into 5 logical categories
  const categories = [
    { title: '1. Demographics & Employment', icon: User, items: FEATURE_CONFIGS.filter(f => f.category === 'Demographics & Income') },
    { title: '2. Trade Lines & Portfolio Depth', icon: CreditCard, items: FEATURE_CONFIGS.filter(f => f.category === 'Trade Lines & Credit Depth') },
    { title: '3. Payment History & Delinquencies', icon: AlertOctagon, items: FEATURE_CONFIGS.filter(f => f.category === 'Payment History & Delinquencies') },
    { title: '4. Credit Bureau Inquiries', icon: Search, items: FEATURE_CONFIGS.filter(f => f.category === 'Credit Bureau Inquiries') },
    { title: '5. Account & Product Flags', icon: Sliders, items: FEATURE_CONFIGS.filter(f => f.category === 'Account & Product Flags') }
  ];

  // Filter categories by search term
  const filteredCategories = categories.map(cat => ({
    ...cat,
    items: cat.items.filter(f => 
      !searchTerm || 
      f.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
      f.key.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <div style={{ padding: '24px 0 60px' }}>
      <div className="container-xl">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div style={{ fontSize: '0.85rem', color: '#06b6d4', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
              Underwriting Assessment Engine
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold" style={{ color: 'var(--text-main)' }}>
              Single Applicant Evaluation Form
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
              Full 89-metric CIBIL & Internal Bank payload input schema. All fields enabled for maximum prediction accuracy.
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
                    minWidth: '280px',
                    background: 'var(--bg-card-solid)',
                    border: '1px solid var(--border-glass-hover)',
                    borderRadius: '14px',
                    padding: '8px',
                    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)'
                  }}
                >
                  <div style={{ padding: '6px 12px 6px', fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Dataset Profile Sampling
                  </div>

                  <button
                    type="button"
                    onClick={() => { handleRandomize(); setPresetMenuOpen(false); }}
                    style={dropdownItemStyle}
                  >
                    <Dices size={16} color="#38bdf8" />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>⚡ Randomize Profile</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Generate randomized applicant profile</div>
                    </div>
                  </button>

                  <div style={{ height: '1px', background: 'var(--border-glass)', margin: '4px 0' }}></div>

                  <div style={{ padding: '6px 12px 4px', fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Preset Risk Tier Profiles
                  </div>

                  <button
                    type="button"
                    onClick={() => { loadPresetProfile('P1'); setPresetMenuOpen(false); }}
                    style={dropdownItemStyle}
                  >
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', flexShrink: 0 }}></span>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Prime Safe (Tier P1)</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>High-confidence Prime profile (99.7%)</div>
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
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>High-confidence Standard profile (98.2%)</div>
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
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified Subprime risk profile (60.0%)</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { loadPresetProfile('P4'); setPresetMenuOpen(false); }}
                    style={dropdownItemStyle}
                  >
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', flexShrink: 0 }}></span>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Severe High Risk (Tier P4)</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>High-confidence Severe Risk (99.3%)</div>
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

        {/* Search & Filter Bar for 89 Fields */}
        <div 
          className="mb-6 p-3 rounded-xl flex items-center gap-3"
          style={{
            background: 'var(--input-bg)',
            border: '1px solid var(--border-glass)'
          }}
        >
          <Filter size={16} className="text-cyan-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search all 89 metrics by variable name or description (e.g. num_std, income, dpd, enq)..."
            className="flex-1 bg-transparent border-none text-xs sm:text-sm focus:outline-none"
            style={{ color: 'var(--text-main)' }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 rounded-full text-gray-400 hover:text-white"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Input Form Grid */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {filteredCategories.map((cat, catIdx) => {
              const CategoryIcon = cat.icon;
              return (
                <div key={catIdx} className="glass-panel p-4 sm:p-7">
                  <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '14px', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                        {cat.title}
                      </h3>
                    </div>
                    <span 
                      style={{
                        fontSize: '0.75rem',
                        background: 'var(--input-bg)',
                        border: '1px solid var(--border-glass)',
                        color: 'var(--text-muted)',
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontWeight: 600
                      }}
                    >
                      {cat.items.length} Metrics
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cat.items.map((field) => (
                      <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, display: 'flex', justifyBetween: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
                          <span className="truncate max-w-[80%]" title={field.label}>{field.label}</span>
                        </label>
                        <input
                          type={field.type}
                          step={field.step}
                          value={formData[field.key] !== undefined ? formData[field.key] : ''}
                          onChange={(e) => handleInputChange(field.key, e.target.value)}
                          style={{
                            padding: '9px 12px',
                            borderRadius: '10px',
                            background: 'var(--input-bg)',
                            border: '1px solid var(--input-border)',
                            color: 'var(--text-main)',
                            fontSize: '0.88rem',
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
