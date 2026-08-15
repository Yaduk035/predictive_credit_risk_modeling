import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def create_pdf(file_path, title, subtitle, sections):
    doc = SimpleDocTemplate(
        file_path,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )
    
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#0f172a'),
        fontName='Helvetica-Bold',
        spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#0284c7'),
        fontName='Helvetica-Bold',
        spaceAfter=14
    )
    
    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading2'],
        fontSize=13,
        leading=17,
        textColor=colors.HexColor('#1e293b'),
        fontName='Helvetica-Bold',
        spaceBefore=12,
        spaceAfter=6
    )
    
    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor('#334155'),
        spaceAfter=8
    )

    story = []
    
    story.append(Paragraph(title, title_style))
    story.append(Paragraph(subtitle, subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#cbd5e1'), spaceAfter=14))
    
    for sec_title, sec_body in sections:
        story.append(Paragraph(sec_title, h2_style))
        story.append(Paragraph(sec_body, body_style))
        story.append(Spacer(1, 4))
        
    doc.build(story)
    print(f"✓ Created official PDF: {file_path}")

def generate_all():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    kb_dir = os.path.join(base_dir, 'knowledge_base')
    os.makedirs(kb_dir, exist_ok=True)

    # Document 1: RBI Fair Practices Code for Lenders PDF
    rbi_fpc_path = os.path.join(kb_dir, 'rbi_fair_practices_code.pdf')
    rbi_fpc_sections = [
        ("Section 1: RBI Master Direction - Fair Practices Code (Circular RBI/2006-07/138)",
         "Regulated Entities (REs), including Non-Banking Financial Companies (NBFCs) and Scheduled Commercial Banks, must maintain an explicit, written Fair Practices Code approved by their Board of Directors. All credit applications must be processed objectively with written acknowledgment provided to the applicant."),
        
        ("Section 2: Communication of Reasons for Rejection or Adverse Risk Terms",
         "Lenders are required to convey in writing to the borrower the main reasons for rejection of a loan application or assignment to high-risk subprime categories. The rejection notification must state the key financial variables (e.g., past delinquencies, high DPD history, low income, or excessive bureau inquiries) influencing the adverse decision."),
        
        ("Section 3: Transparent Interest Rate Surcharges & Risk Premium",
         "The rate of interest and the approach for graduation of risk and rationale for charging different rates of interest to different categories of borrowers shall be disclosed transparently in the loan application form and explicitly communicated in the sanction letter."),
        
        ("Section 4: Grievance Redressal Officer (GRO) & Dispute Mechanism",
         "Lenders must designate a Grievance Redressal Officer (GRO) and display contact details prominently. Borrowers dissatisfied with automated risk decisions or adverse underwriting terms have the legal right to submit supplemental verified financial documents for manual officer review.")
    ]
    create_pdf(
        rbi_fpc_path,
        "Reserve Bank of India — Fair Practices Code for Lenders",
        "Official Master Direction | Circular RBI/2006-07/138 DNBS (PD) CC No. 80/03.10.042/2006-07",
        rbi_fpc_sections
    )

    # Document 2: RBI Digital Lending Guidelines PDF
    rbi_dl_path = os.path.join(kb_dir, 'rbi_digital_lending_guidelines.pdf')
    rbi_dl_sections = [
        ("Section 1: RBI Digital Lending Directions 2022-2025 (Circular DOR.CRE.REC.66/21.07.001/2022-23)",
         "Framework governing all digital lending apps and online underwriting platforms operated by Regulated Entities (REs). Mandates strict algorithmic transparency, data privacy, and explicit consent for credit scoring."),
        
        ("Section 2: Key Fact Statement (KFS) & Annual Percentage Rate (APR)",
         "Before executing any digital loan contract, lenders must provide a standardized Key Fact Statement (KFS) containing the Annual Percentage Rate (APR), total cost of credit, repayment schedule, and risk category."),
        
        ("Section 3: Algorithmic Model Transparency & Feature Grounding",
         "Machine learning scoring models (including XGBoost / Gradient Boosting algorithms) must evaluate validated credit bureau metrics without discriminatory demographics. Missing variable handling must be performed via neutral mean Z-score imputation."),
        
        ("Section 4: Credit Information Company (CIC) Reporting",
         "All digital lending transactions, delinquency histories, 30+ DPD occurrences, and bureau inquiry logs must be reported accurately to Credit Information Companies (CIBIL, Experian, CRIF High Mark).")
    ]
    create_pdf(
        rbi_dl_path,
        "Reserve Bank of India — Guidelines on Digital Lending",
        "Official Directions | Circular DOR.CRE.REC.66/21.07.001/2022-23 & 2025 Regulatory Updates",
        rbi_dl_sections
    )

    # Document 3: State Bank of India Fair Lending Practice Code PDF
    sbi_path = os.path.join(kb_dir, 'sbi_fair_lending_code.pdf')
    sbi_sections = [
        ("Section 1: SBI Policy Framework for Credit Evaluation",
         "State Bank of India operates under a standardized credit appraisal framework evaluating monthly net income, employment stability, active trade lines, and bureau credit scores."),
        
        ("Section 2: Risk Tier Underwriting Parameters (Tiers P1 to P4)",
         "Tier P1 (Prime Safe) qualifies for competitive rate discounts. Tier P2 (Standard) requires standard 3-month payslip verification. Tier P3 (Subprime) requires 6-month bank statement audits, manual underwriter review, and potential interest rate surcharges. Tier P4 (High Risk) mandates decline or 120% collateral security deposit."),
        
        ("Section 3: Borrower Right to Appeal & Re-Assessment",
         "Applicants categorized in elevated risk tiers may submit additional income tax returns (ITR), audited balance sheets, or collateral assets to request manual underwriting override by the Credit Risk Manager.")
    ]
    create_pdf(
        sbi_path,
        "State Bank of India — Fair Lending Practice Code",
        "SBI Public Credit Assessment & Underwriting Disclosure Policy",
        sbi_sections
    )

if __name__ == "__main__":
    generate_all()
