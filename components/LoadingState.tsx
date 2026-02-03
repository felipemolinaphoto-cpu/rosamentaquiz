
import React, { useState, useEffect } from 'react';
import { COLORS } from '../constants';

const LoadingState: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const messages = [
    "Analisando sua essência...",
    "Curando referências visuais...",
    "Compondo seu mood board personalizado...",
    "Quase pronto, refinando detalhes..."
  ];

  useEffect(() => {
    const messageTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);

    // Simulação de progresso fluida (12 segundos para 100%)
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 0.8;
      });
    }, 100);

    return () => {
      clearInterval(messageTimer);
      clearInterval(progressTimer);
    };
  }, [messages.length]);

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center max-w-lg mx-auto px-6">
      <div className="mb-12">
        <svg viewBox="0 0 100 100" className="w-12 h-12 animate-pulse mx-auto mb-6" style={{ fill: COLORS.mainPink }}>
          <path d="M50 0 L55 45 L100 50 L55 55 L50 100 L45 55 L0 50 L45 45 Z" />
        </svg>
        <h2 className="serif text-3xl italic tracking-wide text-black/80 mb-2">
          Alinhando Essência e Morar...
        </h2>
        <p className="text-[10px] tracking-[0.3em] uppercase opacity-40 font-bold">
          {messages[messageIndex]}
        </p>
      </div>

      <div className="w-full h-[6px] bg-black/5 rounded-full overflow-hidden relative mb-4">
        <div
          className="h-full transition-all duration-300 ease-out rounded-full"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${COLORS.mintGreen}, ${COLORS.mainPink})`
          }}
        ></div>
      </div>

      <div className="flex justify-between w-full text-[8px] tracking-widest uppercase opacity-30 font-bold">
        <span>Conectando Estilo</span>
        <span>{Math.round(progress)}%</span>
      </div>

      <style>{`
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.95); }
        }
        .animate-pulse-soft { animation: pulse-soft 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default LoadingState;
