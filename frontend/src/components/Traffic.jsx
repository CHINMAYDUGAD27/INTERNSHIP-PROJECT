import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../api';
import { Navigation, PlusCircle, X, Brain, Loader2 } from 'lucide-react';

export default function Traffic() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ location: '', road_name: '', vehicle_count: 0, average_speed: 0, weather_condition: 'Sunny', event_type: 'Normal' });

  // ML Preview State
  const [mlPreview, setMlPreview] = useState(null);
  const [mlLoading, setMlLoading] = useState(false);
  const debounceRef = useRef(null);

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

  // ── Live ML Prediction Preview ───────────────────────────────
  const fetchMLPreview = useCallback(async (data) => {
    const { vehicle_count, average_speed } = data;
    if (vehicle_count <= 0 && average_speed <= 0) {
      setMlPreview(null);
      return;
    }
    setMlLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        vehicle_count: Math.max(vehicle_count, 0),
        average_speed: Math.max(average_speed, 1)
      });
      const res = await api.post(`/api/traffic/preview-predict?${params}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMlPreview(res.data.congestion_level);
    } catch (err) {
      console.error("ML preview failed", err);
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
  }, [formData.vehicle_count, formData.average_speed, showModal, fetchMLPreview]);

  useEffect(() => {
    if (!showModal) { setMlPreview(null); setMlLoading(false); }
  }, [showModal]);

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

  // ── ML Badge helper ──────────────────────────────────────────
  const mlBadgeStyle = (level) => {
    const colors = {
      High:   { bg: 'rgba(239,68,68,0.15)', border: '#EF4444', text: '#F87171', glow: '0 0 18px rgba(239,68,68,0.4)' },
      Medium: { bg: 'rgba(245,158,11,0.15)', border: '#F59E0B', text: '#FBBF24', glow: '0 0 18px rgba(245,158,11,0.4)' },
      Low:    { bg: 'rgba(16,185,129,0.15)', border: '#10B981', text: '#34D399', glow: '0 0 18px rgba(16,185,129,0.4)' },
    };
    return colors[level] || colors.Low;
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
              <th>Congestion Level (ML)</th>
              <th>Event Type</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{textAlign:'center'}}>Loading...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan="7" style={{textAlign:'center'}}>No traffic records found.</td></tr>
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
                  <td>
                    <span className={`badge ${r.congestion_level?.toLowerCase() === 'high' ? 'danger' : r.congestion_level?.toLowerCase() === 'medium' ? 'warning' : 'success'}`}>
                      {r.congestion_level || 'Low'}
                    </span>
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
                  <input type="number" className="form-input" required value={formData.vehicle_count} onChange={e => setFormData({...formData, vehicle_count: parseInt(e.target.value) || 0})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Avg Speed (km/h)</label>
                  <input type="number" className="form-input" required value={formData.average_speed} onChange={e => setFormData({...formData, average_speed: parseInt(e.target.value) || 0})} />
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
                      ML Prediction Preview
                    </div>
                    {mlLoading ? (
                      <div style={{ fontSize: '0.95rem', color: '#818CF8', fontWeight: 600 }}>Analyzing...</div>
                    ) : mlPreview ? (
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: mlBadgeStyle(mlPreview).text, letterSpacing: '0.02em' }}>
                        {mlPreview === 'High' ? '🔴' : mlPreview === 'Medium' ? '🟠' : '🟢'} Congestion: {mlPreview}
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Enter vehicle count & speed to see live prediction</div>
                    )}
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{marginTop: '1rem', justifyContent: 'center'}}>Submit Data</button>
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
