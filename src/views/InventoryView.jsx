import React from 'react';
import {
  Plus,
  Wrench,
  Trash2,
  Printer,
  Smartphone,
  Monitor,
  Wifi,
  MousePointer2,
  Battery,
  Package,
} from 'lucide-react';

// Función auxiliar para iconos (antes estaba en App.js)
const getIcon = (category) => {
  switch (category) {
    case 'Impresoras':
      return <Printer size={18} />;
    case 'Celulares':
      return <Smartphone size={18} />;
    case 'Computadoras':
      return <Monitor size={18} />;
    case 'Internet':
      return <Wifi size={18} />;
    case 'Mouse/Teclados':
      return <MousePointer2 size={18} />;
    case 'Pilas':
      return <Battery size={18} />;
    default:
      return <Package size={18} />;
  }
};

export const InventoryView = ({ inventory, onAddClick }) => {
  return (
    <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">
          Inventario de Equipos
        </h2>
        <button
          onClick={onAddClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Nuevo Equipo
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold text-slate-600">
                  Nombre/Modelo
                </th>
                <th className="p-4 font-semibold text-slate-600">Categoría</th>
                <th className="p-4 font-semibold text-slate-600">Ubicación</th>
                <th className="p-4 font-semibold text-slate-600">Estado</th>
                <th className="p-4 font-semibold text-slate-600">
                  Último Mant.
                </th>
                <th className="p-4 font-semibold text-slate-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventory.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="p-4 font-medium text-slate-800">
                    {item.name}
                  </td>
                  <td className="p-4 text-slate-600 flex items-center gap-2">
                    {getIcon(item.category)} {item.category}
                  </td>
                  <td className="p-4 text-slate-600">{item.location}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'Activo'
                          ? 'bg-green-100 text-green-700'
                          : item.status === 'Alerta'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">
                    {item.last_maintenance || item.lastMaintenance || 'N/A'}
                  </td>
                  <td className="p-4">
                    <button className="text-slate-400 hover:text-blue-600 mr-2">
                      <Wrench size={16} />
                    </button>
                    <button className="text-slate-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {inventory.length === 0 && (
            <p className="text-center p-8 text-slate-500">
              No hay equipos registrados. ¡Agrega uno nuevo!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
