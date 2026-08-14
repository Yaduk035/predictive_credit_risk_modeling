import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle } from 'lucide-react';

export default function RiskTierGuide() {
  const tiers = [
    {
      code: 'P1',
      title: 'Prime Safe',
      badgeClass: 'badge-p1',
      color: '#10b981',
      glowColor: 'rgba(16, 185, 129, 0.15)',
      description: 'Lowest credit default probability (< 5%). High net monthly income, clean payment history, and low trade-line utilization.',
      icon: ShieldCheck
    },
    {
      code: 'P2',
      title: 'Standard Moderate',
      badgeClass: 'badge-p2',
      color: '#3b82f6',
      glowColor: 'rgba(59, 130, 246, 0.15)',
      description: 'Low-to-moderate risk profile (5% - 15% default likelihood). Consistent repayment record with standard credit utilization.',
      icon: CheckCircle
    },
    {
      code: 'P3',
      title: 'Subprime Risk',
      badgeClass: 'badge-p3',
      color: '#f59e0b',
      glowColor: 'rgba(245, 158, 11, 0.15)',
      description: 'Elevated default probability (15% - 35%). Requires manual underwriting verification due to recent inquiries or delinquency.',
      icon: AlertTriangle
    },
    {
      code: 'P4',
      title: 'High Risk / Subprime',
      badgeClass: 'badge-p4',
      color: '#ef4444',
      glowColor: 'rgba(239, 68, 68, 0.15)',
      description: 'High default risk (> 35%). High delinquency rates, 30+ DPD history, or severe credit strain across multiple active accounts.',
      icon: ShieldAlert
    }
  ];

  return (
    <section style={{ position: 'relative', minHeight: 'calc(100vh - 40px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 0' }}>
      <div className="container-xl">
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 36px' }}>
          <div style={{
            fontSize: '0.85rem',
            color: '#06b6d4',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '8px'
          }}>
            ML Classification Matrix
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-4" style={{ color: 'var(--text-main)' }}>
            4-Tier Credit Risk Categorization
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Our predictive machine learning classifier evaluates applicant features against historical bureau trade lines to map creditworthiness into 4 risk tiers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <div 
                key={tier.code}
                className="glass-panel"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  background: tier.glowColor
                }}
              >
                {/* Top Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'var(--bg-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${tier.color}40`
                  }}>
                    <Icon size={20} color={tier.color} />
                  </div>
                  <span className={tier.badgeClass} style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 800 }}>
                    TIER {tier.code}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  {tier.title}
                </h3>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  {tier.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

