import React from 'react';
import { Car, Plus, FileSpreadsheet, FileText, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { logoutUser } from '../firebase/config';

export default function Navbar({ 
  vehicles, 
  activeVehicleId, 
  onSelectVehicle, 
  onOpenGarageModal, 
  onOpenAuthModal,
  currentUser,
  onExportPdf,
  onExportCsv,
  activeTab,
  setActiveTab
}) {
  return (
    <header className="app-header">
      <div className="container header-content">
        {/* Brand Logo */}
        <div className="brand-logo" onClick={() => setActiveTab('dashboard')} style={{ cursor: 'pointer' }}>
          <Car size={26} />
          <span>Auto<span>Log</span></span>
          <span className="badge badge-primary" style={{ fontSize: '0.65rem', marginLeft: '0.2rem' }}>
            PRO
          </span>
        </div>

        {/* Vehicle Dropdown Selector */}
        {vehicles.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <select 
              className="form-control" 
              value={activeVehicleId}
              onChange={(e) => onSelectVehicle(e.target.value)}
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.875rem', width: 'auto', fontWeight: '600' }}
            >
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>
                  {v.make} {v.model} ({v.licensePlate})
                </option>
              ))}
            </select>

            <button 
              className="btn btn-secondary btn-sm" 
              onClick={onOpenGarageModal}
              title="Új autó hozzáadása"
            >
              <Plus size={16} />
            </button>
          </div>
        )}

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <button 
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Áttekintés
          </button>
          <button 
            className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            Szervizkönyv
          </button>
          <button 
            className={`tab-btn ${activeTab === 'fluids' ? 'active' : ''}`}
            onClick={() => setActiveTab('fluids')}
          >
            Folyadékok
          </button>
          <button 
            className={`tab-btn ${activeTab === 'mileage' ? 'active' : ''}`}
            onClick={() => setActiveTab('mileage')}
          >
            KM Állás
          </button>
          <button 
            className={`tab-btn ${activeTab === 'reminders' ? 'active' : ''}`}
            onClick={() => setActiveTab('reminders')}
          >
            Emlékeztetők
          </button>
        </nav>

        {/* User Auth Profile & Export Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          
          {/* User Auth Button / Profile Badge */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
              <ShieldCheck size={16} color="var(--success)" />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser.displayName || currentUser.email?.split('@')[0] || 'Felhasználó'}
              </span>
              <button 
                className="modal-close" 
                onClick={() => logoutUser()} 
                title="Kijelentkezés"
                style={{ padding: '2px', marginLeft: '2px' }}
              >
                <LogOut size={14} color="var(--danger)" />
              </button>
            </div>
          ) : (
            <button 
              className="btn btn-secondary btn-sm"
              onClick={onOpenAuthModal}
              title="Biztonságos Bejelentkezés / Regisztráció"
              style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
            >
              <LogIn size={15} />
              <span style={{ fontSize: '0.8rem' }}>Belépés</span>
            </button>
          )}

          <button 
            className="btn btn-primary btn-sm"
            onClick={onExportPdf}
            title="Digitális Szervizkönyv Letöltése PDF-ben"
          >
            <FileText size={16} />
          </button>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={onExportCsv}
            title="Kiexportálás CSV táblázatba"
          >
            <FileSpreadsheet size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
