import { useState, useCallback } from 'react';
import Header from '../components/Header';
import Confetti from '../components/Confetti';
import { useProfile } from '../context/ProfileContext';
import { QUIZ_QUESTIONS } from '../data';

function shuffle<T>(a: T[]): T[] {
  const b = [...a]; for (let i = b.length-1; i>0; i--) { const j = Math.floor(Math.random()*(i+1)); [b[i],b[j]]=[b[j],b[i]]; } return b;
}

export default function Quiz() {
  const { addPoints, markGamePlayed } = useProfile();
  const [questions] = useState(() => shuffle(QUIZ_QUESTIONS));
  const [qIdx, setQIdx] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [done, setDone] = useState(false);

  const q = questions[qIdx];
  const isCorrect = chosen === q.correct;

  const advance = useCallback(() => {
    const next = qIdx + 1;
    if (next >= questions.length) {
      setDone(true);
      markGamePlayed('quiz');
      addPoints(40);
    } else {
      setQIdx(next);
      setChosen(null);
      setConfetti(false);
    }
  }, [qIdx, questions.length, markGamePlayed, addPoints]);

  function onAnswer(opt: string) {
    if (chosen) return;
    setChosen(opt);
    if (opt === q.correct) {
      addPoints(10);
      setScore(s => s + 10);
      setConfetti(true);
    }
    setTimeout(advance, 1600);
  }

  function optClass(opt: string) {
    if (!chosen) return 'quiz-opt';
    if (opt === q.correct) return 'quiz-opt correct';
    if (opt === chosen)   return 'quiz-opt wrong';
    return 'quiz-opt answered';
  }

  if (done) return (
    <div className="game-page">
      <Confetti active duration={4000} />
      <Header title="Quiz" emoji="❓" color="#dc2626" />
      <main className="game-main">
        <div className="result-overlay anim-bounce">
          <span className="result-overlay__trophy">
            {score >= questions.length * 8 ? '🏆' : score >= questions.length * 5 ? '🌟' : '👍'}
          </span>
          <div className="result-overlay__title">Quiz fertig!</div>
          <div className="result-overlay__sub">
            {Math.round(score / 10)} von {questions.length} richtig
          </div>
          <div className="result-overlay__score">+{score + 40} Punkte</div>
          <div className="result-overlay__actions">
            <button className="btn btn--red" onClick={() => { setQIdx(0); setChosen(null); setScore(0); setDone(false); setConfetti(false); }}>
              🔄 Nochmal
            </button>
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <div className="game-page">
      <Confetti active={confetti} duration={1000} />
      <Header title="Quiz" emoji="❓" color="#dc2626" />

      <main className="game-main">
        {/* Progress */}
        <div className="quiz-progress-row">
          <div className="progress-wrap" style={{ flex: 1 }}>
            <div className="progress-fill" style={{ width: `${(qIdx / questions.length) * 100}%` }} />
          </div>
          <span>{qIdx + 1} / {questions.length}</span>
        </div>

        {/* Visual + Question */}
        <div className="quiz-visual">
          <span className="quiz-visual__img">{q.visual}</span>
          <div className="quiz-visual__q">{q.question}</div>
        </div>

        {/* Options */}
        <div className="quiz-options">
          {q.options.map(opt => (
            <button
              key={opt}
              className={optClass(opt)}
              onClick={() => onAnswer(opt)}
              disabled={!!chosen}
            >
              {opt}
              {chosen && opt === q.correct && ' ✅'}
              {chosen && opt === chosen && opt !== q.correct && ' ❌'}
            </button>
          ))}
        </div>

        {/* Feedback */}
        {chosen && (
          <div style={{ textAlign: 'center', marginTop: 20, fontSize: '1.15rem', fontWeight: 900,
                        color: isCorrect ? 'var(--green)' : 'var(--red)' }}>
            {isCorrect
              ? '🎉 Super! Richtig!'
              : `Die Antwort ist: ${q.correct}`}
          </div>
        )}
      </main>
    </div>
  );
}
