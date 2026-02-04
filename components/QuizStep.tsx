import React from 'react';
import { Question, Option } from '../types';
import { COLORS } from '../constants';

interface QuizStepProps {
  question: Question;
  onToggle: (option: Option) => void;
  selectedOptions: Option[];
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

const QuizStep: React.FC<QuizStepProps> = ({
  question,
  onToggle,
  selectedOptions,
  onNext,
  onBack,
  currentStep,
  totalSteps
}) => {
  const isFirstStep = currentStep === 1;
  const isSetupComplete = selectedOptions.length > 0;

  return (
    <div className="animate-fade-in w-full max-w-4xl mx-auto px-4 pb-32">
      <div className="mb-8 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.2em] opacity-60">Questão {currentStep}/{totalSteps}</span>
        {question.multiselect && <span className="text-[10px] uppercase tracking-[0.1em] text-mainPink bg-mainPink/10 px-2 py-1 rounded">Múltipla Escolha</span>}
      </div>

      <div className="space-y-6 mb-12">
        <h2 className="serif text-3xl md:text-5xl text-black leading-tight">
          {question.title.split(':')[1]?.trim() || question.title}
        </h2>
        <div className="w-12 h-[1px] bg-black/10"></div>
        {question.title.includes(':') && (
          <p className="text-sm text-gray-500 font-light">{question.title.split(':')[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {question.options.map((option) => {
          const isSelected = selectedOptions.some(s => s.id === option.id);
          return (
            <button
              key={option.id}
              onClick={() => onToggle(option)}
              className={`group relative h-auto rounded-[2rem] overflow-hidden text-left transition-all duration-300 ${isSelected
                ? 'ring-4 ring-mainPink shadow-xl scale-[1.02]'
                : 'hover:shadow-lg hover:-translate-y-1'
                }`}
            >
              <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden mb-4">
                <img
                  src={option.imageUrl}
                  alt={option.label}
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${isSelected ? 'scale-110' : 'group-hover:scale-110'
                    }`}
                  style={{ objectPosition: option.imagePosition || 'center' }}
                />
              </div>

              <div className="px-2 w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm uppercase tracking-[0.2em] font-bold ${isSelected ? 'text-mainPink' : 'text-black'
                    }`}>
                    {option.label}
                  </span>
                  {isSelected && (
                    <div className="bg-mainPink text-white rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {isSelected && (
                  <p className="text-[10px] text-gray-600 leading-relaxed font-light animate-fade-in line-clamp-3">
                    {option.styleProfile}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-black/5 p-6 z-40">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            onClick={onBack}
            disabled={isFirstStep}
            className={`text-[10px] uppercase tracking-[0.2em] font-bold px-6 py-3 rounded-full transition-colors ${isFirstStep
              ? 'opacity-0 pointer-events-none'
              : 'hover:bg-black/5 opacity-60 hover:opacity-100'
              }`}
          >
            Voltar
          </button>

          <button
            onClick={onNext}
            disabled={!isSetupComplete}
            className={`px-10 py-4 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold shadow-lg transition-all transform ${isSetupComplete
              ? (currentStep === totalSteps ? 'bg-mintGreen text-white shadow-mintGreen/30' : 'bg-mainPink text-white shadow-mainPink/30 hover:opacity-90 hover:-translate-y-1')
              : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              }`}
            style={isSetupComplete && currentStep === totalSteps ? { backgroundColor: COLORS.mintGreen } : (isSetupComplete ? { backgroundColor: COLORS.mainPink } : {})}
          >
            {currentStep === totalSteps ? 'Finalizar' : 'Próximo'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizStep;
