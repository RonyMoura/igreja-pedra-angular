import { useState, useEffect } from 'react' // Adicionamos o useEffect aqui
import { useNavigate } from 'react-router-dom' // Adicionamos o useNavigate aqui
import { supabase } from '../supabaseClient' // Verifique se o caminho está correto
import PaginasAuxiliares from '../components/PaginasAuxiliares' // Importe o seu cabeçalho padrão

export default function PaginaFormularioCultos() {
  
  const navigate = useNavigate(); 
  const [verificandoAcesso, setVerificandoAcesso] = useState(true);
  
  useEffect(() => {
    const verificarSessao = async () => {
      // 1. O Supabase olha no LocalStorage do navegador em busca da Key
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        // 2. Se NÃO achar a chave, manda para o login imediatamente
        navigate('/painel'); 
      } else {
        // 3. Se ACHAR a chave, libera a visualização do formulário
        setVerificandoAcesso(false);
      }
    };

    verificarSessao();
  }, [navigate]);

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: '',
    data: '',
    preletor: '',
    url1: '',
    url2: '',
    descricao: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('historico_cultos')
      .insert([formData])

    if (error) {
      alert('Erro: ' + error.message)
    } else {
      alert('Culto registrado com sucesso!')
      setFormData({ titulo: '', tipo: '', data: '', preletor: '', url1: '', url2: '', descricao: '' })
    }
    setLoading(false)
  }
  
  if (verificandoAcesso) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-amber-500 font-black animate-pulse uppercase tracking-widest">
          Verificando Chave de Acesso...
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* 1. SEU CABEÇALHO PADRÃO */}
      <PaginasAuxiliares />

      {/* 2. CORPO DA PÁGINA COM AJUSTE PARA CELULAR */}
      <main className="flex-grow flex items-center justify-center p-4 md:p-10">
        <div className="w-full max-w-2xl bg-white shadow-2xl rounded-xl border-t-8 border-amber-500 p-6 md:p-10">
          
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 text-center border-b pb-4">
            Registrar Culto Especial
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-amber-600 mb-1">Título do Culto *</label>
                <input name="titulo" required className="w-full p-3 border-2 border-slate-200 rounded focus:border-amber-500 outline-none transition-all" value={formData.titulo} onChange={handleChange} />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-amber-600 mb-1">Tipo</label>
                <input name="tipo" placeholder="Ex: Santa Ceia" className="w-full p-3 border-2 border-slate-200 rounded focus:border-amber-500 outline-none" value={formData.tipo} onChange={handleChange} />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-amber-600 mb-1">Data *</label>
                <input name="data" type="date" required className="w-full p-3 border-2 border-slate-200 rounded focus:border-amber-500 outline-none" value={formData.data} onChange={handleChange} />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-amber-600 mb-1">Preletor</label>
                <input name="preletor" className="w-full p-3 border-2 border-slate-200 rounded focus:border-amber-500 outline-none" value={formData.preletor} onChange={handleChange} />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-amber-600 mb-1">Link Vídeo (YouTube) *</label>
                <input name="url1" required placeholder="https://..." className="w-full p-3 border-2 border-slate-200 rounded focus:border-amber-500 outline-none" value={formData.url1} onChange={handleChange} />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-amber-600 mb-1">Link Extra (Fotos/Drive)</label>
                <input name="url2" placeholder="Opcional" className="w-full p-3 border-2 border-slate-200 rounded focus:border-amber-500 outline-none" value={formData.url2} onChange={handleChange} />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-amber-600 mb-1">Descrição</label>
                <textarea name="descricao" rows="3" className="w-full p-3 border-2 border-slate-200 rounded focus:border-amber-500 outline-none" value={formData.descricao} onChange={handleChange}></textarea>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black text-white font-black py-4 rounded shadow-lg hover:bg-amber-500 hover:text-black transition-all uppercase tracking-widest mt-4 disabled:bg-slate-400"
            >
              {loading ? 'Salvando...' : 'Publicar no Histórico'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
