// src/components/PaginasAuxiliares.jsx
// Componente para padronizar as páginas auxiliares

import { Link } from "react-router-dom"; /*Trata-se de um link de navegação interna*/

export default function PaginasAuxiliares() {
  return (
    <header className="bg-black text-white py-4 px-6 border-b-4 border-amber-500 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        
        {/* Identidade Visual Reduzida */}
        <div className="flex items-center gap-4">
          <img 
            src="/logo.webp" 
            alt="Logo" 
            className="w-12 h-auto" 
          />
          <div>
            <h1 className="text-xl font-black uppercase tracking-tighter">
              Igreja Pedra Angular
            </h1>
            <p className="text-amber-400 text-[10px] font-bold tracking-widest uppercase -mt-1">
              Missão e Reino
            </p>
          </div>
        </div>

        {/* 2. Trocamos <a> por <Link> e href por to */}
        <Link 
          to="/" 
          className="text-xs font-bold border border-amber-500 px-4 py-2 rounded hover:bg-amber-500 hover:text-black transition-all"
        >
          VOLTAR
        </Link>

      </div>
    </header>
  );
}