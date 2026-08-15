# Reserve Bank of India (RBI) Digital Lending & Regulatory Compliance Framework

## Section 1: RBI Digital Lending Directions (Circular RBI/2022-23/111 DOR.FIN.REC.65/24.10.002/2022-23)

### Regulatory Rule §1.1: Algorithmic Model Transparency & Disclosure
Under RBI Digital Lending Guidelines, Regulated Entities (REs) utilizing automated credit scoring or machine learning risk models must ensure transparent, auditable evaluation logic. Automated credit assessments must explicitly map financial variables (income, active trade lines, delinquency records) to risk outcomes.

### Regulatory Rule §1.2: Adverse Action & Rejection Communication Mandates
In accordance with the RBI Fair Practices Code (FPC) and Digital Lending Guidelines, when a loan application is declined or assigned to a subprime high-risk tier (Tiers P3 / P4) carrying adverse terms, the RE is required to communicate the specific principal reasons for rejection (e.g., delinquency history, high DPD, credit inquiry velocity, or excessive debt leverage).

---

## Section 2: RBI Fair Practices Code (FPC) for Lenders & Borrower Rights

### Regulatory Rule §2.1: Non-Discriminatory Automated Credit Assessment
Lending decisions must be based on objective credit risk parameters derived from bureau reports and verified financial statements. Demographics such as age may only be used to confirm legal contractual capacity under the Indian Contract Act, 1872 (minimum 18 years).

### Regulatory Rule §2.2: Grievance Redressal & Underwriter Manual Review
Borrowers categorized under high-risk subprime tiers (P3 / P4) have the right to approach the lender's Grievance Redressal Officer (GRO) or request manual underwriter re-assessment upon providing supplemental verified income documents or collateral. Unresolved grievances can be escalated to the RBI Complaint Management System (CMS) portal.

---

## Section 3: Credit Information Companies (Regulation) Act, 2005 (CICRA 2005)

### Regulatory Rule §3.1: Bureau Data Freshness & Data Dictionary Compliance
Risk models must normalize incoming feature payloads against standard credit bureau data dictionaries (e.g., TransUnion CIBIL, Experian, CRIF High Mark) to prevent improper classification caused by missing or unscaled variables.

### Regulatory Rule §3.2: Statistical Imputation Neutrality
Lenders utilizing statistical imputation (such as Z-score neutral mean imputation) for missing applicant parameters must ensure that missing variables are imputed neutrally without unfairly degrading an applicant's credit score.
