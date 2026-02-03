
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import QuizStep from './components/QuizStep';
import LoadingState from './components/LoadingState';
import ResultView from './components/ResultView';
import { QUESTIONS, COLORS } from './constants';
import { Option, QuizResult } from './types';
import { generateDesignAnalysis, generateMoodBoardImage } from './services/gemini';

type AppState = 'START' | 'QUIZ' | 'LOADING' | 'RESULT' | 'DASHBOARD';

interface Lead {
  id: string;
  userName: string;
  date: string;
  answers: string[];
  result: QuizResult;
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('START');
  const [userName, setUserName] = useState('');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Option[][]>([]); // Array of arrays for multiple selection
  const [result, setResult] = useState<QuizResult | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const savedLeads = localStorage.getItem('rosa_menta_leads');
    if (savedLeads) {
      setLeads(JSON.parse(savedLeads));
    }
  }, []);

  const startQuiz = () => {
    if (!userName.trim()) {
      alert("Por favor, insira seu nome para começar.");
      return;
    }
    setState('QUIZ');
    setCurrentQuestionIdx(0);
    setAnswers(new Array(QUESTIONS.length).fill([])); // Initialize empty selections
  };

  const handleOptionToggle = (option: Option) => {
    const currentSelection = answers[currentQuestionIdx] || [];
    const isSelected = currentSelection.some(o => o.id === option.id);

    let newSelection;
    if (isSelected) {
      newSelection = currentSelection.filter(o => o.id !== option.id);
    } else {
      newSelection = [...currentSelection, option];
    }

    // Update answers state safely
    const newAnswers = [...answers];
    newAnswers[currentQuestionIdx] = newSelection;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIdx < QUESTIONS.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      processResults(answers); // Pass all answers
    }
  };

  const handleBack = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1);
    }
  };

  const processResults = async (allAnswers: Option[][]) => {
    setState('LOADING');
    try {
      // Process answers for AI (Structured per category/question)
      // Map option arrays to comma-joined strings for each category
      const structuredLabels = allAnswers.map(stepOptions =>
        stepOptions.map(o => o.label).join(', ')
      );

      const structuredKeywords = allAnswers.map(stepOptions =>
        stepOptions.map(o => o.styleProfile).join(', ')
      );

      // Extract new Visual Prompts
      const structuredVisuals = allAnswers.map(stepOptions =>
        stepOptions.map(o => o.visualPrompt || o.label).join(', ')
      );

      const [analysis, imageUrl] = await Promise.all([
        generateDesignAnalysis(structuredLabels), // Passes ["Label A, Label B", "Label C"]
        generateMoodBoardImage(structuredKeywords, structuredLabels, structuredVisuals)
      ]);

      const newResult: QuizResult = {
        profileName: analysis.profileName,
        analysisText: analysis.analysisText,
        imageUrl
      };
      setResult(newResult);
      setState('RESULT');
    } catch (error: any) {
      console.error("Error generating results:", error);
      alert(`Erro na IA: ${error.message || "Falha desconhecida"}. Verifique o console para mais detalhes.`);

      setResult({
        profileName: "Erro na Geração",
        analysisText: "Não foi possível conectar com a inteligência artificial. Por favor, verifique sua conexão ou a chave de API.",
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800'
      });
      setState('RESULT');
    }
  };

  const handleSendReport = (finalResult: QuizResult) => {
    const newLead: Lead = {
      id: Math.random().toString(36).substr(2, 9),
      userName,
      date: new Date().toLocaleString(),
      answers: answers.flat().map(a => a.label), // Flatten for single array report
      result: finalResult
    };

    const updatedLeads = [newLead, ...leads];
    setLeads(updatedLeads);
    localStorage.setItem('rosa_menta_leads', JSON.stringify(updatedLeads));
  };

  const restart = () => {
    setState('START');
    setResult(null);
    setUserName('');
    setAnswers([]);
  };

  return (
    <Layout>
      <button
        onClick={() => setState(state === 'DASHBOARD' ? 'START' : 'DASHBOARD')}
        className="fixed bottom-4 right-4 w-6 h-6 rounded-full bg-black/5 hover:bg-black/10 transition-colors z-50 text-[8px] flex items-center justify-center opacity-0 hover:opacity-100"
      >
        AD
      </button>

      {state === 'START' && (
        <div className="text-center space-y-8 animate-fade-in max-w-2xl mx-auto">
          <div className="space-y-6 max-w-2xl mx-auto px-4 mt-20">
            <div className="space-y-2 mb-12">
              <h1 className="serif text-5xl md:text-7xl font-light text-black leading-tight">
                Perfil & Identidade: <br />
                <span className="italic" style={{ color: COLORS.mainPink }}>A Base do Seu Novo&nbsp;Lar</span>
              </h1>
              <div className="w-16 h-[1px] bg-black/20 mx-auto mt-6"></div>
            </div>

            <div className="space-y-6 max-w-sm mx-auto">
              <div className="space-y-2 text-left">
                <label htmlFor="name" className="text-[10px] uppercase tracking-[0.2em] opacity-60 ml-2">Como podemos te chamar?</label>
                <input
                  id="name"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Seu Nome"
                  className="w-full px-6 py-4 bg-white/80 border border-black/5 rounded-full text-sm font-light focus:outline-none focus:ring-1 focus:ring-mainPink transition-all"
                />
              </div>

              <button
                onClick={startQuiz}
                className="group relative w-full px-12 py-5 text-white rounded-full text-[10px] tracking-[0.4em] uppercase transition-all shadow-xl font-bold hover:opacity-90 hover:-translate-y-1 active:scale-95 shadow-mainPink/20"
                style={{ backgroundColor: COLORS.mainPink }}
              >
                Começar
              </button>
            </div>
          </div>
        </div>
      )}

      {state === 'QUIZ' && (
        <QuizStep
          question={QUESTIONS[currentQuestionIdx]}
          onToggle={handleOptionToggle}
          selectedOptions={answers[currentQuestionIdx] || []}
          onNext={handleNext}
          onBack={handleBack}
          currentStep={currentQuestionIdx + 1}
          totalSteps={QUESTIONS.length}
        />
      )}

      {state === 'LOADING' && <LoadingState />}

      {state === 'RESULT' && result && (
        <ResultView
          result={result}
          userName={userName}
          answersLabels={answers.flat().map(a => a.label)}
          onRestart={restart}
          onSendReport={handleSendReport}
        />
      )}

      {state === 'DASHBOARD' && (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl space-y-8 animate-fade-in max-h-[80vh] overflow-y-auto border border-black/5">
          <div className="flex justify-between items-center border-b pb-6">
            <h2 className="serif text-3xl">Leads Rosa Menta</h2>
            <button onClick={() => setState('START')} className="text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100">Voltar</button>
          </div>
          {leads.length === 0 ? (
            <p className="text-center opacity-40 italic py-20">Aguardando novos perfis...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {leads.map((lead) => (
                <div key={lead.id} className="border border-black/5 p-6 rounded-3xl space-y-4 bg-offWhite hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center text-[8px] tracking-[0.2em] uppercase text-sageGreen font-bold">
                    <span>{lead.date}</span>
                    <span className="bg-white px-2 py-1 rounded-full shadow-sm">ID: {lead.id}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-black uppercase tracking-tight">{lead.userName}</p>
                    <p className="text-[10px] italic text-mainPink font-medium">{lead.result.profileName}</p>
                  </div>
                  <div className="flex gap-4">
                    <img src={lead.result.imageUrl} className="w-20 h-20 object-cover rounded-2xl shadow-sm" alt="Moodboard" />
                    <div className="flex-1 space-y-2">
                      <p className="text-[10px] font-bold text-black/80">Estilos Identificados:</p>
                      <div className="flex flex-wrap gap-1">
                        {lead.answers.map((a, i) => (
                          <span key={i} className="text-[8px] bg-white px-2 py-1 rounded-md border border-black/5">{a}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
      `}</style>
    </Layout>
  );
};

export default App;
