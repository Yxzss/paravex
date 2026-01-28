
import React from 'react';

interface Props {
  onSelect: () => void;
}

const Pricing: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-[#030303] py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-indigo-500 font-mono-geist text-[10px] uppercase tracking-[0.5em] mb-4">Phase d'Engagement</h2>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-white uppercase">Accès illimité.</h1>
        </div>

        <div className="glass p-12 md:p-16 rounded-[4rem] border-white/10 hover:border-indigo-500/30 transition-all group relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 bg-indigo-600 text-white px-10 py-4 rounded-bl-[2rem] font-bold text-[10px] uppercase tracking-widest animate-pulse">
            Offre de Lancement
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
            <div className="flex-1">
              <h3 className="text-3xl font-bold mb-4 text-white uppercase tracking-tight">Vision PARAXE</h3>
              <p className="text-zinc-500 font-light mb-8 max-w-sm">Tout ce dont tu as besoin pour identifier tes 20% d'efforts vitaux et transformer ton physique en 90 jours.</p>
              
              <div className="space-y-4">
                {[
                  "Scanner Morphologique IA v4.0.1",
                  "Plan d'Entraînement Pareto (3j/semaine)",
                  "Rendu Prédictif Peak Potential HD",
                  "Identification des Points Faibles Squelettiques",
                  "Analyse des Insertions Musculaires",
                  "Accès Prioritaire au Cloud PARAXE"
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-zinc-300 font-light">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div> {f}
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full md:w-auto text-center md:text-right flex flex-col items-center md:items-end">
              <div className="text-8xl font-black text-white tracking-tighter mb-2">17€</div>
              <p className="text-[10px] font-mono-geist text-indigo-400 uppercase tracking-widest mb-8 italic">Paiement unique • Accès à vie</p>
              
              <button 
                onClick={onSelect}
                className="w-full md:w-64 py-6 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-all shadow-2xl shadow-white/5"
              >
                Commencer le Scan
              </button>
            </div>
          </div>
        </div>
        
        <p className="text-center mt-12 text-zinc-600 text-[9px] font-mono-geist uppercase tracking-[0.4em]">Propulsé par le Moteur de Rendu PARAXE AI</p>
      </div>
    </div>
  );
};

export default Pricing;
