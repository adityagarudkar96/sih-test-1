import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, CheckCircle, AlertCircle } from 'lucide-react';
import BidderLayout from '../../components/BidderLayout';
import { getTender, applyToTender } from '../../api';

export default function BidderTenderDetail({ user, onLogout }) {
  const { id } = useParams();
  const [tender, setTender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getTender(id).then(r => { setTender(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    try {
      const res = await applyToTender(id);
      navigate(`/bidder/applications/${res.data.application_id}`);
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to apply');
    }
    setApplying(false);
  };

  if (loading) return <BidderLayout user={user} onLogout={onLogout}><div className="loading"><div className="spinner"></div></div></BidderLayout>;
  if (!tender) return <BidderLayout user={user} onLogout={onLogout}><div className="page-body">Tender not found</div></BidderLayout>;

  return (
    <BidderLayout user={user} onLogout={onLogout}>
      <div className="page-header">
        <div>
          <h2>{tender.tender_number}</h2>
          <p>{tender.title}</p>
        </div>
        <button className="btn btn-primary btn-lg" onClick={handleApply} disabled={applying}>
          {applying ? 'Applying...' : '📝 Apply to this Tender'}
        </button>
      </div>
      <div className="page-body fade-in">
        {/* Tender Info */}
        <div className="card mb-24">
          <div className="card-header"><h3>Tender Details</h3></div>
          <div className="card-body">
            <div className="grid-2">
              <div><span className="text-sm text-muted">Department</span><p style={{ fontWeight: 600 }}>{tender.department}</p></div>
              <div><span className="text-sm text-muted">Category</span><p style={{ fontWeight: 600 }}>{tender.category}</p></div>
              <div><span className="text-sm text-muted">Estimated Value</span><p style={{ fontWeight: 600 }}>{tender.estimated_value}</p></div>
              <div><span className="text-sm text-muted">Closing Date</span><p style={{ fontWeight: 600 }}>{tender.closing_date}</p></div>
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="card">
          <div className="card-header">
            <h3>Compliance Requirements — {tender.requirements?.length || 0} identified</h3>
            <span className="badge badge-ai">AI EXTRACTED</span>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Requirement</th>
                  <th>Required Document</th>
                  <th>Mandatory</th>
                  <th>Threshold</th>
                  <th>Weight</th>
                </tr>
              </thead>
              <tbody>
                {tender.requirements?.map((r, i) => (
                  <tr key={r.id} style={{ cursor: 'default' }}>
                    <td>{i + 1}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{r.name}</div>
                      <div className="text-sm text-muted">{r.description}</div>
                    </td>
                    <td><span className="badge badge-extracted">{r.required_document}</span></td>
                    <td>{r.mandatory ? <span className="badge badge-mandatory">MANDATORY</span> : <span className="badge badge-pending">Optional</span>}</td>
                    <td>{r.threshold || '—'}</td>
                    <td>{r.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="checklist-header" style={{ marginTop: 20 }}>
          📋 This tender requires <strong>{tender.requirements?.length || 0} documents</strong> from bidders. 
          The checklist is generated dynamically from the tender's compliance requirements.
        </div>
      </div>
    </BidderLayout>
  );
}
