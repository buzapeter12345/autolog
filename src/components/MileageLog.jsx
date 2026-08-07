import React, { useState } from 'react';
import { Gauge, Plus, Trash2, TrendingUp, Calendar } from 'lucide-react';

export default function MileageLog({ vehicle, mileage, onAddMileage, onDeleteMileage }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [km, setKm] = useState('');
  const [notes, setNotes] = useState('');

  const sortedMileage = [...mileage].sort((a, b) => new Date(b.date) - new Date(a.date));

  const currentKm = vehicle?.currentMileage || 0;
  const initialKm = vehicle?.initialMileage || 0;
  const totalDriven = Math.max(0, currentKm - initialKm);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!km) {
      alert('Kérjük adja meg a kilométeróra állást!');
      return;
    }

    onAddMileage({
      date,
      mileage: Number(km),
      notes
    });

    setIsModalOpen(false);
    setKm('');
    setNotes('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Header */}
      <div className="glass-card">
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Gauge color="var(--primary)" /> Kilométeróra Állás Napló
            </h2>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>
              Kövesd nyomon az autó futásteljesítményének alakulását időrendben
            </p>
          </div>

          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Új KM Állás Rögzítése
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid-3">
        <div className="glass-card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>JELENLEGI KM ÁLLÁS</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)', margin: '0.2rem 0' }}>
            {currentKm.toLocaleString('hu-HU')} km
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Garázsban tárolt legmagasabb érték</div>
        </div>

        <div className="glass-card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>KEZDŐ KM ÁLLÁS</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-heading)', margin: '0.2rem 0' }}>
            {initialKm.toLocaleString('hu-HU')} km
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Autó felvételekor megadott kezdőérték</div>
        </div>

        <div className="glass-card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ÖSSZES MEGTETT TÁVOLSÁG</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--success)', fontFamily: 'var(--font-heading)', margin: '0.2rem 0' }}>
            +{totalDriven.toLocaleString('hu-HU')} km
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Naplózott futásteljesítmény</div>
        </div>
      </div>

      {/* Visual Mileage Progression Chart */}
      {sortedMileage.length > 1 && (
        <div className="glass-card">
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <TrendingUp size={16} color="var(--primary)" /> Futásteljesítmény Alakulása
          </h3>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', height: '140px', padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }}>
            {[...sortedMileage].reverse().map((entry, index) => {
              const maxVal = Math.max(...sortedMileage.map(m => Number(m.mileage)));
              const minVal = Math.min(...sortedMileage.map(m => Number(m.mileage)));
              const range = Math.max(1, maxVal - minVal);
              const heightPercent = Math.max(20, Math.min(100, ((entry.mileage - minVal) / range) * 80 + 20));

              return (
                <div key={entry.id || index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700 }}>
                    {Math.round(entry.mileage / 1000)}k
                  </div>
                  <div style={{
                    width: '100%',
                    maxWidth: '36px',
                    height: `${heightPercent}%`,
                    background: 'linear-gradient(to top, rgba(234, 179, 8, 0.2), rgba(234, 179, 8, 0.8))',
                    borderRadius: '4px 4px 0 0',
                    transition: 'all 0.3s ease'
                  }} />
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                    {entry.date.slice(5)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mileage Table List */}
      <div className="glass-card">
        <h3 style={{ marginBottom: '1rem' }}>Rögzített Bejegyzések</h3>

        {sortedMileage.length === 0 ? (
          <p className="text-muted">Nincs rögzített kilométeróra állás.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {sortedMileage.map(m => (
              <div 
                key={m.id}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem', 
                  background: 'rgba(15, 23, 42, 0.5)', 
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>
                    {Number(m.mileage).toLocaleString('hu-HU')} <span style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>km</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{m.date}</div>
                  {m.notes && <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>• {m.notes}</div>}
                </div>

                <button className="modal-close" onClick={() => onDeleteMileage(m.id)} title="Törlés">
                  <Trash2 size={16} color="var(--danger)" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Új KM Állás Rögzítése</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Dátum</label>
                <input 
                  type="date" 
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Kilométeróra Állás (km)</label>
                <input 
                  type="number" 
                  className="form-control"
                  placeholder={`Legutóbbi: ${currentKm} km`}
                  value={km}
                  onChange={(e) => setKm(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Megjegyzés (opcionális)</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="pl. Tankoláskor vagy utazás előtt"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="submit" className="btn btn-primary btn-full">Mentés</button>
                <button type="button" className="btn btn-secondary btn-full" onClick={() => setIsModalOpen(false)}>Mégse</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
