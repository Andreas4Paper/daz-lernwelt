import { useState, useRef, useEffect, useCallback } from 'react';
import Peer from 'peerjs';
import type { DataConnection } from 'peerjs';
import Header from '../components/Header';
import Confetti from '../components/Confetti';
import { useProfile } from '../context/ProfileContext';
import { artSym } from '../data';

/* ── Fruit data ──────────────────────────────────────── */
const FRUITS = [
  { id: 'banane',   word: 'Banane',   emoji: '🍌', article: 'die' as const, bg: '#fef9c3' },
  { id: 'apfel',    word: 'Apfel',    emoji: '🍎', article: 'der' as const, bg: '#fee2e2' },
  { id: 'erdbeere', word: 'Erdbeere', emoji: '🍓', article: 'die' as const, bg: '#fce7f3' },
  { id: 'orange',   word: 'Orange',   emoji: '🍊', article: 'die' as const, bg: '#ffedd5' },
  { id: 'zitrone',  word: 'Zitrone',  emoji: '🍋', article: 'die' as const, bg: '#fef9c3' },
  { id: 'traube',   word: 'Traube',   emoji: '🍇', article: 'die' as const, bg: '#f3e8ff' },
  { id: 'ananas',   word: 'Ananas',   emoji: '🍍', article: 'die' as const, bg: '#fef9c3' },
  { id: 'kirsche',  word: 'Kirsche',  emoji: '🍒', article: 'die' as const, bg: '#fce7f3' },
  { id: 'mango',    word: 'Mango',    emoji: '🥭', article: 'die' as const, bg: '#ffedd5' },
  { id: 'kiwi',     word: 'Kiwi',     emoji: '🥝', article: 'die' as const, bg: '#dcfce7' },
  { id: 'birne',    word: 'Birne',    emoji: '🍐', article: 'die' as const, bg: '#fef9c3' },
  { id: 'pfirsich', word: 'Pfirsich', emoji: '🍑', article: 'der' as const, bg: '#ffedd5' },
];
type Fruit = typeof FRUITS[0];

const QUICK_QS = [
  'Bin ich gelb?', 'Bin ich rot?', 'Bin ich grün?', 'Bin ich orange?',
  'Bin ich rund?', 'Bin ich süß?', 'Bin ich groß?', 'Bin ich klein?',
  'Bin ich tropisch?', 'Wachse ich in Deutschland?',
  'Habe ich eine Schale?', 'Bin ich eine Beere?', 'Habe ich einen Kern?',
];

/* ── Types ────────────────────────────────────────────── */
type Phase = 'lobby' | 'creating' | 'waiting' | 'joining' | 'connecting' | 'playing' | 'finished';
interface Msg { type: string; [k: string]: unknown; }
interface ChatLine { from: 'me' | 'them' | 'sys'; text: string; }

function randCode() { return Math.random().toString(36).substring(2, 8).toUpperCase(); }
function shuffle<T>(a: T[]): T[] { const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b; }

