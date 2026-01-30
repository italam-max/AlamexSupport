import React, { useState } from 'react';
import { Plus, Search, Filter, Mail, Shield, Briefcase, Users } from 'lucide-react';
import UserDetailModal from '../components/Modals/UserDetailModal';

// Recibimos `onDelete`
export const UsersView = ({ users, onAddClick, onUpdate, onDelete }) => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-tech-900 tracking-tighter uppercase">
            Colaboradores
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Gestión de perfiles, accesos y licencias
          </p>
        </div>
        
        <div className="flex gap-3">
          <button className="h-10 px-4 rounded-xl border border-slate-200 text-slate-500 hover:border-tech-900 hover:text-tech-900 transition-colors flex items-center gap-2 text-sm font-bold">
             <Filter size={16} /> <span className="hidden sm:inline">Filtrar Depto</span>
          </button>
          
          <button
            onClick={onAddClick}
            className="h-10 px-6 bg-tech-900 text-white rounded-xl shadow-lg hover:shadow-neon hover:bg-neon-400 hover:text-tech-900 transition-all duration-300 flex items-center gap-2 text-sm font-bold uppercase tracking-wide group"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform" /> 
            Alta de Usuario
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {users.map((user) => (
          <div 
            key={user.id} 
            onClick={() => setSelectedUser(user)}
            className="bg-white rounded-2xl p-6 shadow-premium hover:shadow-lg border border-slate-100 group relative overflow-hidden transition-all cursor-pointer hover:border-neon-400"
          >
            <div className={`absolute left-0 top-0 h-full w-1 ${user.department === 'TI' ? 'bg-neon-400' : 'bg-tech-900'}`}></div>

            <div className="flex justify-between items-start mb-4">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-xl font-black text-slate-400 group-hover:bg-tech-900 group-hover:text-neon-400 transition-colors">
                     {user.name.charAt(0)}
                  </div>
                  <div>
                     <h3 className="font-bold text-tech-900 text-lg leading-tight">{user.name}</h3>
                     <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <Briefcase size={10} /> {user.role}
                     </p>
                  </div>
               </div>
               <span className="px-2 py-1 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400 rounded border border-slate-100">
                  {user.department}
               </span>
            </div>

            <div className="space-y-3 pl-2">
               <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Mail size={16} className="text-slate-400" />
                  <span className="truncate">{user.email}</span>
               </div>
               <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Shield size={16} className={user.assigned_accounts?.length > 0 ? "text-tech-900" : "text-slate-300"} />
                  <span className="truncate">
                    {user.assigned_accounts?.length > 0 ? `${user.assigned_accounts.length} Cuentas Asignadas` : 'Sin cuentas'}
                  </span>
               </div>
               <div className="pt-2 flex flex-wrap gap-2">
                  {user.software_licenses?.adobe && <span className="px-2 py-1 rounded-md bg-red-50 text-red-600 text-[10px] font-bold border border-red-100">Adobe CC</span>}
                  {user.software_licenses?.office && <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100">Office 365</span>}
               </div>
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
             <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                <Users className="text-slate-300" size={32} />
             </div>
             <p className="text-slate-500 font-bold">No hay colaboradores registrados.</p>
             <button onClick={onAddClick} className="mt-2 text-sm text-tech-900 underline font-bold hover:text-neon-400">
               Dar de alta el primero
             </button>
          </div>
        )}
      </div>

      {selectedUser && (
        <UserDetailModal 
          user={selectedUser} 
          onUpdate={onUpdate}
          onDelete={onDelete} // <--- Pasamos onDelete al modal
          onClose={() => setSelectedUser(null)} 
        />
      )}

    </div>
  );
};