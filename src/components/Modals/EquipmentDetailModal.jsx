import React, { useState } from 'react';
import { X, Activity, Printer, Server, Droplet, Wrench, AlertTriangle, Save, Cpu, CheckSquare, Smartphone, Monitor, BarChart3, Edit2, Check, User, Archive } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Cell, YAxis } from 'recharts';
import { toast } from 'sonner';
// IMPORTAMOS CONFIRM MODAL
import ConfirmModal from './ConfirmModal';

const CustomDot = (props) => {
  const { cx, cy, payload } = props;
  if (payload.type === 'Tinta' || payload.type === 'Insumo') {
    return (
      <circle cx={cx} cy={cy} r={6} stroke="white" strokeWidth={2} fill="#D4FF00" />
    );
  }
  return null;
};

const MAINTENANCE_CHECKLISTS = {
  'Impresoras': [
    { key: 'rodillos', label: 'Limpieza de Rodillos' },
    { key: 'carcasa', label: 'Limpieza de Carcasa' },
    { key: 'sopleteado', label: 'Sopleteada Interna' },
    { key: 'prueba', label: 'Prueba de Impresión' }
  ],
  'Computadoras': [
    { key: 'sopleteado', label: 'Sopleteado Interno/Ventiladores' },
    { key: 'pantalla', label: 'Limpieza Pantalla/Teclado' },
    { key: 'temporales', label: 'Borrado Archivos Temp.' },
    { key: 'updates', label: 'Actualizaciones de Sistema' }
  ],
  'Celulares': [
    { key: 'puerto', label: 'Limpieza Puerto de Carga' },
    { key: 'pantalla', label: 'Limpieza y Desinfección' },
    { key: 'bateria', label: 'Diagnóstico de Batería' },
    { key: 'apps', label: 'Depuración de Apps' }
  ],
  'Default': [
    { key: 'limpieza', label: 'Limpieza General' },
    { key: 'funcionamiento', label: 'Prueba de Funcionamiento' },
    { key: 'cableado', label: 'Revisión de Cableado' }
  ]
};

