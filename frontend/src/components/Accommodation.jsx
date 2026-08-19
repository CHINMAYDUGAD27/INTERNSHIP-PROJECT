import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Ticket, PlusCircle, X, Edit2, Trash2 } from 'lucide-react';

const API = '/api/accommodation';

const statusColor = (s) => {
  if (s === 'Completed') return 'success';
  if (s === 'Cancelled') return 'danger';
  return 'warning';
};

export default function Accommodation() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    devotee_name: '', contact: '', location: '',
    check_in: today, check_out: '', token_number: '',
    darshan_slot: '', status: 'Waiting'
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
    setFormData({ devotee_name: '', contact: '', location: '', check_in: today, check_out: '', token_number: `TK-${Math.floor(1000 + Math.random() * 9000)}`, darshan_slot: '', status: 'Waiting' });
    setShowModal(true);
  };

  const openEdit = (r) => {
    setEditRecord(r);
    setFormData({ devotee_name: r.devotee_name, contact: r.contact, location: r.location, check_in: r.check_in, check_out: r.check_out || '', token_number: r.token_number, darshan_slot: r.darshan_slot, status: r.status });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, check_out: formData.check_out || null };
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

  const waiting = records.filter(r => r.status === 'Waiting').length;
  const completed = records.filter(r => r.status === 'Completed').length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 className="page-title">Accommodation & Darshan</h2>
          <p className="page-subtitle">Devotee stay records & Ramkund darshan queue / token system.</p>
        </div>
        <button className="btn-primary" onClick={openAdd}><PlusCircle size={18} /> Add Record</button>
      </div>

      {/* Summary */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '2rem' }}>
        {[
          { label: 'Total Records', value: records.length, icon: '🏠', color: 'var(--primary-color)' },
          { label: 'Awaiting Darshan', value: waiting, icon: '⏳', color: 'var(--warning-color)' },
          { label: 'Darshan Completed', value: completed, icon: '✅', color: 'var(--success-color)' },
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
              <th>Token</th><th>Devotee</th><th>Contact</th><th>Location</th>
              <th>Check-In</th><th>Check-Out</th><th>Darshan Slot</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="9" style={{ textAlign: 'center' }}>Loading...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan="9" style={{ textAlign: 'center' }}>No records found.</td></tr>
            ) : records.map(r => (
              <tr key={r.id}>
                <td><span style={{ fontFamily: 'monospace', color: 'var(--primary-color)', fontWeight: 700 }}>{r.token_number}</span></td>
                <td style={{ fontWeight: 600 }}>{r.devotee_name}</td>
                <td>{r.contact}</td>
                <td>{r.location}</td>
                <td>{r.check_in}</td>
                <td>{r.check_out || <span style={{ color: 'var(--text-secondary)' }}>—</span>}</td>
                <td>{r.darshan_slot}</td>
                <td><span className={`badge ${statusColor(r.status)}`}>{r.status}</span></td>
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
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{editRecord ? 'Edit Record' : 'Add Accommodation / Darshan Record'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { label: 'Devotee Name', key: 'devotee_name', type: 'text' },
                  { label: 'Contact Number', key: 'contact', type: 'text' },
                  { label: 'Stay Location / Area', key: 'location', type: 'text' },
                  { label: 'Check-In Date', key: 'check_in', type: 'date' },
                  { label: 'Check-Out Date (optional)', key: 'check_out', type: 'date', required: false },
                  { label: 'Token Number', key: 'token_number', type: 'text' },
                  { label: 'Darshan Slot (e.g. 06:00–08:00)', key: 'darshan_slot', type: 'text' },
                ].map(f => (
                  <div key={f.key} className="form-group">
                    <label className="form-label">{f.label}</label>
                    <input type={f.type} className="form-input" required={f.required !== false} value={formData[f.key]}
                      onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} />
                  </div>
                ))}
                <div className="form-group">
                  <label className="form-label">Darshan Status</label>
                  <select className="form-input" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                    <option value="Waiting">Waiting</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
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
