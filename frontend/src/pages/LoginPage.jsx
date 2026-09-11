import { useState } from 'react';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { login } from '../api';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      onLogin(res.data.user, res.data.token);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials');
    }
    setLoading(false);
  };

  const quickLogin = (em, pw) => { setEmail(em); setPassword(pw); };

  return (
    <div className="login-page">
      <div className="login-card fade-in">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Shield size={48} color="#2563eb" strokeWidth={1.5} />
        </div>
        <h1 style={{ textAlign: 'center' }}>GeM Compliance Platform</h1>
        <p className="subtitle" style={{ textAlign: 'center' }}>
          AI-Powered Bid Compliance Verification
        </p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input className="form-input" type="email" value={email}
              onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input className="form-input" type={showPw ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)} placeholder="Enter password" required />
              <button type="button" onClick={() => setShowPw(!showPw)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: 28, padding: 16, background: '#f0f4f8', borderRadius: 10 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#334e68', marginBottom: 10 }}>
            🔑 Demo Credentials
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button onClick={() => quickLogin('officer@gem-demo.gov.in', 'officer123')}
              style={{ background: '#1e3a5f', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 500, textAlign: 'left' }}>
              👤 Officer — officer@gem-demo.gov.in
            </button>
            <button onClick={() => quickLogin('xyz@bidder.com', 'bidder123')}
              style={{ background: '#f9fafb', color: '#334e68', border: '1px solid #d1d5db', padding: '8px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 500, textAlign: 'left' }}>
              🏭 XYZ Industries — xyz@bidder.com
            </button>
            <button onClick={() => quickLogin('abc@bidder.com', 'bidder123')}
              style={{ background: '#f9fafb', color: '#334e68', border: '1px solid #d1d5db', padding: '8px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 500, textAlign: 'left' }}>
              💻 ABC Technologies — abc@bidder.com
            </button>
            <button onClick={() => quickLogin('quick@bidder.com', 'bidder123')}
              style={{ background: '#f9fafb', color: '#334e68', border: '1px solid #d1d5db', padding: '8px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 500, textAlign: 'left' }}>
              📦 QuickSupply — quick@bidder.com
            </button>
          </div>
        </div>

        <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', marginTop: 16 }}>
          DEMO / SYNTHETIC — All credentials are for demonstration only
        </p>
      </div>
    </div>
  );
}
