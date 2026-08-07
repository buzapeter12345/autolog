// LocalStorage Manager with automatic legacy demo data purging

const STORAGE_KEYS = {
  VEHICLES: 'autolog_vehicles_v1',
  ACTIVE_VEHICLE: 'autolog_active_vehicle_v1',
  SERVICES: 'autolog_services_v1',
  FLUIDS: 'autolog_fluids_v1',
  MILEAGE: 'autolog_mileage_v1',
  REMINDERS: 'autolog_reminders_v1'
};

export function clearLegacyDemoData() {
  try {
    localStorage.removeItem(STORAGE_KEYS.VEHICLES);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_VEHICLE);
    localStorage.removeItem(STORAGE_KEYS.SERVICES);
    localStorage.removeItem(STORAGE_KEYS.FLUIDS);
    localStorage.removeItem(STORAGE_KEYS.MILEAGE);
    localStorage.removeItem(STORAGE_KEYS.REMINDERS);
  } catch (e) {
    console.error('Storage clear error', e);
  }
}

// Automatically wipe any old demo data on module import
clearLegacyDemoData();

export function getLocalData(key) {
  try {
    const data = localStorage.getItem(STORAGE_KEYS[key.toUpperCase()]);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('LocalStorage get error', e);
    return [];
  }
}

export function setLocalData(key, value) {
  try {
    localStorage.setItem(STORAGE_KEYS[key.toUpperCase()], JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage set error', e);
  }
}

export function getActiveVehicleId() {
  return localStorage.getItem(STORAGE_KEYS.ACTIVE_VEHICLE) || null;
}

export function setActiveVehicleId(id) {
  if (id) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_VEHICLE, id);
  } else {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_VEHICLE);
  }
}
