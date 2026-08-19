import React, { useState, useEffect } from 'react';
import api from '../api';
import { ShieldCheck, PlusCircle, X, Edit2, Trash2 } from 'lucide-react';

const API = '/api/safety';

const gateColor = (g) => g === 'Open' ? 'success' : 'danger';
const barricadeColor = (b) => {
  if (b === 'Active') return 'success';
  if (b === 'Partial') return 'warning';
  return 'danger';
};
const densityColor = (d) => {
  if (d === 'High') return 'var(--danger-color)';
  if (d === 'Medium') return 'var(--warning-color)';
  return 'var(--success-color)';
};

export default function Safety() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    checkpoint_name: '', zone: '', officers_deployed: 0,
    barricading_status: 'Active', gate_status: 'Open',
    crowd_density: 'Low', last_updated: today, remarks: ''
  });

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

  const openAdd = () => {
    setEditRecord(null);
    setFormData({ checkpoint_name: '', zone: '', officers_deployed: 0, barricading_status: 'Active', gate_status: 'Open', crowd_density: 'Low', last_updated: today, remarks: '' });
    setShowModal(true);
  };

  const openEdit = (r) => {
    setEditRecord(r);
    setFormData({ checkpoint_name: r.checkpoint_name, zone: r.zone, officers_deployed: r.officers_deployed, barricading_status: r.barricading_status, gate_status: r.gate_status, crowd_density: r.crowd_density, last_updated: r.last_updated, remarks: r.remarks || '' });
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
    if (!window.confirm('Delete this checkpoint record?')) return;
    try {
      await api.delete(`${API}/${id}`, { headers: headers() });
      fetchRecords();
    } catch (err) { console.error(err); }
  };

  // Quick toggle gate status inline
  const toggleGate = async (r) => {
    const newStatus = r.gate_status === 'Open' ? 'Closed' : 'Open';
    try {
      await api.put(`${API}/${r.id}`, { ...r, gate_status: newStatus, last_updated: today, remarks: r.remarks || null }, { headers: headers() });
      fetchRecords();
    } catch (err) { console.error(err); }
  };

  const openGates = records.filter(r => r.gate_status === 'Open').length;
  const highDensity = records.filter(r => r.crowd_density === 'High').length;
  const totalOfficers = records.reduce((s, r) => s + r.officers_deployed, 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 className="page-title">Safety & Public Control</h2>
          <p className="page-subtitle">Police deployment, barricading status & gate open/close control per checkpoint.</p>
        </div>
        <button className="btn-primary" onClick={openAdd}><PlusCircle size={18} /> Add Checkpoint</button>
      </div>

      {/* Summary */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '2rem' }}>
        {[
          { label: 'Checkpoints', value: records.length, icon: '🛡️', color: 'var(--primary-color)' },
          { label: 'Gates Open', value: openGates, icon: '🔓', color: 'var(--success-color)' },
          { label: 'High Density Zones', value: highDensity, icon: '🚨', color: highDensity > 0 ? 'var(--danger-color)' : 'var(--success-color)' },
          { label: 'Officers Deployed', value: totalOfficers.toLocaleString(), icon: '👮', color: 'var(--accent-color)' },
        ].map(s => (
          <div key={s.label} className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{s.icon}</div>
            <div className="stat-value" style={{ fontSize: '1.5rem', color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th><th>Checkpoint</th><th>Zone</th><th>Officers</th>
              <th>Barricading</th><th>Gate Status</th><th>Crowd Density</th><th>Last Updated</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="9" style={{ textAlign: 'center' }}>Loading...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan="9" style={{ textAlign: 'center' }}>No checkpoints found.</td></tr>
            ) : records.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td style={{ fontWeight: 600 }}>{r.checkpoint_name}</td>
                <td>{r.zone}</td>
                <td style={{ fontWeight: 600, color: 'var(--accent-color)' }}>{r.officers_deployed}</td>
                <td><span className={`badge ${barricadeColor(r.barricading_status)}`}>{r.barricading_status}</span></td>
                <td>
                  <button
                    onClick={() => toggleGate(r)}
                    style={{
                      background: r.gate_status === 'Open' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                      color: r.gate_status === 'Open' ? 'var(--success-color)' : 'var(--danger-color)',
                      border: `1px solid ${r.gate_status === 'Open' ? 'var(--success-color)' : 'var(--danger-color)'}`,
                      borderRadius: '0.5rem', padding: '0.25rem 0.75rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem',
                      transition: 'all 0.2s'
                    }}
                    title="Click to toggle gate"
                  >
                    {r.gate_status === 'Open' ? '🔓 Open' : '🔒 Closed'}
                  </button>
                </td>
                <td style={{ color: densityColor(r.crowd_density), fontWeight: 700 }}>{r.crowd_density}</td>
                <td>{r.last_updated}</td>
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
              <h3 className="modal-title">{editRecord ? 'Edit Checkpoint' : 'Add Checkpoint'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { label: 'Checkpoint Name', key: 'checkpoint_name', type: 'text' },
                  { label: 'Zone / Sector', key: 'zone', type: 'text' },
                  { label: 'Officers Deployed', key: 'officers_deployed', type: 'number' },
                  { label: 'Last Updated Date', key: 'last_updated', type: 'date' },
                ].map(f => (
                  <div key={f.key} className="form-group">
                    <label className="form-label">{f.label}</label>
                    <input type={f.type} className="form-input" required value={formData[f.key]}
                      onChange={e => setFormData({ ...formData, [f.key]: f.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value })} />
                  </div>
                ))}
                {[
                  { label: 'Barricading Status', key: 'barricading_status', options: ['Active', 'Inactive', 'Partial'] },
                  { label: 'Gate Status', key: 'gate_status', options: ['Open', 'Closed'] },
                  { label: 'Crowd Density', key: 'crowd_density', options: ['Low', 'Medium', 'High'] },
                ].map(f => (
                  <div key={f.key} className="form-group">
                    <label className="form-label">{f.label}</label>
                    <select className="form-input" value={formData[f.key]} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}>
                      {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
                <div className="form-group">
                  <label className="form-label">Remarks (optional)</label>
                  <input type="text" className="form-input" value={formData.remarks}
                    onChange={e => setFormData({ ...formData, remarks: e.target.value })} />
                </div>
                <button type="submit" className="btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }}>
                  {editRecord ? 'Update Checkpoint' : 'Add Checkpoint'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
