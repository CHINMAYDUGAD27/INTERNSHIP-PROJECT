import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../api';
import { Activity, PlusCircle, X, Brain, Loader2 } from 'lucide-react';

export default function Medical() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    location: '', 
    medical_camp: '', 
    available_doctors: 0, 
    available_nurses: 0, 
    available_ambulances: 0, 
    expected_patients: 0, 
    actual_patients: 0 
  });

  // ML Preview State
  const [mlPreview, setMlPreview] = useState(null);       // "Normal" | "High" | "Critical"
  const [mlLoading, setMlLoading] = useState(false);
  const debounceRef = useRef(null);

  const fetchMedical = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/api/medical/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(res.data);
    } catch (err) {
      console.error("Failed to fetch medical data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMedical(); }, []);

  // ── Live ML Prediction Preview ───────────────────────────────
  const fetchMLPreview = useCallback(async (data) => {
    const { available_doctors, available_nurses, available_ambulances, expected_patients, actual_patients } = data;
    // Only predict when we have meaningful values
    if (available_doctors <= 0 && available_nurses <= 0) {
      setMlPreview(null);
      return;
    }
    setMlLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        available_doctors: Math.max(available_doctors, 1),
        available_nurses: Math.max(available_nurses, 1),
        available_ambulances: Math.max(available_ambulances, 1),
        expected_patients: Math.max(expected_patients, 1),
        actual_patients: Math.max(actual_patients, 0)
      });
      const res = await api.post(`/api/medical/preview-predict?${params}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMlPreview(res.data.emergency_level);
    } catch (err) {
      console.error("ML preview failed", err);
      setMlPreview(null);
    } finally {
      setMlLoading(false);
    }
  }, []);

  // Debounced trigger on form data change
  useEffect(() => {
    if (!showModal) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchMLPreview(formData);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [formData.available_doctors, formData.available_nurses, formData.available_ambulances, formData.expected_patients, formData.actual_patients, showModal, fetchMLPreview]);

  // Reset preview when modal closes
  useEffect(() => {
    if (!showModal) {
      setMlPreview(null);
      setMlLoading(false);
    }
  }, [showModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await api.post(`/api/medical/`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setShowModal(false);
      fetchMedical();
    } catch (error) {
      console.error("Failed to add medical record", error);
    }
  };

  const handleCampNameChange = (e) => {
    const val = e.target.value;
    let autoDocs = formData.available_doctors;
    let autoNurses = formData.available_nurses;
    let autoAmbulances = formData.available_ambulances;

    const lowerVal = val.toLowerCase();
    if (lowerVal.includes('civil')) {
      autoDocs = 25;
      autoNurses = 50;
      autoAmbulances = 12;
    } else if (lowerVal.includes('apollo') || lowerVal.includes('private')) {
      autoDocs = 10;
      autoNurses = 20;
      autoAmbulances = 4;
    } else if (lowerVal.includes('city') || lowerVal.includes('municipal')) {
      autoDocs = 15;
      autoNurses = 30;
      autoAmbulances = 8;
    }

    setFormData({
      ...formData, 
      medical_camp: val,
      available_doctors: autoDocs,
      available_nurses: autoNurses,
      available_ambulances: autoAmbulances
    });
  };

  // ── ML Badge helper ──────────────────────────────────────────
  const mlBadgeStyle = (level) => {
    const colors = {
      Critical: { bg: 'rgba(239,68,68,0.15)', border: '#EF4444', text: '#F87171', glow: '0 0 18px rgba(239,68,68,0.4)' },
      High:     { bg: 'rgba(245,158,11,0.15)', border: '#F59E0B', text: '#FBBF24', glow: '0 0 18px rgba(245,158,11,0.4)' },
      Normal:   { bg: 'rgba(16,185,129,0.15)', border: '#10B981', text: '#34D399', glow: '0 0 18px rgba(16,185,129,0.4)' },
    };
    return colors[level] || colors.Normal;
  };

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <div>
          <h2 className="page-title">Medical Emergency</h2>
          <p className="page-subtitle">Real-time health facilities monitoring.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}><PlusCircle size={18} /> Log Incident</button>
      </div>

      {/* Emergency Contacts Widget */}
      <div className="glass-card" style={{ marginBottom: '2rem', borderTop: '4px solid var(--danger-color)' }}>
        <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#fff', fontSize: '1.4rem' }}>
          <Activity size={24} className="text-danger" /> Aaple Sarkar - Emergency Contacts (आपत्कालीन संपर्क क्रमांक)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {[
            { name: 'Disaster Management (आपत्ती व्यवस्थापन)', number: '1077', icon: '🌊', color: '#EF4444' },
            { name: 'Child Security & Welfare (बाल सुरक्षा व कल्याण)', number: '1098', icon: '🧒', color: '#3B82F6' },
            { name: 'Women Security (महिला सुरक्षा)', number: '1091', icon: '🛡️', color: '#8B5CF6' },
            { name: 'Confidential Crime Complaint (गोपनीय गुन्हा)', number: '1090', icon: '🕵️', color: '#F97316' },
            { name: 'Emergency Help (आपत्कालीन मदत)', number: '112', icon: '🚨', color: '#10B981' },
            { name: 'Police Help (पोलीस मदत)', number: '100', icon: '👮', color: '#1E3A8A' },
            { name: 'Ambulance (रुग्णवाहिका)', number: '108', icon: '🚑', color: '#EF4444' },
          ].map(contact => (
            <div key={contact.number} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '1rem 1.25rem', borderRadius: '0.75rem', borderLeft: `4px solid ${contact.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ fontSize: '1.5rem' }}>{contact.icon}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{contact.name}</div>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: contact.color, letterSpacing: '0.05em' }}>
                <a href={`tel:${contact.number}`} style={{ color: 'inherit', textDecoration: 'none' }}>📞 {contact.number}</a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Location</th>
              <th>Camp / Hospital</th>
              <th>Doctors</th>
              <th>Nurses</th>
              <th>Ambulances</th>
              <th>Patients (Expected / Actual)</th>
              <th>Emergency Level (ML)</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" style={{textAlign:'center'}}>Loading...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan="8" style={{textAlign:'center'}}>No medical records found.</td></tr>
            ) : (
              records.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.location}</td>
                  <td>{r.medical_camp}</td>
                  <td>{r.available_doctors}</td>
                  <td>{r.available_nurses}</td>
                  <td>{r.available_ambulances}</td>
                  <td>{r.expected_patients} / {r.actual_patients}</td>
                  <td>
                    <span className={`badge ${r.emergency_level === 'Critical' ? 'danger' : r.emergency_level === 'High' ? 'warning' : 'success'}`}>
                      {r.emergency_level}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{maxWidth: '600px'}}>
            <div className="modal-header">
              <h3 className="modal-title">Log Medical Data</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div className="form-group" style={{gridColumn: '1 / -1'}}>
                  <label className="form-label">Camp / Hospital Name (Auto-fills estimates)</label>
                  <input type="text" className="form-input" placeholder="e.g. Civil Hospital, Ramkund Camp" required value={formData.medical_camp} onChange={handleCampNameChange} />
                </div>
                <div className="form-group" style={{gridColumn: '1 / -1'}}>
                  <label className="form-label">Location</label>
                  <input type="text" className="form-input" placeholder="e.g. Zone A, Ramkund" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Doctors Available</label>
                  <input type="number" className="form-input" required value={formData.available_doctors} onChange={e => setFormData({...formData, available_doctors: parseInt(e.target.value) || 0})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Nurses Available</label>
                  <input type="number" className="form-input" required value={formData.available_nurses} onChange={e => setFormData({...formData, available_nurses: parseInt(e.target.value) || 0})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Ambulances</label>
                  <input type="number" className="form-input" required value={formData.available_ambulances} onChange={e => setFormData({...formData, available_ambulances: parseInt(e.target.value) || 0})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Expected Patients</label>
                  <input type="number" className="form-input" required value={formData.expected_patients} onChange={e => setFormData({...formData, expected_patients: parseInt(e.target.value) || 0})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Actual Patients</label>
                  <input type="number" className="form-input" required value={formData.actual_patients} onChange={e => setFormData({...formData, actual_patients: parseInt(e.target.value) || 0})} />
                </div>

                {/* ── ML Live Prediction Preview ─────────────── */}
                <div style={{
                  gridColumn: '1 / -1',
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
                      <div style={{ fontSize: '0.95rem', color: '#818CF8', fontWeight: 600 }}>Analyzing...</div>
                    ) : mlPreview ? (
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: mlBadgeStyle(mlPreview).text, letterSpacing: '0.02em' }}>
                        {mlPreview === 'Critical' ? '🔴' : mlPreview === 'High' ? '🟠' : '🟢'} Emergency Level: {mlPreview}
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Fill in staff & patient data to see live prediction</div>
                    )}
                  </div>
                </div>
                
                <button type="submit" className="btn-primary" style={{gridColumn: '1 / -1', marginTop: '1rem', justifyContent: 'center'}}>Submit Data</button>
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
