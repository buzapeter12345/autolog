// High-Precision HTML-to-Canvas PDF Booklet Generator
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export async function generateServiceBookletPDF(vehicle, services = [], fluids = [], mileage = []) {
  if (!vehicle) return;

  // Calculate totals
  const totalServiceCost = services.reduce((sum, s) => sum + (Number(s.cost) || 0), 0);
  const totalFluidCost = fluids.reduce((sum, f) => sum + (Number(f.cost) || 0), 0);
  const grandTotalCost = totalServiceCost + totalFluidCost;

  // Create temporary container for PDF rendering
  const container = document.createElement('div');
  container.id = 'pdf-render-container';
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '794px'; // A4 width at 96 DPI
  container.style.background = '#ffffff';
  container.style.color = '#0f172a';
  container.style.fontFamily = "'Inter', 'Helvetica Neue', Arial, sans-serif";
  container.style.padding = '0';
  container.style.margin = '0';

  const dateStr = new Date().toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Construct structured, responsive, collision-free HTML Template
  container.innerHTML = `
    <div style="padding: 24px 32px; background: #ffffff; color: #0f172a; box-sizing: border-box; width: 794px;">
      
      <!-- Top Banner -->
      <div style="background: #0f172a; border-radius: 12px; padding: 24px 28px; color: #ffffff; display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        <div>
          <h1 style="margin: 0; font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 800; letter-spacing: -0.02em; color: #ffffff;">
            DIGITÁLIS SZERVIZKÖNYV
          </h1>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #94a3b8; font-weight: 500;">
            Hivatalos gépjármű karbantartási és szerviz nyilvántartás
          </p>
        </div>

        <!-- License Plate Badge -->
        <div style="background: #ffffff; color: #0f172a; padding: 4px 12px 4px 8px; border-radius: 6px; border: 2px solid #000000; font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 18px; display: flex; align-items: center; gap: 8px;">
          <span style="background: #0055a5; color: #ffffff; font-size: 10px; padding: 2px 5px; border-radius: 3px; font-weight: 700;">H</span>
          <span>${vehicle.licensePlate || 'AUTÓ'}</span>
        </div>
      </div>

      <!-- Vehicle Specs & Cost Card -->
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px 24px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">
          <div>
            <h2 style="margin: 0; font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 700; color: #0f172a;">
              ${vehicle.make} ${vehicle.model}
            </h2>
            <div style="font-size: 13px; color: #64748b; margin-top: 4px;">
              Évjárat: <strong style="color: #0f172a;">${vehicle.year}</strong> &nbsp;|&nbsp; 
              Üzemanyag: <strong style="color: #0f172a;">${vehicle.fuelType}</strong>
            </div>
          </div>

          <div style="text-align: right; background: #fef08a; border: 1px solid #fde047; padding: 8px 16px; border-radius: 8px;">
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #854d0e; letter-spacing: 0.05em;">ÖSSZES SZERVIZKÖLTSÉG</div>
            <div style="font-size: 18px; font-weight: 800; color: #0f172a; font-family: 'Outfit', sans-serif;">
              ${grandTotalCost.toLocaleString('hu-HU')} Ft
            </div>
          </div>
        </div>

        <!-- 3-column details grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; font-size: 12px;">
          <div>
            <div style="color: #64748b;">Alvázszám (VIN):</div>
            <div style="font-weight: 600; color: #0f172a; font-family: monospace; font-size: 12px;">${vehicle.vin || 'Nincs megadva'}</div>
          </div>

          <div>
            <div style="color: #64748b;">Kezdő km állás:</div>
            <div style="font-weight: 600; color: #0f172a;">${(vehicle.initialMileage || 0).toLocaleString('hu-HU')} km</div>
          </div>

          <div>
            <div style="color: #64748b;">Jelenlegi km állás:</div>
            <div style="font-weight: 700; color: #ca8a04;">${(vehicle.currentMileage || 0).toLocaleString('hu-HU')} km</div>
          </div>

          <div>
            <div style="color: #64748b;">Motorkód / Teljesítmény:</div>
            <div style="font-weight: 600; color: #0f172a;">${vehicle.engineCode || 'N/A'}</div>
          </div>

          <div>
            <div style="color: #64748b;">Szerviz Bejegyzések:</div>
            <div style="font-weight: 600; color: #0f172a;">${services.length} db</div>
          </div>

          <div>
            <div style="color: #64748b;">Folyadék Utántöltések:</div>
            <div style="font-weight: 600; color: #0f172a;">${fluids.length} db</div>
          </div>
        </div>
      </div>

      <!-- Section 1: SZERVIZ ÉS JAVÍTÁSI BEJEGYZÉSEK -->
      <div style="margin-bottom: 24px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
          <div style="width: 4px; height: 18px; background: #ca8a04; border-radius: 2px;"></div>
          <h3 style="margin: 0; font-family: 'Outfit', sans-serif; font-size: 16px; font-weight: 700; color: #0f172a;">
            1. SZERVIZ ÉS JAVÍTÁSI BEJEGYZÉSEK
          </h3>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 11px; table-layout: fixed;">
          <thead>
            <tr style="background: #0f172a; color: #ffffff; text-align: left;">
              <th style="padding: 8px 10px; width: 75px; border-radius: 6px 0 0 0;">Dátum</th>
              <th style="padding: 8px 10px; width: 85px;">KM állás</th>
              <th style="padding: 8px 10px; width: 130px;">Kategória</th>
              <th style="padding: 8px 10px;">Leírás / Alkatrészek</th>
              <th style="padding: 8px 10px; width: 120px;">Szerviz</th>
              <th style="padding: 8px 10px; width: 85px; text-align: right; border-radius: 0 6px 0 0;">Költség</th>
            </tr>
          </thead>
          <tbody>
            ${services.length === 0 ? `
              <tr>
                <td colspan="6" style="padding: 16px; text-align: center; color: #94a3b8; border-bottom: 1px solid #e2e8f0;">
                  Nincs rögzített szerviz bejegyzés.
                </td>
              </tr>
            ` : services.map((s, idx) => `
              <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'}; border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px 10px; font-weight: 500; color: #475569;">${s.date || '-'}</td>
                <td style="padding: 8px 10px; font-weight: 600; color: #0f172a;">${s.mileage ? Number(s.mileage).toLocaleString('hu-HU') + ' km' : '-'}</td>
                <td style="padding: 8px 10px;">
                  <span style="background: #fef08a; color: #854d0e; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600;">
                    ${s.category || 'Egyéb'}
                  </span>
                </td>
                <td style="padding: 8px 10px; color: #0f172a; word-wrap: break-word;">
                  <div style="font-weight: 600;">${s.description || ''}</div>
                  ${s.partsReplaced ? `<div style="font-size: 10px; color: #64748b; margin-top: 2px;">Cserélve: ${s.partsReplaced}</div>` : ''}
                </td>
                <td style="padding: 8px 10px; color: #475569; font-weight: 500;">${s.workshopName || 'Saját szerviz'}</td>
                <td style="padding: 8px 10px; text-align: right; font-weight: 700; color: #0f172a;">
                  ${s.cost ? Number(s.cost).toLocaleString('hu-HU') + ' Ft' : '0 Ft'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Section 2: FOLYADÉK UTÁNTÖLTÉSEK -->
      <div style="margin-bottom: 24px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
          <div style="width: 4px; height: 18px; background: #2563eb; border-radius: 2px;"></div>
          <h3 style="margin: 0; font-family: 'Outfit', sans-serif; font-size: 16px; font-weight: 700; color: #0f172a;">
            2. FOLYADÉK UTÁNTÖLTÉSEK
          </h3>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 11px; table-layout: fixed;">
          <thead>
            <tr style="background: #0f172a; color: #ffffff; text-align: left;">
              <th style="padding: 8px 10px; width: 75px; border-radius: 6px 0 0 0;">Dátum</th>
              <th style="padding: 8px 10px; width: 85px;">KM állás</th>
              <th style="padding: 8px 10px; width: 110px;">Folyadék Típus</th>
              <th style="padding: 8px 10px; width: 75px;">Mennyiség</th>
              <th style="padding: 8px 10px;">Specifikáció / Típus</th>
              <th style="padding: 8px 10px; width: 85px; text-align: right; border-radius: 0 6px 0 0;">Költség</th>
            </tr>
          </thead>
          <tbody>
            ${fluids.length === 0 ? `
              <tr>
                <td colspan="6" style="padding: 16px; text-align: center; color: #94a3b8; border-bottom: 1px solid #e2e8f0;">
                  Nincs rögzített folyadék utántöltés.
                </td>
              </tr>
            ` : fluids.map((f, idx) => `
              <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'}; border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px 10px; font-weight: 500; color: #475569;">${f.date || '-'}</td>
                <td style="padding: 8px 10px; font-weight: 600; color: #0f172a;">${f.mileage ? Number(f.mileage).toLocaleString('hu-HU') + ' km' : '-'}</td>
                <td style="padding: 8px 10px;">
                  <span style="background: #dbeafe; color: #1e40af; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600;">
                    ${f.fluidType || '-'}
                  </span>
                </td>
                <td style="padding: 8px 10px; font-weight: 700; color: #0f172a;">${f.volumeLiters ? f.volumeLiters + ' L' : '-'}</td>
                <td style="padding: 8px 10px; color: #334155; word-wrap: break-word;">${f.specGrade || '-'}</td>
                <td style="padding: 8px 10px; text-align: right; font-weight: 700; color: #0f172a;">
                  ${f.cost ? Number(f.cost).toLocaleString('hu-HU') + ' Ft' : '0 Ft'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Verification Footer Stamp -->
      <div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 12px; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; margin-top: 24px;">
        <div style="max-width: 500px;">
          <div style="font-size: 12px; font-weight: 700; color: #0f172a; margin-bottom: 2px;">
            DIGITÁLIS HITELOSSÉGI IGAZOLÁS & PECSÉT
          </div>
          <div style="font-size: 11px; color: #64748b;">
            Generálás időpontja: <strong style="color: #334155;">${dateStr}</strong>
          </div>
          <div style="font-size: 10px; color: #94a3b8; margin-top: 2px;">
            Az adatokat a jármű tulajdonosa rögzítette az AutoLog Digitális Szervizkönyv rendszerben.
          </div>
        </div>

        <div style="background: #f0fdf4; border: 2px solid #22c55e; border-radius: 8px; padding: 6px 14px; text-align: center; box-shadow: 0 2px 4px rgba(34,197,94,0.15);">
          <div style="font-size: 12px; font-weight: 800; color: #15803d; letter-spacing: 0.05em;">✓ HITELESÍTETT</div>
          <div style="font-size: 8px; font-weight: 700; color: #22c55e; text-transform: uppercase;">AUTOLOG DIGITAL SEAL</div>
        </div>
      </div>

    </div>
  `;

  document.body.appendChild(container);

  try {
    // Render high resolution canvas using html2canvas
    const canvas = await html2canvas(container, {
      scale: 2, // High resolution rendering
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    doc.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

    // Save document
    const fileName = `Szervizkonyv_${(vehicle.licensePlate || 'Auto').replace(/[^a-zA-Z0-9-]/g, '_')}_${vehicle.make}_${vehicle.model}.pdf`;
    doc.save(fileName);
  } catch (err) {
    console.error('PDF Generation Error:', err);
    alert('Hiba történt a PDF generálás során: ' + err.message);
  } finally {
    document.body.removeChild(container);
  }
}
