import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { GAMES, AVATARS, ACHIEVEMENTS } from '../data';

const STAR_THRESHOLDS = [100, 250, 500];

export default function Home() {
  const { profile, isSetup, setName, setAvatar } = useProfile();
  const [inputName, setInputName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  function handleSetup(e: React.FormEvent) {
    e.preventDefault();
    if (!inputName.trim()) return;
    setName(inputName.trim());
    setAvatar(selectedAvatar);
  }

  const nextThreshold = STAR_THRESHOLDS.find(t => t > profile.points) ?? 500;
  const prevThreshold = [...STAR_THRESHOLDS].reverse().find(t => t <= profile.points) ?? 0;
  const progress = nextThreshold === prevThreshold ? 100
    : ((profile.points - prevThreshold) / (nextThreshold - prevThreshold)) * 100;

  return (
    <div className="home">
      {/* ── Hero ── */}
      <div className="hero">
        <div className="hero__logo">🌍 DAZ</div>
        <div className="hero__tag">Deutsch als Zweitsprache – Lernwelt für Kinder</div>
        {isSetup && (
          <div className="hero__welcome">
            Hallo, {profile.avatar} {profile.name}! 👋
          </div>
        )}
      </div>

      {/* ── Profile ── */}
      <div className="profile-section" style={{ marginTop: -28 }}>
        {isSetup ? (
          <div className="profile-card anim-fade-up">
            <div className="profile-card__avatar">{profile.avatar}</div>
            <div className="profile-card__info">
              <div className="profile-card__name">{profile.name}</div>
              <div className="profile-card__stars">
                {[1, 2, 3].map(s => (
                  <span key={s} style={{ opacity: profile.stars >= s ? 1 : .3 }}>⭐</span>
                ))}
              </div>
              <div className="profile-card__pts">
                {profile.points} Punkte · Nächstes Ziel: {nextThreshold} Punkte
              </div>
            </div>
            <div className="profile-card__progress" style={{ flex: '100%', marginTop: 12 }}>
              <div className="profile-card__progress-label">
                <span>Fortschritt</span>
                <span>{profile.points} / {nextThreshold}</span>
              </div>
              <div className="progress-wrap">
                <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
              </div>
            </div>
          </div>
        ) : (
          <div className="setup-card anim-bounce">
            <h2>🌟 Willkommen!</h2>
            <p>Gib deinen Namen ein und wähle einen Avatar.</p>
            <form onSubmit={handleSetup}>
              <input
                className="setup-input"
                type="text"
                placeholder="Dein Name…"
                value={inputName}
                onChange={e => setInputName(e.target.value)}
                maxLength={20}
                autoFocus
              />
              <h3>Avatar wählen</h3>
              <div className="avatar-grid">
                {AVATARS.map(av => (
                  <button
                    key={av} type="button"
                    className={`avatar-btn${selectedAvatar === av ? ' selected' : ''}`}
                    onClick={() => setSelectedAvatar(av)}
                  >
                    {av}
                  </button>
                ))}
              </div>
              <button className="btn btn--purple btn--lg" type="submit" style={{ width: '100%' }}>
                Los geht's! 🚀
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ── Games ── */}
      {isSetup && (
        <>
          <div className="games-section">
            <h2>🎮 Spiele auswählen</h2>
            <div className="games-grid">
              {GAMES.map(g => (
                g.available ? (
                  <Link key={g.id} to={g.path} className="game-tile" style={{ background: g.bg }}>
                    <span className="game-tile__icon">{g.emoji}</span>
                    <div className="game-tile__title">{g.title}</div>
                    <div className="game-tile__desc">{g.desc}</div>
                  </Link>
                ) : (
                  <div key={g.id} className="game-tile game-tile--locked" style={{ background: g.bg }}>
                    <span className="game-tile__icon">{g.emoji}</span>
                    <div className="game-tile__title">{g.title}</div>
                    <div className="game-tile__desc">{g.desc}</div>
                    <span className="game-tile__lock">Bald</span>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* ── Achievements ── */}
          <div className="ach-section">
            <h2>🏅 Meine Abzeichen</h2>
            <div className="ach-grid">
              {ACHIEVEMENTS.map(a => {
                const earned = profile.achievements.includes(a.id);
                return (
                  <div key={a.id} className={`ach-badge${earned ? '' : ' ach-badge--locked'}`}
                       title={earned ? a.title : '???'}>
                    <span className="ach-badge__icon">{a.icon}</span>
                    <span className="ach-badge__label">{earned ? a.title : '???'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
