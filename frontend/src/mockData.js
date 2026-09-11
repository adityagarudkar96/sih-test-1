// Mock Data Store for Frontend-Only GeM Compliance Platform
// Designed for instant demo and Vercel deployment with full interactive persistence in localStorage.

export const USERS = [
  {
    id: "user-officer-1",
    email: "officer@gem-demo.gov.in",
    password: "officer123",
    name: "Dr. Rajesh Kumar",
    role: "officer",
    organization: "Government e-Marketplace (GeM)",
    department: "Department of Health & Family Welfare"
  },
  {
    id: "user-bidder-xyz",
    email: "xyz@bidder.com",
    password: "bidder123",
    name: "Anil Mehta",
    role: "bidder",
    organization: "XYZ Industries Pvt Ltd",
    bidder_id: "bidder-xyz"
  },
  {
    id: "user-bidder-abc",
    email: "abc@bidder.com",
    password: "bidder123",
    name: "Priya Sharma",
    role: "bidder",
    organization: "ABC Technologies Pvt Ltd",
    bidder_id: "bidder-abc"
  },
  {
    id: "user-bidder-quick",
    email: "quick@bidder.com",
    password: "bidder123",
    name: "Vikram Singh",
    role: "bidder",
    organization: "QuickSupply Pvt Ltd",
    bidder_id: "bidder-quick"
  }
];

export const DEPARTMENTS = [
  { id: "dept-1", name: "Department of Health & Family Welfare", code: "DHFW", description: "Healthcare procurement" },
  { id: "dept-2", name: "Ministry of Education", code: "MOE", description: "Education technology procurement" },
  { id: "dept-3", name: "Ministry of Railways", code: "MOR", description: "Railway equipment procurement" },
  { id: "dept-4", name: "Ministry of Rural Development", code: "MORD", description: "Rural development procurement" }
];

export const BIDDERS = {
  "bidder-abc": {
    id: "bidder-abc",
    user_id: "user-bidder-abc",
    company_name: "ABC Technologies Pvt Ltd",
    gstin: "29ABCDE5678F1G2",
    pan: "ABCDE5678F",
    udyam_number: "UDYAM-KA-00-7654321",
    state: "Karnataka",
    enterprise_type: "Medium"
  },
  "bidder-xyz": {
    id: "bidder-xyz",
    user_id: "user-bidder-xyz",
    company_name: "XYZ Industries Pvt Ltd",
    gstin: "27XYZAB1234C1Z5",
    pan: "XYZAB1234C",
    udyam_number: "UDYAM-MH-00-1234567",
    state: "Maharashtra",
    enterprise_type: "Small"
  },
  "bidder-quick": {
    id: "bidder-quick",
    user_id: "user-bidder-quick",
    company_name: "QuickSupply Pvt Ltd",
    gstin: "07QSRST9012H3I4",
    pan: "QSRST9012H",
    udyam_number: "UDYAM-DL-00-9999999",
    state: "Delhi",
    enterprise_type: "Micro"
  }
};

