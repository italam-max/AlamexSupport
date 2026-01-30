import React, { useState } from 'react';
import { X, User, Briefcase, Mail, Save, Trash2, Key, Shield, Box, Plus, Eye, EyeOff, Lock } from 'lucide-react';

export default function UserDetailModal({ user, onUpdate, onDelete, onClose }) {
  if (!user) return null;

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    department: user.department,
    role: user.role,
    app_access_level: user.app_access_level || 'Soporte' // Default
  });

  const [accounts, setAccounts] = useState(user.assigned_accounts || []);
  const [newAccount, setNewAccount] = useState({ app: '', username: '', password: '' });
  const [showPassword, setShowPassword] = useState({});

  const [licenses, setLicenses] = useState(user.software_licenses || {});
  const [accessories, setAccessories] = useState(user.accessories || {});

  const handleProfileSave = () => {
    onUpdate(user.id, profileData);
    setIsEditingProfile(false);
  };

  const toggleLicense = (key) => {
    const updated = { ...licenses, [key]: !licenses[key] };
    setLicenses(updated);
    onUpdate(user.id, { software_licenses: updated });
  };

  const toggleAccessory = (key) => {
    const updated = { ...accessories, [key]: !accessories[key] };
    setAccessories(updated);
    onUpdate(user.id, { accessories: updated });
  };

  const addAccount = () => {
    if (!newAccount.app || !newAccount.username) return;
    const updatedAccounts = [...accounts, { ...newAccount, id: Date.now() }];
    setAccounts(updatedAccounts);
    onUpdate(user.id, { assigned_accounts: updatedAccounts });
    setNewAccount({ app: '', username: '', password: '' });
  };

  const removeAccount = (accountId) => {
    const updatedAccounts = accounts.filter(a => a.id !== accountId);
    setAccounts(updatedAccounts);
    onUpdate(user.id, { assigned_accounts: updatedAccounts });
  };

  const togglePassVisibility = (id) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // MANEJADOR DE ELIMINACIÓN
  const handleDeleteUser = () => {
    if (confirm('¿Estás seguro de que deseas eliminar este colaborador? Esta acción no se puede deshacer.')) {
      onDelete(user.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[90vh]">
        
        {/* Header */}
        <div className="bg-tech-900 text-white p-6 flex justify-between items-start shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-neon-400 rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
          
          <div className="flex items-center gap-5 relative z-10">
            <div className="h-20 w-20 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 text-neon-400 font-black text-3xl shadow-[0_0_30px_rgba(212,255,0,0.1)]">
               {user.name.charAt(0)}
            </div>
            <div className="flex-1">
               {isEditingProfile ? (
                 <div className="grid grid-cols-2 gap-2 max-w-md animate-in fade-in">
                    <input value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white font-bold" />
                    <input value={profileData.role} onChange={e => setProfileData({...profileData, role: e.target.value})} className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm" />
                    <input value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm col-span-2" />
                    
                    {/* NUEVO: SELECTOR DE ROL DE APP */}
                    <select 
                      value={profileData.app_access_level} 
                      onChange={e => setProfileData({...profileData, app_access_level: e.target.value})}
                      className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm col-span-2"
                    >
                      <option value="Soporte" className="text-black">Nivel: Soporte (Estándar)</option>
                      <option value="Admin" className="text-black">Nivel: Administrador</option>
                      <option value="Visita" className="text-black">Nivel: Solo Lectura</option>
                    </select>

                    <div className="col-span-2 flex gap-2 mt-1">
                      <button onClick={handleProfileSave} className="bg-neon-400 text-tech-900 px-3 py-1 rounded text-xs font-bold">Guardar</button>
                      <button onClick={() => setIsEditingProfile(false)} className="bg-white/10 text-white px-3 py-1 rounded text-xs">Cancelar</button>
                    </div>
                 </div>
               ) : (
                 <>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-neon-400 text-tech-900 uppercase tracking-widest">
                        {user.department}
                      </span>
                      {/* Badge de Nivel de Acceso */}
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold border border-white/20 text-slate-300 uppercase tracking-widest flex items-center gap-1">
                        <Lock size={10} /> {user.app_access_level || 'Soporte'}
                      </span>
                      <button onClick={() => setIsEditingProfile(true)} className="text-slate-400 hover:text-white text-xs underline ml-2">Editar Perfil</button>
                    </div>
                    <h2 className="text-3xl font-black tracking-tighter text-white">{user.name}</h2>
                    <p className="text-sm text-slate-400 font-mono flex items-center gap-2">
                      <Briefcase size={12} /> {user.role} • <Mail size={12} /> {user.email}
                    </p>
                 </>
               )}
            </div>
          </div>
          
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
            <X size={28} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Columna Izquierda: Accesos y Licencias */}
            <div className="lg:col-span-1 space-y-6">
               <div className="bg-white p-5 rounded-2xl shadow-premium border border-slate-100">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <Shield size={14} /> Licencias Asignadas
                  </h3>
                  <div className="space-y-2">
                     {['adobe', 'office', 'autocad'].map(lic => (
                        <label key={lic} className={`cursor-pointer px-3 py-2 rounded-lg border text-xs font-bold flex items-center gap-2 transition-all ${licenses[lic] ? 'bg-tech-900 text-white border-tech-900' : 'bg-white border-slate-200 text-slate-500'}`}>
                           <input type="checkbox" className="hidden" checked={!!licenses[lic]} onChange={() => toggleLicense(lic)} />
                           <div className={`w-3 h-3 rounded-full border ${licenses[lic] ? 'bg-neon-400 border-neon-400' : 'border-slate-300'}`}></div>
                           {lic === 'adobe' ? 'Adobe Creative Cloud' : lic === 'office' ? 'Microsoft 365' : 'AutoCAD'}
                        </label>
                     ))}
                  </div>
               </div>

               <div className="bg-white p-5 rounded-2xl shadow-premium border border-slate-100">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <Box size={14} /> Kit de Accesorios
                  </h3>
                  <div className="space-y-2">
                     {[
                       { k: 'mouse', l: 'Mouse Inalámbrico' },
                       { k: 'backpack', l: 'Mochila Corporativa' },
                       { k: 'charger', l: 'Cargador Original' }
                     ].map(acc => (
                        <label key={acc.k} className="flex items-center justify-between text-sm group cursor-pointer">
                           <span className={`transition-colors ${accessories[acc.k] ? 'text-tech-900 font-bold' : 'text-slate-500'}`}>{acc.l}</span>
                           <div className={`w-10 h-5 rounded-full p-1 transition-colors ${accessories[acc.k] ? 'bg-tech-900' : 'bg-slate-200'}`}>
                              <input type="checkbox" className="hidden" checked={!!accessories[acc.k]} onChange={() => toggleAccessory(acc.k)} />
                              <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${accessories[acc.k] ? 'translate-x-5' : 'translate-x-0'}`}></div>
                           </div>
                        </label>
                     ))}
                  </div>
               </div>

               {/* ZONA DE PELIGRO: ELIMINAR USUARIO */}
               <div className="mt-8 pt-6 border-t border-slate-200">
                  <button 
                    onClick={handleDeleteUser}
                    className="w-full py-3 border border-red-200 text-red-600 bg-red-50 rounded-xl font-bold text-xs hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} /> Eliminar Colaborador
                  </button>
               </div>
            </div>

            {/* Columna Derecha: Bóveda */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-premium border border-slate-100 min-h-[400px]">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Key size={16} className="text-neon-400" />
                      Cuentas y Accesos Asignados
                    </h3>
                    <span className="text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded font-bold border border-red-100">CONFIDENCIAL</span>
                 </div>

                 <div className="space-y-3 mb-6">
                    {accounts.length > 0 ? accounts.map((acc) => (
                      <div key={acc.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl group hover:border-tech-900 transition-colors">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-lg text-tech-900 border border-slate-200">
                               {acc.app.charAt(0).toUpperCase()}
                            </div>
                            <div>
                               <p className="font-bold text-tech-900 text-sm">{acc.app}</p>
                               <p className="text-xs text-slate-500 font-mono select-all">User: {acc.username}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-3">
                            <div className="bg-white px-3 py-1.5 rounded border border-slate-200 flex items-center gap-2 font-mono text-xs">
                               {showPassword[acc.id] ? (
                                 <span className="text-tech-900 font-bold select-all">{acc.password}</span>
                               ) : (
                                 <span className="text-slate-400 tracking-widest">••••••••</span>
                               )}
                               <button onClick={() => togglePassVisibility(acc.id)} className="text-slate-400 hover:text-tech-900">
                                  {showPassword[acc.id] ? <EyeOff size={14}/> : <Eye size={14}/>}
                               </button>
                            </div>
                            <button onClick={() => removeAccount(acc.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                               <Trash2 size={16} />
                            </button>
                         </div>
                      </div>
                    )) : (
                      <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
                        <Key className="mx-auto text-slate-300 mb-2" size={32} />
                        <p className="text-sm text-slate-400">No hay cuentas asignadas.</p>
                      </div>
                    )}
                 </div>

                 <div className="bg-tech-900/5 p-4 rounded-xl border border-tech-900/10">
                    <h4 className="text-xs font-bold text-tech-900 mb-3 uppercase">Agregar Nuevo Acceso</h4>
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                       <input placeholder="Aplicación (Ej. NAS)" className="md:col-span-2 p-2 bg-white border border-slate-200 rounded text-sm focus:border-tech-900 outline-none" value={newAccount.app} onChange={e => setNewAccount({...newAccount, app: e.target.value})} />
                       <input placeholder="Usuario" className="md:col-span-2 p-2 bg-white border border-slate-200 rounded text-sm focus:border-tech-900 outline-none" value={newAccount.username} onChange={e => setNewAccount({...newAccount, username: e.target.value})} />
                       <input placeholder="Contraseña" className="md:col-span-2 p-2 bg-white border border-slate-200 rounded text-sm focus:border-tech-900 outline-none" value={newAccount.password} onChange={e => setNewAccount({...newAccount, password: e.target.value})} />
                       <button onClick={addAccount} className="bg-tech-900 text-white rounded hover:bg-neon-400 hover:text-tech-900 transition-colors flex items-center justify-center"><Plus size={20} /></button>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}