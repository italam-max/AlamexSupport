import React, { useState } from 'react';
// @ts-ignore
import { supabase } from '../lib/supabase';
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react';

export default function LoginView() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // @ts-ignore
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Acceso denegado. Verifique sus credenciales.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden font-sans text-slate-300 selection:bg-neon-400 selection:text-black">
      
      {/* --- FONDO ANIMADO MINIMALISTA --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Orbe Verde (Superior Izquierda) */}
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-neon-400/5 rounded-full blur-[100px] animate-pulse"></div>
        {/* Orbe Azul/Gris (Inferior Derecha) */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-slate-800/10 rounded-full blur-[120px]"></div>
        {/* Malla sutil */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      {/* --- TARJETA DE LOGIN --- */}
      <div className="w-full max-w-[400px] relative z-10 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* LOGO HEXAGONAL (Marca) */}
        <div className="flex flex-col items-center justify-center mb-4 gap-4">
           <div className="relative group">
              <div className="absolute inset-0 bg-neon-400 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              <svg 
                width="64" 
                height="64" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#bef264" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="relative z-10 drop-shadow-[0_0_15px_rgba(190,242,100,0.3)]"
              >
                <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
              </svg>
           </div>
           
           <div className="text-center">
             <h1 className="text-2xl font-black text-white tracking-tight uppercase flex items-center justify-center gap-2">
               Alamex <span className="text-neon-400">Support</span>
             </h1>
             <p className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase mt-1">
               Sistema Operativo v2.0
             </p>
           </div>
        </div>

        {/* FORMULARIO GLASSMORPHISM */}
        <div className="bg-[#0f0f0f]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl ring-1 ring-white/5">
           
           <div className="mb-6 text-center">
              <h2 className="text-sm font-medium text-white">Bienvenido de nuevo</h2>
              <p className="text-xs text-slate-500 mt-1">Ingrese sus credenciales para continuar</p>
           </div>

           <form onSubmit={handleLogin} className="space-y-5">
              
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-2 animate-in fade-in zoom-in-95">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  {error}
                </div>
              )}

              <div className="space-y-4">
                 <div className="group">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1 group-focus-within:text-neon-400 transition-colors">Correo Corporativo</label>
                    <div className="relative">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" size={18} />
                       <input 
                         type="email" 
                         required
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         className="w-full pl-11 pr-4 py-3.5 bg-[#0a0a0a] border border-[#222] rounded-xl outline-none focus:border-neon-400/50 focus:bg-[#111] text-white text-sm transition-all placeholder:text-slate-700 font-medium"
                         placeholder="usuario@alamex.mx"
                       />
                    </div>
                 </div>

                 <div className="group">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1 group-focus-within:text-neon-400 transition-colors">Contraseña</label>
                    <div className="relative">
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" size={18} />
                       <input 
                         type="password" 
                         required
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         className="w-full pl-11 pr-4 py-3.5 bg-[#0a0a0a] border border-[#222] rounded-xl outline-none focus:border-neon-400/50 focus:bg-[#111] text-white text-sm transition-all placeholder:text-slate-700 font-medium tracking-widest"
                         placeholder="••••••••"
                       />
                    </div>
                 </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-neon-400 text-black rounded-xl font-bold text-sm hover:bg-white hover:shadow-[0_0_20px_rgba(190,242,100,0.4)] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                   <Loader2 className="animate-spin" size={18} />
                ) : (
                   <>
                     Iniciar Sesión 
                     <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                   </>
                )}
              </button>
           </form>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-slate-600 font-medium">
           &copy; {new Date().getFullYear()} Alamex IT Dept. Acceso estrictamente autorizado.
        </p>

      </div>
    </div>
  );
}