
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
  const handleShareResult = async () => {
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

      const pdfBlob = pdf.output('blob');
      const pdfFile = new File([pdfBlob], `Estilo_RosaMenta_${userName.replace(/\s+/g, '_')}.pdf`, { type: 'application/pdf' });

      // 3. Compartilhamento Nativo (Mobile / WhatsApp Desktop App)
      // Se o navegador suportar o envio de arquivos (maioria dos celulares modernos)
      if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        await navigator.share({
          files: [pdfFile],
          title: 'Meu Estilo Rosa Menta',
          text: `✨ Olá! Fiz o quiz da Rosa Menta. Meu estilo é: *${result.profileName}*. Segue o PDF com os detalhes!`,
        });
      } else {
        // Fallback: Se não puder compartilhar o arquivo direto (ex: Chrome no PC sem app instalado)
        // Dispara o WhatsApp Web tradicional com o texto e instrução de anexo
        const phone = "5521979386051";
        const answersList = answersLabels.map((label, index) => `${index + 1}. ${label}`).join('\n');
        const text = `✨ *Resultado Quiz Rosa Menta* ✨\n\nOlá! Sou *${userName}* e meu estilo é *${result.profileName}*.\n\n📝 *Minhas Escolhas:* \n${answersList}\n\n📖 *Análise:* ${result.analysisText.replace(/\[|\]/g, '*')}`;
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');

        // Avisa o usuário para baixar e enviar
        pdf.save(`Rosa_Menta_${userName.replace(/\s+/g, '_')}.pdf`);
        alert("O PDF foi baixado. Você pode anexá-lo agora na conversa do WhatsApp que abrimos!");
      }

      onSendReport(result);
      setIsSent(true);
    } catch (err) {
      console.error("Erro no compartilhamento:", err);
      alert("Houve um erro ao gerar o resultado. Tente novamente.");
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

  const paragraphs = result.analysisText.split('\n').filter(p => p.trim() !== '');

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

            <div className="mt-12 space-y-6 no-pdf">
              <button
                onClick={handleShareResult}
                disabled={isGenerating}
                className="w-full py-5 px-8 rounded-full text-xs tracking-[0.3em] uppercase transition-all font-bold shadow-2xl flex items-center justify-center gap-4 text-white hover:scale-[1.02] active:scale-95 text-center group disabled:opacity-50"
                style={{ backgroundColor: COLORS.mintGreen }}
              >
                {isGenerating ? (
                  <span className="animate-pulse">Gerando Relatório...</span>
                ) : (
                  <>
                    <svg className="w-5 h-5 group-hover:animate-bounce" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    {isSent ? 'Enviado para Arquiteta' : 'Enviar para Arquiteta'}
                  </>
                )}
              </button>

              <div className="flex gap-4">
                <button
                  onClick={onRestart}
                  className="flex-1 border border-black/10 py-4 rounded-full text-[9px] tracking-widest uppercase hover:bg-black hover:text-white transition-all bg-white/40"
                >
                  Refazer Quiz
                </button>
              </div>
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
