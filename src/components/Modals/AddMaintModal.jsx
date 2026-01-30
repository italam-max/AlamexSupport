import React, { useState } from 'react';
import { X, Save, Calendar, User } from 'lucide-react';

export default function AddMaintModal({ inventory, users = [], onClose, onSave }) {
  const [formData, setFormData] = useState({
    itemId: '',
    type: 'Preventivo',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    registered_by: '' 
  });

  // --- LÓGICA DE FILTRADO ROBUSTA ---
  // Filtramos la lista de usuarios para mostrar solo a los técnicos.
  const technicians = users.filter(u => {
    const level = u.app_access_level;
    
    // CASO 1: Usuarios antiguos (campo vacío, null o undefined)
    // Los dejamos pasar por defecto para que no desaparezcan.
    if (!level || level === '') return true;
    
    // CASO 2: Usuarios nuevos con rol definido
    // Solo permitimos 'Admin' o 'Soporte'. ('Visita' queda fuera)
    return level === 'Admin' || level === 'Soporte';
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validación: Obligatorio seleccionar técnico
    if (!formData.registered_by) {
        alert("Por favor selecciona quién está realizando el servicio.");
        return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-tech-900 text-white p-5 flex justify-between items-center">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Calendar className="text-neon-400" size={20} />
            Programar Mantenimiento
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Selector de Equipo */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Equipo / Activo</label>
            <select 
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
              value={formData.itemId}
              onChange={(e) => setFormData({...formData, itemId: e.target.value})}
              required
            >
              <option value="">-- Seleccionar Equipo --</option>
              {inventory.map(i => (
                <option key={i.id} value={i.id}>{i.name} ({i.location})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Tipo de Servicio */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo Servicio</label>
              <select 
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option>Preventivo</option>
                <option>Correctivo</option>
                <option>Instalación</option>
                <option>Limpieza</option>
              </select>
            </div>
            {/* Fecha */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha Programada</label>
              <input 
                type="date"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
            </div>
          </div>

          {/* SELECTOR DE RESPONSABLE (TÉCNICO) */}
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
             <label className="block text-xs font-bold text-blue-800 uppercase mb-1 flex items-center gap-2">
               <User size={12} /> Asignar Responsable
             </label>
             <select 
                className="w-full p-2 bg-white border border-blue-200 rounded-lg outline-none text-sm"
                value={formData.registered_by}
                onChange={(e) => setFormData({...formData, registered_by: e.target.value})}
                required
             >
                <option value="">-- ¿Quién realizará el servicio? --</option>
                {technicians.length > 0 ? (
                  technicians.map(u => (
                     <option key={u.id} value={u.id}>
                       {u.name} {u.role ? `(${u.role})` : ''}
                     </option>
                  ))
                ) : (
                  <option disabled>No se encontraron técnicos activos</option>
                )}
             </select>
             {technicians.length === 0 && (
                <p className="text-[10px] text-red-500 mt-1 font-medium">
                   * Nota: Asegúrate de que los usuarios tengan permiso 'Soporte' o 'Admin'.
                </p>
             )}
          </div>

          {/* Notas */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Notas / Instrucciones</label>
            <textarea 
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none h-24 resize-none"
              placeholder="Detalles del trabajo a realizar..."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            ></textarea>
          </div>

          {/* Footer Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-tech-900">Cancelar</button>
            <button type="submit" className="px-6 py-2 bg-tech-900 text-white text-sm font-bold rounded-lg shadow-lg hover:bg-neon-400 hover:text-tech-900 transition-all flex items-center gap-2">
              <Save size={16} /> Agendar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}