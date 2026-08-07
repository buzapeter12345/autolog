import React, { useState, useEffect } from 'react';
import { Car, Plus, Trash2 } from 'lucide-react';

export default function GarageModal({ isOpen, onClose, onSaveVehicle, onDeleteVehicle, vehicleToEdit }) {
  if (!isOpen) return null;

  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [licensePlate, setLicensePlate] = useState('');
  const [vin, setVin] = useState('');
  const [engineCode, setEngineCode] = useState('');
  const [fuelType, setFuelType] = useState('Benzin');
  const [initialMileage, setInitialMileage] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (vehicleToEdit) {
      setMake(vehicleToEdit.make || '');
      setModel(vehicleToEdit.model || '');
      setYear(vehicleToEdit.year || new Date().getFullYear());
      setLicensePlate(vehicleToEdit.licensePlate || '');
      setVin(vehicleToEdit.vin || '');
      setEngineCode(vehicleToEdit.engineCode || '');
      setFuelType(vehicleToEdit.fuelType || 'Benzin');
      setInitialMileage(vehicleToEdit.initialMileage || '');
      setImageUrl(vehicleToEdit.imageUrl || '');
    } else {
      setMake('');
      setModel('');
      setYear(new Date().getFullYear());
      setLicensePlate('');
      setVin('');
      setEngineCode('');
      setFuelType('Benzin');
      setInitialMileage('');
      setImageUrl('');
    }
  }, [vehicleToEdit, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!make || !model || !licensePlate) {
      alert('Kérjük adja meg a márkát, modellt és a rendszámot!');
      return;
    }

    onSaveVehicle({
      id: vehicleToEdit ? vehicleToEdit.id : undefined,
      make,
      model,
      year: Number(year),
      licensePlate: licensePlate.toUpperCase(),
      vin: vin.toUpperCase(),
      engineCode,
      fuelType,
      initialMileage: Number(initialMileage) || 0,
      currentMileage: vehicleToEdit ? vehicleToEdit.currentMileage : (Number(initialMileage) || 0),
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80'
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>
            <Car style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle' }} color="var(--primary)" />
            {vehicleToEdit ? 'Autó Adatainak Szerkesztése' : 'Új Autó Felvétele a Garázsba'}
          </h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row form-row-2">
            <div className="form-group">
              <label>Márka *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="pl. Volkswagen, BMW, Audi, Ford"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Modell *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="pl. Passat Variant 2.0 TDI"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row form-row-3">
            <div className="form-group">
              <label>Rendszám *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="pl. AA-AB-123"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Évjárat</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="pl. 2018"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Üzemanyag Típus</label>
              <select 
                className="form-control"
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
              >
                <option value="Benzin">Benzin</option>
                <option value="Dízel">Dízel</option>
                <option value="Hibrid">Hibrid (PHEV/HEV)</option>
                <option value="Elektromos">Elektromos (EV)</option>
                <option value="LPG / Benzin">LPG / Benzin</option>
              </select>
            </div>
          </div>

          <div className="form-row form-row-2">
            <div className="form-group">
              <label>Alvázszám (VIN)</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="17 karakteres alvázszám"
                value={vin}
                onChange={(e) => setVin(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Motorkód & Teljesítmény</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="pl. DFHA (190 LE)"
                value={engineCode}
                onChange={(e) => setEngineCode(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row form-row-2">
            <div className="form-group">
              <label>Kezdő Kilométeróra Állás (km)</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="pl. 120000"
                value={initialMileage}
                onChange={(e) => setInitialMileage(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Autó Kép URL (opcionális)</label>
              <input 
                type="url" 
                className="form-control" 
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="submit" className="btn btn-primary btn-full">
              {vehicleToEdit ? 'Módosítások Mentése' : 'Autó Hozzáadása'}
            </button>
            <button type="button" className="btn btn-secondary btn-full" onClick={onClose}>
              Mégse
            </button>
          </div>

          {vehicleToEdit && (
            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <button 
                type="button" 
                className="btn btn-danger btn-full btn-sm"
                onClick={() => {
                  if (confirm('Biztosan törölni szeretné ezt az autót és minden kapcsolódó szervizbejegyzést?')) {
                    onDeleteVehicle(vehicleToEdit.id);
                    onClose();
                  }
                }}
              >
                <Trash2 size={16} /> Autó Törlése a Garázsból
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
