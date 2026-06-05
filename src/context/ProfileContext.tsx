import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Profile } from '../types';
import { ACHIEVEMENTS } from '../data';

const DEFAULT_PROFILE = (name = '', avatar = '🦁'): Profile => ({
  name, avatar, points: 0, stars: 0, achievements: [], gamesPlayed: {},
});

interface ProfilesStorage {
  profiles: Profile[];
  activeIdx: number;
}

interface Ctx {
  profiles: Profile[];
  profile: Profile;           // active profile
  activeIdx: number;
  isSetup: boolean;
  createProfile: (name: string, avatar: string) => void;
  switchProfile: (idx: number) => void;
  deleteProfile: (idx: number) => void;
  setName: (n: string) => void;
  setAvatar: (a: string) => void;
  addPoints: (pts: number) => void;
  markGamePlayed: (game: string) => void;
  unlockAchievement: (id: string) => void;
}

const ProfileContext = createContext<Ctx | null>(null);

function starsFor(pts: number) {
  if (pts >= 500) return 3;
  if (pts >= 250) return 2;
  if (pts >= 100) return 1;
  return 0;
}

const STORAGE_KEY = 'daz_profiles_v2';

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [storage, setStorage] = useState<ProfilesStorage>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as ProfilesStorage;
      // migrate old single-profile format
      const old = localStorage.getItem('daz_profile');
      if (old) {
        const p = JSON.parse(old) as Profile;
        if (p.name) return { profiles: [p], activeIdx: 0 };
      }
    } catch (_) { /* ignore */ }
    return { profiles: [], activeIdx: 0 };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
  }, [storage]);

  const profiles = storage.profiles;
  const activeIdx = Math.min(storage.activeIdx, Math.max(0, profiles.length - 1));
  const profile = profiles[activeIdx] ?? DEFAULT_PROFILE();
  const isSetup = profiles.length > 0;

  function mutateActive(fn: (p: Profile) => Profile) {
    setStorage(s => {
      const ps = [...s.profiles];
      ps[activeIdx] = fn(ps[activeIdx]);
      return { ...s, profiles: ps };
    });
  }

  function addPoints(pts: number) {
    mutateActive(p => {
      const newPts = p.points + pts;
      const stars = starsFor(newPts);
      const achievements = [...p.achievements];
      if (newPts >= 100 && !achievements.includes('pts_100')) achievements.push('pts_100');
      if (newPts >= 250 && !achievements.includes('pts_250')) achievements.push('pts_250');
      if (newPts >= 500 && !achievements.includes('pts_500')) achievements.push('pts_500');
      return { ...p, points: newPts, stars, achievements };
    });
  }

  function setName(name: string) { mutateActive(p => ({ ...p, name })); }
  function setAvatar(avatar: string) { mutateActive(p => ({ ...p, avatar })); }

  function markGamePlayed(game: string) {
    mutateActive(p => {
      const gamesPlayed = { ...p.gamesPlayed, [game]: (p.gamesPlayed[game] ?? 0) + 1 };
      const achievements = [...p.achievements];
      const total = Object.values(gamesPlayed).reduce((a, b) => a + b, 0);
      if (total === 1 && !achievements.includes('first_game')) achievements.push('first_game');
      const ach = `${game}_done`;
      if (ACHIEVEMENTS.some(a => a.id === ach) && !achievements.includes(ach)) achievements.push(ach);
      return { ...p, gamesPlayed, achievements };
    });
  }

  function unlockAchievement(id: string) {
    mutateActive(p =>
      p.achievements.includes(id) ? p : { ...p, achievements: [...p.achievements, id] }
    );
  }

  function createProfile(name: string, avatar: string) {
    setStorage(s => ({
      profiles: [...s.profiles, DEFAULT_PROFILE(name, avatar)],
      activeIdx: s.profiles.length, // switch to new profile
    }));
  }

  function switchProfile(idx: number) {
    setStorage(s => ({ ...s, activeIdx: idx }));
  }

  function deleteProfile(idx: number) {
    setStorage(s => {
      const ps = s.profiles.filter((_, i) => i !== idx);
      const newIdx = Math.min(s.activeIdx, Math.max(0, ps.length - 1));
      return { profiles: ps, activeIdx: newIdx };
    });
  }

  return (
    <ProfileContext.Provider value={{
      profiles, profile, activeIdx, isSetup,
      createProfile, switchProfile, deleteProfile,
      setName, setAvatar, addPoints, markGamePlayed, unlockAchievement,
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile(): Ctx {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be inside ProfileProvider');
  return ctx;
}
