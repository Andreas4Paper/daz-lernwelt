import { useState, useCallback } from 'react';
import Header from '../components/Header';
import Confetti from '../components/Confetti';
import { useProfile } from '../context/ProfileContext';
import { WORDS } from '../data';
import type { WordItem } from '../types';

function shuffle<T>(a: T[]): T[] {
  const b = [...a]; for (let i = b.length-1; i>0; i--) { const j = Math.floor(Math.random()*(i+1)); [b[i],b[j]]=[b[j],b[i]]; } return b;
}

interface Round {
  target: WordItem;
  options: WordItem[];
}

function buildRound(prev?: WordItem): Round {
  const pool = shuffle(WORDS);
  const options = pool.slice(0, 4);
  // make sure target is one of the options
  const target = options[Math.floor(Math.random() * 4)];
  // avoid same target twice
  if (prev && target.id === prev.id) return buildRound(prev);
  return { target, options };
}

let synth: SpeechSynthesis | null = null;
try { synth = window.speechSynthesis; } catch (_) {}

function speak(word: string, onEnd?: () => void) {
  if (!synth) { onEnd?.(); return; }
  synth.cancel();
  const utt = new SpeechSynthesisUtterance(word);
  utt.lang = 'de-DE';
  utt.rate = 0.85;
  utt.pitch = 1.1;
  if (onEnd) utt.onend = onEnd;
  synth.speak(utt);
}

export default function Hearing() {
  const { addPoints, markGamePlayed } = useProfile();
  const [round, setRound] = useState<Round>(() => buildRound());
  const [playing, setPlaying] = useState(false);
  const [answered, setAnswered] = useState<string | null>(null); // id of chosen
  const [score, setScore] = useState(0);
  const [count, setCount] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [done, setDone] = useState(false);

  const MAX_ROUNDS = 10;

  function onSpeak() {
    if (playing) return;
    setPlaying(true);
    speak(round.target.word, () => setPlaying(false));
  }

  const nextRound = useCallback(() => {
    const next = count + 1;
    if (next >= MAX_ROUNDS) {
      setDone(true);
      markGamePlayed('hearing');
      addPoints(50);
    } else {
      setCount(next);
      setRound(buildRound(round.target));
      setAnswered(null);
      setConfetti(false);
      setPlaying(false);
    }
  }, [count, round.target, addPoints, markGamePlayed]);

  function onOptionClick(id: string) {
    if (answered) return;
    setAnswered(id);
    if (id === round.target.id) {
      addPoints(10);
      setScore(s => s + 10);
      setConfetti(true);
    }
    setTimeout(nextRound, 1600);
  }

  function classFor(id: string) {
    if (!answered) return 'hear-opt';
    if (id === round.target.id) return 'hear-opt correct';
    if (id === answered) return 'hear-opt wrong';
    return 'hear-opt answered';
  }

  if (done) return (
    <div className="game-page">
      <Confetti active duration={4000} />
      <Header title="Hörspiel" emoji="👂" color="#16a34a" />
      <main className="game-main">
        <div className="result-overlay anim-bounce">
          <span className="result-overlay__trophy">👂</span>
          <div className="result-overlay__title">Gut gehört!</div>
          <div className="result-overlay__sub">{MAX_ROUNDS} Wörter gehört</div>
          <div className="result-overlay__score">+{score + 50} Punkte</div>
          <div className="result-overlay__actions">
            <button className="btn btn--green" onClick={() => { setRound(buildRound()); setAnswered(null); setCount(0); setScore(0); setDone(false); setConfetti(false); }}>
              🔄 Nochmal
            </button>
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <div className="game-page hearing-page">
      <Confetti active={confetti} duration={1200} />
      <Header title="Hörspiel" emoji="👂" color="#16a34a" />

      <main className="game-main">
        <div style={{ textAlign: 'center', marginBottom: 10, color: 'var(--text-muted)', fontWeight: 700 }}>
          Runde {count + 1} von {MAX_ROUNDS}
        </div>
        <div style={{ marginBottom: 24 }}>
          <div className="progress-wrap">
            <div className="progress-fill" style={{ width: `${(count / MAX_ROUNDS) * 100}%` }} />
          </div>
        </div>

        <div className="hearing-center">
          <button className={`speak-btn${playing ? ' playing' : ''}`} onClick={onSpeak} aria-label="Wort sprechen">
            {playing ? '🔊' : '▶️'}
          </button>
          <div className="hearing-hint">
            {!answered
              ? (playing ? 'Hör gut zu! 👂' : 'Tippe zum Abspielen!')
              : answered === round.target.id
                ? '✅ Richtig! Sehr gut!'
                : `❌ Es war: ${round.target.word}`}
          </div>
        </div>

        <div className="hearing-options">
          {round.options.map(opt => (
            <button
              key={opt.id}
              className={classFor(opt.id)}
              onClick={() => onOptionClick(opt.id)}
              disabled={!!answered}
              aria-label={opt.word}
            >
              <span>{opt.emoji}</span>
              {answered && <span style={{ fontSize: '.75rem', fontWeight: 800 }}>{opt.word}</span>}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
