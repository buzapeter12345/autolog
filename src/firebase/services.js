// Unified Production Data Service (Auto-purges any legacy Firestore demo cars)
import { isFirebaseActive, db, auth } from './config';
import { 
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc 
} from 'firebase/firestore';
import { getLocalData, setLocalData, clearLegacyDemoData } from '../utils/storage';

clearLegacyDemoData();

function sanitizeData(data) {
  const cleaned = {};
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined) {
      cleaned[key] = data[key];
    }
  });
  return cleaned;
}

export async function fetchVehicles() {
  const currentUser = auth?.currentUser;

  if (isFirebaseActive && db && currentUser) {
    try {
      const colRef = collection(db, 'users', currentUser.uid, 'vehicles');
      const snap = await getDocs(colRef);
      let list = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      // Automatically purge any legacy demo cars that were written into the user's Firestore!
      const demoDocs = snap.docs.filter(d => {
        const data = d.data();
        return d.id.startsWith('demo-') || 
               (data.id && String(data.id).startsWith('demo-')) ||
               (data.make === 'Volkswagen' && data.licensePlate === 'AA-AB-123') ||
               (data.make === 'BMW' && data.licensePlate === 'ABC-987');
      });

      if (demoDocs.length > 0) {
        for (const docSnap of demoDocs) {
          try {
            await deleteDoc(doc(db, 'users', currentUser.uid, 'vehicles', docSnap.id));
          } catch (err) {
            console.warn('Demo purge item error:', err);
          }
        }
        list = list.filter(v => 
          !v.id.startsWith('demo-') && 
          !(v.make === 'Volkswagen' && v.licensePlate === 'AA-AB-123') &&
          !(v.make === 'BMW' && v.licensePlate === 'ABC-987')
        );
      }

      return list;
    } catch (e) {
      console.warn('Firebase fetchVehicles error:', e.message);
    }
  }

  return [];
}

export async function saveVehicle(vehicleData) {
  const currentUser = auth?.currentUser;
  const cleaned = sanitizeData(vehicleData);

  if (isFirebaseActive && db && currentUser) {
    try {
      if (cleaned.id && !cleaned.id.startsWith('demo-')) {
        const vehicleId = cleaned.id;
        delete cleaned.id;
        const docRef = doc(db, 'users', currentUser.uid, 'vehicles', vehicleId);
        await updateDoc(docRef, cleaned);
        return { ...cleaned, id: vehicleId };
      } else {
        delete cleaned.id;
        const colRef = collection(db, 'users', currentUser.uid, 'vehicles');
        const res = await addDoc(colRef, { ...cleaned, createdAt: new Date().toISOString() });
        return { ...cleaned, id: res.id };
      }
    } catch (e) {
      console.error('Firebase saveVehicle error:', e);
    }
  }

  const vehicles = getLocalData('vehicles');
  if (vehicleData.id) {
    const idx = vehicles.findIndex(v => v.id === vehicleData.id);
    if (idx !== -1) {
      vehicles[idx] = { ...vehicles[idx], ...vehicleData };
    } else {
      vehicles.push(vehicleData);
    }
  } else {
    vehicleData.id = 'v-' + Date.now();
    vehicles.push(vehicleData);
  }
  setLocalData('vehicles', vehicles);
  return vehicleData;
}

export async function deleteVehicle(vehicleId) {
  const currentUser = auth?.currentUser;

  if (isFirebaseActive && db && currentUser) {
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'vehicles', vehicleId));
    } catch (e) {
      console.error('Firebase deleteVehicle error:', e);
    }
  }

  const vehicles = getLocalData('vehicles').filter(v => v.id !== vehicleId);
  setLocalData('vehicles', vehicles);
}

// SERVICE LOGS
export async function fetchServices(vehicleId) {
  const currentUser = auth?.currentUser;

  if (isFirebaseActive && db && currentUser && vehicleId) {
    try {
      const colRef = collection(db, 'users', currentUser.uid, 'vehicles', vehicleId, 'service_logs');
      const snap = await getDocs(colRef);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn('Firebase fetchServices error:', e.message);
    }
  }

  return [];
}

export async function addService(service) {
  const currentUser = auth?.currentUser;
  const cleaned = sanitizeData(service);
  if (!cleaned.id) cleaned.id = 's-' + Date.now();

  if (isFirebaseActive && db && currentUser && service.vehicleId) {
    try {
      const colRef = collection(db, 'users', currentUser.uid, 'vehicles', service.vehicleId, 'service_logs');
      delete cleaned.id;
      const res = await addDoc(colRef, cleaned);
      cleaned.id = res.id;
    } catch (e) {
      console.error('Firebase addService error:', e);
    }
  }

  const all = getLocalData('services');
  all.unshift(service);
  setLocalData('services', all);
  return service;
}

