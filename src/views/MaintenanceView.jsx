import React from 'react';
import { Calendar, CheckCircle2, Clock, AlertTriangle, User } from 'lucide-react';

export const MaintenanceView = ({ maintenanceList, users = [], completeMaintenance, onScheduleClick }) => {
  
  const getUserName = (id) => {
     if (!id) return '---';
     const user = users.find(u => u.id === id);
     return user ? user.name : 'Desconocido';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-tech-900 tracking-tighter uppercase">Mantenimiento</h2>
          <p className="text-sm text-slate-500 font-medium">Bitácora de servicios y agenda</p>
        </div>
        <button onClick={onScheduleClick} className="h-10 px-6 bg-tech-900 text-white rounded-xl shadow-lg hover:shadow-neon hover:bg-neon-400 hover:text-tech-900 transition-all font-bold text-sm flex items-center gap-2">
           <Calendar size={18} /> Agendar Servicio
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-premium border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white border-b border-slate-100">
            <tr>
              <th className="py-5 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fecha</th>
              <th className="py-5 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Equipo</th>
              <th className="py-5 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tipo</th>
              <th className="py-5 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Responsable</th>
              <th className="py-5 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estado</th>
              <th className="py-5 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {maintenanceList.map((m) => (
              <tr key={m.id} className="group hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-mono text-sm text-slate-500">{m.date}</td>
                <td className="py-4 px-6 font-bold text-tech-900">{m.item_name || m.itemName}</td>
                <td className="py-4 px-6">
                   <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                      m.type === 'Correctivo' ? 'bg-red-50 text-red-600 border-red-100' : 
                      m.type === 'Tinta' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 
                      'bg-blue-50 text-blue-600 border-blue-100'
                   }`}>
                      {m.type}
                   </span>
                </td>
                
                {/* COLUMNA RESPONSABLE */}
                <td className="py-4 px-6">
                   <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                         <User size={12} />
                      </div>
                      <span className="text-sm text-slate-600 font-medium">
                         {getUserName(m.registered_by)}
                      </span>
                   </div>
                </td>

                <td className="py-4 px-6">
                   {m.status === 'Pendiente' ? (
                      <span className="flex items-center gap-1.5 text-orange-500 font-bold text-xs bg-orange-50 px-2 py-1 rounded-full w-fit">
                         <Clock size={12} /> Pendiente
                      </span>
                   ) : (
                      <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded-full w-fit">
                         <CheckCircle2 size={12} /> Completado
                      </span>
                   )}
                </td>
                <td className="py-4 px-6 text-right">
                   {m.status === 'Pendiente' && (
                      <button 
                        onClick={() => completeMaintenance(m.id)}
                        className="text-xs font-bold text-tech-900 hover:text-neon-400 underline transition-colors"
                      >
                        Marcar Listo
                      </button>
                   )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};