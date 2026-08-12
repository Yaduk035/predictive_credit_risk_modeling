import React from 'react';
import { ShieldCheck, Cpu, UploadCloud, FileText, Activity } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, apiConnected }) {
  const navItems = [
    { id: 'landing', label: 'Overview', icon: Cpu },
    { id: 'single', label: 'Single Applicant', icon: ShieldCheck },
    { id: 'bulk', label: 'Bulk CSV Batch', icon: UploadCloud },
    { id: 'docs', label: 'Model Docs', icon: FileText }
  ];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '16px 0'
    }}>
      <div className="container-xl" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(6, 182, 212, 0.4)'
          }}>
            <ShieldCheck size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
              NeoBank<span style={{ color: '#06b6d4' }}>.AI</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500, letterSpacing: '0.05em' }}>
              CREDIT RISK ENGINE
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '6px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isActive ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)' : 'transparent',
                  borderImage: isActive ? 'linear-gradient(to right, #06b6d4, #6366f1)' : 'none',
                  outline: isActive ? '1px solid rgba(6, 182, 212, 0.4)' : 'none',
                  color: isActive ? '#38bdf8' : '#94a3b8',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} color={isActive ? '#38bdf8' : '#94a3b8'} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* API Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '20px',
            background: apiConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${apiConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            fontSize: '0.8rem',
            color: apiConnected ? '#34d399' : '#f87171',
            fontWeight: 600
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: apiConnected ? '#10b981' : '#ef4444',
              boxShadow: `0 0 8px ${apiConnected ? '#10b981' : '#ef4444'}`
            }}></span>
            {apiConnected ? 'FastAPI Online' : 'FastAPI Offline'}
          </div>
        </div>
      </div>
    </nav>
  );
}
