import { useState, useCallback } from 'react';
import Header from '../components/Header';
import Confetti from '../components/Confetti';
import { useProfile } from '../context/ProfileContext';
import { WORD_IMAGE_ROUNDS, getWord, artSym } from '../data';
import type { WordItem } from '../types';

function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

interface Slot { item: WordItem; matchedWith: string | null; wrong: boolean; }

function buildRound(ids: string[]): { words: Slot[]; emojis: Slot[] } {
  const items = ids.map(id => getWord(id));
  return {
    words:  items.map(i => ({ item: i, matchedWith: null, wrong: false })),
    emojis: shuffle(items).map(i => ({ item: i, matchedWith: null, wrong: false })),
  };
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

    if (selectedWord === id) {
      const ns = score + 10;
      setScore(ns);
      addPoints(10);
      setState(prev => ({
        words:  prev.words.map(s  => s.item.id === id ? { ...s,  matchedWith: id } : s),
        emojis: prev.emojis.map(s => s.item.id === id ? { ...s, matchedWith: id } : s),
      }));
      setSelectedWord(null);
      const nowMatched = state.words.filter(s => s.matchedWith || s.item.id === id).length;
      if (nowMatched === state.words.length) {
        setTimeout(() => {
          setConfetti(true);
          if (roundIdx === totalRounds - 1) { setDone(true); markGamePlayed('word-image'); addPoints(30); }
          else setTimeout(nextRound, 1200);
        }, 400);
      }
    } else {
      setState(prev => ({
        words:  prev.words.map(s  => s.item.id === selectedWord ? { ...s, wrong: true } : s),
        emojis: prev.emojis.map(s => s.item.id === id ? { ...s, wrong: true } : s),
      }));
      setSelectedWord(null);
      setTimeout(() => setState(prev => ({
        words:  prev.words.map(s  => ({ ...s, wrong: false })),
        emojis: prev.emojis.map(s => ({ ...s, wrong: false })),
      })), 700);
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
              <button className="btn btn--pink" onClick={() => {
                setRoundIdx(0); setState(buildRound(WORD_IMAGE_ROUNDS[0]));
                setSelectedWord(null); setDone(false); setConfetti(false); setScore(0);
              }}>🔄 Nochmal</button>
            </div>
          </div>
        ) : (
          <>
            {/* Legend */}
            <div className="art-legend">
              <span>✂️ = <strong>die</strong></span>
              <span>🪨 = <strong>der</strong></span>
              <span>📄 = <strong>das</strong></span>
            </div>

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
              {selectedWord ? '👆 Wähle jetzt das passende Bild!' : '👆 Klicke zuerst ein Wort!'}
            </p>

            <div className="wordimg-board">
              {/* Words with article symbols */}
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
                    <span className="wi-art-sym">{artSym(s.item.article)}</span>
                    <span className="wi-art-label">{s.item.article}</span>
                    <span>{s.matchedWith ? '✅ ' : ''}{s.item.word}</span>
                  </button>
                ))}
              </div>
              {/* Emojis */}
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
                    aria-label={s.item.word}
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