export const INITIAL_TENDERS = [
  {
    id: "tender-1",
    tender_number: "GEM-2026-001",
    title: "Supply of Medical Diagnostic Equipment",
    department: "Department of Health & Family Welfare",
    department_id: "dept-1",
    category: "Medical Equipment",
    estimated_value: "₹2.5 Crore",
    closing_date: "30 September 2026",
    status: "ACTIVE",
    description: "Procurement of digital diagnostic imaging systems and multi-parameter monitors for district civil hospitals across state networks.",
    pdf_filename: "GEM-2026-001.pdf",
    analysis_status: "COMPLETED",
    analysis_result: {
      summary: "High priority health infrastructure procurement. Rigorous technical specifications and Indian standard certifications applicable.",
      requirements_count: 8
    },
    requirements: [
      { id: "req-1-1", name: "GST Registration", description: "Valid GST registration is mandatory (Status must be Active)", mandatory: true, required_document: "GST Certificate", threshold: null, verification_source: "GST", weight: 20, sort_order: 0 },
      { id: "req-1-2", name: "PAN Verification", description: "Valid PAN card in the entity legal name is mandatory", mandatory: true, required_document: "PAN Card", threshold: null, verification_source: "PAN", weight: 15, sort_order: 1 },
      { id: "req-1-3", name: "Udyam/MSME Registration", description: "Valid Udyam/MSME registration is mandatory for vendor category verification", mandatory: true, required_document: "Udyam Certificate", threshold: null, verification_source: "Udyam", weight: 15, sort_order: 2 },
      { id: "req-1-4", name: "Income Tax Return", description: "Income Tax Return for assessment year 2025-26 must be filed", mandatory: true, required_document: "ITR", threshold: null, verification_source: "Income Tax", weight: 15, sort_order: 3 },
      { id: "req-1-5", name: "EPFO Compliance", description: "EPFO statutory compliance is required for technical eligibility", mandatory: true, required_document: "EPFO Certificate", threshold: null, verification_source: "EPFO", weight: 10, sort_order: 4 },
      { id: "req-1-6", name: "Local Content", description: "Minimum local content (Make in India) shall be at least 50%", mandatory: true, required_document: "Local Content Declaration", threshold: ">=50%", verification_source: "Tender Rule", weight: 15, sort_order: 5 },
      { id: "req-1-7", name: "OEM Authorization", description: "OEM authorization certificate is required from primary manufacturer", mandatory: true, required_document: "OEM Authorization Letter", threshold: null, verification_source: "OEM", weight: 5, sort_order: 6 },
      { id: "req-1-8", name: "Non-Debarment", description: "Bidder must not be debarred, blacklisted, or suspended by any government agency", mandatory: true, required_document: "Debarment Declaration", threshold: null, verification_source: "Debarment", weight: 5, sort_order: 7 }
    ]
  },
  {
    id: "tender-2",
    tender_number: "GEM-2026-002",
    title: "Supply of Smart Classroom Equipment",
    department: "Ministry of Education",
    department_id: "dept-2",
    category: "IT Hardware / Educational Technology",
    estimated_value: "₹1.8 Crore",
    closing_date: "30 September 2026",
    status: "ACTIVE",
    description: "Supply, installation and commissioning of interactive flat panels, digital podiums, and smart classroom setups in 120 government schools.",
    pdf_filename: "GEM-2026-002.pdf",
    analysis_status: "PENDING",
    analysis_result: null,
    requirements: [
      { id: "req-2-1", name: "GST Registration", description: "Valid GST registration is mandatory", mandatory: true, required_document: "GST Certificate", threshold: null, verification_source: "GST", weight: 20, sort_order: 0 },
      { id: "req-2-2", name: "PAN Verification", description: "Valid PAN is mandatory", mandatory: true, required_document: "PAN Card", threshold: null, verification_source: "PAN", weight: 15, sort_order: 1 },
      { id: "req-2-3", name: "Udyam/MSME Registration", description: "Valid Udyam/MSME registration is mandatory", mandatory: true, required_document: "Udyam Certificate", threshold: null, verification_source: "Udyam", weight: 15, sort_order: 2 },
      { id: "req-2-4", name: "Income Tax Return", description: "ITR for applicable assessment year must be filed", mandatory: true, required_document: "ITR", threshold: null, verification_source: "Income Tax", weight: 15, sort_order: 3 },
      { id: "req-2-5", name: "OEM Authorization", description: "OEM authorization is required", mandatory: true, required_document: "OEM Authorization Letter", threshold: null, verification_source: "OEM", weight: 10, sort_order: 4 },
      { id: "req-2-6", name: "Local Content", description: "Minimum local content shall be 50%", mandatory: true, required_document: "Local Content Declaration", threshold: ">=50%", verification_source: "Tender Rule", weight: 15, sort_order: 5 },
      { id: "req-2-7", name: "Non-Debarment", description: "Bidder must not be debarred or blacklisted", mandatory: true, required_document: "Debarment Declaration", threshold: null, verification_source: "Debarment", weight: 10, sort_order: 6 }
    ]
  },
  {
    id: "tender-3",
    tender_number: "GEM-2026-003",
    title: "Supply of Industrial Safety Equipment",
    department: "Ministry of Railways",
    department_id: "dept-3",
    category: "Safety Equipment",
    estimated_value: "₹4.2 Crore",
    closing_date: "30 September 2026",
    status: "ACTIVE",
    description: "Annual rate contract for personal protective gear, fire-resistant suits, and emergency breathing apparatus for railway maintenance workshops.",
    pdf_filename: "GEM-2026-003.pdf",
    analysis_status: "PENDING",
    analysis_result: null,
    requirements: [
      { id: "req-3-1", name: "GST Registration", description: "Valid GST registration is mandatory", mandatory: true, required_document: "GST Certificate", threshold: null, verification_source: "GST", weight: 15, sort_order: 0 },
      { id: "req-3-2", name: "PAN Verification", description: "Valid PAN is mandatory", mandatory: true, required_document: "PAN Card", threshold: null, verification_source: "PAN", weight: 10, sort_order: 1 },
      { id: "req-3-3", name: "Udyam/MSME Registration", description: "Valid Udyam/MSME registration is mandatory", mandatory: true, required_document: "Udyam Certificate", threshold: null, verification_source: "Udyam", weight: 10, sort_order: 2 },
      { id: "req-3-4", name: "EPFO Compliance", description: "EPFO compliance is required", mandatory: true, required_document: "EPFO Certificate", threshold: null, verification_source: "EPFO", weight: 10, sort_order: 3 },
      { id: "req-3-5", name: "ESIC Compliance", description: "ESIC compliance is required", mandatory: true, required_document: "ESIC Certificate", threshold: null, verification_source: "ESIC", weight: 10, sort_order: 4 },
      { id: "req-3-6", name: "Local Content", description: "Minimum local content shall be 50%", mandatory: true, required_document: "Local Content Declaration", threshold: ">=50%", verification_source: "Tender Rule", weight: 15, sort_order: 5 },
      { id: "req-3-7", name: "BIS Certification", description: "BIS certification is required for safety equipment", mandatory: true, required_document: "BIS Certificate", threshold: null, verification_source: "BIS", weight: 10, sort_order: 6 },
      { id: "req-3-8", name: "OEM Authorization", description: "OEM authorization is required", mandatory: true, required_document: "OEM Authorization Letter", threshold: null, verification_source: "OEM", weight: 10, sort_order: 7 },
      { id: "req-3-9", name: "Non-Debarment", description: "Bidder must not be debarred or blacklisted", mandatory: true, required_document: "Debarment Declaration", threshold: null, verification_source: "Debarment", weight: 10, sort_order: 8 }
    ]
  },
  {
    id: "tender-4",
    tender_number: "GEM-2026-004",
    title: "Supply of Solar Water Pumping Systems",
    department: "Ministry of Rural Development",
    department_id: "dept-4",
    category: "Renewable Energy Equipment",
    estimated_value: "₹3.1 Crore",
    closing_date: "30 September 2026",
    status: "ACTIVE",
    description: "Design, supply, installation and maintenance of 5HP solar submersible pump sets for rural water supply schemes.",
    pdf_filename: "GEM-2026-004.pdf",
    analysis_status: "PENDING",
    analysis_result: null,
    requirements: [
      { id: "req-4-1", name: "GST Registration", description: "Valid GST registration is mandatory", mandatory: true, required_document: "GST Certificate", threshold: null, verification_source: "GST", weight: 15, sort_order: 0 },
      { id: "req-4-2", name: "PAN Verification", description: "Valid PAN is mandatory", mandatory: true, required_document: "PAN Card", threshold: null, verification_source: "PAN", weight: 10, sort_order: 1 },
      { id: "req-4-3", name: "Udyam/MSME Registration", description: "Valid Udyam/MSME registration is mandatory", mandatory: true, required_document: "Udyam Certificate", threshold: null, verification_source: "Udyam", weight: 10, sort_order: 2 },
      { id: "req-4-4", name: "Income Tax Return", description: "ITR for applicable assessment year must be filed", mandatory: true, required_document: "ITR", threshold: null, verification_source: "Income Tax", weight: 10, sort_order: 3 },
      { id: "req-4-5", name: "Local Content", description: "Minimum local content shall be 50%", mandatory: true, required_document: "Local Content Declaration", threshold: ">=50%", verification_source: "Tender Rule", weight: 15, sort_order: 4 },
      { id: "req-4-6", name: "OEM Authorization", description: "OEM authorization is required", mandatory: true, required_document: "OEM Authorization Letter", threshold: null, verification_source: "OEM", weight: 10, sort_order: 5 },
      { id: "req-4-7", name: "BIS Certification", description: "BIS certification for solar equipment", mandatory: true, required_document: "BIS Certificate", threshold: null, verification_source: "BIS", weight: 10, sort_order: 6 },
      { id: "req-4-8", name: "Startup/MSME Declaration", description: "Startup/MSME declaration is required", mandatory: false, required_document: "Startup Declaration", threshold: null, verification_source: "MSME", weight: 10, sort_order: 7 },
      { id: "req-4-9", name: "Non-Debarment", description: "Bidder must not be debarred or blacklisted", mandatory: true, required_document: "Debarment Declaration", threshold: null, verification_source: "Debarment", weight: 10, sort_order: 8 }
    ]
  }
];

