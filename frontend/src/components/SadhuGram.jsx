import React, { useState, useEffect } from 'react';
import api from '../api';
import { Home, PlusCircle, X, Edit2, Trash2 } from 'lucide-react';

const API = '/api/sadhu-gram';

const statusColor = (s) => s === 'Active' ? 'success' : 'danger';

export default function SadhuGram() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [formData, setFormData] = useState({
    akhara_name: '', zone: '', camp_number: '',
    allocated_area_sqm: 0, capacity: 0, sadhu_count: 0, status: 'Active'
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
    setFormData({ akhara_name: '', zone: '', camp_number: '', allocated_area_sqm: 0, capacity: 0, sadhu_count: 0, status: 'Active' });
    setShowModal(true);
  };

  const openEdit = (r) => {
    setEditRecord(r);
    setFormData({ akhara_name: r.akhara_name, zone: r.zone, camp_number: r.camp_number, allocated_area_sqm: r.allocated_area_sqm, capacity: r.capacity, sadhu_count: r.sadhu_count, status: r.status });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editRecord) {
        await api.put(`${API}/${editRecord.id}`, formData, { headers: headers() });
      } else {
        await api.post(`${API}/`, formData, { headers: headers() });
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

  // Summary stats
  const totalCapacity = records.reduce((s, r) => s + r.capacity, 0);
  const totalSadhus = records.reduce((s, r) => s + r.sadhu_count, 0);
  const activeCount = records.filter(r => r.status === 'Active').length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 className="page-title">Sadhu Gram Management</h2>
          <p className="page-subtitle">Akhara & camp allocations, capacity, sadhu count per zone.</p>
        </div>
        <button className="btn-primary" onClick={openAdd}><PlusCircle size={18} /> Add Akhara / Camp</button>
      </div>

      {/* Visual Banners */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ borderRadius: '1rem', overflow: 'hidden', height: '220px', position: 'relative', border: '1px solid rgba(255,255,255,0.05)' }}>
          <img src="/images/sadhugram_tents.jpg" alt="Sadhugram Tent City" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.9), transparent)', padding: '1rem 1.5rem' }}>
            <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.25rem', fontWeight: 700 }}>Sadhugram Tent City</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Sector-wise camp allocations for the arriving millions.</p>
          </div>
        </div>
        <div style={{ borderRadius: '1rem', overflow: 'hidden', height: '220px', position: 'relative', border: '1px solid rgba(255,255,255,0.05)' }}>
          <img src="/images/sadhugram_akhada.jpg" alt="Juna Akhada" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.9), transparent)', padding: '1rem 1.5rem' }}>
            <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.25rem', fontWeight: 700 }}>Akhada & Dhuni</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Sacred spaces for the revered Naga Sadhus and Mahamandaleshwars.</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '2rem' }}>
        {[
          { label: 'Total Akharas', value: records.length, icon: '⛺️' },
          { label: 'Total Capacity', value: totalCapacity.toLocaleString(), icon: '📏' },
          { label: 'Sadhus Registered', value: totalSadhus.toLocaleString(), icon: '🙏' },
        ].map(s => (
          <div key={s.label} className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{s.icon}</div>
            <div className="stat-value" style={{ fontSize: '1.75rem' }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th><th>Akhara Name</th><th>Zone</th><th>Camp No.</th>
              <th>Area (sqm)</th><th>Capacity</th><th>Sadhus</th><th>Occupancy</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="10" style={{ textAlign: 'center' }}>Loading...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan="10" style={{ textAlign: 'center' }}>No records found.</td></tr>
            ) : records.map(r => {
              const pct = r.capacity > 0 ? Math.round((r.sadhu_count / r.capacity) * 100) : 0;
              return (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td style={{ fontWeight: 600 }}>{r.akhara_name}</td>
                  <td>{r.zone}</td>
                  <td>{r.camp_number}</td>
                  <td>{r.allocated_area_sqm.toLocaleString()}</td>
                  <td>{r.capacity.toLocaleString()}</td>
                  <td>{r.sadhu_count.toLocaleString()}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, background: pct > 90 ? 'var(--danger-color)' : pct > 70 ? 'var(--warning-color)' : 'var(--success-color)', borderRadius: '3px', transition: 'width 0.3s' }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', minWidth: '35px' }}>{pct}%</span>
                    </div>
                  </td>
                  <td><span className={`badge ${statusColor(r.status)}`}>{r.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => openEdit(r)} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer' }}><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(r.id)} style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{editRecord ? 'Edit Akhara / Camp' : 'Add Akhara / Camp'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { label: 'Akhara Name', key: 'akhara_name', type: 'text' },
                  { label: 'Zone', key: 'zone', type: 'text' },
                  { label: 'Camp Number', key: 'camp_number', type: 'text' },
                  { label: 'Allocated Area (sqm)', key: 'allocated_area_sqm', type: 'number' },
                  { label: 'Capacity', key: 'capacity', type: 'number' },
                  { label: 'Sadhu Count', key: 'sadhu_count', type: 'number' },
                ].map(f => (
                  <div key={f.key} className="form-group">
                    <label className="form-label">{f.label}</label>
                    <input type={f.type} className="form-input" required value={formData[f.key]}
                      onChange={e => setFormData({ ...formData, [f.key]: f.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value })} />
                  </div>
                ))}
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-input" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
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
