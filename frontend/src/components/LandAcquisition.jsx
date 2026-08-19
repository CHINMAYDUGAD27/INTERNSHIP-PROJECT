import React, { useState, useEffect } from 'react';
import api from '../api';
import { MapPin, PlusCircle, X, Edit2, Trash2 } from 'lucide-react';

const API = '/api/land-acquisition';

const statusColor = (s) => {
  if (s === 'Acquired') return 'success';
  if (s === 'Pending' || s === 'Under Review') return 'warning';
  if (s === 'On Hold') return 'warning';
  if (s === 'Rejected') return 'danger';
  return 'danger';
};

const purposeIcon = (p) => {
  if (p === 'Roads') return '🛣️';
  if (p === 'Camps') return '⛺️';
  if (p === 'Parking') return '🅿️';
  return '🏗️';
};

export default function LandAcquisition() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    parcel_id: '', owner_name: '', area_sqm: 0,
    location: '', purpose: 'Roads', status: 'Pending',
    compensation_amount: 0, acquisition_date: ''
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
    setFormData({ parcel_id: `PCL-${Math.floor(1000 + Math.random() * 9000)}`, owner_name: '', area_sqm: 0, location: '', purpose: 'Roads', status: 'Pending', compensation_amount: 0, acquisition_date: '' });
    setShowModal(true);
  };

  const openEdit = (r) => {
    setEditRecord(r);
    setFormData({ parcel_id: r.parcel_id, owner_name: r.owner_name, area_sqm: r.area_sqm, location: r.location, purpose: r.purpose, status: r.status, compensation_amount: r.compensation_amount, acquisition_date: r.acquisition_date || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, acquisition_date: formData.acquisition_date || null };
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
    if (!window.confirm('Delete this parcel record?')) return;
    try {
      await api.delete(`${API}/${id}`, { headers: headers() });
      fetchRecords();
    } catch (err) { console.error(err); }
  };

  const acquired = records.filter(r => r.status === 'Acquired').length;
  const pending = records.filter(r => r.status === 'Pending').length;
  const totalArea = records.reduce((s, r) => s + r.area_sqm, 0);
  const totalComp = records.reduce((s, r) => s + r.compensation_amount, 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 className="page-title">Land Acquisition</h2>
          <p className="page-subtitle">Track acquired parcels, status, purpose & compensation.</p>
        </div>
        <button className="btn-primary" onClick={openAdd}><PlusCircle size={18} /> Add Parcel</button>
      </div>

      {/* Summary */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '2rem' }}>
        {[
          { label: 'Total Parcels', value: records.length, icon: '📋', color: 'var(--primary-color)' },
          { label: 'Acquired', value: acquired, icon: '✅', color: 'var(--success-color)' },
          { label: 'Pending', value: pending, icon: '⏳', color: 'var(--warning-color)' },
          { label: 'Total Area (sqm)', value: totalArea.toLocaleString(), icon: '📏', color: 'var(--accent-color)' },
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
              <th>Parcel ID</th><th>Owner</th><th>Area (sqm)</th><th>Location</th>
              <th>Purpose</th><th>Status</th><th>Compensation (₹)</th><th>Acquisition Date</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="9" style={{ textAlign: 'center' }}>Loading...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan="9" style={{ textAlign: 'center' }}>No parcels found.</td></tr>
            ) : records.map(r => (
              <tr key={r.id}>
                <td><span style={{ fontFamily: 'monospace', color: 'var(--primary-color)', fontWeight: 700 }}>{r.parcel_id}</span></td>
                <td style={{ fontWeight: 600 }}>{r.owner_name}</td>
                <td>{r.area_sqm.toLocaleString()}</td>
                <td>{r.location}</td>
                <td><span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>{purposeIcon(r.purpose)} {r.purpose}</span></td>
                <td><span className={`badge ${statusColor(r.status)}`}>{r.status}</span></td>
                <td>₹{r.compensation_amount.toLocaleString()}</td>
                <td>{r.acquisition_date || <span style={{ color: 'var(--text-secondary)' }}>—</span>}</td>
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
              <h3 className="modal-title">{editRecord ? 'Edit Parcel' : 'Add Land Parcel'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { label: 'Parcel ID', key: 'parcel_id', type: 'text' },
                  { label: 'Owner Name', key: 'owner_name', type: 'text' },
                  { label: 'Area (sqm)', key: 'area_sqm', type: 'number' },
                  { label: 'Location / Survey No.', key: 'location', type: 'text' },
                  { label: 'Compensation Amount (₹)', key: 'compensation_amount', type: 'number' },
                  { label: 'Acquisition Date (optional)', key: 'acquisition_date', type: 'date', required: false },
                ].map(f => (
                  <div key={f.key} className="form-group">
                    <label className="form-label">{f.label}</label>
                    <input type={f.type} className="form-input" required={f.required !== false} value={formData[f.key]}
                      onChange={e => setFormData({ ...formData, [f.key]: f.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value })} />
                  </div>
                ))}
                <div className="form-group">
                  <label className="form-label">Purpose</label>
                  <select className="form-input" value={formData.purpose} onChange={e => setFormData({ ...formData, purpose: e.target.value })}>
                    <option value="Roads">Roads</option>
                    <option value="Camps">Camps</option>
                    <option value="Parking">Parking</option>
                    <option value="Infrastructure">Infrastructure</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-input" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                    <option value="Pending">Pending</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Acquired">Acquired</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <button type="submit" className="btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }}>
                  {editRecord ? 'Update Parcel' : 'Add Parcel'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
