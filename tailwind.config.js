/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta "Capsule Premium"
        neon: {
          400: '#D4FF00', // Amarillo Volt Neón (Acentos)
          500: '#B8E600', // Hover
        },
        // Grises técnicos para dar sensación de metal/laboratorio
        tech: {
          50: '#F9FAFB',  // Fondo App (Casi blanco)
          100: '#F3F4F6', // Paneles
          200: '#E5E7EB', // Bordes
          800: '#1F2937', // Texto principal
          900: '#111827', // Sidebar / Contrastes Fuertes
        }
      },
      fontFamily: {
        // Mantenemos la fuente mono para números y datos
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'neon': '0 0 10px rgba(212, 255, 0, 0.5)',
        'premium': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
};