import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import PaginasAuxiliares from '../components/PaginasAuxiliares'; // Importe o padrão

export function Login() {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = async (e) => {
  e.preventDefault();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
  let message = "Ocorreu um erro inesperado.";

  // Mapeando os erros mais comuns do Supabase (GoTrue)
  switch (error.message) {
    case "Invalid login credentials":
      message = "E-mail ou senha incorretos.";
      break;
    case "Email not confirmed":
      message = "Você precisa confirmar seu e-mail antes de entrar.";
      break;
    case "Invalid format for email":
      message = "O formato do e-mail é inválido.";
      break;
    default:
      message = error.message; // Caso queira exibir o erro original se não mapeado
  }

  alert('Erro: ' + message); // Agora exibe a mensagem em PT-BR
  } else {
    // Pega o destino direto da janela do navegador sem usar Hooks
    const params = new URLSearchParams(window.location.search);
    const destino = params.get("redirect") || "/";
    navigate(destino);
  }
};

useEffect(() => {
  const redirecionarSeLogado = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const params = new URLSearchParams(window.location.search);
      const destino = params.get("redirect") || "/";
      navigate(destino);
    }
  };
  redirecionarSeLogado();
  }, [navigate]);

  
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      {/* 1. Header Padronizado */}
      <PaginasAuxiliares destino="/painel" />

      {/* 2. Conteúdo Centralizado */}
      <main className="container mx-auto px-6 py-12 flex justify-center">
        <div className="w-full max-w-md bg-black border-2 border-amber-500/20 p-8 rounded-lg shadow-2xl">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white">
              Acesso Restrito
            </h2>
            <div className="h-1 w-20 bg-amber-500 mx-auto mt-2"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-amber-500 mb-2">
                E-mail Institucional
              </label>
              <input
                type="email"
                placeholder="exemplo@igreja.com"
                className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded text-white focus:border-amber-500 outline-none transition-colors"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // Muda aqui
                placeholder="••••••••"
                className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded text-white focus:border-amber-500 outline-none transition-colors"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              
              {/* Botão para alternar (exemplo posicionado à direita) */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-zinc-400 hover:text-black"
              >
                {showPassword ? "Esconder" : "Mostrar"}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black uppercase py-4 rounded transition-all transform active:scale-95 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
            >
              Entrar no Painel
            </button>
          </form>
          
          <p className="mt-8 text-center text-[10px] text-zinc-500 uppercase tracking-widest">
            Igreja Pedra Angular &copy; {new Date().getFullYear()}
          </p>
        </div>
      </main>
    </div>
  );
}