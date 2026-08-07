import React from 'react';
import { LayoutDashboard, Wrench, Droplet, Gauge, Bell } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  return (
    <nav className="bottom-nav">
      <button 
        className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
        onClick={() => setActiveTab('dashboard')}
      >
        <LayoutDashboard />
        <span>Garázs</span>
      </button>

      <button 
        className={`nav-item ${activeTab === 'services' ? 'active' : ''}`}
        onClick={() => setActiveTab('services')}
      >
        <Wrench />
        <span>Szervizek</span>
      </button>

      <button 
        className={`nav-item ${activeTab === 'fluids' ? 'active' : ''}`}
        onClick={() => setActiveTab('fluids')}
      >
        <Droplet />
        <span>Folyadékok</span>
      </button>

      <button 
        className={`nav-item ${activeTab === 'mileage' ? 'active' : ''}`}
        onClick={() => setActiveTab('mileage')}
      >
        <Gauge />
        <span>KM állás</span>
      </button>

      <button 
        className={`nav-item ${activeTab === 'reminders' ? 'active' : ''}`}
        onClick={() => setActiveTab('reminders')}
      >
        <Bell />
        <span>Emlékeztető</span>
      </button>
    </nav>
  );
}
