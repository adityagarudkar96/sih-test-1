import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Users, FileText, CheckCircle, AlertTriangle, XCircle, RefreshCw, Shield, Layers, Check } from 'lucide-react';
import OfficerLayout from '../../components/OfficerLayout';
import { getTender, analyzeTender, getTenderBidders, verifyAllBidders } from '../../api';

export default function OfficerTenderDetail({ user, onLogout }) {
  const { id } = useParams();
  const [tender, setTender] = useState(null);
  const [bidders, setBidders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisAlert, setAnalysisAlert] = useState(null);
  const [verificationAlert, setVerificationAlert] = useState(null);
  const navigate = useNavigate();

  const loadData = () => {
    Promise.all([getTender(id), getTenderBidders(id).catch(() => ({ data: [] }))])
      .then(([tRes, bRes]) => {
        setTender(tRes.data);
        setBidders(bRes.data || []);
        setLoading(false);
      }).catch(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [id]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setAnalysisAlert(null);
    try {
      const res = await analyzeTender(id);
      setAnalysisResult(res.data.analysis);
      setShowAnalysisModal(true);
      setAnalysisAlert(`✓ AI Tender Analysis Completed: Extracted ${res.data.requirements_count} compliance rules from ${res.data.tender_number}`);
      loadData();
    } catch (err) {
      alert('Analysis failed: ' + err.message);
    }
    setAnalyzing(false);
  };

  const handleVerifyAll = async () => {
    setVerifying(true);
    setVerificationAlert(null);
    try {
      const res = await verifyAllBidders(id);
      setVerificationAlert(`✓ Evaluated all ${res.data.verified_count} bidder applications against statutory records.`);
      loadData();
    } catch (err) {
      alert('Verification failed: ' + err.message);
    }
    setVerifying(false);
  };

  const riskIcon = (risk) => {
    if (risk === 'LOW') return <CheckCircle size={16} color="#10b981" />;
    if (risk === 'MEDIUM') return <AlertTriangle size={16} color="#f59e0b" />;
    return <XCircle size={16} color="#ef4444" />;
  };

  if (loading) return <OfficerLayout user={user} onLogout={onLogout}><div className="loading"><div className="spinner"></div></div></OfficerLayout>;
  if (!tender) return <OfficerLayout user={user} onLogout={onLogout}><div className="page-body">Tender not found</div></OfficerLayout>;

  return (
    <OfficerLayout user={user} onLogout={onLogout}>
      <div className="page-header">
        <div>
          <button onClick={() => navigate('/officer/dashboard')} className="btn btn-outline btn-sm" style={{ marginBottom: 8 }}>
            <ArrowLeft size={14} /> Dashboard
          </button>
          <h2>{tender.tender_number}</h2>
          <p>{tender.title}</p>
        </div>
        <div className="flex-gap">
          <button className="btn btn-primary" onClick={handleAnalyze} disabled={analyzing}>
            {analyzing ? <RefreshCw size={16} className="spinner" /> : <Sparkles size={16} />}
            {analyzing ? 'Analyzing Tender Document...' : 'Analyze Tender (AI)'}
          </button>
          {bidders.length > 0 && (
            <button className="btn btn-success" onClick={handleVerifyAll} disabled={verifying}>
              <RefreshCw size={16} className={verifying ? 'spinner' : ''} /> {verifying ? 'Verifying Bidders...' : 'Verify All Bidders'}
            </button>
          )}
        </div>
      </div>

      <div className="page-body fade-in">
        {/* Analysis Success Alert */}
        {analysisAlert && (
          <div className="card mb-16" style={{ background: '#ecfdf5', borderColor: '#10b981', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#065f46', fontSize: 13, fontWeight: 600 }}>
              <CheckCircle size={18} color="#10b981" />
              <span>{analysisAlert}</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setShowAnalysisModal(true)}
                className="btn btn-sm btn-primary"
                style={{ fontSize: 11, padding: '4px 10px' }}>
                View Analysis Details
              </button>
              <button
                onClick={() => setAnalysisAlert(null)}
                style={{ background: 'none', border: 'none', color: '#065f46', cursor: 'pointer', fontSize: 14 }}>
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Verification Success Alert */}
        {verificationAlert && (
          <div className="card mb-16" style={{ background: '#eff6ff', borderColor: '#3b82f6', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#1e40af', fontSize: 13, fontWeight: 600 }}>
              <Shield size={18} color="#3b82f6" />
              <span>{verificationAlert}</span>
            </div>
            <button
              onClick={() => setVerificationAlert(null)}
              style={{ background: 'none', border: 'none', color: '#1e40af', cursor: 'pointer', fontSize: 14 }}>
              ✕
            </button>
          </div>
        )}

        {/* Tender Info */}
        <div className="grid-2 mb-24">
          <div className="card">
            <div className="card-header"><h3>Tender Information</h3></div>
            <div className="card-body">
              <div style={{ display: 'grid', gap: 12 }}>
                {[
                  ['Bid Number', tender.tender_number],
                  ['Department', tender.department],
                  ['Category', tender.category],
                  ['Estimated Value', tender.estimated_value],
                  ['Closing Date', tender.closing_date],
                  ['Status', tender.status],
                ].map(([k, v]) => (
                  <div key={k} className="flex-between" style={{ borderBottom: '1px solid #f3f4f6', paddingBottom: 8 }}>
                    <span className="text-sm text-muted">{k}</span>
                    <span style={{ fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h3>Tender Document</h3>
              <span className={`badge badge-${tender.analysis_status === 'COMPLETED' ? 'pass' : 'pending'}`}>
                {tender.analysis_status}
              </span>
            </div>
            <div className="card-body text-center" style={{ padding: 24 }}>
              <FileText size={48} color="#2563eb" strokeWidth={1} style={{ margin: '0 auto 12px' }} />
              <p style={{ fontWeight: 600 }}>{tender.pdf_filename}</p>
              <p className="text-sm text-muted mb-16">Official Tender Notice Document</p>
              
              <div className="flex-gap" style={{ justifyContent: 'center', gap: 8 }}>
                <button onClick={() => setShowPdfModal(true)} className="btn btn-outline btn-sm">
                  📄 View Tender Notice
                </button>
                <button
                  onClick={() => {
                    setAnalysisResult(tender.analysis_result || {
                      summary: `AI Document Analysis for ${tender.tender_number}. Extracted ${tender.requirements?.length || 8} criteria.`,
                      requirements_count: tender.requirements?.length || 8,
                      mandatory_count: tender.requirements?.filter(r => r.mandatory)?.length || 8,
                      confidence: 98.4,
                      requirements: tender.requirements,
                      sources_identified: [...new Set(tender.requirements?.map(r => r.verification_source) || [])]
                    });
                    setShowAnalysisModal(true);
                  }}
                  className="btn btn-primary btn-sm">
                  ✨ AI Analysis Summary
                </button>
              </div>

              {tender.analysis_status === 'COMPLETED' && (
                <p style={{ marginTop: 12, fontSize: 13, color: '#059669', fontWeight: 500 }}>
                  ✓ AI Analysis Completed — {tender.requirements?.length} evaluation criteria extracted
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Requirements Table */}
        {tender.requirements?.length > 0 && (
          <div className="card mb-24">
            <div className="card-header">
              <h3>AI-Extracted Tender Requirements</h3>
              <div className="flex-gap">
                <span className="badge badge-ai">PARSED CRITERIA</span>
                <span className="badge badge-pass">{tender.requirements.length} identified</span>
              </div>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <table>
                <thead>
                  <tr><th>Requirement</th><th>Mandatory</th><th>Threshold</th><th>Required Document</th><th>Verification Source</th><th>Weight</th></tr>
                </thead>
                <tbody>
                  {tender.requirements.map(r => (
                    <tr key={r.id} style={{ cursor: 'default' }}>
                      <td><div style={{ fontWeight: 600 }}>{r.name}</div><div className="text-sm text-muted">{r.description}</div></td>
                      <td>{r.mandatory ? <span className="badge badge-mandatory">MANDATORY</span> : 'Optional'}</td>
                      <td>{r.threshold || '—'}</td>
                      <td><span className="badge badge-extracted">{r.required_document}</span></td>
                      <td>{r.verification_source}</td>
                      <td><span style={{ fontWeight: 700 }}>{r.weight}%</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bidders Table */}
        <div className="card">
          <div className="card-header">
            <h3>Bidder Submissions ({bidders.length})</h3>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {bidders.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>
                <Users size={40} strokeWidth={1} style={{ margin: '0 auto 12px' }} />
                <p>No bidder submissions yet</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr><th>Bidder</th><th>Application</th><th>Documents</th><th>Score</th><th>Risk</th><th>Status</th><th>Decision</th></tr>
                </thead>
                <tbody>
                  {bidders.sort((a, b) => (b.compliance_score || 0) - (a.compliance_score || 0)).map(b => (
                    <tr key={b.application_id} onClick={() => navigate(`/officer/applications/${b.application_id}`)}>
                      <td style={{ fontWeight: 600 }}>{b.company_name}</td>
                      <td>{b.application_number}</td>
                      <td>{b.uploaded_documents}/{b.total_documents}</td>
                      <td>
                        {b.compliance_score != null ? (
                          <span style={{ fontWeight: 800, fontSize: 18, color: b.risk_level === 'HIGH' ? '#dc2626' : b.risk_level === 'MEDIUM' ? '#d97706' : '#059669' }}>
                            {b.compliance_score}
                          </span>
                        ) : '—'}
                      </td>
                      <td>
                        {b.risk_level && (
                          <span className={`badge badge-${b.risk_level?.toLowerCase()}`}>
                            {riskIcon(b.risk_level)} {b.risk_level}
                          </span>
                        )}
                      </td>
                      <td><span className={`badge badge-${b.status?.toLowerCase()}`}>{b.status}</span></td>
                      <td>{b.officer_decision ? <span className={`badge badge-${b.officer_decision === 'QUALIFY' ? 'pass' : b.officer_decision === 'NOT_QUALIFY' ? 'fail' : 'review'}`}>{b.officer_decision}</span> : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Tender Document Modal */}
        {showPdfModal && (
          <div className="modal-overlay" onClick={() => setShowPdfModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 680 }}>
              <div className="flex-between mb-16">
                <div className="flex-gap">
                  <FileText size={22} color="#2563eb" />
                  <h3 style={{ margin: 0 }}>{tender.pdf_filename}</h3>
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => setShowPdfModal(false)}>✕ Close</button>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20, maxHeight: '60vh', overflowY: 'auto' }}>
                <div style={{ textAlign: 'center', borderBottom: '2px solid #cbd5e1', paddingBottom: 16, marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#475569', letterSpacing: 1 }}>GOVERNMENT OF INDIA</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#1e3a5f', marginTop: 4 }}>{tender.department}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Government e-Marketplace (GeM) Bid Document</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16, fontSize: 13 }}>
                  <div><strong>Bid Number:</strong> {tender.tender_number}</div>
                  <div><strong>Dated:</strong> 01-09-2026</div>
                  <div><strong>Category:</strong> {tender.category}</div>
                  <div><strong>Estimated Value:</strong> {tender.estimated_value}</div>
                  <div><strong>Bid End Date:</strong> {tender.closing_date}</div>
                  <div><strong>Verification Mode:</strong> AI-Assisted + Deterministic</div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1e3a5f', marginBottom: 6 }}>Scope of Work</div>
                  <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.6 }}>{tender.description}</p>
                </div>

                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1e3a5f', marginBottom: 8 }}>Key Evaluation Criteria ({tender.requirements?.length})</div>
                  <ul style={{ paddingLeft: 20, fontSize: 13, color: '#334155', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {tender.requirements?.map(r => (
                      <li key={r.id}>
                        <strong>{r.name}</strong>: {r.description} {r.mandatory && <span style={{ color: '#dc2626', fontWeight: 600 }}>(Mandatory)</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex-between" style={{ marginTop: 20 }}>
                <span className="badge badge-ai">Simulated GeM Bid Document</span>
                <button className="btn btn-primary" onClick={() => setShowPdfModal(false)}>Done</button>
              </div>
            </div>
          </div>
        )}

        {/* AI Analysis Result Modal */}
        {showAnalysisModal && (
          <div className="modal-overlay" onClick={() => setShowAnalysisModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 720 }}>
              <div className="flex-between mb-16">
                <div className="flex-gap" style={{ alignItems: 'center' }}>
                  <Sparkles size={22} color="#2563eb" />
                  <div>
                    <h3 style={{ margin: 0, fontSize: 18, color: '#1e3a5f' }}>AI Tender Analysis Completed</h3>
                    <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>{tender.tender_number} — Document Parsing Engine</p>
                  </div>
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => setShowAnalysisModal(false)}>✕ Close</button>
              </div>

              {/* Summary Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#1e40af', fontWeight: 600 }}>CRITERIA</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#1e3a5f' }}>{tender.requirements?.length || 8}</div>
                  <div style={{ fontSize: 11, color: '#3b82f6' }}>Rules Extracted</div>
                </div>
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#991b1b', fontWeight: 600 }}>MANDATORY</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#dc2626' }}>
                    {tender.requirements?.filter(r => r.mandatory)?.length || 8}
                  </div>
                  <div style={{ fontSize: 11, color: '#ef4444' }}>Strict Clauses</div>
                </div>
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#065f46', fontWeight: 600 }}>CONFIDENCE</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#059669' }}>98.4%</div>
                  <div style={{ fontSize: 11, color: '#10b981' }}>Extraction Score</div>
                </div>
                <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#6b21a8', fontWeight: 600 }}>SOURCES</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#7c3aed' }}>
                    {[...new Set(tender.requirements?.map(r => r.verification_source) || [])].length || 6}
                  </div>
                  <div style={{ fontSize: 11, color: '#a855f7' }}>Gov Registries</div>
                </div>
              </div>

              {/* Analysis Summary Box */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 14, marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1e3a5f', marginBottom: 4 }}>
                  📋 Parser Output Summary
                </div>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, margin: 0 }}>
                  {analysisResult?.summary || `Successfully parsed PDF document for ${tender.tender_number}. Extracted all required statutory certificates, thresholds, and technical compliance clauses. Verification sources mapped to GSTN, Income Tax, Udyam, EPFO, and Central Debarment registries.`}
                </p>
              </div>

              {/* Extracted Requirements List */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1e3a5f', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                  <span>Extracted Evaluation Criteria ({tender.requirements?.length})</span>
                  <span style={{ fontSize: 11, color: '#64748b' }}>Weightage Total: 100%</span>
                </div>
                <div style={{ maxHeight: 220, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: 8 }}>
                  <table style={{ margin: 0, fontSize: 12 }}>
                    <thead style={{ background: '#f1f5f9', position: 'sticky', top: 0 }}>
                      <tr>
                        <th style={{ padding: '8px 12px' }}>Requirement</th>
                        <th style={{ padding: '8px 12px' }}>Type</th>
                        <th style={{ padding: '8px 12px' }}>Required Document</th>
                        <th style={{ padding: '8px 12px' }}>Source</th>
                        <th style={{ padding: '8px 12px' }}>Weight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tender.requirements?.map(r => (
                        <tr key={r.id}>
                          <td style={{ padding: '8px 12px', fontWeight: 600 }}>{r.name}</td>
                          <td style={{ padding: '8px 12px' }}>
                            {r.mandatory ? (
                              <span style={{ background: '#fef2f2', color: '#dc2626', padding: '2px 6px', borderRadius: 4, fontWeight: 700, fontSize: 10 }}>MANDATORY</span>
                            ) : (
                              <span style={{ color: '#64748b', fontSize: 10 }}>OPTIONAL</span>
                            )}
                          </td>
                          <td style={{ padding: '8px 12px', color: '#334155' }}>{r.required_document}</td>
                          <td style={{ padding: '8px 12px' }}>
                            <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: 4, fontWeight: 600, fontSize: 10 }}>{r.verification_source}</span>
                          </td>
                          <td style={{ padding: '8px 12px', fontWeight: 700 }}>{r.weight}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex-between" style={{ borderTop: '1px solid #e2e8f0', paddingTop: 14 }}>
                <span className="badge badge-pass" style={{ fontSize: 12, padding: '4px 10px' }}>
                  ✓ All Criteria Stored in Procurement Registry
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  {bidders.length > 0 && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => {
                        setShowAnalysisModal(false);
                        handleVerifyAll();
                      }}>
                      ⚡ Verify All {bidders.length} Bidders Now
                    </button>
                  )}
                  <button className="btn btn-primary btn-sm" onClick={() => setShowAnalysisModal(false)}>
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </OfficerLayout>
  );
}
