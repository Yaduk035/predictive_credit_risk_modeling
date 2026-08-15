# NeoBank AI Internal Credit Risk & Policy Manual (2026 Edition)

## Section 1: Risk Classification & Scoring Architecture

This manual establishes the underwriting principles, risk tier classifications, and compliance guidelines governing retail lending evaluations at NeoBank.

The quantitative XGBoost credit risk scoring model evaluates loan applicants based on bureau history depth, inquiry velocity, repayment stability, and trade line tenure, categorizing applicants into four risk tiers:

- **Tier P1 (Prime Safe)**: Established credit history depth (average oldest trade line > 80 months), long employer stability, strong standard trade line performance (`num_std`), and low inquiry velocity (`enq_L6m` ≤ 2).
- **Tier P2 (Standard Moderate Risk)**: Moderate credit history depth (`Age_Oldest_TL` 30–80 months), stable income stream, standard utilization, and controlled inquiry velocity (`enq_L6m` 1–4).
- **Tier P3 (Subprime / Elevated Risk)**: Shorter credit history (`Age_Oldest_TL` < 30 months), recent bureau inquiry activity (`enq_L6m` 2–5), or moderate debt ratio.
- **Tier P4 (Severe High Risk)**: High recent hard inquiry velocity (`enq_L6m` ≥ 5), recent credit-seeking behavior (`time_since_recent_enq` < 30 days), short tenure with current employer, or elevated recent delinquency levels (`max_deliq_12mts` > 6).

---

## Section 2: Underwriting Parameters & Metric Thresholds

### Policy Clause §2.1: Credit Bureau Hard Inquiry Velocity (`enq_L6m`, `tot_enq`, `time_since_recent_enq`)
- **Prime Inquiry Benchmark**: `enq_L6m` ≤ 2 inquiries in the last 6 months aligns with Tier P1 and Tier P2 scoring profiles.
- **High Inquiry Velocity Flag**: `enq_L6m` ≥ 5 hard inquiries within 6 months signals elevated credit seeking, placing the applicant in Tier P3 or Tier P4.
- **Recent Inquiry Recency**: Recent inquiry within 30 days (`time_since_recent_enq` < 30 days) increases risk tier weight towards Tier P4.

### Policy Clause §2.2: Bureau History Depth & Stability (`Age_Oldest_TL`, `num_std`, `Time_With_Curr_Empr`)
- **Established Credit Vintage**: `Age_Oldest_TL` ≥ 72 months (6+ years) combined with high standard account counts (`num_std` > 15) strongly correlates with Tier P1 eligibility.
- **Limited Vintage**: `Age_Oldest_TL` < 30 months limits auto-approval thresholds and generally places applicants in Tier P2 or Tier P3.

---

## Section 3: Policy Underwriting Protocols & Decision Guidelines

### Policy Clause §3.1: Tier P1 Underwriting Protocol (Prime Safe)
- **Guidance**: Automatic Approval at prime competitive interest rates.
- **Documentation**: Automated digital income verification.

### Policy Clause §3.2: Tier P2 Underwriting Protocol (Standard Moderate)
- **Guidance**: Auto-Approval at standard retail lending rates.
- **Documentation**: Standard payslip or bank statement verification.

### Policy Clause §3.3: Tier P3 Underwriting Protocol (Subprime Risk)
- **Guidance**: Manual Underwriter Review required.
- **Requirements**:
  1. Income tax return (ITR) or 6-month bank statement audit.
  2. Interest rate surcharge of +1.50% to +2.50% APR.
  3. Maximum loan amount capped at 6x net monthly income.

### Policy Clause §3.4: Tier P4 Underwriting Protocol (Severe High Risk)
- **Guidance**: Decline recommended or require 120% collateral security backing.
- **Override Protocol**: Requires Senior Credit Officer sign-off or a Tier P1 co-signer.
