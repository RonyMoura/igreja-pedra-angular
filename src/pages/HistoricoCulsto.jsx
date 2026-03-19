import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import PaginasAuxiliares from '../components/PaginasAuxiliares'

export default function HistoricoCultos() {
  const [cultos, setCultos] = useState([])
  const [loading, setLoading] = useState(true)

  // Função para buscar os dados no Supabase
  const buscarCultos = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('historico_cultos')
      .select('*')
      .order('data', { ascending: false }) // Mostra os mais recentes primeiro

    if (error) {
      console.error('Erro ao buscar dados:', error.message)
    } else {
      setCultos(data)
    }
    setLoading(false)
  }

    useEffect(() => {
    // Criamos uma função interna para evitar o alerta de cascata
    let montado = true;

    const carregarDados = async () => {
      if (montado) {
        await buscarCultos();
      }
    };

    carregarDados();

    // Função de limpeza (cleanup)
    return () => {
      montado = false;
    };
  }, []); // Mantemos o array vazio para rodar apenas UMA vez ao abrir a página

  // A partir daqui, vamos adicionar a lógica de pesquisa/filtro, na própria página:
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [filtroAno, setFiltroAno] = useState('Todos');

  const anosDisponiveis = [...new Set(cultos.map(
    culto => new Date(culto.data).getFullYear().toString()))].sort().reverse();
  const cultosFiltrados = cultos.filter((culto) => {
  const correspondeTexto = culto.preletor.toLowerCase().includes(filtroTexto.toLowerCase())
        || culto.titulo.toLowerCase().includes(filtroTexto.toLowerCase());
  const correspondeTipo = filtroTipo === 'Todos' || culto.tipo === filtroTipo;
  const anoDoCulto = culto.data ? new Date(culto.data).getFullYear().toString() : "";
  const correspondeAno = filtroAno === 'Todos' || anoDoCulto === filtroAno;
  

  return correspondeTexto && correspondeTipo && correspondeAno;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <PaginasAuxiliares />

      <main className="flex-grow p-4 md:p-10 container mx-auto">
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 text-center border-b-4 border-amber-500 inline-block pb-2">
          Histórico de Cultos
        </h2>

        <div className="mb-8 flex flex-wrap items-center gap-4">
  
          {/* Input: Ocupa todo o espaço disponível (flex-grow) */}
          <input 
            type="text"
            placeholder="Pesquisar por preletor ou título..."
            className="w-full min-w-[280px] p-2 border-2 border-black rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none font-bold text-sm"
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
          />

          {/* Container para os Selects: Ficam sempre alinhados à esquerda */}
          <div className="flex gap-4">
            <select 
              className="w-fit p-1.5 border-2 border-black rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white font-bold uppercase text-[10px] outline-none cursor-pointer"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="Todos">Todos os tipos</option>
              <option value="Semanal">Semanal</option>
              <option value="Temático">Temático</option>
              <option value="Festividade">Festividade</option>
            </select>

            <select 
              className="w-fit p-1.5 border-2 border-black rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white font-bold uppercase text-[10px] outline-none cursor-pointer"
              value={filtroAno}
              onChange={(e) => setFiltroAno(e.target.value)}
            >
              <option value="Todos">Todos os anos</option>
              {anosDisponiveis.map(ano => (
                <option key={ano} value={ano}>{ano}</option>
              ))}
            </select>
          </div>
        </div>  
        
        {loading ? (
          <p className="text-center font-bold text-amber-600 animate-pulse">Carregando registros...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/*{cultos.map((culto) => (*/}
            {cultosFiltrados.map((culto) => (  
              <div key={culto.id} className="bg-white border-l-8 border-black shadow-lg rounded-r-lg p-5 hover:shadow-2xl transition-all">
                <span className="text-[10px] font-bold bg-amber-500 px-2 py-1 uppercase">{culto.tipo}</span>
                <h3 className="text-xl font-black uppercase mt-2 leading-tight">{culto.titulo}</h3>
                <p className="text-slate-500 text-sm font-bold mb-3">{new Date(culto.data).toLocaleDateString('pt-BR')}</p>
                
                <p className="text-sm mb-4 line-clamp-3 italic text-slate-700">{culto.descricao}</p>
                
                <div className="flex flex-col gap-2">
                    <p className="text-xs font-bold uppercase"><span className="text-amber-600">Ministrante:</span> {culto.preletor}</p>
                    <a 
                      href={culto.url1} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-black text-white text-center text-xs font-black py-2 rounded hover:bg-amber-500 hover:text-black transition-all uppercase"
                    >
                      Momentos do culto
                    </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && cultos.length === 0 && (
          <p className="text-center text-slate-400">Nenhum culto registrado no momento.</p>
        )}
      </main>
    </div>
  )
}