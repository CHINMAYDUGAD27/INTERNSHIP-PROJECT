import React, { useState, useEffect } from 'react';
import api from '../api';
import { Navigation, PlusCircle, X } from 'lucide-react';

export default function Traffic() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ location: '', road_name: '', vehicle_count: 0, average_speed: 0, weather_condition: 'Sunny', event_type: 'Normal' });

  const fetchTraffic = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/api/traffic/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(res.data);
    } catch (err) {
      console.error("Failed to fetch traffic data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTraffic(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await api.post(`/api/traffic/?location=${formData.location}&road_name=${formData.road_name}&vehicle_count=${formData.vehicle_count}&average_speed=${formData.average_speed}&weather_condition=${formData.weather_condition}&event_type=${formData.event_type}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      fetchTraffic();
    } catch (error) {
      console.error("Failed to add traffic record", error);
    }
  };

  const handleRoadNameChange = (e) => {
    const val = e.target.value;
    let autoVehicle = formData.vehicle_count;
    let autoSpeed = formData.average_speed;

    const lowerVal = val.toLowerCase();
    if (lowerVal.includes('highway')) {
      autoVehicle = 1250;
      autoSpeed = 35;
    } else if (lowerVal.includes('ghat') || lowerVal.includes('ramkund')) {
      autoVehicle = 2100;
      autoSpeed = 12;
    } else if (lowerVal.includes('ring')) {
      autoVehicle = 600;
      autoSpeed = 45;
    }

    setFormData({
      ...formData, 
      road_name: val,
      vehicle_count: autoVehicle !== formData.vehicle_count ? autoVehicle : formData.vehicle_count,
      average_speed: autoSpeed !== formData.average_speed ? autoSpeed : formData.average_speed
    });
  };

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <div>
          <h2 className="page-title">Traffic Analysis</h2>
          <p className="page-subtitle">Smart traffic routing and monitoring records.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}><PlusCircle size={18} /> Add Traffic Data</button>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Location</th>
              <th>Road Name</th>
              <th>Vehicle Count</th>
              <th>Avg Speed (km/h)</th>
              <th>Event Type</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{textAlign:'center'}}>Loading...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign:'center'}}>No traffic records found.</td></tr>
            ) : (
              records.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.location}</td>
                  <td>{r.road_name}</td>
                  <td>{r.vehicle_count.toLocaleString()}</td>
                  <td style={{ fontWeight: 600 }}>
                    {r.average_speed} km/h
                  </td>
                  <td>{r.event_type}</td>
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
              <h3 className="modal-title">Add Traffic Data</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input type="text" className="form-input" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Road Name (Auto-fills estimates)</label>
                  <input type="text" className="form-input" placeholder="e.g. Highway 4, Ramkund Ghat" required value={formData.road_name} onChange={handleRoadNameChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Vehicle Count</label>
                  <input type="number" className="form-input" required value={formData.vehicle_count} onChange={e => setFormData({...formData, vehicle_count: parseInt(e.target.value)})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Avg Speed (km/h)</label>
                  <input type="number" className="form-input" required value={formData.average_speed} onChange={e => setFormData({...formData, average_speed: parseInt(e.target.value)})} />
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
