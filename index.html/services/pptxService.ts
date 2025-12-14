import PptxGenJS from "pptxgenjs";
import { PortfolioPlan } from "../types";

export const generateAndDownloadPPTX = (plan: PortfolioPlan) => {
  const pres = new PptxGenJS();

  // Set Metadata
  pres.title = plan.title;
  pres.subject = plan.conceptDescription;
  pres.author = "L'Âme Silencieuse";

  // Helper to normalize hex codes
  const normalizeColor = (color: string) => color.replace('#', '');

  const bgHex = normalizeColor(plan.colorPalette.background);
  const titleHex = normalizeColor(plan.colorPalette.primary);
  const textHex = normalizeColor(plan.colorPalette.text);
  const accentHex = normalizeColor(plan.colorPalette.accent);

  plan.slides.forEach((slide, index) => {
    const pptSlide = pres.addSlide();
    
    // Set Background
    pptSlide.background = { color: bgHex };
    
    // Slide Number (subtle)
    pptSlide.addText(`${index + 1}`, {
      x: '95%', y: '95%', w: '5%', h: 0.3,
      fontSize: 8, color: accentHex, align: 'right'
    });

    if (slide.layoutType === 'title') {
       // --- TITLE LAYOUT ---
       pptSlide.addText(slide.title, {
          x: 0.5, y: '40%', w: '90%', h: 1.5,
          fontSize: 48, align: 'center', color: titleHex, fontFace: 'Times New Roman'
       });
       
       // Decorative Line
       pptSlide.addShape(pres.ShapeType.line, {
          x: 4.5, y: '58%', w: 1, h: 0,
          line: { color: accentHex, width: 2 }
       });

       pptSlide.addText(slide.subtitle, {
          x: 0.5, y: '62%', w: '90%', h: 0.5,
          fontSize: 16, align: 'center', color: textHex, fontFace: 'Arial', charSpacing: 4
       });

    } else if (slide.layoutType === 'split') {
        // --- SPLIT LAYOUT ---
        // Left Image Placeholder
        pptSlide.addShape(pres.ShapeType.rect, {
            x: 0, y: 0, w: '50%', h: '100%',
            fill: { color: '333333' }
        });
        pptSlide.addText("PLACE IMAGE HERE", {
            x: 0, y: '45%', w: '50%', h: 1,
            align: 'center', color: 'FFFFFF', fontSize: 14, charSpacing: 2
        });
        pptSlide.addText(slide.visualDirection, {
             x: 0.5, y: '52%', w: '40%', h: 1,
             align: 'center', color: 'AAAAAA', fontSize: 10, italic: true
        });

        // Right Content
        pptSlide.addText(slide.title, {
            x: '55%', y: 0.5, w: '40%', h: 1,
            fontSize: 32, color: titleHex, fontFace: 'Times New Roman'
        });
        pptSlide.addText(slide.subtitle, {
            x: '55%', y: 1.3, w: '40%', h: 0.4,
            fontSize: 10, color: accentHex, charSpacing: 3, fontFace: 'Arial'
        });
        pptSlide.addText(slide.body, {
            x: '55%', y: 2, w: '40%', h: 3,
            fontSize: 14, color: textHex, fontFace: 'Arial', lineSpacing: 18
        });

    } else if (slide.layoutType === 'quote') {
        // --- QUOTE LAYOUT ---
        pptSlide.addText("“", {
            x: 0.5, y: '20%', w: '90%', h: 1,
            fontSize: 80, align: 'center', color: accentHex + "40" // Adding transparency if supported or just subtle color
        });
        pptSlide.addText(slide.body || slide.title, {
            x: 1, y: '30%', w: '80%', h: 2,
            fontSize: 32, align: 'center', color: titleHex, fontFace: 'Times New Roman', italic: true
        });
        pptSlide.addShape(pres.ShapeType.line, {
            x: 4.5, y: '65%', w: 1, h: 0,
            line: { color: accentHex, width: 1 }
        });
        pptSlide.addText(slide.subtitle, {
            x: 1, y: '70%', w: '80%', h: 0.5,
            fontSize: 10, align: 'center', color: textHex, charSpacing: 3
        });

    } else if (slide.layoutType === 'grid') {
        // --- GRID LAYOUT ---
        pptSlide.addText(slide.title, {
            x: 0.5, y: 0.3, w: '90%', h: 0.5,
            fontSize: 24, color: titleHex, fontFace: 'Times New Roman'
        });
        
        // Placeholder 1 (Large Left)
        pptSlide.addShape(pres.ShapeType.rect, { x: 0.5, y: 1.2, w: 4.5, h: 4, fill: { color: '222222' } });
        pptSlide.addText("Image 1", { x: 0.5, y: 3, w: 4.5, h: 0.5, align: 'center', color: 'FFFFFF' });

        // Text Block (Top Right)
        pptSlide.addShape(pres.ShapeType.rect, { x: 5.2, y: 1.2, w: 4.3, h: 1.5, fill: { color: accentHex + "20" } });
        pptSlide.addText(slide.body, { x: 5.4, y: 1.3, w: 3.9, h: 1.3, color: textHex, fontSize: 11 });

        // Placeholder 2 (Bottom Right)
        pptSlide.addShape(pres.ShapeType.rect, { x: 5.2, y: 2.9, w: 4.3, h: 2.3, fill: { color: '333333' } });
        pptSlide.addText("Image 2", { x: 5.2, y: 4, w: 4.3, h: 0.5, align: 'center', color: 'FFFFFF' });
    }
    
    // Visual Notes at bottom
    if (slide.layoutType !== 'split') {
        pptSlide.addText(`Visual Direction: ${slide.visualDirection}`, {
            x: 0.5, y: '90%', w: '90%', h: 0.4,
            fontSize: 9, color: '666666', italic: true, align: 'center'
        });
    }
  });

  pres.writeFile({ fileName: `${plan.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_portfolio_template.pptx` });
};
