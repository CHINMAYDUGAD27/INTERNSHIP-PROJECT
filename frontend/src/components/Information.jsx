import React, { useState } from 'react';
import { BookOpen, MapPin, Calendar, Users, Clock, Star, Flag, Navigation } from 'lucide-react';

// ── Official Nashik Simhastha Kumbh Mela 2027-2028 Schedule ──────────────────
const OFFICIAL_EVENTS = [
  { date: '2026-10-31', label: '31 Oct 2026', event: 'Official Commencement – Dhwajarohan (Flag Hoisting)', location: 'Ramkund & Nashik',         type: 'milestone', importance: 'high' },
  { date: '2027-07-24', label: '24 Jul 2027', event: 'Flag Hoisting Ceremony (Opening of Main Mela)',       location: 'Nashik & Trimbakeshwar',    type: 'milestone', importance: 'high' },
  { date: '2027-08-02', label: '2 Aug 2027',  event: 'First Amrit Snan – Ashadh Somvati Amavasya',         location: 'Ramkund & Kushavarta Kund', type: 'snan',      importance: 'critical' },
  { date: '2027-08-31', label: '31 Aug 2027', event: 'Second Amrit Snan – Shravan Amavasya',               location: 'Ramkund & Kushavarta Kund', type: 'snan',      importance: 'critical' },
  { date: '2027-09-05', label: '5 Sep 2027',  event: 'Rishi Panchami',                                     location: 'Both Locations',            type: 'festival',  importance: 'medium' },
  { date: '2027-09-11', label: '11 Sep 2027', event: 'Third Amrit Snan (Vaishnava) – Bhadrapada Ekadashi', location: 'Ramkund & Nashik',          type: 'snan',      importance: 'critical' },
  { date: '2027-09-12', label: '12 Sep 2027', event: 'Third Amrit Snan (Shaiva) – Bhadrapada Ekadashi',   location: 'Kushavarta, Trimbak',       type: 'snan',      importance: 'critical' },
  { date: '2027-09-15', label: '15 Sep 2027', event: 'Bhadrapada Purnima',                                 location: 'Both Locations',            type: 'festival',  importance: 'medium' },
  { date: '2027-10-11', label: '11 Oct 2027', event: 'Ashwin Shudh Ekadashi',                              location: 'Both Locations',            type: 'festival',  importance: 'medium' },
  { date: '2027-10-15', label: '15 Oct 2027', event: 'Ashwin Purnima',                                     location: 'Both Locations',            type: 'festival',  importance: 'medium' },
  { date: '2027-11-10', label: '10 Nov 2027', event: 'Kartik Shudh Ekadashi',                              location: 'Both Locations',            type: 'festival',  importance: 'medium' },
  { date: '2027-11-14', label: '14 Nov 2027', event: 'Kartik Purnima',                                     location: 'Both Locations',            type: 'festival',  importance: 'medium' },
  { date: '2028-01-26', label: '26 Jan 2028', event: 'Mouni Amavasya',                                     location: 'Both Locations',            type: 'festival',  importance: 'high' },
  { date: '2028-02-01', label: '1 Feb 2028',  event: 'Vasant Panchami',                                    location: 'Both Locations',            type: 'festival',  importance: 'medium' },
  { date: '2028-02-08', label: '8 Feb 2028',  event: 'Ganga Godavari Mahotsav',                            location: 'Ramkund, Nashik',           type: 'festival',  importance: 'high' },
  { date: '2028-02-27', label: '27 Feb 2028', event: 'Maha Shivratri',                                     location: 'Kushavarta, Trimbak',       type: 'festival',  importance: 'high' },
  { date: '2028-05-25', label: '25 May – 2 Jun 2028', event: 'Ganga Dussehra Utsav',                      location: 'Both Locations',            type: 'festival',  importance: 'high' },
  { date: '2028-07-24', label: '24 Jul 2028', event: 'Official Conclusion – Flag Lowering',               location: 'Nashik & Trimbakeshwar',    type: 'milestone', importance: 'high' },
];

const typeStyle = {
  snan:      { bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.5)',   color: '#EF4444', label: 'Amrit Snan' },
  milestone: { bg: 'rgba(245,158,11,0.15)',  border: 'rgba(245,158,11,0.5)',  color: '#F59E0B', label: 'Milestone' },
  festival:  { bg: 'rgba(99,102,241,0.15)',  border: 'rgba(99,102,241,0.5)',  color: '#818CF8', label: 'Festival' },
};

function getDaysFromNow(dateStr) {
  const now = new Date();
  const evt = new Date(dateStr);
  const diff = Math.ceil((evt - now) / (1000 * 60 * 60 * 24));
  return diff;
}

