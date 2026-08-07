import React, { useState } from 'react';
import { Wrench, Plus, Trash2, ShieldCheck, Filter, Search, Tag, DollarSign } from 'lucide-react';

const CATEGORIES = [
  'Mind',
  'Rendszeres karbantartás',
  'Motor & Vezérlés',
  'Fékrendszer',
  'Futómű & Kormányzás',
  'Klíma & Hűtés',
  'Elektromosság',
  'Gumiabroncs & Kerék',
  'Karosszéria & Fényezés',
  'Egyéb'
];

export default function ServiceLog({ services, onAddService, onDeleteService }) {
  const [selectedCategory, setSelectedCategory] = useState('Mind');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [mileage, setMileage] = useState('');
  const [category, setCategory] = useState('Rendszeres karbantartás');
  const [description, setDescription] = useState('');
  const [partsReplaced, setPartsReplaced] = useState('');
  const [workshopName, setWorkshopName] = useState('');
  const [cost, setCost] = useState('');
  const [isWarranty, setIsWarranty] = useState(false);

  const filteredServices = services.filter(s => {
    const matchesCategory = selectedCategory === 'Mind' || s.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      (s.description && s.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.partsReplaced && s.partsReplaced.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.workshopName && s.workshopName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const totalFilteredCost = filteredServices.reduce((sum, s) => sum + (Number(s.cost) || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mileage || !description) {
      alert('Kérjük adja meg a kilométeróra állást és a szerviz leírását!');
      return;
    }

    onAddService({
      date,
      mileage: Number(mileage),
      category,
      description,
      partsReplaced,
      workshopName,
      cost: Number(cost) || 0,
      isWarranty
    });

    setIsModalOpen(false);
    // Reset form
    setMileage('');
    setDescription('');
    setPartsReplaced('');
    setWorkshopName('');
    setCost('');
    setIsWarranty(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Header & Controls */}
      <div className="glass-card">
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wrench color="var(--primary)" /> Szerviz & Javítási Napló
            </h2>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>
              Az autó összes elvégzett karbantartása, alkatrészcseréje és szerelési költsége
            </p>
          </div>

          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Új Szerviz Bejegyzés
          </button>
        </div>

        {/* Filter bar */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <input 
              type="text" 
              className="form-control"
              placeholder="Keresés leírás, alkatrész vagy szerviz alapján..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.4rem' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>

          <select 
            className="form-control" 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ width: 'auto', minWidth: '180px' }}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cost Card */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.25rem' }}>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Kiválasztott bejegyzések ({filteredServices.length} db):
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
          Összesen: {totalFilteredCost.toLocaleString('hu-HU')} Ft
        </div>
      </div>

      {/* Services List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {filteredServices.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
            <p className="text-muted">Nincs a szűrésnek megfelelő szerviz bejegyzés.</p>
          </div>
        ) : (
          filteredServices.map((s, index) => (
            <div key={s.id || `service-${index}`} className="glass-card" style={{ position: 'relative' }}>
              <div className="flex-between" style={{ flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="badge badge-primary">{s.category}</span>
                  {s.isWarranty && (
                    <span className="badge badge-success"><ShieldCheck size={12} /> Garanciális</span>
                  )}
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{s.date}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                    {Number(s.cost).toLocaleString('hu-HU')} Ft
                  </div>

                  <button 
                    className="modal-close" 
                    onClick={() => onDeleteService(s.id)}
                    title="Bejegyzés törlése"
                  >
                    <Trash2 size={16} color="var(--danger)" />
                  </button>
                </div>
              </div>

              <h3 style={{ fontSize: '1.1rem', margin: '0.4rem 0' }}>{s.description}</h3>

              {s.partsReplaced && (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.4rem', background: 'rgba(15, 23, 42, 0.4)', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                  <strong>Cserélt alkatrészek:</strong> {s.partsReplaced}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <div>Szerelő / Szerviz: <strong style={{ color: 'var(--text-main)' }}>{s.workshopName || 'Saját karbantartás'}</strong></div>
                <div>KM állás: <strong style={{ color: 'var(--text-main)' }}>{s.mileage ? `${s.mileage} km` : '-'}</strong></div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Service Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Új Szerviz Bejegyzés Felvétele</h3>
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
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Karbantartási Kategória</label>
                <select 
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.filter(c => c !== 'Mind').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Részletes Leírás / Elvégzett Munkák</label>
                <textarea 
                  className="form-control" 
                  rows="3"
                  placeholder="pl. Motorolaj és olajszűrő cseréje, vezérműszíj ellenőrzése..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Cserélt Alkatrészek & Cikkszámok (opcionális)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="pl. Castrol 5W30 5L, Mann Filter szűrők"
                  value={partsReplaced}
                  onChange={(e) => setPartsReplaced(e.target.value)}
                />
              </div>

              <div className="form-row form-row-2">
                <div className="form-group">
                  <label>Szerviz / Szerelő Neve</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="pl. VW Márkaszerviz"
                    value={workshopName}
                    onChange={(e) => setWorkshopName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Munkadíj & Alkatrész Költség (Ft)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="pl. 75000"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  id="warranty"
                  checked={isWarranty}
                  onChange={(e) => setIsWarranty(e.target.checked)}
                />
                <label htmlFor="warranty" style={{ margin: 0, cursor: 'pointer' }}>
                  Garanciális javítás / Szakszerviz garancia vonatkozik rá
                </label>
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
