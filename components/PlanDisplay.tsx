
import React, { useState } from 'react';
import { ParetoResult } from '@/types';

interface Props {
  data: ParetoResult;
  onReset: () => void;
}

type TabType = 'vision' | 'training' | 'nutrition';

const TrainingDayAccordion: React.FC<{ day: any; index: number }> = ({ day, index }) => {
  const [isOpen, setIsOpen] = useState(index === 0);

  return (
    <div className="glass rounded-[2rem] border-white/5 overflow-hidden transition-all mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-8 flex justify-between items-center text-left hover:bg-white/5 transition-colors no-print"
      >
        <div>
          <h3 className="text-xl font-bold mb-1 text-white">{day.day}</h3>
          <p className="text-[10px] text-indigo-400 font-mono-geist uppercase tracking-widest">{day.focus}</p>
        </div>
        <div className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-transform text-white ${isOpen ? 'rotate-180' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
          </svg>
        </div>
      </button>

      <div className={`${isOpen ? 'block' : 'hidden'} p-8 pt-0`}>
        <div className="space-y-4">
          {day.exercises.map((ex: any, eIdx: number) => (
            <div key={eIdx} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
              <div className="flex-1">
                <p className="font-bold text-white mb-1">{ex.name}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <p className="text-[9px] font-mono-geist text-zinc-500 uppercase">{ex.rest} repos</p>
                  <p className="text-[9px] font-mono-geist text-indigo-400 uppercase font-bold tracking-wider">Intensité: 1-2 reps de l'échec</p>
                </div>
              </div>
              <div className="text-right min-w-[80px]">
                <p className="text-sm font-bold text-white">{ex.sets} séries</p>
                <p className="text-xs font-bold text-indigo-400">{ex.reps} reps</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PlanDisplay: React.FC<Props> = ({ data, onReset }) => {
  const [activeTab, setActiveTab] = useState<TabType>('vision');

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      {/* TABS NAV - Sticky at top-0 to be always accessible */}
      <div className="sticky top-0 z-[60] px-6 py-4 bg-[#030303]/95 backdrop-blur-2xl border-b border-white/5 flex justify-center gap-2 no-print shadow-2xl">
        <button 
          onClick={() => setActiveTab('vision')}
          className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'vision' ? 'bg-white text-black shadow-xl scale-105' : 'text-zinc-500 hover:text-white'}`}
        >
          Analyse & Vision
        </button>
        <button 
          onClick={() => setActiveTab('training')}
          className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'training' ? 'bg-white text-black shadow-xl scale-105' : 'text-zinc-500 hover:text-white'}`}
        >
          Entraînement
        </button>
        <button 
          onClick={() => setActiveTab('nutrition')}
          className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'nutrition' ? 'bg-white text-black shadow-xl scale-105' : 'text-zinc-500 hover:text-white'}`}
        >
          Alimentation
        </button>
      </div>

      <main className="max-w-7xl mx-auto p-6 lg:p-12 pb-32">
        
        {/* VISION TAB */}
        {activeTab === 'vision' && (
          <div className="animate-fade-in space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Comparatif Vision.</h2>
              <p className="text-zinc-500 text-sm font-light">Le fossé entre aujourd'hui et votre prime génétique à 90 jours.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center">
              {/* BEFORE */}
              <div className="space-y-6 w-full max-w-[340px]">
                <div className="aspect-[9/16] rounded-[2.5rem] border border-white/5 overflow-hidden bg-zinc-900 relative">
                  <img src={data.beforeUrl} className="w-full h-full object-cover opacity-60 grayscale" alt="Avant" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute top-6 left-6 px-4 py-2 glass rounded-full">
                    <span className="text-[10px] font-black uppercase tracking-widest">État Actuel</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-mono-geist text-zinc-600 uppercase">Analyse Morphologique</p>
                  <p className="text-lg font-bold">Structure {data.morphology.boneStructure}</p>
                </div>
              </div>

              {/* AFTER VISION */}
              <div className="space-y-6 w-full max-w-[380px]">
                <div className="aspect-[9/16] rounded-[3rem] border-2 border-indigo-500/30 overflow-hidden shadow-[0_0_80px_rgba(99,102,241,0.2)] relative bg-zinc-900">
                  <img src={data.visionUrl} className="w-full h-full object-cover" alt="Après Vision" />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/40 via-transparent to-transparent"></div>
                  <div className="absolute top-6 right-6 px-4 py-2 bg-white text-black rounded-full">
                    <span className="text-[10px] font-black uppercase tracking-widest">Projection HD</span>
                  </div>
                  <div className="absolute bottom-10 left-10 right-10">
                    <h4 className="text-3xl font-black uppercase leading-none mb-2">VOTRE POTENTIEL</h4>
                    <p className="text-[9px] font-mono-geist text-indigo-400 uppercase tracking-widest font-bold">Objectif {data.morphology.estimatedFatPercent}% Fat</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-mono-geist text-indigo-500 uppercase">Score Prédictif</p>
                  <p className="text-lg font-bold">Progression Optimisée Pareto</p>
                </div>
              </div>
            </div>

            {/* Analysis Data */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="glass p-8 rounded-[2rem] border-white/10">
                 <h5 className="text-[9px] text-zinc-500 uppercase font-bold mb-4">Gras Actuel</h5>
                 <p className="text-4xl font-black text-white">{data.morphology.estimatedFatPercent}%</p>
               </div>
               <div className="glass p-8 rounded-[2rem] border-white/10 col-span-2">
                 <h5 className="text-[9px] text-zinc-500 uppercase font-bold mb-4">Déficits Prioritaires</h5>
                 <div className="flex flex-wrap gap-2">
                   {data.morphology.muscleGaps.map((gap, i) => (
                     <span key={i} className="px-4 py-2 bg-red-500/10 text-red-400 rounded-full text-[10px] font-bold uppercase">{gap}</span>
                   ))}
                 </div>
               </div>
               <div className="glass p-8 rounded-[2.5rem] border-indigo-500/20 bg-indigo-500/5 col-span-3">
                 <h5 className="text-[9px] text-indigo-400 uppercase font-bold mb-4">Note Biométrique</h5>
                 <p className="text-lg font-light leading-relaxed italic">"{data.morphology.clinicalNote}"</p>
               </div>
            </div>
          </div>
        )}

        {/* TRAINING TAB */}
        {activeTab === 'training' && (
          <div className="animate-fade-in space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
              <div>
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">Protocole 80/20.</h2>
                <p className="text-zinc-500 text-sm">3 jours d'intensité brute. 1-2 répétitions de l'échec obligatoire.</p>
              </div>
              <div className="px-6 py-3 glass rounded-xl border-white/20">
                <span className="text-[10px] font-bold uppercase tracking-widest">Cycle de {data.durationDays} Jours</span>
              </div>
            </div>

            <div className="space-y-6">
              {data.trainingPlan.map((day, idx) => (
                <TrainingDayAccordion key={idx} day={day} index={idx} />
              ))}
            </div>

            <div className="p-10 glass rounded-[3rem] border-indigo-500/10">
              <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6">Leviers de Progression</h4>
              <ul className="space-y-4">
                {data.paretoLever.map((lever, i) => (
                  <li key={i} className="flex gap-4 items-start text-zinc-300 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                    {lever}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* NUTRITION TAB */}
        {activeTab === 'nutrition' && (
          <div className="animate-fade-in space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="glass p-8 rounded-[2rem] border-white/5 flex flex-col justify-center items-center text-center">
                <span className="text-[9px] text-zinc-500 uppercase mb-2">Calories</span>
                <p className="text-3xl font-black text-white">{data.nutritionPlan.dailyMacros.calories}</p>
              </div>
              <div className="glass p-8 rounded-[2rem] border-indigo-500/10 flex flex-col justify-center items-center text-center">
                <span className="text-[9px] text-indigo-400 uppercase mb-2">Protéines</span>
                <p className="text-3xl font-black text-white">{data.nutritionPlan.dailyMacros.protein}</p>
              </div>
              <div className="glass p-8 rounded-[2rem] border-white/5 flex flex-col justify-center items-center text-center">
                <span className="text-[9px] text-zinc-500 uppercase mb-2">Glucides</span>
                <p className="text-3xl font-black text-white">{data.nutritionPlan.dailyMacros.carbs}</p>
              </div>
              <div className="glass p-8 rounded-[2rem] border-white/5 flex flex-col justify-center items-center text-center">
                <span className="text-[9px] text-zinc-500 uppercase mb-2">Lipides</span>
                <p className="text-3xl font-black text-white">{data.nutritionPlan.dailyMacros.fats}</p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold uppercase tracking-tight px-4 border-l-4 border-white">Menu Pareto Hebdomadaire</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.nutritionPlan.meals.map((meal, i) => (
                  <div key={i} className="glass p-10 rounded-[2.5rem] border-white/5 space-y-4 hover:bg-white/5 transition-all">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xl font-bold text-white">{meal.name}</h4>
                      <span className="text-[9px] font-mono-geist bg-indigo-500 text-white px-3 py-1 rounded-full uppercase">{meal.timing}</span>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed">{meal.description}</p>
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{meal.macros}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-10 bg-indigo-600/5 rounded-[3rem] border border-indigo-500/20">
              <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6">Conseils Nutrition Pareto</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.nutritionPlan.paretoTips.map((tip, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="text-indigo-500 font-black text-xl">#0{i+1}</div>
                    <p className="text-sm text-zinc-300 leading-relaxed font-light">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-20 flex flex-col md:flex-row gap-4 no-print border-t border-white/5 pt-12">
          <button 
            onClick={onReset}
            className="flex-1 py-5 glass text-white font-bold rounded-2xl uppercase tracking-widest text-xs hover:bg-white/10 transition-all flex items-center justify-center gap-3"
          >
            Nouvelle Analyse
          </button>
          <button 
            onClick={handlePrint}
            className="flex-1 py-5 bg-white text-black font-bold rounded-2xl uppercase tracking-widest text-xs hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-xl"
          >
            Exporter mon Dossier (PDF)
          </button>
        </div>
      </main>
    </div>
  );
};

export default PlanDisplay;