export async function deleteService(serviceId) {
  const all = getLocalData('services').filter(s => s.id !== serviceId);
  setLocalData('services', all);
}

// FLUID LOGS
export async function fetchFluids(vehicleId) {
  const currentUser = auth?.currentUser;

  if (isFirebaseActive && db && currentUser && vehicleId) {
    try {
      const colRef = collection(db, 'users', currentUser.uid, 'vehicles', vehicleId, 'fluid_logs');
      const snap = await getDocs(colRef);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn('Firebase fetchFluids error:', e.message);
    }
  }

  return [];
}

export async function addFluid(fluid) {
  const currentUser = auth?.currentUser;
  const cleaned = sanitizeData(fluid);
  if (!cleaned.id) cleaned.id = 'f-' + Date.now();

  if (isFirebaseActive && db && currentUser && fluid.vehicleId) {
    try {
      const colRef = collection(db, 'users', currentUser.uid, 'vehicles', fluid.vehicleId, 'fluid_logs');
      delete cleaned.id;
      const res = await addDoc(colRef, cleaned);
      cleaned.id = res.id;
    } catch (e) {
      console.error('Firebase addFluid error:', e);
    }
  }

  const all = getLocalData('fluids');
  all.unshift(fluid);
  setLocalData('fluids', all);
  return fluid;
}

export async function deleteFluid(fluidId) {
  const all = getLocalData('fluids').filter(f => f.id !== fluidId);
  setLocalData('fluids', all);
}

// MILEAGE LOGS
export async function fetchMileage(vehicleId) {
  const currentUser = auth?.currentUser;

  if (isFirebaseActive && db && currentUser && vehicleId) {
    try {
      const colRef = collection(db, 'users', currentUser.uid, 'vehicles', vehicleId, 'mileage_logs');
      const snap = await getDocs(colRef);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn('Firebase fetchMileage error:', e.message);
    }
  }

  return [];
}

export async function addMileage(mileageEntry) {
  const currentUser = auth?.currentUser;
  const cleaned = sanitizeData(mileageEntry);
  if (!cleaned.id) cleaned.id = 'm-' + Date.now();

  if (isFirebaseActive && db && currentUser && mileageEntry.vehicleId) {
    try {
      const colRef = collection(db, 'users', currentUser.uid, 'vehicles', mileageEntry.vehicleId, 'mileage_logs');
      delete cleaned.id;
      const res = await addDoc(colRef, cleaned);
      cleaned.id = res.id;
    } catch (e) {
      console.error('Firebase addMileage error:', e);
    }
  }

  const all = getLocalData('mileage');
  all.push(mileageEntry);
  setLocalData('mileage', all);

  return mileageEntry;
}

export async function deleteMileage(mileageId) {
  const all = getLocalData('mileage').filter(m => m.id !== mileageId);
  setLocalData('mileage', all);
}

// REMINDERS
export async function fetchReminders(vehicleId) {
  const currentUser = auth?.currentUser;

  if (isFirebaseActive && db && currentUser && vehicleId) {
    try {
      const colRef = collection(db, 'users', currentUser.uid, 'vehicles', vehicleId, 'reminders');
      const snap = await getDocs(colRef);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn('Firebase fetchReminders error:', e.message);
    }
  }

  return [];
}

export async function addReminder(reminder) {
  const currentUser = auth?.currentUser;
  const cleaned = sanitizeData(reminder);
  if (!cleaned.id) cleaned.id = 'r-' + Date.now();

  if (isFirebaseActive && db && currentUser && reminder.vehicleId) {
    try {
      const colRef = collection(db, 'users', currentUser.uid, 'vehicles', reminder.vehicleId, 'reminders');
      delete cleaned.id;
      const res = await addDoc(colRef, cleaned);
      cleaned.id = res.id;
    } catch (e) {
      console.error('Firebase addReminder error:', e);
    }
  }

  const all = getLocalData('reminders');
  all.unshift(reminder);
  setLocalData('reminders', all);
  return reminder;
}

export async function deleteReminder(reminderId) {
  const all = getLocalData('reminders').filter(r => r.id !== reminderId);
  setLocalData('reminders', all);
}
