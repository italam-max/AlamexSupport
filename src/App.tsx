import React, { useState, useEffect } from 'react';
import { Search, Loader2, Bell, UserCircle, LogOut } from 'lucide-react';
// @ts-ignore - Ignoramos error de tipado en importaciones JS
import { useAppState } from './hooks/useAppState';
// @ts-ignore
import { supabase } from './lib/supabase'; 
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import DashboardView from './views/DashboardView'; 
import { InventoryView } from './views/InventoryView';
import { MaintenanceView } from './views/MaintenanceView';
import { AnalyticsView } from './views/AnalyticsView';
import { UsersView } from './views/UsersView';
import LoginView from './views/LoginView';
import AddItemModal from './components/Modals/AddItemModal';
import AddMaintModal from './components/Modals/AddMaintModal';
import AddUserModal from './components/Modals/AddUserModal';

export default function App() {
  // CORRECCIÓN 1: Definimos que el estado puede ser 'any' para evitar el error "type never"
  const [session, setSession] = useState<any>(null); 
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  const {
    inventory,
    maintenanceList,
    users, 
    loading,
    addItem,
    updateItem,
    addUser, 
    updateUser, 
    deleteUser,
    addMaintenance,
    completeMaintenance,
  } = useAppState();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setSession(session);
    });

    // CORRECCIÓN 2: Tipamos explícitamente los eventos como 'any'
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!session) {
    return <LoginView />;
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white text-tech-900 gap-3">
        <Loader2 className="animate-spin text-neon-400" size={32} /> 
        <span className="font-mono tracking-widest text-sm font-bold">SYSTEM_BOOT...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-tech-50 font-sans text-tech-800 selection:bg-neon-400 selection:text-black">
      
      {/* @ts-ignore */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      {/* @ts-ignore */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto relative">
        <header className="bg-white/80 backdrop-blur-md border-b border-tech-200 sticky top-0 z-40 px-8 py-5 flex justify-between items-center shadow-sm">
          <div>
            <h2 className="text-2xl font-black text-tech-900 tracking-tighter uppercase">
              {activeTab === 'dashboard' ? 'Overview' : 
               activeTab === 'inventory' ? 'Inventario' : 
               activeTab === 'users' ? 'Control de Accesos' : 
               activeTab === 'maintenance' ? 'Mantenimiento' : 'Data Lab'}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-neon-400 rounded-full animate-pulse shadow-neon"></span>
              <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                Sistema Operativo v2.0
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative hidden md:block group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-tech-900 transition-colors" size={18} />
              <input type="text" placeholder="Buscar..." className="pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-tech-900 focus:outline-none focus:border-tech-900 focus:bg-white w-72 text-sm transition-all font-medium" />
            </div>
            
            <button className="relative p-2 text-slate-400 hover:text-tech-900 transition-colors">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
            
            <div className="flex items-center gap-3">
               <div className="text-right hidden md:block">
                  {/* CORRECCIÓN 3: Ahora session.user existe porque definimos el tipo como 'any' arriba */}
                  <p className="text-sm font-bold text-tech-900">{session?.user?.email}</p>
                  <p className="text-xs text-slate-500">Sesión Activa</p>
               </div>
               <div className="group relative">
                  <div className="w-10 h-10 rounded-full bg-tech-900 text-white flex items-center justify-center border-2 border-neon-400 shadow-neon cursor-pointer">
                      <UserCircle size={24} />
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="absolute top-12 right-0 bg-white border border-slate-200 shadow-xl rounded-xl p-3 flex items-center gap-2 text-xs font-bold text-red-500 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all w-32 justify-center hover:bg-red-50"
                  >
                    <LogOut size={14} /> Cerrar Sesión
                  </button>
               </div>
            </div>
          </div>
        </header>

        <div className="p-8 pb-32 md:pb-12 max-w-[1800px] mx-auto">
          {/* @ts-ignore */}
          {activeTab === 'dashboard' && (
            <DashboardView inventory={inventory} maintenanceList={maintenanceList} users={users} completeMaintenance={completeMaintenance} />
          )}
          
          {/* @ts-ignore */}
          {activeTab === 'inventory' && (
            <InventoryView inventory={inventory} maintenanceList={maintenanceList} users={users} addMaintenance={addMaintenance} updateItem={updateItem} onAddClick={() => setShowAddModal(true)} />
          )}

          {/* @ts-ignore */}
          {activeTab === 'users' && (
             <UsersView users={users} onAddClick={() => setShowUserModal(true)} onUpdate={updateUser} onDelete={deleteUser} />
          )}
          
          {/* @ts-ignore */}
          {activeTab === 'maintenance' && (
            <MaintenanceView 
               maintenanceList={maintenanceList} 
               users={users} 
               completeMaintenance={completeMaintenance} 
               onScheduleClick={() => setShowMaintenanceModal(true)} 
            />
          )}
          
          {/* @ts-ignore */}
          {activeTab === 'analytics' && <AnalyticsView inventory={inventory} maintenanceList={maintenanceList} users={users} />}
        </div>
      </main>

      {/* @ts-ignore */}
      {showAddModal && <AddItemModal users={users} onClose={() => setShowAddModal(false)} onSave={addItem} />}
      
      {/* @ts-ignore */}
      {showMaintenanceModal && (
         <AddMaintModal 
            inventory={inventory} 
            users={users} 
            onClose={() => setShowMaintenanceModal(false)} 
            onSave={addMaintenance} 
         />
      )}
      
      {/* @ts-ignore */}
      {showUserModal && <AddUserModal onClose={() => setShowUserModal(false)} onSave={addUser} />}
    </div>
  );
}