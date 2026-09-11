import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import BidderDashboard from './pages/bidder/BidderDashboard';
import BidderTenders from './pages/bidder/BidderTenders';
import BidderTenderDetail from './pages/bidder/BidderTenderDetail';
import BidderApplication from './pages/bidder/BidderApplication';
import OfficerDashboard from './pages/officer/OfficerDashboard';
import OfficerTenderDetail from './pages/officer/OfficerTenderDetail';
import OfficerApplicationDetail from './pages/officer/OfficerApplicationDetail';
import { USERS } from './mockData';
import { resetDemoData } from './api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('gem_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('gem_user', JSON.stringify(userData));
    localStorage.setItem('gem_token', token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('gem_user');
    localStorage.removeItem('gem_token');
  };

  const switchAccount = (email) => {
    const target = USERS.find(u => u.email === email);
    if (target) {
      handleLogin(target, `demo-token-${target.id}`);
      if (target.role === 'officer') {
        navigate('/officer/dashboard');
      } else {
        navigate('/bidder/dashboard');
      }
    }
  };

  const handleReset = () => {
    if (confirm('Reset all demo tenders, bids, scores, and decisions to initial state?')) {
      resetDemoData();
      window.location.reload();
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  if (!user) return <LoginPage onLogin={handleLogin} />;

  return (
    <>
      <div className="demo-banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, padding: '6px 16px', background: '#1e293b', color: '#f8fafc', fontSize: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ background: '#3b82f6', color: '#fff', padding: '2px 6px', borderRadius: 4, fontWeight: 700, fontSize: 10 }}>DEMO MVP</span>
          <span>Switch Profile:</span>
          <div style={{ display: 'inline-flex', gap: 4, flexWrap: 'wrap' }}>
            <button
              onClick={() => switchAccount('officer@gem-demo.gov.in')}
              style={{
                background: user.role === 'officer' ? '#2563eb' : '#334155',
                color: '#fff', border: 'none', borderRadius: 4, padding: '2px 8px',
                cursor: 'pointer', fontSize: 11, fontWeight: user.role === 'officer' ? 700 : 400
              }}>
              👤 Officer
            </button>
            <button
              onClick={() => switchAccount('abc@bidder.com')}
              style={{
                background: user.email === 'abc@bidder.com' ? '#10b981' : '#334155',
                color: '#fff', border: 'none', borderRadius: 4, padding: '2px 8px',
                cursor: 'pointer', fontSize: 11, fontWeight: user.email === 'abc@bidder.com' ? 700 : 400
              }}>
              💻 ABC Tech (Low Risk)
            </button>
            <button
              onClick={() => switchAccount('xyz@bidder.com')}
              style={{
                background: user.email === 'xyz@bidder.com' ? '#10b981' : '#334155',
                color: '#fff', border: 'none', borderRadius: 4, padding: '2px 8px',
                cursor: 'pointer', fontSize: 11, fontWeight: user.email === 'xyz@bidder.com' ? 700 : 400
              }}>
              🏭 XYZ Ind
            </button>
            <button
              onClick={() => switchAccount('quick@bidder.com')}
              style={{
                background: user.email === 'quick@bidder.com' ? '#ef4444' : '#334155',
                color: '#fff', border: 'none', borderRadius: 4, padding: '2px 8px',
                cursor: 'pointer', fontSize: 11, fontWeight: user.email === 'quick@bidder.com' ? 700 : 400
              }}>
              ⚠️ QuickSupply (High Risk)
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={handleReset}
            title="Reset platform demo state"
            style={{
              background: 'transparent', color: '#94a3b8', border: '1px solid #475569',
              borderRadius: 4, padding: '2px 8px', cursor: 'pointer', fontSize: 11
            }}>
            🔄 Reset Demo Data
          </button>
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent', color: '#f87171', border: 'none',
              cursor: 'pointer', fontSize: 11, fontWeight: 600
            }}>
            Sign Out
          </button>
        </div>
      </div>

      <Routes>
        {user.role === 'bidder' ? (
          <>
            <Route path="/bidder/dashboard" element={<BidderDashboard user={user} onLogout={handleLogout} />} />
            <Route path="/bidder/tenders" element={<BidderTenders user={user} onLogout={handleLogout} />} />
            <Route path="/bidder/tenders/:id" element={<BidderTenderDetail user={user} onLogout={handleLogout} />} />
            <Route path="/bidder/applications/:id" element={<BidderApplication user={user} onLogout={handleLogout} />} />
            <Route path="*" element={<Navigate to="/bidder/dashboard" />} />
          </>
        ) : (
          <>
            <Route path="/officer/dashboard" element={<OfficerDashboard user={user} onLogout={handleLogout} />} />
            <Route path="/officer/tenders/:id" element={<OfficerTenderDetail user={user} onLogout={handleLogout} />} />
            <Route path="/officer/applications/:id" element={<OfficerApplicationDetail user={user} onLogout={handleLogout} />} />
            <Route path="*" element={<Navigate to="/officer/dashboard" />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
