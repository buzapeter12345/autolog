import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import CarDashboard from './components/CarDashboard';
import ServiceLog from './components/ServiceLog';
import FluidLog from './components/FluidLog';
import MileageLog from './components/MileageLog';
import Reminders from './components/Reminders';
import GarageModal from './components/GarageModal';
import AuthScreen from './components/AuthScreen';

import { 
  fetchVehicles, saveVehicle, deleteVehicle,
  fetchServices, addService, deleteService,
  fetchFluids, addFluid, deleteFluid,
  fetchMileage, addMileage, deleteMileage,
  fetchReminders, addReminder, deleteReminder
} from './firebase/services';
import { subscribeAuth } from './firebase/config';
import { getActiveVehicleId, setActiveVehicleId } from './utils/storage';
import { exportToCSV } from './utils/exporter';
import { generateServiceBookletPDF } from './utils/pdfGenerator';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [vehicles, setVehicles] = useState([]);
  const [activeVehicleId, setActiveVehicleState] = useState(getActiveVehicleId());
  const [services, setServices] = useState([]);
  const [fluids, setFluids] = useState([]);
  const [mileage, setMileage] = useState([]);
  const [reminders, setReminders] = useState([]);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isGarageModalOpen, setIsGarageModalOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState(null);

  // Subscribe to Auth State
  useEffect(() => {
    const unsubscribe = subscribeAuth((user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Load Vehicles for authenticated user
  useEffect(() => {
    if (!currentUser) {
      setVehicles([]);
      return;
    }

    async function loadVehicles() {
      const list = await fetchVehicles();
      setVehicles(list);

      if (list.length > 0) {
        const found = list.find(v => v.id === activeVehicleId);
        if (!found) {
          setActiveVehicleState(list[0].id);
          setActiveVehicleId(list[0].id);
        }
      } else {
        setActiveVehicleState(null);
        setActiveVehicleId(null);
      }
    }
    loadVehicles();
  }, [currentUser]);

  // Load Data for active vehicle
  useEffect(() => {
    if (!activeVehicleId || !currentUser) {
      setServices([]);
      setFluids([]);
      setMileage([]);
      setReminders([]);
      return;
    }

    async function loadData() {
      const [sList, fList, mList, rList] = await Promise.all([
        fetchServices(activeVehicleId),
        fetchFluids(activeVehicleId),
        fetchMileage(activeVehicleId),
        fetchReminders(activeVehicleId)
      ]);

      setServices(sList);
      setFluids(fList);
      setMileage(mList);
      setReminders(rList);
    }
    loadData();
  }, [activeVehicleId, currentUser]);

  const activeVehicle = vehicles.find(v => v.id === activeVehicleId) || null;

  const handleSelectVehicle = (id) => {
    setActiveVehicleState(id);
    setActiveVehicleId(id);
  };

  // Vehicle CRUD
  const handleSaveVehicle = async (vehicleData) => {
    const saved = await saveVehicle(vehicleData);
    const updatedVehicles = await fetchVehicles();
    setVehicles(updatedVehicles);
    if (saved && saved.id) {
      handleSelectVehicle(saved.id);
    }
    setVehicleToEdit(null);
  };

  const handleDeleteVehicle = async (id) => {
    await deleteVehicle(id);
    const updatedVehicles = await fetchVehicles();
    setVehicles(updatedVehicles);
    if (updatedVehicles.length > 0) {
      handleSelectVehicle(updatedVehicles[0].id);
    } else {
      setActiveVehicleState(null);
      setActiveVehicleId(null);
    }
  };

  // Service CRUD
  const handleAddService = async (serviceData) => {
    if (!activeVehicleId) return;
    const item = await addService({ ...serviceData, vehicleId: activeVehicleId });
    setServices(prev => [item, ...prev]);
  };

  const handleDeleteService = async (id) => {
    await deleteService(id);
    setServices(prev => prev.filter(s => s.id !== id));
  };

  // Fluid CRUD
  const handleAddFluid = async (fluidData) => {
    if (!activeVehicleId) return;
    const item = await addFluid({ ...fluidData, vehicleId: activeVehicleId });
    setFluids(prev => [item, ...prev]);
  };

  const handleDeleteFluid = async (id) => {
    await deleteFluid(id);
    setFluids(prev => prev.filter(f => f.id !== id));
  };

  // Mileage CRUD
  const handleAddMileage = async (mileageData) => {
    if (!activeVehicleId) return;
    const item = await addMileage({ ...mileageData, vehicleId: activeVehicleId });
    setMileage(prev => [...prev, item]);

    const updatedVehicles = await fetchVehicles();
    setVehicles(updatedVehicles);
  };

  const handleDeleteMileage = async (id) => {
    await deleteMileage(id);
    setMileage(prev => prev.filter(m => m.id !== id));
  };

  // Reminder CRUD
  const handleAddReminder = async (reminderData) => {
    if (!activeVehicleId) return;
    const item = await addReminder({ ...reminderData, vehicleId: activeVehicleId });
    setReminders(prev => [item, ...prev]);
  };

  const handleDeleteReminder = async (id) => {
    await deleteReminder(id);
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  // Exports
  const handleExportPdf = () => {
    if (!activeVehicle) {
      alert('Nincs kiválasztva autó a PDF generáláshoz!');
      return;
    }
    generateServiceBookletPDF(activeVehicle, services, fluids, mileage);
  };

  const handleExportCsv = () => {
    if (!activeVehicle) {
      alert('Nincs kiválasztva autó a CSV exportáláshoz!');
      return;
    }
    exportToCSV(activeVehicle, services, fluids, mileage);
  };

  // Loading spinner during auth check
  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        Betöltés...
      </div>
    );
  }

  // IF NOT LOGGED IN -> RENDER AUTH SCREEN FIRST! NO DEMO DATA!
  if (!currentUser) {
    return <AuthScreen />;
  }

  // IF LOGGED IN -> RENDER APP DASHBOARD
  return (
    <div>
      <Navbar 
        vehicles={vehicles}
        activeVehicleId={activeVehicleId}
        onSelectVehicle={handleSelectVehicle}
        onOpenGarageModal={() => { setVehicleToEdit(null); setIsGarageModalOpen(true); }}
        currentUser={currentUser}
        onExportPdf={handleExportPdf}
        onExportCsv={handleExportCsv}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="container" style={{ marginTop: '1.25rem' }}>
        {activeTab === 'dashboard' && (
          <CarDashboard 
            vehicle={activeVehicle}
            services={services}
            fluids={fluids}
            mileage={mileage}
            reminders={reminders}
            onOpenAddService={() => setActiveTab('services')}
            onOpenAddFluid={() => setActiveTab('fluids')}
            onOpenAddMileage={() => setActiveTab('mileage')}
            onExportPdf={handleExportPdf}
            onExportCsv={handleExportCsv}
            onOpenEditVehicle={() => { setVehicleToEdit(activeVehicle || null); setIsGarageModalOpen(true); }}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'services' && (
          <ServiceLog 
            services={services}
            onAddService={handleAddService}
            onDeleteService={handleDeleteService}
          />
        )}

        {activeTab === 'fluids' && (
          <FluidLog 
            fluids={fluids}
            onAddFluid={handleAddFluid}
            onDeleteFluid={handleDeleteFluid}
          />
        )}

        {activeTab === 'mileage' && (
          <MileageLog 
            vehicle={activeVehicle}
            mileage={mileage}
            onAddMileage={handleAddMileage}
            onDeleteMileage={handleDeleteMileage}
          />
        )}

        {activeTab === 'reminders' && (
          <Reminders 
            vehicle={activeVehicle}
            reminders={reminders}
            onAddReminder={handleAddReminder}
            onDeleteReminder={handleDeleteReminder}
          />
        )}
      </main>

      {/* Garage Modal */}
      <GarageModal 
        isOpen={isGarageModalOpen}
        onClose={() => { setIsGarageModalOpen(false); setVehicleToEdit(null); }}
        onSaveVehicle={handleSaveVehicle}
        onDeleteVehicle={handleDeleteVehicle}
        vehicleToEdit={vehicleToEdit}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
