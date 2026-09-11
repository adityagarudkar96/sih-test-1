// In-Memory & LocalStorage Mock API Engine
// Replaces backend & database with instant deterministic simulation for Vercel deployment.

import {
  USERS,
  DEPARTMENTS,
  BIDDERS,
  INITIAL_TENDERS,
  INITIAL_APPLICATIONS,
  generateInitialChecks,
  INITIAL_AUDIT_LOGS,
  BIDDER_DOC_DATA,
  runVerificationRules
} from './mockData';

const STORAGE_KEYS = {
  TENDERS: 'gem_tenders_demo_v2',
  APPLICATIONS: 'gem_apps_demo_v2',
  CHECKS: 'gem_checks_demo_v2',
  AUDIT: 'gem_audit_demo_v2',
};

// Helper: initialize storage
function getStorageData() {
  let tenders = [];
  let applications = [];
  let checks = {};
  let auditLogs = {};

  try {
    const rawT = localStorage.getItem(STORAGE_KEYS.TENDERS);
    tenders = rawT ? JSON.parse(rawT) : INITIAL_TENDERS;
  } catch {
    tenders = INITIAL_TENDERS;
  }

  try {
    const rawA = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    applications = rawA ? JSON.parse(rawA) : INITIAL_APPLICATIONS;
  } catch {
    applications = INITIAL_APPLICATIONS;
  }

  try {
    const rawC = localStorage.getItem(STORAGE_KEYS.CHECKS);
    checks = rawC ? JSON.parse(rawC) : generateInitialChecks();
  } catch {
    checks = generateInitialChecks();
  }

  try {
    const rawAu = localStorage.getItem(STORAGE_KEYS.AUDIT);
    auditLogs = rawAu ? JSON.parse(rawAu) : INITIAL_AUDIT_LOGS;
  } catch {
    auditLogs = INITIAL_AUDIT_LOGS;
  }

  // Save back if newly initialized
  if (!localStorage.getItem(STORAGE_KEYS.TENDERS)) {
    localStorage.setItem(STORAGE_KEYS.TENDERS, JSON.stringify(tenders));
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
    localStorage.setItem(STORAGE_KEYS.CHECKS, JSON.stringify(checks));
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(auditLogs));
  }

  return { tenders, applications, checks, auditLogs };
}

function saveStorageData({ tenders, applications, checks, auditLogs }) {
  if (tenders) localStorage.setItem(STORAGE_KEYS.TENDERS, JSON.stringify(tenders));
  if (applications) localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  if (checks) localStorage.setItem(STORAGE_KEYS.CHECKS, JSON.stringify(checks));
  if (auditLogs) localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(auditLogs));
}

// Reset store utility
export function resetDemoData() {
  localStorage.removeItem(STORAGE_KEYS.TENDERS);
  localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
  localStorage.removeItem(STORAGE_KEYS.CHECKS);
  localStorage.removeItem(STORAGE_KEYS.AUDIT);
  return getStorageData();
}

// Helper: simulate network delay
const delay = (ms = 150) => new Promise(res => setTimeout(res, ms));

// Helper: determine bidder key
function getBidderKey(nameOrEmail = '') {
  const s = nameOrEmail.toLowerCase();
  if (s.includes('abc')) return 'ABC';
  if (s.includes('quick')) return 'QuickSupply';
  return 'XYZ';
}

// Current logged in user helper
function getCurrentUser() {
  try {
    const u = localStorage.getItem('gem_user');
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
}

// ──────────────────────────────────────────────
// AUTH API
// ──────────────────────────────────────────────
export const login = async (email, password) => {
  await delay(200);
  const user = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) {
    const err = new Error('Invalid email or password');
    err.response = { data: { detail: 'Invalid demo credentials. Use quick login buttons below.' } };
    throw err;
  }
  const token = `demo-token-${user.id}-${Date.now()}`;
  return {
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organization: user.organization,
        department: user.department,
        bidder_id: user.bidder_id
      },
      token
    }
  };
};

