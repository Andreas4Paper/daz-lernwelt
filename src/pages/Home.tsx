import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { GAMES, AVATARS, ACHIEVEMENTS } from '../data';

const STAR_THRESHOLDS = [100, 250, 500];
const MEDALS = ['🥇', '🥈', '🥉'];

export default function Home() {
  const { profile, profiles, activeIdx, isSetup, setName, setAvatar, createProfile, switchProfile } = useProfile();
  const navigate = useNavigate();

  const [inputName, setInputName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  function handleSetup(e: React.FormEvent) {
    e.preventDefault();
    if (!inputName.trim()) return;
    createProfile(inputName.trim(), selectedAvatar);
  }

  const nextThreshold = STAR_THRESHOLDS.find(t => t > profile.points) ?? 500;
  const prevThreshold = [...STAR_THRESHOLDS].reverse().find(t => t <= profile.points) ?? 0;
  const progress = nextThreshold === prevThreshold ? 100
    : ((profile.points - prevThreshold) / (nextThreshold - prevThreshold)) * 100;

  // top 3 for mini-leaderboard
  const topProfiles = [...profiles]
    .map((p, i) => ({ ...p, originalIdx: i }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 3);

  return (
    <div className="home">
      {/* ── Hero ── */}
      <div className="hero">
        <div className="hero__logo">🌍 DAZ</div>
        <div className="hero__tag">Deutsch als Zweitsprache – Lernwelt für Kinder</div>
        {isSetup && (
          <div className="hero__welcome">Hallo, {profile.avatar} {profile.name}! 👋</div>
        )}
      </div>

      {/* ── Profile ── */}
      <div className="profile-section">
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
              <div className="profile-card__pts">{profile.points} Punkte · Ziel: {nextThreshold}</div>
            </div>
            <div className="profile-card__progress">
              <div className="profile-card__progress-label">
                <span>Fortschritt</span><span>{profile.points} / {nextThreshold}</span>
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
              <input className="setup-input" type="text" placeholder="Dein Name…"
                value={inputName} onChange={e => setInputName(e.target.value)} maxLength={20} autoFocus />
              <h3>Avatar wählen</h3>
              <div className="avatar-grid">
                {AVATARS.map(av => (
                  <button key={av} type="button"
                    className={`avatar-btn${selectedAvatar === av ? ' selected' : ''}`}
                    onClick={() => setSelectedAvatar(av)}>{av}</button>
                ))}
              </div>
              <button className="btn btn--purple btn--lg" type="submit" style={{ width: '100%' }}>
                Los geht's! 🚀
              </button>
            </form>
          </div>
        )}
      </div>

      {isSetup && (
        <>
          {/* ── Games ── */}
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

          {/* ── Mini Leaderboard ── */}
          <div className="games-section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{ margin: 0 }}>🏆 Rangliste</h2>
              <Link to="/leaderboard" className="btn btn--ghost btn--sm" style={{ fontSize: '.9rem' }}>
                Alle ansehen →
              </Link>
            </div>

            {profiles.length <= 1 ? (
              <div className="mini-lb-empty">
                <p>Noch keine anderen Spieler.</p>
                <button className="btn btn--purple btn--sm" onClick={() => navigate('/leaderboard')}>
                  ➕ Profil hinzufügen
                </button>
              </div>
            ) : (
              <div className="mini-lb">
                {topProfiles.map((p, rank) => {
                  const isMe = p.originalIdx === activeIdx;
                  return (
                    <div
                      key={p.originalIdx}
                      className={`mini-lb-row${isMe ? ' mini-lb-row--me' : ''}`}
                      onClick={() => { switchProfile(p.originalIdx); }}
                      role="button"
                    >
                      <span className="mini-lb-medal">{MEDALS[rank] ?? `${rank + 1}.`}</span>
                      <span className="mini-lb-avatar">{p.avatar}</span>
                      <span className="mini-lb-name">{p.name}{isMe ? ' 👈' : ''}</span>
                      <span className="mini-lb-pts">{p.points} Pkt.</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Profile switcher (if multiple) ── */}
          {profiles.length > 1 && (
            <div className="games-section">
              <h2>👤 Spieler wechseln</h2>
              <div className="profile-switcher">
                {profiles.map((p, i) => (
                  <button
                    key={i}
                    className={`profile-switch-btn${i === activeIdx ? ' active' : ''}`}
                    onClick={() => switchProfile(i)}
                  >
                    <span className="psb-avatar">{p.avatar}</span>
                    <span className="psb-name">{p.name}</span>
                    <span className="psb-pts">{p.points} Pkt.</span>
                  </button>
                ))}
                <button className="profile-switch-btn profile-switch-btn--add"
                  onClick={() => navigate('/leaderboard')}>
                  <span style={{ fontSize: '1.5rem' }}>➕</span>
                  <span className="psb-name">Neu</span>
                </button>
              </div>
            </div>
          )}

          {/* ── Achievements ── */}
          <div className="ach-section">
            <h2>🏅 Meine Abzeichen</h2>
            <div className="ach-grid">
              {ACHIEVEMENTS.map(a => {
                const earned = profile.achievements.includes(a.id);
                return (
                  <div key={a.id} className={`ach-badge${earned ? '' : ' ach-badge--locked'}`} title={earned ? a.title : '???'}>
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
