import React from 'react';
import { Calendar, CheckCircle2 } from 'lucide-react';

export const MaintenanceView = ({
  maintenanceList,
  completeMaintenance,
  onScheduleClick,
}) => {
  return (
    <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">
          Agenda de Mantenimiento
        </h2>
        <button
          onClick={onScheduleClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Calendar size={18} /> Agendar
        </button>
      </div>

      <div className="grid gap-4">
        {maintenanceList.length === 0 ? (
          <p className="text-slate-500 text-center py-8 bg-white rounded-xl border border-slate-200">
            No hay mantenimientos programados.
          </p>
        ) : (
          maintenanceList.map((m) => (
            <div
              key={m.id}
              className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                m.status === 'Pendiente'
                  ? 'bg-white border-l-4 border-l-orange-500 border-slate-200'
                  : 'bg-slate-50 border-l-4 border-l-green-500 border-slate-200 opacity-75'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded border ${
                      m.type === 'Preventivo'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    {m.type}
                  </span>
                  <span className="text-sm text-slate-500">{m.date}</span>
                </div>
                {/* Usamos m.item_name (Supabase) o m.itemName (Mock) por compatibilidad */}
                <h4 className="font-bold text-slate-800">
                  {m.item_name || m.itemName}
                </h4>
                <p className="text-sm text-slate-600 mt-1">{m.notes}</p>
              </div>

              {m.status === 'Pendiente' && (
                <button
                  onClick={() => completeMaintenance(m.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  <CheckCircle2 size={16} /> Completar
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
