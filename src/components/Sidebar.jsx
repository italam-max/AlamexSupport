import React from 'react';
import { LayoutDashboard, Package, Wrench, BarChart3 } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  // Función auxiliar para clases de botones
  const getButtonClass = (tabName) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
      activeTab === tabName
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
        : 'text-slate-300 hover:bg-slate-800'
    }`;

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex shadow-xl h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight text-blue-400">
          Alamex<span className="text-white">Support</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Gestión TI & Mantenimiento
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={getButtonClass('dashboard')}
        >
          <LayoutDashboard size={20} /> Dashboard
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={getButtonClass('inventory')}
        >
          <Package size={20} /> Inventario
        </button>

        <button
          onClick={() => setActiveTab('maintenance')}
          className={getButtonClass('maintenance')}
        >
          <Wrench size={20} /> Mantenimiento
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={getButtonClass('analytics')}
        >
          <BarChart3 size={20} /> Análisis
        </button>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-lg p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
            AL
          </div>
          <div>
            <p className="text-sm font-medium">Soporte TI</p>
            <p className="text-xs text-slate-400">admin@alamex.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
