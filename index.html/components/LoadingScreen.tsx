import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-ysl-black z-50 flex flex-col items-center justify-center text-paper-white">
      <div className="relative">
        <div className="w-16 h-16 border-[1px] border-ysl-gold/30 rounded-full animate-ping absolute top-0 left-0"></div>
        <div className="w-16 h-16 border-[1px] border-ysl-gold/60 rounded-full animate-pulse"></div>
      </div>
      <h2 className="mt-8 font-serif text-2xl tracking-widest text-ysl-gold animate-pulse">L'ÂME SILENCIEUSE</h2>
      <p className="mt-2 font-sans text-xs tracking-[0.2em] text-gray-500 uppercase">Curating your aesthetic...</p>
    </div>
  );
};

export default LoadingScreen;