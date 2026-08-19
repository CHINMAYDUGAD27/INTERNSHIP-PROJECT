import React, { useState, useEffect } from 'react';
import api from '../api';
import { Wallet, PlusCircle, X } from 'lucide-react';

export default function Budget() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ department: '', allocated_budget: 0, spent_budget: 0, financial_year: '2027-2028', remarks: 'Active' });

  const fetchBudgets = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/api/budgets/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(res.data);
    } catch (err) {
      console.error("Failed to fetch budget data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBudgets(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await api.post('/api/budgets/', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      fetchBudgets();
    } catch (error) {
      console.error("Failed to add budget record", error);
    }
  };

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <div>
          <h2 className="page-title">Budget Tracking</h2>
          <p className="page-subtitle">Departmental budget utilization and allocation.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}><PlusCircle size={18} /> Allocate Budget</button>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Department</th>
              <th>Allocated Amount</th>
              <th>Spent Amount</th>
              <th>Remaining</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{textAlign:'center'}}>Loading...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign:'center'}}>No budget records found.</td></tr>
            ) : (
              records.map(r => {
                const alloc = r.allocated_budget || 0;
                const spent = r.spent_budget || 0;
                const remaining = alloc - spent;
                const percentSpent = alloc === 0 ? 0 : (spent / alloc) * 100;
                
                return (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.department}</td>
                    <td>?{alloc.toLocaleString()}</td>
                    <td>?{spent.toLocaleString()}</td>
                    <td>?{remaining.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${percentSpent > 90 ? 'danger' : percentSpent > 75 ? 'warning' : 'success'}`}>
                        {r.remarks || 'Active'}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Allocate Budget</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input type="text" className="form-input" required onChange={e => setFormData({...formData, department: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Allocated Amount</label>
                  <input type="number" className="form-input" required onChange={e => setFormData({...formData, allocated_budget: parseFloat(e.target.value)})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Spent Amount</label>
                  <input type="number" className="form-input" required onChange={e => setFormData({...formData, spent_budget: parseFloat(e.target.value)})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Remarks</label>
                  <select className="form-input" onChange={e => setFormData({...formData, remarks: e.target.value})}>
                    <option value="Active">Active</option>
                    <option value="Reviewing">Reviewing</option>
                    <option value="Depleted">Depleted</option>
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
