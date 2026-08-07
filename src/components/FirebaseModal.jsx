import React, { useState } from 'react';
import { Database, ShieldCheck, RefreshCw, Server, AlertCircle } from 'lucide-react';
import { isFirebaseActive, getStoredFirebaseConfig, saveFirebaseConfig, clearFirebaseConfig } from '../firebase/config';
import { resetToDemoData } from '../utils/storage';

export default function FirebaseModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const stored = getStoredFirebaseConfig() || {};
  const [apiKey, setApiKey] = useState(stored.apiKey || '');
  const [authDomain, setAuthDomain] = useState(stored.authDomain || '');
  const [projectId, setProjectId] = useState(stored.projectId || '');
  const [storageBucket, setStorageBucket] = useState(stored.storageBucket || '');

  const handleSave = (e) => {
    e.preventDefault();
    if (!apiKey || !projectId) {
      alert('Kérjük adja meg legalább az API Key-t és a Project ID-t!');
      return;
    }

    saveFirebaseConfig({
      apiKey,
      authDomain,
      projectId,
      storageBucket
    });
  };

  const handleClear = () => {
    if (confirm('Eltávolítja a saját Firebase kulcsokat és visszatér a helyi adattárolóhoz?')) {
      clearFirebaseConfig();
    }
  };

  const handleResetDemo = () => {
    if (confirm('Alaphelyzetbe állítja az alkalmazást a beépített magyar mintaadatokkal (VW Passat + BMW 320i)?')) {
      resetToDemoData();
      window.location.reload();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>
            <Database style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle' }} color="var(--primary)" />
            Google Firebase Backend Beállítások
          </h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Active status indicator */}
        <div className="glass-card" style={{ marginBottom: '1.25rem', background: isFirebaseActive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {isFirebaseActive ? (
              <ShieldCheck color="var(--success)" size={24} />
            ) : (
              <Server color="var(--primary)" size={24} />
            )}
            <div>
              <div style={{ fontWeight: 700, color: isFirebaseActive ? 'var(--success)' : 'var(--primary)' }}>
                {isFirebaseActive ? '✓ Firebase Cloud Firestore Aktív' : 'Helyi / Offline Mód (LocalStorage)'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {isFirebaseActive 
                  ? 'Az adatok szinkronizálva vannak a megadott Firebase projektbe.'
                  : 'Az adatok biztonságosan mentődnek a böngésző helyi tárolójába. Adja meg a Firebase kulcsait a felhős mentéshez!'}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>Firebase API Key</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          <div className="form-row form-row-2">
            <div className="form-group">
              <label>Project ID</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="autolog-12345"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Auth Domain (opcionális)</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="autolog-12345.firebaseapp.com"
                value={authDomain}
                onChange={(e) => setAuthDomain(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Storage Bucket (opcionális)</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="autolog-12345.appspot.com"
              value={storageBucket}
              onChange={(e) => setStorageBucket(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="submit" className="btn btn-primary btn-full">
              Firebase Kulcsok Mentése
            </button>
            {isFirebaseActive && (
              <button type="button" className="btn btn-danger btn-full" onClick={handleClear}>
                Firebase Törlése
              </button>
            )}
          </div>
        </form>

        <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Demó tesztelési opciók:
          </div>
          <button className="btn btn-secondary btn-full btn-sm" onClick={handleResetDemo}>
            <RefreshCw size={14} /> Mintaadatok Újratöltése (VW Passat & BMW 320i)
          </button>
        </div>

      </div>
    </div>
  );
}
