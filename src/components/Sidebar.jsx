import React from 'react';
import { LayoutDashboard, Package, Wrench, BarChart3, Hexagon, Users } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const getButtonClass = (tabName) =>
    `relative group w-full flex items-center gap-4 px-6 py-4 text-sm font-bold transition-all duration-300 ${
      activeTab === tabName
        ? 'text-neon-400 bg-white/5'
        : 'text-slate-500 hover:text-white hover:bg-white/5'
    }`;

  return (
    <aside className="w-72 bg-tech-900 text-white flex flex-col hidden md:flex h-screen sticky top-0 shadow-2xl z-50">
      {/* Logo Area */}
      <div className="p-8 pb-10">
        <div className="flex items-center gap-3 mb-1">
          <Hexagon className="text-neon-400 fill-neon-400/20" size={32} strokeWidth={2.5} />
          <div>
            <h1 className="text-2xl font-black tracking-tighter leading-none text-white">
              ALAMEX
            </h1>
            <p className="text-[10px] font-bold text-neon-400 uppercase tracking-[0.3em]">
              Support
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        <button onClick={() => setActiveTab('dashboard')} className={getButtonClass('dashboard')}>
          <LayoutDashboard size={20} /> 
          <span>PANEL GENERAL</span>
          {activeTab === 'dashboard' && <div className="absolute right-0 top-0 h-full w-1 bg-neon-400 shadow-neon"></div>}
        </button>

        <button onClick={() => setActiveTab('inventory')} className={getButtonClass('inventory')}>
          <Package size={20} /> 
          <span>INVENTARIO</span>
          {activeTab === 'inventory' && <div className="absolute right-0 top-0 h-full w-1 bg-neon-400 shadow-neon"></div>}
        </button>
        
        {/* NUEVO BOTÓN: USUARIOS */}
        <button onClick={() => setActiveTab('users')} className={getButtonClass('users')}>
          <Users size={20} /> 
          <span>COLABORADORES</span>
          {activeTab === 'users' && <div className="absolute right-0 top-0 h-full w-1 bg-neon-400 shadow-neon"></div>}
        </button>

        <button onClick={() => setActiveTab('maintenance')} className={getButtonClass('maintenance')}>
          <Wrench size={20} /> 
          <span>MANTENIMIENTO</span>
          {activeTab === 'maintenance' && <div className="absolute right-0 top-0 h-full w-1 bg-neon-400 shadow-neon"></div>}
        </button>

        <button onClick={() => setActiveTab('analytics')} className={getButtonClass('analytics')}>
          <BarChart3 size={20} /> 
          <span>ANÁLITICAS</span>
          {activeTab === 'analytics' && <div className="absolute right-0 top-0 h-full w-1 bg-neon-400 shadow-neon"></div>}
        </button>
      </nav>

      {/* Footer Info */}
      <div className="p-6 bg-black/20">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
           <h4 className="text-xs font-bold text-slate-300 uppercase mb-2">Estado del Servidor</h4>
           <div className="flex items-center gap-2">
             <div className="h-2 w-2 rounded-full bg-neon-400 animate-pulse"></div>
             <span className="text-xs font-mono text-neon-400">ONLINE • 45ms</span>
           </div>
        </div>
      </div>
    </aside>
  );
}