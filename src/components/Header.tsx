import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';

interface Props {
  title: string;
  emoji: string;
  color: string;
}

export default function Header({ title, emoji, color }: Props) {
  const { profile } = useProfile();
  const navigate = useNavigate();

  return (
    <header className="game-header" style={{ borderBottom: `4px solid ${color}` }}>
      <button className="back-btn" onClick={() => navigate('/')} aria-label="Zurück">
        ← Zurück
      </button>
      <div className="game-header__title">
        <span>{emoji}</span> {title}
      </div>
      <div className="game-header__pts">
        <span className="pts-bubble">⭐ {profile.points}</span>
      </div>
    </header>
  );
}
