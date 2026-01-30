import React from 'react';
import { LayoutDashboard, Package, Wrench, BarChart3 } from 'lucide-react';

export default function MobileNav({ activeTab, setActiveTab }) {
  const getButtonClass = (tabName) =>
    `p-3 rounded-2xl transition-all duration-300 ${
      activeTab === tabName
        ? 'text-tech-900 bg-neon-400 shadow-[0_0_15px_rgba(212,255,0,0.6)] transform -translate-y-2'
        : 'text-slate-500 hover:text-white'
    }`;

  return (
    <div className="md:hidden fixed bottom-0 w-full bg-tech-900 text-white z-50 flex justify-around p-4 pb-6 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.3)] border-t border-white/10">
      <button onClick={() => setActiveTab('dashboard')} className={getButtonClass('dashboard')}>
        <LayoutDashboard size={24} strokeWidth={2.5} />
      </button>

      <button onClick={() => setActiveTab('inventory')} className={getButtonClass('inventory')}>
        <Package size={24} strokeWidth={2.5} />
      </button>

      <button onClick={() => setActiveTab('maintenance')} className={getButtonClass('maintenance')}>
        <Wrench size={24} strokeWidth={2.5} />
      </button>

      <button onClick={() => setActiveTab('analytics')} className={getButtonClass('analytics')}>
        <BarChart3 size={24} strokeWidth={2.5} />
      </button>
    </div>
  );
}