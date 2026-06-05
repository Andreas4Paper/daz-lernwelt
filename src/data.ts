import type { WordItem, QuizQuestion, GameMeta } from './types';

/* ── Article → symbol helper ────────────────────────── */
export function artSym(art: 'der' | 'die' | 'das' | undefined): string {
  if (!art) return '';
  return art === 'der' ? '🪨' : art === 'die' ? '✂️' : '📄';
}

/* ── Full vocabulary (with articles) ───────────────── */
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

/* ── Fruit & vegetable motifs for Memory ────────────
   sym: ✂️ = die (Schere), 🪨 = der (Stein), 📄 = das (Papier) */
export const FRUIT_MOTIFS: WordItem[] = [
  { id: 'fr_banane',    word: 'Banane',    emoji: '🍌', category: 'obst',    article: 'die' },
  { id: 'fr_apfel',     word: 'Apfel',     emoji: '🍎', category: 'obst',    article: 'der' },
  { id: 'fr_erdbeere',  word: 'Erdbeere',  emoji: '🍓', category: 'obst',    article: 'die' },
  { id: 'fr_kirsche',   word: 'Kirsche',   emoji: '🍒', category: 'obst',    article: 'die' },
  { id: 'fr_orange',    word: 'Orange',    emoji: '🍊', category: 'obst',    article: 'die' },
  { id: 'fr_zitrone',   word: 'Zitrone',   emoji: '🍋', category: 'obst',    article: 'die' },
  { id: 'fr_birne',     word: 'Birne',     emoji: '🍐', category: 'obst',    article: 'die' },
  { id: 'fr_ananas',    word: 'Ananas',    emoji: '🍍', category: 'obst',    article: 'die' },
  { id: 'fr_karotte',   word: 'Karotte',   emoji: '🥕', category: 'gemuese', article: 'die' },
  { id: 'fr_tomate',    word: 'Tomate',    emoji: '🍅', category: 'gemuese', article: 'die' },
  { id: 'fr_brokkoli',  word: 'Brokkoli',  emoji: '🥦', category: 'gemuese', article: 'der' },
  { id: 'fr_gurke',     word: 'Gurke',     emoji: '🥒', category: 'gemuese', article: 'die' },
  { id: 'fr_mais',      word: 'Mais',      emoji: '🌽', category: 'gemuese', article: 'der' },
  { id: 'fr_aubergine', word: 'Aubergine', emoji: '🍆', category: 'gemuese', article: 'die' },
  { id: 'fr_mango',     word: 'Mango',     emoji: '🥭', category: 'obst',    article: 'die' },
  { id: 'fr_kiwi',      word: 'Kiwi',      emoji: '🥝', category: 'obst',    article: 'die' },
  { id: 'fr_traube',    word: 'Traube',    emoji: '🍇', category: 'obst',    article: 'die' },
  { id: 'fr_pfirsich',  word: 'Pfirsich',  emoji: '🍑', category: 'obst',    article: 'der' },
];

/* ── Category sets for the Drag-Assign game ──────── */
export const CATEGORY_SETS = [
  { label: 'Tiere',    emoji: '🐾', color: '#7c3aed', items: ['hund', 'katze', 'vogel'] },
  { label: 'Essen',    emoji: '🍽️', color: '#db2777', items: ['apfel', 'banane', 'brot'] },
  { label: 'Schule',   emoji: '🏫', color: '#2563eb', items: ['buch', 'stift', 'ranzen'] },
  { label: 'Kleidung', emoji: '👕', color: '#16a34a', items: ['jacke', 'hose', 'schuh'] },
];

/* ── Quiz questions (includes article questions) ─── */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Bild-Fragen
  { id: 'q1',  question: 'Was ist das?',                 visual: '🐕',         options: ['Katze','Hund','Vogel','Fisch'],           correct: 'Hund' },
  { id: 'q2',  question: 'Was ist das?',                 visual: '🍎',         options: ['Banane','Orange','Apfel','Brot'],         correct: 'Apfel' },
  { id: 'q3',  question: 'Was ist das?',                 visual: '📚',         options: ['Stift','Schere','Buch','Ranzen'],         correct: 'Buch' },
  { id: 'q4',  question: 'Was ist das?',                 visual: '🚗',         options: ['Zug','Flugzeug','Boot','Auto'],           correct: 'Auto' },
  { id: 'q5',  question: 'Was ist das?',                 visual: '🏠',         options: ['Schule','Haus','Park','Brücke'],          correct: 'Haus' },
  // Farben-Fragen
  { id: 'q6',  question: 'Welche Farbe hat die Banane?', visual: '🍌',         options: ['Rot','Blau','Grün','Gelb'],              correct: 'Gelb' },
  { id: 'q7',  question: 'Welche Farbe hat ein Apfel?',  visual: '🍎',         options: ['Rot','Blau','Gelb','Lila'],              correct: 'Rot' },
  { id: 'q8',  question: 'Welche Farbe hat der Himmel?', visual: '☀️',         options: ['Grün','Rot','Blau','Gelb'],              correct: 'Blau' },
  // Zähl-Fragen
  { id: 'q9',  question: 'Wie viele Sterne siehst du?',  visual: '⭐⭐⭐',    options: ['1','2','3','4'],                          correct: '3' },
  { id: 'q10', question: 'Wie viele Herzen siehst du?',  visual: '❤️❤️',      options: ['1','2','3','4'],                          correct: '2' },
  { id: 'q15', question: 'Wie viele Äpfel siehst du?',   visual: '🍎🍎🍎🍎', options: ['2','3','4','5'],                          correct: '4' },
  // Artikel-Fragen (der / die / das)
  { id: 'qa1', question: 'Welcher Artikel gehört dazu?\n„___ Hund"',     visual: '🐕', options: ['der','die','das','ein'], correct: 'der' },
  { id: 'qa2', question: 'Welcher Artikel gehört dazu?\n„___ Katze"',    visual: '🐈', options: ['der','die','das','ein'], correct: 'die' },
  { id: 'qa3', question: 'Welcher Artikel gehört dazu?\n„___ Buch"',     visual: '📚', options: ['der','die','das','ein'], correct: 'das' },
  { id: 'qa4', question: 'Welcher Artikel gehört dazu?\n„___ Banane"',   visual: '🍌', options: ['der','die','das','ein'], correct: 'die' },
  { id: 'qa5', question: 'Welcher Artikel gehört dazu?\n„___ Auto"',     visual: '🚗', options: ['der','die','das','ein'], correct: 'das' },
  { id: 'qa6', question: 'Welcher Artikel gehört dazu?\n„___ Apfel"',    visual: '🍎', options: ['der','die','das','ein'], correct: 'der' },
  { id: 'qa7', question: 'Welcher Artikel gehört dazu?\n„___ Jacke"',    visual: '🧥', options: ['der','die','das','ein'], correct: 'die' },
  { id: 'qa8', question: 'Was macht ein Hund?',           visual: '🐕', options: ['Miauen','Bellen','Quaken','Zischen'],        correct: 'Bellen' },
];

