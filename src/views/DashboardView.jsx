import React from 'react';
import { Activity, Users, Server, AlertTriangle, CheckCircle2, Clock, Smartphone, Monitor, Printer, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

export default function DashboardView({ inventory = [], maintenanceList = [], users = [], completeMaintenance }) {
  
  // --- 1. CÁLCULO DE ESTADÍSTICAS EN TIEMPO REAL ---
  
  // Inventario
  const totalAssets = inventory.length;
  const assignedAssets = inventory.filter(i => i.assigned_to).length;
  const assignmentRate = totalAssets > 0 ? Math.round((assignedAssets / totalAssets) * 100) : 0;
  const alertAssets = inventory.filter(i => i.status === 'Alerta').length;
  
  // Usuarios
  const totalUsers = users.length;
  const usersWithKit = users.filter(u => u.accessories && Object.values(u.accessories).some(v => v === true)).length;

  // Mantenimiento
  const pendingMaint = maintenanceList.filter(m => m.status === 'Pendiente').length;
  const completedMaint = maintenanceList.filter(m => m.status === 'Completado').length;
  
  // Actividad Reciente (Enriquecida con nombres de usuarios)
  const recentActivity = maintenanceList.slice(0, 5).map(m => {
     const tech = users.find(u => u.id === m.registered_by);
     return {
        ...m,
        techName: tech ? tech.name : 'Sistema',
        techRole: tech ? tech.role : ''
     };
  });

  // Datos para Gráfica de Categorías
  const categories = ['Computadoras', 'Celulares', 'Impresoras', 'Otros'];
  const categoryData = categories.map(cat => ({
    name: cat,
    count: inventory.filter(i => i.category === cat).length,
    color: cat === 'Computadoras' ? '#1f2937' : cat === 'Celulares' ? '#06b6d4' : cat === 'Impresoras' ? '#d946ef' : '#94a3b8'
  })).filter(d => d.count > 0);

  // Datos para Gráfica de Departamentos (Top 4)
  const deptCount = {};
  users.forEach(u => {
     deptCount[u.department] = (deptCount[u.department] || 0) + 1;
  });
  const deptData = Object.entries(deptCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-3xl font-black text-tech-900 tracking-tighter uppercase">Panel de Control</h2>
           <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {/* CAMBIO: Redacción más técnica, menos RH */}
              Sistema Operativo y Control de Accesos sincronizados
           </p>
        </div>
        <div className="text-right hidden md:block">
           <p className="text-2xl font-black text-tech-900">{new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Resumen General</p>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1: INVENTARIO */}
        <div className="bg-white p-6 rounded-3xl shadow-premium border border-slate-100 relative overflow-hidden group hover:border-tech-900 transition-all">
           <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Server size={80} />
           </div>
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-slate-100 rounded-xl text-tech-900"><Server size={20} /></div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Activos Totales</span>
           </div>
           <h3 className="text-4xl font-black text-tech-900 mb-1">{totalAssets}</h3>
           <div className="flex items-center gap-2 text-xs font-medium">
              <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                 <CheckCircle2 size={10} /> {assignedAssets} Asignados
              </span>
              <span className="text-slate-400">({assignmentRate}% Uso)</span>
           </div>
           {/* Mini Barra de Progreso */}
           <div className="w-full h-1 bg-slate-100 mt-4 rounded-full overflow-hidden">
              <div className="h-full bg-tech-900" style={{ width: `${assignmentRate}%` }}></div>
           </div>
        </div>

        {/* KPI 2: USUARIOS */}
        <div className="bg-white p-6 rounded-3xl shadow-premium border border-slate-100 relative overflow-hidden group hover:border-tech-900 transition-all">
           <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users size={80} />
           </div>
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-slate-100 rounded-xl text-tech-900"><Users size={20} /></div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Colaboradores</span>
           </div>
           <h3 className="text-4xl font-black text-tech-900 mb-1">{totalUsers}</h3>
           <div className="flex items-center gap-2 text-xs font-medium">
              <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                 <TrendingUp size={10} /> {usersWithKit} con Kit Completo
              </span>
           </div>
           <div className="w-full h-1 bg-slate-100 mt-4 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: `${totalUsers > 0 ? (usersWithKit/totalUsers)*100 : 0}%` }}></div>
           </div>
        </div>

        {/* KPI 3: MANTENIMIENTO */}
        <div className="bg-white p-6 rounded-3xl shadow-premium border border-slate-100 relative overflow-hidden group hover:border-tech-900 transition-all">
           <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity size={80} />
           </div>
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-slate-100 rounded-xl text-tech-900"><Activity size={20} /></div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mantenimientos</span>
           </div>
           <h3 className="text-4xl font-black text-tech-900 mb-1">{pendingMaint}</h3>
           <div className="flex items-center gap-2 text-xs font-medium">
              {pendingMaint > 0 ? (
                 <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Clock size={10} /> Pendientes
                 </span>
              ) : (
                 <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle2 size={10} /> Todo al día
                 </span>
              )}
              <span className="text-slate-400 text-[10px]">{completedMaint} completados</span>
           </div>
           <div className="w-full h-1 bg-slate-100 mt-4 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400" style={{ width: `${pendingMaint > 0 ? 60 : 100}%` }}></div>
           </div>
        </div>

        {/* KPI 4: ALERTAS */}
        <div className={`p-6 rounded-3xl shadow-premium border relative overflow-hidden group transition-all ${alertAssets > 0 ? 'bg-red-500 text-white border-red-600' : 'bg-white border-slate-100'}`}>
           <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <AlertTriangle size={80} className={alertAssets > 0 ? "text-white" : "text-black"} />
           </div>
           <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-xl ${alertAssets > 0 ? 'bg-white/20 text-white' : 'bg-slate-100 text-tech-900'}`}>
                 <AlertTriangle size={20} />
              </div>
              <span className={`text-xs font-bold uppercase tracking-widest ${alertAssets > 0 ? 'text-white/80' : 'text-slate-400'}`}>
                 Alertas Críticas
              </span>
           </div>
           <h3 className={`text-4xl font-black mb-1 ${alertAssets > 0 ? 'text-white' : 'text-tech-900'}`}>{alertAssets}</h3>
           <p className={`text-xs font-medium ${alertAssets > 0 ? 'text-white/90' : 'text-slate-500'}`}>
              {alertAssets > 0 ? 'Equipos requieren atención inmediata' : 'Sistemas operando normalmente'}
           </p>
        </div>
      </div>

      {/* SECCIÓN PRINCIPAL: 2 COLUMNAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
        
        {/* COLUMNA IZQUIERDA: FEED DE ACTIVIDAD (Ancho Doble) */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-premium border border-slate-100 p-6 flex flex-col">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-tech-900 flex items-center gap-2">
                 <Activity className="text-neon-400" /> Actividad Reciente del Equipo
              </h3>
              <button className="text-xs font-bold text-slate-400 hover:text-tech-900 transition-colors">Ver Todo</button>
           </div>
           
           <div className="space-y-4 flex-1">
              {recentActivity.length > 0 ? recentActivity.map((log, i) => (
                 <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-tech-900 transition-all group">
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-tech-900 font-bold shadow-sm">
                       {log.techName.charAt(0)}
                    </div>
                    <div className="flex-1">
                       <div className="flex justify-between items-start">
                          <p className="text-sm font-bold text-tech-900">
                             {log.techName} <span className="text-slate-400 font-normal text-xs">({log.techRole || 'Técnico'})</span>
                          </p>
                          <span className="text-[10px] font-mono text-slate-400 bg-white px-2 py-1 rounded border border-slate-100">
                             {log.date}
                          </span>
                       </div>
                       <p className="text-xs text-slate-600 mt-1">
                          Registró <span className="font-bold">{log.type}</span> en <span className="font-bold text-tech-900">{log.item_name}</span>
                       </p>
                       {log.notes && (
                          <div className="mt-2 text-[10px] text-slate-500 bg-white p-2 rounded border border-slate-100 italic">
                             "{log.notes}"
                          </div>
                       )}
                    </div>
                 </div>
              )) : (
                 <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                    <Calendar size={32} className="mb-2 opacity-20" />
                    <p className="text-sm">No hay actividad reciente registrada.</p>
                 </div>
              )}
           </div>
        </div>

        {/* COLUMNA DERECHA: DISTRIBUCIÓN (Ancho Simple) */}
        <div className="space-y-6">
           
           {/* Gráfica de Categorías */}
           <div className="bg-white rounded-3xl shadow-premium border border-slate-100 p-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Distribución de Activos</h3>
              <div className="h-48">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} layout="vertical" margin={{ left: 0, right: 20 }}>
                       <XAxis type="number" hide />
                       <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 10, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                       <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px'}} />
                       <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                          {categoryData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Top Departamentos */}
           <div className="bg-tech-900 rounded-3xl shadow-lg p-6 text-white relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-neon-400 rounded-full blur-[80px] opacity-20"></div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Usuarios por Depto.</h3>
              <div className="space-y-3 relative z-10">
                 {deptData.map((d, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                       <span className="font-medium text-slate-300">{d.name}</span>
                       <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                             <div className="h-full bg-neon-400" style={{ width: `${(d.value / totalUsers) * 100}%` }}></div>
                          </div>
                          <span className="font-bold text-white w-4 text-right">{d.value}</span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}