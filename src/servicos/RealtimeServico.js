// src/servicos/RealtimeService.js
import { supabase } from '../supabaseClient';

/**
 * Cria um canal que escuta múltiplos eventos em várias tabelas.
 * @param {Function} callback - A função que será executada quando QUALQUER mudança ocorrer.
 
export const subscreverMudancasTesouraria = (callback, nomeCanal = 'geral') => {
  const canal = supabase
    .channel(`fluxo-caixa-${nomeCanal}`) // Nome dinâmico!
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tesouraria_ent' }, callback)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tesouraria_saidas' }, callback)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tesouraria_transf' }, callback)
    .subscribe();
    
    return canal;
  
};

*/


let canalUnico = null;
const listeners = new Set(); // Lista de funções que querem receber os dados

const handleChanges = (payload) => {
  // Quando chega algo, avisamos todo mundo que está na lista
  listeners.forEach((callback) => callback(payload));  
};

export const subscreverGeral = (callback) => {
  listeners.add(callback);

  // Se o canal ainda não existe, criamos agora
  if (!canalUnico) {
    canalUnico = supabase
      .channel('fluxo-caixa-central')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tesouraria_ent' }, handleChanges)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tesouraria_saidas' }, handleChanges)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tesouraria_transf' }, handleChanges)
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') console.log('Conectado ao canal central!');
      });
  }

  // Função para a página se "desinscrever" sem fechar o canal global
  return () => {
    listeners.delete(callback);
    // Opcional: Se listeners.size === 0, você poderia fechar o canalUnico se quiser economizar
  };
};