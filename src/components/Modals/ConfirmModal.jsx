import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop con blur */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-100">
        
        {/* Barra superior de advertencia */}
        <div className="h-2 w-full bg-red-500"></div>

        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
              <AlertTriangle size={24} />
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-black text-tech-900 uppercase tracking-tight mb-1">
                {title || '¿Estás seguro?'}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {message || 'Esta acción no se puede deshacer.'}
              </p>
            </div>
          </div>

          <div className="mt-8 flex gap-3 justify-end">
            <button 
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={() => { onConfirm(); onClose(); }}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-red-500 text-white shadow-lg shadow-red-200 hover:bg-red-600 hover:shadow-xl transition-all active:scale-95"
            >
              Sí, Eliminar
            </button>
          </div>
        </div>

        {/* Boton cerrar esquina */}
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-tech-900">
          <X size={20} />
        </button>
      </div>
    </div>
  );
}