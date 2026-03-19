import PaginasAuxiliares from '../components/PaginasAuxiliares';
import Footer from '../components/Footer';

export default function CelulaJesusSalva() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
            <PaginasAuxiliares />

            <main className="flex-grow container mx-auto p-8 max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">
                        Células
                    </h1>
                <div className="h-1 w-20 bg-amber-500 mx-auto mt-2"></div>                
                </div>
                <h3 className="text-center text-3xl font-extrabold text-amber-600 mb-2">
                    JESUS SALVA
                </h3>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 text-center border-y border-slate-200 py-10">
                    {/* Bloco das Anfitriãs */}
                    <div className="flex flex-col items-center">
                        <h4 className="text-amber-600 font-bold tracking-widest text-sm mb-2">Anfitriãs</h4>
                        <p className="text-3xl font-black text-slate-800 leading-tight">Lizandra & Luciana</p>
                    </div>

                    {/* Bloco dos Líderes */}
                    <div className="flex flex-col items-center">
                        <h4 className="text-amber-600 font-bold tracking-widest text-sm mb-2">Líderes</h4>
                        <p className="text-3xl font-black text-slate-800 leading-tight">Pr. Sérgio & Pra. Gi</p>
                    </div>

                    <div className="md:col-span-2 pt-6 flex flex-col items-center">
                        <h4 className="text-amber-600 font-bold tracking-widest text-sm mb-2">Encontros</h4>
                        <p className="text-lg font-bold text-slate-900">Terças-feiras, às 20h</p>
                    </div>

                    <div className="md:col-span-2 pt-2 flex flex-col items-center">
                        <h4 className="text-amber-600 font-bold tracking-widest text-sm mb-2">Endereço</h4>
                        <p className="text-lg font-bold text-slate-900">Rua Henrique Múzzio, 194 - Jd. Varginha - São Paulo/ SP</p>
                    </div>                    
                </section>

            </main>
            <Footer />
        </div>
    )
}