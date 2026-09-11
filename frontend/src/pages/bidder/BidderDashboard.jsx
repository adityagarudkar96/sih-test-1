import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import BidderLayout from '../../components/BidderLayout';
import { getMyApplications, getTenders } from '../../api';

export default function BidderDashboard({ user, onLogout }) {
  const [apps, setApps] = useState([]);
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getMyApplications().catch(() => ({ data: [] })), getTenders().catch(() => ({ data: [] }))])
      .then(([appsRes, tendersRes]) => {
        setApps(appsRes.data || []);
        setTenders(tendersRes.data || []);
        setLoading(false);
      });
  }, []);

  const submitted = apps.filter(a => a.status === 'SUBMITTED' || a.status === 'VERIFIED').length;
  const qualified = apps.filter(a => a.status === 'QUALIFIED').length;

  return (
    <BidderLayout user={user} onLogout={onLogout}>
      <div className="page-header">
        <div>
          <h2>Welcome, {user.name}</h2>
          <p>{user.company_name || user.organization}</p>
        </div>
      </div>
      <div className="page-body fade-in">
        <div className="principle-banner">
          <span className="principle-text">
            <span className="principle-highlight">AI verifies. Evidence supports. Rules evaluate. Officer decides.</span>
            — Your documents are verified through AI-powered compliance checking.
          </span>
        </div>

        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-label">Available Tenders</div>
            <div className="stat-value">{tenders.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">My Applications</div>
            <div className="stat-value">{apps.length}</div>
          </div>
          <div className="stat-card green">
            <div className="stat-label">Submitted</div>
            <div className="stat-value">{submitted}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Qualified</div>
            <div className="stat-value">{qualified}</div>
          </div>
        </div>

        {/* My Applications */}
        <div className="card mb-24">
          <div className="card-header">
            <h3>My Bid Applications</h3>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/bidder/tenders')}>
              Browse Tenders
            </button>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {loading ? (
              <div className="loading"><div className="spinner"></div></div>
            ) : apps.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>
                <FileText size={40} strokeWidth={1} style={{ margin: '0 auto 12px' }} />
                <p>No applications yet. Browse available tenders to get started.</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Application</th>
                    <th>Tender</th>
                    <th>Department</th>
                    <th>Documents</th>
                    <th>Status</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.map(app => (
                    <tr key={app.id} onClick={() => navigate(`/bidder/applications/${app.id}`)}>
                      <td style={{ fontWeight: 600 }}>{app.application_number}</td>
                      <td>{app.tender?.tender_number}</td>
                      <td>{app.tender?.department}</td>
                      <td>{app.uploaded_documents}/{app.total_documents}</td>
                      <td><span className={`badge badge-${app.status?.toLowerCase()}`}>{app.status}</span></td>
                      <td>{app.compliance_score != null ? `${app.compliance_score}/100` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Available Tenders */}
        <div className="card">
          <div className="card-header"><h3>Available Tenders</h3></div>
          <div className="card-body">
            <div className="tender-grid">
              {tenders.map(t => (
                <div key={t.id} className="tender-card" onClick={() => navigate(`/bidder/tenders/${t.id}`)}>
                  <div className="tender-number">{t.tender_number}</div>
                  <div className="tender-title">{t.title}</div>
                  <div className="tender-dept">{t.department}</div>
                  <div className="tender-meta">
                    <span>💰 {t.estimated_value}</span>
                    <span>📋 {t.requirement_count} requirements</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BidderLayout>
  );
}