// ──────────────────────────────────────────────
// TENDERS API
// ──────────────────────────────────────────────
export const getTenders = async () => {
  await delay(120);
  const { tenders, applications } = getStorageData();
  const list = tenders.map(t => {
    const appCount = applications.filter(a => a.tender_id === t.id).length;
    return {
      id: t.id,
      tender_number: t.tender_number,
      title: t.title,
      department: t.department,
      department_id: t.department_id,
      category: t.category,
      estimated_value: t.estimated_value,
      closing_date: t.closing_date,
      status: t.status,
      pdf_filename: t.pdf_filename,
      analysis_status: t.analysis_status,
      bidder_count: appCount,
      requirement_count: t.requirements?.length || 0
    };
  });
  return { data: list };
};

export const getTender = async (id) => {
  await delay(120);
  const { tenders, applications } = getStorageData();
  const tender = tenders.find(t => t.id === id || t.tender_number === id);
  if (!tender) {
    const err = new Error('Tender not found');
    err.response = { status: 404, data: { detail: 'Tender not found' } };
    throw err;
  }
  const appCount = applications.filter(a => a.tender_id === tender.id).length;
  return {
    data: {
      ...tender,
      bidder_count: appCount
    }
  };
};

export const getTenderPdfUrl = (id) => {
  return `#tender-pdf-${id}`;
};

export const analyzeTender = async (id) => {
  await delay(600);
  const { tenders } = getStorageData();
  const tender = tenders.find(t => t.id === id || t.tender_number === id);
  if (!tender) throw new Error('Tender not found');

  tender.analysis_status = 'COMPLETED';
  const mandatoryCount = tender.requirements.filter(r => r.mandatory).length;
  tender.analysis_result = {
    summary: `AI Document Analysis successfully completed for ${tender.tender_number}. Extracted ${tender.requirements.length} compliance rules and criteria across statutory, financial, and technical domains.`,
    requirements_count: tender.requirements.length,
    mandatory_count: mandatoryCount,
    confidence: 98.4,
    pages_processed: 12,
    processing_time: '1.4s',
    requirements: tender.requirements,
    sources_identified: [...new Set(tender.requirements.map(r => r.verification_source))],
    document_name: tender.pdf_filename
  };

  saveStorageData({ tenders });

  return {
    data: {
      status: 'COMPLETED',
      tender_number: tender.tender_number,
      requirements_count: tender.requirements.length,
      analysis: tender.analysis_result,
      source: 'Deterministic Compliance Engine'
    }
  };
};

export const getTenderBidders = async (tenderId) => {
  await delay(120);
  const { applications } = getStorageData();
  const apps = applications.filter(a => a.tender_id === tenderId);

  const result = apps.map(app => {
    const bidder = BIDDERS[app.bidder_id] || { company_name: 'Unknown Bidder' };
    return {
      application_id: app.id,
      application_number: app.application_number,
      bidder_id: app.bidder_id,
      company_name: bidder.company_name,
      status: app.status,
      submitted_at: app.submitted_at,
      total_documents: app.total_documents,
      uploaded_documents: app.uploaded_documents,
      compliance_score: app.compliance_score,
      risk_level: app.risk_level,
      officer_decision: app.officer_decision,
      recommendation: app.recommendation?.recommendation || null,
      compliance_summary: app.compliance_result?.summary || null
    };
  });

  return { data: result };
};

// ──────────────────────────────────────────────
// APPLICATIONS API (BIDDER & OFFICER)
// ──────────────────────────────────────────────
export const applyToTender = async (tenderId) => {
  await delay(200);
  const { tenders, applications, auditLogs } = getStorageData();
  const tender = tenders.find(t => t.id === tenderId);
  if (!tender) throw new Error('Tender not found');

  const user = getCurrentUser();
  const bidderId = user?.bidder_id || 'bidder-xyz';

  // Check if existing
  const existing = applications.find(a => a.tender_id === tenderId && a.bidder_id === bidderId);
  if (existing) {
    return {
      data: {
        application_id: existing.id,
        application_number: existing.application_number,
        status: existing.status,
        message: 'Already applied to this tender'
      }
    };
  }

  const appNumber = `APP-2026-${String(applications.length + 45).padStart(5, '0')}`;
  const newApp = {
    id: `app-custom-${Date.now()}`,
    application_number: appNumber,
    tender_id: tenderId,
    bidder_id: bidderId,
    status: 'DOCUMENTS_PENDING',
    submitted_at: null,
    total_documents: tender.requirements?.length || 8,
    uploaded_documents: 0,
    processed_documents: 0,
    compliance_score: null,
    risk_level: null,
    officer_decision: null,
    officer_notes: '',
    decided_at: null,
    documents: [],
    compliance_result: null,
    recommendation: null
  };

  applications.push(newApp);

  // Add audit log
  if (!auditLogs[newApp.id]) auditLogs[newApp.id] = [];
  auditLogs[newApp.id].push({
    id: `audit-${Date.now()}`,
    user_email: user?.email || 'bidder@gem.gov.in',
    action: 'TENDER_APPLICATION',
    entity_type: 'bid_application',
    entity_id: newApp.id,
    details: { tender_number: tender.tender_number, application_number: appNumber },
    timestamp: new Date().toISOString()
  });

  saveStorageData({ applications, auditLogs });

  return {
    data: {
      application_id: newApp.id,
      application_number: appNumber,
      status: newApp.status,
      total_documents: newApp.total_documents,
      message: 'Application created successfully'
    }
  };
};

