import { useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useSaldos } from "../hooks/useSaldos";
import PaginasAuxiliares from "../components/PaginasAuxiliares";
import { UltimasEntradas } from "../components/UltimasEntradas";
import { UltimasSaidas } from "../components/UltimasSaidas";

export default function Tesouraria() {
  
 
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState(null);

  const [formData, setFormData] = useState({
    data: '',
    entrada_pix: '',
    entrada_e: '0'
  });

  const [formDataSaida, setFormDataSaida] = useState({
    data: '',
    descricao: '',
    origem: 'conta',
    valor: ''
  });

  const [formDataTransf, setFormDataTransf] = useState({
    data: '',
    origem: 'especie',
    destino: 'conta',
    valor_transf: ''
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
    let valorTratado = (name === "entrada_pix" || name === 'entrada_e' || name === "valor" || name === "valor_transf") 
      ? value.replace(',', '.') 
      : value;

    setter(prev => {
      const novoEstado = {
        ...prev,
        [name]: valorTratado
      };

      // Se o usuário mexer na origem, o destino assume o oposto automaticamente
      if (name === 'origem') {
        novoEstado.destino = valorTratado === 'especie' ? 'conta' : 'especie';
      }
      
      // Opcional: Se mexer no destino, a origem também muda para o oposto
      if (name === 'destino') {
        novoEstado.origem = valorTratado === 'especie' ? 'conta' : 'especie';
      }

      // Se estou digitando no PIX...
      if (name === 'entrada_pix') {
        // ...e o campo Espécie estiver vazio, ele assume 0
        if (!prev.entrada_e || prev.entrada_e === '') {
          novoEstado.entrada_e = '0';
        }
      }

      // Se estou digitando na ESPÉCIE...
      if (name === 'entrada_e') {
        // ...e o campo PIX estiver vazio, ele assume 0
        if (!prev.entrada_pix || prev.entrada_pix === '') {
          novoEstado.entrada_pix = '0';
        }
      }

      return novoEstado;
    });
  };   

  const handleSubmit_entrada = async (e) => {
    e.preventDefault();
    /*const valorNumerico = parseFloat(formData.valor_total);*/
    const valor_pix = parseFloat(formData.entrada_pix);
    const valor_e = parseFloat(formData.entrada_e);

    if (!formData.data) {
        alert("⚠️ Informe uma data válida!")
        return     
    }else if (isNaN(valor_pix) && isNaN(valor_e)){
        alert("⚠️ Pelo menos um valor deve ser informado.")
        return
    }

  
  try {
      const { error } = await supabase
        .from('tesouraria_ent') 
        .insert([{ 
          data: formData.data, 
          entrada_pix: formData.entrada_pix, 
          entrada_e: formData.entrada_e 
        }]);

      if (error) throw error;
      alert(`Sucesso! Valores registrados.`);
      setFormData({ data: '', entrada_pix: '', entrada_e: '' });
      setAbaAtiva(null);
    } catch (error) {
      console.error("Erro ao salvar:", error.message);
      alert("Erro ao salvar no banco de dados.");
    }
  };

  const handleSubmit_saida = async (e) => {
    e.preventDefault();
    const valorNumerico = parseFloat(formDataSaida.valor);

    if (!formDataSaida.data || isNaN(valorNumerico) || valorNumerico <= 0 || formDataSaida.descricao === '') {
      alert("⚠️ Informe uma data, uma descrição e um valor válido!");
      return;
    }

    try {
      const { error } = await supabase
        .from('tesouraria_saidas') 
        .insert([{ 
          data: formDataSaida.data,
          descricao: formDataSaida.descricao, 
          origem: formDataSaida.origem, 
          valor: valorNumerico 
        }]);

      if (error) throw error;
      alert(`Sucesso! Valor de R$ ${valorNumerico.toFixed(2)} registrado.`);
      setFormDataSaida({ data: '', descricao: '', origem: 'conta', valor: '' });
      setAbaAtiva(null);
    } catch (error) {
      console.error("Erro ao salvar:", error.message);
      alert("Erro ao salvar no banco de dados.");
    }
  };

  const handleSubmit_transf = async (e) => {
    e.preventDefault();
    const valorNumerico = parseFloat(formDataTransf.valor_transf);
    if (!formDataTransf.data || isNaN(valorNumerico) || valorNumerico <= 0) {
      alert("⚠️ Informe uma data e um valor válido!");
      return;
    }    
    
    try {
      const { error } = await supabase
        .from('tesouraria_transf') 
        .insert([{ 
          data: formDataTransf.data, 
          origem: formDataTransf.origem,
          destino: formDataTransf.destino, 
          valor_transf: valorNumerico 
        }]);

      if (error) throw error;
      alert(`Sucesso! Valor de R$ ${valorNumerico.toFixed(2)} registrado.`);
      setFormDataTransf({ data: '', origem: 'especie', destino: 'conta', valor_transf: '' });
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
    <div className="min-h-screen bg-gray-900 text-white flex flex-col font-sans text-slate-900">
      <PaginasAuxiliares />  
      <div className="mt-4 container mx-auto max-w-4xl p-6 md:g">
        
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button 
            onClick={() => setAbaAtiva(abaAtiva === 'entrada' ? null : 'entrada')}
            className={`order-1 w-full py-3 font-black uppercase tracking-tighter transition-all border-2 ${abaAtiva === 'entrada' ? 'bg-green-600 border-green-400' : 'border-green-600 text-green-500 hover:bg-green-600 hover:text-white'}`}
          >
            {abaAtiva === 'entrada' ? '✕ Fechar' : 'Inserir Entrada'}
          </button>        
          

          {/* Formulário de Entrada (Condicional) */}
            {abaAtiva === 'entrada' && (
              <div className="order-2 md:order-7 md:col-span-3 bg-zinc-900 border border-green-500 p-6 rounded shadow-2xl animate-in fade-in slide-in-from-top-4">            
                <h3 className="text-xl font-black uppercase mb-4 text-green-500">Nova Entrada</h3>
                <form onSubmit={handleSubmit_entrada} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <label className="text-xs font-bold uppercase mb-1">Data</label>
                    <input
                      autoFocus 
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
                    <label className="text-xs font-bold uppercase mb-1">Valor Pix</label>
                    <input 
                      name="entrada_pix" 
                      type="text" // Alterado para text para aceitar a vírgula
                      inputMode="decimal" // Abre teclado numérico no celular
                      placeholder="R$ 0,00" 
                      className="bg-black border border-zinc-700 p-2 rounded focus:border-green-500 outline-none"
                      value={formData.entrada_pix}
                      onChange={handleChange(setFormData)} 
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-bold uppercase mb-1">Valor Espécie</label>
                    <input 
                      name="entrada_e" 
                      type="text" // Alterado para text para aceitar a vírgula
                      inputMode="decimal" // Abre teclado numérico no celular
                      placeholder="R$ 0,00" 
                      className="bg-black border border-zinc-700 p-2 rounded focus:border-green-500 outline-none"
                      value={formData.entrada_e}
                      onChange={handleChange(setFormData)} 
                    />
                  </div>

                  <button type="submit" className="md:col-span-3 bg-green-600 hover:bg-green-500 py-3 mt-2 font-black uppercase transition-colors">
                    Confirmar Entrada
                  </button>
                </form>
                <UltimasEntradas />
              </div>
            )}


          <button 
            onClick={() => setAbaAtiva(abaAtiva === 'saida' ? null : 'saida')}
            className={`order-3 w-full py-3 font-black uppercase tracking-tighter transition-all border-2 ${abaAtiva === 'saida' ? 'bg-red-600 border-red-400' : 'border-red-600 text-red-500 hover:bg-red-600 hover:text-white'}`}
          >
            {abaAtiva === 'saida' ? '✕ Fechar' : 'Inserir Despesa'}
          </button>



          {/* Placeholder para Formulário de Saída */}
            {abaAtiva === 'saida' && (
              <div className="order-4 md:order-7 md:col-span-3 bg-zinc-900 border border-red-500 p-6 rounded shadow-2xl animate-in fade-in slide-in-from-top-4 ">
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
                      onClick={(e) => e.target.showPicker()} // para abrir o calendário
                    />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs font-bold uppercase mb-1">Descrição/finalidade</label>
                      <input 
                      name="descricao" 
                      type="text" 
                      className="bg-black border border-zinc-700 p-2 rounded focus:border-red-500 outline-none cursor-pointer"
                      value={formDataSaida.descricao}
                      onChange={handleChange(setFormDataSaida)}
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
                <UltimasSaidas />
                </div>
            )}


          <button 
            onClick={() => setAbaAtiva(abaAtiva === 'transf' ? null : 'transf')}
            className={`order-5 w-full py-3 font-black uppercase tracking-tighter transition-all border-2 ${abaAtiva === 'transf' ? 'bg-amber-600 border-amber-400' : 'border-amber-600 text-amber-500 hover:bg-amber-600 hover:text-black'}`}
          >
            {abaAtiva === 'transf' ? '✕ Fechar' : 'Inserir Transferência'}
          </button>
        </div>   
        

        {/*Formulário para transferência*/}
        {abaAtiva === 'transf' && (
          <div className="order-6 md:order-7 md:col-span-3 bg-zinc-900 border border-amber-500 p-6 rounded shadow-2xl animate-in fade-in slide-in-from-top-4 ">
            <h3 className="text-xl font-black uppercase mb-4 text-amber-500">Nova Transferência</h3>
            <form onSubmit={handleSubmit_transf} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-bold uppercase mb-1">Data</label>
                  <input 
                  name="data" 
                  type="date" 
                  required 
                  className="bg-black border border-zinc-700 p-2 rounded focus:border-amber-500 outline-none cursor-pointer"
                  value={setFormDataTransf.data}
                  onChange={handleChange(setFormDataTransf)}
                  onClick={(e) => e.target.showPicker()}
                />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-bold uppercase mb-1">Origem</label>
                  <select 
                    className="bg-black border border-zinc-700 p-2 rounded focus:border-amber-500 outline-none"
                    name="origem"
                    value={formDataTransf.origem}
                    onChange={handleChange(setFormDataTransf)}
                  >
                    <option value="especie">Espécie</option>
                    <option value="conta">Conta</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-bold uppercase mb-1">Destino</label>
                  <select 
                    className="bg-black border border-zinc-700 p-2 rounded focus:border-amber-500 outline-none"
                    name="destino"
                    value={formDataTransf.destino}
                    onChange={handleChange(setFormDataTransf)}
                  >
                    <option value="conta">Conta</option>
                    <option value="especie">Espécie</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-bold uppercase mb-1">Valor</label>
                  <input 
                    name="valor_transf" 
                    type="text" // Alterado para text para aceitar a vírgula
                    inputMode="decimal" // Abre teclado numérico no celular
                    placeholder="R$ 0,00" 
                    className="bg-black border border-zinc-700 p-2 rounded focus:border-amber-500 outline-none"
                    value={formDataTransf.valor_transf}
                    onChange={handleChange(setFormDataTransf)} 
                  />
                </div>

                <button type="submit" className="md:col-span-4 bg-amber-600 hover:bg-amber-500 py-3 mt-2 font-black uppercase transition-colors">
                Confirmar Transferência
                </button>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
