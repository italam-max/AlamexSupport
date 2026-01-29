import React from 'react';
import { Package, Calendar, AlertTriangle } from 'lucide-react';

const CATEGORIES = [
  'Computadoras',
  'Impresoras',
  'Cámaras',
  'Internet',
  'Consumibles',
  'Mouse/Teclados',
  'Pilas',
  'Celulares',
  'Fundas/Micas',
  'Tintas',
];

export const DashboardView = ({
  inventory,
  maintenanceList,
  completeMaintenance,
}) => {
  // Lógica derivada de los datos recibidos
  const pendingMaintenances = maintenanceList.filter(
    (m) => m.status === 'Pendiente'
  );
  const criticalItems = inventory.filter(
    (i) => i.status === 'Alerta' || i.status === 'Reparación'
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Tarjetas Superiores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-slate-500 font-medium">Equipos Totales</h3>
            <Package className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-slate-800">
            {inventory.length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-slate-500 font-medium">
              Mantenimientos Pendientes
            </h3>
            <Calendar className="text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-slate-800">
            {pendingMaintenances.length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-slate-500 font-medium">Alertas Activas</h3>
            <AlertTriangle className="text-red-500" />
          </div>
          <p className="text-3xl font-bold text-slate-800">
            {criticalItems.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertas Próximas */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <AlertTriangle size={20} className="text-orange-500" />
            Alertas de Mantenimiento (Próximos 7 días)
          </h3>
          {pendingMaintenances.length > 0 ? (
            <ul className="space-y-3">
              {pendingMaintenances.map((m) => (
                <li
                  key={m.id}
                  className="flex items-start justify-between p-3 bg-orange-50 rounded-lg border border-orange-100"
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      {m.item_name || m.itemName}
                    </p>
                    <p className="text-sm text-slate-600">
                      {m.type} - {m.date}
                    </p>
                  </div>
                  <button
                    onClick={() => completeMaintenance(m.id)}
                    className="text-xs bg-white text-orange-600 px-3 py-1 rounded-full border border-orange-200 hover:bg-orange-100"
                  >
                    Marcar Listo
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400 text-center py-8">
              No hay mantenimientos urgentes.
            </p>
          )}
        </div>

        {/* Resumen de Categorías */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            Distribución de Activos
          </h3>
          <div className="space-y-3">
            {CATEGORIES.slice(0, 5).map((cat) => {
              const count = inventory.filter((i) => i.category === cat).length;
              const total = inventory.length || 1;
              const percent = (count / total) * 100;
              return (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">{cat}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