export const getApplication = async (id) => {
  await delay(150);
  const { tenders, applications } = getStorageData();
  const app = applications.find(a => a.id === id);
  if (!app) {
    const err = new Error('Application not found');
    err.response = { status: 404, data: { detail: 'Application not found' } };
    throw err;
  }

  const tender = tenders.find(t => t.id === app.tender_id) || INITIAL_TENDERS[0];
  const bidder = BIDDERS[app.bidder_id] || BIDDERS['bidder-xyz'];

  return {
    data: {
      ...app,
      tender: {
        id: tender.id,
        tender_number: tender.tender_number,
        title: tender.title,
        department: tender.department,
        category: tender.category,
        estimated_value: tender.estimated_value,
        closing_date: tender.closing_date,
      },
      bidder: {
        id: bidder.id,
        company_name: bidder.company_name,
        gstin: bidder.gstin,
        pan: bidder.pan,
        state: bidder.state,
      },
      requirements: tender.requirements || [],
      documents: app.documents || [],
      compliance_result: app.compliance_result,
      recommendation: app.recommendation
    }
  };
};

export const getMyApplications = async () => {
  await delay(120);
  const user = getCurrentUser();
  const bidderId = user?.bidder_id || 'bidder-xyz';
  const { tenders, applications } = getStorageData();

  const userApps = applications
    .filter(a => a.bidder_id === bidderId)
    .map(a => {
      const tender = tenders.find(t => t.id === a.tender_id) || {};
      return {
        id: a.id,
        application_number: a.application_number,
        tender_id: a.tender_id,
        tender_number: tender.tender_number || 'GEM-2026-001',
        tender_title: tender.title || 'Government Tender',
        department: tender.department || 'Ministry of Health',
        status: a.status,
        submitted_at: a.submitted_at,
        total_documents: a.total_documents,
        uploaded_documents: a.uploaded_documents,
        compliance_score: a.compliance_score,
        risk_level: a.risk_level,
        officer_decision: a.officer_decision
      };
    });

  return { data: userApps };
};

export const uploadDocument = async (appId, documentType, requirementId, file) => {
  await delay(200);
  const { applications } = getStorageData();
  const app = applications.find(a => a.id === appId);
  if (!app) throw new Error('Application not found');

  const bidderKey = getBidderKey(app.bidder_id);
  const formattedType = documentType.replace(/_/g, ' ');
  const fallback = BIDDER_DOC_DATA[bidderKey]?.[formattedType] || { status: 'ACTIVE', file_name: file.name };

  const existingIdx = app.documents.findIndex(d => d.requirement_id === requirementId || d.document_type === documentType);
  const newDoc = {
    id: `doc-${Date.now()}`,
    application_id: appId,
    requirement_id: requirementId,
    document_type: documentType,
    original_filename: file.name,
    processing_status: 'EXTRACTED',
    extracted_data: fallback,
    confidence: 96.0,
    fields: Object.entries(fallback).map(([k, v]) => ({ field_name: k, field_value: String(v), confidence: 96.0 }))
  };

  if (existingIdx >= 0) {
    app.documents[existingIdx] = newDoc;
  } else {
    app.documents.push(newDoc);
  }

  app.uploaded_documents = app.documents.length;
  app.processed_documents = app.documents.length;
  if (app.status === 'DOCUMENTS_PENDING') {
    app.status = 'DOCUMENTS_UPLOADED';
  }

  saveStorageData({ applications });
  return { data: newDoc };
};

