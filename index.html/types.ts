export interface UserProfile {
  music: string;
  art: string;
  celebrities: string;
  fashion: string;
  movies: string;
  artists: string;
  calligraphers: string;
  vibe: string;
  photographyStyle: string;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface SlideContent {
  title: string;
  subtitle: string;
  body: string;
  visualDirection: string;
  layoutType: 'title' | 'split' | 'grid' | 'quote';
}

export interface PortfolioPlan {
  title: string;
  conceptDescription: string;
  keywords: string[];
  colorPalette: ColorPalette;
  slides: SlideContent[];
  actionPlan: string[]; // Steps on how to start
}

export const INITIAL_USER_PROFILE: UserProfile = {
  music: "Rock bands, Classical music",
  art: "Appreciation of paintings & calligraphy",
  celebrities: "Tang Wei, Gong Li",
  fashion: "YSL style (Yves Saint Laurent)",
  movies: "Aftersun, Summer 1993",
  artists: "Vermeer",
  calligraphers: "Xu Wei, Ni Zan",
  vibe: "Beautiful and sorrowful things",
  photographyStyle: "Quiet, serene, humanistic concern",
};