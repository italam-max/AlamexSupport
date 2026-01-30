import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle2, Droplet, UserCheck, Wrench, Calendar, Filter } from 'lucide-react';

export const AnalyticsView = ({ inventory = [], maintenanceList = [], users = [] }) => {
  // Estado para el filtro de tiempo
  const [timeRange, setTimeRange] = useState('all'); // 'all', 'year', 'month', 'week', 'today'

  // --- LÓGICA DE FILTRADO ---
  const filteredMaintenance = useMemo(() => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return maintenanceList.filter(m => {
      if (timeRange === 'all') return true;

      // Convertimos la fecha del registro (YYYY-MM-DD) a objeto Date
      // Agregamos 'T00:00:00' para evitar problemas de zona horaria al parsear
      const itemDate = new Date(m.date + 'T00:00:00'); 

      if (timeRange === 'today') {
         return itemDate.getTime() === startOfDay.getTime();
      }
      
      if (timeRange === 'week') {
         // Últimos 7 días
         const oneWeekAgo = new Date(now);
         oneWeekAgo.setDate(now.getDate() - 7);
         return itemDate >= oneWeekAgo;
      }

      if (timeRange === 'month') {
         // Este mes actual
         return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
      }

      if (timeRange === 'year') {
         // Este año actual
         return itemDate.getFullYear() === now.getFullYear();
      }

      return true;
    });
  }, [maintenanceList, timeRange]);


  // 1. PROCESAMIENTO DE DATOS: MANTENIMIENTOS POR TIPO
  const maintTypes = {
    'Preventivo': 0,
    'Correctivo': 0,
    'Tinta': 0,
    'Limpieza': 0
  };

  filteredMaintenance.forEach(m => {
    if (maintTypes[m.type] !== undefined) {
      maintTypes[m.type]++;
    }
  });

  const pieData = Object.keys(maintTypes).map(key => ({
    name: key,
    value: maintTypes[key],
    color: key === 'Correctivo' ? '#ef4444' : key === 'Tinta' ? '#eab308' : key === 'Preventivo' ? '#10b981' : '#3b82f6'
  })).filter(d => d.value > 0);

  // 2. PROCESAMIENTO DE DATOS: RENDIMIENTO TÉCNICO
  const techPerformance = {};
  filteredMaintenance.forEach(m => {
     if (m.registered_by) {
        const techName = users.find(u => u.id === m.registered_by)?.name || 'Ex-Colaborador';
        techPerformance[techName] = (techPerformance[techName] || 0) + 1;
     }
  });

  const techChartData = Object.entries(techPerformance)
    .map(([name, tickets]) => ({ name, tickets }))
    .sort((a, b) => b.tickets - a.tickets)
    .slice(0, 5); // Top 5 Técnicos

  // 3. PROCESAMIENTO DE DATOS: CONSUMO DE TINTA (PARSEANDO NOTAS)
  const inkCounts = { 'Negra': 0, 'Cian': 0, 'Magenta': 0, 'Amarilla': 0 };
  
  filteredMaintenance.filter(m => m.type === 'Tinta').forEach(m => {
     const note = m.notes || '';
     if (note.includes('Negra')) inkCounts['Negra']++;
     if (note.includes('Cian')) inkCounts['Cian']++;
     if (note.includes('Magenta')) inkCounts['Magenta']++;
     if (note.includes('Amarilla')) inkCounts['Amarilla']++;
  });

  const inkChartData = Object.entries(inkCounts).map(([color, count]) => ({
     name: color,
     count: count,
     fill: color === 'Negra' ? '#1f2937' : color === 'Cian' ? '#06b6d4' : color === 'Magenta' ? '#d946ef' : '#eab308'
  }));

  // KPI RÁPIDOS
  const failureRate = filteredMaintenance.length > 0 
    ? Math.round((maintTypes['Correctivo'] / filteredMaintenance.length) * 100) 
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER CON FILTRO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-tech-900 tracking-tighter uppercase">Data Lab</h2>
          <p className="text-sm text-slate-500 font-medium">Inteligencia operativa y métricas de soporte</p>
        </div>

        {/* SELECTOR DE RANGO DE TIEMPO */}
        <div className="bg-white p-1 rounded-xl border border-slate-200 flex items-center shadow-sm">
           <div className="px-3 py-2 text-slate-400 border-r border-slate-100 mr-1 hidden sm:block">
              <Filter size={16} />
           </div>
           {[
             { k: 'today', l: 'Hoy' },
             { k: 'week', l: 'Semana' },
             { k: 'month', l: 'Mes' },
             { k: 'year', l: 'Año' },
             { k: 'all', l: 'Todo' }
           ].map((range) => (
              <button
                key={range.k}
                onClick={() => setTimeRange(range.k)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                   timeRange === range.k 
                   ? 'bg-tech-900 text-white shadow-md' 
                   : 'text-slate-500 hover:bg-slate-50 hover:text-tech-900'
                }`}
              >
                 {range.l}
              </button>
           ))}
        </div>
      </div>

      {filteredMaintenance.length === 0 ? (
         <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <Calendar className="text-slate-300 mb-4" size={48} />
            <p className="text-slate-500 font-bold text-lg">Sin datos en este periodo</p>
            <p className="text-sm text-slate-400">Intenta seleccionar otro rango de tiempo.</p>
         </div>
      ) : (
         <>
            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white p-6 rounded-2xl shadow-premium border border-slate-100 flex items-center justify-between">
                  <div>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tasa de Fallas</p>
                     <h3 className={`text-4xl font-black ${failureRate > 20 ? 'text-red-500' : 'text-emerald-500'}`}>{failureRate}%</h3>
                     <p className="text-[10px] text-slate-400">Del total seleccionado</p>
                  </div>
                  <div className={`p-4 rounded-full ${failureRate > 20 ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                     <AlertTriangle size={24} />
                  </div>
               </div>

               <div className="bg-white p-6 rounded-2xl shadow-premium border border-slate-100 flex items-center justify-between">
                  <div>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Servicios</p>
                     <h3 className="text-4xl font-black text-tech-900">{filteredMaintenance.length}</h3>
                     <p className="text-[10px] text-slate-400">Intervenciones en periodo</p>
                  </div>
                  <div className="p-4 rounded-full bg-blue-50 text-blue-500">
                     <Wrench size={24} />
                  </div>
               </div>

               <div className="bg-white p-6 rounded-2xl shadow-premium border border-slate-100 flex items-center justify-between">
                  <div>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cartuchos Usados</p>
                     <h3 className="text-4xl font-black text-tech-900">
                        {Object.values(inkCounts).reduce((a,b)=>a+b, 0)}
                     </h3>
                     <p className="text-[10px] text-slate-400">Unidades reemplazadas</p>
                  </div>
                  <div className="p-4 rounded-full bg-yellow-50 text-yellow-600">
                     <Droplet size={24} />
                  </div>
               </div>
            </div>

            {/* GRÁFICAS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               
               {/* 1. TIPOS DE MANTENIMIENTO */}
               <div className="bg-white p-6 rounded-3xl shadow-premium border border-slate-100">
                  <h3 className="text-sm font-bold text-tech-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                     <TrendingUp size={16} /> Distribución de Carga
                  </h3>
                  <div className="h-64">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                           <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                           >
                              {pieData.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                           </Pie>
                           <Tooltip />
                           <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                     </ResponsiveContainer>
                  </div>
               </div>

               {/* 2. LEADERBOARD TÉCNICOS */}
               <div className="bg-white p-6 rounded-3xl shadow-premium border border-slate-100">
                  <h3 className="text-sm font-bold text-tech-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                     <UserCheck size={16} /> Top Técnicos (Tickets)
                  </h3>
                  <div className="h-64">
                     {techChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={techChartData} layout="vertical" margin={{ left: 20 }}>
                              <XAxis type="number" hide />
                              <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 11, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                              <Tooltip cursor={{fill: 'transparent'}} />
                              <Bar dataKey="tickets" fill="#111827" radius={[0, 4, 4, 0]} barSize={20}>
                                 <Cell fill="#111827" />
                                 {techChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 0 ? '#bef264' : '#111827'} />
                                 ))}
                              </Bar>
                           </BarChart>
                        </ResponsiveContainer>
                     ) : (
                        <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                           Sin datos de técnicos en este periodo
                        </div>
                     )}
                  </div>
               </div>

               {/* 3. CONSUMO DE TINTA */}
               <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-premium border border-slate-100">
                  <h3 className="text-sm font-bold text-tech-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                     <Droplet size={16} /> Consumo de Insumos por Color
                  </h3>
                  <div className="h-48">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={inkChartData}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} />
                           <XAxis dataKey="name" tick={{fontSize: 12, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                           <YAxis hide />
                           <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px'}} />
                           <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                              {inkChartData.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                           </Bar>
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </div>

            </div>
         </>
      )}
    </div>
  );
};