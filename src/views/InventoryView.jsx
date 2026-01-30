import React, { useState } from 'react';
import { Plus, Wrench, Trash2, Printer, Smartphone, Monitor, Wifi, MousePointer2, Battery, Package, Search, Filter, User } from 'lucide-react';
import EquipmentDetailModal from '../components/Modals/EquipmentDetailModal';

const getIcon = (category) => {
  const iconProps = { size: 16, strokeWidth: 2 };
  switch (category) {
    case 'Impresoras': return <Printer {...iconProps} />;
    case 'Celulares': return <Smartphone {...iconProps} />;
    case 'Computadoras': return <Monitor {...iconProps} />;
    case 'Internet': return <Wifi {...iconProps} />;
    case 'Mouse/Teclados': return <MousePointer2 {...iconProps} />;
    case 'Pilas': return <Battery {...iconProps} />;
    default: return <Package {...iconProps} />;
  }
};

// 1. AQUI RECIBIMOS 'users'
export const InventoryView = ({ inventory, maintenanceList = [], users = [], onAddClick, addMaintenance, updateItem }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-tech-900 tracking-tighter uppercase">Inventario</h2>
          <p className="text-sm text-slate-500 font-medium">Gestión de activos físicos y digitales</p>
        </div>
        
        <div className="flex gap-3">
          <button className="h-10 px-4 rounded-xl border border-slate-200 text-slate-500 hover:border-tech-900 hover:text-tech-900 transition-colors flex items-center gap-2 text-sm font-bold">
             <Filter size={16} /> <span className="hidden sm:inline">Filtrar</span>
          </button>
          
          <button
            onClick={onAddClick}
            className="h-10 px-6 bg-tech-900 text-white rounded-xl shadow-lg hover:shadow-neon hover:bg-neon-400 hover:text-tech-900 transition-all duration-300 flex items-center gap-2 text-sm font-bold uppercase tracking-wide group"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform" /> 
            Nuevo Equipo
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-premium border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white border-b border-slate-100">
              <tr>
                <th className="py-5 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Activo</th>
                <th className="py-5 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Categoría</th>
                <th className="py-5 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Ubicación / Asignado</th>
                <th className="py-5 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Estado</th>
                <th className="py-5 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Mantenimiento</th>
                <th className="py-5 px-6 text-right text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {inventory.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group hover:bg-slate-50 transition-all duration-200 cursor-pointer"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs group-hover:bg-tech-900 group-hover:text-neon-400 transition-colors">
                        {(item.name || '?').charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-tech-900 text-sm group-hover:text-blue-600 transition-colors">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">ID: {String(item.id).slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="inline-flex items-center gap-2 px-2 py-1 rounded-lg border border-transparent group-hover:border-slate-200 transition-colors">
                      <span className="text-slate-400 group-hover:text-tech-900 transition-colors">{getIcon(item.category)}</span>
                      <span className="text-sm font-medium text-slate-600">{item.category}</span>
                    </div>
                  </td>
                  
                  {/* ASIGNACIÓN */}
                  <td className="py-4 px-6">
                     {item.assigned_to ? (
                        <div className="flex items-center gap-2">
                           <div className="w-5 h-5 rounded-full bg-neon-400 flex items-center justify-center text-[10px] font-bold text-tech-900">
                             <User size={10} />
                           </div>
                           <span className="text-sm font-bold text-tech-900">
                              {users.find(u => u.id === item.assigned_to)?.name || 'Usuario...'}
                           </span>
                        </div>
                     ) : (
                        <p className="text-sm text-slate-500 font-medium flex items-center gap-1">{item.location || 'Sin asignar'}</p>
                     )}
                  </td>

                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        item.status === 'Activo' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        item.status === 'Asignado' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                        item.status === 'Alerta' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                         item.status === 'Activo' ? 'bg-emerald-500' : 
                         item.status === 'Asignado' ? 'bg-blue-500' : 
                         item.status === 'Alerta' ? 'bg-red-500' : 'bg-amber-500'
                      }`}></span>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-xs font-mono text-slate-500 bg-slate-100 inline-block px-2 py-1 rounded">
                      {item.last_maintenance || item.lastMaintenance || '--/--/----'}
                    </p>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                      <button className="p-2 rounded-lg text-slate-400 hover:text-neon-400 hover:bg-tech-900 transition-all" onClick={(e) => { e.stopPropagation(); }}>
                        <Wrench size={16} />
                      </button>
                      <button className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all" onClick={(e) => { e.stopPropagation(); }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {inventory.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Search className="text-slate-300" size={32} />
              </div>
              <p className="text-slate-500 font-medium">Base de datos vacía.</p>
              <button onClick={onAddClick} className="text-sm font-bold text-tech-900 underline hover:text-neon-400 transition-colors mt-2">
                Crear registro ahora
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedItem && (
        <EquipmentDetailModal 
          item={selectedItem} 
          maintenanceHistory={maintenanceList} 
          users={users} // <--- 2. ¡IMPORTANTE! PASAMOS LA LISTA AQUÍ
          onAddLog={addMaintenance}
          onUpdate={updateItem}
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </div>
  );
};