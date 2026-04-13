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



//Criação de uma outra função o acesso a uma tabela e a um período personalizado:
export const fetchDadosPorPeriodo = async (tableName, dataInicio, dataFim) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      // .gte = Greater Than or Equal (Maior ou igual a)
      .gte('created_at', dataInicio) 
      // .lte = Less Than or Equal (Menor ou igual a)
      .lte('created_at', dataFim)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Erro ao buscar período em ${tableName}:`, error.message);
    return [];
  }
};


//Criação de função para acessar os dados passando o mês e ano
export const getDadosPorMesAno = async (tableName, mes, ano) => {
  try {
    const mesFomatado = String(mes).padStart(2, '0');
    const dataInicio = `${ano}-${mesFomatado}-01`;        
    const ultimoDia = new Date(ano, mes, 0).getDate();
    const dataFim = `${ano}-${mesFomatado}-${ultimoDia}`;
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .gte('data', dataInicio)
      .lte('data', dataFim)
      .order('data', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Erro ao buscar ${tableName} em ${mes}/${ano}:`, error.message);
    return [];
  }
};