import { useState, useCallback } from 'react';
import Header from '../components/Header';
import Confetti from '../components/Confetti';
import { useProfile } from '../context/ProfileContext';
import { WORDS } from '../data';

type Difficulty = 'easy' | 'medium' | 'hard';
const DIFF_CONFIG: Record<Difficulty, { pairs: number; label: string }> = {
  easy:   { pairs: 6,  label: 'Leicht' },
  medium: { pairs: 12, label: 'Mittel' },
  hard:   { pairs: 18, label: 'Schwer' },
};

interface Card {
  uid: number;
  emoji: string;
  word: string;
  flipped: boolean;
  matched: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(pairs: number): Card[] {
  const motifs = shuffle(WORDS).slice(0, pairs);
  return shuffle([...motifs, ...motifs].map((w, uid) => ({
    uid, emoji: w.emoji, word: w.word, flipped: false, matched: false,
  })));
}

export default function Memory() {
  const { addPoints, markGamePlayed } = useProfile();
  const [diff, setDiff] = useState<Difficulty>('easy');
  const [cards, setCards] = useState<Card[]>(() => buildDeck(DIFF_CONFIG.easy.pairs));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState(0);
  const [moves, setMoves] = useState(0);
  const [busy, setBusy] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [done, setDone] = useState(false);

  const totalPairs = DIFF_CONFIG[diff].pairs;

  const restart = useCallback((d: Difficulty = diff) => {
    setCards(buildDeck(DIFF_CONFIG[d].pairs));
    setFlipped([]); setMatched(0); setMoves(0);
    setBusy(false); setConfetti(false); setDone(false);
  }, [diff]);

  function changeDiff(d: Difficulty) {
    setDiff(d);
    restart(d);
  }

  function onCardClick(idx: number) {
    if (busy || cards[idx].flipped || cards[idx].matched || flipped.length >= 2) return;

    const next = [...cards];
    next[idx] = { ...next[idx], flipped: true };
    setCards(next);
    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length < 2) return;

    // Two cards up — check
    setMoves(m => m + 1);
    setBusy(true);
    const [a, b] = newFlipped;

    if (next[a].word === next[b].word) {
      // match
      setTimeout(() => {
        setCards(c => c.map((card, i) =>
          i === a || i === b ? { ...card, matched: true } : card
        ));
        const newMatched = matched + 1;
        setMatched(newMatched);
        addPoints(15);
        setFlipped([]);
        setBusy(false);
        if (newMatched === totalPairs) {
          setDone(true);
          setConfetti(true);
          markGamePlayed('memory');
          addPoints(50); // bonus
        }
      }, 300);
    } else {
      // no match
      setTimeout(() => {
        setCards(c => c.map((card, i) =>
          i === a || i === b ? { ...card, flipped: false } : card
        ));
        setFlipped([]);
        setBusy(false);
      }, 1000);
    }
  }

  const gridClass = `memory-grid memory-grid--${diff}`;

  return (
    <div className="game-page memory-page">
      <Confetti active={confetti} duration={4000} />
      <Header title="Memory" emoji="🧠" color="#7c3aed" />

      <main className="game-main">
        {done ? (
          <div className="result-overlay anim-bounce">
            <span className="result-overlay__trophy">🏆</span>
            <div className="result-overlay__title">Super gemacht!</div>
            <div className="result-overlay__sub">Alle {totalPairs} Paare gefunden!</div>
            <div className="result-overlay__score">+{totalPairs * 15 + 50} Punkte</div>
            <div className="result-overlay__actions">
              <button className="btn btn--purple" onClick={() => restart()}>🔄 Nochmal</button>
              <button className="btn btn--ghost"  onClick={() => changeDiff('easy')}>🏠 Menü</button>
            </div>
          </div>
        ) : (
          <>
            {/* Difficulty */}
            <div className="diff-pills">
              {(Object.keys(DIFF_CONFIG) as Difficulty[]).map(d => (
                <button key={d}
                  className={`diff-pill${diff === d ? ' active' : ''}`}
                  onClick={() => changeDiff(d)}
                >
                  {DIFF_CONFIG[d].label} ({DIFF_CONFIG[d].pairs * 2})
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="memory-info">
              <div className="memory-stat">
                <div className="memory-stat__val">{matched}</div>
                <div className="memory-stat__lbl">Paare ✅</div>
              </div>
              <div className="memory-stat">
                <div className="memory-stat__val">{totalPairs - matched}</div>
                <div className="memory-stat__lbl">Übrig 🃏</div>
              </div>
              <div className="memory-stat">
                <div className="memory-stat__val">{moves}</div>
                <div className="memory-stat__lbl">Versuche 🎯</div>
              </div>
            </div>

            {/* Cards */}
            <div className={gridClass}>
              {cards.map((card, idx) => (
                <div
                  key={card.uid}
                  className={`mcard${card.flipped ? ' flipped' : ''}${card.matched ? ' matched' : ''}`}
                  onClick={() => onCardClick(idx)}
                  role="button"
                  aria-label={card.matched || card.flipped ? card.word : 'Verdeckte Karte'}
                >
                  <div className="mcard-inner">
                    <div className="mcard-face mcard-back" />
                    <div className="mcard-face mcard-front">
                      <span className="mcard-front__emoji">{card.emoji}</span>
                      <span className="mcard-front__word">{card.word}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="memory-controls" style={{ marginTop: 20 }}>
              <button className="btn btn--ghost btn--sm" onClick={() => restart()}>🔄 Neu mischen</button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
