import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom coloured circle-marker icons
const colorIcon = (color) => L.divIcon({
  className: '',
  html: `<div style="
    width:14px;height:14px;border-radius:50%;
    background:${color};border:2px solid #fff;
    box-shadow:0 0 6px ${color};
  "></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

// Zone markers  [lat, lng, label, color, detail]
const zones = [
  // Crowd hot-spots / key ghats
  { pos: [20.0059, 73.7902], label: "Ramkund Ghat",           color: "#EF4444", detail: "Zone A • HIGH density • 9.2L pilgrims today" },
  { pos: [20.0140, 73.7955], label: "Panchavati",             color: "#F59E0B", detail: "Zone C • MEDIUM density • Religious precinct" },
  { pos: [20.0032, 73.7875], label: "Tapovan Ghat",           color: "#10B981", detail: "Zone D • LOW density • 2.7L pilgrims today" },
  { pos: [20.0095, 73.7830], label: "Ahilya Devi Ghat",       color: "#10B981", detail: "Zone F • Clean WQI 74.2 • Monitoring active" },
  { pos: [20.0020, 73.7960], label: "Godavari Sangam",        color: "#EF4444", detail: "Zone F • Sinhasta snan peak • 13.8L pilgrims" },
  // Temples / Religious sites
  { pos: [19.9304, 73.5303], label: "Trimbakeshwar Temple",   color: "#8B5CF6", detail: "Sacred origin of Godavari • 5.8L visitors today" },
  { pos: [20.0200, 73.7780], label: "Kalaram Temple",         color: "#8B5CF6", detail: "Historic black-stone Ram temple • Darshan queue: 2h" },
  // Medical
  { pos: [19.9975, 73.7898], label: "Civil Hospital Nashik",  color: "#3B82F6", detail: "Zone A Medical Hub • 28 Doctors • 0 ICU beds free ⚠️" },
  { pos: [20.0180, 73.7840], label: "Panchavati PHC",         color: "#3B82F6", detail: "Zone C Medical • 8 Doctors • 4 Ambulances" },
  // Safety checkpoints
  { pos: [20.0072, 73.7920], label: "CP: Ramkund Main Gate",  color: "#F97316", detail: "85 Officers • Gate OPEN • HIGH density alert" },
  { pos: [20.0155, 73.7962], label: "CP: Panchavati Crossing",color: "#F97316", detail: "45 Officers • Partial barricade • Repair underway" },
  { pos: [20.0001, 73.7810], label: "CP: Tapovan Bridge",     color: "#6B7280", detail: "30 Officers • Gate CLOSED for inspection" },
];

export default function MapWidget() {
  const center = [20.0059, 73.7902];

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '0.5rem', overflow: 'hidden', position: 'relative' }}>
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* Crowd heatmap circles for high-density zones */}
        <Circle center={[20.0059, 73.7902]} pathOptions={{ fillColor: '#EF4444', color: '#EF4444', fillOpacity: 0.25 }} radius={600}>
          <Popup><strong>Ramkund Ghat</strong><br/>⚠️ HIGH crowd density — 9.2L pilgrims</Popup>
        </Circle>
        <Circle center={[20.0020, 73.7960]} pathOptions={{ fillColor: '#EF4444', color: '#EF4444', fillOpacity: 0.18 }} radius={450}>
          <Popup><strong>Godavari Sangam</strong><br/>⚠️ HIGH crowd density — 13.8L pilgrims (Sinhasta peak)</Popup>
        </Circle>
        <Circle center={[20.0140, 73.7955]} pathOptions={{ fillColor: '#F59E0B', color: '#F59E0B', fillOpacity: 0.18 }} radius={350}>
          <Popup><strong>Panchavati</strong><br/>🟡 MEDIUM crowd density</Popup>
        </Circle>

        {/* Zone markers */}
        {zones.map((z, i) => (
          <Marker key={i} position={z.pos} icon={colorIcon(z.color)}>
            <Popup>
              <div style={{ minWidth: '180px' }}>
                <strong style={{ color: z.color }}>{z.label}</strong>
                <br /><span style={{ fontSize: '0.85em', lineHeight: 1.5 }}>{z.detail}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div style={{
        position: 'absolute', bottom: '10px', left: '10px', zIndex: 1000,
        background: 'rgba(15,15,30,0.88)', backdropFilter: 'blur(6px)',
        borderRadius: '0.5rem', padding: '0.5rem 0.75rem',
        fontSize: '0.72rem', color: '#ccc', lineHeight: 1.8,
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div><span style={{ color: '#EF4444' }}>●</span> High Density / Alert</div>
        <div><span style={{ color: '#F59E0B' }}>●</span> Medium Density</div>
        <div><span style={{ color: '#10B981' }}>●</span> Normal / Ghat</div>
        <div><span style={{ color: '#8B5CF6' }}>●</span> Temple / Religious</div>
        <div><span style={{ color: '#3B82F6' }}>●</span> Medical Facility</div>
        <div><span style={{ color: '#F97316' }}>●</span> Safety Checkpoint</div>
      </div>
    </div>
  );
}
