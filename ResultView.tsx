
import { COLORS } from '../constants';
import { QuizResult } from '../types';
import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ResultViewProps {
  result: QuizResult;
  userName: string;
  answersLabels: string[];
  onRestart: () => void;
  onSendReport: (result: QuizResult) => void;
}

const ResultView: React.FC<ResultViewProps> = ({ result, userName, answersLabels, onRestart, onSendReport }) => {
  const [isSent, setIsSent] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // Função principal para gerar o PDF e compartilhar
  const handleShareResult = async (downloadOnly = false) => {
    // SE NÃO FOR DOWNLOAD, É O FLUXO DE WHATSAPP + EMAIL
    if (!downloadOnly) {
      if (!isSent) {
        // 1. Envio Automático do E-mail (Webhook) em Background
        import('../services/notifications').then(({ sendQuizResultEmail }) => {
          sendQuizResultEmail({
            userName,
            result,
            answers: answersLabels,
            date: new Date().toLocaleDateString('pt-BR')
          });
        });
      }

      // 2. Compartilhamento WhatsApp (Mobile / Desktop)
      // Ação 1: Enviar mensagem específica para WhatsApp
      const phone = "5521979386051";
      const text = "Oi, respondi o quiz!";
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

      // Abre o WhatsApp
      window.open(url, '_blank');

      onSendReport(result);
      setIsSent(true);
      return;
    }

    // --- ABAIXO SÓ EXECUTA SE FOR downloadOnly = true ---
    if (!resultRef.current) return;
    setIsGenerating(true);

    try {
      // 1. Gerar o Canvas
      const canvas = await html2canvas(resultRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: COLORS.cream,
        onclone: (clonedDoc) => {
          const noPrint = clonedDoc.querySelectorAll('.no-pdf');
          noPrint.forEach(el => (el as HTMLElement).style.display = 'none');
        }
      });

      // 2. Gerar o PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);

      // Salvar arquivo
      pdf.save(`Rosa_Menta_${userName.replace(/\s+/g, '_')}.pdf`);

    } catch (err) {
      console.error("Erro no download:", err);
      alert("Houve um erro ao gerar o PDF. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const parseText = (text: string) => {
    const parts = text.split(/(\[.*?\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        const word = part.slice(1, -1);
        const color = i % 3 === 0 ? COLORS.mainPink : COLORS.sageGreen;
        return <span key={i} className="font-semibold" style={{ color }}>{word}</span>;
      }
      return part;
    });
  };

  // Separa por \n ou \\n (quebra de linha literal ou string)
  const paragraphs = result.analysisText.split(/\\n|\n/).filter(p => p.trim() !== '');

  return (
    <div className="animate-fade-in-up space-y-12 pb-16">
      <div ref={resultRef} id="report-container" className="space-y-10">
        <div className="flex flex-col items-center">
          <div className="text-center space-y-4">
            <h1 className="serif text-4xl md:text-6xl text-black italic leading-tight">
              {result.profileName}
            </h1>
            <p className="text-[10px] tracking-[0.5em] uppercase opacity-40 font-bold text-black/60">
              Identidade & Morar
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          <div className="space-y-6">
            <div className="relative bg-white p-4 rounded-[2.5rem] shadow-2xl border border-white/50 h-full flex flex-col justify-center min-h-[400px]">
              <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden bg-gray-100 flex items-center justify-center group shadow-inner">
                <img
                  src={result.imageUrl}
                  alt="Mood Board"
                  crossOrigin="anonymous"
                  loading="eager"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error("Image failed:", result.imageUrl);
                    e.currentTarget.style.display = 'none';
                    // Show retry UI
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      // Check if fallback already exists to avoid duplication
                      if (!parent.querySelector('.fallback-msg')) {
                        const fallback = document.createElement('div');
                        fallback.className = 'fallback-msg absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4';
                        fallback.innerHTML = `
                                <p class="text-xs text-gray-500 font-medium">Não foi possível carregar a imagem.</p>
                                <a href="${result.imageUrl}" target="_blank" class="px-4 py-2 bg-black text-white text-[10px] uppercase rounded-full hover:bg-black/80">Ver Imagem (Link Direto)</a>
                            `;
                        parent.appendChild(fallback);
                      }
                    }
                  }}
                />
              </div>

              <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg z-10">
                <svg viewBox="0 0 100 100" className="w-5 h-5" style={{ fill: COLORS.mainPink }}>
                  <path d="M50 0 L55 35 L90 10 L65 45 L100 50 L65 55 L90 90 L55 65 L50 100 L45 65 L10 90 L35 55 L0 50 L35 45 L10 10 L45 35 Z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] shadow-sm border border-white/80 flex flex-col justify-between">
            <div>
              <div className="serif text-3xl mb-8 text-black font-medium border-b border-black/5 pb-6 italic tracking-wide">
                {result.profileName}
              </div>
              <div className="space-y-6">
                {paragraphs.map((p, i) => (
                  <p key={i} className="leading-relaxed font-light text-sm md:text-base text-black/80 indent-8 text-justify">
                    {parseText(p)}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-12 space-y-4 no-pdf">
              <button
                onClick={() => handleShareResult(false)}
                disabled={isGenerating}
                className="w-full py-4 px-8 rounded-full text-xs tracking-[0.2em] uppercase transition-all font-bold shadow-xl flex items-center justify-center gap-3 text-white hover:scale-[1.02] active:scale-95 text-center group disabled:opacity-50"
                style={{ backgroundColor: COLORS.mintGreen }}
              >
                {isGenerating ? (
                  <span className="animate-pulse">Gerando...</span>
                ) : (
                  <>
                    <svg className="w-5 h-5 group-hover:animate-bounce" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    {isSent ? 'Ver no WhatsApp' : 'Enviar para Arquiteta'}
                  </>
                )}
              </button>

              <button
                onClick={() => handleShareResult(true)}
                disabled={isGenerating}
                className="w-full py-4 px-8 rounded-full text-xs tracking-[0.2em] uppercase transition-all font-bold border border-black/10 hover:bg-black/5 text-center disabled:opacity-50 text-black/60 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Baixar PDF (Imagem + Texto)
              </button>

              <button
                onClick={onRestart}
                className="w-full py-4 text-[9px] tracking-widest uppercase hover:text-red-400 transition-all text-black/30 mt-4"
              >
                Refazer Quiz
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default ResultView;
