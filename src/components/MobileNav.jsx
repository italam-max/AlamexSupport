import React from 'react';
import { LayoutDashboard, Package, Wrench, BarChart3 } from 'lucide-react';

export default function MobileNav({ activeTab, setActiveTab }) {
  const getButtonClass = (tabName) =>
    `p-2 rounded-lg transition-colors ${
      activeTab === tabName
        ? 'text-blue-400'
        : 'text-slate-400 hover:text-white'
    }`;

  return (
    <div className="md:hidden fixed bottom-0 w-full bg-slate-900 text-white z-50 flex justify-around p-4 border-t border-slate-800">
      <button
        onClick={() => setActiveTab('dashboard')}
        className={getButtonClass('dashboard')}
      >
        <LayoutDashboard size={24} />
      </button>

      <button
        onClick={() => setActiveTab('inventory')}
        className={getButtonClass('inventory')}
      >
        <Package size={24} />
      </button>

      <button
        onClick={() => setActiveTab('maintenance')}
        className={getButtonClass('maintenance')}
      >
        <Wrench size={24} />
      </button>

      <button
        onClick={() => setActiveTab('analytics')}
        className={getButtonClass('analytics')}
      >
        <BarChart3 size={24} />
      </button>
    </div>
  );
}
