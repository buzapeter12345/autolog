import React, { useState } from 'react';
import { 
  Wrench, Droplet, Gauge, Calendar, ShieldCheck, Plus, FileText, 
  FileSpreadsheet, Edit3, TrendingUp, AlertCircle, ArrowUpRight 
} from 'lucide-react';

export default function CarDashboard({ 
  vehicle, 
  services, 
  fluids, 
  mileage, 
  reminders, 
  onOpenAddService, 
  onOpenAddFluid, 
  onOpenAddMileage, 
  onExportPdf, 
  onExportCsv,
  onOpenEditVehicle,
  setActiveTab
}) {
  if (!vehicle) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Még nincs felvéve autó a garázsodba</h2>
        <p className="text-muted" style={{ margin: '0.5rem 0 1.5rem 0' }}>
          Vegyél fel egy új autót a szervizkönyv elindításához, a km állások és a javítások nyomon követéséhez!
        </p>
        <button className="btn btn-primary" onClick={onOpenEditVehicle}>
          <Plus size={18} /> Új Autó Felvétele
        </button>
      </div>
    );
  }

  // Calculate totals
  const totalServiceCost = services.reduce((sum, s) => sum + (Number(s.cost) || 0), 0);
  const totalFluidCost = fluids.reduce((sum, f) => sum + (Number(f.cost) || 0), 0);
  const grandTotalCost = totalServiceCost + totalFluidCost;

  const latestService = services.length > 0 ? services[0] : null;
  const nextReminder = reminders.length > 0 ? reminders[0] : null;

  const initialKm = vehicle.initialMileage || 0;
  const currentKm = vehicle.currentMileage || 0;
  const kmDriven = Math.max(0, currentKm - initialKm);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Hero Car Banner Card */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden', position: 'relative' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr', 
          minHeight: '220px'
        }}>
          {vehicle.imageUrl && (
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              maxWidth: '550px',
              backgroundImage: `linear-gradient(to right, #151c28 5%, transparent 60%), url(${vehicle.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.35,
              pointerEvents: 'none'
            }} />
          )}

          <div style={{ padding: '1.5rem', zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                <span className="license-plate">{vehicle.licensePlate}</span>
                <span className="badge badge-primary">{vehicle.fuelType}</span>
                <span className="badge badge-blue">{vehicle.year}</span>
                <button 
                  className="btn btn-secondary btn-sm" 
                  style={{ marginLeft: 'auto', padding: '0.3rem 0.6rem' }}
                  onClick={onOpenEditVehicle}
                  title="Autó adatainak szerkesztése"
                >
                  <Edit3 size={14} /> Szerkesztés
                </button>
              </div>

              <h1 style={{ fontSize: '1.8rem', margin: '0.2rem 0' }}>
                {vehicle.make} {vehicle.model}
              </h1>

              <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <div><strong>VIN:</strong> <code style={{ color: 'var(--text-main)' }}>{vehicle.vin || 'Nincs megadva'}</code></div>
                <div><strong>Motorkód:</strong> <span style={{ color: 'var(--text-main)' }}>{vehicle.engineCode || 'N/A'}</span></div>
              </div>
            </div>

            {/* Quick KM Counter Bar */}
            <div style={{ 
              marginTop: '1.25rem', 
              padding: '0.85rem 1.25rem', 
              background: 'rgba(15, 23, 42, 0.85)', 
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Gauge size={22} color="var(--primary)" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Aktuális Kilométeróra Állás</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
                    {currentKm.toLocaleString('hu-HU')} <span style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>km</span>
                  </div>
                </div>
              </div>

              <button className="btn btn-primary btn-sm" onClick={onOpenAddMileage}>
                <Plus size={14} /> KM rögzítése
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid-4">
        <button className="btn btn-primary btn-full" onClick={onOpenAddService} style={{ padding: '0.85rem 1rem' }}>
          <Wrench size={18} /> Új Szerviz
        </button>
        <button className="btn btn-accent btn-full" onClick={onOpenAddFluid} style={{ padding: '0.85rem 1rem' }}>
          <Droplet size={18} /> Folyadék Töltés
        </button>
        <button className="btn btn-secondary btn-full" onClick={onExportPdf} style={{ padding: '0.85rem 1rem' }}>
          <FileText size={18} /> PDF Szervizkönyv
        </button>
        <button className="btn btn-secondary btn-full" onClick={onExportCsv} style={{ padding: '0.85rem 1rem' }}>
          <FileSpreadsheet size={18} /> CSV Táblázat
        </button>
      </div>

      {/* Key Metric Stats Cards */}
      <div className="grid-4">
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ÖSSZES SZERVIZKÖLTSÉG</div>
            <span className="badge badge-primary"><TrendingUp size={12} /> Σ</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.4rem 0 0.1rem 0', fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
            {grandTotalCost.toLocaleString('hu-HU')} Ft
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Szerviz: {totalServiceCost.toLocaleString('hu-HU')} Ft | Folyadék: {totalFluidCost.toLocaleString('hu-HU')} Ft
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>MEGTETT KILOMÉTEREK</div>
            <span className="badge badge-blue"><Gauge size={12} /> Napló</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.4rem 0 0.1rem 0', fontFamily: 'var(--font-heading)' }}>
            +{kmDriven.toLocaleString('hu-HU')} km
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Kezdő állás óta ({initialKm.toLocaleString('hu-HU')} km)
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>UTOLSÓ SZERVIZ</div>
            <span className="badge badge-success"><Wrench size={12} /> Kész</span>
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0.4rem 0 0.1rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {latestService ? latestService.category : 'Nincs bejegyzés'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            {latestService ? `${latestService.date} (${latestService.mileage} km)` : 'Még nem volt szerviz rögzítve'}
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>KÖVETKEZŐ ESEMÉNY</div>
            <span className="badge badge-warning"><Calendar size={12} /> Infó</span>
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0.4rem 0 0.1rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {nextReminder ? nextReminder.title : 'Nincs emlékeztető'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            {nextReminder ? `Esedékes: ${nextReminder.dueDate}` : 'Adjon hozzá emlékeztetőt'}
          </div>
        </div>
      </div>

      {/* Recent Activity Log Section */}
      <div className="glass-card">
        <div className="flex-between" style={{ marginBottom: '1rem' }}>
          <h3>Legutóbbi Bejegyzések</h3>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('services')}>
            Összes Szerviz <ArrowUpRight size={14} />
          </button>
        </div>

        {services.length === 0 && fluids.length === 0 ? (
          <p className="text-muted" style={{ padding: '1rem 0' }}>Még nincs felvéve szerviz vagy folyadék bejegyzés.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {services.slice(0, 4).map(s => (
              <div 
                key={s.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem', 
                  background: 'rgba(15, 23, 42, 0.5)', 
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ padding: '0.5rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-sm)', color: 'var(--primary)' }}>
                    <Wrench size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{s.category}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {s.description} ({s.workshopName || 'Saját szerviz'})
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
                    {Number(s.cost).toLocaleString('hu-HU')} Ft
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    {s.date} • {s.mileage} km
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
