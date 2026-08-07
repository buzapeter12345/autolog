import React, { useState } from 'react';
import { Bell, Plus, Trash2, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function Reminders({ vehicle, reminders, onAddReminder, onDeleteReminder }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueMileage, setDueMileage] = useState('');
  const [type, setType] = useState('Kötelező Szerviz');

  const today = new Date();

  const getDaysRemaining = (targetDateStr) => {
    if (!targetDateStr) return null;
    const target = new Date(targetDateStr);
    const diffTime = target - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !dueDate) {
      alert('Kérjük adja meg az emlékeztető megnevezését és a lejárati dátumot!');
      return;
    }

    onAddReminder({
      title,
      dueDate,
      dueMileage: Number(dueMileage) || 0,
      type,
      status: 'pending'
    });

    setIsModalOpen(false);
    setTitle('');
    setDueDate('');
    setDueMileage('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Header */}
      <div className="glass-card">
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell color="var(--warning)" /> Karbantartási Emlékeztetők & Műszaki Vizsga
            </h2>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>
              Közelgő műszaki vizsga lejàrat, olajcsere esedékesség és alkatrész-csere időpontok
            </p>
          </div>

          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Új Emlékeztető
          </button>
        </div>
      </div>

      {/* Reminders Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {reminders.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
            <p className="text-muted">Nincs rögzített emlékeztető.</p>
          </div>
        ) : (
          reminders.map((r, idx) => {
            const daysLeft = getDaysRemaining(r.dueDate);
            let badgeClass = 'badge-success';
            let iconColor = 'var(--success)';
            let statusText = `${daysLeft} nap van hátra`;

            if (daysLeft !== null && daysLeft <= 0) {
              badgeClass = 'badge-warning';
              iconColor = 'var(--danger)';
              statusText = 'LEJÁRT!';
            } else if (daysLeft !== null && daysLeft <= 30) {
              badgeClass = 'badge-warning';
              iconColor = 'var(--warning)';
              statusText = `Közelgő: ${daysLeft} nap!`;
            }

            return (
              <div key={r.id || `reminder-${idx}`} className="glass-card">
                <div className="flex-between" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ padding: '0.5rem', background: 'rgba(249, 115, 22, 0.15)', borderRadius: 'var(--radius-sm)', color: iconColor }}>
                      <Clock size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{r.title}</h3>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Típus: <strong>{r.type}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className={`badge ${badgeClass}`} style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
                      {statusText}
                    </span>

                    <button className="modal-close" onClick={() => onDeleteReminder(r.id)} title="Törlés">
                      <Trash2 size={16} color="var(--danger)" />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                  <div>Esedékesség dátuma: <strong style={{ color: 'var(--text-main)' }}>{r.dueDate}</strong></div>
                  {r.dueMileage > 0 && (
                    <div>Esedékesség km állása: <strong style={{ color: 'var(--text-main)' }}>{r.dueMileage.toLocaleString('hu-HU')} km</strong></div>
                  )}
                  {vehicle && r.dueMileage > 0 && (
                    <div>Hátralévő km: <strong style={{ color: 'var(--primary)' }}>{Math.max(0, r.dueMileage - vehicle.currentMileage).toLocaleString('hu-HU')} km</strong></div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Új Emlékeztető Felvétele</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Emlékeztető Megnevezése</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="pl. Műszaki vizsga lejárata vagy Vezérléscsere"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-row form-row-2">
                <div className="form-group">
                  <label>Emlékeztető Típusa</label>
                  <select 
                    className="form-control"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="Műszaki vizsga">Műszaki vizsga</option>
                    <option value="Olajcsere">Olajcsere</option>
                    <option value="Fékrendszer">Fékrendszer</option>
                    <option value="Vezérléscsere">Vezérléscsere</option>
                    <option value="Biztosítás lejárata">Biztosítás lejárata</option>
                    <option value="Kötelező Szerviz">Kötelező Szerviz</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Esedékesség Dátuma</label>
                  <input 
                    type="date" 
                    className="form-control"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Esedékesség Kilométeróra Állása (opcionális)</label>
                <input 
                  type="number" 
                  className="form-control"
                  placeholder="pl. 195000"
                  value={dueMileage}
                  onChange={(e) => setDueMileage(e.target.value)}
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
