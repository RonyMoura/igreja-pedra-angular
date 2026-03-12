import PaginasAuxiliares from '../components/PaginasAuxiliares.jsx'; // Note o ../ para sair da pasta pages e entrar em components
import Footer from '../components/Footer.jsx';
import { useState } from 'react'; //Funcionalidade para capturar os dados do formulário

export default function Diaconato() {

  //Deixar a caixa de opção de e-mail oculta
  const [mostrarOpcoes, setMostrarOpcoes] = useState(false);

  // 1. Variável do tipo constante para guardar os valores digitados no formulário
  const [formData, setFormData] = useState({
    nome: '', //Esse valor foi chamado dentro do input do formulário, igualmente os demais
    telefone: '',
    endereco: ''
  });

  // 2. Capturar o evento de alteração no formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /* 3. Impedir que a página atualize após clicar no botão para enviar o formulário
  const handleSubmit = (e) => { //Passada para a tag form
    e.preventDefault(); // Esta linha impede que a página dê "refresh" ao clicar no botão
    console.log("Dados prontos para envio:", formData);

    // 1. Definimos o destinatário e o assunto
    const emailDestinatario = ""; 
    const assunto = "Solicitação de Visita - Diaconato";

    // 2. Montamos o corpo da mensagem com os dados do formulário
    const corpo = `Visita solicita pelo formulário do diaconato:
    Nome: ${formData.nome}
    Telefone: ${formData.telefone}
    Endereço: ${formData.endereco}`;

    // 3. Criamos o link especial 'mailto' e pedimos ao navegador para abrir
    window.location.href = `mailto:${emailDestinatario}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
  };*/

  const handleSubmit = (e) => {
  e.preventDefault();
  
  // Verificação simples: se o nome estiver vazio, não faz nada
  if (!formData.nome || !formData.telefone) {
    alert("Por favor, preencha os campos: nome e telefone.");
    return;
  }

  // Em vez de enviar agora, apenas mostramos as opções de escolha
  setMostrarOpcoes(true);
  };

  //Função para enviar a mensagem pelo whatsapp:
  const enviarWhatsApp = () => {
    // 1. Número limpo (apenas os dígitos)
    const telefone = import.meta.env.VITE_WHATS_DIACONATO; 
    
    // 2. Texto formatado
    const texto = `Olá! Gostaria de solicitar uma visita da equipe do diaconato:\nNome: ${formData.nome}\nTelefone: ${formData.telefone}\nEndereço: ${formData.endereco}`;
    
    // 3. A URL (USE CRASE AQUI, NÃO ASPAS)
    // Note o símbolo ` no início e no fim da URL
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(texto)}`;

    // 4. Comando de envio
    window.location.href = url;   

    // Pequeno "truque": se em 500ms o app não abrir, tentamos o link web como reserva
    setTimeout(() => {
      if (document.hasFocus()) {
        window.location.href = url;
      }
    }, 500);
  };

  const enviarEmail = () => {
    const destinatarios = import.meta.env.VITE_EMAIL_DIACONATO;
    const assunto = "Solicitação de Visita da Equipe do Diaconato";
    const corpo = `A pessoa abaixo está solicitando uma visita:\nNome: ${formData.nome}\nTelefone: ${formData.telefone}\nEndereço: ${formData.endereco}`;

    // Montamos o link mailto padrão
    window.location.href = `mailto:${destinatarios}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;

    // Limpamos o formulário após o disparo
    setFormData({ nome: '', telefone: '', endereco: '' });
    setMostrarOpcoes(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <PaginasAuxiliares />
      
      <main className="flex-grow container mx-auto p-8 max-w-4xl">
        {/* Título Principal */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
            Diaconato
          </h1>
          <div className="h-1 w-20 bg-amber-500 mx-auto mt-2"></div>
        </div>

        {/* Seção Diretores */}
        <section className="mb-12 text-center uppercase">
          <h2 className="text-amber-600 font-bold tracking-widest text-sm mb-2">Diretores</h2>
          <p className="text-2xl font-extrabold text-slate-800">Paulo e Fiama</p>
        </section>

        {/* Seção Equipe em Colunas */}
        <section className="mb-16">
          <h3 className="text-center text-slate-500 font-semibold uppercase text-xs tracking-widest mb-6">Equipe de Servos</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center uppercase">
            {[
              "Carlos", "Domingas", "Inês", "Lizandra", "Luciana", 
              "Marlene", "Pr. Jonas", "Ricardo", "Rony", "Rosângela", 
              "Tatiani", "Victor", "Winnie"
            ].map((nome) => (
              <div key={nome} className="bg-white p-3 rounded shadow-sm border-l-4 border-amber-500 font-medium text-slate-700">
                {nome}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-100 p-8 rounded-2xl border border-slate-200 shadow-inner">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800">
              Contate-nos para uma visita, será um <span className="text-amber-600">prazer</span> servi-lo(a)
            </h2>
            <p className="text-slate-500 text-sm mt-2">Deixe seu contato abaixo e retornaremos em breve.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1 ml-1">Nome Completo</label>
              <input 
                type="text"
                name='nome'//O mesmo que consta na constante do useState
                value={formData.nome}
                onChange={handleChange} 
                placeholder="Digite seu nome" 
                className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1 ml-1">Contato Telefônico</label>
              <input 
                type="tel"
                name="telefone"
                value={formData.telefone} 
                onChange={handleChange} 
                placeholder="(00) 00000-0000" 
                className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1 ml-1">Endereço</label>
              <input 
                type="text"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                placeholder="Rua, número, bairro..." 
                className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>

            <button 
              type="submit" 
              className="mt-4 bg-black text-amber-500 font-black uppercase tracking-widest p-4 rounded-lg hover:bg-slate-800 transition-colors shadow-lg"
            >
              Enviar Solicitação
            </button>
          </form>

          {mostrarOpcoes && (
          <div className="mt-8 p-6 border-t-2 border-slate-200 animate-fade-in">
            <p className="text-center font-bold text-slate-700 mb-4">
              Como prefere enviar sua solicitação?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              
              {/*Ao solicitar o envio, os botões de escolha são apresentados na tela*/}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                
                {/* Botão para WhatsApp */}
                <button
                  onClick={enviarWhatsApp}
                  className="flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors shadow-md"
                >
                  <span>Via WhatsApp</span>
                </button>

                {/* Botão para E-mail */}
                <button
                  onClick={enviarEmail}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                  <span>Via E-mail</span>
                </button>
              </div>

            </div>
          </div>
        )}
        </section>
      </main>

      <Footer />
    </div>
  );
}