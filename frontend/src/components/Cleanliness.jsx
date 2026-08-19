import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Droplets, PlusCircle, X, Edit2, Trash2 } from 'lucide-react';

const API = '/api/cleanliness';

const sanitationColor = (s) => {
  if (s === 'Critical') return 'danger';
  if (s === 'Needs Attention') return 'warning';
  return 'success';
};

const wqiColor = (wqi) => {
  if (wqi >= 80) return 'var(--success-color)';
  if (wqi >= 50) return 'var(--warning-color)';
  return 'var(--danger-color)';
};

export default function Cleanliness() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    zone: '', ghat_name: '', sanitation_status: 'Clean',
    water_quality_index: 75, ph_level: 7.2, dissolved_oxygen: 6.5,
    last_checked: today, remarks: ''
  });

  const token = () => localStorage.getItem('token');
  const headers = () => ({ Authorization: `Bearer ${token()}` });

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/`, { headers: headers() });
      setRecords(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRecords(); }, []);

  const openAdd = () => {
    setEditRecord(null);
    setFormData({ zone: '', ghat_name: '', sanitation_status: 'Clean', water_quality_index: 75, ph_level: 7.2, dissolved_oxygen: 6.5, last_checked: today, remarks: '' });
    setShowModal(true);
  };

  const openEdit = (r) => {
    setEditRecord(r);
    setFormData({ zone: r.zone, ghat_name: r.ghat_name, sanitation_status: r.sanitation_status, water_quality_index: r.water_quality_index, ph_level: r.ph_level, dissolved_oxygen: r.dissolved_oxygen, last_checked: r.last_checked, remarks: r.remarks || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, remarks: formData.remarks || null };
    try {
      if (editRecord) {
        await axios.put(`${API}/${editRecord.id}`, payload, { headers: headers() });
      } else {
        await axios.post(`${API}/`, payload, { headers: headers() });
      }
      setShowModal(false);
      fetchRecords();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await axios.delete(`${API}/${id}`, { headers: headers() });
      fetchRecords();
    } catch (err) { console.error(err); }
  };

  const avgWQI = records.length > 0 ? (records.reduce((s, r) => s + r.water_quality_index, 0) / records.length).toFixed(1) : 0;
  const criticalCount = records.filter(r => r.sanitation_status === 'Critical').length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 className="page-title">Cleanliness & River Godavari</h2>
          <p className="page-subtitle">Sanitation zone status & Godavari water quality monitoring.</p>
        </div>
        <button className="btn-primary" onClick={openAdd}><PlusCircle size={18} /> Add Ghat Record</button>
      </div>

      {/* Summary Cards */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '2rem' }}>
        {[
          { label: 'Ghats Monitored', value: records.length, icon: '🌊', color: 'var(--accent-color)' },
          { label: 'Avg Water Quality Index', value: avgWQI, icon: '💧', color: wqiColor(parseFloat(avgWQI)) },
          { label: 'Critical Zones', value: criticalCount, icon: '⚠️', color: criticalCount > 0 ? 'var(--danger-color)' : 'var(--success-color)' },
        ].map(s => (
          <div key={s.label} className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{s.icon}</div>
            <div className="stat-value" style={{ fontSize: '1.75rem', color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th><th>Zone</th><th>Ghat Name</th><th>Sanitation</th>
              <th>WQI</th><th>pH</th><th>DO (mg/L)</th><th>Last Checked</th><th>Remarks</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="10" style={{ textAlign: 'center' }}>Loading...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan="10" style={{ textAlign: 'center' }}>No records found.</td></tr>
            ) : records.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.zone}</td>
                <td style={{ fontWeight: 600 }}>{r.ghat_name}</td>
                <td><span className={`badge ${sanitationColor(r.sanitation_status)}`}>{r.sanitation_status}</span></td>
                <td>
                  <span style={{ color: wqiColor(r.water_quality_index), fontWeight: 700 }}>{r.water_quality_index}</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>/100</span>
                </td>
                <td style={{ color: r.ph_level >= 6.5 && r.ph_level <= 8.5 ? 'var(--success-color)' : 'var(--danger-color)', fontWeight: 600 }}>{r.ph_level}</td>
                <td style={{ color: r.dissolved_oxygen >= 5 ? 'var(--success-color)' : 'var(--danger-color)', fontWeight: 600 }}>{r.dissolved_oxygen}</td>
                <td>{r.last_checked}</td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{r.remarks || '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => openEdit(r)} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer' }}><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(r.id)} style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{editRecord ? 'Edit Ghat Record' : 'Add Ghat / Sanitation Record'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { label: 'Zone', key: 'zone', type: 'text' },
                  { label: 'Ghat Name', key: 'ghat_name', type: 'text' },
                  { label: 'Water Quality Index (0–100)', key: 'water_quality_index', type: 'number' },
                  { label: 'pH Level', key: 'ph_level', type: 'number' },
                  { label: 'Dissolved Oxygen (mg/L)', key: 'dissolved_oxygen', type: 'number' },
                  { label: 'Last Checked Date', key: 'last_checked', type: 'date' },
                ].map(f => (
                  <div key={f.key} className="form-group">
                    <label className="form-label">{f.label}</label>
                    <input type={f.type} className="form-input" required value={formData[f.key]}
                      step={f.type === 'number' ? '0.1' : undefined}
                      onChange={e => setFormData({ ...formData, [f.key]: f.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value })} />
                  </div>
                ))}
                <div className="form-group">
                  <label className="form-label">Sanitation Status</label>
                  <select className="form-input" value={formData.sanitation_status} onChange={e => setFormData({ ...formData, sanitation_status: e.target.value })}>
                    <option value="Clean">Clean</option>
                    <option value="Needs Attention">Needs Attention</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Remarks (optional)</label>
                  <input type="text" className="form-input" value={formData.remarks}
                    onChange={e => setFormData({ ...formData, remarks: e.target.value })} />
                </div>
                <button type="submit" className="btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }}>
                  {editRecord ? 'Update Record' : 'Add Record'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
