
import React from 'react';
import { COLORS } from '../constants';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8" style={{ backgroundColor: COLORS.cream }}>
      {/* Elementos de Fundo */}
      <div className="fixed top-0 right-0 w-80 h-80 bg-mintGreen opacity-20 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-sageGreen opacity-20 blur-[120px] rounded-full -ml-32 -mb-32 pointer-events-none"></div>
      
      <header className="mb-12 mt-8 text-center relative z-10 flex flex-col items-center">
        <h1 className="serif text-4xl md:text-5xl tracking-[0.4em] font-light uppercase mb-4" style={{ color: COLORS.black }}>
          ROSA MENTA
        </h1>
        <div className="flex items-center gap-3">
          <div className="h-[0.5px] w-8 bg-black/20"></div>
          <p className="text-[9px] tracking-[0.5em] uppercase opacity-70 font-semibold" style={{ color: COLORS.darkGreen }}>
            Arquitetura & Design
          </p>
          <div className="h-[0.5px] w-8 bg-black/20"></div>
        </div>
      </header>
      
      <main className="w-full max-w-4xl relative z-10">
        {children}
      </main>
      
      <footer className="mt-16 mb-8 text-center relative z-10">
        <p className="opacity-40 text-[8px] tracking-[0.4em] uppercase">Rosa Menta ARQ • Estilo & Identidade</p>
      </footer>
    </div>
  );
};

export default Layout;
