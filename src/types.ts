export interface Profile {
  name: string;
  avatar: string;
  points: number;
  stars: number;
  achievements: string[];
  gamesPlayed: Record<string, number>;
}

export interface WordItem {
  id: string;
  word: string;
  emoji: string;
  category: string;
  article?: 'der' | 'die' | 'das';
}

export interface QuizQuestion {
  id: string;
  question: string;
  visual: string;       // emoji shown as the "image"
  options: string[];
  correct: string;
  hint?: string;
}

export type GameId =
  | 'memory'
  | 'word-image'
  | 'letters'
  | 'hearing'
  | 'categories'
  | 'quiz'
  | 'colors'
  | 'numbers'
  | 'whoami';

export interface GameMeta {
  id: GameId;
  title: string;
  desc: string;
  emoji: string;
  color: string;
  bg: string;
  path: string;
  available: boolean;
}

export type ArticleSym = { art: 'der' | 'die' | 'das'; sym: '🪨' | '✂️' | '📄' };