// RECIBIMOS onDelete
export default function EquipmentDetailModal({ item, maintenanceHistory, users = [], onAddLog, onUpdate, onDelete, onClose }) {
  const [showLogForm, setShowLogForm] = useState(false);
  const [logType, setLogType] = useState(''); 
  const [logData, setLogData] = useState({
    notes: '',
    consumables: { black: false, cyan: false, magenta: false, yellow: false },
    maintenanceChecks: {},
    registered_by: '' 
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    location: item.location || '',
    purchase_date: item.specs?.purchase_date || '',
    ip_address: item.specs?.ip_address || '',
    status: item.status || 'Activo' 
  });

  // ESTADO PARA CONFIRMACIONES
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    action: null
  });

  if (!item) return null;
  const isPrinter = item.category === 'Impresoras';
  const activeChecklist = MAINTENANCE_CHECKLISTS[item.category] || MAINTENANCE_CHECKLISTS['Default'];
  
  // Header Style Dinámico
  const isArchived = item.status === 'Baja' || item.status === 'Archivado';
  const headerBg = isArchived ? 'bg-slate-800' : 'bg-tech-900';
  const accentColor = isArchived ? 'text-slate-400' : 'text-neon-400';

  let technicians = users.filter(u => {
    if (!u.app_access_level) return true;
    const level = u.app_access_level.toLowerCase();
    return level.includes('admin') || level.includes('soporte');
  });

  if (technicians.length === 0 && users.length > 0) {
     technicians = users;
  }

  const HeaderIcon = () => {
    if (item.category === 'Impresoras') return <Printer size={40} strokeWidth={1.5} />;
    if (item.category === 'Celulares') return <Smartphone size={40} strokeWidth={1.5} />;
    if (item.category === 'Computadoras') return <Monitor size={40} strokeWidth={1.5} />;
    return <Server size={40} strokeWidth={1.5} />;
  };

  // --- CORRECCIÓN AQUÍ: Usamos '==' para evitar problemas de tipos (string vs number) ---
  const history = maintenanceHistory
    .filter(m => m.item_id == item.id || m.itemName === item.name)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const chartData = history.map(h => ({
    date: h.date,
    value: h.type === 'Tinta' || h.type === 'Insumo' ? 10 : 5, 
    type: h.type,
    desc: h.notes
  }));

  const inkStats = [
    { name: 'Negra', count: 0, color: '#1f2937' },    
    { name: 'Cian', count: 0, color: '#06b6d4' },     
    { name: 'Magenta', count: 0, color: '#d946ef' },  
    { name: 'Amarilla', count: 0, color: '#eab308' }, 
  ];

  if (isPrinter) {
    history.forEach(h => {
      if (h.type === 'Tinta') {
        if (h.notes.includes('Negra')) inkStats[0].count++;
        if (h.notes.includes('Cian')) inkStats[1].count++;
        if (h.notes.includes('Magenta')) inkStats[2].count++;
        if (h.notes.includes('Amarilla')) inkStats[3].count++;
      }
    });
  }

  // --- CORRECCIÓN PRINCIPAL: ASYNC / AWAIT ---
  const handleQuickSave = async () => {
    if (!logData.registered_by) {
        toast.error("Debes seleccionar un técnico autorizado.");
        return;
    }

    let finalNotes = logData.notes;
    if (logType === 'Tinta') {
       const colors = [];
       if (logData.consumables.black) colors.push('Negra');
       if (logData.consumables.cyan) colors.push('Cian');
       if (logData.consumables.magenta) colors.push('Magenta');
       if (logData.consumables.yellow) colors.push('Amarilla');
       finalNotes = `Cambio de Cartucho/Toner: ${colors.join(', ')}. ${logData.notes}`;
    }
    
    if (logType === 'Limpieza') {
       const checks = [];
       activeChecklist.forEach(check => {
          if (logData.maintenanceChecks[check.key]) checks.push(check.label);
       });
       const checkString = checks.length > 0 ? `Tareas realizadas: ${checks.join(', ')}.` : 'Mantenimiento General.';
       finalNotes = `${checkString} ${logData.notes}`;
    }

    const newLog = {
      item_id: item.id,
      itemName: item.name,
      type: logType, 
      date: new Date().toISOString().split('T')[0],
      notes: finalNotes,
      status: 'Completado',
      registered_by: logData.registered_by
    };

    // AQUI ESPERAMOS LA CONFIRMACION
    const success = await onAddLog(newLog); 

    if (success) {
        toast.success("Registro guardado y gráfica actualizada");
        setShowLogForm(false);
        setLogData({ 
          notes: '', 
          consumables: { black: false, cyan: false, magenta: false, yellow: false },
          maintenanceChecks: {},
          registered_by: ''
        });
    } else {
        toast.error("Error al guardar en base de datos. Verifica la conexión.");
    }
  };

  const handleCheckChange = (key, checked) => {
    setLogData(prev => ({
      ...prev,
      maintenanceChecks: { ...prev.maintenanceChecks, [key]: checked }
    }));
  };

  const handleUpdateItem = async () => {
    const updatedSpecs = {
      ...item.specs,
      purchase_date: editForm.purchase_date,
      ip_address: editForm.ip_address
    };

    const updates = {
      location: editForm.location,
      status: editForm.status, 
      specs: updatedSpecs
    };

    const success = await onUpdate(item.id, updates);
    if (success) {
      toast.success("Información actualizada");
      setIsEditing(false);
    } else {
      toast.error("Error al actualizar");
    }
  };

  // --- ACCIONES DE CONFIRMACIÓN ---
  const requestArchiveItem = () => {
     setConfirmConfig({
       isOpen: true,
       title: 'Archivar Equipo',
       message: `¿Deseas dar de baja el equipo "${item.name}"? Pasará a estado "Baja" y no se mostrará como activo.`,
       action: async () => {
          await onUpdate(item.id, { status: 'Baja' });
          toast.success("Equipo archivado/dado de baja");
          onClose();
       }
     });
  };

  const requestDeleteItem = () => {
     setConfirmConfig({
       isOpen: true,
       title: 'Eliminar Definitivamente',
       message: `ADVERTENCIA: Esto borrará el equipo "${item.name}" y TODO su historial de mantenimiento. No se puede deshacer.`,
       action: async () => {
          if (onDelete) {
             const success = await onDelete(item.id);
             if (success) {
                toast.success("Equipo eliminado permanentemente");
                onClose();
             } else {
                toast.error("Error al eliminar");
             }
          }
       }
     });
  };

  const handleConfirmAction = () => {
     if (confirmConfig.action) confirmConfig.action();
     setConfirmConfig({ ...confirmConfig, isOpen: false });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[90vh]">
          
          {/* Header Dinámico */}
          <div className={`${headerBg} text-white p-6 flex justify-between items-start shrink-0 relative overflow-hidden transition-colors duration-500`}>
            <div className="absolute top-0 right-0 w-96 h-96 bg-neon-400 rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
            
            <div className="flex items-center gap-5 relative z-10">
              <div className={`h-20 w-20 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 ${accentColor} shadow-[0_0_30px_rgba(255,255,255,0.1)]`}>
                 <HeaderIcon />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-neon-400 text-tech-900 uppercase tracking-widest">
                    {item.category}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border uppercase tracking-widest ${
                      item.status === 'Activo' ? 'border-green-500 text-green-400' : 
                      item.status === 'Baja' ? 'border-slate-500 text-slate-400 bg-slate-700' :
                      'border-red-500 text-red-400'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <h2 className={`text-3xl font-black tracking-tighter ${isArchived ? 'text-slate-300' : 'text-white'}`}>{item.name}</h2>
                <p className="text-sm text-slate-400 font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                  ID: {String(item.id).slice(0, 8)}
                </p>
              </div>
            </div>
            
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
              <X size={28} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Columna Izquierda */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-5 rounded-2xl shadow-premium border border-slate-100">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Registro Rápido</h3>
                  
                  {!showLogForm ? (
                    <div className="grid grid-cols-2 gap-3">
                      {isPrinter && (
                        <button onClick={() => { setLogType('Tinta'); setShowLogForm(true); }} className="col-span-2 p-3 bg-tech-900 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-neon-400 hover:text-tech-900 transition-all font-bold text-sm group">
                          <Droplet size={18} className="group-hover:fill-current" /> Registrar Tinta
                        </button>
                      )}
                      <button onClick={() => { setLogType('Limpieza'); setShowLogForm(true); }} className="p-3 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl hover:border-tech-900 hover:text-tech-900 transition-all font-bold text-xs flex flex-col items-center gap-2">
                        <Wrench size={20} /> Mantenimiento
                      </button>
                      <button onClick={() => { setLogType('Correctivo'); setShowLogForm(true); }} className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-500 hover:text-white transition-all font-bold text-xs flex flex-col items-center gap-2">
                        <AlertTriangle size={20} /> Reportar Falla
                      </button>
                    </div>
                  ) : (
                    <div className="animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-tech-900">
                          {logType === 'Tinta' ? 'Cambio de Cartuchos' : logType === 'Limpieza' ? 'Checklist Preventivo' : 'Reporte de Falla'}
                        </span>
                        <button onClick={() => setShowLogForm(false)} className="text-slate-400 hover:text-red-500"><X size={16}/></button>
                      </div>
                      
                      {logType === 'Tinta' && (
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {['black', 'cyan', 'magenta', 'yellow'].map(color => (
                            <label key={color} className={`cursor-pointer p-2 rounded-lg border text-xs font-bold flex items-center gap-2 transition-all ${logData.consumables[color] ? 'bg-tech-900 text-white border-tech-900' : 'bg-white border-slate-200 text-slate-500'}`}>
                              <input type="checkbox" className="hidden" checked={logData.consumables[color]} onChange={(e) => setLogData({...logData, consumables: {...logData.consumables, [color]: e.target.checked}})} />
                              <span className={`w-2 h-2 rounded-full ${color === 'black' ? 'bg-black' : color === 'cyan' ? 'bg-cyan-400' : color === 'magenta' ? 'bg-pink-500' : 'bg-yellow-400'} border border-slate-300`}></span>
                              {color.charAt(0).toUpperCase() + color.slice(1)}
                            </label>
                          ))}
                        </div>
                      )}

                      {logType === 'Limpieza' && (
                        <div className="space-y-2 mb-3">
                          {activeChecklist.map((checkItem) => (
                            <label key={checkItem.key} className={`cursor-pointer p-2 rounded-lg border text-xs font-bold flex items-center gap-2 transition-all ${logData.maintenanceChecks[checkItem.key] ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white border-slate-200 text-slate-500'}`}>
                              <div className={`w-4 h-4 rounded border flex items-center justify-center ${logData.maintenanceChecks[checkItem.key] ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                                  {logData.maintenanceChecks[checkItem.key] && <CheckSquare size={10} className="text-white" />}
                              </div>
                              <input type="checkbox" className="hidden" checked={!!logData.maintenanceChecks[checkItem.key]} onChange={(e) => handleCheckChange(checkItem.key, e.target.checked)} />
                              {checkItem.label}
                            </label>
                          ))}
                        </div>
                      )}

                      <div className="mb-3">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                            <User size={10} /> Realizado por:
                        </label>
                        <select 
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-neon-400"
                            value={logData.registered_by}
                            onChange={(e) => setLogData({...logData, registered_by: e.target.value})}
                        >
                            <option value="">-- Técnico Autorizado --</option>
                            {technicians.length > 0 ? (
                              technicians.map(u => (
                                <option key={u.id} value={u.id}>{u.name} ({u.role || 'Soporte'})</option>
                              ))
                            ) : (
                              <option disabled>No hay técnicos asignados</option>
                            )}
                        </select>
                      </div>
                      
                      <textarea className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm mb-3 focus:outline-none focus:border-neon-400" placeholder={logType === 'Correctivo' ? "Describe la falla detalladamente..." : "Observaciones adicionales..."} rows={logType === 'Correctivo' ? 4 : 2} value={logData.notes} onChange={(e) => setLogData({...logData, notes: e.target.value})}></textarea>
                      
                      {/* BOTON DE GUARDADO */}
                      <button onClick={handleQuickSave} className={`w-full py-2 font-bold rounded-lg text-sm transition-all flex items-center justify-center gap-2 ${logType === 'Correctivo' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-neon-400 text-tech-900 hover:shadow-neon'}`}>
                        <Save size={16} /> {logType === 'Correctivo' ? 'Registrar Falla' : 'Guardar Registro'}
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Specs */}
                <div className="p-5 border border-slate-200 rounded-2xl bg-white relative">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Cpu size={14} /> Datos Clave
                    </h3>
                    {onUpdate && (
                      <button onClick={() => setIsEditing(!isEditing)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-tech-900 transition-colors">
                          <Edit2 size={14} />
                      </button>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Ubicación</label>
                        <input className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm focus:border-neon-400 outline-none font-bold text-tech-900" value={editForm.location} onChange={(e) => setEditForm({...editForm, location: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">IP Asignada</label>
                        <input className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm focus:border-neon-400 outline-none font-mono" value={editForm.ip_address} onChange={(e) => setEditForm({...editForm, ip_address: e.target.value})} />
                      </div>
                      <div>
                         <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Estado Operativo</label>
                         <select 
                           className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm focus:border-neon-400 outline-none"
                           value={editForm.status}
                           onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                         >
                            <option value="Activo">Activo</option>
                            <option value="Asignado">Asignado</option>
                            <option value="Alerta">En Alerta</option>
                            <option value="Baja">Baja / Fuera de Servicio</option>
                         </select>
                      </div>
                      <div className="flex gap-2 pt-2">
                          <button onClick={() => setIsEditing(false)} className="flex-1 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded">Cancelar</button>
                          <button onClick={handleUpdateItem} className="flex-1 py-2 bg-tech-900 text-white text-xs font-bold rounded hover:bg-neon-400 hover:text-tech-900 transition-colors flex items-center justify-center gap-1"><Check size={14} /> Guardar</button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                          <span className="text-slate-500">Ubicación</span>
                          <span className="font-bold text-tech-900">{item.location || 'Sin asignar'}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                          <span className="text-slate-500">IP Asignada</span>
                          <span className="font-bold text-tech-900 font-mono">{item.specs?.ip_address || '---'}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                          <span className="text-slate-500">Fecha Compra</span>
                          <span className="font-bold text-tech-900">{item.specs?.purchase_date || 'No registrada'}</span>
                      </div>
                    </div>
                  )}

                  {/* ZONA DE ARCHIVO (DANGER ZONE) */}
                  <div className="mt-8 pt-6 border-t border-slate-200 space-y-3">
                      <button 
                        onClick={requestArchiveItem}
                        className="w-full py-3 border border-slate-300 text-slate-600 bg-slate-100 rounded-xl font-bold text-xs hover:bg-slate-200 hover:text-slate-800 transition-colors flex items-center justify-center gap-2"
                      >
                        <Archive size={16} /> Dar de Baja (Archivar)
                      </button>
                      
                      <div className="text-center">
                        <button 
                            onClick={requestDeleteItem} 
                            className="text-[10px] text-red-300 hover:text-red-500 underline decoration-red-200"
                        >
                            Eliminar historial y equipo permanentemente
                        </button>
                      </div>
                   </div>

                </div>
              </div>

              {/* Columna Derecha (Gráficas y Logs) */}
              <div className="lg:col-span-2 space-y-6">
                 {isPrinter && (
                    <div className="bg-white p-6 rounded-2xl shadow-premium border border-slate-100 relative">
                       <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                         <BarChart3 size={16} className="text-neon-400" />
                         Análisis de Consumo de Stock
                       </h3>
                       <div className="h-48 w-full">
                         <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={inkStats} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                              <XAxis type="number" hide />
                              <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 11, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
                              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                                {inkStats.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Bar>
                           </BarChart>
                         </ResponsiveContainer>
                       </div>
                    </div>
                  )}

                  <div className="bg-white p-6 rounded-2xl shadow-premium border border-slate-100 h-64 relative">
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                       <Activity size={16} className="text-neon-400" />
                       Cronología de Eventos
                     </h3>
                     {chartData.length > 0 ? (
                       <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                           <defs>
                             <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#D4FF00" stopOpacity={0.3}/>
                               <stop offset="95%" stopColor="#D4FF00" stopOpacity={0}/>
                             </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                           <XAxis dataKey="date" tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                           <Tooltip contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }} itemStyle={{ color: '#D4FF00' }} formatter={(value, name, props) => [props.payload.type, 'Evento']} />
                           <Area type="monotone" dataKey="value" stroke="#D4FF00" strokeWidth={3} fillOpacity={1} fill="url(#colorActivity)" dot={<CustomDot />} />
                         </AreaChart>
                       </ResponsiveContainer>
                     ) : (
                       <div className="h-full flex flex-col items-center justify-center text-slate-400">
                         <Activity size={32} className="mb-2 opacity-20" />
                         <p className="text-sm">Sin actividad registrada</p>
                       </div>
                     )}
                  </div>
                  
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Bitácora de Eventos</h3>
                     <div className="space-y-4 max-h-60 overflow-y-auto">
                        {history.length > 0 ? history.map((h, i) => (
                          <div key={i} className="flex gap-4 group">
                            <div className="flex flex-col items-center">
                               <div className={`w-3 h-3 rounded-full border-2 ${h.type === 'Tinta' ? 'bg-tech-900 border-neon-400' : 'bg-white border-slate-300'}`}></div>
                               {i !== history.length -1 && <div className="w-0.5 h-full bg-slate-200 mt-1"></div>}
                            </div>
                            <div className="pb-4">
                               <p className="text-xs font-mono text-slate-400 mb-0.5">{h.date}</p>
                               <h4 className="text-sm font-bold text-tech-900">{h.type}</h4>
                               <p className="text-sm text-slate-600 mt-1">{h.notes}</p>
                            </div>
                          </div>
                        )) : (
                          <p className="text-sm text-slate-400 italic">No hay registros aún.</p>
                        )}
                     </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* MODAL DE CONFIRMACIÓN */}
      <ConfirmModal 
         isOpen={confirmConfig.isOpen}
         title={confirmConfig.title}
         message={confirmConfig.message}
         onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
         onConfirm={handleConfirmAction}
      />
    </>
  );
}