// Fallback document data for the 3 demo bidders
export const BIDDER_DOC_DATA = {
  ABC: {
    "GST Certificate": { legal_name: "ABC Technologies Private Limited", trade_name: "ABC Technologies Pvt Ltd", gstin: "29ABCDE5678F1G2", status: "ACTIVE", registration_date: "10/01/2020", state: "Karnataka" },
    "PAN Card": { name: "ABC TECHNOLOGIES PRIVATE LIMITED", pan: "ABCDE5678F", entity_type: "Company" },
    "Udyam Certificate": { enterprise_name: "ABC Technologies Pvt Ltd", udyam_number: "UDYAM-KA-00-7654321", enterprise_type: "Medium", major_activity: "Manufacturing", state: "Karnataka", registration_date: "15/02/2020" },
    "ITR": { assessee_name: "ABC Technologies Private Limited", pan: "ABCDE5678F", assessment_year: "2025-26", return_status: "FILED", filing_date: "15/07/2025" },
    "EPFO Certificate": { establishment_name: "ABC Technologies Pvt Ltd", establishment_id: "KA/BLR/DEMO/67890", status: "COMPLIANT", last_contribution_month: "August 2026" },
    "Local Content Declaration": { bidder_name: "ABC Technologies Pvt Ltd", local_content_percentage: 75, class: "Class-I Local Supplier — DEMO", manufacturing_location: "Bengaluru, Karnataka" },
    "OEM Authorization Letter": { bidder_name: "ABC Technologies Pvt Ltd", oem_name: "Demo Technology OEM", authorization_status: "VALID — DEMO", authorization_date: "15/06/2026" },
    "Debarment Declaration": { bidder_name: "ABC Technologies Pvt Ltd", self_declaration: "No known debarment/blacklisting", connector_status: "CLEAR", status: "PASS" }
  },
  XYZ: {
    "GST Certificate": { legal_name: "XYZ Industries Private Limited", trade_name: "XYZ Industries Pvt Ltd", gstin: "27XYZAB1234C1Z5", status: "ACTIVE", registration_date: "15/04/2022", state: "Maharashtra" },
    "PAN Card": { name: "XYZ INDUSTRIES PRIVATE LIMITED", pan: "XYZAB1234C", entity_type: "Company" },
    "Udyam Certificate": { enterprise_name: "XYZ Industries Pvt Ltd", udyam_number: "UDYAM-MH-00-1234567", enterprise_type: "Small", major_activity: "Manufacturing", state: "Maharashtra", registration_date: "20/04/2022" },
    "ITR": { assessee_name: "XYZ Industries Private Limited", pan: "XYZAB1234C", assessment_year: "2025-26", return_status: "FILED", filing_date: "30/09/2025" },
    "EPFO Certificate": { establishment_name: "XYZ Industries Pvt Ltd", establishment_id: "MH/PUN/DEMO/12345", status: "COMPLIANT", last_contribution_month: "August 2026" },
    "Local Content Declaration": { bidder_name: "XYZ Industries Pvt Ltd", local_content_percentage: 62, class: "Class-I Local Supplier — DEMO", manufacturing_location: "Pune, Maharashtra" },
    "OEM Authorization Letter": { bidder_name: "XYZ Industries Pvt Ltd", oem_name: "Demo Medical Equipment Manufacturer", authorization_status: "VALID — DEMO", authorization_date: "01/08/2026" },
    "Debarment Declaration": { bidder_name: "XYZ Industries Pvt Ltd", self_declaration: "No known debarment/blacklisting", connector_status: "CLEAR", status: "PASS" }
  },
  QuickSupply: {
    "GST Certificate": { legal_name: "QuickSupply Private Limited", trade_name: "QuickSupply Pvt Ltd", gstin: "07QSRST9012H3I4", status: "SUSPENDED", registration_date: "01/06/2023", state: "Delhi" },
    "PAN Card": { name: "QUICKSUPPLY PRIVATE LIMITED", pan: "QSRST9012H", entity_type: "Company" },
    "Udyam Certificate": { enterprise_name: "QuickSupply Pvt Ltd", udyam_number: "UDYAM-DL-00-9999999", enterprise_type: "Micro", major_activity: "Trading", state: "Delhi", registration_date: "05/06/2023" },
    "ITR": { assessee_name: "QuickSupply Private Limited", pan: "QSRST9012H", assessment_year: "2025-26", return_status: "NOT_FILED", filing_date: null },
    "EPFO Certificate": { establishment_name: "QuickSupply Pvt Ltd", establishment_id: "DL/DEMO/99999", status: "NON_COMPLIANT", last_contribution_month: "January 2025" },
    "Local Content Declaration": { bidder_name: "QuickSupply Pvt Ltd", local_content_percentage: 28, class: "Non-Local Supplier — DEMO", manufacturing_location: "Imported" },
    "OEM Authorization Letter": { bidder_name: "QuickSupply Pvt Ltd", oem_name: "Unknown OEM", authorization_status: "EXPIRED — DEMO", authorization_date: "01/01/2024" },
    "Debarment Declaration": { bidder_name: "QuickSupply Pvt Ltd", self_declaration: "No known debarment/blacklisting", connector_status: "FLAGGED", status: "FLAGGED" }
  }
};

