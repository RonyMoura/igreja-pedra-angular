import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export function useSaldos() {
  const [saldos, setSaldos] = useState({ subpix: 0, subEspecie: 0, total: 0 })

  // 1. Função que calcula os saldos (Reutilizável)
  const calcularSaldos = async () => {
    //buscar os dados na tabela de entradas:
    const { data, error } = await supabase
      .from('tesouraria_entradas')
      .select('valor_total, tipo')
    //buscar os dados na tabela de saídas:
    const {data: dados, error: error2} = await supabase
      .from('tesouraria_saidas')
      .select('valor, origem')
    if (!error && data && !error2 && dados) {
      const pix = data
        .filter(item => item.tipo === 'pix')
        .reduce((acc, item) => acc + Number(item.valor_total), 0)

      const especie = data
        .filter(item => item.tipo === 'especie')
        .reduce((acc, item) => acc + Number(item.valor_total), 0)
      
        const saidaConta = dados
        .filter(item => item.origem === 'conta')
        .reduce((acc, item) => acc + Number(item.valor), 0)
      
        const saidaEspecie = dados
        .filter(item => item.origem === 'especie')
        .reduce((acc, item) => acc + Number(item.valor), 0)

        const subpix = pix - saidaConta;
        const subEspecie = especie - saidaEspecie;
        
      setSaldos({ subpix, subEspecie, total: subpix + subEspecie })
    }
  }

  useEffect(() => {
    // Assim que carregar a página busca fazer chama a função:
    calcularSaldos()
    
    // inserir um canal para caputar mudanças nas tabelas
    const canal = supabase
      .channel('mudancas-tesouraria') // Nome qualquer para o canal
      // captuar eventos de mudanças da tabela de entradas
      .on(
        'postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'tesouraria_entradas' }, 
        () => {
          calcularSaldos() // Se houver um novo INSERT, ele roda a soma de novo
        }
      )
      // captuar eventos de mudanças da tabela de saídas
      .on(
        'postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'tesouraria_saidas' }, 
        () => {
          calcularSaldos() // Se houver um novo INSERT, ele roda a soma de novo
        }
      )
      .subscribe()

    // Limpeza ao fechar a página (boa prática para não vazar memória)
    return () => {
      supabase.removeChannel(canal)
    }
  }, [])

  return saldos // Retorna o objeto com os 3 valores
}