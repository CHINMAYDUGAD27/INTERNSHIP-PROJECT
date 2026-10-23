import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../api';
import { Droplets, PlusCircle, X, Edit2, Trash2, Brain, Loader2 } from 'lucide-react';

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

  // ML Preview State
  const [mlPreview, setMlPreview] = useState(null);
  const [mlLoading, setMlLoading] = useState(false);
  const debounceRef = useRef(null);

  const token = () => localStorage.getItem('token');
  const headers = () => ({ Authorization: `Bearer ${token()}` });

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await api.get(`${API}/`, { headers: headers() });
      setRecords(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRecords(); }, []);

  // ── Live ML Prediction Preview ───────────────────────────────
  const fetchMLPreview = useCallback(async (data) => {
    const { water_quality_index, ph_level, dissolved_oxygen } = data;
    if (!water_quality_index && !ph_level && !dissolved_oxygen) {
      setMlPreview(null);
      return;
    }
    setMlLoading(true);
    try {
      const params = new URLSearchParams({
        water_quality_index: parseFloat(water_quality_index) || 70,
        ph_level: parseFloat(ph_level) || 7.0,
        dissolved_oxygen: parseFloat(dissolved_oxygen) || 6.0
      });
      const res = await api.post(`${API}/preview-predict?${params}`, {}, { headers: headers() });
      setMlPreview(res.data.sanitation_status);
      setFormData(prev => ({ ...prev, sanitation_status: res.data.sanitation_status }));
    } catch (err) {
      console.error("Cleanliness ML preview failed", err);
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
  }, [formData.water_quality_index, formData.ph_level, formData.dissolved_oxygen, showModal, fetchMLPreview]);

  useEffect(() => {
    if (!showModal) { setMlPreview(null); setMlLoading(false); }
  }, [showModal]);

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
        await api.put(`${API}/${editRecord.id}`, payload, { headers: headers() });
      } else {
        await api.post(`${API}/`, payload, { headers: headers() });
      }
      setShowModal(false);
      fetchRecords();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await api.delete(`${API}/${id}`, { headers: headers() });
      fetchRecords();
    } catch (err) { console.error(err); }
  };

  // ── ML Badge Helper ──────────────────────────────────────────
  const mlBadgeStyle = (status) => {
    const colors = {
      Critical:         { bg: 'rgba(239,68,68,0.15)', border: '#EF4444', text: '#F87171', glow: '0 0 18px rgba(239,68,68,0.4)' },
      'Needs Attention': { bg: 'rgba(245,158,11,0.15)', border: '#F59E0B', text: '#FBBF24', glow: '0 0 18px rgba(245,158,11,0.4)' },
      Clean:            { bg: 'rgba(16,185,129,0.15)', border: '#10B981', text: '#34D399', glow: '0 0 18px rgba(16,185,129,0.4)' },
    };
    return colors[status] || colors.Clean;
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
              <th>ID</th><th>Zone</th><th>Ghat Name</th><th>Sanitation Status (ML)</th>
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
                <div className="form-group">
                  <label className="form-label">Zone</label>
                  <input type="text" className="form-input" required value={formData.zone}
                    placeholder="e.g. Zone A - Ramkund"
                    onChange={e => setFormData({ ...formData, zone: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Ghat Name</label>
                  <input type="text" className="form-input" required value={formData.ghat_name}
                    placeholder="e.g. Ramkund Main Ghat"
                    onChange={e => setFormData({ ...formData, ghat_name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Water Quality Index (0–100)</label>
                  <input type="number" step="0.1" className="form-input" required value={formData.water_quality_index}
                    onChange={e => setFormData({ ...formData, water_quality_index: parseFloat(e.target.value) || 0 })} />
                </div>
                <div className="form-group">
                  <label className="form-label">pH Level (6.5 – 8.5 ideal)</label>
                  <input type="number" step="0.1" className="form-input" required value={formData.ph_level}
                    onChange={e => setFormData({ ...formData, ph_level: parseFloat(e.target.value) || 0 })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Dissolved Oxygen (mg/L, &gt;5.0 ideal)</label>
                  <input type="number" step="0.1" className="form-input" required value={formData.dissolved_oxygen}
                    onChange={e => setFormData({ ...formData, dissolved_oxygen: parseFloat(e.target.value) || 0 })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Checked Date</label>
                  <input type="date" className="form-input" required value={formData.last_checked}
                    onChange={e => setFormData({ ...formData, last_checked: e.target.value })} />
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
                      ML Water Sanitation Preview
                    </div>
                    {mlLoading ? (
                      <div style={{ fontSize: '0.95rem', color: '#818CF8', fontWeight: 600 }}>Analyzing Water Quality...</div>
                    ) : mlPreview ? (
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: mlBadgeStyle(mlPreview).text, letterSpacing: '0.02em' }}>
                        {mlPreview === 'Critical' ? '🔴' : mlPreview === 'Needs Attention' ? '🟠' : '🟢'} Sanitation: {mlPreview}
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Enter WQI, pH, and DO to see live prediction</div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Remarks (optional)</label>
                  <input type="text" className="form-input" value={formData.remarks}
                    placeholder="e.g. Regular river cleaning completed"
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
