import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Login({ setAuth }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const res = await api.post('/api/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      localStorage.setItem('token', res.data.access_token);
      setAuth(true);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="auth-container" style={{ padding: '2rem' }}>
      <div className="glass-card" style={{ 
        display: 'flex', 
        flexDirection: 'row',
        flexWrap: 'wrap',
        maxWidth: '1000px', 
        width: '100%', 
        padding: 0, 
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        
        {/* Left Side - Poster Image */}
        <div style={{ flex: '1 1 500px', minHeight: '400px', position: 'relative', backgroundColor: '#000' }}>
          <img 
            src="/images/login_banner.jpg" 
            alt="Nashik Kumbh Mela 2027" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
          />
        </div>

        {/* Right Side - Login Form */}
        <div style={{ flex: '1 1 350px', padding: '3.5rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(15,23,42,0.6)' }}>
          <h2 className="page-title" style={{textAlign: 'center', color: 'var(--primary-color)', fontSize: '1.8rem', marginBottom: '0.5rem'}}>
            Nashik Kumbh Mela
          </h2>
          <p className="page-subtitle" style={{textAlign: 'center', marginBottom: '2rem'}}>Centralized Decision Support System</p>
          
          {error && <div style={{color: 'var(--danger-color)', textAlign: 'center', marginBottom: '1rem', background: 'rgba(239,68,68,0.1)', padding: '0.5rem', borderRadius: '0.5rem'}}>{error}</div>}

          <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--text-secondary)' }}>Email / Username</label>
              <input 
                type="email" 
                className="form-input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                style={{ background: 'rgba(0,0,0,0.3)' }}
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--text-secondary)' }}>Password</label>
              <input 
                type="password" 
                className="form-input" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                style={{ background: 'rgba(0,0,0,0.3)' }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{marginTop: '1rem', justifyContent: 'center', padding: '0.8rem', fontSize: '1rem', fontWeight: 'bold'}}>
              Secure Login
            </button>
          </form>

          <div style={{textAlign: 'center', color: 'var(--text-secondary)', marginTop: '2rem', fontSize: '0.9rem'}}>
            Authorized Personnel Only
            <div style={{ marginTop: '0.5rem' }}>
              Don't have an account? <Link to="/signup" style={{color: 'var(--primary-color)', fontWeight: 'bold'}}>Sign up</Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