/* ──────────────────────────────────────────────────────── */
export default function WhoAmI() {
  const { addPoints, markGamePlayed } = useProfile();

  const peerRef = useRef<InstanceType<typeof Peer> | null>(null);
  const connRef = useRef<DataConnection | null>(null);

  const [phase,      setPhase]      = useState<Phase>('lobby');
  const [isHost,     setIsHost]     = useState(false);
  const [roomCode,   setRoomCode]   = useState('');
  const [joinInput,  setJoinInput]  = useState('');
  const [errMsg,     setErrMsg]     = useState('');

  const [myFruit,    setMyFruit]    = useState<Fruit | null>(null);
  const [oppFruit,   setOppFruit]   = useState<Fruit | null>(null);
  const [chat,       setChat]       = useState<ChatLine[]>([]);
  const [myTurn,     setMyTurn]     = useState(false);
  const [pendingQ,   setPendingQ]   = useState('');   // question waiting for my answer
  const [customQ,    setCustomQ]    = useState('');
  const [guessMode,  setGuessMode]  = useState(false);
  const [wrongGuess, setWrongGuess] = useState(false);
  const [winner,     setWinner]     = useState<'me' | 'them' | null>(null);
  const [confetti,   setConfetti]   = useState(false);
  const [qCount,     setQCount]     = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Refs for stale-closure-safe message handler
  const myFruitRef  = useRef<Fruit | null>(null);
  const oppFruitRef = useRef<Fruit | null>(null);
  useEffect(() => { myFruitRef.current  = myFruit;  }, [myFruit]);
  useEffect(() => { oppFruitRef.current = oppFruit; }, [oppFruit]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chat]);
  useEffect(() => () => { peerRef.current?.destroy(); }, []);

  const addLine = useCallback((line: ChatLine) => {
    setChat(prev => [...prev, line]);
  }, []);

  function send(msg: Msg) { connRef.current?.send(msg); }

  /* ── Message handler (always fresh via ref pattern) ── */
  const handleMsgRef = useRef<(msg: Msg) => void>(() => {});
  handleMsgRef.current = (msg: Msg) => {
    switch (msg.type) {

      case 'game-start': {
        // Arrive at joiner: myFruit = msg.myFruit, oppFruit = msg.oppFruit
        const mf = FRUITS.find(f => f.id === msg.myFruit)!;
        const of_ = FRUITS.find(f => f.id === msg.oppFruit)!;
        setMyFruit(mf); setOppFruit(of_);
        setPhase('playing'); setMyTurn(false);
        addLine({ from: 'sys', text: '🎮 Das Spiel beginnt! Dein Partner fragt zuerst.' });
        break;
      }

      case 'question': {
        const text = msg.text as string;
        addLine({ from: 'them', text: `❓ ${text}` });
        setPendingQ(text);
        setMyTurn(false);
        break;
      }

      case 'answer': {
        addLine({ from: 'them', text: `💬 ${msg.text as string}` });
        setPendingQ('');
        setQCount(c => c + 1);
        setMyTurn(true);  // after they answer → my turn to ask
        break;
      }

      case 'guess': {
        const guessedId = msg.fruitId as string;
        const gFruit = FRUITS.find(f => f.id === guessedId)!;
        // Partner guessed their own fruit — their fruit = my oppFruit
        const correct = guessedId === oppFruitRef.current?.id;
        addLine({ from: 'them', text: `🎯 Partner rät: ${gFruit.emoji} ${gFruit.word} → ${correct ? '✅ RICHTIG!' : '❌ Falsch!'}` });
        if (correct) {
          setWinner('them'); setConfetti(false);
          setPhase('finished');
          addPoints(10); markGamePlayed('whoami');
        }
        break;
      }

      case 'rematch': {
        resetLocalState();
        setPhase('playing');
        // Re-assign fruits (host sends game-start again on rematch)
        break;
      }

      case 'disconnect': {
        addLine({ from: 'sys', text: '🔌 Verbindung getrennt.' });
        break;
      }
    }
  };

  function setupConn(conn: DataConnection) {
    connRef.current = conn;
    conn.on('data', (raw) => handleMsgRef.current(raw as Msg));
    conn.on('close', () => addLine({ from: 'sys', text: '🔌 Mitspieler hat die Verbindung getrennt.' }));
    conn.on('error', () => addLine({ from: 'sys', text: '⚠️ Verbindungsfehler.' }));
  }

  function resetLocalState() {
    setMyFruit(null); setOppFruit(null); setChat([]);
    setMyTurn(false); setPendingQ(''); setCustomQ('');
    setGuessMode(false); setWrongGuess(false);
    setWinner(null); setConfetti(false); setQCount(0);
  }

  /* ── Create game (HOST) ─────────────────────────────── */
  function createGame() {
    setPhase('creating');
    setIsHost(true);
    setErrMsg('');
    const code = randCode();
    setRoomCode(code);

    // PeerJS: use code as peer ID (with prefix to avoid collisions)
    const peer = new Peer('daz2-' + code, {
      config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
    });
    peerRef.current = peer;

    peer.on('error', (err) => {
      if ((err as { type?: string }).type === 'unavailable-id') {
        peer.destroy(); createGame(); // retry with new code
      } else {
        setErrMsg('Fehler beim Erstellen: ' + err.message);
        setPhase('lobby');
      }
    });

    peer.on('open', () => setPhase('waiting'));

    peer.on('connection', (conn) => {
      setupConn(conn);
      conn.on('open', () => {
        // Assign fruits randomly
        const [f1, f2] = shuffle(FRUITS);
        setMyFruit(f1);
        setOppFruit(f2);
        // HOST: myFruit=f1, oppFruit=f2
        // Tell JOINER: their fruit=f2, opponent(host)=f1
        conn.send({ type: 'game-start', myFruit: f2.id, oppFruit: f1.id });
        setPhase('playing');
        setMyTurn(true); // HOST asks first
        addLine({ from: 'sys', text: '🎉 Mitspieler verbunden! Du fragst zuerst.' });
      });
    });
  }

  /* ── Join game (JOINER) ─────────────────────────────── */
  function joinGame() {
    if (!joinInput.trim()) return;
    const code = joinInput.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    setPhase('connecting');
    setIsHost(false);
    setRoomCode(code);
    setErrMsg('');

    const peer = new Peer({
      config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] },
    });
    peerRef.current = peer;

    peer.on('error', (err) => {
      setErrMsg('Verbindungsfehler: ' + err.message);
      setPhase('lobby');
      peer.destroy();
    });

    peer.on('open', () => {
      const conn = peer.connect('daz2-' + code, { reliable: true });
      setupConn(conn);
      conn.on('error', () => {
        setErrMsg('Raum nicht gefunden. Code prüfen!');
        setPhase('lobby');
      });
      // game-start message triggers playing phase
    });
  }

  /* ── Ask question ────────────────────────────────────── */
  function askQuestion(text: string) {
    if (!text.trim() || !myTurn || pendingQ) return;
    addLine({ from: 'me', text: `❓ ${text}` });
    send({ type: 'question', text });
    setMyTurn(false);
    setCustomQ('');
  }

  /* ── Answer ─────────────────────────────────────────── */
  function giveAnswer(ans: string) {
    addLine({ from: 'me', text: `💬 ${ans}` });
    send({ type: 'answer', text: ans });
    setPendingQ('');
    setMyTurn(true); // after answering → my turn to ask next
    setQCount(c => c + 1);
  }

  /* ── Guess ───────────────────────────────────────────── */
  function makeGuess(fruitId: string) {
    send({ type: 'guess', fruitId });
    const guessed = FRUITS.find(f => f.id === fruitId)!;
    const correct = fruitId === myFruit?.id;
    addLine({ from: 'me', text: `🎯 Ich rate: ${guessed.emoji} ${guessed.word} → ${correct ? '✅ RICHTIG!' : '❌ Falsch!'}` });
    if (correct) {
      setWinner('me'); setConfetti(true);
      setPhase('finished');
      addPoints(30); markGamePlayed('whoami');
    } else {
      setWrongGuess(true);
      setTimeout(() => { setWrongGuess(false); setGuessMode(false); }, 1500);
    }
  }

  /* ── Rematch ─────────────────────────────────────────── */
  function rematch() {
    if (isHost) {
      resetLocalState();
      const [f1, f2] = shuffle(FRUITS);
      setMyFruit(f1); setOppFruit(f2);
      connRef.current?.send({ type: 'game-start', myFruit: f2.id, oppFruit: f1.id });
      setPhase('playing'); setMyTurn(true);
      addLine({ from: 'sys', text: '🔄 Neue Runde! Du fragst zuerst.' });
    } else {
      resetLocalState();
      connRef.current?.send({ type: 'rematch' });
      setPhase('playing');
      addLine({ from: 'sys', text: '🔄 Neue Runde! Warte auf deinen Partner…' });
    }
  }

  /* ══════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════ */

  /* ── Lobby ── */
  if (phase === 'lobby') return (
    <div className="game-page">
      <Header title="Wer bin ich?" emoji="🎭" color="#7c3aed" />
      <main className="game-main wai-main">
        {errMsg && (
          <div className="wai-error">⚠️ {errMsg}
            <button onClick={() => setErrMsg('')} style={{ marginLeft: 8 }}>✕</button>
          </div>
        )}
        <div className="wai-lobby">
          <div className="wai-big-emoji">🎭</div>
          <h1 className="wai-title">Wer bin ich?</h1>
          <p className="wai-subtitle">Früchte-Edition · 2 Spieler · 2 Geräte</p>
          <div className="wai-rules">
            <div className="wai-rule"><span>1.</span> Erstelle ein Spiel und teile den Code mit deinem Freund</div>
            <div className="wai-rule"><span>2.</span> Jeder bekommt heimlich eine Frucht zugewiesen</div>
            <div className="wai-rule"><span>3.</span> Stelle Ja/Nein-Fragen und rate, welche Frucht du bist!</div>
          </div>
          <div className="wai-lobby-actions">
            <button className="btn btn--purple btn--lg wai-big-btn" onClick={createGame}>
              🌐 Spiel erstellen
            </button>
            <div className="wai-or">oder</div>
            <div className="wai-join-row">
              <input
                className="wai-code-input"
                type="text"
                placeholder="Code eingeben…"
                value={joinInput}
                onChange={e => setJoinInput(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && joinGame()}
                maxLength={6}
                autoCapitalize="characters"
              />
              <button className="btn btn--green" onClick={joinGame} disabled={!joinInput.trim()}>
                Beitreten →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  /* ── Waiting / Connecting ── */
  if (phase === 'waiting' || phase === 'creating') return (
    <div className="game-page">
      <Header title="Wer bin ich?" emoji="🎭" color="#7c3aed" />
      <main className="game-main wai-main">
        <div className="wai-waiting-screen">
          <div className="wai-pulse">🎭</div>
          <h2>Warte auf Mitspieler…</h2>
          <p>Gib deinem Freund diesen Code:</p>
          <div className="wai-code-display">
            {roomCode.split('').map((c, i) => <span key={i} className="wai-code-char">{c}</span>)}
          </div>
          <p className="wai-hint">Dein Freund gibt diesen Code auf seinem Gerät ein.</p>
          <button className="btn btn--ghost btn--sm" onClick={() => { peerRef.current?.destroy(); setPhase('lobby'); }}>
            ✕ Abbrechen
          </button>
        </div>
      </main>
    </div>
  );

  if (phase === 'connecting') return (
    <div className="game-page">
      <Header title="Wer bin ich?" emoji="🎭" color="#7c3aed" />
      <main className="game-main wai-main">
        <div className="wai-waiting-screen">
          <div className="wai-pulse">🔗</div>
          <h2>Verbinde mit Raum <em>{roomCode}</em>…</h2>
        </div>
      </main>
    </div>
  );

  /* ── Finished ── */
  if (phase === 'finished') return (
    <div className="game-page">
      <Confetti active={confetti} duration={5000} />
      <Header title="Wer bin ich?" emoji="🎭" color="#7c3aed" />
      <main className="game-main wai-main">
        <div className="result-overlay anim-bounce">
          <span className="result-overlay__trophy">{winner === 'me' ? '🏆' : '🎭'}</span>
          <div className="result-overlay__title">
            {winner === 'me' ? 'Du hast gewonnen!' : 'Dein Partner hat gewonnen!'}
          </div>

          {/* Reveal both fruits */}
          <div className="wai-reveal-row">
            {myFruit && (
              <div className="wai-reveal-card" style={{ background: myFruit.bg }}>
                <div className="wai-rc-label">Du warst</div>
                <div className="wai-rc-emoji">{myFruit.emoji}</div>
                <div className="wai-rc-name">
                  <span className="wai-rc-sym">{artSym(myFruit.article)}</span>
                  {myFruit.article} {myFruit.word}
                </div>
              </div>
            )}
            {oppFruit && (
              <div className="wai-reveal-card" style={{ background: oppFruit.bg }}>
                <div className="wai-rc-label">Partner war</div>
                <div className="wai-rc-emoji">{oppFruit.emoji}</div>
                <div className="wai-rc-name">
                  <span className="wai-rc-sym">{artSym(oppFruit.article)}</span>
                  {oppFruit.article} {oppFruit.word}
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: 16, fontSize: '.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>
            {qCount} Fragen gestellt
          </div>

          <div className="result-overlay__actions" style={{ marginTop: 20 }}>
            <button className="btn btn--purple" onClick={rematch}>🔄 Nochmal</button>
            <button className="btn btn--ghost" onClick={() => { peerRef.current?.destroy(); resetLocalState(); setPhase('lobby'); }}>
              🏠 Beenden
            </button>
          </div>
        </div>
      </main>
    </div>
  );

  /* ── Playing ── */
  return (
    <div className="game-page">
      <Header title="Wer bin ich?" emoji="🎭" color="#7c3aed" />
      <main className="game-main wai-main" style={{ maxWidth: 540, padding: '12px 12px 120px' }}>

        {/* Fruit display */}
        <div className="wai-fruits-bar">
          <div className="wai-fruit-slot wai-me">
            <div className="wai-fs-label">Ich bin…</div>
            <div className="wai-fs-emoji">❓</div>
            <div className="wai-fs-name wai-fs-hidden">???</div>
          </div>

          <div className="wai-fruits-vs">VS</div>

          {oppFruit && (
            <div className="wai-fruit-slot wai-opp" style={{ background: oppFruit.bg }}>
              <div className="wai-fs-label">Mein Partner</div>
              <div className="wai-fs-emoji">{oppFruit.emoji}</div>
              <div className="wai-fs-name">
                {artSym(oppFruit.article)} {oppFruit.article} {oppFruit.word}
              </div>
            </div>
          )}
        </div>

        {/* Question counter */}
        <div className="wai-q-counter">
          Frage {qCount + 1} • {myTurn ? '✏️ Dein Zug' : pendingQ ? '💬 Antworte!' : '⏳ Warten…'}
        </div>

        {/* Chat log */}
        <div className="wai-chat">
          {chat.length === 0 && (
            <div className="wai-chat-empty">Noch keine Fragen. Los geht's! 🚀</div>
          )}
          {chat.map((line, i) => (
            <div key={i} className={`wai-line wai-line--${line.from}`}>{line.text}</div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* ── I need to answer ── */}
        {pendingQ && !guessMode && (
          <div className="wai-action-box wai-answer-box">
            <div className="wai-pending-label">❓ {pendingQ}</div>
            <div className="wai-answer-btns">
              <button className="btn btn--green"  onClick={() => giveAnswer('Ja! ✅')}>Ja! ✅</button>
              <button className="btn btn--red"    onClick={() => giveAnswer('Nein! ❌')}>Nein! ❌</button>
              <button className="btn btn--ghost"  onClick={() => giveAnswer('Vielleicht 🤔')}>Vielleicht 🤔</button>
            </div>
          </div>
        )}

        {/* ── My turn to ask ── */}
        {myTurn && !pendingQ && !guessMode && (
          <div className="wai-action-box wai-ask-box">
            <div className="wai-ask-label">⭐ Wähle eine Frage:</div>
            <div className="wai-quick-qs">
              {QUICK_QS.map(q => (
                <button key={q} className="wai-quick-q" onClick={() => askQuestion(q)}>{q}</button>
              ))}
            </div>
            <div className="wai-custom-row">
              <input
                className="wai-custom-input"
                type="text"
                placeholder="Eigene Ja/Nein-Frage…"
                value={customQ}
                onChange={e => setCustomQ(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && askQuestion(customQ)}
              />
              <button className="btn btn--purple btn--sm" disabled={!customQ.trim()}
                onClick={() => askQuestion(customQ)}>🎤</button>
            </div>
            <button className="btn btn--orange wai-guess-trigger" onClick={() => setGuessMode(true)}>
              🎯 Ich rate jetzt!
            </button>
          </div>
        )}

        {/* ── Waiting for partner ── */}
        {!myTurn && !pendingQ && !guessMode && (
          <div className="wai-action-box wai-waiting-box">
            <div className="wai-waiting-anim">⏳</div>
            <p>Warte auf deinen Partner…</p>
          </div>
        )}

        {/* ── Guess grid ── */}
        {guessMode && (
          <div className="wai-action-box wai-guess-box">
            <h3>Was bist du? Tippe auf die Frucht!</h3>
            {wrongGuess && <p className="wai-wrong-msg">❌ Falsch! Noch einmal versuchen.</p>}
            <div className="wai-guess-grid">
              {FRUITS.map(f => (
                <button key={f.id} className="wai-guess-tile" style={{ background: f.bg }}
                  onClick={() => makeGuess(f.id)}>
                  <span className="wai-gt-emoji">{f.emoji}</span>
                  <span className="wai-gt-word">{f.word}</span>
                </button>
              ))}
            </div>
            <button className="btn btn--ghost btn--sm" style={{ marginTop: 12 }}
              onClick={() => setGuessMode(false)}>← Zurück zu Fragen</button>
          </div>
        )}
      </main>
    </div>
  );
}
