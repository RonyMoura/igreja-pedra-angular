import { useEffect, useMemo, useState } from "react";
import { getDadosPorMesAno } from "../servicos/TesourariaServicos";


export function DetalhesTesouraria() {
 
    const [abaAtiva, setAbaAtiva] = useState('tesouraria_ent');
    const [dados, setDados] = useState ([]);
    const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth() + 1);{/*O mês já iniciado com o atual */}
    const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(false);    

    //Array de meses:
    const lista_meses = [
        { id: 1, nome: 'Jan' },
        { id: 2, nome: 'Fev' },
        { id: 3, nome: 'Mar' },
        { id: 4, nome: 'Abr' },
        { id: 5, nome: 'Mai' },
        { id: 6, nome: 'Jun' },
        { id: 7, nome: 'Jul' },
        { id: 8, nome: 'Ago' },
        { id: 9, nome: 'Set' },
        { id: 10, nome: 'Out' },
        { id: 11, nome: 'Nov' },
        { id: 12, nome: 'Dez' },
    ];    
    

    useEffect(() =>{
        
        async function carregarDados() {
            setLoading(true);
            setDados([]);
            const dados = await getDadosPorMesAno(abaAtiva, mesSelecionado , 2026);            
            setDados(dados);
            setLoading(false);
        }        
          carregarDados()

    }, [mesSelecionado, anoSelecionado, abaAtiva]);

    //Somar totais:
    const totais = useMemo(() => {
        if (abaAtiva === 'tesouraria_ent') {            
            return dados.reduce((acc, item) => {
                acc.pix += (Number(item.entrada_pix) || 0);
                acc.especie += (Number(item.entrada_e) || 0);
                acc.totalSaidas += (Number(item.valor) || 0);
                return acc;
            }, { pix: 0, especie: 0 });
        }else if (abaAtiva === 'tesouraria_saidas'){
            return dados.reduce((acc, item) => {
                acc.totalSaidas += (Number(item.valor) || 0);
                return acc;
            }, { totalSaidas: 0});
        }else{
            return dados.reduce((acc, item) => {
                acc.totalTransf += (Number(item.valor_transf) || 0);
                return acc;
            }, { totalTransf: 0});
        }
    }, [dados, abaAtiva]);//importante para capturar as alterações, é como se fosse um usee
    const totalGeralPeriodo = totais.pix + totais.especie    
    
    return(
        <> 
            <div className="md:max-w-full sm:flex flex-row gap-4 items-center mb-4">
                
                {/* Texto informativo */}
                <p className="text-gray-200 text-sm font-medium whitespace-nowrap sm:mb-0 mb-2">
                    Selecione uma categoria
                </p> 
                <select onChange={(e) => setAbaAtiva(e.target.value)}
                    className="
                        sm:w-48 cursor-pointer 
                        bg-slate-900 
                        text-white 
                        border border-gray-400 
                        rounded-md 
                        px-2 py-2 pr-20
                        text-sm
                        appearance-none
                        focus:ring-2 focus:ring-blue-500/50 
                        transition-all"
                    >               
                    <option value="tesouraria_ent" className="bg-gray-800">Entradas</option>
                    <option value="tesouraria_saidas" className="bg-gray-800">Saídas</option>
                    <option value="tesouraria_transf" className="bg-gray-800">Depósitos</option>
                </select>

                <p className="text-gray-200 text-sm font-medium whitespace-nowrap sm:mb-0 mb-2 sm:mt-0 mt-4 ">Selecione o mês </p>
                <select
                    className="
                        sm:w-48 cursor-pointer 
                        bg-slate-900 
                        text-white 
                        border border-gray-400 
                        rounded-md 
                        px-2 py-2 pr-20
                        text-sm
                        appearance-none
                        focus:ring-2 focus:ring-blue-500/50 
                        transition-all" 
                    value={mesSelecionado} 
                    onChange={(e) => setMesSelecionado(Number(e.target.value))}
                >
                    {lista_meses.map((m) => (
                    <option className="bg-gray-800" key={m.id} value={m.id}>
                        {m.nome}
                    </option>
                    ))}
                </select>
            </div>

            {loading ? <p>Carregando...</p> : ( 

                <>
                    {abaAtiva === 'tesouraria_ent' &&(
                        <>
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
                                        {dados.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-800 transition-colors">
                                                <td className="px-2 sm:px-4 py-3 sm:py-4 text-gray-200 whitespace-nowrap">                
                                                    {new Date(item.data.replace('-', '/')).toLocaleDateString('pt-BR', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: '2-digit'
                                                    })}
                                                </td>
                                                <td className="px-2 sm:px-4 py-3 sm:py-4 text-gray-200 text-right">
                                                    R$ {(item.entrada_pix || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-2 sm:px-4 py-3 sm:py-4 text-gray-200 text-right">
                                                    R$ {(item.entrada_e || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-2 sm:px-4 py-3 sm:py-4 font-bold text-right text-emerald-300">
                                                    R$ {(item.valor_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </td>                                            
                                            </tr>
                                        ))}                                    
                                    </tbody>
                                </table>
                                
                                <div className="md:max-w-full sm:flex flex-row gap-4 items-center sm:justify-center">
                                    <p><strong>Total pix: {totais.pix.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></p>
                                    <p><strong>Total espécie: {totais.especie.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></p>
                                    <p><strong>Acumulado mês: {totalGeralPeriodo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></p>                                    
                                </div>
                                
                            </div>
                        </>
                        
                    )}

                    {abaAtiva === 'tesouraria_saidas' &&(
                        <>
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
                                    {dados.map((item) => (
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
                                            R$ {(item.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                                <div className="md:max-w-full sm:flex flex-row gap-4 items-center sm:justify-center">
                                    <p><strong>Total de despesas: {totais.totalSaidas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></p>                                    
                                </div>
                            </div>
                        </>
                    )}

                    {abaAtiva === 'tesouraria_transf' &&(
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs md:text-sm">
                                    <thead>
                                    <tr className="border-b border-gray-700 text-gray-300 uppercase text-[10px] sm:text-xs">
                                        <th className="px-2 sm:px-4 py-3 font-semibold whitespace-nowrap">Data</th>
                                        <th className="px-2 sm:px-4 py-3 font-semibold">Valor</th>
                                        <th className="px-2 sm:px-4 py-3 font-semibold">Observação</th>
                                    </tr>
                                    </thead>
                                    
                                    <tbody className="divide-y divide-gray-800">
                                    {dados.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-800 transition-colors">
                                        <td className="px-2 sm:px-4 py-3 sm:py-4 text-gray-200 whitespace-nowrap">                
                                            {new Date(item.data.replace('-', '/')).toLocaleDateString('pt-BR', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: '2-digit'
                                            })}
                                        </td>                                        
                                        <td className="px-2 sm:px-4 py-3 sm:py-4 font-bold text-right text-amber-500">
                                            R$ {(item.valor_transf || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-2 sm:px-4 py-3 sm:py-4 text-gray-200">
                                            {item.observacao}
                                        </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                                <div className="md:max-w-full sm:flex flex-row gap-4 items-center sm:justify-center">
                                    <p><strong>Total de depósitos: {totais.totalTransf.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></p>                                    
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}        
        </>    
    )
}