import React, { useState, useEffect } from 'react';
import { Monitor, ExternalLink, ShieldCheck, Plus, Minus, Eye, EyeOff } from 'lucide-react';
// @ts-ignore
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export const SoftwareView = ({ users, onUpdateUser }) => {
  const [selectedSoftware, setSelectedSoftware] = useState(null);
  const [softwareInventory, setSoftwareInventory] = useState({});
  const [showPassword, setShowPassword] = useState({});

  // Lista base de software
  const softwareList = [
    { id: 'adobe', name: 'Adobe Creative Cloud', color: 'text-red-600', bg: 'bg-red-50' },
    { id: 'office', name: 'Microsoft 365', color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'autocad', name: 'AutoCAD', color: 'text-orange-600', bg: 'bg-orange-50' },
    { id: 'dijipara', name: 'Dijipara', color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'solidworks', name: 'SolidWorks', color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { id: 'photoshop365', name: 'Photoshop 365', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: 'acrobat2019', name: 'Adobe Acrobat 2019', color: 'text-slate-600', bg: 'bg-slate-50' },
  ];

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    const { data, error } = await supabase.from('software_inventory').select('*');
    if (!error && data) {
      const invMap = {};
      data.forEach(item => { invMap[item.software_id] = item.total_licenses; });
      setSoftwareInventory(invMap);
    }
  };

  const updateLicenseCount = async (softId, newTotal) => {
    if (newTotal < 0) return;
    const { error } = await supabase
      .from('software_inventory')
      .upsert({ software_id: softId, total_licenses: newTotal });

    if (error) {
      toast.error("Error al actualizar inventario");
    } else {
      setSoftwareInventory(prev => ({ ...prev, [softId]: newTotal }));
      toast.success("Inventario actualizado");
    }
  };

  const getUsersForSoftware = (softId) => {
    return users.filter(user => user.software_licenses && user.software_licenses[softId]);
  };

  const togglePassVisibility = (userId) => {
    setShowPassword(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-3xl font-black text-tech-900 tracking-tighter uppercase">Control de Software</h2>
        <p className="text-sm text-slate-500 font-medium">Gestión de licencias, inventario y asignaciones</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {softwareList.map((soft) => {
          const assignedCount = getUsersForSoftware(soft.id).length;
          const totalCount = softwareInventory[soft.id] || 0;
          const remaining = totalCount - assignedCount;

          return (
            <div key={soft.id} className="bg-white rounded-2xl p-6 shadow-premium border border-slate-100 hover:border-tech-900 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-xl ${soft.bg} ${soft.color}`}>
                  <Monitor size={24} />
                </div>
                <button 
                  onClick={() => setSelectedSoftware(soft)}
                  className="px-4 py-2 bg-tech-900 text-neon-400 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-tech-800 transition-colors flex items-center gap-2"
                >
                  <ExternalLink size={12} /> Ficha
                </button>
              </div>

              <h3 className="font-bold text-tech-900 text-lg mb-1">{soft.name}</h3>
              
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-50">
                <div className="text-center">
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Total</p>
                  <p className="text-sm font-black text-tech-900">{totalCount}</p>
                </div>
                <div className="text-center border-x border-slate-100">
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Uso</p>
                  <p className="text-sm font-black text-blue-600">{assignedCount}</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Libres</p>
                  <p className={`text-sm font-black ${remaining < 0 ? 'text-red-500' : 'text-neon-600'}`}>
                    {remaining}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Ficha Técnica */}
      {selectedSoftware && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 bg-tech-900 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-neon-400" size={24} />
                <h3 className="text-xl font-black uppercase tracking-tighter">Ficha: {selectedSoftware.name}</h3>
              </div>
              <button onClick={() => setSelectedSoftware(null)} className="text-slate-400 hover:text-white transition-colors text-2xl">×</button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* CONTROL DE INVENTARIO */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Licencias Compradas</p>
                  <div className="flex items-center gap-4 mt-2">
                    <button 
                      onClick={() => updateLicenseCount(selectedSoftware.id, (softwareInventory[selectedSoftware.id] || 0) - 1)}
                      className="p-1 bg-white border border-slate-200 rounded-md hover:bg-red-50 text-red-500 shadow-sm"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-2xl font-black text-tech-900 w-12 text-center">
                      {softwareInventory[selectedSoftware.id] || 0}
                    </span>
                    <button 
                      onClick={() => updateLicenseCount(selectedSoftware.id, (softwareInventory[selectedSoftware.id] || 0) + 1)}
                      className="p-1 bg-white border border-slate-200 rounded-md hover:bg-neon-50 text-neon-600 shadow-sm"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Disponibles</p>
                  <p className={`text-2xl font-black ${(softwareInventory[selectedSoftware.id] || 0) - getUsersForSoftware(selectedSoftware.id).length < 0 ? 'text-red-500' : 'text-neon-600'}`}>
                    {(softwareInventory[selectedSoftware.id] || 0) - getUsersForSoftware(selectedSoftware.id).length}
                  </p>
                </div>
              </div>

              {/* LISTA DE USUARIOS Y CREDENCIALES */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Colaboradores y Credenciales Asignadas</p>
                <div className="space-y-4">
                  {getUsersForSoftware(selectedSoftware.id).length > 0 ? (
                    getUsersForSoftware(selectedSoftware.id).map(user => {
                      // Buscar la cuenta específica de este software en la bóveda del usuario
                      const accountDetail = (user.assigned_accounts || []).find(acc => acc.appId === selectedSoftware.id);

                      return (
                        <div key={user.id} className="flex flex-col p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                          {/* Cabecera del Usuario */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-tech-900 text-neon-400 flex items-center justify-center text-sm font-black">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-tech-900 text-sm">{user.name}</p>
                                <p className="text-[10px] text-slate-400 uppercase">{user.department} • {user.role}</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => {
                                // Al revocar, se quita la licencia y se borra la credencial de la bóveda
                                const newLicenses = { ...user.software_licenses, [selectedSoftware.id]: false };
                                const newAccounts = (user.assigned_accounts || []).filter(acc => acc.appId !== selectedSoftware.id);
                                onUpdateUser(user.id, { software_licenses: newLicenses, assigned_accounts: newAccounts });
                                toast.success("Acceso revocado correctamente");
                              }}
                              className="text-[10px] font-bold text-red-500 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-lg uppercase tracking-wider transition-colors"
                            >
                              Revocar Acceso
                            </button>
                          </div>

                          {/* Detalles de la Cuenta */}
                          {accountDetail ? (
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Correo Electrónico</p>
                                <p className="text-xs font-mono text-tech-900 select-all">{accountDetail.email || '—'}</p>
                              </div>
                              <div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Usuario</p>
                                <p className="text-xs font-mono text-tech-900 select-all">{accountDetail.username || '—'}</p>
                              </div>
                              <div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Contraseña</p>
                                <div className="flex items-center gap-2">
                                  <p className="text-xs font-mono text-tech-900 select-all">
                                    {showPassword[user.id] ? accountDetail.password : '••••••••'}
                                  </p>
                                  {accountDetail.password && (
                                    <button onClick={() => togglePassVisibility(user.id)} className="text-slate-400 hover:text-tech-900">
                                      {showPassword[user.id] ? <EyeOff size={14}/> : <Eye size={14}/>}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-orange-50 p-2 rounded-lg text-[10px] text-orange-600 font-bold border border-orange-100 flex items-center gap-2">
                              ⚠ Licencia activa pero sin credenciales registradas en bóveda.
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-10 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                      No hay colaboradores con acceso a este software.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};