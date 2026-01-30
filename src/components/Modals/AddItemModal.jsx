import React, { useState } from 'react';
import { X, Save, Box, User } from 'lucide-react';

export default function AddItemModal({ users = [], onClose, onSave }) {
  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    name: '',
    category: 'Computadoras',
    location: '',
    status: 'Activo',
    assigned_to: '' // ID del usuario (vacío por defecto)
  });

  // Estado para especificaciones dinámicas
  const [specs, setSpecs] = useState({});

  // Configuración de campos por categoría
  const DYNAMIC_FIELDS = {
    'Impresoras': [
      { key: 'install_date', label: 'Fecha Instalación', type: 'date' },
      { key: 'ink_model', label: 'Modelo de Toner/Tinta', type: 'text' },
      { key: 'ip_address', label: 'Dirección IP', type: 'text' }
    ],
    'Computadoras': [
      { key: 'os', label: 'Sistema Operativo', type: 'text' },
      { key: 'processor', label: 'Procesador', type: 'text' },
      { key: 'ram', label: 'Memoria RAM', type: 'text' },
      { key: 'storage', label: 'Disco Duro', type: 'text' }
    ],
    'Celulares': [
      { key: 'imei', label: 'IMEI', type: 'text' },
      { key: 'phone_number', label: 'Número Telefónico', type: 'text' },
      { key: 'plan_type', label: 'Plan de Datos', type: 'text' }
    ]
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Lógica automática: Si asignas usuario -> Estado 'Asignado', si quitas -> Estado 'Activo'
    if (name === 'assigned_to') {
       if (value !== '') {
          setFormData(prev => ({ ...prev, [name]: value, status: 'Asignado' }));
       } else {
          setFormData(prev => ({ ...prev, [name]: value, status: 'Activo' }));
       }
    } else if (name === 'category') {
      // Si cambia categoría, limpiamos specs y asignación
      setSpecs({});
      setFormData(prev => ({ ...prev, category: value, assigned_to: '' })); 
    } else {
       setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSpecChange = (key, value) => {
    setSpecs({ ...specs, [key]: value });
  };

  // MANEJO DE GUARDADO (Async/Await para esperar a la DB)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Llamamos a la función onSave y esperamos el resultado (true/false)
    const success = await onSave({ ...formData, specs }); 
    
    // Solo cerramos si se guardó correctamente
    if (success) {
      onClose();
    }
  };

  const currentFields = DYNAMIC_FIELDS[formData.category] || [];
  
  // Categorías que permiten asignación directa
  const canBeAssigned = ['Computadoras', 'Celulares'].includes(formData.category);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        <div className="bg-tech-900 text-white p-5 flex justify-between items-center">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Box className="text-neon-400" size={20} />
            Nuevo Activo
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre / Modelo</label>
              <input 
                name="name" 
                required 
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-tech-900 focus:ring-1 focus:ring-tech-900 outline-none transition-all font-medium"
                placeholder="Ej. HP LaserJet Pro M404"
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Categoría</label>
              <select 
                name="category" 
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                onChange={handleChange}
                value={formData.category}
              >
                {['Computadoras', 'Impresoras', 'Celulares', 'Mouse/Teclados', 'Otros'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ubicación</label>
              <input 
                name="location" 
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                placeholder={canBeAssigned ? "Ej. Remoto / Oficina" : "Ej. Oficina RH"}
                onChange={handleChange}
              />
            </div>

            {/* CAMPO DE ASIGNACIÓN CONDICIONAL (Solo Laps y Celulares) */}
            {canBeAssigned && (
               <div className="col-span-2 bg-neon-400/10 p-3 rounded-lg border border-neon-400/20">
                  <label className="block text-xs font-bold text-tech-900 uppercase mb-1 flex items-center gap-2">
                     <User size={12} /> Asignar a Colaborador
                  </label>
                  <select 
                    name="assigned_to" 
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-neon-400"
                    onChange={handleChange}
                    value={formData.assigned_to}
                  >
                     <option value="">-- Sin asignar (Stock) --</option>
                     {users.map(u => (
                        <option key={u.id} value={u.id}>{u.name} - {u.department}</option>
                     ))}
                  </select>
                  {formData.assigned_to && (
                     <p className="text-[10px] text-emerald-600 font-bold mt-1">
                        * El estado cambiará a "Asignado"
                     </p>
                  )}
               </div>
            )}
          </div>

          {/* Especificaciones Técnicas */}
          {currentFields.length > 0 && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 border-dashed">
              <h3 className="text-xs font-bold text-tech-900 uppercase mb-3 border-b border-slate-200 pb-2">
                Especificaciones Técnicas ({formData.category})
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {currentFields.map((field) => (
                  <div key={field.key} className={field.type === 'text' && currentFields.length % 2 !== 0 && field.key === currentFields[currentFields.length-1].key ? "col-span-2" : ""}>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{field.label}</label>
                    <input 
                      type={field.type}
                      className="w-full p-2 bg-white border border-slate-200 rounded text-sm focus:border-neon-400 outline-none"
                      onChange={(e) => handleSpecChange(field.key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-tech-900">Cancelar</button>
            <button type="submit" className="px-6 py-2 bg-tech-900 text-white text-sm font-bold rounded-lg shadow-lg hover:bg-neon-400 hover:text-tech-900 transition-all flex items-center gap-2">
              <Save size={16} /> Guardar Ficha
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}