export const uploadDemoDocuments = async (appId) => {
  await delay(400);
  const { tenders, applications, auditLogs } = getStorageData();
  const app = applications.find(a => a.id === appId);
  if (!app) throw new Error('Application not found');

  const tender = tenders.find(t => t.id === app.tender_id) || INITIAL_TENDERS[0];
  const bidderKey = getBidderKey(app.bidder_id);
  const docData = BIDDER_DOC_DATA[bidderKey] || BIDDER_DOC_DATA.XYZ;

  app.documents = tender.requirements.map((req, idx) => {
    const docType = (req.required_document || '').replace(/ /g, '_');
    const extracted = docData[req.required_document] || { info: 'Verified Statutory Record' };
    return {
      id: `doc-${app.id}-${idx}`,
      application_id: app.id,
      requirement_id: req.id,
      document_type: docType,
      original_filename: `${docType}.pdf`,
      processing_status: 'EXTRACTED',
      extracted_data: extracted,
      confidence: 95.0,
      fields: Object.entries(extracted).map(([k, v]) => ({
        field_name: k,
        field_value: String(v),
        confidence: 95.0
      }))
    };
  });

  app.uploaded_documents = app.documents.length;
  app.processed_documents = app.documents.length;
  app.status = 'DOCUMENTS_UPLOADED';

  if (!auditLogs[app.id]) auditLogs[app.id] = [];
  auditLogs[app.id].push({
    id: `audit-${Date.now()}`,
    user_email: getCurrentUser()?.email || 'bidder@gem.gov.in',
    action: 'DEMO_DOCUMENTS_UPLOAD',
    entity_type: 'bid_application',
    entity_id: app.id,
    details: { documents_uploaded: app.documents.length },
    timestamp: new Date().toISOString()
  });

  saveStorageData({ applications, auditLogs });
  return { data: { message: 'Demo documents uploaded and extracted successfully' } };
};

export const submitBid = async (appId) => {
  await delay(250);
  const { applications, auditLogs } = getStorageData();
  const app = applications.find(a => a.id === appId);
  if (!app) throw new Error('Application not found');

  app.status = 'SUBMITTED';
  app.submitted_at = new Date().toISOString();

  if (!auditLogs[app.id]) auditLogs[app.id] = [];
  auditLogs[app.id].push({
    id: `audit-${Date.now()}`,
    user_email: getCurrentUser()?.email || 'bidder@gem.gov.in',
    action: 'BID_SUBMITTED',
    entity_type: 'bid_application',
    entity_id: app.id,
    details: { application_number: app.application_number },
    timestamp: app.submitted_at
  });

  saveStorageData({ applications, auditLogs });
  return { data: { message: 'Bid submitted successfully', status: 'SUBMITTED' } };
};

// ──────────────────────────────────────────────
// VERIFICATION API (OFFICER)
// ──────────────────────────────────────────────
export const verifyApplication = async (appId) => {
  await delay(500);
  const { tenders, applications, checks, auditLogs } = getStorageData();
  const app = applications.find(a => a.id === appId);
  if (!app) throw new Error('Application not found');

  const tender = tenders.find(t => t.id === app.tender_id) || INITIAL_TENDERS[0];
  const bidderKey = getBidderKey(app.bidder_id);

  const evalResult = runVerificationRules(app, tender.requirements, bidderKey);

  app.compliance_score = evalResult.score;
  app.risk_level = evalResult.risk;
  app.status = 'VERIFIED';
  app.compliance_result = {
    total_score: evalResult.score,
    risk_level: evalResult.risk,
    passed: evalResult.passed,
    failed: evalResult.failed,
    review: evalResult.review,
    summary: evalResult.summary
  };
  app.recommendation = {
    recommendation: evalResult.recommendation,
    explanation: evalResult.explanation
  };

  checks[app.id] = evalResult.checks;

  if (!auditLogs[app.id]) auditLogs[app.id] = [];
  auditLogs[app.id].push({
    id: `audit-${Date.now()}`,
    user_email: getCurrentUser()?.email || 'officer@gem-demo.gov.in',
    action: 'VERIFICATION_COMPLETED',
    entity_type: 'bid_application',
    entity_id: app.id,
    details: {
      score: evalResult.score,
      risk: evalResult.risk,
      passed: evalResult.passed,
      failed: evalResult.failed
    },
    timestamp: new Date().toISOString()
  });

  saveStorageData({ applications, checks, auditLogs });

  return {
    data: {
      application_id: app.id,
      score: evalResult.score,
      risk: evalResult.risk,
      passed: evalResult.passed,
      failed: evalResult.failed,
      review: evalResult.review,
      summary: evalResult.summary,
      recommendation: evalResult.recommendation,
      explanation: evalResult.explanation,
      checks: evalResult.checks
    }
  };
};

