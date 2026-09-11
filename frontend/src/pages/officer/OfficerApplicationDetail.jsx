import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, CheckCircle, XCircle, AlertTriangle, RefreshCw, FileText, Clock, Gavel, Eye } from 'lucide-react';
import OfficerLayout from '../../components/OfficerLayout';
import { getApplication, getVerificationChecks, verifyApplication, makeDecision, getAuditTrail } from '../../api';

export default function OfficerApplicationDetail({ user, onLogout }) {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [checks, setChecks] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [tab, setTab] = useState('mapping');
  const [showDecision, setShowDecision] = useState(false);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [deciding, setDeciding] = useState(false);
  const [expandedCheck, setExpandedCheck] = useState(null);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const [appRes, checksRes, auditRes] = await Promise.all([
        getApplication(id),
        getVerificationChecks(id).catch(() => ({ data: [] })),
        getAuditTrail(id).catch(() => ({ data: [] }))
      ]);
      setApp(appRes.data);
      setChecks(checksRes.data || []);
      setAuditLogs(auditRes.data || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [id]);

  const handleVerify = async () => {
    setVerifying(true);
    try { await verifyApplication(id); await loadData(); } catch (err) { alert('Verification failed'); }
    setVerifying(false);
  };

  const handleDecision = async (decision) => {
    setDeciding(true);
    try {
      await makeDecision(id, decision, decisionNotes);
      setShowDecision(false);
      await loadData();
    } catch (err) { alert('Decision failed'); }
    setDeciding(false);
  };

  const statusIcon = (status) => {
    if (status === 'PASS') return <CheckCircle size={18} color="#10b981" />;
    if (status === 'FAIL') return <XCircle size={18} color="#ef4444" />;
    if (status === 'REVIEW') return <AlertTriangle size={18} color="#f59e0b" />;
    return <Clock size={18} color="#9ca3af" />;
  };

  if (loading) return <OfficerLayout user={user} onLogout={onLogout}><div className="loading"><div className="spinner"></div></div></OfficerLayout>;
  if (!app) return <OfficerLayout user={user} onLogout={onLogout}><div className="page-body">Application not found</div></OfficerLayout>;

  const riskColor = app.risk_level === 'HIGH' ? '#dc2626' : app.risk_level === 'MEDIUM' ? '#d97706' : '#059669';

  return (
    <OfficerLayout user={user} onLogout={onLogout}>
      <div className="page-header">
        <div>
          <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm" style={{ marginBottom: 8 }}>
            <ArrowLeft size={14} /> Back
          </button>
          <h2>{app.bidder?.company_name}</h2>
          <p>{app.application_number} — {app.tender?.tender_number}: {app.tender?.title}</p>
        </div>
        <div className="flex-gap">
          <button className="btn btn-primary" onClick={handleVerify} disabled={verifying}>
            <RefreshCw size={16} /> {verifying ? 'Verifying...' : 'Run Verification'}
          </button>
          <button className="btn btn-warning" onClick={() => setShowDecision(true)}>
            <Gavel size={16} /> Make Decision
          </button>
        </div>
      </div>

      <div className="page-body fade-in">
        {/* Score & Risk Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Compliance Score</div>
            <div className="stat-value" style={{ color: riskColor }}>{app.compliance_score ?? '—'}</div>
            <div className="stat-sub">out of 100</div>
            {app.compliance_score != null && (
              <div className="progress-bar" style={{ marginTop: 8 }}>
                <div className={`progress-fill ${app.risk_level === 'HIGH' ? 'red' : app.risk_level === 'MEDIUM' ? 'amber' : 'green'}`}
                  style={{ width: `${app.compliance_score}%` }}></div>
              </div>
            )}
          </div>
          <div className="stat-card">
            <div className="stat-label">Risk Level</div>
            <div className="stat-value" style={{ color: riskColor }}>{app.risk_level || '—'}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Documents</div>
            <div className="stat-value">{app.uploaded_documents}/{app.total_documents}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Status</div>
            <div style={{ marginTop: 4 }}><span className={`badge badge-${app.status?.toLowerCase()}`} style={{ fontSize: 13 }}>{app.status}</span></div>
            {app.officer_decision && (
              <div style={{ marginTop: 6 }}>
                <span className={`badge badge-${app.officer_decision === 'QUALIFY' ? 'pass' : app.officer_decision === 'NOT_QUALIFY' ? 'fail' : 'review'}`}>
                  Decision: {app.officer_decision}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Compliance Summary */}
        {app.compliance_result && (
          <div className="card mb-24" style={{ borderColor: riskColor }}>
            <div className="card-body">
              <div className="flex-between">
                <div>
                  <span style={{ fontSize: 13, color: '#6b7280' }}>Compliance Summary</span>
                  <p style={{ fontWeight: 600, fontSize: 15, marginTop: 4 }}>{app.compliance_result.summary}</p>
                </div>
                <div className="flex-gap" style={{ gap: 16 }}>
                  <div className="text-center"><div style={{ fontSize: 22, fontWeight: 800, color: '#059669' }}>{app.compliance_result.passed}</div><div className="text-sm text-muted">Passed</div></div>
                  <div className="text-center"><div style={{ fontSize: 22, fontWeight: 800, color: '#ef4444' }}>{app.compliance_result.failed}</div><div className="text-sm text-muted">Failed</div></div>
                  <div className="text-center"><div style={{ fontSize: 22, fontWeight: 800, color: '#f59e0b' }}>{app.compliance_result.review}</div><div className="text-sm text-muted">Review</div></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Recommendation */}
        {app.recommendation && (
          <div className="card mb-24" style={{ background: '#f0f4ff', borderColor: '#93c5fd' }}>
            <div className="card-body">
              <div className="flex-gap" style={{ marginBottom: 8 }}>
                <Shield size={18} color="#2563eb" />
                <span style={{ fontWeight: 700, color: '#1e3a5f' }}>AI Recommendation</span>
                <span className={`badge badge-${app.recommendation.recommendation === 'QUALIFY' ? 'pass' : app.recommendation.recommendation === 'NOT_QUALIFY' ? 'fail' : 'review'}`}>
                  {app.recommendation.recommendation}
                </span>
              </div>
              <p style={{ fontSize: 14, color: '#334e68', lineHeight: 1.6 }}>{app.recommendation.explanation}</p>
              <p style={{ fontSize: 11, color: '#627d98', marginTop: 8 }}>
                ⚠ AI recommendation only — the final procurement decision rests with the officer.
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex-gap mb-16">
          {['mapping', 'evidence', 'documents', 'audit'].map(t => (
            <button key={t} className={`btn btn-sm ${tab === t ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab(t)}>
              {t === 'mapping' && '🔗 Requirement Mapping'}
              {t === 'evidence' && '🔍 Evidence'}
              {t === 'documents' && '📄 Documents'}
              {t === 'audit' && '📋 Audit Trail'}
            </button>
          ))}
        </div>

        {/* REQUIREMENT MAPPING — HERO FEATURE */}
        {tab === 'mapping' && (
          <div className="card">
            <div className="card-header">
              <h3>🔗 Requirement Mapping & Verification</h3>
              <span className="badge badge-ai">HERO FEATURE</span>
            </div>
            <div className="card-body">
              {checks.length === 0 ? (
                <div className="text-center" style={{ padding: 40, color: '#6b7280' }}>
                  <RefreshCw size={40} strokeWidth={1} style={{ margin: '0 auto 12px' }} />
                  <p>Click "Run Verification" to generate requirement mapping</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {checks.map((check, idx) => (
                    <div key={check.id || idx} style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
                      {/* Mapping Flow */}
                      <div style={{ padding: 16 }}>
                        <div className="mapping-flow">
                          {/* Step 1: Tender Requirement */}
                          <div className="mapping-step" style={{ borderColor: '#2563eb', borderLeftWidth: 4 }}>
                            <div className="step-label requirement">TENDER REQUIREMENT</div>
                            <div className="step-content">{check.requirement?.name}</div>
                            <div className="step-detail">{check.requirement?.description}</div>
                            {check.requirement?.mandatory && <span className="badge badge-mandatory" style={{ marginTop: 4 }}>MANDATORY</span>}
                          </div>

                          <div className="mapping-connector"></div>

                          {/* Step 2: Bidder Document */}
                          <div className="mapping-step" style={{ borderColor: '#7c3aed', borderLeftWidth: 4 }}>
                            <div className="step-label document">BIDDER DOCUMENT</div>
                            <div className="step-content">
                              {check.document ? (
                                <span className="flex-gap"><FileText size={14} /> {check.document.original_filename || check.document.document_type}</span>
                              ) : (
                                <span style={{ color: '#ef4444' }}>⚠ No document submitted</span>
                              )}
                            </div>
                          </div>

                          <div className="mapping-connector"></div>

                          {/* Step 3: Extracted Data */}
                          <div className="mapping-step" style={{ borderColor: '#d97706', borderLeftWidth: 4 }}>
                            <div className="step-label extracted">EXTRACTED (AI)</div>
                            {check.extracted_value && Object.keys(check.extracted_value).length > 0 ? (
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                                {Object.entries(check.extracted_value).filter(([k]) => !k.includes('Document Type')).slice(0, 6).map(([k, v]) => (
                                  <div key={k} style={{ fontSize: 13 }}>
                                    <span style={{ color: '#6b7280' }}>{k.replace(/_/g, ' ')}: </span>
                                    <span style={{ fontWeight: 600 }}>{String(v)}</span>
                                  </div>
                                ))}
                              </div>
                            ) : <div className="step-content" style={{ color: '#9ca3af' }}>No data extracted</div>}
                          </div>

                          <div className="mapping-connector"></div>

                          {/* Step 4: Verified Data */}
                          <div className="mapping-step" style={{ borderColor: '#059669', borderLeftWidth: 4 }}>
                            <div className="step-label verified">VERIFIED (Government Connector)</div>
                            {check.verified_value && Object.keys(check.verified_value).length > 0 ? (
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                                {Object.entries(check.verified_value).filter(([k]) => !['source', 'verified', 'note'].includes(k)).slice(0, 6).map(([k, v]) => (
                                  <div key={k} style={{ fontSize: 13 }}>
                                    <span style={{ color: '#6b7280' }}>{k.replace(/_/g, ' ')}: </span>
                                    <span style={{ fontWeight: 600 }}>{String(v)}</span>
                                  </div>
                                ))}
                              </div>
                            ) : <div className="step-content" style={{ color: '#9ca3af' }}>No verification data</div>}
                          </div>

                          <div className="mapping-connector"></div>

                          {/* Step 5: Result */}
                          <div className={`mapping-result ${check.status?.toLowerCase()}`}>
                            {statusIcon(check.status)} {check.status} {check.status === 'PASS' ? '✓' : check.status === 'FAIL' ? '✗' : '⚠'}
                          </div>
                        </div>

                        {/* Reason */}
                        <div style={{ marginTop: 12, padding: '10px 14px', background: '#f9fafb', borderRadius: 8, fontSize: 13, color: '#334e68' }}>
                          <strong>Reason:</strong> {check.reason}
                        </div>

                        {/* Evidence toggle */}
                        <button className="btn btn-outline btn-sm" style={{ marginTop: 8 }}
                          onClick={() => setExpandedCheck(expandedCheck === idx ? null : idx)}>
                          <Eye size={14} /> {expandedCheck === idx ? 'Hide' : 'Show'} Evidence
                        </button>

                        {expandedCheck === idx && check.evidence && (
                          <div className="evidence-panel" style={{ marginTop: 8 }}>
                            <div className="evidence-row"><span className="evidence-label">Verification ID</span><span className="evidence-value">{check.verification_id}</span></div>
                            <div className="evidence-row"><span className="evidence-label">Source</span><span className="evidence-value">{check.verification_source}</span></div>
                            <div className="evidence-row"><span className="evidence-label">Confidence</span><span className="evidence-value">{check.confidence}%</span></div>
                            <div className="evidence-row"><span className="evidence-label">Timestamp</span><span className="evidence-value">{check.verified_at}</span></div>
                            {check.evidence?.details && Object.keys(check.evidence.details).length > 0 && (
                              <>
                                <div style={{ marginTop: 8, fontWeight: 600, fontSize: 12, color: '#374151' }}>Entity Match Details:</div>
                                {Object.entries(check.evidence.details).map(([k, v]) => (
                                  <div key={k} className="evidence-row">
                                    <span className="evidence-label">{k}</span>
                                    <span className="evidence-value">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                                  </div>
                                ))}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* EVIDENCE TAB */}
        {tab === 'evidence' && (
          <div className="card">
            <div className="card-header"><h3>🔍 Verification Evidence</h3></div>
            <div className="card-body" style={{ padding: 0 }}>
              <table>
                <thead>
                  <tr><th>Requirement</th><th>Document</th><th>Extracted Value</th><th>Verified Value</th><th>Source</th><th>Result</th><th>Confidence</th><th>ID</th></tr>
                </thead>
                <tbody>
                  {checks.map((c, i) => (
                    <tr key={i} style={{ cursor: 'default' }}>
                      <td style={{ fontWeight: 600 }}>{c.requirement?.name}</td>
                      <td>{c.document?.document_type?.replace(/_/g, ' ') || '—'}</td>
                      <td style={{ fontSize: 12 }}>{c.extracted_value ? Object.entries(c.extracted_value).slice(0, 2).map(([k, v]) => `${k}: ${v}`).join(', ') : '—'}</td>
                      <td style={{ fontSize: 12 }}>{c.verified_value ? Object.entries(c.verified_value).filter(([k]) => !['source', 'verified', 'note'].includes(k)).slice(0, 2).map(([k, v]) => `${k}: ${v}`).join(', ') : '—'}</td>
                      <td>{c.verification_source}</td>
                      <td><span className={`badge badge-${c.status?.toLowerCase()}`}>{c.status}</span></td>
                      <td>{c.confidence}%</td>
                      <td style={{ fontSize: 11 }}>{c.verification_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {tab === 'documents' && (
          <div className="card">
            <div className="card-header"><h3>📄 Submitted Documents</h3></div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
                {app.documents?.map(doc => (
                  <div key={doc.id} className="extraction-card">
                    <div className="extraction-header">
                      <span style={{ fontWeight: 600, color: '#1e3a5f' }}>
                        <FileText size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                        {doc.document_type?.replace(/_/g, ' ')}
                      </span>
                      <span className={`badge badge-${doc.processing_status?.toLowerCase()}`}>{doc.processing_status}</span>
                    </div>
                    {doc.extracted_data && (
                      <div className="field-grid">
                        {Object.entries(doc.extracted_data).filter(([k]) => k !== 'Document Type').map(([k, v]) => (
                          <div key={k} className="field-item">
                            <div className="field-label">{k.replace(/_/g, ' ')}</div>
                            <div className="field-value">{String(v)}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
                      Confidence: {doc.confidence}% | {doc.original_filename}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AUDIT TRAIL TAB */}
        {tab === 'audit' && (
          <div className="card">
            <div className="card-header"><h3>📋 Audit Trail</h3></div>
            <div className="card-body">
              {auditLogs.length === 0 ? (
                <p className="text-muted text-center" style={{ padding: 20 }}>No audit events recorded</p>
              ) : (
                <div className="timeline">
                  {auditLogs.map((log, i) => (
                    <div key={log.id || i} className="timeline-item">
                      <div className="timeline-time">{log.timestamp ? new Date(log.timestamp).toLocaleString() : ''}</div>
                      <div className="timeline-action">{log.action?.replace(/_/g, ' ')}</div>
                      <div className="timeline-details">
                        {log.user_email && <span>By: {log.user_email}</span>}
                        {log.details && (
                          <span> — {Object.entries(log.details).map(([k, v]) => `${k}: ${v}`).join(', ')}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#9ca3af' }}>
          Prototype scoring rules — configurable and not official government thresholds.
        </p>
      </div>

      {/* Decision Modal */}
      {showDecision && (
        <div className="modal-overlay" onClick={() => setShowDecision(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3><Gavel size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />Officer Decision</h3>
            
            <div style={{ marginBottom: 16, padding: 12, background: '#f0f4ff', borderRadius: 8 }}>
              <div className="flex-between mb-16">
                <span>Bidder: <strong>{app.bidder?.company_name}</strong></span>
                <span style={{ fontWeight: 800, color: riskColor }}>{app.compliance_score}/100</span>
              </div>
              {app.recommendation && (
                <p style={{ fontSize: 13, color: '#334e68' }}>
                  <strong>AI Recommendation:</strong> {app.recommendation.explanation}
                </p>
              )}
            </div>

            <div style={{ marginBottom: 12, padding: 10, background: '#fffbeb', borderRadius: 8, fontSize: 12, color: '#92400e' }}>
              ⚠ The AI provides recommendations. The final procurement decision rests with the officer.
            </div>

            <div className="form-group">
              <label>Officer Notes (optional)</label>
              <textarea className="form-input" rows={3} value={decisionNotes}
                onChange={e => setDecisionNotes(e.target.value)} placeholder="Add notes about your decision..." />
            </div>

            <div className="decision-group">
              <button className="btn btn-success" onClick={() => handleDecision('QUALIFY')} disabled={deciding}>
                <CheckCircle size={16} /> Qualify
              </button>
              <button className="btn btn-danger" onClick={() => handleDecision('NOT_QUALIFY')} disabled={deciding}>
                <XCircle size={16} /> Do Not Qualify
              </button>
              <button className="btn btn-warning" onClick={() => handleDecision('MANUAL_REVIEW')} disabled={deciding}>
                <AlertTriangle size={16} /> Manual Review
              </button>
            </div>

            <button className="btn btn-outline btn-block" style={{ marginTop: 12 }} onClick={() => setShowDecision(false)}>Cancel</button>
          </div>
        </div>
      )}
    </OfficerLayout>
  );
}
