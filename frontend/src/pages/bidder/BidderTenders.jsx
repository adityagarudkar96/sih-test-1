import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BidderLayout from '../../components/BidderLayout';
import { getTenders } from '../../api';

export default function BidderTenders({ user, onLogout }) {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getTenders().then(r => { setTenders(r.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <BidderLayout user={user} onLogout={onLogout}>
      <div className="page-header">
        <div>
          <h2>Available Tenders</h2>
          <p>Browse and apply to government procurement tenders</p>
        </div>
      </div>
      <div className="page-body fade-in">
        {loading ? (
          <div className="loading"><div className="spinner"></div></div>
        ) : (
          <div className="tender-grid">
            {tenders.map(t => (
              <div key={t.id} className="tender-card" onClick={() => navigate(`/bidder/tenders/${t.id}`)}>
                <div className="flex-between">
                  <div className="tender-number">{t.tender_number}</div>
                  <span className="badge badge-active">{t.status}</span>
                </div>
                <div className="tender-title">{t.title}</div>
                <div className="tender-dept">{t.department}</div>
                <div className="tender-meta">
                  <span>💰 {t.estimated_value}</span>
                  <span>📅 {t.closing_date}</span>
                </div>
                <div className="tender-meta">
                  <span>📋 {t.requirement_count} requirements</span>
                  <span>👥 {t.bidder_count} bidders</span>
                </div>
                <button className="btn btn-primary btn-sm btn-block" style={{ marginTop: 12 }}
                  onClick={e => { e.stopPropagation(); navigate(`/bidder/tenders/${t.id}`); }}>
                  View Details & Apply
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </BidderLayout>
  );
}
