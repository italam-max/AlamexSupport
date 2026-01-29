import React, { useState } from 'react';

// Constantes necesarias para este modal
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

export default function AddItemModal({ onClose, onSave }) {
  // Estado local del formulario
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Computadoras',
    location: '',
    status: 'Activo',
  });

  const handleSubmit = () => {
    onSave(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
        <h3 className="text-lg font-bold mb-4">Agregar Nuevo Equipo</h3>
        <div className="space-y-4">
          {/* Campo Nombre */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nombre / Modelo
            </label>
            <input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ej: Laptop Dell Latitude"
            />
          </div>

          {/* Selector Categoría */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Categoría
            </label>
            <select
              value={newItem.category}
              onChange={(e) =>
                setNewItem({ ...newItem, category: e.target.value })
              }
              className="w-full p-2 border border-slate-300 rounded-lg outline-none bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Campo Ubicación */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Ubicación
            </label>
            <input
              value={newItem.location}
              onChange={(e) =>
                setNewItem({ ...newItem, location: e.target.value })
              }
              className="w-full p-2 border border-slate-300 rounded-lg outline-none"
              placeholder="Ej: Oficina Ventas"
            />
          </div>

          {/* Botones de Acción (Aquí estaba el error) */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
