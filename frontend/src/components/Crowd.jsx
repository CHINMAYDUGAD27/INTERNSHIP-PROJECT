import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../api';
import { ShieldAlert, PlusCircle, X, Brain, Loader2 } from 'lucide-react';

export default function Crowd() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    date: new Date().toISOString().split('T')[0], 
    location: '', 
    expected_visitors: 0, 
    actual_visitors: 0 
  });

  // ML Preview State
  const [mlPreview, setMlPreview] = useState(null);
  const [mlLoading, setMlLoading] = useState(false);
  const debounceRef = useRef(null);

  const fetchCrowd = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/api/crowd/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(res.data);
    } catch (err) {
      console.error("Failed to fetch crowd data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCrowd(); }, []);

  // ── Live ML Prediction Preview ───────────────────────────────
  const fetchMLPreview = useCallback(async (data) => {
    const { expected_visitors, actual_visitors } = data;
    if (expected_visitors <= 0 && actual_visitors <= 0) {
      setMlPreview(null);
      return;
    }
    setMlLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        expected_visitors: Math.max(expected_visitors, 0),
        actual_visitors: Math.max(actual_visitors, 0)
      });
      const res = await api.post(`/api/crowd/preview-predict?${params}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMlPreview(res.data.risk_level);
    } catch (err) {
      console.error("ML crowd preview failed", err);
      setMlPreview(null);
    } finally {
      setMlLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!showModal) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchMLPreview(formData);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [formData.expected_visitors, formData.actual_visitors, showModal, fetchMLPreview]);

  useEffect(() => {
    if (!showModal) { setMlPreview(null); setMlLoading(false); }
  }, [showModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await api.post('/api/crowd/', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      fetchCrowd();
    } catch (error) {
      console.error("Failed to add record", error);
    }
  };

  // ── ML Badge Helper ──────────────────────────────────────────
  const mlBadgeStyle = (level) => {
    const colors = {
      High:   { bg: 'rgba(239,68,68,0.15)', border: '#EF4444', text: '#F87171', glow: '0 0 18px rgba(239,68,68,0.4)' },
      Medium: { bg: 'rgba(245,158,11,0.15)', border: '#F59E0B', text: '#FBBF24', glow: '0 0 18px rgba(245,158,11,0.4)' },
      Low:    { bg: 'rgba(16,185,129,0.15)', border: '#10B981', text: '#34D399', glow: '0 0 18px rgba(16,185,129,0.4)' },
    };
    return colors[level] || colors.Low;
  };

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <div>
          <h2 className="page-title">Crowd Prediction</h2>
          <p className="page-subtitle">AI-driven crowd density forecasting and records.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}><PlusCircle size={18} /> Log Crowd Data</button>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Location</th>
              <th>Expected Visitors</th>
              <th>Actual Visitors</th>
              <th>Risk Level (ML)</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{textAlign:'center'}}>Loading...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign:'center'}}>No crowd records found.</td></tr>
            ) : (
              records.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.location}</td>
                  <td>{r.expected_visitors.toLocaleString()}</td>
                  <td>{r.actual_visitors.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${r.risk_level?.toLowerCase() === 'high' ? 'danger' : r.risk_level?.toLowerCase() === 'medium' ? 'warning' : 'success'}`}>
                      {r.risk_level || 'Low'}
                    </span>
                  </td>
                  <td>{r.date && !isNaN(new Date(r.date).getTime()) ? new Date(r.date).toLocaleDateString('en-IN') : (r.date || '—')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Log Crowd Data</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <div className="form-group">
                   <label className="form-label">Date</label>
                   <input type="date" className="form-input" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                 </div>
                 <div className="form-group">
                   <label className="form-label">Location</label>
                   <input type="text" className="form-input" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                 </div>
                <div className="form-group">
                  <label className="form-label">Expected Visitors</label>
                  <input type="number" className="form-input" required value={formData.expected_visitors} onChange={e => setFormData({...formData, expected_visitors: parseInt(e.target.value) || 0})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Actual Visitors</label>
                  <input type="number" className="form-input" required value={formData.actual_visitors} onChange={e => setFormData({...formData, actual_visitors: parseInt(e.target.value) || 0})} />
                </div>

                {/* ── ML Live Prediction Preview ─────────────── */}
                <div style={{
                  background: mlPreview ? mlBadgeStyle(mlPreview).bg : 'rgba(99,102,241,0.08)',
                  border: `1.5px solid ${mlPreview ? mlBadgeStyle(mlPreview).border : 'rgba(99,102,241,0.25)'}`,
                  borderRadius: '0.85rem',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  transition: 'all 0.4s ease',
                  boxShadow: mlPreview ? mlBadgeStyle(mlPreview).glow : 'none',
                }}>
                  {mlLoading ? (
                    <Loader2 size={22} style={{ color: '#818CF8', animation: 'spin 1s linear infinite' }} />
                  ) : (
                    <Brain size={22} style={{ color: mlPreview ? mlBadgeStyle(mlPreview).text : '#818CF8' }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>
                      ML Prediction Preview
                    </div>
                    {mlLoading ? (
                      <div style={{ fontSize: '0.95rem', color: '#818CF8', fontWeight: 600 }}>Forecasting Risk...</div>
                    ) : mlPreview ? (
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: mlBadgeStyle(mlPreview).text, letterSpacing: '0.02em' }}>
                        {mlPreview === 'High' ? '🔴' : mlPreview === 'Medium' ? '🟠' : '🟢'} Risk Level: {mlPreview}
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Enter visitor numbers to see live ML prediction</div>
                    )}
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{marginTop: '1rem', justifyContent: 'center'}}>Submit Data</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Spin animation for loader */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
