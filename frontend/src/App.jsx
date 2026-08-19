import React, { useState, useEffect } from 'react'
import api from './api'
import { BrowserRouter, Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, Activity, Wallet, Bot, Navigation, LogOut, BookOpen, Home, Ticket, Droplets, MapPin, ShieldCheck } from 'lucide-react'
import Dashboard from './components/Dashboard'
import AIChatAssistant from './components/AIChatAssistant'
import Crowd from './components/Crowd'
import Traffic from './components/Traffic'
import Medical from './components/Medical'
import Budget from './components/Budget'
import Information from './components/Information'
import Login from './components/Login'
import Signup from './components/Signup'
import SadhuGram from './components/SadhuGram'
import Accommodation from './components/Accommodation'
import Cleanliness from './components/Cleanliness'
import LandAcquisition from './components/LandAcquisition'
import Safety from './components/Safety'

function Sidebar({ setAuth, user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(false);
    navigate('/login');
  };

  const isAdmin = user?.role === 'Admin';
  const dept = user?.department || 'General';

  return (
    <div className="sidebar">
      <h1 style={{fontSize: '1.1rem'}}>Nashik KumbhMela 2027-2028</h1>
      
      {/* User Info Badge */}
      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.85rem' }}>
        <div style={{ color: 'var(--primary-color)', fontWeight: 600 }}>{user?.full_name || 'User'}</div>
        <div style={{ color: 'var(--text-secondary)' }}>{isAdmin ? 'Administrator' : `${dept} Department`}</div>
      </div>

      <ul className="nav-links" style={{ flex: 1, overflowY: 'auto' }}>
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/information" className={({ isActive }) => isActive ? "active" : ""}>
            <BookOpen size={18} /> History & Info
          </NavLink>
        </li>
        
            <li>
              <NavLink to="/sadhu-gram" className={({ isActive }) => isActive ? "active" : ""}>
                <Home size={18} /> Sadhu Gram
              </NavLink>
            </li>
            <li>
              <NavLink to="/accommodation" className={({ isActive }) => isActive ? "active" : ""}>
                <Ticket size={18} /> Accommodation & Darshan
              </NavLink>
            </li>
            <li>
              <NavLink to="/land-acquisition" className={({ isActive }) => isActive ? "active" : ""}>
                <MapPin size={18} /> Land Acquisition
              </NavLink>
            </li>
            <li>
              <NavLink to="/budget" className={({ isActive }) => isActive ? "active" : ""}>
                <Wallet size={18} /> Budget Tracking
              </NavLink>
            </li>

            <li>
              <NavLink to="/cleanliness" className={({ isActive }) => isActive ? "active" : ""}>
                <Droplets size={18} /> Cleanliness & Godavari
              </NavLink>
            </li>
            <li>
              <NavLink to="/medical" className={({ isActive }) => isActive ? "active" : ""}>
                <Activity size={18} /> Medical Emergency
              </NavLink>
            </li>

            <li>
              <NavLink to="/safety" className={({ isActive }) => isActive ? "active" : ""}>
                <ShieldCheck size={18} /> Safety & Public Control
              </NavLink>
            </li>
            <li>
              <NavLink to="/crowd" className={({ isActive }) => isActive ? "active" : ""}>
                <Users size={18} /> Crowd Prediction
              </NavLink>
            </li>
            <li>
              <NavLink to="/traffic" className={({ isActive }) => isActive ? "active" : ""}>
                <Navigation size={18} /> Traffic Analysis
              </NavLink>
            </li>

        <li>
          <NavLink to="/ai-assistant" className={({ isActive }) => isActive ? "active" : ""}>
            <Bot size={18} /> AI Assistant
          </NavLink>
        </li>
      </ul>

      <button
        onClick={handleLogout}
        style={{
          background: 'transparent', border: '1px solid var(--danger-color)', color: 'var(--danger-color)',
          padding: '0.875rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
          cursor: 'pointer', fontWeight: 600, justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--danger-color)'; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--danger-color)'; }}
      >
        <LogOut size={20} /> Logout
      </button>
    </div>
  )
}

function ProtectedRoute({ children, isAuthenticated, user, allowedDepts }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedDepts && user) {
    const isAdmin = user.role === 'Admin';
    const dept = user.department || 'General';
    if (!isAdmin && !allowedDepts.includes(dept)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

function MainLayout({ children, setAuth, user }) {
  return (
    <div className="app-container">
      <Sidebar setAuth={setAuth} user={user} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data.user);
          setIsAuthenticated(true);
        } catch (err) {
          console.error("Invalid token", err);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [isAuthenticated]);

  if (loading) return <div style={{ color: 'white', padding: '2rem' }}>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} user={user}>
            <MainLayout setAuth={setIsAuthenticated} user={user}><Dashboard /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/information" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} user={user}>
            <MainLayout setAuth={setIsAuthenticated} user={user}><Information /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/ai-assistant" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} user={user}>
            <MainLayout setAuth={setIsAuthenticated} user={user}><AIChatAssistant /></MainLayout>
          </ProtectedRoute>
        } />

        {/* General Dept Routes */}
        <Route path="/sadhu-gram" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} user={user}>
            <MainLayout setAuth={setIsAuthenticated} user={user}><SadhuGram /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/accommodation" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} user={user}>
            <MainLayout setAuth={setIsAuthenticated} user={user}><Accommodation /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/land-acquisition" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} user={user}>
            <MainLayout setAuth={setIsAuthenticated} user={user}><LandAcquisition /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/budget" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} user={user}>
            <MainLayout setAuth={setIsAuthenticated} user={user}><Budget /></MainLayout>
          </ProtectedRoute>
        } />

        {/* Medical Dept Routes */}
        <Route path="/cleanliness" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} user={user}>
            <MainLayout setAuth={setIsAuthenticated} user={user}><Cleanliness /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/medical" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} user={user}>
            <MainLayout setAuth={setIsAuthenticated} user={user}><Medical /></MainLayout>
          </ProtectedRoute>
        } />

        {/* Police Dept Routes */}
        <Route path="/safety" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} user={user}>
            <MainLayout setAuth={setIsAuthenticated} user={user}><Safety /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/crowd" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} user={user}>
            <MainLayout setAuth={setIsAuthenticated} user={user}><Crowd /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/traffic" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} user={user}>
            <MainLayout setAuth={setIsAuthenticated} user={user}><Traffic /></MainLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
