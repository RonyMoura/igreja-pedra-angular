import { useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useSaldos } from "../hooks/useSaldos";
import PaginasAuxiliares from "../components/PaginasAuxiliares";

export default function Tesouraria() {
  
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState(null);

  const [formData, setFormData] = useState({
    data: '',
    tipo: 'pix',
    valor_total: ''
  });

  const [formDataSaida, setFormDataSaida] = useState({
    data: '',
    origem: 'conta',
    valor: ''
  });

  // --- 2. PROTEÇÃO DE ROTA E SESSÃO ---
  useEffect(() => {
      const verificarAcesso = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // 1. Verifica se está logado
      if (!session) {
        navigate('/painel', { replace: true });
        return;
      }

      // 2. Verifica a "Role" (Papel) em vez do e-mail fixo
      const tabelasPermitidas = session.user.app_metadata?.role;
      const temAcessoTesouraria = Array.isArray(tabelasPermitidas) && tabelasPermitidas.some(p => p.includes('tesouraria'));
      
      if (!temAcessoTesouraria) {
        alert("Acesso negado: Você não tem permissão de Tesoureiro.");
        navigate('/painel', { replace: true });
      } else {
        setCarregando(false);
      }
    };

  verificarAcesso();
}, [navigate]);

  // --- 3. HOOKS DE DADOS ---
  // O useSaldos deve ser chamado aqui, mas o resultado só será usado se não estiver carregando
  const { subpix, subEspecie, total } = useSaldos();

  // --- 4. FUNÇÕES DE MANIPULAÇÃO ---
  const handleChange = (setter) => (e) => {
    const { name, value } = e.target;
    let valorTratado = (name === "valor_total" || name === "valor") 
      ? value.replace(',', '.') 
      : value;

    setter(prev => ({
      ...prev,      
      [name]: valorTratado 
    }));
  };    

  const handleSubmit_entrada = async (e) => {
    e.preventDefault();
    const valorNumerico = parseFloat(formData.valor_total);

    if (!formData.data || isNaN(valorNumerico) || valorNumerico <= 0) {
      alert("⚠️ Informe uma data e um valor válido!");
      return;
    }

    try {
      const { error } = await supabase
        .from('tesouraria_entradas') 
        .insert([{ 
          data: formData.data, 
          tipo: formData.tipo, 
          valor_total: valorNumerico 
        }]);

      if (error) throw error;
      alert(`Sucesso! Valor de R$ ${valorNumerico.toFixed(2)} registrado.`);
      setFormData({ data: '', tipo: 'pix', valor_total: '' });
      setAbaAtiva(null);
    } catch (error) {
      console.error("Erro ao salvar:", error.message);
      alert("Erro ao salvar no banco de dados.");
    }
  };

  const handleSubmit_saida = async (e) => {
    e.preventDefault();
    const valorNumerico = parseFloat(formDataSaida.valor);

    if (!formDataSaida.data || isNaN(valorNumerico) || valorNumerico <= 0) {
      alert("⚠️ Informe uma data e um valor válido!");
      return;
    }

    try {
      const { error } = await supabase
        .from('tesouraria_saidas') 
        .insert([{ 
          data: formDataSaida.data, 
          origem: formDataSaida.origem, 
          valor: valorNumerico 
        }]);

      if (error) throw error;
      alert(`Sucesso! Valor de R$ ${valorNumerico.toFixed(2)} registrado.`);
      setFormDataSaida({ data: '', origem: 'conta', valor: '' });
      setAbaAtiva(null);
    } catch (error) {
      console.error("Erro ao salvar:", error.message);
      alert("Erro ao salvar no banco de dados.");
    }
  };

  // --- 5. TRAVA DE RENDERIZAÇÃO ---
  if (carregando) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <p>Verificando autenticação...</p>
      </div>
    );
  }
    
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <PaginasAuxiliares />  
      <div className="mt-8 container mx-auto max-w-4xl">
        
        {/* Seção de Saldos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-black border-l-4 border-green-500 p-4 shadow-lg">
            <p className="text-xs text-gray-400 uppercase font-bold">Saldo em Conta</p>
            <h2 className="text-2xl font-black text-green-400">{subpix.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h2>
          </div>
          <div className="bg-black border-l-4 border-amber-500 p-4 shadow-lg">
            <p className="text-xs text-gray-400 uppercase font-bold">Saldo em Espécie</p>
            <h2 className="text-2xl font-black text-amber-400">{subEspecie.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h2>
          </div>
          <div className="bg-black border-l-4 border-blue-500 p-4 shadow-lg">
            <p className="text-xs text-gray-400 uppercase font-bold">Total Geral</p>
            <h2 className="text-2xl font-black text-blue-400">{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h2>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setAbaAtiva(abaAtiva === 'entrada' ? null : 'entrada')}
            className={`flex-1 py-3 font-black uppercase tracking-tighter transition-all border-2 ${abaAtiva === 'entrada' ? 'bg-green-600 border-green-400' : 'border-green-600 text-green-500 hover:bg-green-600 hover:text-white'}`}
          >
            {abaAtiva === 'entrada' ? '✕ Fechar' : 'Inserir Entrada'}
          </button>
          
          <button 
            onClick={() => setAbaAtiva(abaAtiva === 'saida' ? null : 'saida')}
            className={`flex-1 py-3 font-black uppercase tracking-tighter transition-all border-2 ${abaAtiva === 'saida' ? 'bg-red-600 border-red-400' : 'border-red-600 text-red-500 hover:bg-red-600 hover:text-white'}`}
          >
            {abaAtiva === 'saida' ? '✕ Fechar' : 'Inserir Despesa'}
          </button>
        </div>

        {/* Formulário de Entrada (Condicional) */}
        {abaAtiva === 'entrada' && (
          <div className="bg-zinc-900 border border-green-500 p-6 rounded shadow-2xl animate-in fade-in slide-in-from-top-4">
            <h3 className="text-xl font-black uppercase mb-4 text-green-500">Nova Entrada</h3>
            <form onSubmit={handleSubmit_entrada} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase mb-1">Data</label>
                <input 
                  name="data" 
                  type="date" 
                  required 
                  className="bg-black border border-zinc-700 p-2 rounded focus:border-green-500 outline-none cursor-pointer"
                  value={formData.data}
                  onChange={handleChange(setFormData)}
                  onClick={(e) => e.target.showPicker()}
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase mb-1">Tipo</label>
                <select 
                  className="bg-black border border-zinc-700 p-2 rounded focus:border-green-500 outline-none"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange(setFormData)}
                >
                  <option value="pix">PIX</option>
                  <option value="especie">Espécie</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase mb-1">Valor Total</label>
                <input 
                  name="valor_total" 
                  type="text" // Alterado para text para aceitar a vírgula
                  inputMode="decimal" // Abre teclado numérico no celular
                  placeholder="R$ 0,00" 
                  className="bg-black border border-zinc-700 p-2 rounded focus:border-green-500 outline-none"
                  value={formData.valor_total}
                  onChange={handleChange(setFormData)} 
                />
              </div>

              <button type="submit" className="md:col-span-3 bg-green-600 hover:bg-green-500 py-3 mt-2 font-black uppercase transition-colors">
                Confirmar Entrada
              </button>
            </form>
          </div>
        )}

        {/* Placeholder para Formulário de Saída */}
        {abaAtiva === 'saida' && (
          <div className="bg-zinc-900 border border-red-500 p-6 rounded shadow-2xl animate-in fade-in slide-in-from-top-4 ">
            <h3 className="text-xl font-black uppercase mb-4 text-red-500">Nova Despesa</h3>
            <form onSubmit={handleSubmit_saida} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-bold uppercase mb-1">Data</label>
                  <input 
                  name="data" 
                  type="date" 
                  required 
                  className="bg-black border border-zinc-700 p-2 rounded focus:border-red-500 outline-none cursor-pointer"
                  value={formDataSaida.data}
                  onChange={handleChange(setFormDataSaida)}
                  onClick={(e) => e.target.showPicker()}
                />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-bold uppercase mb-1">Origem</label>
                  <select 
                    className="bg-black border border-zinc-700 p-2 rounded focus:border-red-500 outline-none"
                    name="origem"
                    value={formDataSaida.origem}
                    onChange={handleChange(setFormDataSaida)}
                  >
                    <option value="conta">Conta</option>
                    <option value="especie">Espécie</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-bold uppercase mb-1">Valor</label>
                  <input 
                    name="valor" 
                    type="text" // Alterado para text para aceitar a vírgula
                    inputMode="decimal" // Abre teclado numérico no celular
                    placeholder="R$ 0,00" 
                    className="bg-black border border-zinc-700 p-2 rounded focus:border-red-500 outline-none"
                    value={formDataSaida.valor}
                    onChange={handleChange(setFormDataSaida)} 
                  />
                </div>

                <button type="submit" className="md:col-span-3 bg-red-600 hover:bg-red-500 py-3 mt-2 font-black uppercase transition-colors">
                Confirmar Despesa
                </button>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
