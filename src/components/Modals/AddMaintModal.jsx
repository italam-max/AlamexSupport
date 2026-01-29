import React, { useState } from 'react';

export default function AddMaintModal({ inventory, onClose, onSave }) {
  // Estado local del formulario
  const [newMaintenance, setNewMaintenance] = useState({
    itemId: '',
    date: '',
    type: 'Preventivo',
    notes: '',
  });

  const handleSubmit = () => {
    onSave(newMaintenance);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
        <h3 className="text-lg font-bold mb-4">Agendar Mantenimiento</h3>
        <div className="space-y-4">
          {/* Selector de Equipo */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Equipo
            </label>
            <select
              value={newMaintenance.itemId}
              onChange={(e) =>
                setNewMaintenance({ ...newMaintenance, itemId: e.target.value })
              }
              className="w-full p-2 border border-slate-300 rounded-lg outline-none bg-white"
            >
              <option value="">Seleccionar Equipo...</option>
              {inventory.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} ({i.category})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Fecha */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Fecha
              </label>
              <input
                type="date"
                value={newMaintenance.date}
                onChange={(e) =>
                  setNewMaintenance({ ...newMaintenance, date: e.target.value })
                }
                className="w-full p-2 border border-slate-300 rounded-lg outline-none"
              />
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tipo
              </label>
              <select
                value={newMaintenance.type}
                onChange={(e) =>
                  setNewMaintenance({ ...newMaintenance, type: e.target.value })
                }
                className="w-full p-2 border border-slate-300 rounded-lg outline-none bg-white"
              >
                <option value="Preventivo">Preventivo</option>
                <option value="Correctivo">Correctivo</option>
                <option value="Instalación">Instalación</option>
              </select>
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notas / Razón
            </label>
            <textarea
              value={newMaintenance.notes}
              onChange={(e) =>
                setNewMaintenance({ ...newMaintenance, notes: e.target.value })
              }
              className="w-full p-2 border border-slate-300 rounded-lg outline-none h-24 resize-none"
              placeholder="Detalles del trabajo a realizar..."
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700"
            >
              Agendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