// Helper: build documents list for an application
function buildDocumentsForBidder(appId, requirements, bidderKey) {
  const dataMap = BIDDER_DOC_DATA[bidderKey] || {};
  return requirements.map((req, idx) => {
    const docType = (req.required_document || "").replace(/ /g, "_");
    const extracted = dataMap[req.required_document] || { details: "Uploaded Document" };
    return {
      id: `doc-${appId}-${idx}`,
      application_id: appId,
      requirement_id: req.id,
      document_type: docType,
      original_filename: `${docType}.pdf`,
      processing_status: "EXTRACTED",
      extracted_data: extracted,
      confidence: 95.0,
      fields: Object.entries(extracted).map(([k, v]) => ({
        field_name: k,
        field_value: String(v),
        confidence: 95.0
      }))
    };
  });
}

// Helper: evaluate verification checks deterministically
export function runVerificationRules(app, requirements, bidderKey) {
  const docData = BIDDER_DOC_DATA[bidderKey] || {};
  const checks = [];
  let earnedWeight = 0;
  let totalWeight = 0;
  let passed = 0;
  let failed = 0;
  let review = 0;
  let hasMandatoryFail = false;
  let hasDebarmentFlag = false;

  requirements.forEach((req, idx) => {
    totalWeight += req.weight || 10;
    const extracted = docData[req.required_document] || {};
    let status = "PASS";
    let reason = "Verified successfully against statutory records";
    let confidence = 96;
    let verifiedValue = {};

    if (req.verification_source === "GST") {
      const gstStatus = (extracted.status || "").toUpperCase();
      verifiedValue = { gstin: extracted.gstin, legal_name: extracted.legal_name, status: gstStatus, source: "GSTN Portal API" };
      if (gstStatus !== "ACTIVE") {
        status = "FAIL";
        reason = `GST status is ${gstStatus || "INACTIVE"}, expected ACTIVE`;
        confidence = 98;
        if (req.mandatory) hasMandatoryFail = true;
      } else {
        reason = "GST verification passed — GSTIN active and verified in GSTN portal";
      }
    } else if (req.verification_source === "PAN") {
      verifiedValue = { pan: extracted.pan, name: extracted.name, status: "VALID", source: "Income Tax e-Filing API" };
      status = "PASS";
      reason = "PAN verification passed — format and active PAN record validated";
    } else if (req.verification_source === "Udyam") {
      verifiedValue = { udyam_number: extracted.udyam_number, enterprise_name: extracted.enterprise_name, enterprise_type: extracted.enterprise_type, source: "Udyam Registration Portal" };
      status = "PASS";
      reason = "Udyam verification passed — valid MSME enterprise record found";
    } else if (req.verification_source === "Income Tax") {
      const returnStatus = (extracted.return_status || "").toUpperCase();
      verifiedValue = { pan: extracted.pan, assessment_year: extracted.assessment_year, return_status: returnStatus, source: "Income Tax e-Filing Portal" };
      if (returnStatus === "FILED") {
        status = "PASS";
        reason = "Income Tax Return for AY 2025-26 filed and verified";
      } else {
        status = "FAIL";
        reason = "Income Tax Return not filed for AY 2025-26";
        confidence = 98;
        if (req.mandatory) hasMandatoryFail = true;
      }
    } else if (req.verification_source === "EPFO") {
      const epfoStatus = (extracted.status || "").toUpperCase();
      verifiedValue = { establishment_id: extracted.establishment_id, status: epfoStatus, source: "EPFO Unified Portal" };
      if (epfoStatus === "COMPLIANT") {
        status = "PASS";
        reason = "EPFO compliance verified — regular monthly contributions verified";
      } else {
        status = "FAIL";
        reason = "EPFO non-compliant — outstanding dues detected";
        confidence = 97;
        if (req.mandatory) hasMandatoryFail = true;
      }
    } else if (req.verification_source === "Tender Rule" && req.name.includes("Local Content")) {
      const localPct = Number(extracted.local_content_percentage || 0);
      verifiedValue = { local_content_percentage: `${localPct}%`, class: extracted.class, source: "Local Content Self-Declaration" };
      if (localPct >= 50) {
        status = "PASS";
        reason = `Local content ${localPct}% meets tender requirement of >=50% (Class-I Supplier)`;
      } else {
        status = "FAIL";
        reason = `Local content ${localPct}% below minimum threshold of 50%`;
        confidence = 92;
        if (req.mandatory) hasMandatoryFail = true;
      }
    } else if (req.verification_source === "OEM") {
      const authStatus = (extracted.authorization_status || "").toUpperCase();
      verifiedValue = { oem_name: extracted.oem_name, authorization_status: extracted.authorization_status, source: "OEM Verification System" };
      if (authStatus.includes("VALID")) {
        status = "PASS";
        reason = "OEM authorization is valid and current";
      } else {
        status = "FAIL";
        reason = "OEM authorization has expired or is invalid";
        confidence = 95;
        if (req.mandatory) hasMandatoryFail = true;
      }
    } else if (req.verification_source === "Debarment") {
      const connStatus = (extracted.connector_status || "CLEAR").toUpperCase();
      verifiedValue = { status: connStatus, source: "GeM Debarment & Blacklist Registry" };
      if (connStatus === "CLEAR") {
        status = "PASS";
        reason = "No debarment or blacklisting records found across state/central registries";
      } else {
        status = "FAIL";
        reason = "Debarment/blacklisting flag detected — vendor is flagged in Central Registry";
        confidence = 99;
        hasDebarmentFlag = true;
        if (req.mandatory) hasMandatoryFail = true;
      }
    } else {
      verifiedValue = { status: "VERIFIED", source: "Document Analysis" };
      status = "PASS";
      reason = `${req.name} provided and verified`;
    }

    if (status === "PASS") {
      earnedWeight += req.weight || 10;
      passed++;
    } else if (status === "FAIL") {
      failed++;
    } else {
      earnedWeight += (req.weight || 10) * 0.5;
      review++;
    }

    checks.push({
      id: `check-${app.id}-${idx}`,
      verification_id: `VER-${String(idx + 101).padStart(4, "0")}`,
      application_id: app.id,
      requirement_id: req.id,
      requirement: req,
      document: {
        id: `doc-${app.id}-${idx}`,
        document_type: (req.required_document || "").replace(/ /g, "_"),
        original_filename: `${(req.required_document || "").replace(/ /g, "_")}.pdf`
      },
      extracted_value: extracted,
      verified_value: verifiedValue,
      verification_source: verifiedValue.source || req.verification_source,
      status,
      reason,
      confidence,
      evidence: {
        extracted,
        verified: verifiedValue,
        rule_applied: `${req.verification_source}_RULE`,
        details: { verified_by: "Deterministic Compliance Engine" }
      },
      verified_at: new Date().toISOString()
    });
  });

  const score = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100 * 10) / 10 : 0;
  let risk = "LOW";
  if (score < 60 || hasMandatoryFail || hasDebarmentFlag) {
    risk = "HIGH";
  } else if (score < 85 || review > 0) {
    risk = "MEDIUM";
  }

  let recDecision = "QUALIFY";
  let explanation = "";
  if (risk === "LOW") {
    recDecision = "QUALIFY";
    explanation = `The bidder has demonstrated comprehensive compliance across all statutory and technical parameters with a compliance score of ${score}/100. All mandatory certificates are active and verified. Recommended for qualification.`;
  } else if (risk === "HIGH") {
    recDecision = "NOT_QUALIFY";
    explanation = `CRITICAL RISK DETECTED: The bidder has failed mandatory compliance parameters (Score: ${score}/100). ${hasMandatoryFail ? "Mandatory requirement failure detected. " : ""}${hasDebarmentFlag ? "Active Debarment/Blacklist flag detected. " : ""}Recommended for disqualification.`;
  } else {
    recDecision = "MANUAL_REVIEW";
    explanation = `Score: ${score}/100 with items requiring officer discretion. Review the flagged discrepancies in the Evidence tab before making a determination.`;
  }

  const summary = risk === "HIGH"
    ? `HIGH RISK — Score: ${score}/100. ${hasMandatoryFail ? "Mandatory failure detected. " : ""}${hasDebarmentFlag ? "Debarment flag detected. " : ""}Immediate review required.`
    : risk === "MEDIUM"
    ? `MEDIUM RISK — Score: ${score}/100. Discrepancies require officer review.`
    : `LOW RISK — Score: ${score}/100. All statutory requirements successfully verified.`;

  return {
    score,
    risk,
    passed,
    failed,
    review,
    summary,
    recommendation: recDecision,
    explanation,
    checks
  };
}

