import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'Admin',
    department: 'General',
    mobile_number: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/auth/register', formData);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed.');
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  return (
    <div className="auth-container">
      <div className="glass-card auth-card" style={{maxWidth: '500px'}}>
        <h2 className="page-title" style={{textAlign: 'center', color: 'var(--primary-color)'}}>Nashik KumbhMela 2027-2028</h2>
        <p className="page-subtitle" style={{textAlign: 'center'}}>Create an Admin Account</p>
        
        {error && <div style={{color: 'var(--danger-color)', textAlign: 'center'}}>{error}</div>}
        {success && <div style={{color: 'var(--success-color)', textAlign: 'center'}}>{success}</div>}

        <form onSubmit={handleSubmit} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" name="full_name" className="form-input" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-input" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-input" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Mobile Number</label>
            <input type="text" name="mobile_number" className="form-input" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select name="role" className="form-input" onChange={handleChange}>
              <option value="Admin">Admin</option>
              <option value="Officer">Officer</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Department</label>
            <select name="department" className="form-input" onChange={handleChange}>
              <option value="General">General</option>
              <option value="Police">Police</option>
              <option value="Medical">Medical</option>
              <option value="Traffic">Traffic</option>
            </select>
          </div>
          <button type="submit" className="btn-primary" style={{gridColumn: '1 / -1', marginTop: '1rem', justifyContent: 'center'}}>
            Sign Up
          </button>
        </form>

        <div style={{textAlign: 'center', color: 'var(--text-secondary)'}}>
          Already have an account? <Link to="/login" style={{color: 'var(--primary-color)'}}>Log in</Link>
        </div>
      </div>
    </div>
  );
}
