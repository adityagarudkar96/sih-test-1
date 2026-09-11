import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, CheckCircle, FileText, Send, ArrowLeft, Sparkles } from 'lucide-react';
import BidderLayout from '../../components/BidderLayout';
import { getApplication, uploadDocument, uploadDemoDocuments, submitBid } from '../../api';

export default function BidderApplication({ user, onLogout }) {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [demoUploading, setDemoUploading] = useState(false);
  const navigate = useNavigate();
  const fileRefs = useRef({});

  const loadApp = () => {
    getApplication(id).then(r => { setApp(r.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { loadApp(); }, [id]);

  const getUploadedDoc = (reqId) => app?.documents?.find(d => d.requirement_id === reqId);

  const handleFileUpload = async (reqId, docType, file) => {
    setUploading(prev => ({ ...prev, [reqId]: true }));
    try {
      await uploadDocument(id, docType, reqId, file);
      loadApp();
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.detail || err.message));
    }
    setUploading(prev => ({ ...prev, [reqId]: false }));
  };

  const handleDemoUpload = async () => {
    setDemoUploading(true);
    try {
      await uploadDemoDocuments(id);
      loadApp();
    } catch (err) {
      alert('Demo upload failed: ' + (err.response?.data?.detail || err.message));
    }
    setDemoUploading(false);
  };

  const handleSubmit = async () => {
    if (!confirm('Submit your bid? This action cannot be undone.')) return;
    setSubmitting(true);
    try {
      await submitBid(id);
      loadApp();
    } catch (err) {
      alert('Submit failed');
    }
    setSubmitting(false);
  };

  if (loading) return <BidderLayout user={user} onLogout={onLogout}><div className="loading"><div className="spinner"></div></div></BidderLayout>;
  if (!app) return <BidderLayout user={user} onLogout={onLogout}><div className="page-body">Application not found</div></BidderLayout>;

  const allUploaded = app.uploaded_documents >= app.total_documents;
  const isSubmitted = ['SUBMITTED', 'VERIFIED', 'QUALIFIED', 'NOT_QUALIFIED', 'MANUAL_REVIEW'].includes(app.status);

  return (
    <BidderLayout user={user} onLogout={onLogout}>
      <div className="page-header">
        <div>
          <button onClick={() => navigate('/bidder/dashboard')} className="btn btn-outline btn-sm" style={{ marginBottom: 8 }}>
            <ArrowLeft size={14} /> Back
          </button>
          <h2>{app.application_number}</h2>
          <p>{app.tender?.tender_number} — {app.tender?.title}</p>
        </div>
        <span className={`badge badge-${app.status?.toLowerCase()}`} style={{ fontSize: 14, padding: '6px 16px' }}>{app.status}</span>
      </div>

      <div className="page-body fade-in">
        {/* Application Summary */}
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-label">Tender</div><div style={{ fontSize: 16, fontWeight: 700 }}>{app.tender?.tender_number}</div></div>
          <div className="stat-card"><div className="stat-label">Department</div><div style={{ fontSize: 14, fontWeight: 600 }}>{app.tender?.department}</div></div>
          <div className="stat-card blue"><div className="stat-label">Documents</div><div className="stat-value">{app.uploaded_documents}/{app.total_documents}</div></div>
          <div className="stat-card"><div className="stat-label">Status</div><div style={{ fontSize: 16, fontWeight: 700 }}>{app.status}</div></div>
        </div>

        {/* Document Checklist */}
        {!isSubmitted && (
          <>
            <div className="checklist-header">
              📋 <strong>Tender-Specific Document Checklist</strong> — This checklist was dynamically generated from the requirements of <strong>{app.tender?.tender_number}</strong>.
            </div>

            <div className="flex-between mb-16">
              <h3>Required Documents</h3>
              <button className="btn btn-warning btn-sm" onClick={handleDemoUpload} disabled={demoUploading}>
                <Sparkles size={14} /> {demoUploading ? 'Uploading Demo Docs...' : 'Upload Demo Documents'}
              </button>
            </div>

            <div className="doc-grid mb-24">
              {app.requirements?.map(req => {
                const uploaded = getUploadedDoc(req.id);
                const docType = (req.required_document || '').replace(/ /g, '_');
                return (
                  <div key={req.id} className={`upload-card ${uploaded ? 'uploaded' : ''}`}
                    onClick={() => !uploaded && fileRefs.current[req.id]?.click()}>
                    <input type="file" ref={el => fileRefs.current[req.id] = el} hidden accept=".pdf,.jpg,.png"
                      onChange={e => e.target.files[0] && handleFileUpload(req.id, docType, e.target.files[0])} />
                    <div className="upload-icon">
                      {uploading[req.id] ? '⏳' : uploaded ? <CheckCircle size={32} color="#10b981" /> : <Upload size={32} />}
                    </div>
                    <div className="upload-label">{req.required_document}</div>
                    <div className="upload-hint">
                      {uploaded ? `✓ ${uploaded.original_filename}` : 'Click to upload PDF'}
                    </div>
                    {req.mandatory && <span className="badge badge-mandatory" style={{ marginTop: 6 }}>MANDATORY</span>}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Extracted Information */}
        {app.documents?.length > 0 && (
          <div className="card mb-24">
            <div className="card-header">
              <h3>📊 AI Extracted Information</h3>
              <span className="badge badge-ai">AUTO-PARSED</span>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
                {app.documents.map(doc => (
                  <div key={doc.id} className="extraction-card">
                    <div className="extraction-header">
                      <span style={{ fontWeight: 600, fontSize: 14, color: '#1e3a5f' }}>
                        <FileText size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
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
                    {doc.confidence && (
                      <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
                        Confidence: {doc.confidence}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        {!isSubmitted && allUploaded && (
          <div className="card">
            <div className="card-body text-center" style={{ padding: 32 }}>
              <h3 style={{ marginBottom: 8 }}>Ready to Submit</h3>
              <p className="text-muted mb-16">
                {app.uploaded_documents}/{app.total_documents} documents uploaded and processed
              </p>
              <button className="btn btn-success btn-lg" onClick={handleSubmit} disabled={submitting}>
                <Send size={18} /> {submitting ? 'Submitting...' : 'Submit Bid'}
              </button>
            </div>
          </div>
        )}

        {/* Submitted Confirmation */}
        {isSubmitted && (
          <div className="card" style={{ borderColor: '#10b981' }}>
            <div className="card-body text-center" style={{ padding: 32 }}>
              <CheckCircle size={48} color="#10b981" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ color: '#047857' }}>Bid Submitted Successfully</h3>
              <p style={{ fontSize: 16, fontWeight: 600, marginTop: 8 }}>Application: {app.application_number}</p>
              <p className="text-muted">Submitted at: {app.submitted_at ? new Date(app.submitted_at).toLocaleString() : 'N/A'}</p>
              {app.compliance_score != null && (
                <div style={{ marginTop: 16 }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: app.risk_level === 'HIGH' ? '#dc2626' : app.risk_level === 'MEDIUM' ? '#d97706' : '#059669' }}>
                    {app.compliance_score}/100
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </BidderLayout>
  );
}
