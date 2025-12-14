import React, { useState, useEffect } from 'react';
import { UserProfile, PortfolioPlan, INITIAL_USER_PROFILE } from './types';
import { generatePortfolioPlan } from './services/geminiService';
import { generateAndDownloadPPTX } from './services/pptxService';
import { Icons } from './components/Icons';
import SlidePreview from './components/SlidePreview';
import LoadingScreen from './components/LoadingScreen';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [plan, setPlan] = useState<PortfolioPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'concept' | 'slides' | 'roadmap'>('concept');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const generatedPlan = await generatePortfolioPlan(profile);
      setPlan(generatedPlan);
      setHasStarted(true);
    } catch (err) {
      setError("Unable to generate the portfolio plan. Please check your API key or try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownload = () => {
    if (plan) {
        generateAndDownloadPPTX(plan);
    }
  };

  // Intro Screen Component
  const IntroScreen = () => (
    <div className="min-h-screen bg-ysl-black text-paper-white flex flex-col">
      <nav className="p-8 flex justify-between items-center border-b border-white/10">
        <h1 className="font-serif text-2xl tracking-widest text-ysl-gold">L'ÂME SILENCIEUSE</h1>
        <div className="hidden md:flex gap-4 text-xs tracking-widest uppercase opacity-60">
          <span>Analysis</span>
          <span>Curation</span>
          <span>Presentation</span>
        </div>
      </nav>

      <main className="flex-grow flex flex-col md:flex-row">
        {/* Left Side: The Muse (Form) */}
        <div className="w-full md:w-1/2 p-8 md:p-16 border-r border-white/5 overflow-y-auto">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-serif mb-4 leading-tight">Define Your<br/><span className="italic text-ysl-gold">Aesthetic Soul</span></h2>
            <p className="font-sans font-light text-sm opacity-70 leading-relaxed max-w-md">
              We have pre-filled this based on your description. Confirm the details to let our AI architect your visual identity.
            </p>
          </div>

          <div className="space-y-6">
            {Object.entries(profile).map(([key, value]) => (
              <div key={key} className="group">
                <label className="block text-xs font-sans uppercase tracking-widest text-gray-500 mb-2 group-hover:text-ysl-gold transition-colors">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <textarea
                  value={value}
                  onChange={(e) => setProfile(prev => ({ ...prev, [key]: e.target.value }))}
                  className="w-full bg-transparent border-b border-white/20 py-2 text-sm font-serif focus:outline-none focus:border-ysl-gold transition-all resize-none h-12"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            className="mt-12 group flex items-center gap-4 bg-white/5 hover:bg-ysl-gold/10 border border-white/10 px-8 py-4 w-full justify-between transition-all"
          >
            <span className="font-serif text-lg italic group-hover:text-ysl-gold transition-colors">Generate Portfolio Strategy</span>
            <Icons.ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-ysl-gold transform group-hover:translate-x-1 transition-all" />
          </button>
          
          {error && <p className="mt-4 text-red-400 text-xs font-sans uppercase tracking-wide">{error}</p>}
        </div>

        {/* Right Side: Mood (Visuals) */}
        <div className="w-full md:w-1/2 relative hidden md:block">
          <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/rockvermeer/1600/1200?grayscale')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-ysl-black via-transparent to-ysl-black"></div>
          <div className="absolute bottom-16 left-16 max-w-sm">
            <p className="font-serif text-2xl italic mb-4">"I like beautiful and sorrowful things."</p>
            <p className="font-sans text-xs tracking-[0.2em] opacity-50 uppercase">The Intersection of Rock & Vermeer</p>
          </div>
        </div>
      </main>
    </div>
  );

  // Results Screen Component
  const ResultsScreen = () => {
    if (!plan) return null;

    return (
      <div className="min-h-screen bg-ysl-black text-paper-white flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 border-r border-white/10 flex flex-col bg-[#0f0f0f] z-20">
          <div className="p-8 border-b border-white/10">
             <h1 className="font-serif text-xl tracking-widest text-ysl-gold cursor-pointer" onClick={() => setHasStarted(false)}>L'ÂME</h1>
          </div>
          <div className="flex-grow py-8 space-y-2">
            <button 
              onClick={() => setActiveTab('concept')}
              className={`w-full text-left px-8 py-3 font-sans text-xs tracking-widest uppercase transition-all border-l-2 ${activeTab === 'concept' ? 'border-ysl-gold text-white bg-white/5' : 'border-transparent text-gray-500 hover:text-white'}`}
            >
              The Concept
            </button>
            <button 
              onClick={() => setActiveTab('slides')}
              className={`w-full text-left px-8 py-3 font-sans text-xs tracking-widest uppercase transition-all border-l-2 ${activeTab === 'slides' ? 'border-ysl-gold text-white bg-white/5' : 'border-transparent text-gray-500 hover:text-white'}`}
            >
              Visual Layouts
            </button>
            <button 
              onClick={() => setActiveTab('roadmap')}
              className={`w-full text-left px-8 py-3 font-sans text-xs tracking-widest uppercase transition-all border-l-2 ${activeTab === 'roadmap' ? 'border-ysl-gold text-white bg-white/5' : 'border-transparent text-gray-500 hover:text-white'}`}
            >
              Action Roadmap
            </button>
          </div>
          
          <div className="px-8 pb-8">
            <button 
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 bg-ysl-gold/10 hover:bg-ysl-gold/20 border border-ysl-gold/30 text-ysl-gold py-3 px-4 text-xs tracking-widest uppercase transition-all"
            >
                <Icons.Download className="w-4 h-4" />
                <span>Template</span>
            </button>
            <div className="mt-8 text-xs font-sans text-gray-600 opacity-50 text-center">
                Powered by Gemini
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow h-screen overflow-y-auto bg-ysl-black relative">
          {/* Background Ambient Effects */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-ysl-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

          {/* TAB: CONCEPT */}
          {activeTab === 'concept' && (
            <div className="p-8 md:p-20 max-w-5xl mx-auto animate-fadeIn">
              <span className="font-sans text-xs tracking-[0.3em] text-ysl-gold uppercase mb-6 block">Identity Analysis</span>
              <h2 className="text-5xl md:text-7xl font-serif mb-8 text-white">{plan.title}</h2>
              <p className="text-lg md:text-xl font-serif text-gray-300 leading-relaxed max-w-3xl mb-12 border-l border-ysl-gold/50 pl-6">
                {plan.conceptDescription}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div>
                  <h3 className="font-sans text-xs tracking-widest uppercase text-gray-500 mb-6 border-b border-gray-800 pb-2">Keywords</h3>
                  <div className="flex flex-wrap gap-3">
                    {plan.keywords.map((k, i) => (
                      <span key={i} className="px-4 py-2 border border-white/10 rounded-full text-sm font-sans hover:border-ysl-gold/50 transition-colors cursor-default">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                   <h3 className="font-sans text-xs tracking-widest uppercase text-gray-500 mb-6 border-b border-gray-800 pb-2">Color Palette</h3>
                   <div className="flex gap-4">
                      {Object.entries(plan.colorPalette).map(([key, color]) => (
                        <div key={key} className="group relative">
                          <div 
                            className="w-16 h-16 rounded-full shadow-lg border border-white/10 transition-transform transform group-hover:scale-110" 
                            style={{ backgroundColor: color }}
                          ></div>
                          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-sans uppercase opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity text-gray-400">
                            {key}
                          </span>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SLIDES */}
          {activeTab === 'slides' && (
            <div className="h-full flex flex-col animate-fadeIn">
               <div className="flex-grow flex items-center justify-center p-8 md:p-16 relative">
                 <div className="max-w-6xl w-full">
                    <SlidePreview slide={plan.slides[currentSlideIndex]} palette={plan.colorPalette} index={currentSlideIndex} />
                 </div>
                 
                 {/* Navigation Controls */}
                 <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8">
                    <button 
                      onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentSlideIndex === 0}
                      className="p-3 rounded-full border border-white/10 hover:border-ysl-gold disabled:opacity-20 transition-all"
                    >
                      <Icons.ChevronRight className="w-6 h-6 rotate-180" />
                    </button>
                    <div className="font-sans text-xs tracking-widest">
                       SLIDE {currentSlideIndex + 1} / {plan.slides.length}
                    </div>
                    <button 
                      onClick={() => setCurrentSlideIndex(prev => Math.min(plan.slides.length - 1, prev + 1))}
                      disabled={currentSlideIndex === plan.slides.length - 1}
                      className="p-3 rounded-full border border-white/10 hover:border-ysl-gold disabled:opacity-20 transition-all"
                    >
                      <Icons.ChevronRight className="w-6 h-6" />
                    </button>
                 </div>
               </div>

               {/* Slide Details Panel */}
               <div className="bg-[#0f0f0f] border-t border-white/10 p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                  <div>
                    <h4 className="text-ysl-gold text-xs uppercase tracking-widest mb-2">Structure</h4>
                    <p className="font-serif italic text-gray-400">{plan.slides[currentSlideIndex].title}</p>
                  </div>
                  <div>
                    <h4 className="text-ysl-gold text-xs uppercase tracking-widest mb-2">Content Strategy</h4>
                    <p className="text-gray-400 font-light">{plan.slides[currentSlideIndex].body}</p>
                  </div>
                  <div>
                    <h4 className="text-ysl-gold text-xs uppercase tracking-widest mb-2">Visual Direction</h4>
                    <p className="text-gray-400 font-light">{plan.slides[currentSlideIndex].visualDirection}</p>
                  </div>
               </div>
            </div>
          )}

          {/* TAB: ROADMAP */}
          {activeTab === 'roadmap' && (
            <div className="p-8 md:p-20 max-w-4xl mx-auto animate-fadeIn">
              <span className="font-sans text-xs tracking-[0.3em] text-ysl-gold uppercase mb-8 block">Execution Strategy</span>
              <h2 className="text-4xl font-serif mb-12">How to build "{plan.title}"</h2>
              
              <div className="space-y-12 relative">
                <div className="absolute left-4 top-0 bottom-0 w-[1px] bg-white/10"></div>
                
                {plan.actionPlan.map((step, idx) => (
                  <div key={idx} className="relative pl-16">
                    <div className="absolute left-0 top-0 w-9 h-9 flex items-center justify-center bg-ysl-black border border-ysl-gold rounded-full text-ysl-gold font-serif italic text-lg z-10">
                      {idx + 1}
                    </div>
                    <div className="p-8 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors rounded-sm">
                      <p className="text-gray-300 font-serif text-lg leading-relaxed">
                        {step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-20 p-8 border border-ysl-gold/30 bg-ysl-gold/5 text-center">
                <Icons.Sparkles className="w-6 h-6 text-ysl-gold mx-auto mb-4" />
                <p className="font-serif italic text-xl">
                  "Remember, your style is defined by what you refuse to include."
                </p>
                <p className="text-xs uppercase tracking-widest mt-4 opacity-50">- Inspiration from YSL & Ni Zan</p>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  };

  return (
    <>
      {loading && <LoadingScreen />}
      {!hasStarted ? <IntroScreen /> : <ResultsScreen />}
    </>
  );
};

export default App;