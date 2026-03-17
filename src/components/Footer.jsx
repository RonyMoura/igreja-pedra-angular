import { Instagram } from "lucide-react"; // Se não usar lucide, pode substituir pelo ícone SVG abaixo

export default function Footer() {
  const instagramUrl = "https://www.instagram.com/igrejapedraangular7?igsh=cmc2dm5rNHlmdnc0";

  return (
    <footer className="bg-black text-white py-8 border-t-4 border-amber-500 mt-auto shadow-[0_-4px_10px_rgba(0,0,0,0.3)]">
      <div className="container mx-auto px-6 flex flex-col items-center gap-4">
        
        {/* Link do Instagram Estilizado */}
        <a 
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 group transition-all"
        >
          <div className="p-2 border border-amber-500 rounded-full group-hover:bg-amber-500 transition-colors">
            <Instagram size={20} className="text-amber-500 group-hover:text-black" />
          </div>
          <span className="text-xs font-bold tracking-widest uppercase group-hover:text-amber-400">
            @igrejapedraangular7
          </span>
        </a>

        {/* Informações de Copyright */}
        <div className="text-center space-y-1">
          <p className="text-[10px] sm:text-xs tracking-wider text-slate-400">
            © 2026 - 
            <span className="font-black text-white uppercase ml-1">
              Igreja Pedra Angular
            </span>
          </p>
          <p className="text-[9px] uppercase tracking-[0.2em] text-amber-600 font-bold">
            Missão e Reino
          </p>
        </div>

        {/* Créditos */}
        <div className="pt-4 border-t border-white/10 w-full max-w-xs text-center">
          <p className="text-[10px] text-slate-500 uppercase tracking-tighter">
            Desenvolvido por <span className="text-slate-300 font-bold">Ronaldo Moura</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
