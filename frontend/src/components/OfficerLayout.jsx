import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, LogOut, Shield, Users, BarChart3 } from 'lucide-react';

export default function OfficerLayout({ user, onLogout, children }) {
  const navigate = useNavigate();
  const handleLogout = () => { onLogout(); navigate('/'); };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h1>🛡 GeM Compliance</h1>
          <p>Procurement Officer</p>
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-section">Navigation</div>
          <NavLink to="/officer/dashboard"><LayoutDashboard size={18} /> Dashboard</NavLink>
          <div className="sidebar-section">Principle</div>
          <div style={{ padding: '8px 14px', fontSize: 11, color: '#9fb3c8', lineHeight: 1.5 }}>
            <Shield size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
            AI verifies. Evidence supports. Rules evaluate. <strong style={{ color: '#fff' }}>Officer decides.</strong>
          </div>
        </nav>
        <div className="sidebar-footer">
          <div className="user-name">{user.name}</div>
          <div className="user-info">{user.email}</div>
          <button onClick={handleLogout} style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 13 }}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
