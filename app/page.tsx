'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import PlanDisplay from '@/components/PlanDisplay';
import Landing from '@/components/Landing';
import Pricing from '@/components/Pricing';
import { Gender, Equipment, UserInput, ParetoResult } from '@/types';

type AppStep = 'landing' | 'pricing' | 'auth' | 'payment' | 'input' | 'loading' | 'result' | 'key';

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/3cI3cv8mZ0CE8wo2eabfO00";

export default function Page() {
  const [step, setStep] = useState<AppStep>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [hasPaid, setHasPaid] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Analyse biométrique...');
  const [userInput, setUserInput] = useState<UserInput>({
    photo: null,
    gender: Gender.MALE,
    age: '16 - 30',
    equipment: Equipment.FULL_GYM,
    objective: '',
    imageSize: '1K'
  });
  const [result, setResult] = useState<ParetoResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (step === 'input') {
      const checkKey = async () => {
        // @ts-ignore
        if (window.aistudio) {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          if (!hasKey) setStep('key');
        }
      };
      checkKey();
    }
  }, [step]);

  const handleKeySelection = async () => {
    try {
      // @ts-ignore
      await window.aistudio?.openSelectKey();
      setStep('input');
    } catch (e) { console.error(e); }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUserInput(prev => ({ ...prev, photo: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handlePaymentClick = () => {
    window.open(STRIPE_PAYMENT_LINK, '_blank');
    setHasPaid(true);
  };

  const handleGenerate = async () => {
    if (!userInput.photo) {
      setError("Photo requise pour l'analyse.");
      return;
    }
    if (userInput.objective.trim().length < 5) {
      setError("Détaillez votre objectif.");
      return;
    }

    setStep('loading');
    setError(null);
    setLoadingMessage("Synchronisation des serveurs de rendu...");
    
    try {
      setTimeout(() => setLoadingMessage("Identification de la structure squelettique..."), 2000);
      setTimeout(() => setLoadingMessage("Génération du plan alimentaire 80/20..."), 4000);
      setTimeout(() => setLoadingMessage("Génération du rendu HD..."), 6000);

      const [analysisRes, visionRes] = await Promise.all([
        fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userInput)
        }),
        fetch('/api/generate-vision', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userInput)
        })
      ]);

      if (!analysisRes.ok || !visionRes.ok) {
        throw new Error('API request failed');
      }

      const analysis = await analysisRes.json();
      const visionData = await visionRes.json();
      const visionUrl = visionData.image;

      setResult({ 
        ...analysis, 
        visionUrl, 
        beforeUrl: userInput.photo 
      } as ParetoResult);
      setStep('result');
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setError("Clé API invalide.");
        setStep('key');
      } else {
        setError("Échec de la génération.");
        setStep('input');
      }
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setStep('input');
  };

  if (step === 'landing') return <Landing onStart={() => setStep('pricing')} />;
  if (step === 'pricing') return <Pricing onSelect={() => setStep('auth')} />;

  if (step === 'auth') {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center p-6">
        <div className="max-w-md w-full glass p-10 rounded-[2.5rem] border-white/5 space-y-8 animate-fade-in">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white uppercase tracking-tighter mb-2">
              {authMode === 'signup' ? 'Crée ton compte' : 'Bon retour'}
            </h2>
            <p className="text-zinc-500 text-xs font-light">Pour sauvegarder ton diagnostic PARAXE.</p>
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStep('payment'); }}>
            {authMode === 'signup' && (
              <input required type="text" placeholder="Nom complet" className="w-full glass border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:border-indigo-500 outline-none transition-all" />
            )}
            <input required type="email" placeholder="Email" className="w-full glass border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:border-indigo-500 outline-none transition-all" />
            <input required type="password" placeholder="Mot de passe" className="w-full glass border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:border-indigo-500 outline-none transition-all" />
            
            <button 
              type="submit"
              className="w-full py-5 bg-white text-black font-bold rounded-2xl uppercase tracking-widest text-xs hover:scale-[1.02] transition-all mt-4"
            >
              {authMode === 'signup' ? "Continuer vers l'accès" : "Se connecter"}
            </button>
          </form>

          <div className="text-center border-t border-white/5 pt-6">
            <button 
              onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
              className="text-indigo-400 text-[10px] font-mono-geist uppercase tracking-widest hover:text-indigo-300"
            >
              {authMode === 'signup' ? "J'ai déjà un compte" : "Je veux m'inscrire"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'payment') {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center p-6">
        <div className="max-w-md w-full glass p-10 rounded-[2.5rem] border-white/10 space-y-10 animate-slide-up text-center">
          <div className="flex justify-center">
             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-black font-black text-2xl">P</div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white uppercase tracking-tighter">Accès Vision</h2>
            <p className="text-zinc-500 text-sm font-light leading-relaxed">Activez votre accès illimité au scanner PARAXE et recevez votre diagnostic complet.</p>
          </div>

          <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
            <p className="text-[10px] font-mono-geist text-zinc-500 uppercase tracking-widest mb-1">Total à régler</p>
            <div className="text-5xl font-black text-white">17,00 €</div>
          </div>

          <div className="space-y-4">
            {!hasPaid ? (
              <button 
                onClick={handlePaymentClick}
                className="w-full py-6 bg-white text-black font-black rounded-2xl uppercase tracking-[0.2em] text-xs hover:scale-105 transition-all shadow-2xl shadow-white/5"
              >
                Payer avec Stripe
              </button>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest">Paiement initié dans l'autre onglet...</p>
                <button 
                  onClick={() => setStep('input')}
                  className="w-full py-6 bg-indigo-600 text-white font-black rounded-2xl uppercase tracking-[0.2em] text-xs hover:bg-indigo-500 transition-all shadow-2xl"
                >
                  J'ai finalisé mon paiement
                </button>
                <button 
                  onClick={() => setHasPaid(false)}
                  className="text-zinc-500 text-[9px] uppercase tracking-widest hover:text-white"
                >
                  Problème de paiement ? Réessayer
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-4 text-zinc-600">
             <span className="text-[9px] font-bold uppercase tracking-widest">Paiement 100% Sécurisé via</span>
             <div className="text-sm font-bold opacity-30">stripe</div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'key') {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center p-6">
        <div className="max-w-md w-full glass p-10 rounded-3xl text-center">
          <h1 className="text-2xl font-bold mb-6 text-white">Activation Cloud</h1>
          <p className="text-sm text-zinc-400 mb-8 font-light">L'accès à la puissance de calcul IA nécessite une clé API active.</p>
          <button onClick={handleKeySelection} className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all">
            Connecter avec Google AI
          </button>
        </div>
      </div>
    );
  }

  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center p-6">
        <div className="text-center relative">
          <div className="w-24 h-24 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-10"></div>
          <h2 className="text-xs font-mono-geist text-white uppercase tracking-[0.5em] animate-pulse">
            {loadingMessage}
          </h2>
        </div>
      </div>
    );
  }

  if (step === 'result' && result) {
    return (
      <div className="bg-[#030303] min-h-screen">
        <div className="no-print">
          <div className="relative">
            <Header />
          </div>
        </div>
        <PlanDisplay data={result} onReset={handleReset} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-start">
          
          <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-10">
            <div>
              <h2 className="text-indigo-500 font-mono-geist text-[10px] uppercase tracking-[0.3em] mb-4">Configuration 80/20</h2>
              <h1 className="text-3xl font-bold tracking-tight text-white">Détails Morpho</h1>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                {Object.values(Gender).map(g => (
                  <button
                    key={g}
                    onClick={() => setUserInput(prev => ({ ...prev, gender: g }))}
                    className={`py-4 rounded-xl font-bold text-xs uppercase tracking-widest border transition-all ${userInput.gender === g ? 'bg-white text-black border-white' : 'glass border-white/5 text-zinc-500 hover:text-white'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {['16 - 30', '31 - 45', '46 - 60'].map(a => (
                  <button
                    key={a}
                    onClick={() => setUserInput(prev => ({ ...prev, age: a }))}
                    className={`py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest border transition-all ${userInput.age === a ? 'bg-white text-black border-white' : 'glass border-white/5 text-zinc-500 hover:text-white'}`}
                  >
                    {a}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-mono-geist text-zinc-500 uppercase tracking-widest">Équipement disponible</label>
                <select 
                  value={userInput.equipment}
                  onChange={(e) => setUserInput(prev => ({ ...prev, equipment: e.target.value as Equipment }))}
                  className="w-full glass border-white/10 rounded-xl px-5 py-4 text-sm font-medium focus:outline-none focus:border-indigo-500 transition-colors appearance-none text-white"
                >
                  {Object.values(Equipment).map(e => (
                    <option key={e} value={e} className="bg-zinc-900">{e}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-mono-geist text-zinc-500 uppercase tracking-widest">Vision cible</label>
                <textarea 
                  value={userInput.objective}
                  onChange={(e) => setUserInput(prev => ({ ...prev, objective: e.target.value }))}
                  placeholder="Décrivez précisément votre physique idéal..."
                  className="w-full glass border-white/10 rounded-xl px-5 py-4 text-sm min-h-[140px] focus:outline-none focus:border-indigo-500 transition-colors resize-none leading-relaxed text-white"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-[10px] font-mono-geist uppercase text-center">{error}</p>}

            <button 
              onClick={handleGenerate}
              className="w-full py-6 bg-white text-black font-extrabold rounded-2xl uppercase tracking-[0.3em] text-sm btn-primary"
            >
              Calculer ma Vision
            </button>
          </div>

          <div className="space-y-8">
            <div 
              onClick={() => document.getElementById('photo-upload')?.click()}
              className="relative w-full aspect-[3/4] glass rounded-[2.5rem] border-white/5 overflow-hidden group cursor-pointer"
            >
              {userInput.photo ? (
                <>
                  <img src={userInput.photo} alt="Source" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                  <div className="scanner-line"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="px-6 py-3 glass border-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-white">Mettre à jour</div>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-20 h-20 glass border-white/10 rounded-3xl flex items-center justify-center mb-8 group-hover:border-indigo-500/50 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" className="opacity-40 group-hover:opacity-100 transition-opacity" viewBox="0 0 16 16">
                      <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                      <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white">Source Morpho</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed font-light">Importez une photo de face corps entier (épaules aux pieds) pour un scan chirurgical.</p>
                </div>
              )}
              <input id="photo-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
