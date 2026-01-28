
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="border-b border-white/5 bg-[#030303]/80 backdrop-blur-xl sticky top-0 z-50 px-6 py-5 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="w-1.5 h-6 bg-white rounded-full"></div>
        <h1 className="text-lg font-bold tracking-tight uppercase">
          PARAXE
        </h1>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
           <span className="text-[9px] font-mono-geist text-zinc-500 uppercase tracking-[0.2em]">Bio-Metric Analysis v4.0.1</span>
        </div>
        <div className="px-3 py-1.5 glass rounded-lg text-[9px] font-bold uppercase tracking-widest text-white/60">
          PRO VISION
        </div>
      </div>
    </header>
  );
};

export default Header;
