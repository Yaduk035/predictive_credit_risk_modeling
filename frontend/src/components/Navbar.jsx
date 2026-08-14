import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Cpu, UploadCloud, FileText, Info, Sun, Moon, Server, Menu, X } from 'lucide-react';

export default function Navbar({ apiConnected, theme, toggleTheme }) {
  const location = useLocation();
  const [statusHovered, setStatusHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Overview', icon: Cpu },
    { path: '/single', label: 'Single Applicant', icon: ShieldCheck },
    { path: '/bulk', label: 'Bulk CSV Batch', icon: UploadCloud },
    { path: '/about', label: 'About', icon: Info }
  ];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'var(--nav-bg)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-glass)',
      padding: '12px 0',
      transition: 'background-color 0.3s ease, border-color 0.3s ease'
    }}>
      <div className="container-xl" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        {/* Brand Logo */}
        <Link 
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', textDecoration: 'none' }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(6, 182, 212, 0.4)',
            flexShrink: 0
          }}>
            <ShieldCheck size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)', lineHeight: 1.2 }}>
              NeoBank<span style={{ color: '#06b6d4' }}>.AI</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.05em' }}>
              CREDIT RISK ENGINE
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Tabs */}
        <div className="hidden md:flex" style={{
          alignItems: 'center',
          gap: '4px',
          background: 'var(--bg-card)',
          padding: '6px',
          borderRadius: '12px',
          border: '1px solid var(--border-glass)'
        }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  background: isActive ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)' : 'transparent',
                  outline: isActive ? '1px solid rgba(6, 182, 212, 0.4)' : 'none',
                  color: isActive ? '#38bdf8' : 'var(--text-muted)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} color={isActive ? '#38bdf8' : 'currentColor'} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right Actions: Theme Toggle, Server Status & Mobile Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Dark / Light Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark/light theme"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun size={18} color="#fbbf24" />
            ) : (
              <Moon size={18} color="#6366f1" />
            )}
          </button>

          {/* Server Status Icon Indicator with Instant Hover Tooltip */}
          <div 
            onMouseEnter={() => setStatusHovered(true)}
            onMouseLeave={() => setStatusHovered(false)}
            style={{
              position: 'relative',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: apiConnected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              border: `1px solid ${apiConnected ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'default',
              transition: 'all 0.2s ease'
            }}
          >
            <Server size={18} color={apiConnected ? '#10b981' : '#ef4444'} />
            <span style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: apiConnected ? '#10b981' : '#ef4444',
              boxShadow: `0 0 6px ${apiConnected ? '#10b981' : '#ef4444'}`
            }}></span>

            {/* Custom Hover Tooltip Popup */}
            {statusHovered && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                zIndex: 60,
                whiteSpace: 'nowrap',
                background: 'var(--bg-card-solid)',
                border: `1px solid ${apiConnected ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: apiConnected ? '#34d399' : '#f87171',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: apiConnected ? '#10b981' : '#ef4444'
                }}></span>
                <span>Server Status: {apiConnected ? 'Online' : 'Unreachable'}</span>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="flex md:hidden"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-main)',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="block md:hidden" style={{
          background: 'var(--bg-card-solid)',
          borderBottom: '1px solid var(--border-glass)',
          padding: '16px',
          marginTop: '12px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    background: isActive ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)' : 'rgba(255, 255, 255, 0.03)',
                    border: isActive ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid transparent',
                    color: isActive ? '#38bdf8' : 'var(--text-main)',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.95rem'
                  }}
                >
                  <Icon size={18} color={isActive ? '#38bdf8' : 'currentColor'} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}