export const verifyAllBidders = async (tenderId) => {
  await delay(600);
  const { applications } = getStorageData();
  const tenderApps = applications.filter(a => a.tender_id === tenderId);

  const results = [];
  for (const app of tenderApps) {
    const res = await verifyApplication(app.id);
    results.push(res.data);
  }

  return {
    data: {
      tender_id: tenderId,
      verified_count: results.length,
      results
    }
  };
};

export const getVerificationChecks = async (appId) => {
  await delay(120);
  const { checks } = getStorageData();
  return { data: checks[appId] || [] };
};

export const makeDecision = async (appId, decision, notes = '') => {
  await delay(250);
  const { applications, auditLogs } = getStorageData();
  const app = applications.find(a => a.id === appId);
  if (!app) throw new Error('Application not found');

  app.officer_decision = decision;
  app.officer_notes = notes;
  app.decided_at = new Date().toISOString();

  if (decision === 'QUALIFY') app.status = 'QUALIFIED';
  else if (decision === 'NOT_QUALIFY') app.status = 'NOT_QUALIFIED';
  else app.status = 'MANUAL_REVIEW';

  if (!auditLogs[app.id]) auditLogs[app.id] = [];
  auditLogs[app.id].push({
    id: `audit-${Date.now()}`,
    user_email: getCurrentUser()?.email || 'officer@gem-demo.gov.in',
    action: 'OFFICER_DECISION',
    entity_type: 'bid_application',
    entity_id: app.id,
    details: { decision, notes },
    timestamp: app.decided_at
  });

  saveStorageData({ applications, auditLogs });

  return {
    data: {
      application_id: app.id,
      decision,
      status: app.status,
      decided_at: app.decided_at,
      message: `Decision recorded: ${decision}`
    }
  };
};

// ──────────────────────────────────────────────
// DASHBOARD & AUDIT API
// ──────────────────────────────────────────────
export const getDashboardStats = async () => {
  await delay(120);
  const { tenders, applications } = getStorageData();

  const activeTenders = tenders.filter(t => t.status === 'ACTIVE').length;
  const submittedBids = applications.filter(a =>
    ['SUBMITTED', 'VERIFIED', 'QUALIFIED', 'NOT_QUALIFIED', 'MANUAL_REVIEW'].includes(a.status)
  ).length;

  const compliant = applications.filter(a => a.risk_level === 'LOW').length;
  const reviewRequired = applications.filter(a => a.risk_level === 'MEDIUM').length;
  const highRisk = applications.filter(a => a.risk_level === 'HIGH').length;

  return {
    data: {
      active_tenders: activeTenders,
      total_bidders: Object.keys(BIDDERS).length,
      submitted_bids: submittedBids,
      compliant,
      review_required: reviewRequired,
      high_risk: highRisk
    }
  };
};

export const getDepartments = async () => {
  await delay(100);
  return { data: DEPARTMENTS };
};

export const getAuditTrail = async (appId) => {
  await delay(120);
  const { auditLogs } = getStorageData();
  return { data: auditLogs[appId] || [] };
};

// Default export
const api = {
  login,
  getTenders,
  getTender,
  getTenderPdfUrl,
  analyzeTender,
  getTenderBidders,
  applyToTender,
  getApplication,
  getMyApplications,
  uploadDocument,
  uploadDemoDocuments,
  submitBid,
  verifyApplication,
  verifyAllBidders,
  getVerificationChecks,
  makeDecision,
  getDashboardStats,
  getDepartments,
  getAuditTrail
};

export default api;
