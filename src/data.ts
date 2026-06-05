import type { WordItem, QuizQuestion, GameMeta } from './types';

/* ── Vocabulary ─────────────────────────────────────── */
export const WORDS: WordItem[] = [
  // Tiere
  { id: 'hund',     word: 'Hund',     emoji: '🐕', category: 'tiere',    article: 'der' },
  { id: 'katze',    word: 'Katze',    emoji: '🐈', category: 'tiere',    article: 'die' },
  { id: 'vogel',    word: 'Vogel',    emoji: '🐦', category: 'tiere',    article: 'der' },
  { id: 'fisch',    word: 'Fisch',    emoji: '🐟', category: 'tiere',    article: 'der' },
  { id: 'pferd',    word: 'Pferd',    emoji: '🐴', category: 'tiere',    article: 'das' },
  { id: 'loewe',    word: 'Löwe',     emoji: '🦁', category: 'tiere',    article: 'der' },
  { id: 'elefant',  word: 'Elefant',  emoji: '🐘', category: 'tiere',    article: 'der' },
  { id: 'affe',     word: 'Affe',     emoji: '🐒', category: 'tiere',    article: 'der' },
  // Essen
  { id: 'apfel',    word: 'Apfel',    emoji: '🍎', category: 'essen',    article: 'der' },
  { id: 'banane',   word: 'Banane',   emoji: '🍌', category: 'essen',    article: 'die' },
  { id: 'brot',     word: 'Brot',     emoji: '🍞', category: 'essen',    article: 'das' },
  { id: 'milch',    word: 'Milch',    emoji: '🥛', category: 'essen',    article: 'die' },
  { id: 'pizza',    word: 'Pizza',    emoji: '🍕', category: 'essen',    article: 'die' },
  { id: 'eis',      word: 'Eis',      emoji: '🍦', category: 'essen',    article: 'das' },
  { id: 'kuchen',   word: 'Kuchen',   emoji: '🍰', category: 'essen',    article: 'der' },
  { id: 'wasser',   word: 'Wasser',   emoji: '💧', category: 'essen',    article: 'das' },
  // Schule
  { id: 'buch',     word: 'Buch',     emoji: '📚', category: 'schule',   article: 'das' },
  { id: 'stift',    word: 'Stift',    emoji: '✏️', category: 'schule',   article: 'der' },
  { id: 'ranzen',   word: 'Ranzen',   emoji: '🎒', category: 'schule',   article: 'der' },
  { id: 'schere',   word: 'Schere',   emoji: '✂️', category: 'schule',   article: 'die' },
  { id: 'lineal',   word: 'Lineal',   emoji: '📏', category: 'schule',   article: 'das' },
  // Kleidung
  { id: 'jacke',    word: 'Jacke',    emoji: '🧥', category: 'kleidung', article: 'die' },
  { id: 'hose',     word: 'Hose',     emoji: '👖', category: 'kleidung', article: 'die' },
  { id: 'schuh',    word: 'Schuh',    emoji: '👟', category: 'kleidung', article: 'der' },
  { id: 'muetze',   word: 'Mütze',    emoji: '🧢', category: 'kleidung', article: 'die' },
  // Sonstiges
  { id: 'auto',     word: 'Auto',     emoji: '🚗', category: 'fahrzeuge',article: 'das' },
  { id: 'haus',     word: 'Haus',     emoji: '🏠', category: 'orte',     article: 'das' },
  { id: 'ball',     word: 'Ball',     emoji: '⚽', category: 'spielzeug',article: 'der' },
  { id: 'blume',    word: 'Blume',    emoji: '🌸', category: 'natur',    article: 'die' },
  { id: 'sonne',    word: 'Sonne',    emoji: '☀️', category: 'natur',    article: 'die' },
  { id: 'baum',     word: 'Baum',     emoji: '🌳', category: 'natur',    article: 'der' },
];

/* ── Category sets for the Drag-Assign game ──────────── */
export const CATEGORY_SETS = [
  {
    label: 'Tiere',   emoji: '🐾', color: '#7c3aed',
    items: ['hund', 'katze', 'vogel'],
  },
  {
    label: 'Essen',   emoji: '🍽️', color: '#db2777',
    items: ['apfel', 'banane', 'brot'],
  },
  {
    label: 'Schule',  emoji: '🏫', color: '#2563eb',
    items: ['buch', 'stift', 'ranzen'],
  },
  {
    label: 'Kleidung',emoji: '👕', color: '#16a34a',
    items: ['jacke', 'hose', 'schuh'],
  },
];