// Initial Applications Setup for Tender 1
const t1Reqs = INITIAL_TENDERS[0].requirements;

export const INITIAL_APPLICATIONS = [
  {
    id: "app-abc-1",
    application_number: "APP-2026-00042",
    tender_id: "tender-1",
    bidder_id: "bidder-abc",
    status: "VERIFIED",
    submitted_at: "2026-09-10T14:30:00Z",
    total_documents: 8,
    uploaded_documents: 8,
    processed_documents: 8,
    compliance_score: 97.5,
    risk_level: "LOW",
    officer_decision: "QUALIFY",
    officer_notes: "All statutory compliances verified in government registries. Class-I local content at 75%. Approved for financial bid opening.",
    decided_at: "2026-09-11T16:45:00Z",
    documents: buildDocumentsForBidder("app-abc-1", t1Reqs, "ABC"),
    compliance_result: {
      total_score: 97.5,
      risk_level: "LOW",
      passed: 8,
      failed: 0,
      review: 0,
      summary: "LOW RISK — Score: 97.5/100. All requirements verified successfully against official databases."
    },
    recommendation: {
      recommendation: "QUALIFY",
      explanation: "ABC Technologies satisfies all mandatory tender criteria with 97.5% compliance. GST status ACTIVE, PAN verified, Udyam valid, Class-I Local Content at 75%, and clean debarment record."
    }
  },
  {
    id: "app-xyz-1",
    application_number: "APP-2026-00043",
    tender_id: "tender-1",
    bidder_id: "bidder-xyz",
    status: "VERIFIED",
    submitted_at: "2026-09-10T15:15:00Z",
    total_documents: 8,
    uploaded_documents: 8,
    processed_documents: 8,
    compliance_score: 87.5,
    risk_level: "LOW",
    officer_decision: null,
    officer_notes: "",
    decided_at: null,
    documents: buildDocumentsForBidder("app-xyz-1", t1Reqs, "XYZ"),
    compliance_result: {
      total_score: 87.5,
      risk_level: "LOW",
      passed: 8,
      failed: 0,
      review: 0,
      summary: "LOW RISK — Score: 87.5/100. All mandatory certificates are valid."
    },
    recommendation: {
      recommendation: "QUALIFY",
      explanation: "XYZ Industries meets all mandatory criteria with 87.5% score. Local content 62% meets threshold. No debarment detected. Ready for officer determination."
    }
  },
  {
    id: "app-quick-1",
    application_number: "APP-2026-00044",
    tender_id: "tender-1",
    bidder_id: "bidder-quick",
    status: "NOT_QUALIFIED",
    submitted_at: "2026-09-10T16:00:00Z",
    total_documents: 8,
    uploaded_documents: 8,
    processed_documents: 8,
    compliance_score: 25.0,
    risk_level: "HIGH",
    officer_decision: "NOT_QUALIFY",
    officer_notes: "Disqualified under GeM GTC Clause 4.2: GSTIN is Suspended, EPFO contributions non-compliant, and active Debarment record found in Central Registry.",
    decided_at: "2026-09-11T17:10:00Z",
    documents: buildDocumentsForBidder("app-quick-1", t1Reqs, "QuickSupply"),
    compliance_result: {
      total_score: 25.0,
      risk_level: "HIGH",
      passed: 2,
      failed: 6,
      review: 0,
      summary: "HIGH RISK — Score: 25/100. Mandatory requirement failure detected. Debarment flag detected. Immediate disqualification recommended."
    },
    recommendation: {
      recommendation: "NOT_QUALIFY",
      explanation: "CRITICAL COMPLIANCE FAILURE: GSTIN suspended in GSTN portal, EPFO non-compliant, Local Content only 28% (threshold is 50%), and active Debarment flag detected."
    }
  }
];

