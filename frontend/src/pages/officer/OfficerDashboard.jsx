import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, FileText, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import OfficerLayout from '../../components/OfficerLayout';
import { getDashboardStats, getTenders } from '../../api';

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

export default function OfficerDashboard({ user, onLogout }) {
  const [stats, setStats] = useState({});
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getDashboardStats().catch(() => ({ data: {} })), getTenders().catch(() => ({ data: [] }))])
      .then(([statsRes, tendersRes]) => {
        setStats(statsRes.data || {});
        setTenders(tendersRes.data || []);
        setLoading(false);
      });
  }, []);

  const pieData = [
    { name: 'Compliant', value: stats.compliant || 0 },
    { name: 'Review', value: stats.review_required || 0 },
    { name: 'High Risk', value: stats.high_risk || 0 },
  ];

  return (
    <OfficerLayout user={user} onLogout={onLogout}>
      <div className="page-header">
        <div>
          <h2>Procurement Dashboard</h2>
          <p>AI-Powered Bid Compliance Verification Overview</p>
        </div>
        <span className="badge badge-ai" style={{ padding: '6px 14px', fontSize: 12 }}>
          <Shield size={12} /> GeM Compliance Platform
        </span>
      </div>

      <div className="page-body fade-in">
        <div className="principle-banner">
          <span className="principle-text">
            <span className="principle-highlight">AI verifies. Evidence supports. Rules evaluate. Officer decides.</span>
            — From Tender Understanding to Bidder Verification to Evidence-Backed Decision.
          </span>
        </div>

        {loading ? <div className="loading"><div className="spinner"></div></div> : (
          <>
            {/* Stats */}
            <div className="stats-grid">
              <div className="stat-card blue"><div className="stat-label">Active Tenders</div><div className="stat-value">{stats.active_tenders || 0}</div></div>
              <div className="stat-card"><div className="stat-label">Total Bidders</div><div className="stat-value">{stats.total_bidders || 0}</div></div>
              <div className="stat-card"><div className="stat-label">Submitted Bids</div><div className="stat-value">{stats.submitted_bids || 0}</div></div>
              <div className="stat-card green"><div className="stat-label">Compliant</div><div className="stat-value">{stats.compliant || 0}</div><div className="stat-sub"><CheckCircle size={12} style={{ verticalAlign: 'middle' }} /> LOW RISK</div></div>
              <div className="stat-card amber"><div className="stat-label">Review Required</div><div className="stat-value">{stats.review_required || 0}</div><div className="stat-sub"><AlertTriangle size={12} style={{ verticalAlign: 'middle' }} /> MEDIUM RISK</div></div>
              <div className="stat-card red"><div className="stat-label">High Risk</div><div className="stat-value">{stats.high_risk || 0}</div><div className="stat-sub"><XCircle size={12} style={{ verticalAlign: 'middle' }} /> NEEDS ATTENTION</div></div>
            </div>

            {/* Charts Row */}
            <div className="grid-2 mb-24">
              <div className="card">
                <div className="card-header"><h3>Compliance Distribution</h3></div>
                <div className="card-body" style={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                        {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="card">
                <div className="card-header"><h3>Bidders by Tender</h3></div>
                <div className="card-body" style={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tenders.map(t => ({ name: t.tender_number, bidders: t.bidder_count }))}>
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="bidders" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Active Tenders */}
            <div className="card">
              <div className="card-header"><h3>Active Tenders</h3></div>
              <div className="card-body">
                <div className="tender-grid">
                  {tenders.map(t => (
                    <div key={t.id} className="tender-card" onClick={() => navigate(`/officer/tenders/${t.id}`)}>
                      <div className="flex-between">
                        <div className="tender-number">{t.tender_number}</div>
                        <span className={`badge badge-${t.analysis_status === 'COMPLETED' ? 'pass' : 'pending'}`}>
                          {t.analysis_status}
                        </span>
                      </div>
                      <div className="tender-title">{t.title}</div>
                      <div className="tender-dept">{t.department}</div>
                      <div className="tender-meta">
                        <span>💰 {t.estimated_value}</span>
                        <span>👥 {t.bidder_count} Bidders</span>
                        <span>📋 {t.requirement_count} Reqs</span>
                      </div>
                      <button className="btn btn-outline btn-sm btn-block" style={{ marginTop: 12 }}>View Details</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#9ca3af' }}>
              Prototype scoring rules — configurable and not official government thresholds.
            </p>
          </>
        )}
      </div>
    </OfficerLayout>
  );
}
