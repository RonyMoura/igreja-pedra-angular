// src/servicos/RealtimeService.js
import { supabase } from '../supabaseClient';

/**
 * Cria um canal que escuta múltiplos eventos em várias tabelas.
 * @param {Function} callback - A função que será executada quando QUALQUER mudança ocorrer.
 */
export const subscreverMudancasTesouraria = (callback) => {
  const canal = supabase
    .channel('fluxo-caixa-geral')
    // Escuta Entradas
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tesouraria_ent' }, callback)
    // Escuta Saídas
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tesouraria_saidas' }, callback)
    // Escuta Transferências
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tesouraria_transf' }, callback)
    
    .subscribe();

  return canal;
};