import { supabase } from '../supabaseClient';


const fechDadosTesouraria = async (tableName, limit = 5) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false }) // Organiza pelo mais recente
      .limit(limit); // Busca apenas a quantidade desejada
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Erro em ${tableName}:`, error.message);
    return [];
  }
};

export const getUltimasEntradas = () => fechDadosTesouraria('tesouraria_ent',)
export const getUltimasSaidas = () => fechDadosTesouraria('tesouraria_saidas',)
export const getUltimasTransf = () => fechDadosTesouraria('tesouraria_transf', 3)
