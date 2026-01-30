import React, { useState } from 'react';
import { X, Activity, Printer, Server, Droplet, Wrench, AlertTriangle, Save, Cpu, CheckSquare, Smartphone, Monitor, BarChart3, Edit2, Check, User } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Cell, YAxis } from 'recharts';
import { toast } from 'sonner'; // <--- IMPORTAMOS

// ... (El componente CustomDot, MAINTENANCE_CHECKLISTS y helper functions siguen IGUAL) ...
const CustomDot = (props) => { /* ... */ return null; };
const MAINTENANCE_CHECKLISTS = { /* ... */ };

export default function EquipmentDetailModal({ item, maintenanceHistory, users = [], onAddLog, onUpdate, onClose }) {
  // ... (Estados iniciales IGUAL) ...
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
  });

  // ... (Filtros de técnicos y Headers IGUAL) ...
  if (!item) return null;
  const isPrinter = item.category === 'Impresoras';
  const activeChecklist = MAINTENANCE_CHECKLISTS[item.category] || MAINTENANCE_CHECKLISTS['Default'];

  let technicians = users.filter(u => {
    if (!u.app_access_level) return true;
    const level = u.app_access_level.toLowerCase();
    return level.includes('admin') || level.includes('soporte');
  });
  if (technicians.length === 0 && users.length > 0) {
     technicians = users;
  }
  
  const HeaderIcon = () => { /* ... */ return <Server size={40} /> };
  const history = maintenanceHistory.filter(m => m.item_id === item.id || m.itemName === item.name).sort((a, b) => new Date(a.date) - new Date(b.date));
  const chartData = history.map(h => ({ /* ... */ }));
  const inkStats = [ /* ... */ ];
  if (isPrinter) { /* ... */ }

  const handleQuickSave = () => {
    // --- CAMBIO: VALIDACION PREMIUM ---
    if (!logData.registered_by) {
        toast.error("Debes seleccionar un técnico autorizado."); // <--- Toast Rojo
        return;
    }

    // ... (Logica de notas igual) ...
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

    onAddLog(newLog); 
    
    // --- CAMBIO: FEEDBACK VISUAL ---
    toast.success("Registro guardado en bitácora");

    setShowLogForm(false);
    setLogData({ 
      notes: '', 
      consumables: { black: false, cyan: false, magenta: false, yellow: false },
      maintenanceChecks: {},
      registered_by: ''
    });
  };

  // ... (handleCheckChange sigue igual) ...
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
      specs: updatedSpecs
    };

    const success = await onUpdate(item.id, updates);
    if (success) {
      toast.success("Información actualizada"); // <--- Feedback visual
      setIsEditing(false);
    } else {
      toast.error("Error al actualizar");
    }
  };

  // ... (El RETURN del componente sigue IGUAL, solo cambiamos la lógica arriba) ...
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
       {/* ... contenido del modal ... */}
       <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[90vh]">
         {/* ... header, body, charts, etc. (No necesitas cambiar nada visual aquí abajo) ... */}
         {/* ... El botón de guardar llama a handleQuickSave que ahora tiene los Toasts ... */}
          <div className="bg-tech-900 text-white p-6 flex justify-between items-start shrink-0 relative overflow-hidden">
             {/* ... */}
             <div className="absolute top-0 right-0 w-96 h-96 bg-neon-400 rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
             
             <div className="flex items-center gap-5 relative z-10">
               {/* ... */}
                <HeaderIcon />
               {/* ... */}
             </div>
             
             <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
               <X size={28} />
             </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
             {/* ... Todo el resto del contenido del grid se mantiene exactamente igual ... */}
             {/* ... Solo asegúrate que el botón de Guardar llama a handleQuickSave ... */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                   <div className="bg-white p-5 rounded-2xl shadow-premium border border-slate-100">
                      {/* ...Formulario de logs... */}
                       {showLogForm && (
                         <div className="animate-in fade-in zoom-in-95 duration-200">
                           {/* ... Inputs ... */}
                           <button onClick={handleQuickSave} className={`w-full py-2 font-bold rounded-lg text-sm transition-all flex items-center justify-center gap-2 ${logType === 'Correctivo' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-neon-400 text-tech-900 hover:shadow-neon'}`}>
                              <Save size={16} /> {logType === 'Correctivo' ? 'Registrar Falla' : 'Guardar Registro'}
                           </button>
                         </div>
                       )}
                   </div>
                   {/* ... Specs ... */}
                </div>
                {/* ... Charts ... */}
             </div>
          </div>
       </div>
    </div>
  );
}