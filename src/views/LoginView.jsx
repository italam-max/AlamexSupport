import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, Mail, Loader2, ShieldCheck } from 'lucide-react';

export default function LoginView() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Credenciales incorrectas. Intenta de nuevo.');
      setLoading(false);
    } else {
      // El cambio de estado en App.tsx se encargará del resto automáticamente
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-neon-400/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Header */}
        <div className="bg-tech-900 p-8 text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldCheck size={100} className="text-white" />
           </div>
           <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 text-neon-400 mb-4 border border-white/10 shadow-neon">
              <Lock size={32} />
           </div>
           <h1 className="text-2xl font-black text-white tracking-tighter uppercase">Acceso Restringido</h1>
           <p className="text-slate-400 text-xs font-mono mt-1">SISTEMA OPERATIVO v2.0</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="p-8 space-y-6">
           
           {error && (
             <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-lg text-center animate-pulse">
               {error}
             </div>
           )}

           <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Correo Corporativo</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-tech-900 transition-colors" size={18} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-tech-900 focus:bg-white transition-all font-bold text-tech-900 text-sm"
                    placeholder="usuario@alamex.mx"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Contraseña</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-tech-900 transition-colors" size={18} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-tech-900 focus:bg-white transition-all font-bold text-tech-900 text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
           </div>

           <button 
             type="submit" 
             disabled={loading}
             className="w-full py-4 bg-tech-900 text-white rounded-xl font-bold shadow-lg hover:bg-neon-400 hover:text-tech-900 hover:shadow-neon transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             {loading ? <Loader2 className="animate-spin" size={20} /> : 'Iniciar Sesión'}
           </button>

           <div className="text-center">
             <p className="text-[10px] text-slate-400">
               Solo personal autorizado. Tu IP está siendo monitoreada.
             </p>
           </div>
        </form>
      </div>
    </div>
  );
}