/* ── Avatar options ──────────────────────────────── */
export const AVATARS = ['🦁', '🐻', '🦊', '🐼', '🐸', '🦄', '🐯', '🐺', '🐨', '🐧'];

/* ── Achievements ────────────────────────────────── */
export const ACHIEVEMENTS = [
  { id: 'first_game',    title: 'Erstes Spiel!',   icon: '🎮' },
  { id: 'memory_done',   title: 'Memory-Meister',  icon: '🧠' },
  { id: 'wordimg_done',  title: 'Wort-Profi',      icon: '📝' },
  { id: 'letters_done',  title: 'Buchstaben-Held', icon: '🔤' },
  { id: 'hearing_done',  title: 'Hör-Fuchs',       icon: '👂' },
  { id: 'cats_done',     title: 'Sortier-König',   icon: '📦' },
  { id: 'quiz_done',     title: 'Quiz-Champion',   icon: '🏆' },
  { id: 'pts_100',       title: '100 Punkte!',     icon: '💯' },
  { id: 'pts_250',       title: '250 Punkte!',     icon: '🌟' },
  { id: 'pts_500',       title: 'Superstar!',      icon: '⭐' },
];

/* ── Game metadata ───────────────────────────────── */
export const GAMES: GameMeta[] = [
  { id: 'memory',     title: 'Memory',       desc: 'Gleiche Karten finden',      emoji: '🧠', color: '#7c3aed', bg: '#ede9fe', path: '/memory',     available: true },
  { id: 'word-image', title: 'Wort & Bild',  desc: 'Wort zum Bild zuordnen',     emoji: '🔗', color: '#db2777', bg: '#fce7f3', path: '/word-image',  available: true },
  { id: 'letters',    title: 'Buchstaben',   desc: 'Wörter zusammensetzen',      emoji: '🔤', color: '#2563eb', bg: '#dbeafe', path: '/letters',     available: true },
  { id: 'hearing',    title: 'Hörspiel',     desc: 'Hören & erkennen',           emoji: '👂', color: '#16a34a', bg: '#dcfce7', path: '/hearing',     available: true },
  { id: 'categories', title: 'Kategorien',   desc: 'Bilder einsortieren',        emoji: '📦', color: '#ea580c', bg: '#ffedd5', path: '/categories',  available: true },
  { id: 'quiz',       title: 'Quiz',         desc: 'Fragen & Artikel üben',      emoji: '❓', color: '#dc2626', bg: '#fee2e2', path: '/quiz',        available: true },
  { id: 'colors',     title: 'Farben',       desc: 'Farben kennenlernen',        emoji: '🎨', color: '#0891b2', bg: '#cffafe', path: '/colors',      available: false },
  { id: 'numbers',    title: 'Zahlen',       desc: 'Zählen und rechnen',         emoji: '🔢', color: '#7c3aed', bg: '#f3e8ff', path: '/numbers',     available: false },
  { id: 'whoami',     title: 'Wer bin ich?', desc: '2 Spieler · 2 Geräte · Früchte', emoji: '🎭', color: '#9333ea', bg: '#faf5ff', path: '/who-am-i', available: true },
];

/* ── Word-Image rounds ───────────────────────────── */
export const WORD_IMAGE_ROUNDS: string[][] = [
  ['hund', 'katze', 'vogel', 'fisch', 'pferd'],
  ['apfel', 'banane', 'brot', 'milch', 'pizza'],
  ['buch', 'stift', 'ranzen', 'ball', 'haus'],
  ['jacke', 'hose', 'schuh', 'blume', 'sonne'],
];

/* ── Letters game words ──────────────────────────── */
export const LETTER_WORDS = [
  'HUND', 'KATZE', 'APFEL', 'HAUS', 'BALL',
  'BUCH', 'VOGEL', 'AUTO', 'BROT', 'FISCH',
  'SCHUH', 'BLUME', 'SONNE', 'MILCH', 'BAUM',
];

export const getWord = (id: string): WordItem =>
  WORDS.find(w => w.id === id) ?? WORDS[0];
