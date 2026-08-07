// CSV / Excel Exporter Module (UTF-8 BOM supported for Hungarian characters)

export function exportToCSV(vehicle, services = [], fluids = [], mileage = []) {
  if (!vehicle) return;

  const BOM = '\uFEFF';
  let csvContent = BOM;

  // Header 1: JÁRMŰ ADATOK
  csvContent += `=== DIGITÁLIS SZERVIZKÖNYV EXPORT - ${vehicle.make} ${vehicle.model} ===\n`;
  csvContent += `Rendszám;Alvázszám (VIN);Évjárat;Motorkód;Üzemanyag;Jelenlegi KM állás;Export Dátuma\n`;
  csvContent += `"${vehicle.licensePlate}";"${vehicle.vin}";"${vehicle.year}";"${vehicle.engineCode || ''}";"${vehicle.fuelType}";"${vehicle.currentMileage} km";"${new Date().toLocaleDateString('hu-HU')}"\n\n`;

  // Section 2: SZERVIZ ÉS JAVÍTÁSI NAPLÓ
  csvContent += `=== SZERVIZ ÉS JAVÍTÁSI NAPLÓ ===\n`;
  csvContent += `Dátum;KM állás;Kategória;Leírás;Cserélt alkatrészek;Szerviz / Szerelő;Költség (Ft);Garanciális\n`;

  if (services.length === 0) {
    csvContent += `Nincs rögzített szerviz bejegyzés;;;;;;;\n`;
  } else {
    services.forEach(s => {
      const date = s.date || '';
      const km = s.mileage ? `${s.mileage} km` : '';
      const cat = (s.category || '').replace(/"/g, '""');
      const desc = (s.description || '').replace(/"/g, '""');
      const parts = (s.partsReplaced || '').replace(/"/g, '""');
      const shop = (s.workshopName || '').replace(/"/g, '""');
      const cost = s.cost ? `${s.cost} Ft` : '0 Ft';
      const warranty = s.isWarranty ? 'Igen' : 'Nem';

      csvContent += `"${date}";"${km}";"${cat}";"${desc}";"${parts}";"${shop}";"${cost}";"${warranty}"\n`;
    });
  }

  csvContent += `\n`;

  // Section 3: FOLYADÉK UTÁNTÖLTÉSEK
  csvContent += `=== FOLYADÉK UTÁNTÖLTÉSEK ===\n`;
  csvContent += `Dátum;KM állás;Folyadék Típusa;Mennyiség;Specifikáció / Viszkozitás;Költség (Ft);Megjegyzés\n`;

  if (fluids.length === 0) {
    csvContent += `Nincs rögzített folyadék utántöltés;;;;;;;\n`;
  } else {
    fluids.forEach(f => {
      const date = f.date || '';
      const km = f.mileage ? `${f.mileage} km` : '';
      const type = (f.fluidType || '').replace(/"/g, '""');
      const vol = f.volumeLiters ? `${f.volumeLiters} L` : '';
      const spec = (f.specGrade || '').replace(/"/g, '""');
      const cost = f.cost ? `${f.cost} Ft` : '0 Ft';
      const notes = (f.notes || '').replace(/"/g, '""');

      csvContent += `"${date}";"${km}";"${type}";"${vol}";"${spec}";"${cost}";"${notes}"\n`;
    });
  }

  csvContent += `\n`;

  // Section 4: KILOMÉTERÓRA ÁLLÁSOK
  csvContent += `=== KILOMÉTERÓRA ÁLLÁSOK ===\n`;
  csvContent += `Dátum;KM állás;Megjegyzés\n`;

  if (mileage.length === 0) {
    csvContent += `Nincs rögzített km bejegyzés;;\n`;
  } else {
    mileage.forEach(m => {
      const date = m.date || '';
      const km = m.mileage ? `${m.mileage} km` : '';
      const notes = (m.notes || '').replace(/"/g, '""');
      csvContent += `"${date}";"${km}";"${notes}"\n`;
    });
  }

  // Download Trigger
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const filename = `Szervizkonyv_${vehicle.licensePlate || 'Auto'}_${new Date().toISOString().slice(0, 10)}.csv`;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
