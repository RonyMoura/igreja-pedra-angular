// src/servicos/RealtimeService.js
import { supabase } from '../supabaseClient';

/**
 * Cria um canal que escuta múltiplos eventos em várias tabelas.
 * @param {Function} callback - A função que será executada quando QUALQUER mudança ocorrer.
 */
export const subscreverMudancasTesouraria = (callback, nomeCanal = 'geral') => {
  const canal = supabase
    .channel(`fluxo-caixa-${nomeCanal}`) // Nome dinâmico!
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tesouraria_ent' }, callback)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tesouraria_saidas' }, callback)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tesouraria_transf' }, callback)
    .subscribe();
    console.log(canal)
  return canal;
  
};
