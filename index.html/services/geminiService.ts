import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, PortfolioPlan } from "../types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is not defined in process.env");
}

const ai = new GoogleGenAI({ apiKey: apiKey });

export const generatePortfolioPlan = async (profile: UserProfile): Promise<PortfolioPlan> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    Act as a world-class Creative Director and Curator.
    
    A photographer approaches you with the following aesthetic profile:
    - **Music:** ${profile.music}
    - **Art Interest:** ${profile.art}
    - **Fashion:** ${profile.fashion} (Think sharp tailoring, androgyny, elegance, black/gold).
    - **Movies:** ${profile.movies} (Think subtle, melancholic, naturalistic).
    - **Favorite Painters:** ${profile.artists} (Focus on light/shadow, quiet domesticity).
    - **Favorite Calligraphers:** ${profile.calligraphers} (Focus on wild expressionism vs. sparse emptiness/zen).
    - **Core Vibe:** ${profile.vibe}.
    - **Photography Style:** ${profile.photographyStyle}.

    **Task:**
    1. Synthesize these diverse influences (YSL's sharpness + Ni Zan's emptiness + Vermeer's light + Rock's rebellion) into a cohesive "Brand Identity".
    2. Create a Portfolio structure (PPT/Website) plan.
    3. Define a concrete "Action Plan" on how they should curate and start building this.

    Output must be strict JSON matching the schema provided.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "A poetic title for the portfolio concept (e.g. 'Silent Rebellion', 'Velvet & Ink')." },
          conceptDescription: { type: Type.STRING, description: "A 2-sentence sophisticated summary of the visual identity." },
          keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          colorPalette: {
            type: Type.OBJECT,
            properties: {
              primary: { type: Type.STRING, description: "Hex code" },
              secondary: { type: Type.STRING, description: "Hex code" },
              accent: { type: Type.STRING, description: "Hex code" },
              background: { type: Type.STRING, description: "Hex code" },
              text: { type: Type.STRING, description: "Hex code" }
            },
            required: ["primary", "secondary", "accent", "background", "text"]
          },
          slides: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                body: { type: Type.STRING, description: "The text content for this slide." },
                visualDirection: { type: Type.STRING, description: "Instructions for what image/layout to use." },
                layoutType: { type: Type.STRING, enum: ["title", "split", "grid", "quote"] }
              },
              required: ["title", "subtitle", "body", "visualDirection", "layoutType"]
            }
          },
          actionPlan: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "5 actionable steps to build this portfolio."
          }
        },
        required: ["title", "conceptDescription", "keywords", "colorPalette", "slides", "actionPlan"]
      }
    }
  });

  if (response.text) {
    return JSON.parse(response.text) as PortfolioPlan;
  }
  
  throw new Error("Failed to generate plan");
};
