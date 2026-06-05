import { useState, useCallback } from 'react';
import Header from '../components/Header';
import Confetti from '../components/Confetti';
import { useProfile } from '../context/ProfileContext';
import { WORDS, LETTER_WORDS } from '../data';

function shuffle<T>(a: T[]): T[] {
  const b = [...a]; for (let i = b.length-1; i>0; i--) { const j = Math.floor(Math.random()*(i+1)); [b[i],b[j]]=[b[j],b[i]]; } return b;
}

interface LetterTile { id: number; char: string; used: boolean; }

function wordToTiles(word: string): LetterTile[] {
  return shuffle(word.split('').map((char, id) => ({ id, char, used: false })));
}

function getEmoji(word: string): string {
  const w = WORDS.find(x => x.word.toUpperCase() === word.toUpperCase());
  return w?.emoji ?? '❓';
}

export default function Letters() {
  const { addPoints, markGamePlayed } = useProfile();

  const [wordList] = useState(() => shuffle([...LETTER_WORDS]));
  const [wordIdx, setWordIdx] = useState(0);
  const [tiles, setTiles] = useState<LetterTile[]>(() => wordToTiles(LETTER_WORDS[0]));
  const [typed, setTyped] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [confetti, setConfetti] = useState(false);
  const [done, setDone] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  const currentWord = wordList[wordIdx];
  const emoji = getEmoji(currentWord);

  const loadWord = useCallback((idx: number) => {
    const w = wordList[idx];
    setTiles(wordToTiles(w));
    setTyped([]);
    setStatus('idle');
    setConfetti(false);
  }, [wordList]);

  function onTileClick(tileId: number) {
    if (status !== 'idle') return;
    const tile = tiles.find(t => t.id === tileId);
    if (!tile || tile.used) return;

    const newTyped = [...typed, tile.char];
    setTiles(prev => prev.map(t => t.id === tileId ? { ...t, used: true } : t));
    setTyped(newTyped);

    if (newTyped.length === currentWord.length) {
      const attempt = newTyped.join('');
      if (attempt === currentWord) {
        setStatus('correct');
        addPoints(20);
        setTotalScore(s => s + 20);
        setConfetti(true);
        setTimeout(() => {
          const next = wordIdx + 1;
          if (next >= wordList.length) {
            setDone(true);
            markGamePlayed('letters');
            addPoints(50);
          } else {
            setWordIdx(next);
            loadWord(next);
          }
        }, 1500);
      } else {
        setStatus('wrong');
        setTimeout(() => {
          setTiles(wordToTiles(currentWord));
          setTyped([]);
          setStatus('idle');
          setConfetti(false);
        }, 1000);
      }
    }
  }

  function onDelete() {
    if (!typed.length || status !== 'idle') return;
    const lastChar = typed[typed.length - 1];
    // un-use the most recently used tile with that char
    let unUsed = false;
    const newTiles = [...tiles].map(t => {
      if (!unUsed && t.used && t.char === lastChar) { unUsed = true; return { ...t, used: false }; }
      return t;
    });
    setTiles(newTiles);
    setTyped(typed.slice(0, -1));
  }

  const slotStatus = (i: number): string => {
    if (status === 'correct') return 'correct-slot';
    if (status === 'wrong')   return 'wrong-slot';
    if (typed[i])             return 'filled';
    return '';
  };

  if (done) return (
    <div className="game-page">
      <Confetti active duration={5000} />
      <Header title="Buchstaben" emoji="🔤" color="#2563eb" />
      <main className="game-main">
        <div className="result-overlay anim-bounce">
          <span className="result-overlay__trophy">🎉</span>
          <div className="result-overlay__title">Alle Wörter richtig!</div>
          <div className="result-overlay__sub">{wordList.length} Wörter buchstabiert</div>
          <div className="result-overlay__score">+{totalScore + 50} Punkte</div>
          <div className="result-overlay__actions">
            <button className="btn btn--blue" onClick={() => { setWordIdx(0); loadWord(0); setDone(false); setTotalScore(0); }}>🔄 Nochmal</button>
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <div className="game-page letters-page">
      <Confetti active={confetti} duration={1200} />
      <Header title="Buchstaben" emoji="🔤" color="#2563eb" />

      <main className="game-main">
        <div style={{ textAlign: 'center', marginBottom: 8, color: 'var(--text-muted)', fontWeight: 700 }}>
          Wort {wordIdx + 1} von {wordList.length}
        </div>
        <div style={{ marginBottom: 20 }}>
          <div className="progress-wrap">
            <div className="progress-fill" style={{ width: `${(wordIdx / wordList.length) * 100}%` }} />
          </div>
        </div>

        {/* Subject */}
        <div className="letters-subject">
          <span className="letters-subject__emoji">{emoji}</span>
          <span className="letters-subject__hint">Wie heißt das auf Deutsch?</span>
        </div>

        {/* Answer slots */}
        <div className="answer-slots">
          {currentWord.split('').map((_, i) => (
            <div key={i} className={`answer-slot ${slotStatus(i)}`}>
              {typed[i] ?? ''}
            </div>
          ))}
        </div>

        {/* Letter tiles */}
        <div className="letter-tiles">
          {tiles.map(tile => (
            <button
              key={tile.id}
              className={`letter-tile${tile.used ? ' used' : ''}`}
              onClick={() => onTileClick(tile.id)}
              aria-label={tile.char}
            >
              {tile.char}
            </button>
          ))}
        </div>

        {/* Delete */}
        <div className="letters-delete-btn">
          <button className="btn btn--ghost btn--sm" onClick={onDelete} disabled={!typed.length}>
            ← Löschen
          </button>
        </div>

        {/* Feedback */}
        {status === 'correct' && (
          <p style={{ textAlign: 'center', marginTop: 16, fontSize: '1.3rem', fontWeight: 900, color: 'var(--green)' }}>
            ✅ Super! +20 Punkte!
          </p>
        )}
        {status === 'wrong' && (
          <p style={{ textAlign: 'center', marginTop: 16, fontSize: '1.1rem', fontWeight: 800, color: 'var(--red)' }}>
            ❌ Nochmal versuchen!
          </p>
        )}
      </main>
    </div>
  );
}
