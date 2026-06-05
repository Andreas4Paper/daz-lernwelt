import { useState, useCallback } from 'react';
import Header from '../components/Header';
import Confetti from '../components/Confetti';
import { useProfile } from '../context/ProfileContext';
import { WORD_IMAGE_ROUNDS, getWord } from '../data';
import type { WordItem } from '../types';

function shuffle<T>(a: T[]): T[] {
  const b = [...a]; for (let i = b.length-1; i>0; i--) { const j = Math.floor(Math.random()*(i+1)); [b[i],b[j]]=[b[j],b[i]]; } return b;
}

interface Slot { item: WordItem; matchedWith: string | null; wrong: boolean; }

function buildRound(ids: string[]): { words: Slot[]; emojis: Slot[] } {
  const items = ids.map(id => getWord(id));
  const words  = items.map(i => ({ item: i, matchedWith: null, wrong: false }));
  const emojis = shuffle(items).map(i => ({ item: i, matchedWith: null, wrong: false }));
  return { words, emojis };
}

export default function WordImage() {
  const { addPoints, markGamePlayed } = useProfile();
  const [roundIdx, setRoundIdx] = useState(0);
  const [state, setState] = useState(() => buildRound(WORD_IMAGE_ROUNDS[0]));
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [confetti, setConfetti] = useState(false);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);

  const totalRounds = WORD_IMAGE_ROUNDS.length;

  const nextRound = useCallback(() => {
    const next = (roundIdx + 1) % totalRounds;
    setRoundIdx(next);
    setState(buildRound(WORD_IMAGE_ROUNDS[next]));
    setSelectedWord(null);
  }, [roundIdx, totalRounds]);

  function onWordClick(id: string) {
    const slot = state.words.find(s => s.item.id === id);
    if (!slot || slot.matchedWith) return;
    setSelectedWord(prev => prev === id ? null : id);
  }

  function onEmojiClick(id: string) {
    if (!selectedWord) return;
    const emojiSlot = state.emojis.find(s => s.item.id === id);
    if (!emojiSlot || emojiSlot.matchedWith) return;

    const isMatch = selectedWord === id;

    if (isMatch) {
      const newScore = score + 10;
      setScore(newScore);
      addPoints(10);
      setState(prev => ({
        words:  prev.words.map(s  => s.item.id === id ? { ...s,  matchedWith: id } : s),
        emojis: prev.emojis.map(s => s.item.id === id ? { ...s, matchedWith: id } : s),
      }));
      setSelectedWord(null);

      // check if round complete
      const newMatched = state.words.filter(s => s.matchedWith || s.item.id === id).length;
      if (newMatched === state.words.length) {
        setTimeout(() => {
          setConfetti(true);
          const isLast = roundIdx === totalRounds - 1;
          if (isLast) { setDone(true); markGamePlayed('word-image'); addPoints(30); }
          else setTimeout(nextRound, 1200);
        }, 400);
      }
    } else {
      // wrong — flash both red briefly
      setState(prev => ({
        words:  prev.words.map(s  => s.item.id === selectedWord ? { ...s, wrong: true } : s),
        emojis: prev.emojis.map(s => s.item.id === id ? { ...s, wrong: true } : s),
      }));
      setSelectedWord(null);
      setTimeout(() => {
        setState(prev => ({
          words:  prev.words.map(s  => ({ ...s, wrong: false })),
          emojis: prev.emojis.map(s => ({ ...s, wrong: false })),
        }));
      }, 700);
    }
  }

  return (
    <div className="game-page wordimg-page">
      <Confetti active={confetti} duration={2000} />
      <Header title="Wort & Bild" emoji="🔗" color="#db2777" />

      <main className="game-main">
        {done ? (
          <div className="result-overlay anim-bounce">
            <span className="result-overlay__trophy">🌟</span>
            <div className="result-overlay__title">Fantastisch!</div>
            <div className="result-overlay__sub">Alle Runden geschafft!</div>
            <div className="result-overlay__score">+{score + 30} Punkte</div>
            <div className="result-overlay__actions">
              <button className="btn btn--pink" onClick={() => { setRoundIdx(0); setState(buildRound(WORD_IMAGE_ROUNDS[0])); setSelectedWord(null); setDone(false); setConfetti(false); setScore(0); }}>
                🔄 Nochmal
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="round-info">
              <h2>Verbinde Wort und Bild!</h2>
              <p style={{ color: 'var(--text-muted)', fontWeight: 700 }}>
                Runde {roundIdx + 1} von {totalRounds}
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div className="progress-wrap">
                <div className="progress-fill" style={{ width: `${(roundIdx / totalRounds) * 100}%` }} />
              </div>
            </div>

            <p style={{ textAlign: 'center', marginBottom: 16, color: 'var(--text-muted)', fontWeight: 600 }}>
              {selectedWord
                ? '👆 Wähle jetzt das passende Bild!'
                : '👆 Klicke zuerst ein Wort!'}
            </p>

            <div className="wordimg-board">
              <div className="wordimg-col">
                {state.words.map(s => (
                  <button
                    key={s.item.id}
                    className={[
                      'wi-word',
                      s.matchedWith ? 'wi--matched' : '',
                      selectedWord === s.item.id ? 'wi--selected' : '',
                      s.wrong ? 'wi--wrong' : '',
                    ].join(' ')}
                    onClick={() => onWordClick(s.item.id)}
                    disabled={!!s.matchedWith}
                  >
                    {s.matchedWith && '✅ '}{s.item.word}
                  </button>
                ))}
              </div>
              <div className="wordimg-col">
                {state.emojis.map(s => (
                  <button
                    key={s.item.id}
                    className={[
                      'wi-emoji',
                      s.matchedWith ? 'wi--matched' : '',
                      s.wrong ? 'wi--wrong' : '',
                    ].join(' ')}
                    onClick={() => onEmojiClick(s.item.id)}
                    disabled={!!s.matchedWith}
                    aria-label={s.matchedWith ? s.item.word : 'Bild'}
                  >
                    {s.item.emoji}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
