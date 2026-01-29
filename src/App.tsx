import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

// 1. Importamos nuestro Hook de Lógica (Supabase)
import { useAppState } from './hooks/useAppState';

// 2. Importamos Componentes de Estructura
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';

// 3. Importamos las Vistas
import { DashboardView } from './views/DashboardView';
import { InventoryView } from './views/InventoryView';
import { MaintenanceView } from './views/MaintenanceView';
import { AnalyticsView } from './views/AnalyticsView';

// 4. Importamos los Modales
import AddItemModal from './components/Modals/AddItemModal';
import AddMaintModal from './components/Modals/AddMaintModal';

export default function App() {
  // Estado para la navegación (Tab activo)
  const [activeTab, setActiveTab] = useState('dashboard');

  // Estado para visibilidad de modales
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);

  // Extraemos datos y funciones de nuestro Hook personalizado
  const {
    inventory,
    maintenanceList,
    loading, // Variable para saber si está cargando datos de Supabase
    addItem,
    addMaintenance,
    completeMaintenance,
  } = useAppState();

  // Pantalla de carga inicial (opcional pero recomendada)
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-500 gap-2">
        <Loader2 className="animate-spin" /> Cargando Alamex Support...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* --- Navegación Lateral (Desktop) --- */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* --- Navegación Inferior (Móvil) --- */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* --- Área Principal de Contenido --- */}
      <main className="flex-1 overflow-y-auto">
        {/* Header Superior */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-8 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-800 capitalize">
            {activeTab === 'dashboard'
              ? 'Panel Principal'
              : activeTab === 'inventory'
              ? 'Gestión de Inventario'
              : activeTab === 'maintenance'
              ? 'Agenda Técnica'
              : 'Análisis'}
          </h2>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Buscar equipo, serie..."
                className="pl-10 pr-4 py-2 rounded-full border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 text-sm"
              />
            </div>
            {/* Aquí podrías agregar un avatar de usuario si quisieras */}
            <div className="w-8 h-8 rounded-full bg-slate-200 md:hidden"></div>
          </div>
        </header>

        {/* Contenido Dinámico según la Tab seleccionada */}
        <div className="p-8 pb-24 md:pb-8 max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              inventory={inventory}
              maintenanceList={maintenanceList}
              completeMaintenance={completeMaintenance}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView
              inventory={inventory}
              onAddClick={() => setShowAddModal(true)}
            />
          )}

          {activeTab === 'maintenance' && (
            <MaintenanceView
              maintenanceList={maintenanceList}
              completeMaintenance={completeMaintenance}
              onScheduleClick={() => setShowMaintenanceModal(true)}
            />
          )}

          {activeTab === 'analytics' && <AnalyticsView inventory={inventory} />}
        </div>
      </main>

      {/* --- Modales (Popups) --- */}

      {/* Modal Agregar Equipo */}
      {showAddModal && (
        <AddItemModal onClose={() => setShowAddModal(false)} onSave={addItem} />
      )}

      {/* Modal Agendar Mantenimiento */}
      {showMaintenanceModal && (
        <AddMaintModal
          inventory={inventory} // Pasamos el inventario para que el select se llene
          onClose={() => setShowMaintenanceModal(false)}
          onSave={addMaintenance}
        />
      )}
    </div>
  );
}
