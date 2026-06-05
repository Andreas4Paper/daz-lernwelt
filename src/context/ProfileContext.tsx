import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Profile } from '../types';
import { ACHIEVEMENTS } from '../data';

const DEFAULT: Profile = {
  name: '',
  avatar: '🦁',
  points: 0,
  stars: 0,
  achievements: [],
  gamesPlayed: {},
};

interface Ctx {
  profile: Profile;
  isSetup: boolean;
  setName: (n: string) => void;
  setAvatar: (a: string) => void;
  addPoints: (pts: number) => void;
  markGamePlayed: (game: string) => void;
  unlockAchievement: (id: string) => void;
  resetProfile: () => void;
}

const ProfileContext = createContext<Ctx | null>(null);

function starsFor(pts: number) {
  if (pts >= 500) return 3;
  if (pts >= 250) return 2;
  if (pts >= 100) return 1;
  return 0;
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(() => {
    try {
      const raw = localStorage.getItem('daz_profile');
      return raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT;
    } catch {
      return DEFAULT;
    }
  });

  useEffect(() => {
    localStorage.setItem('daz_profile', JSON.stringify(profile));
  }, [profile]);

  const isSetup = profile.name.trim().length > 0;

  function addPoints(pts: number) {
    setProfile(p => {
      const newPts = p.points + pts;
      const newStars = starsFor(newPts);
      const achievements = [...p.achievements];
      // point milestones
      if (newPts >= 100 && !achievements.includes('pts_100')) achievements.push('pts_100');
      if (newPts >= 250 && !achievements.includes('pts_250')) achievements.push('pts_250');
      if (newPts >= 500 && !achievements.includes('pts_500')) achievements.push('pts_500');
      return { ...p, points: newPts, stars: newStars, achievements };
    });
  }

  function setName(name: string) { setProfile(p => ({ ...p, name })); }
  function setAvatar(avatar: string) { setProfile(p => ({ ...p, avatar })); }

  function markGamePlayed(game: string) {
    setProfile(p => {
      const gamesPlayed = { ...p.gamesPlayed, [game]: (p.gamesPlayed[game] ?? 0) + 1 };
      const achievements = [...p.achievements];
      // first game ever
      const totalGames = Object.values(gamesPlayed).reduce((a, b) => a + b, 0);
      if (totalGames === 1 && !achievements.includes('first_game')) achievements.push('first_game');
      // per-game badge
      const gameAch = `${game}_done`;
      if (ACHIEVEMENTS.some(a => a.id === gameAch) && !achievements.includes(gameAch))
        achievements.push(gameAch);
      return { ...p, gamesPlayed, achievements };
    });
  }

  function unlockAchievement(id: string) {
    setProfile(p =>
      p.achievements.includes(id) ? p : { ...p, achievements: [...p.achievements, id] }
    );
  }

  function resetProfile() { setProfile(DEFAULT); }

  return (
    <ProfileContext.Provider value={{ profile, isSetup, setName, setAvatar, addPoints, markGamePlayed, unlockAchievement, resetProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile(): Ctx {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be inside ProfileProvider');
  return ctx;
}
