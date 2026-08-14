import React, { useState, useRef } from 'react';
import { API_BASE_URL } from '../config';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  PieChart as PieIcon, 
  Search, 
  Filter, 
  RefreshCw,
  Sparkles,
  FileDown,
  Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis 
} from 'recharts';

export default function BulkView() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  
  // Results state
  const [batchResults, setBatchResults] = useState(null); // { total_records, results: [...] }
  const [filterTier, setFilterTier] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fileInputRef = useRef(null);

  // Handle Drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    if (!file.name.endsWith('.csv')) {
      setErrorMsg('Please select a valid .csv file.');
      setSelectedFile(null);
      return;
    }
    setErrorMsg(null);
    setSelectedFile(file);
  };

  // Submit batch CSV to FastAPI backend /api/predict-csv
  const handleProcessBatch = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${API_BASE_URL}/api/predict-csv`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.detail || `Server returned status ${response.status}`);
      }

      const data = await response.json();
      setBatchResults(data);
      setCurrentPage(1);
    } catch (err) {
      console.error('Backend API upload failed:', err);
      setErrorMsg('Unable to reach the server. Please check your connection or try again later.');
      setBatchResults(null);
    } finally {
      setLoading(false);
    }
  };

  // Generate Sample CSV Template for testing
  const handleDownloadTemplate = () => {
    const sampleHeaders = [
      'AGE', 'NETMONTHLYINCOME', 'Time_With_Curr_Empr', 'Total_TL', 'Tot_Active_TL', 
      'Tot_Closed_TL', 'PL_TL', 'CC_TL', 'Secured_TL', 'Unsecured_TL', 
      'Tot_Missed_Pmnt', 'num_times_delinquent', 'num_deliq_6mts', 'num_deliq_12mts', 
      'num_times_30p_dpd', 'num_times_60p_dpd', 'num_std', 'num_sub', 
      'num_dbt', 'num_lss', 'tot_enq', 'enq_L6m', 'PL_enq_L6m', 
      'pct_currentBal_all_TL', 'Age_Oldest_TL', 'Age_Newest_TL'
    ].join(',');

    const row1 = [34, 65000, 36, 10, 7, 3, 2, 3, 2, 3, 0, 0, 0, 0, 0, 0, 18, 0, 0, 0, 3, 1, 0, 0.28, 60, 8].join(',');
    const row2 = [28, 42000, 24, 8, 5, 3, 2, 2, 1, 3, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 5, 2, 1, 0.55, 42, 6].join(',');
    const row3 = [26, 28000, 12, 10, 7, 3, 4, 3, 0, 7, 2, 2, 1, 2, 1, 0, 8, 1, 0, 0, 11, 6, 4, 0.82, 28, 2].join(',');
    const row4 = [24, 18000, 6, 14, 10, 4, 6, 4, 0, 10, 7, 6, 4, 6, 5, 2, 4, 3, 1, 1, 18, 9, 6, 0.96, 18, 1].join(',');

    const csvContent = [sampleHeaders, row1, row2, row3, row4].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sample_credit_risk_applicants.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Prediction Results CSV
  const handleExportResultsCSV = () => {
    if (!batchResults || !batchResults.results || batchResults.results.length === 0) return;

    const data = batchResults.results;
    const headers = Object.keys(data[0]);
    const csvRows = [];
    csvRows.push(headers.join(','));

    data.forEach(row => {
      const values = headers.map(header => {
        const val = row[header] === undefined || row[header] === null ? '' : String(row[header]);
        return `"${val.replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `predicted_credit_risk_results_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate tier metrics for chart
  const getTierStats = () => {
    if (!batchResults || !batchResults.results) return [];

    const counts = { P1: 0, P2: 0, P3: 0, P4: 0 };
    batchResults.results.forEach(item => {
      const tier = item['Predicted_Risk_Tier'] || 'Unknown';
      if (counts[tier] !== undefined) {
        counts[tier]++;
      }
    });

    return [
      { name: 'Tier P1 (Safe)', count: counts.P1, color: '#10b981' },
      { name: 'Tier P2 (Moderate)', count: counts.P2, color: '#3b82f6' },
      { name: 'Tier P3 (Subprime)', count: counts.P3, color: '#f59e0b' },
      { name: 'Tier P4 (High Risk)', count: counts.P4, color: '#ef4444' }
    ];
  };

  const tierStats = getTierStats();

  // Filtered & Paginated Results
  const getFilteredResults = () => {
    if (!batchResults || !batchResults.results) return [];

    return batchResults.results.filter(item => {
      const matchesTier = filterTier === 'ALL' || item['Predicted_Risk_Tier'] === filterTier;
      const matchesSearch = searchQuery === '' || Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      );
      return matchesTier && matchesSearch;
    });
  };

  const filteredResults = getFilteredResults();
  const totalPages = Math.ceil(filteredResults.length / pageSize) || 1;
  const paginatedResults = filteredResults.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getTierBadge = (tier) => {
    switch (tier) {
      case 'P1': return <span className="badge-p1" style={badgeStyle}>P1 - SAFE</span>;
      case 'P2': return <span className="badge-p2" style={badgeStyle}>P2 - MODERATE</span>;
      case 'P3': return <span className="badge-p3" style={badgeStyle}>P3 - SUBPRIME</span>;
      default: return <span className="badge-p4" style={badgeStyle}>P4 - HIGH RISK</span>;
    }
  };

  return (
    <div style={{ padding: '24px 0 60px' }}>
      <div className="container-xl">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div style={{ fontSize: '0.85rem', color: '#6366f1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
              High-Throughput Batch Processing
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold" style={{ color: 'var(--text-main)' }}>
              Bulk CSV Credit Risk Analytics
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
              Upload CSV datasets for batch ML risk predictions and instant download of risk scores.
            </p>
          </div>

          <button 
            onClick={handleDownloadTemplate} 
            className="btn-secondary w-full sm:w-auto justify-center"
            style={{ padding: '10px 18px', fontSize: '0.85rem' }}
          >
            <FileDown size={16} color="#38bdf8" />
            Download Sample CSV Template
          </button>
        </div>

        {/* Upload Container Box */}
        <div className="glass-panel p-5 sm:p-9 mb-8">
          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragActive ? '#06b6d4' : selectedFile ? '#10b981' : 'var(--border-glass-hover)'}`,
              borderRadius: '16px',
              padding: '36px 16px',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragActive ? 'rgba(6, 182, 212, 0.08)' : selectedFile ? 'rgba(16, 185, 129, 0.05)' : 'var(--input-bg)',
              transition: 'all 0.25s ease'
            }}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".csv" 
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />

            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '18px',
              background: selectedFile ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
              border: `1px solid ${selectedFile ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px'
            }}>
              {selectedFile ? (
                <FileSpreadsheet size={28} color="#10b981" />
              ) : (
                <UploadCloud size={28} color="#6366f1" />
              )}
            </div>

            {selectedFile ? (
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                  File Selected: <span style={{ color: '#34d399' }}>{selectedFile.name}</span>
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Size: {(selectedFile.size / 1024).toFixed(1)} KB • Ready for batch evaluation
                </p>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                  Drag & Drop your applicant CSV file here
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  or <strong style={{ color: '#38bdf8' }}>browse files</strong> on your computer (.csv format)
                </p>
              </div>
            )}
          </div>

          {errorMsg && (
            <div style={{
              marginTop: '16px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#f87171',
              padding: '12px 16px',
              borderRadius: '10px',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button 
              onClick={handleProcessBatch}
              disabled={!selectedFile || loading}
              className="btn-primary w-full sm:w-auto justify-center"
              style={{
                opacity: !selectedFile ? 0.5 : 1,
                cursor: !selectedFile ? 'not-allowed' : 'pointer',
                padding: '12px 28px'
              }}
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={18} />
                  Evaluating Batch Records...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Execute Bulk Prediction Engine
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Dashboard */}
        {batchResults && (
          <div>
            {/* Top Summary Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
              <SummaryCard label="Total Processed" value={batchResults.total_records} color="var(--text-main)" icon={Layers} />
              <SummaryCard label="P1 - Safe Tiers" value={tierStats[0].count} color="#10b981" />
              <SummaryCard label="P2 - Moderate" value={tierStats[1].count} color="#3b82f6" />
              <SummaryCard label="P3 - Subprime" value={tierStats[2].count} color="#f59e0b" />
              <SummaryCard label="P4 - High Risk" value={tierStats[3].count} color="#ef4444" />
            </div>

            {/* Recharts Distribution Chart & Export Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              
              {/* Distribution Chart */}
              <div className="glass-panel p-5 lg:col-span-1">
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PieIcon size={18} color="#06b6d4" />
                  Batch Risk Distribution
                </h4>

                <div style={{ width: '100%', height: '220px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tierStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="count"
                      >
                        {tierStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--bg-card-solid)', borderColor: 'var(--border-glass)', borderRadius: '8px', color: 'var(--text-main)' }}
                      />
                      <Legend verticalAlign="bottom" height={36} iconSize={10} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Toolbar & Filter controls */}
              <div className="glass-panel p-5 lg:col-span-2 flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      Batch Predictions Table ({filteredResults.length} records)
                    </h4>

                    <button 
                      onClick={handleExportResultsCSV}
                      className="btn-primary w-full sm:w-auto justify-center"
                      style={{ padding: '9px 16px', fontSize: '0.85rem' }}
                    >
                      <Download size={16} />
                      Export CSV Predictions
                    </button>
                  </div>

                  {/* Search and Tier Filter */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <div style={{ flex: 1, position: 'relative' }}>
                      <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                      <input 
                        type="text" 
                        placeholder="Search records by keyword..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        style={{
                          width: '100%',
                          padding: '9px 14px 9px 36px',
                          borderRadius: '8px',
                          background: 'var(--input-bg)',
                          border: '1px solid var(--input-border)',
                          color: 'var(--text-main)',
                          fontSize: '0.88rem'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Filter size={16} color="var(--text-muted)" />
                      <select
                        value={filterTier}
                        onChange={(e) => { setFilterTier(e.target.value); setCurrentPage(1); }}
                        style={{
                          width: '100%',
                          padding: '9px 14px',
                          borderRadius: '8px',
                          background: 'var(--input-bg)',
                          border: '1px solid var(--input-border)',
                          color: 'var(--text-main)',
                          fontSize: '0.88rem',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="ALL" style={{ background: 'var(--bg-card-solid)', color: 'var(--text-main)' }}>All Risk Tiers</option>
                        <option value="P1" style={{ background: 'var(--bg-card-solid)', color: 'var(--text-main)' }}>Tier P1 (Safe)</option>
                        <option value="P2" style={{ background: 'var(--bg-card-solid)', color: 'var(--text-main)' }}>Tier P2 (Moderate)</option>
                        <option value="P3" style={{ background: 'var(--bg-card-solid)', color: 'var(--text-main)' }}>Tier P3 (Subprime)</option>
                        <option value="P4" style={{ background: 'var(--bg-card-solid)', color: 'var(--text-main)' }}>Tier P4 (High Risk)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Showing page {currentPage} of {totalPages}
                </div>
              </div>

            </div>

            {/* Results Data Table */}
            <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
              <div className="table-scroll-wrapper">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem', minWidth: '650px' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-glass)', color: 'var(--text-main)', fontWeight: 700 }}>
                      <th style={{ padding: '12px 16px' }}>Row #</th>
                      <th style={{ padding: '12px 16px' }}>Predicted Risk Tier</th>
                      <th style={{ padding: '12px 16px' }}>Confidence Score</th>
                      <th style={{ padding: '12px 16px' }}>Monthly Income</th>
                      <th style={{ padding: '12px 16px' }}>Missed Payments</th>
                      <th style={{ padding: '12px 16px' }}>Active TLs</th>
                      <th style={{ padding: '12px 16px' }}>Inquiries</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedResults.map((row, idx) => {
                      const actualIdx = (currentPage - 1) * pageSize + idx + 1;
                      return (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                          <td style={{ padding: '12px 16px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                            #{actualIdx}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            {getTierBadge(row['Predicted_Risk_Tier'])}
                          </td>
                          <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-main)' }}>
                            {row['Confidence_Probability']}
                          </td>
                          <td style={{ padding: '12px 16px', color: 'var(--text-main)' }}>
                            ₹{Number(row['NETMONTHLYINCOME'] || 0).toLocaleString()}
                          </td>
                          <td style={{ padding: '12px 16px', color: Number(row['Tot_Missed_Pmnt']) > 0 ? '#ef4444' : '#34d399', fontWeight: 600 }}>
                            {row['Tot_Missed_Pmnt'] || 0}
                          </td>
                          <td style={{ padding: '12px 16px', color: 'var(--text-main)' }}>
                            {row['Tot_Active_TL'] || 0}
                          </td>
                          <td style={{ padding: '12px 16px', color: 'var(--text-main)' }}>
                            {row['tot_enq'] || 0}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table Pagination */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'var(--bg-card)', borderTop: '1px solid var(--border-glass)' }}>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn-secondary"
                  style={{ padding: '6px 14px', fontSize: '0.82rem', opacity: currentPage === 1 ? 0.5 : 1 }}
                >
                  Previous
                </button>

                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="btn-secondary"
                  style={{ padding: '6px 14px', fontSize: '0.82rem', opacity: currentPage === totalPages ? 0.5 : 1 }}
                >
                  Next
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

function SummaryCard({ label, value, color, icon: Icon }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-glass)',
      borderRadius: '12px',
      padding: '14px'
    }}>
      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: color || 'var(--text-main)', marginTop: '4px' }}>
        {value}
      </div>
    </div>
  );
}

const badgeStyle = {
  padding: '4px 10px',
  borderRadius: '12px',
  fontSize: '0.78rem',
  fontWeight: 800,
  display: 'inline-block'
};

