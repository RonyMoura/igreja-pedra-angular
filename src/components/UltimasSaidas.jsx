import { useEffect, useState } from 'react';
import { getUltimasSaidas } from '../servicos/TesourariaServicos';

export function UltimasSaidas() {
  const [saidas, setSaidas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Atualizar o estado inicial com o que já consta na tabela
    async function carregarDados() {
      const dados = await getUltimasSaidas();
      setSaidas(dados);
      setLoading(false);
      }

    carregarDados();      

  }, []); // O array vazio garante que isso só rode UMA VEZ ao abrir a página
  

  if (loading) return <p className="text-white">Carregando movimentações...</p>;
  
  return (
  <div className="overflow-x-auto w-full mt-8">
    <h2 className="mb-2 text-white">Últimas Saídas</h2>
    
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs md:text-sm">
        <thead>
          <tr className="border-b border-gray-700 text-gray-300 uppercase text-[10px] sm:text-xs">
            <th className="px-2 sm:px-4 py-3 font-semibold whitespace-nowrap">Data</th>
            <th className="px-2 sm:px-4 py-3 font-semibold">Descrição</th>
            <th className="px-2 sm:px-4 py-3 font-semibold">Valor</th>
          </tr>
        </thead>
        
        <tbody className="divide-y divide-gray-800">
          {saidas.map((item) => (
            <tr key={item.id} className="hover:bg-gray-800 transition-colors">
              <td className="px-2 sm:px-4 py-3 sm:py-4 text-gray-200 whitespace-nowrap">                
                {new Date(item.data.replace('-', '/')).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                })}
              </td>
              <td className="px-2 sm:px-4 py-3 sm:py-4 text-gray-200">
                {item.descricao}
              </td>
              <td className="px-2 sm:px-4 py-3 sm:py-4 font-bold text-right text-red-500">
                R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
}