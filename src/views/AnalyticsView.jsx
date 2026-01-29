import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

// Datos estáticos de ejemplo para la gráfica
const INK_HISTORY_DATA = [
  { month: 'Ago', consumo: 12, cambios: 1 },
  { month: 'Sep', consumo: 18, cambios: 1 },
  { month: 'Oct', consumo: 15, cambios: 1 },
  { month: 'Nov', consumo: 35, cambios: 2 },
  { month: 'Dic', consumo: 22, cambios: 1 },
  { month: 'Ene', consumo: 28, cambios: 2 },
];

export const AnalyticsView = ({ inventory }) => {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <h2 className="text-2xl font-bold text-slate-800">Análisis y Consumo</h2>

      {/* Gráficas Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfica de Consumo de Tinta */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-2">
            Tendencia de Cambio de Tintas
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            Frecuencia de cambios y consumo mensual (%)
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={INK_HISTORY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="consumo"
                  name="% Uso Promedio"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="cambios"
                  name="Cartuchos Reemplazados"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rendimiento por Impresora */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-2">
            Rendimiento por Cartucho
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            Páginas impresas desde último cambio
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={inventory.filter((i) => i.category === 'Impresoras')}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  tick={{ fontSize: 10 }}
                  interval={0}
                />
                <YAxis stroke="#64748b" />
                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                <Bar
                  dataKey="printsSinceLastInk"
                  name="Páginas Impresas"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabla Detallada de Consumibles */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">
            Detalle de Ciclo de Vida (Consumibles)
          </h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 font-semibold text-slate-600">Dispositivo</th>
              <th className="p-4 font-semibold text-slate-600">
                Último Cambio Tinta
              </th>
              <th className="p-4 font-semibold text-slate-600">
                Días Transcurridos
              </th>
              <th className="p-4 font-semibold text-slate-600">
                Estado Estimado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inventory
              .filter((i) => i.category === 'Impresoras')
              .map((printer) => {
                // Calcular diferencia de días de forma segura
                const lastDate = printer.inkChangeDate
                  ? new Date(printer.inkChangeDate)
                  : new Date();
                const daysDiff = Math.floor(
                  (new Date() - lastDate) / (1000 * 60 * 60 * 24)
                );

                let statusColor = 'text-green-600';
                if (daysDiff > 60) statusColor = 'text-yellow-600';
                if (daysDiff > 90) statusColor = 'text-red-600';

                return (
                  <tr key={printer.id}>
                    <td className="p-4 font-medium">{printer.name}</td>
                    <td className="p-4 text-slate-600">
                      {printer.inkChangeDate || 'N/A'}
                    </td>
                    <td className="p-4 text-slate-600">{daysDiff} días</td>
                    <td className={`p-4 font-bold ${statusColor}`}>
                      {daysDiff > 90 ? 'Cambio Sugerido' : 'Óptimo'}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