// Generate Initial Verification Checks
export function generateInitialChecks() {
  const allChecks = {};
  const abcEval = runVerificationRules(INITIAL_APPLICATIONS[0], t1Reqs, "ABC");
  allChecks["app-abc-1"] = abcEval.checks;

  const xyzEval = runVerificationRules(INITIAL_APPLICATIONS[1], t1Reqs, "XYZ");
  allChecks["app-xyz-1"] = xyzEval.checks;

  const quickEval = runVerificationRules(INITIAL_APPLICATIONS[2], t1Reqs, "QuickSupply");
  allChecks["app-quick-1"] = quickEval.checks;

  return allChecks;
}

export const INITIAL_AUDIT_LOGS = {
  "app-abc-1": [
    { id: "audit-abc-1", user_email: "abc@bidder.com", action: "TENDER_APPLICATION", entity_type: "bid_application", entity_id: "app-abc-1", details: { tender_number: "GEM-2026-001" }, timestamp: "2026-09-10T14:00:00Z" },
    { id: "audit-abc-2", user_email: "abc@bidder.com", action: "DEMO_DOCUMENTS_UPLOAD", entity_type: "bid_application", entity_id: "app-abc-1", details: { documents_uploaded: 8 }, timestamp: "2026-09-10T14:15:00Z" },
    { id: "audit-abc-3", user_email: "abc@bidder.com", action: "BID_SUBMITTED", entity_type: "bid_application", entity_id: "app-abc-1", details: { application_number: "APP-2026-00042" }, timestamp: "2026-09-10T14:30:00Z" },
    { id: "audit-abc-4", user_email: "officer@gem-demo.gov.in", action: "VERIFICATION_COMPLETED", entity_type: "bid_application", entity_id: "app-abc-1", details: { score: 97.5, risk: "LOW", passed: 8, failed: 0 }, timestamp: "2026-09-11T11:20:00Z" },
    { id: "audit-abc-5", user_email: "officer@gem-demo.gov.in", action: "OFFICER_DECISION", entity_type: "bid_application", entity_id: "app-abc-1", details: { decision: "QUALIFY", notes: "All statutory compliances verified." }, timestamp: "2026-09-11T16:45:00Z" }
  ],
  "app-xyz-1": [
    { id: "audit-xyz-1", user_email: "xyz@bidder.com", action: "TENDER_APPLICATION", entity_type: "bid_application", entity_id: "app-xyz-1", details: { tender_number: "GEM-2026-001" }, timestamp: "2026-09-10T14:45:00Z" },
    { id: "audit-xyz-2", user_email: "xyz@bidder.com", action: "DEMO_DOCUMENTS_UPLOAD", entity_type: "bid_application", entity_id: "app-xyz-1", details: { documents_uploaded: 8 }, timestamp: "2026-09-10T15:00:00Z" },
    { id: "audit-xyz-3", user_email: "xyz@bidder.com", action: "BID_SUBMITTED", entity_type: "bid_application", entity_id: "app-xyz-1", details: { application_number: "APP-2026-00043" }, timestamp: "2026-09-10T15:15:00Z" },
    { id: "audit-xyz-4", user_email: "officer@gem-demo.gov.in", action: "VERIFICATION_COMPLETED", entity_type: "bid_application", entity_id: "app-xyz-1", details: { score: 87.5, risk: "LOW", passed: 8, failed: 0 }, timestamp: "2026-09-11T11:22:00Z" }
  ],
  "app-quick-1": [
    { id: "audit-quick-1", user_email: "quick@bidder.com", action: "TENDER_APPLICATION", entity_type: "bid_application", entity_id: "app-quick-1", details: { tender_number: "GEM-2026-001" }, timestamp: "2026-09-10T15:30:00Z" },
    { id: "audit-quick-2", user_email: "quick@bidder.com", action: "DEMO_DOCUMENTS_UPLOAD", entity_type: "bid_application", entity_id: "app-quick-1", details: { documents_uploaded: 8 }, timestamp: "2026-09-10T15:45:00Z" },
    { id: "audit-quick-3", user_email: "quick@bidder.com", action: "BID_SUBMITTED", entity_type: "bid_application", entity_id: "app-quick-1", details: { application_number: "APP-2026-00044" }, timestamp: "2026-09-10T16:00:00Z" },
    { id: "audit-quick-4", user_email: "officer@gem-demo.gov.in", action: "VERIFICATION_COMPLETED", entity_type: "bid_application", entity_id: "app-quick-1", details: { score: 25.0, risk: "HIGH", passed: 2, failed: 6 }, timestamp: "2026-09-11T11:25:00Z" },
    { id: "audit-quick-5", user_email: "officer@gem-demo.gov.in", action: "OFFICER_DECISION", entity_type: "bid_application", entity_id: "app-quick-1", details: { decision: "NOT_QUALIFY", notes: "Disqualified due to suspended GSTIN and Debarment flag." }, timestamp: "2026-09-11T17:10:00Z" }
  ]
};
