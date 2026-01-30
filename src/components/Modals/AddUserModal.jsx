import React, { useState } from 'react';
import { X, Save, UserPlus, Shield, Box, Lock } from 'lucide-react';

export default function AddUserModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Operaciones',
    role: '', // Puesto (Ej. Gerente)
    app_access_level: 'Soporte', // Permiso del Sistema (Admin/Soporte/Visita)
    software_licenses: {
      adobe: false,
      office: false,
      autocad: false
    },
    accessories: {
      mouse: false,
      backpack: false,
      charger: false,
      charger_type: '' 
    }
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLicenseChange = (key) => {
    setFormData(prev => ({
      ...prev,
      software_licenses: { ...prev.software_licenses, [key]: !prev.software_licenses[key] }
    }));
  };

  const handleAccessoryChange = (key) => {
    setFormData(prev => ({
      ...prev,
      accessories: { ...prev.accessories, [key]: !prev.accessories[key] }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        <div className="bg-tech-900 text-white p-5 flex justify-between items-center shrink-0">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <UserPlus className="text-neon-400" size={20} />
            Nuevo Colaborador
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre Completo</label>
              <input name="name" required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-tech-900 outline-none font-bold text-tech-900" placeholder="Ej. Ana García" onChange={handleChange} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Correo Electrónico</label>
              <input name="email" type="email" required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none" placeholder="ana@alamex.com" onChange={handleChange} />
            </div>
            <div>
               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Departamento</label>
               <select name="department" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none" onChange={handleChange}>
                  <option>Operaciones</option>
                  <option>Ventas</option>
                  <option>Marketing</option>
                  <option>TI</option>
                  <option>Recursos Humanos</option>
                  <option>Dirección</option>
               </select>
            </div>
            
            {/* PUESTO (Role) */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Puesto / Cargo</label>
              <input name="role" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none" placeholder="Ej. Auxiliar Administrativo" onChange={handleChange} />
            </div>

            {/* PERMISO (App Access Level) - NUEVO CAMPO */}
            <div className="bg-neon-400/10 p-1 rounded-lg border border-neon-400/20">
              <label className="block text-[10px] font-bold text-tech-900 uppercase mb-1 ml-1 flex items-center gap-1">
                 <Lock size={10} /> Permisos de App
              </label>
              <select name="app_access_level" className="w-full p-1.5 bg-white border border-slate-200 rounded-md outline-none text-sm" onChange={handleChange} value={formData.app_access_level}>
                  <option value="Soporte">Soporte (Técnico)</option>
                  <option value="Admin">Administrador Total</option>
                  <option value="Visita">Solo Lectura (Usuario)</option>
              </select>
            </div>
          </div>

          <div className="h-px bg-slate-100 w-full"></div>

          <div>
            <h3 className="text-xs font-bold text-tech-900 uppercase mb-3 flex items-center gap-2">
               <Shield size={14} /> Licencias Asignadas
            </h3>
            <div className="flex gap-4">
               {['adobe', 'office', 'autocad'].map(lic => (
                  <label key={lic} className={`cursor-pointer px-3 py-2 rounded-lg border text-xs font-bold flex items-center gap-2 transition-all ${formData.software_licenses[lic] ? 'bg-tech-900 text-white border-tech-900' : 'bg-white border-slate-200 text-slate-500'}`}>
                     <input type="checkbox" className="hidden" checked={formData.software_licenses[lic]} onChange={() => handleLicenseChange(lic)} />
                     {lic === 'adobe' ? 'Adobe Creative Cloud' : lic === 'office' ? 'Microsoft 365' : 'AutoCAD'}
                  </label>
               ))}
            </div>
          </div>

          <div className="h-px bg-slate-100 w-full"></div>

          <div>
            <h3 className="text-xs font-bold text-tech-900 uppercase mb-3 flex items-center gap-2">
               <Box size={14} /> Kit de Accesorios
            </h3>
            <div className="grid grid-cols-2 gap-3">
               <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" checked={formData.accessories.mouse} onChange={() => handleAccessoryChange('mouse')} className="accent-tech-900 w-4 h-4" />
                  Mouse Inalámbrico
               </label>
               <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" checked={formData.accessories.backpack} onChange={() => handleAccessoryChange('backpack')} className="accent-tech-900 w-4 h-4" />
                  Mochila Corporativa
               </label>
               
               <div className="col-span-2 bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-slate-600 whitespace-nowrap">
                     <input type="checkbox" checked={formData.accessories.charger} onChange={() => handleAccessoryChange('charger')} className="accent-tech-900 w-4 h-4" />
                     Cargador Laptop
                  </label>
                  {formData.accessories.charger && (
                     <input 
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs" 
                        placeholder="Tipo (Ej. 65W USB-C)"
                        value={formData.accessories.charger_type}
                        onChange={(e) => setFormData(prev => ({...prev, accessories: {...prev.accessories, charger_type: e.target.value}}))}
                     />
                  )}
               </div>
            </div>
          </div>
        </form>

        <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
           <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-tech-900">Cancelar</button>
           <button onClick={handleSubmit} className="px-6 py-2 bg-tech-900 text-white text-sm font-bold rounded-lg shadow-lg hover:bg-neon-400 hover:text-tech-900 transition-all flex items-center gap-2">
             <Save size={16} /> Guardar Perfil
           </button>
        </div>
      </div>
    </div>
  );
}