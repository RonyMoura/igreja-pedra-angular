import { useEffect, useState } from 'react';
import { getUltimasEntradas } from '../servicos/TesourariaServicos';
import { subscreverMudancasTesouraria } from '../servicos/RealtimeServico'; // Importe o seu novo serviço
import { supabase } from '../supabaseClient'; // Necessário para o removeChannel

export function UltimasEntradas() {
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. A função que busca o que já existe no banco (O passado)
    async function carregarDados() {
      const dados = await getUltimasEntradas();
      setEntradas(dados);
      setLoading(false);
    }

    carregarDados();

    // 2. A implementação da Escuta Realtime (O futuro)
    const canal = subscreverMudancasTesouraria((payload) => {
      
      if (payload.table === 'tesouraria_ent' && payload.eventType === 'INSERT') {
        
        setEntradas((listaAtual) => {
          // Criamos um novo array com o novo item no topo e espalhamos o resto
          const novaLista = [payload.new, ...listaAtual];
          return novaLista.slice(0, 5);
        });
      }
    },'entradas');

    // 3. LIMPEZA (Obrigatório em ADS para não vazar memória)
    return () => {
      supabase.removeChannel(canal);
      };
  }, []); // O array vazio garante que isso só rode UMA VEZ ao abrir a página

  if (loading) return <p className="text-white">Carregando movimentações...</p>;
  
  return (
  <div className="overflow-x-auto w-full mt-8">
    <h2 className="mb-2 text-white">Últimas Entradas</h2>
    
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs md:text-sm">
        <thead>
          <tr className="border-b border-gray-700 text-gray-300 uppercase text-[10px] sm:text-xs">
            <th className="px-2 sm:px-4 py-3 font-semibold whitespace-nowrap">Data</th>
            <th className="px-2 sm:px-4 py-3 font-semibold text-right">Pix</th>
            <th className="px-2 sm:px-4 py-3 font-semibold text-right">Espécie</th>
            <th className="px-2 sm:px-4 py-3 font-semibold text-right">Total</th>
          </tr>
        </thead>
        
        <tbody className="divide-y divide-gray-800">
          {entradas.map((item) => (
            <tr key={item.id} className="hover:bg-gray-800 transition-colors">
              <td className="px-2 sm:px-4 py-3 sm:py-4 text-gray-200 whitespace-nowrap">                
                {new Date(item.data).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                })}
              </td>
              <td className="px-2 sm:px-4 py-3 sm:py-4 text-gray-200 text-right">
                R$ {item.entrada_pix.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
              <td className="px-2 sm:px-4 py-3 sm:py-4 text-gray-200 text-right">
                R$ {item.entrada_e.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
              <td className="px-2 sm:px-4 py-3 sm:py-4 font-bold text-right text-emerald-300">
                R$ {item.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
}