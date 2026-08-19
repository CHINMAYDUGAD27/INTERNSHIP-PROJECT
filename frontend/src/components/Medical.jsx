import React, { useState, useEffect } from 'react';
import api from '../api';
import { Activity, PlusCircle, X } from 'lucide-react';

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
    actual_patients: 0, 
    emergency_level: 'Normal' 
  });

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
              <th>Level</th>
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
                  <input type="number" className="form-input" required value={formData.available_doctors} onChange={e => setFormData({...formData, available_doctors: parseInt(e.target.value)})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Nurses Available</label>
                  <input type="number" className="form-input" required value={formData.available_nurses} onChange={e => setFormData({...formData, available_nurses: parseInt(e.target.value)})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Ambulances</label>
                  <input type="number" className="form-input" required value={formData.available_ambulances} onChange={e => setFormData({...formData, available_ambulances: parseInt(e.target.value)})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Emergency Level</label>
                  <select className="form-input" value={formData.emergency_level} onChange={e => setFormData({...formData, emergency_level: e.target.value})}>
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Expected Patients</label>
                  <input type="number" className="form-input" required value={formData.expected_patients} onChange={e => setFormData({...formData, expected_patients: parseInt(e.target.value)})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Actual Patients</label>
                  <input type="number" className="form-input" required value={formData.actual_patients} onChange={e => setFormData({...formData, actual_patients: parseInt(e.target.value)})} />
                </div>
                
                <button type="submit" className="btn-primary" style={{gridColumn: '1 / -1', marginTop: '1rem', justifyContent: 'center'}}>Submit Data</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
