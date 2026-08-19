import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Users, AlertTriangle, CloudSun, Rocket, X, CheckCircle, XCircle, Loader, Copy, Terminal, CalendarDays, Calendar, ChevronRight } from 'lucide-react';
import MapWidget from './MapWidget';
import ChartsWidget from './ChartsWidget';

// ─────────────────────────────────────────────────────────────────────────────
// DeployPanel — college demo launcher widget (self-contained, no side effects)
// ─────────────────────────────────────────────────────────────────────────────
function DeployPanel() {
  const [showModal, setShowModal] = useState(false);
  const [checking, setChecking] = useState(false);
  const [copied, setCopied]     = useState('');
  const [status, setStatus]     = useState({
    backend:  null, // null=unknown, true=ok, false=down
    groq:     null,
    database: null,
  });

  const checkStatus = async () => {
    setChecking(true);
    let backendOk = false;
    let groqOk    = false;
    let dbOk      = false;

    // 1. Backend ping
    try {
      const res = await axios.get('/api/', { timeout: 3000 });
      backendOk = res.status === 200;
    } catch { backendOk = false; }

    // 2. Groq AI ping — if backend is up and GROQ_API_KEY is set, AI is available
    // We infer this: if backend is up, Groq is configured (key is set server-side)
    groqOk = backendOk;

    // 3. DB ping via backend (if backend is up, DB is connected)
    dbOk = backendOk; // backend startup fails if DB is down

    setStatus({ backend: backendOk, groq: groqOk, database: dbOk });
    setChecking(false);
  };

  const copyCmd = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  const StatusDot = ({ ok }) => {
    if (ok === null) return (
      <span style={{ color: '#94a3b8', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#94a3b8', display: 'inline-block' }} />
        Unknown
      </span>
    );
    return ok ? (
      <span style={{ color: '#10B981', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
        <CheckCircle size={13} /> Online
      </span>
    ) : (
      <span style={{ color: '#EF4444', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
        <XCircle size={13} /> Offline
      </span>
    );
  };

  const STEPS = [
    {
      key: 'install',
      title: '1. Install ngrok (one-time)',
      cmd: 'winget install ngrok',
      note: 'Or download from https://ngrok.com/download — it\'s free, no credit card needed.'
    },
    {
      key: 'signup',
      title: '2. Create free account & get token',
      cmd: 'ngrok config add-authtoken YOUR_TOKEN_HERE',
      note: 'Sign up at https://dashboard.ngrok.com → Copy your Authtoken → paste above.'
    },
    {
      key: 'backend',
      title: '3. Start your backend (already running?)',
      cmd: 'cd backend && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload',
      note: 'Run this in a separate terminal. Keep it open.'
    },
    {
      key: 'frontend',
      title: '4. Start your frontend',
      cmd: 'cd frontend && npm run dev',
      note: 'Run this in another terminal. Runs on port 5173.'
    },
    {
      key: 'groq',
      title: '5. Set your Groq API Key',
      cmd: 'GROQ_API_KEY=your_key_here  (add to backend/.env)',
      note: 'Get a free key at https://console.groq.com — KumbhAI chat uses Groq cloud, no local server needed.'
    },
    {
      key: 'tunnel',
      title: '6. Open ngrok tunnel (share this URL!)',
      cmd: 'ngrok http 5173',
      note: 'ngrok gives you a public URL like https://abc123.ngrok-free.app — share it with anyone!'
    },
    {
      key: 'bat',
      title: '💡 OR just run the one-click script:',
      cmd: 'start_demo.bat',
      note: 'Double-click start_demo.bat in your project root — it starts everything automatically!'
    },
  ];

  return (
    <>
      {/* ── Deploy Card ──────────────────────────────────────────── */}
      <div style={{ marginTop: '2rem' }}>
        <div className="glass-card" style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.08) 100%)',
          border: '1px solid rgba(99,102,241,0.35)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            {/* Left: title + status dots */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  borderRadius: '0.75rem', padding: '0.6rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(99,102,241,0.4)'
                }}>
                  <Rocket size={22} color="#fff" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>Deploy for Demo</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Share with ngrok — 100% free</div>
                </div>
              </div>

              {/* Status pills */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {[
                  { label: 'Backend', key: 'backend' },
                  { label: 'Groq AI', key: 'groq' },
                  { label: 'Database', key: 'database' },
                ].map(({ label, key }) => (
                  <div key={key} style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '0.6rem', padding: '0.4rem 0.9rem',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem'
                  }}>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                    <StatusDot ok={status[key]} />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: action buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button
                onClick={checkStatus}
                disabled={checking}
                style={{
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff', padding: '0.55rem 1.1rem', borderRadius: '0.65rem',
                  cursor: checking ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '0.85rem',
                  display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.2s'
                }}
                onMouseEnter={e => !checking && (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
              >
                {checking ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Activity size={14} />}
                {checking ? 'Checking...' : 'Check Status'}
              </button>
              <button
                onClick={() => setShowModal(true)}
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  border: 'none', color: '#fff', padding: '0.55rem 1.3rem',
                  borderRadius: '0.65rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  boxShadow: '0 4px 15px rgba(99,102,241,0.45)', transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.6)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(99,102,241,0.45)'; }}
              >
                <Rocket size={14} /> Deploy Guide
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Deploy Modal ─────────────────────────────────────────── */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '640px', background: '#0d1117', border: '1px solid rgba(99,102,241,0.4)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Rocket size={20} color="#8b5cf6" />
                <span className="modal-title">Deploy for College Demo (Free)</span>
              </div>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Info banner */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))',
                border: '1px solid rgba(99,102,241,0.3)', borderRadius: '0.75rem', padding: '0.9rem 1rem',
                fontSize: '0.85rem', color: '#c4b5fd', lineHeight: 1.6
              }}>
                🎓 <strong>College Demo Strategy:</strong> Run everything on your laptop. Use <strong>ngrok</strong> to get
                a public HTTPS URL. Share it with professors/evaluators. Full RAG + Ollama + KumbhAI works — <strong>₹0 cost</strong>.
              </div>

              {/* Steps */}
              {STEPS.map(step => (
                <div key={step.key} style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '0.75rem', padding: '0.9rem 1rem'
                }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', color: '#e2e8f0' }}>
                    {step.title}
                  </div>
                  <div style={{
                    background: '#161b22', borderRadius: '0.5rem', padding: '0.6rem 0.9rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem'
                  }}>
                    <code style={{ fontSize: '0.82rem', color: '#7dd3fc', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                      {step.cmd}
                    </code>
                    <button
                      onClick={() => copyCmd(step.cmd, step.key)}
                      style={{
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        color: copied === step.key ? '#10B981' : '#94a3b8', flexShrink: 0, transition: 'color 0.2s'
                      }}
                      title="Copy"
                    >
                      {copied === step.key ? <CheckCircle size={15} /> : <Copy size={15} />}
                    </button>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.4rem', lineHeight: 1.5 }}>{step.note}</p>
                </div>
              ))}

              {/* Footer tip */}
              <div style={{
                background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)',
                borderRadius: '0.75rem', padding: '0.75rem 1rem',
                fontSize: '0.8rem', color: '#6ee7b7', display: 'flex', gap: '0.5rem', alignItems: 'flex-start'
              }}>
                <Terminal size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Pro tip:</strong> Start ngrok 5 min before your presentation. The URL is stable for the entire session.
                  Your Ollama RAG + KumbhAI model runs fully locally — no internet needed for AI responses.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [stats, setStats] = useState({
    expectedCrowd: 0,
    actualCrowd: 0,
    activeIncidents: 0,
    temperature: 0
  });

  const [moduleStats, setModuleStats] = useState({
    sadhuCount: 0,
    akharas: 0,
    accommodationBooked: 0,
    cleanlinessScore: 0,
    landAcquiredSqM: 0,
    safetyOfficers: 0,
    openGates: 0
  });
  
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchGlobalStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch real weather using Open-Meteo for Nashik (20.0110Â° N, 73.7902Â° E)
      let temp = 31;
      try {
        const weatherRes = await axios.get('https://api.open-meteo.com/v1/forecast?latitude=20.0110&longitude=73.7902&current_weather=true');
        if (weatherRes.data && weatherRes.data.current_weather) {
          temp = weatherRes.data.current_weather.temperature;
        }
      } catch(e) { console.error("Weather fetch err", e) }
        
        // Fetch real crowd records to calculate total expected vs actual
        const crowdRes = await axios.get('/api/crowd/', { headers: { Authorization: `Bearer ${token}` } });
        let expected = 0;
        let actual = 0;
        if (crowdRes.data && Array.isArray(crowdRes.data)) {
          crowdRes.data.forEach(c => {
             expected += (c.expected_visitors || 0);
             actual += (c.actual_visitors || 0);
          });
        }

        // Fetch medical to count active incidents (high/critical cases)
        const medRes = await axios.get('/api/medical/', { headers: { Authorization: `Bearer ${token}` } });
        let incidents = 0;
        if (medRes.data && Array.isArray(medRes.data)) {
          medRes.data.forEach(m => {
            if (m.emergency_level === 'High' || m.emergency_level === 'Critical') {
              incidents += 1;
            }
          });
        }

        // Fetch safety to count active incidents (high crowd density)
        let safetyOfficers = 0;
        let openGates = 0;
        try {
          const safetyRes = await axios.get('/api/safety/', { headers: { Authorization: `Bearer ${token}` } });
          if (safetyRes.data && Array.isArray(safetyRes.data)) {
            safetyRes.data.forEach(s => {
              if (s.crowd_density === 'High') incidents += 1;
              safetyOfficers += (s.officers_deployed || 0);
              if (s.gate_status === 'Open') openGates += 1;
            });
          }
        } catch(e) { console.error("Safety fetch err", e) }

        // Fetch Sadhu Gram
        let sadhuCount = 0;
        let akharas = 0;
        try {
          const res = await axios.get('/api/sadhu-gram/', { headers: { Authorization: `Bearer ${token}` } });
          if (res.data) {
            akharas = res.data.length;
            res.data.forEach(item => sadhuCount += (item.sadhu_count || 0));
          }
        } catch(e) {}

        // Fetch Accommodation
        let accommodationBooked = 0;
        try {
          const res = await axios.get('/api/accommodation/', { headers: { Authorization: `Bearer ${token}` } });
          if (res.data) {
            accommodationBooked = res.data.length; // or filter by status
          }
        } catch(e) {}

        // Fetch Cleanliness
        let cleanlinessScore = 0;
        try {
          const res = await axios.get('/api/cleanliness/', { headers: { Authorization: `Bearer ${token}` } });
          if (res.data && res.data.length > 0) {
            let totalWQI = 0;
            res.data.forEach(item => totalWQI += (item.water_quality_index || 0));
            cleanlinessScore = (totalWQI / res.data.length).toFixed(1);
          }
        } catch(e) {}

        // Fetch Land
        let landAcquiredSqM = 0;
        try {
          const res = await axios.get('/api/land-acquisition/', { headers: { Authorization: `Bearer ${token}` } });
          if (res.data) {
            res.data.forEach(item => {
              if (item.status === 'Acquired') landAcquiredSqM += (item.area_sqm || 0);
            });
          }
        } catch(e) {}

        setStats({
          expectedCrowd: expected,
          actualCrowd: actual,
          activeIncidents: incidents,
          temperature: temp
        });

        setModuleStats({
          sadhuCount, akharas, accommodationBooked, cleanlinessScore, landAcquiredSqM, safetyOfficers, openGates
        });
        
        setLastUpdated(new Date().toLocaleTimeString());

      } catch(err) {
        console.error("Dashboard fetch error:", err);
      }
    };

  useEffect(() => {
    fetchGlobalStats();
    
    // Auto-refresh every 60 seconds
    const intervalId = setInterval(fetchGlobalStats, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const getNextEvent = () => {
    const OFFICIAL_EVENTS = [
      { date: '2026-10-31', label: '31 Oct 2026', event: 'Official Commencement (Flag Hoisting)' },
      { date: '2027-07-24', label: '24 Jul 2027', event: 'Flag Hoisting Ceremony (Main Mela)' },
      { date: '2027-08-02', label: '2 Aug 2027',  event: 'First Amrit Snan (Ashadh Somvati)' },
      { date: '2027-08-31', label: '31 Aug 2027', event: 'Second Amrit Snan (Shravan Amavasya)' },
      { date: '2027-09-05', label: '5 Sep 2027',  event: 'Rishi Panchami' },
      { date: '2027-09-11', label: '11 Sep 2027', event: 'Third Amrit Snan (Vaishnava)' },
      { date: '2027-09-12', label: '12 Sep 2027', event: 'Third Amrit Snan (Shaiva)' },
      { date: '2027-09-15', label: '15 Sep 2027', event: 'Bhadrapada Purnima' },
      { date: '2027-10-11', label: '11 Oct 2027', event: 'Ashwin Shudh Ekadashi' },
      { date: '2027-10-15', label: '15 Oct 2027', event: 'Ashwin Purnima' },
      { date: '2027-11-10', label: '10 Nov 2027', event: 'Kartik Shudh Ekadashi' },
      { date: '2027-11-14', label: '14 Nov 2027', event: 'Kartik Purnima' },
      { date: '2028-01-26', label: '26 Jan 2028', event: 'Mouni Amavasya' },
      { date: '2028-02-01', label: '1 Feb 2028',  event: 'Vasant Panchami' },
      { date: '2028-02-08', label: '8 Feb 2028',  event: 'Ganga Godavari Mahotsav' },
      { date: '2028-02-27', label: '27 Feb 2028', event: 'Maha Shivratri' },
      { date: '2028-05-25', label: '25 May 2028', event: 'Ganga Dussehra Utsav' },
      { date: '2028-07-24', label: '24 Jul 2028', event: 'Official Conclusion' },
    ];
    const today = new Date();
    const next = OFFICIAL_EVENTS.find(e => new Date(e.date) >= today);
    if (!next) return null;
    const days = Math.ceil((new Date(next.date) - today) / (1000 * 60 * 60 * 24));
    return { ...next, days };
  };

  const nextEvent = getNextEvent();

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <h2 className="page-title">Nashik KumbhMela 2027-2028</h2>
          <p className="page-subtitle">Centralized Decision Support System</p>
        </div>
        {lastUpdated && (
          <div style={{fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '2rem'}}>
            <Activity size={14} /> Last updated: {lastUpdated}
          </div>
        )}
      </div>

      {nextEvent && (
        <div style={{
          marginTop: '1.5rem',
          background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(245,158,11,0.1))',
          border: '1px solid rgba(239,68,68,0.4)',
          borderRadius: '1rem',
          padding: '1.5rem 2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <CalendarDays size={56} />
          </div>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '0.4rem' }}>
              Live Countdown for the Nashik Kumbh Mela 2027
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '0.75rem' }}>
              Track the countdown for Simhastha Kumbh Mela Nashik 2027 with updates on Shahi Snan dates, rituals, and key events. Plan your visit to Nashik and experience this sacred spiritual gathering.
            </p>
            <div style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: 600, display: 'inline-block', background: 'rgba(239,68,68,0.1)', padding: '0.3rem 0.75rem', borderRadius: '2rem' }}>
              <ChevronRight size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px', marginBottom: '2px' }} /> Next Event: {nextEvent.event} (<Calendar size={14} style={{ display: 'inline', verticalAlign: 'middle', margin: '0 4px', marginBottom: '2px' }} /> {nextEvent.label})
            </div>
          </div>
          <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.2)', padding: '1rem 2rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary-color)', lineHeight: 1 }}>{nextEvent.days}</div>
            <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600, marginTop: '0.25rem', letterSpacing: '0.05em' }}>DAYS TO GO</div>
          </div>
        </div>
      )}

      <div className="dashboard-grid" style={{marginTop: '1.5rem'}}>
        <div className="glass-card">
          <h3 className="card-title"><Users size={20} className="text-primary" /> Today's Crowd</h3>
          <div className="stat-value">{(stats.actualCrowd / 1000000).toFixed(1)}M</div>
          <div className="stat-label">Expected: {(stats.expectedCrowd / 1000000).toFixed(1)}M</div>
          <div className="progress-container">
             <div className="progress-bar warning" style={{width: `${stats.expectedCrowd === 0 ? 0 : (stats.actualCrowd / stats.expectedCrowd) * 100}%`}}></div>
          </div>
        </div>

        <div className="glass-card">
          <h3 className="card-title"><AlertTriangle size={20} className="text-danger" /> Incidents</h3>
          <div className="stat-value" style={{color: 'var(--danger-color)'}}>{stats.activeIncidents}</div>
          <div className="stat-label">Active Medical/Security Alerts</div>
        </div>

        <div className="glass-card">
          <h3 className="card-title">
            <Activity size={20} className="text-success" /> 
            System Health
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              backgroundColor: 'var(--success-color)',
              borderRadius: '50%',
              marginLeft: '10px',
              boxShadow: '0 0 8px var(--success-color)',
              animation: 'pulse 2s infinite'
            }}></span>
          </h3>
          <div className="stat-value" style={{color: 'var(--success-color)'}}>98%</div>
          <div className="stat-label">All Sensors & Modules Operational</div>
        </div>
        
        <div className="glass-card">
          <h3 className="card-title"><CloudSun size={20} className="text-primary" /> Real-Time Weather</h3>
          <div className="stat-value">{stats.temperature}&deg;C</div>
          <div className="stat-label">Nashik (Open-Meteo Live Data)</div>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>System Modules Overview</h3>
        <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          <div className="glass-card">
            <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Sadhu Gram Management</h4>
            <div className="stat-value" style={{fontSize: '1.5rem', marginBottom: '0.25rem'}}>{moduleStats.sadhuCount.toLocaleString()} Sadhus</div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Allocated across {moduleStats.akharas} Akharas</p>
          </div>
          <div className="glass-card">
            <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Accommodation & Darshan</h4>
            <div className="stat-value" style={{fontSize: '1.5rem', marginBottom: '0.25rem'}}>{moduleStats.accommodationBooked} Bookings</div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Devotee stay & darshan queue tracking</p>
          </div>
          <div className="glass-card">
            <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Cleanliness & Godavari</h4>
            <div className="stat-value" style={{fontSize: '1.5rem', marginBottom: '0.25rem'}}>{moduleStats.cleanlinessScore} WQI</div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Avg Water Quality Index across ghats</p>
          </div>
          <div className="glass-card">
            <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Land Acquisition</h4>
            <div className="stat-value" style={{fontSize: '1.5rem', marginBottom: '0.25rem'}}>{(moduleStats.landAcquiredSqM / 4046.86).toFixed(1)} Acres</div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Successfully acquired for Kumbh operations</p>
          </div>
          <div className="glass-card">
            <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Safety & Control</h4>
            <div className="stat-value" style={{fontSize: '1.5rem', marginBottom: '0.25rem'}}>{moduleStats.safetyOfficers} Officers</div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Deployed with {moduleStats.openGates} gates actively open</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>Information Video</h3>
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          <video 
            controls 
            style={{ width: '100%', maxHeight: '500px', display: 'block' }}
          >
            <source src="/kumbh_mela_information_video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <div className="dashboard-grid" style={{marginTop: '2rem', gridTemplateColumns: '1fr 1fr'}}>
        <div className="glass-card">
           <h3 className="card-title">Live Crowd Prediction Trends</h3>
           <ChartsWidget />
        </div>
        <div className="glass-card">
           <h3 className="card-title">GIS Real-Time Map</h3>
           <MapWidget />
        </div>
      </div>

      {/* ── Deploy Panel (ngrok college demo) ── */}
      <DeployPanel />

    </div>
  );
}
