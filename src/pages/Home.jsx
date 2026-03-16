import { Link } from 'react-router-dom'; // Para mudar de telas instântaneamente, já que o arquivo foi carregado no primeiro acesso
import React, { useState, useRef } from 'react' // Adicione o useState e o useRef
import Carrossel from '../carrossel'; // Certifique-se que o caminho está correto
import { listaDiretoria } from '../dados/diretoria';
import Footer from '../components/Footer'; // Componetização da página de rodapé

function Home() {

  // 1. Criamos uma 'referência' para a caixa de fotos (para o botão saber quem empurrar)
  const carrosselRef = useRef(null);
  // 2. Função para o botão "Próximo"
  const proximo = () => {
    if (carrosselRef.current) {
      carrosselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  // 3. Função para o botão "Anterior"
  const anterior = () => {
    if (carrosselRef.current) {
      carrosselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  // 4. Função para adicionar um Dropdown (Extensão) da barra de navegação
  const [exibirSubMenu, setExibirSubMenu] = useState(false);

  // 5. Função para adicionar o efeito de bolinhas abaixo das imagens (Diretoria)
  const [activeIndex, setActiveIndex] = React.useState(0);
  
  const handleScroll = () => {
    if (carrosselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carrosselRef.current;
      
      // Pegamos a largura total de um item + o gap
      const scrollTotal = scrollWidth - clientWidth;
      const scrollProgress = scrollLeft / scrollTotal;
      
      // Calculamos o índice baseando no número total de itens
      const index = Math.round(scrollProgress * (listaDiretoria.length - 1));
      
      // Só atualiza o estado se o índice realmente mudou (evita re-render desnecessário)
      if (index !== activeIndex) {
        setActiveIndex(index);
      }
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
        {/* CABEÇALHO */}
      <header className="bg-black text-white py-8 px-6 text-center border-b-8 border-amber-500 shadow-2xl">
        <div className="container mx-auto flex flex-col items-center"> {/* O flex-col empilha um embaixo do outro */}
          
          {/* A TAG DA IMAGEM (LOGO) */}
          <img 
            src="/logo.webp"            // Caminho da imagem na pasta public
            alt="Logo Pedra Angular"   // Texto alternativo (acessibilidade)
            //className="w-32 h-auto mb-6 shadow-lg(sombra com sensação de flutuação) rounded-full(arredondamento da imagem)"
            className="w-32 h-auto mb-6" // Classes de estilo
          />

          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
            Igreja Pedra Angular
          </h1>
          
          <div className="h-1 w-24 bg-amber-500 mx-auto mt-4 mb-2"></div>
          
          <p className="text-amber-400 font-bold text-lg tracking-widest uppercase">
            Missão e Reino
          </p>

          {/* SEÇÃO DE LINKS ADICIONADA */}
          <nav className="mt-4 w-full max-w-md mx-auto relative">
            <ul className="flex gap-8 overflow-x-auto py-2">
              <li>
                <a href="#historia" className="nav-link-custom"
                >
                  História
                </a>
              </li>
              <li>
                <a href="#cultos" className="nav-link-custom"
                >
                  Cultos
                </a>
              </li>
              <li>
                <a href="#diretoria" className="nav-link-custom"
                >
                  Diretoria
                </a>
              </li>
              <li className='nav-link-custom'>
                <button onClick={() => setExibirSubMenu(!exibirSubMenu)}>
                  MAIS...
                </button>
            </li>
            </ul>
            {/* O DROPDOWN (Menu Flutuante) */}
            {exibirSubMenu && (
              <div className="bg-gray-500 rounded-lg mt-2">
                <ul className="flex flex-wrap p-4 gap-4 justify-center">
                  <li className='w-full'>
                    <Link 
                        to="/diaconato" // APENAS O APELIDO DA ROTA
                        onClick={() => setExibirSubMenu(false)} 
                        className="nav-link-subcustom"
                        >
                            Diaconato
                    </Link>
                  </li>
                  <li className='w-full'>
                    <Link 
                        to="/louvor" // APENAS O APELIDO DA ROTA
                        onClick={() => setExibirSubMenu(false)} 
                        className="nav-link-subcustom"
                        >
                            Ministério de Louvor
                    </Link>
                  </li>               
                  <li className='w-full'>
                    <Link 
                        to="/danca" // APENAS O APELIDO DA ROTA
                        onClick={() => setExibirSubMenu(false)} 
                        className="nav-link-subcustom"
                        >
                            Ministério de Dança
                    </Link>
                  </li>
                  
                  {/*
                  <li className='w-full'>
                    <a 
                      href="/outra-tela" 
                      onClick={() => setExibirSubMenu(false)} // FECHA O MENU AO CLICAR
                      className="nav-link-subcustom"
                    >
                        Grupo de jovens
                    </a>
                  </li>
                  */}
                  <li className='w-full'>
                    <Link 
                        to="/jovens" // APENAS O APELIDO DA ROTA
                        onClick={() => setExibirSubMenu(false)} 
                        className="nav-link-subcustom"
                        >
                            Grupo de Jovens
                    </Link>
                  </li>
                  <li className='w-full'>
                    <Link 
                        to="/painel" // APENAS O APELIDO DA ROTA
                        onClick={() => setExibirSubMenu(false)} 
                        className="nav-link-subcustom"
                        >
                            Área de membros
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </nav>
        </div>
      </header>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="flex-grow flex flex-col items-center p-4">{/*estica o conteúdo; posiciona em coluna; centraliza vertical e horizontalmente;*/}
          
          {/* CARROSSEL*/}
          <div className="carrossel-custom">
            <h2 className="h2-fundo-preto">
              PROGRAMAÇÃO
            </h2>
          <Carrossel />
          </div>

          {/*Conteúdos das seções */}
          <section id="historia" className="section-custom">
            <h2 className="h2-fundo-preto">
              HISTÓRIA
            </h2>
            <span className="section-conteudo">
              Conteúdo sobre a história aqui...
            </span>
            
          </section>

          <section id="cultos" className="section-custom">
            <h2 className="h2-fundo-preto">
              CULTOS
            </h2>
            <span className="section-conteudo">
              <p>Quintas-feiras: 19h30</p>
              <p>Domingos: 18h30</p>
              <Link to="/historico_cultos">
                <button className="mt-8 border-b-4 border-amber-500 rounded-2xl py-2 px-6 font-bold hover:bg-amber-500 hover:text-black transition-all shadow-lg">
                  Histórico de Cultos
                </button>
              </Link>
            </span>
            
          </section>

          <section id="diretoria" className="section-custom">
            <div className="container mx-auto px-1">{/* O 'overflow-hidden' corta o que sair da margem do container */}  
              <h2 className="h2-fundo-preto">
                DIRETORIA
              </h2>
              {/* O carrossel entra no lugar do span antigo */}
              <div className="flex items-center mt-3">                
                {/* Botão Anterior (Desktop) */}
                <button 
                  onClick={anterior}
                  className="hidden md:flex absolute -left-6 z-10 bg-amber-500 p-3 rounded-full shadow-xl hover:scale-110 transition-all active:scale-95"
                >
                  &#10094;
                </button>

                {/* CONTAINER QUE DESLIZA */}
                {/* A classe 'scrollbar-hide' é essencial para não aparecer a barra feia embaixo */}
                <div 
                  ref={carrosselRef}
                  onScroll={handleScroll}
                  className="flex overflow-x-auto gap-6 w-full px-2 py-1 scroll-smooth snap-x snap-mandatory scrollbar-hide"
                >
                  {listaDiretoria.map((membro) => (
                    <div 
                      key={membro.id} 
                      className="basis-full md:basis-1/2 lg:basis-1/3 flex-shrink-0 snap-center bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100"
                    >
                      {/* Foto do Membro */}
                      <img 
                        src={membro.foto} 
                        alt={membro.nome} 
                        className="w-full aspect-[4/6] md:aspect-square object-cover object-top" 
                      />
                      
                      {/* Descrição que muda junto com a imagem */}
                      <div className="p-6 text-left">
                        <h3 className="text-xl font-bold text-slate-900">{membro.nome}</h3>
                        <p className="text-amber-600 font-bold text-sm uppercase mb-2">{membro.cargo}</p>
                        <p className="text-slate-600 text-sm leading-relaxed border-t pt-2">
                          {membro.descricao}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>                     

                {/* Botão Próximo (Desktop) */}
                <button 
                  onClick={proximo}
                  className="hidden md:flex absolute -right-6 z-10 bg-amber-500 p-3 rounded-full shadow-xl hover:scale-110 transition-all active:scale-95"
                >
                  &#10095;
                </button>

              </div>

              {/* Efeito visual de mudança de cards (bolinhas laranjas*/}
                <div className="flex justify-center gap-2 mt-2 pb-2">
                  {listaDiretoria.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        activeIndex === index 
                          ? "w-8 bg-amber-600" // Cor de destaque (ex: âmbar como seu cargo)
                          : "w-2 bg-slate-300 opacity-50"
                      }`}
                    />
                  ))}
                </div>
            </div>              
          </section>

        </main>
        <Footer />{/*Rodapé importado de componentes*/}
    </div>
  )
}

export default Home