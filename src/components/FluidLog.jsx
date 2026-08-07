import React, { useState } from 'react';
import { Droplet, Plus, Trash2, Shield, Info } from 'lucide-react';

const FLUID_TYPES = [
  'Motorolaj',
  'Hűtőfolyadék',
  'Fékfolyadék',
  'Szélvédőmosó',
  'AdBlue',
  'Váltóolaj',
  'Szervóolaj'
];

export default function FluidLog({ fluids, onAddFluid, onDeleteFluid }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [mileage, setMileage] = useState('');
  const [fluidType, setFluidType] = useState('Motorolaj');
  const [volumeLiters, setVolumeLiters] = useState('');
  const [specGrade, setSpecGrade] = useState('');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');

  const totalFluidSpend = fluids.reduce((sum, f) => sum + (Number(f.cost) || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fluidType || !volumeLiters) {
      alert('Kérjük adja meg a folyadék típusát és a betöltött mennyiséget!');
      return;
    }

    onAddFluid({
      date,
      mileage: Number(mileage) || 0,
      fluidType,
      volumeLiters: Number(volumeLiters),
      specGrade,
      cost: Number(cost) || 0,
      notes
    });

    setIsModalOpen(false);
    // Reset form
    setVolumeLiters('');
    setSpecGrade('');
    setCost('');
    setNotes('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Header */}
      <div className="glass-card">
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Droplet color="var(--accent-blue)" /> Folyadék Utántöltések Naplója
            </h2>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>
              Motorolaj, hűtőfolyadék, fékfolyadék, szélvédőmosó és AdBlue feltöltések vezetése
            </p>
          </div>

          <button className="btn btn-accent" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Folyadék Töltés Felvétele
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.25rem' }}>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Rögzített feltöltések száma: <strong>{fluids.length} db</strong>
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-blue)', fontFamily: 'var(--font-heading)' }}>
          Összesen: {totalFluidSpend.toLocaleString('hu-HU')} Ft
        </div>
      </div>

      {/* Fluid Entries List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {fluids.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
            <p className="text-muted">Nincs még folyadék utántöltés rögzítve.</p>
          </div>
        ) : (
          fluids.map(f => (
            <div key={f.id} className="glass-card">
              <div className="flex-between" style={{ flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="badge badge-blue">{f.fluidType}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{f.date}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontWeight: 800, color: 'var(--accent-blue)', fontSize: '1.1rem' }}>
                    {f.cost ? `${Number(f.cost).toLocaleString('hu-HU')} Ft` : '0 Ft'}
                  </div>

                  <button className="modal-close" onClick={() => onDeleteFluid(f.id)} title="Törlés">
                    <Trash2 size={16} color="var(--danger)" />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', margin: '0.4rem 0' }}>
                <div><strong>Mennyiség:</strong> <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{f.volumeLiters} Liter</span></div>
                {f.specGrade && <div><strong>Viszkozitás / Specifikáció:</strong> <code>{f.specGrade}</code></div>}
                {f.mileage > 0 && <div><strong>KM állás:</strong> {f.mileage} km</div>}
              </div>

              {f.notes && (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'rgba(15,23,42,0.4)', padding: '0.4rem 0.6rem', borderRadius: '4px', marginTop: '0.4rem' }}>
                  <Info size={12} style={{ display: 'inline', marginRight: '0.3rem' }} />
                  {f.notes}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Folyadék Utántöltés Rögzítése</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-row form-row-2">
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
                    placeholder="pl. 184500"
                    value={mileage}
                    onChange={(e) => setMileage(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row form-row-2">
                <div className="form-group">
                  <label>Folyadék Típusa</label>
                  <select 
                    className="form-control"
                    value={fluidType}
                    onChange={(e) => setFluidType(e.target.value)}
                  >
                    {FLUID_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Betöltött Mennyiség (Liter)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    className="form-control" 
                    placeholder="pl. 0.5 vagy 4.5"
                    value={volumeLiters}
                    onChange={(e) => setVolumeLiters(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row form-row-2">
                <div className="form-group">
                  <label>Folyadék Specifikáció / Viszkozitás</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="pl. Castrol 5W-30 LL (VW 507 00) vagy DOT4"
                    value={specGrade}
                    onChange={(e) => setSpecGrade(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Költség (Ft)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="pl. 3800"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Megjegyzés (opcionális)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="pl. Nívópálca jelzésig feltöltve"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="submit" className="btn btn-accent btn-full">Mentés</button>
                <button type="button" className="btn btn-secondary btn-full" onClick={() => setIsModalOpen(false)}>Mégse</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
