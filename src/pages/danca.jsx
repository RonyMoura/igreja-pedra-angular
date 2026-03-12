import PaginasAuxiliares from '../components/PaginasAuxiliares.jsx';
import Footer from '../components/Footer.jsx';

export default function Danca() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <PaginasAuxiliares />
      
      <main className="flex-grow container mx-auto p-8 max-w-4xl">
        {/* Título Principal */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
            Ministério de Dança
          <p className='text-amber-600 text-2xl'> "DESPERTAI"</p>
          </h1>
          <div className="h-1 w-20 bg-amber-500 mx-auto mt-2"></div>
        </div>

        {/* Liderança */}
        <section className="mb-12 text-center">
          <h2 className="text-amber-600 font-bold tracking-widest uppercase text-sm mb-2">Líder</h2>
          <p className="text-2xl font-extrabold text-slate-800">Mis. Carla</p>
        </section>

        {/* Integrantes em Ordem Alfabética: Alice, Ana Clara, Giovana */}
        <section className="mb-16">
          <h3 className="text-center text-slate-500 font-semibold uppercase text-xs tracking-widest mb-6">
            Integrantes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            {["Alice", "Ana Clara", "Giovana"].map((nome) => (
              <div key={nome} className="bg-white p-4 rounded shadow-sm border-l-4 border-amber-500 font-bold text-slate-700 uppercase tracking-tight">
                {nome}
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}