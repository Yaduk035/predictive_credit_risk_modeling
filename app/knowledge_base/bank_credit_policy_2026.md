# NeoBank AI Internal Credit Risk & Policy Manual (2026 Edition)

## Section 1: Overview & Risk Tier Classification Architecture

This manual sets forth the credit underwriting parameters, risk tier assignments, and policy override thresholds for retail credit and personal loan applications.

All applicants are categorized into one of four Risk Tiers based on their bureau history and quantitative scoring models:
- **Tier P1 (Prime Safe)**: Minimal credit risk (< 5% default probability). High net income, clean repayment history (0 DPD), and low credit utilization (< 35%).
- **Tier P2 (Standard Moderate)**: Low to moderate risk (5% – 15% default probability). Stable credit history, standard utilization (< 65%), and zero recent 60+ DPD occurrences.
- **Tier P3 (Subprime Risk)**: Elevated default probability (15% – 35%). Flagged for elevated inquiries, high balance ratio (> 75%), or recent delinquencies (30+ DPD).
- **Tier P4 (Severe High Risk)**: High default risk (> 35%). History of 60+ DPD delinquencies, substandard (SUB) or doubtful (DBT) accounts, or total missed payments > 5.

---

## Section 2: Delinquency Thresholds & DPD Rules

### Policy Clause §2.1: 30+ Days Past Due (DPD) Limits
- **Tier P1 Eligibility**: Maximum 0 occurrences of 30+ DPD across all trade lines.
- **Tier P2 Eligibility**: Maximum 1 occurrence of 30+ DPD within the last 24 months, provided total missed payments equal zero in the last 6 months.
- **Tier P3 Categorization**: Triggered if the applicant has 2 to 4 occurrences of 30+ DPD or total missed payments between 1 and 3.
- **Tier P4 Categorization**: Triggered if the applicant has 5 or more occurrences of 30+ DPD or any single 90+ DPD event within the last 12 months.

### Policy Clause §2.2: 60+ Days Past Due (DPD) Mandates
- Any single occurrence of 60+ DPD automatically disqualifies the applicant from Tier P1 and Tier P2.
- Applications with 2 or more occurrences of 60+ DPD require mandatory decline or high-security collateral backing (minimum 120% loan-to-value ratio).

---

## Section 3: Income, Leverage, and Balance Ratio Limits

### Policy Clause §3.1: Net Monthly Income Thresholds
- **Minimum Income Baseline**: ₹15,000 net monthly income is required for personal loan consideration.
- **Prime Tier Income Baseline**: Applicants with net monthly income ≥ ₹75,000 with clean repayment history are granted automatic prime interest rate discounts (-1.25% APR).

### Policy Clause §3.2: Balance Ratio across Trade Lines (`pct_currentBal_all_TL`)
- **Healthy Ratio (< 0.50)**: Indicates low credit utilization.
- **Elevated Ratio (0.50 - 0.80)**: Standard credit leverage; monitored for revolving debt strain.
- **High Debt Ratio (> 0.80)**: Triggers subprime risk flag. Combined with 3+ bureau inquiries, the applicant is restricted to Tier P3 or Tier P4.

---

## Section 4: Bureau Inquiries & Hard Inquiry Velocity

### Policy Clause §4.1: Bureau Inquiry Limits (`tot_enq` & `enq_L6m`)
- **Inquiry Velocity Limit**: More than 4 credit bureau inquiries in the last 6 months (`enq_L6m > 4`) indicates credit hunger and increases default probability by 2.4x.
- **Personal Loan Specific Inquiries (`PL_enq_L6m`)**: More than 3 personal loan inquiries in 6 months requires underwriter review of existing active unsecured trade lines.

---

## Section 5: Policy Underwriting Guidance & Override Criteria

### Policy Clause §5.1: Tier P1 Underwriting Protocol
- **Guidance**: Immediate Auto-Approval at prime competitive interest rates.
- **Documentation**: Standard automated income verification.

### Policy Clause §5.2: Tier P2 Underwriting Protocol
- **Guidance**: Auto-Approval at standard lending rates.
- **Documentation**: Payslip verification for past 3 months.

### Policy Clause §5.3: Tier P3 Underwriting Protocol
- **Guidance**: Manual Underwriter Review required.
- **Requirements**:
  1. Mandatory income tax return (ITR) or bank statement audit for 6 months.
  2. Interest rate surcharge of +1.50% to +2.50% APR.
  3. Maximum loan-to-income ratio capped at 6x net monthly income.

### Policy Clause §5.4: Tier P4 Underwriting Protocol
- **Guidance**: Decline recommended or require 120% collateral security deposit.
- **Override Exception**: May only be overridden by the Senior Credit Risk Officer if a prime co-signer (Tier P1) guarantees the liability.
