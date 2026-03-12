import React, { useState, useEffect, useCallback } from 'react';


const Carrossel = () => {
  // Array de dados: Imagem + Link (que você usará no futuro)
  const slides = [
    { id: 2, img: "/public/encontro-casais.webp", link: "/pagina-1" },
    { id: 1, img: "/encontro.webp", link: "/pagina-2" },
    { id: 3, img: "/celula-jesus-salva.webp", link: "/pagina-1" },
    { id: 4, img: "/oracao.webp", link: "/pagina-3" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Lógica de troca automática (Auto-play)
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer); 
  }, [nextSlide]);

  return (
    <section className="relative w-full overflow-hidden group">
      {/* Container dos Slides */}
      <div 
        className="flex transition-transform duration-700 ease-in-out" 
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <a 
            key={slide.id} 
            href={slide.link} 
            className="min-w-full block"
            onClick={(e) => {
                // Previne o erro de página não encontrada enquanto você não cria as rotas
                if(slide.link.startsWith('/')) e.preventDefault(); 
                console.log(`Navegando para: ${slide.link}`);
            }}
          >
            <img 
              src={slide.img} 
              alt={`Slide ${slide.id}`} 
              //className="w-full h-[300px] md:h-[500px] object-cover"
              className="w-full aspect-[10/9] md:aspect-[21/9] object-contain rounded-2xl" 
            />
          </a>
        ))}
      </div>

      {/* Seta Esquerda */}
      <button 
        onClick={prevSlide}
        className="absolute left-1 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md text-white p-3 rounded-full opacity-50 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 border border-white/30 shadow-lg"
      >
        <span className="text-xl md:text-2xl font-bold">&#10094;</span>
      </button>

      {/* Seta Direita */}
      <button 
        onClick={nextSlide}
        className="absolute right-1 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md text-white p-3 rounded-full opacity-50 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 border border-white/30 shadow-lg"
      >
        <span className="text-xl md:text-2xl font-bold">&#10095;</span>
      </button>

      {/* Indicadores Visuais (Dots) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-3 h-3 rounded-full transition-all ${currentIndex === i ? 'bg-white scale-125' : 'bg-white/40'}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Carrossel;