export default function Information() {
  const [filter, setFilter] = useState('all');

  const today = new Date();
  const filtered = OFFICIAL_EVENTS.filter(e => {
    if (filter === 'snan') return e.type === 'snan';
    if (filter === 'upcoming') return new Date(e.date) >= today;
    if (filter === 'past') return new Date(e.date) < today;
    return true;
  });

  // Next upcoming event
  const nextEvent = OFFICIAL_EVENTS.find(e => new Date(e.date) >= today);
  const daysToNext = nextEvent ? getDaysFromNow(nextEvent.date) : null;

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <h2 className="page-title">History & Official Event Calendar</h2>
      <p className="page-subtitle">Nashik Simhastha Kumbh Mela 2027–2028 — Official Schedule & Heritage.</p>

      {/* ── Hero Banner ── */}
      <div style={{ marginTop: '1.5rem', borderRadius: '1rem', overflow: 'hidden' }}>
        <img src="/images/banner_hero.png" alt="Nashik Kumbh Mela 2027" style={{ width: '100%', height: 'auto', display: 'block' }} />
      </div>


      {/* ── Next Event Countdown ── */}
      {nextEvent && (
        <div style={{
          marginTop: '1.5rem',
          background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(245,158,11,0.1))',
          border: '1px solid rgba(239,68,68,0.4)',
          borderRadius: '1rem',
          padding: '1.25rem 1.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ fontSize: '2.5rem' }}>🛕</div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--primary-color)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Next Official Event
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>{nextEvent.event}</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              📅 {nextEvent.label} &nbsp;|&nbsp; 📍 {nextEvent.location}
            </div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-color)', lineHeight: 1 }}>{daysToNext}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>DAYS TO GO</div>
          </div>
        </div>
      )}

      {/* ── Quick Stats ── */}
      <div className="dashboard-grid" style={{ marginTop: '1.5rem', gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          { icon: '🛕', label: 'Amrit Snans', value: OFFICIAL_EVENTS.filter(e=>e.type==='snan').length, color: '#EF4444' },
          { icon: '🏁', label: 'Milestones', value: OFFICIAL_EVENTS.filter(e=>e.type==='milestone').length, color: '#F59E0B' },
          { icon: '🎉', label: 'Festivals', value: OFFICIAL_EVENTS.filter(e=>e.type==='festival').length, color: '#818CF8' },
          { icon: '📅', label: 'Event Span (Days)', value: '~726', color: '#10B981' },
        ].map(s => (
          <div key={s.label} className="glass-card" style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.35rem' }}>{s.icon}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Official Event Calendar Table ── */}
      <div className="glass-card" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h3 style={{ color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={20} /> Official Kumbh Mela Schedule
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['all', 'snan', 'upcoming', 'past'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '0.3rem 0.75rem', borderRadius: '2rem', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
                background: filter === f ? 'var(--primary-color)' : 'rgba(255,255,255,0.06)',
                color: filter === f ? '#fff' : 'var(--text-secondary)',
                border: filter === f ? 'none' : '1px solid var(--border-color)',
                transition: 'all 0.2s'
              }}>
                {f === 'all' ? 'All Events' : f === 'snan' ? 'Amrit Snans' : f === 'upcoming' ? 'Upcoming' : 'Past'}
              </button>
            ))}
          </div>
        </div>

        <div className="data-table-container" style={{ maxHeight: '520px', overflowY: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ minWidth: '120px' }}>Date</th>
                <th>Event</th>
                <th>Locations</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => {
                const days = getDaysFromNow(e.date);
                const isPast = days < 0;
                const isToday = days === 0;
                const ts = typeStyle[e.type];
                return (
                  <tr key={i} style={{
                    background: isToday ? 'rgba(245,158,11,0.08)' : isPast ? 'rgba(255,255,255,0.01)' : 'transparent',
                    opacity: isPast ? 0.6 : 1
                  }}>
                    <td style={{ fontWeight: 700, color: isPast ? 'var(--text-secondary)' : '#fff', whiteSpace: 'nowrap' }}>
                      {isToday && <span style={{ color: '#F59E0B', marginRight: '0.4rem' }}>★</span>}
                      {e.label}
                    </td>
                    <td style={{ fontWeight: isPast ? 400 : 600 }}>{e.event}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={12} /> {e.location}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        background: ts.bg, border: `1px solid ${ts.border}`, color: ts.color,
                        padding: '0.2rem 0.6rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap'
                      }}>
                        {ts.label}
                      </span>
                    </td>
                    <td>
                      {isPast
                        ? <span className="badge success" style={{ fontSize: '0.72rem' }}>Completed</span>
                        : isToday
                        ? <span className="badge warning" style={{ fontSize: '0.72rem' }}>Today</span>
                        : days <= 30
                        ? <span className="badge danger" style={{ fontSize: '0.72rem' }}>In {days}d</span>
                        : <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>In {days} days</span>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Heritage Info ── */}
      <div className="dashboard-grid" style={{ marginTop: '1.5rem' }}>
        <div className="glass-card">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={20} className="text-primary" /> Origins of Kumbh Mela
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem', lineHeight: '1.8', fontSize: '0.9rem' }}>
            The Kumbh Mela is the world's largest peaceful gathering — a pilgrimage celebrated at four sacred river sites every 12 years. 
            Nashik's Simhastha Kumbh is uniquely held on the banks of the holy <strong style={{ color: '#fff' }}>Godavari River</strong>, 
            considered the "Ganga of the South." The Amrit Snan (royal bath) dates are calculated by precise astrological alignments 
            of Jupiter, the Sun, and the Moon.
          </p>
        </div>
        <div className="glass-card">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Star size={20} className="text-warning" /> Astrological Significance
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem', lineHeight: '1.8', fontSize: '0.9rem' }}>
            When <strong style={{ color: '#fff' }}>Jupiter (Brihaspati) enters Leo (Simha)</strong> and the Sun-Moon are in Cancer (Karka), 
            the Nashik Kumbh is declared. This is why it is called <strong style={{ color: '#F59E0B' }}>Simhastha Kumbh Mela</strong>. 
            Ancient scriptures say drops of the nectar of immortality (Amrita) fell at Ramkund during the cosmic Samudra Manthan — 
            bathing here during Snan dates is believed to wash away all sins.
          </p>
        </div>
        <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={20} className="text-success" /> Key Locations
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            {[
              { name: 'Ramkund', desc: 'Primary bathing ghat on Godavari. Most sacred spot — tens of millions bathe here on Snan dates.', icon: '🌊', img: null },
              { name: 'Kushavarta Kund', desc: "Sacred kund at Trimbakeshwar — believed to be the origin of Godavari River.", icon: '💧', img: '/images/kushavarta.jpg' },
              { name: 'Trimbakeshwar', desc: 'Ancient Jyotirlinga temple. One of the 12 holiest Shiva temples in India.', icon: '🛕', img: '/images/trimbakeshwar.jpg' },
              { name: 'Panchavati', desc: "Historical site from Ramayana. Lord Ram, Sita & Lakshman's forest exile location.", icon: '🌳', img: null },
            ].map(loc => (
              <div key={loc.name} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', overflow: 'hidden', padding: loc.img ? '0' : '1rem' }}>
                {loc.img ? (
                  <div style={{ height: '160px', overflow: 'hidden' }}>
                    <img src={loc.img} alt={loc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ) : (
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{loc.icon}</div>
                )}
                <div style={{ padding: loc.img ? '1.25rem' : '0', marginTop: loc.img ? '0' : '0.5rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--accent-color)', marginBottom: '0.35rem' }}>{loc.name}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{loc.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Travel Guide ── */}
      <div className="glass-card" style={{ marginTop: '2.5rem' }}>
        <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          <Navigation size={24} className="text-primary" /> Simhastha Kumbh Mela Travel Guide
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>How to Reach Nashik & Trimbakeshwar – Flights, Trains, Buses and Local Transport Guide.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
           {[
             { title: 'Arriving by Air', icon: '✈️', desc: 'Nearest airports: Nashik (Ozar), Mumbai (Chhatrapati Shivaji), Pune.' },
             { title: 'Arriving by Train', icon: '🚆', desc: 'Nashik Road Railway Station is the main entry point on the Central Railway network.' },
             { title: 'Arriving by Bus', icon: '🚌', desc: 'Well connected via state buses to Mumbai, Pune, and major cities.' },
             { title: 'Arriving by Car', icon: '🚗', desc: 'Accessible via Mumbai-Agra Highway (NH3) and Nashik-Pune Highway (NH50).' },
           ].map(t => (
             <div key={t.title} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', padding: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
               <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{t.icon}</div>
               <div style={{ fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>{t.title}</div>
               <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{t.desc}</div>
             </div>
           ))}
        </div>

        <h4 style={{ color: 'var(--accent-color)', marginBottom: '1rem', fontSize: '1.1rem' }}>Know where you are standing before you move:</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          {[
            { name: 'Nashik Road Railway Station', tag: 'Entry Point', desc: 'The entry point for train travelers. (10km from City).' },
            { name: 'New CBS (Thakkar Bazar)', tag: 'Main Bus Hub', desc: 'The MAIN HUB for Trimbakeshwar Buses. Located in the city center.' },
            { name: 'Panchavati (Ramkund)', tag: 'Spiritual Center', desc: 'The spiritual center (Ghats). (10 KM Away From the Station).' },
            { name: 'Trimbakeshwar', tag: 'Jyotirlinga Town', desc: 'The Jyotirlinga town. (30km away from Nashik City).' },
          ].map(loc => (
            <div key={loc.name} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', background: 'rgba(15,23,42,0.4)', padding: '1.25rem', borderRadius: '0.75rem' }}>
              <div style={{ background: 'var(--primary-color)', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>📍</div>
              <div>
                <div style={{ fontWeight: 700, color: '#fff' }}>{loc.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--warning-color)', textTransform: 'uppercase', fontWeight: 600, margin: '0.2rem 0' }}>{loc.tag}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{loc.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer Banner ── */}
      <div style={{ marginTop: '2.5rem', borderRadius: '1rem', overflow: 'hidden' }}>
        <img src="/images/panchavati_banner.png" alt="Panchavati" style={{ width: '100%', height: 'auto', display: 'block' }} />
      </div>

    </div>
  );
}
