
import React, { useRef } from 'react';

interface Props {
  onStart: () => void;
}

const TestimonialCard = ({ name, text }: { name: string, text: string }) => (
  <div className="min-w-full snap-center px-4">
    <div className="max-w-2xl mx-auto p-10 glass rounded-[3rem] border-white/5 flex flex-col gap-8 h-full hover:border-indigo-500/20 transition-all duration-500">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-full overflow-hidden relative border border-white/10">
          <img 
            src={`https://i.pravatar.cc/150?u=${name}`} 
            className="w-full h-full object-cover blur-md scale-125" 
            alt="Profil" 
          />
          <div className="absolute inset-0 bg-indigo-500/20"></div>
        </div>
        <div>
          <h4 className="font-bold text-white text-base tracking-tight">{name}</h4>
          <div className="flex gap-1 mt-1">
            {[1, 2, 3, 4, 5].map(i => (
              <svg key={i} className="w-3 h-3 fill-indigo-500" viewBox="0 0 16 16">
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
              </svg>
            ))}
          </div>
        </div>
      </div>
      <p className="text-zinc-400 text-lg md:text-xl italic font-light leading-relaxed">"{text}"</p>
    </div>
  </div>
);

const Landing: React.FC<Props> = ({ onStart }) => {
  console.log('[v0] Landing component mounted, onStart callback:', typeof onStart);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-indigo-500 selection:text-white font-['Plus_Jakarta_Sans']">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[150px] rounded-full"></div>
      </div>

      {/* Header */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
            <div className="w-0.5 h-3 bg-black rounded-full"></div>
          </div>
          <span className="font-bold tracking-tighter text-xl uppercase">PARAXE</span>
        </div>
        <div className="flex items-center gap-8">
          <button 
            onClick={() => {
              console.log('[v0] Nav button clicked');
              onStart();
            }} 
            className="px-6 py-2 glass rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
          >
            Accès Scanner
          </button>
        </div>
      </nav>

      {/* SECTION 1: LE LEAD (VISUALISE TON PRIME) */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-8 border-white/5 animate-fade-in">
          <span className="text-[10px] font-mono-geist text-indigo-400 uppercase tracking-[0.3em]">Scanner Morphologique v4.0.1</span>
        </div>
        
        <h1 className="text-6xl md:text-[11rem] font-black tracking-tighter leading-[0.8] mb-12 uppercase">
          VISUALISE<br/>
          <span className="text-gradient">TON PRIME.</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-zinc-400 text-lg md:text-2xl mb-12 font-light leading-relaxed">
          Arrête de t'entraîner dans le noir. Identifie les <span className="text-white font-medium">20% d'efforts</span> qui vont sculpter 80% de ton esthétique en fonction de <span className="text-white font-medium">ton squelette unique</span>.
        </p>

        <div className="flex flex-col items-center gap-8">
          <button 
            onClick={() => {
              console.log('[v0] Landing button clicked - calling onStart');
              onStart();
            }}
            className="group relative px-16 py-8 bg-white text-black font-black text-xl rounded-2xl hover:scale-105 transition-all shadow-2xl shadow-indigo-500/10"
          >
            DÉCOUVRE TON POTENTIEL
            <div className="absolute -inset-1 bg-indigo-500/20 blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(i => (
                <svg key={i} className="w-3 h-3 fill-indigo-500" viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
              ))}
            </div>
            <p className="text-[10px] font-mono-geist text-zinc-600 uppercase tracking-widest italic">Basé sur 50+ diagnostics générés</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SWIPE SECTION */}
      <section className="relative z-10 py-32 overflow-hidden border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 mb-16 flex flex-col md:flex-row justify-between items-center md:items-end gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-xs font-mono-geist text-indigo-500 uppercase tracking-[0.4em] mb-4">Paroles d'Athlètes</h2>
            <h3 className="text-4xl font-black uppercase tracking-tight">Ils ont déjà atteint leur prime.</h3>
          </div>
          <div className="flex gap-4">
            <button onClick={() => scroll('left')} className="p-4 glass rounded-full hover:bg-white hover:text-black transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/></svg>
            </button>
            <button onClick={() => scroll('right')} className="p-4 glass rounded-full hover:bg-white hover:text-black transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg>
            </button>
          </div>
        </div>
        
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto pb-12 no-scrollbar snap-x snap-mandatory cursor-grab active:cursor-grabbing max-w-5xl mx-auto"
        >
          <TestimonialCard 
            name="Marc-Antoine D." 
            text="J'ai enfin compris pourquoi mes épaules ne poussaient pas. Le scan a révélé mes points faibles structurels en 10 secondes." 
          />
          <TestimonialCard 
            name="Julien R." 
            text="L'image prédictive a été le choc dont j'avais besoin. Voir mon potentiel à 10% BF m'a donné une discipline d'acier." 
          />
          <TestimonialCard 
            name="Thomas V." 
            text="Fini de perdre du temps avec les programmes clones des influenceurs. Le plan 3 jours est violent mais les résultats sont là." 
          />
          <TestimonialCard 
            name="Lucas M." 
            text="Le diagnostic sur mon squelette était bluffant de précision. J'ai rééquilibré mon physique en 3 mois." 
          />
          <TestimonialCard 
            name="Kevin P." 
            text="C'est de la triche légale. Savoir exactement quel levier tirer pour changer son look... indispensable." 
          />
        </div>
      </section>

      {/* SECTION 2: LE CORPS (9:16 SCAN IMAGE INTEGRATED) */}
      <section className="relative z-10 bg-white/[0.02] px-6 py-32 border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                Tu mérites un corps qui reflète <span className="text-indigo-500">ta discipline</span>.
              </h2>
              <p className="text-zinc-400 text-lg font-light leading-relaxed">
                Si tu stagnes malgré tes efforts, ce n'est pas ta faute. C'est celle des programmes "copier-coller" conçus par des influenceurs qui ignorent que tes insertions et ton ratio buste/jambes dictent tes résultats.
              </p>
            </div>

            <div className="p-8 glass rounded-[2rem] border-red-500/10 bg-red-500/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50"></div>
              <h3 className="text-red-400 font-bold mb-3 uppercase text-xs tracking-widest font-mono-geist">L'ennemi : Le Système Générique</h3>
              <p className="text-sm text-zinc-300 leading-relaxed font-light">
                L'industrie du fitness veut que tu restes dans le flou pour te vendre des abonnements inutiles. PARAXE brise le système en utilisant la science de la prédictibilité pour te donner un plan d'attaque chirurgical.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-zinc-400 font-light leading-relaxed">
                Tu as toujours senti qu'il te manquait "un truc" pour passer au niveau supérieur. C'est ce scan. 
                En 14 secondes, nous confirmons tes doutes sur tes points faibles et nous les transformons en leviers de croissance.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 bg-indigo-500/10 blur-[100px] rounded-full"></div>
            <div className="relative aspect-[9/16] max-w-[400px] mx-auto glass rounded-[3rem] border-white/10 overflow-hidden shadow-2xl group">
              <img 
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000" 
                className="w-full h-full object-cover blur-2xl opacity-40 grayscale scale-110 group-hover:scale-125 transition-transform duration-[10s]" 
                alt="AI Rendering" 
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-black/40">
                <div className="mb-6 flex gap-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>
                  ))}
                </div>
                <h4 className="text-xl font-black uppercase tracking-widest mb-4">Moteur de Rendu Prédictif</h4>
                <p className="text-zinc-500 max-w-xs font-mono-geist text-[9px] uppercase tracking-[0.4em] leading-loose">Optimisation des fibres musculaires en cours...</p>
                <div className="scanner-line !animate-[scan_4s_linear_infinite]"></div>
              </div>
              <div className="absolute bottom-10 left-10 right-10">
                <p className="text-[10px] font-mono-geist text-indigo-400 uppercase tracking-widest mb-2">Morpho-Analysis Active</p>
                <p className="text-xl font-bold uppercase tracking-tighter">Elite Athlete Protocol</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: TRANSFORMATION & SURVIVAL */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-40">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-7xl font-black mb-6 uppercase tracking-tighter">Ta survie <span className="text-indigo-500">esthétique</span>.</h2>
          <p className="text-zinc-500 max-w-2xl mx-auto text-lg">Rester dans la moyenne ou devenir l'exception. Sans vision claire, tu restes vulnérable à la médiocrité physique.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              title: "Vérité Squelettique",
              desc: "On analyse tes clavicules, tes hanches et tes insertions. La base brute de ton physique.",
              icon: "01"
            },
            {
              title: "Projection Prime",
              desc: "Une image 4K de toi à ton pic physique. Pour que ton cerveau sache exactement quoi viser.",
              icon: "02"
            },
            {
              title: "Loi du Levier",
              desc: "On élimine 80% du bruit. On garde les 20% de mouvements qui te feront changer d'étage.",
              icon: "03"
            }
          ].map((item, i) => (
            <div key={i} className="group p-12 glass rounded-[3rem] border-white/5 hover:border-indigo-500/20 transition-all relative">
              <span className="text-6xl font-black text-white/5 absolute top-10 right-10 group-hover:text-indigo-500/10 transition-colors font-mono-geist">{item.icon}</span>
              <h3 className="text-2xl font-bold mb-6 text-white uppercase tracking-tight">{item.title}</h3>
              <p className="text-zinc-500 leading-relaxed font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-40 text-center">
        <div className="glass p-16 md:p-32 rounded-[4rem] border-white/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-indigo-600/[0.02] group-hover:bg-indigo-600/[0.05] transition-colors pointer-events-none"></div>
          <h2 className="text-5xl md:text-8xl font-black mb-10 leading-[0.8] uppercase tracking-tighter relative z-10 pointer-events-none">
            Récupère <br/>
            <span className="text-indigo-500">ton prime.</span>
          </h2>
          <div className="relative z-20 inline-block">
            <button 
              onClick={(e) => {
                console.log('[v0] Final CTA button clicked');
                e.preventDefault();
                onStart();
              }}
              className="px-20 py-8 bg-white text-black font-black text-xl rounded-2xl hover:scale-105 transition-all shadow-2xl"
            >
              LANCER LE SCANNER
            </button>
          </div>
        </div>
      </section>

      <footer className="relative z-10 py-20 px-6 border-t border-white/5 text-center">
        <p className="text-[9px] font-mono-geist text-zinc-700 uppercase tracking-[0.5em]">PARAXE © 2025 • SCIENCE DE LA TRANSFORMATION PRÉDICTIVE</p>
      </footer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes scan {
            0% { top: 0; }
            100% { top: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Landing;
