import React from 'react';
import { SlideContent, ColorPalette } from '../types';

interface SlidePreviewProps {
  slide: SlideContent;
  palette: ColorPalette;
  index: number;
}

const SlidePreview: React.FC<SlidePreviewProps> = ({ slide, palette, index }) => {
  // We use placeholder images that match the vibe (desaturated, architecture, portraits)
  const getImageUrl = (seed: number) => `https://picsum.photos/seed/${seed * 123}/1200/800?grayscale`;

  const commonStyles = {
    backgroundColor: palette.background,
    color: palette.text,
  };

  const renderContent = () => {
    switch (slide.layoutType) {
      case 'title':
        return (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 relative overflow-hidden">
             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url(${getImageUrl(index)})`, backgroundSize: 'cover' }}></div>
            <h1 className="text-6xl md:text-8xl font-serif mb-6 tracking-tight z-10" style={{ color: palette.primary }}>{slide.title}</h1>
            <div className="w-24 h-[1px] mb-6 z-10" style={{ backgroundColor: palette.accent }}></div>
            <p className="text-xl font-sans font-light tracking-widest uppercase z-10" style={{ color: palette.secondary }}>{slide.subtitle}</p>
          </div>
        );

      case 'split':
        return (
          <div className="h-full flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 h-64 md:h-full relative overflow-hidden group">
              <img 
                src={getImageUrl(index)} 
                alt="Visual direction" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
            <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
              <h2 className="text-4xl font-serif mb-4" style={{ color: palette.primary }}>{slide.title}</h2>
              <h3 className="text-sm font-sans uppercase tracking-widest mb-8 opacity-60">{slide.subtitle}</h3>
              <p className="font-serif text-lg leading-relaxed opacity-80 whitespace-pre-line">{slide.body}</p>
              <div className="mt-8 pt-4 border-t border-opacity-20" style={{ borderColor: palette.text }}>
                <p className="text-xs font-sans opacity-50 uppercase tracking-wider">Visual Note:</p>
                <p className="text-xs font-sans italic opacity-70 mt-1">{slide.visualDirection}</p>
              </div>
            </div>
          </div>
        );

      case 'grid':
        return (
          <div className="h-full p-12 flex flex-col">
            <div className="mb-8 flex justify-between items-end border-b pb-4" style={{ borderColor: `${palette.accent}40` }}>
               <h2 className="text-3xl font-serif" style={{ color: palette.primary }}>{slide.title}</h2>
               <span className="font-sans text-xs uppercase tracking-widest opacity-60">{slide.subtitle}</span>
            </div>
            <div className="flex-grow grid grid-cols-2 md:grid-cols-3 gap-4">
               <div className="col-span-2 row-span-2 relative overflow-hidden">
                  <img src={getImageUrl(index + 1)} className="w-full h-full object-cover grayscale brightness-90" alt="Gallery 1" />
               </div>
               <div className="relative overflow-hidden bg-gray-900 flex items-center justify-center p-4">
                  <p className="font-serif text-center italic text-sm">{slide.body}</p>
               </div>
               <div className="relative overflow-hidden">
                   <img src={getImageUrl(index + 2)} className="w-full h-full object-cover grayscale brightness-75" alt="Gallery 2" />
               </div>
            </div>
             <p className="text-xs font-sans italic opacity-50 mt-4 text-right">{slide.visualDirection}</p>
          </div>
        );

      case 'quote':
        return (
          <div className="h-full flex items-center justify-center p-12 relative">
             <div className="absolute right-0 top-0 w-1/3 h-full opacity-5" style={{ backgroundColor: palette.accent }}></div>
             <div className="max-w-3xl text-center z-10">
                <span className="text-6xl font-serif leading-none opacity-20 block mb-4">"</span>
                <h2 className="text-3xl md:text-5xl font-serif leading-tight italic mb-8" style={{ color: palette.primary }}>
                  {slide.body || slide.title}
                </h2>
                <div className="w-12 h-[1px] mx-auto mb-4" style={{ backgroundColor: palette.accent }}></div>
                <p className="text-sm font-sans uppercase tracking-widest">{slide.subtitle}</p>
             </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div 
      className="w-full aspect-[16/9] shadow-2xl transition-all duration-500 overflow-hidden border-[1px] border-opacity-10"
      style={{ ...commonStyles, borderColor: palette.accent }}
    >
      {renderContent()}
    </div>
  );
};

export default SlidePreview;