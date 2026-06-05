import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { AVATARS } from '../data';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function Leaderboard() {
  const { profiles, activeIdx, createProfile, switchProfile, deleteProfile } = useProfile();
  const navigate = useNavigate();

  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAvatar, setNewAvatar] = useState(AVATARS[0]);

  const sorted = [...profiles]
    .map((p, originalIdx) => ({ ...p, originalIdx }))
    .sort((a, b) => b.points - a.points);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    createProfile(newName.trim(), newAvatar);
    setNewName(''); setNewAvatar(AVATARS[0]); setShowNew(false);
  }

  return (
    <div className="game-page">
      <header className="game-header" style={{ borderBottom: '4px solid #7c3aed' }}>
        <button className="back-btn" onClick={() => navigate('/')}>← Zurück</button>
        <div className="game-header__title">🏆 Rangliste</div>
        <div />
      </header>

      <main className="game-main" style={{ maxWidth: 560 }}>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 20 }}>
          Wer hat die meisten Punkte gesammelt?
        </p>

        {/* Ranking list */}
        {sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            Noch keine Spieler – erstelle ein Profil!
          </div>
        ) : (
          <div className="lb-list">
            {sorted.map((p, rank) => {
              const isActive = p.originalIdx === activeIdx;
              return (
                <div
                  key={p.originalIdx}
                  className={`lb-row${isActive ? ' lb-row--active' : ''}`}
                  onClick={() => { switchProfile(p.originalIdx); navigate('/'); }}
                  role="button"
                  aria-label={`${p.name} auswählen`}
                >
                  <span className="lb-medal">{MEDALS[rank] ?? `#${rank + 1}`}</span>
                  <span className="lb-avatar">{p.avatar}</span>
                  <div className="lb-info">
                    <div className="lb-name">
                      {p.name}
                      {isActive && <span className="lb-you-badge">Du</span>}
                    </div>
                    <div className="lb-stars">
                      {[1, 2, 3].map(s => (
                        <span key={s} style={{ opacity: p.stars >= s ? 1 : 0.25 }}>⭐</span>
                      ))}
                      <span className="lb-games">{Object.values(p.gamesPlayed).reduce((a, b) => a + b, 0)} Spiele</span>
                    </div>
                  </div>
                  <div className="lb-points">
                    <span className="lb-pts-num">{p.points}</span>
                    <span className="lb-pts-lbl">Punkte</span>
                  </div>
                  <button
                    className="lb-delete"
                    onClick={e => { e.stopPropagation(); deleteProfile(p.originalIdx); }}
                    aria-label="Profil löschen"
                    title="Profil löschen"
                  >✕</button>
                </div>
              );
            })}
          </div>
        )}

        {/* Add new profile */}
        {showNew ? (
          <div className="lb-new-form">
            <h3>Neues Profil erstellen</h3>
            <form onSubmit={handleCreate}>
              <input
                className="setup-input"
                type="text"
                placeholder="Name eingeben…"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                maxLength={20}
                autoFocus
              />
              <div className="avatar-grid" style={{ marginBottom: 16 }}>
                {AVATARS.map(av => (
                  <button
                    key={av} type="button"
                    className={`avatar-btn${newAvatar === av ? ' selected' : ''}`}
                    onClick={() => setNewAvatar(av)}
                  >
                    {av}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn--purple" type="submit" style={{ flex: 1 }}>✅ Erstellen</button>
                <button className="btn btn--ghost" type="button" onClick={() => setShowNew(false)} style={{ flex: 1 }}>Abbrechen</button>
              </div>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button className="btn btn--purple" onClick={() => setShowNew(true)}>
              ➕ Neues Profil
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