/* ── Quiz questions ──────────────────────────────────── */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 'q1',  question: 'Was ist das?',                visual: '🐕', options: ['Katze','Hund','Vogel','Fisch'],    correct: 'Hund' },
  { id: 'q2',  question: 'Was ist das?',                visual: '🍎', options: ['Banane','Orange','Apfel','Brot'],  correct: 'Apfel' },
  { id: 'q3',  question: 'Was ist das?',                visual: '📚', options: ['Stift','Schere','Buch','Ranzen'],  correct: 'Buch' },
  { id: 'q4',  question: 'Was ist das?',                visual: '🚗', options: ['Zug','Flugzeug','Boot','Auto'],    correct: 'Auto' },
  { id: 'q5',  question: 'Was ist das?',                visual: '🏠', options: ['Schule','Haus','Park','Brücke'],   correct: 'Haus' },
  { id: 'q6',  question: 'Welche Farbe hat die Banane?',visual: '🍌', options: ['Rot','Blau','Grün','Gelb'],        correct: 'Gelb' },
  { id: 'q7',  question: 'Welche Farbe hat ein Apfel?', visual: '🍎', options: ['Rot','Blau','Gelb','Lila'],        correct: 'Rot' },
  { id: 'q8',  question: 'Welche Farbe hat der Himmel?',visual: '☀️', options: ['Grün','Rot','Blau','Gelb'],        correct: 'Blau' },
  { id: 'q9',  question: 'Wie viele Sterne siehst du?', visual: '⭐⭐⭐', options: ['1','2','3','4'],             correct: '3' },
  { id: 'q10', question: 'Wie viele Herzen siehst du?', visual: '❤️❤️', options: ['1','2','3','4'],               correct: '2' },
  { id: 'q11', question: 'Was macht ein Hund?',         visual: '🐕', options: ['Miauen','Bellen','Quaken','Zischen'], correct: 'Bellen' },
  { id: 'q12', question: 'Wo lernt man?',               visual: '🏫', options: ['Zuhause','Im Park','In der Schule','Im Auto'], correct: 'In der Schule' },
  { id: 'q13', question: 'Was isst du morgens?',        visual: '🍳', options: ['Pizza','Frühstück','Abendessen','Mittagessen'], correct: 'Frühstück' },
  { id: 'q14', question: 'Was ist das?',                visual: '🌸', options: ['Baum','Gras','Blume','Blatt'],    correct: 'Blume' },
  { id: 'q15', question: 'Wie viele Äpfel siehst du?',  visual: '🍎🍎🍎🍎', options: ['2','3','4','5'],           correct: '4' },
];

/* ── Avatar options ──────────────────────────────────── */
export const AVATARS = ['🦁', '🐻', '🦊', '🐼', '🐸', '🦄', '🐯', '🐺', '🐨', '🐧'];

/* ── Achievements ────────────────────────────────────── */
export const ACHIEVEMENTS = [
  { id: 'first_game',    title: 'Erstes Spiel!',      icon: '🎮' },
  { id: 'memory_done',   title: 'Memory-Meister',     icon: '🧠' },
  { id: 'wordimg_done',  title: 'Wort-Profi',         icon: '📝' },
  { id: 'letters_done',  title: 'Buchstaben-Held',    icon: '🔤' },
  { id: 'hearing_done',  title: 'Hör-Fuchs',          icon: '👂' },
  { id: 'cats_done',     title: 'Sortier-König',      icon: '📦' },
  { id: 'quiz_done',     title: 'Quiz-Champion',      icon: '🏆' },
  { id: 'pts_100',       title: '100 Punkte!',        icon: '💯' },
  { id: 'pts_250',       title: '250 Punkte!',        icon: '🌟' },
  { id: 'pts_500',       title: 'Superstar!',         icon: '⭐' },
];

/* ── Game metadata for the home screen ──────────────── */
export const GAMES: GameMeta[] = [
  { id: 'memory',     title: 'Memory',          desc: 'Gleiche Karten finden',       emoji: '🧠', color: '#7c3aed', bg: '#ede9fe', path: '/memory',     available: true },
  { id: 'word-image', title: 'Wort & Bild',     desc: 'Wort zum Bild zuordnen',      emoji: '🔗', color: '#db2777', bg: '#fce7f3', path: '/word-image',  available: true },
  { id: 'letters',    title: 'Buchstaben',      desc: 'Wörter zusammensetzen',       emoji: '🔤', color: '#2563eb', bg: '#dbeafe', path: '/letters',     available: true },
  { id: 'hearing',    title: 'Hörspiel',        desc: 'Hören & erkennen',            emoji: '👂', color: '#16a34a', bg: '#dcfce7', path: '/hearing',     available: true },
  { id: 'categories', title: 'Kategorien',      desc: 'Bilder einsortieren',         emoji: '📦', color: '#ea580c', bg: '#ffedd5', path: '/categories',  available: true },
  { id: 'quiz',       title: 'Quiz',            desc: 'Fragen beantworten',          emoji: '❓', color: '#dc2626', bg: '#fee2e2', path: '/quiz',        available: true },
  { id: 'colors',     title: 'Farben',          desc: 'Farben kennenlernen',         emoji: '🎨', color: '#0891b2', bg: '#cffafe', path: '/colors',      available: false },
  { id: 'numbers',    title: 'Zahlen',          desc: 'Zählen und rechnen',          emoji: '🔢', color: '#7c3aed', bg: '#f3e8ff', path: '/numbers',     available: false },
];

/* ── Word-Image rounds (5 pairs each) ───────────────── */
export const WORD_IMAGE_ROUNDS: string[][] = [
  ['hund', 'katze', 'vogel', 'fisch', 'pferd'],
  ['apfel', 'banane', 'brot', 'milch', 'pizza'],
  ['buch', 'stift', 'ranzen', 'ball', 'haus'],
  ['jacke', 'hose', 'schuh', 'blume', 'sonne'],
];

/* ── Letters game words ──────────────────────────────── */
export const LETTER_WORDS = [
  'HUND', 'KATZE', 'APFEL', 'HAUS', 'BALL',
  'BUCH', 'VOGEL', 'AUTO', 'BROT', 'FISCH',
  'SCHUH', 'BLUME', 'SONNE', 'MILCH', 'BAUM',
];

/* helper: get WordItem by id */
export const getWord = (id: string): WordItem =>
  WORDS.find(w => w.id === id) ?? WORDS[0];
