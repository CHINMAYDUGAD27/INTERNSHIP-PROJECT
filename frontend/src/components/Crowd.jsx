import React, { useState, useEffect } from 'react';
import api from '../api';
import { ShieldAlert, PlusCircle, X } from 'lucide-react';

export default function Crowd() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ date: new Date().toISOString().split('T')[0], location: '', expected_visitors: 0, actual_visitors: 0, risk_level: 'Low' });

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
              <th>Risk Level</th>
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
                    <span className={`badge ${r.risk_level.toLowerCase() === 'high' ? 'danger' : r.risk_level.toLowerCase() === 'medium' ? 'warning' : 'success'}`}>
                      {r.risk_level}
                    </span>
                  </td>
                  <td>{r.date && !isNaN(new Date(r.date).getTime()) ? new Date(r.date).toLocaleDateString('en-IN') : (r.date || '�')}</td>
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
                   <input type="text" className="form-input" required onChange={e => setFormData({...formData, location: e.target.value})} />
                 </div>
                <div className="form-group">
                  <label className="form-label">Expected Visitors</label>
                  <input type="number" className="form-input" required onChange={e => setFormData({...formData, expected_visitors: parseInt(e.target.value)})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Actual Visitors</label>
                  <input type="number" className="form-input" required onChange={e => setFormData({...formData, actual_visitors: parseInt(e.target.value)})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Risk Level</label>
                  <select className="form-input" onChange={e => setFormData({...formData, risk_level: e.target.value})}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <button type="submit" className="btn-primary" style={{marginTop: '1rem', justifyContent: 'center'}}>Submit Data</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
