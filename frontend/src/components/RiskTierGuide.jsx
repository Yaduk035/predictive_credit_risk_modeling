import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';

export default function RiskTierGuide() {
  const tiers = [
    {
      code: 'P1',
      title: 'Prime Safe',
      badgeClass: 'badge-p1',
      color: '#10b981',
      glowColor: 'rgba(16, 185, 129, 0.15)',
      description: 'Lowest credit default probability (< 5%). High net monthly income, clean payment history, and low trade-line utilization.',
      action: 'Instant Auto-Approve (Prime Rates)',
      icon: ShieldCheck,
      criteria: ['0 Delinquency in 12M', 'High Income Stability', 'Low Utilization (<25%)']
    },
    {
      code: 'P2',
      title: 'Standard Moderate',
      badgeClass: 'badge-p2',
      color: '#3b82f6',
      glowColor: 'rgba(59, 130, 246, 0.15)',
      description: 'Low-to-moderate risk profile (5% - 15% default likelihood). Consistent repayment record with standard credit utilization.',
      action: 'Auto-Approve (Standard Rates)',
      icon: CheckCircle,
      criteria: ['Max 1 Missed Payment', 'Balanced Credit Bureau Age', 'Standard Utilization']
    },
    {
      code: 'P3',
      title: 'Subprime Risk',
      badgeClass: 'badge-p3',
      color: '#f59e0b',
      glowColor: 'rgba(245, 158, 11, 0.15)',
      description: 'Elevated default probability (15% - 35%). Requires manual underwriting verification due to recent inquiries or delinquency.',
      action: 'Manual Underwriter Review',
      icon: AlertTriangle,
      criteria: ['Recent Bureau Inquiries', 'Elevated Credit Utilization', 'Minor DPD Records']
    },
    {
      code: 'P4',
      title: 'High Risk / Subprime',
      badgeClass: 'badge-p4',
      color: '#ef4444',
      glowColor: 'rgba(239, 68, 68, 0.15)',
      description: 'High default risk (> 35%). High delinquency rates, 30+ DPD history, or severe credit strain across multiple active accounts.',
      action: 'Decline / Collateral Required',
      icon: ShieldAlert,
      criteria: ['Multiple 30p+ DPD Delinquencies', 'High Credit Strain', 'Overdue Trade Lines']
    }
  ];

  return (
    <section style={{ padding: '60px 0', position: 'relative' }}>
      <div className="container-xl">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
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
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '16px' }}>
            4-Tier Credit Risk Categorization
          </h2>
          <p style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: 1.6 }}>
            Our XGBoost classifier evaluates applicant features against historical bureau trade lines to map creditworthiness into 4 actionable risk tiers.
          </p>
        </div>

        <div className="grid-4">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <div 
                key={tier.code}
                className="glass-panel"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: tier.glowColor
                }}
              >
                <div>
                  {/* Top Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1px solid ${tier.color}40`
                    }}>
                      <Icon size={22} color={tier.color} />
                    </div>
                    <span className={tier.badgeClass} style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 800 }}>
                      TIER {tier.code}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                    {tier.title}
                  </h3>

                  <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '20px' }}>
                    {tier.description}
                  </p>

                  {/* Criteria Checklist */}
                  <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
                      Key Indicators:
                    </div>
                    {tier.criteria.map((item, idx) => (
                      <div key={idx} style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: tier.color }}></span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Underwriting Action */}
                <div style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingTop: '16px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: tier.color,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span>Policy Action:</span>
                  <span style={{ color: '#ffffff' }}>{tier.action}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
