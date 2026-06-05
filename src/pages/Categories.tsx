import { useState } from 'react';
import Header from '../components/Header';
import Confetti from '../components/Confetti';
import { useProfile } from '../context/ProfileContext';
import { CATEGORY_SETS, getWord } from '../data';
import type { WordItem } from '../types';

interface CatZone {
  label: string;
  emoji: string;
  color: string;
  correctIds: string[];
  placed: string[];
}

interface ItemSlot {
  item: WordItem;
  placed: boolean;
}

function buildState() {
  const zones: CatZone[] = CATEGORY_SETS.map(cat => ({
    ...cat,
    correctIds: cat.items,
    placed: [],
  }));
  const items: ItemSlot[] = CATEGORY_SETS.flatMap(cat =>
    cat.items.map(id => ({ item: getWord(id), placed: false }))
  );
  // shuffle items
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return { zones, items };
}

export default function Categories() {
  const { addPoints, markGamePlayed } = useProfile();
  const [{ zones, items }, setGameState] = useState(buildState);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const allPlaced = items.every(i => i.placed);

  function onItemClick(id: string) {
    if (checked) return;
    const item = items.find(i => i.item.id === id);
    if (item?.placed) return;
    setSelected(prev => prev === id ? null : id);
  }

  function onZoneClick(zoneIdx: number) {
    if (!selected || checked) return;
    const id = selected;
    setSelected(null);
    setGameState(prev => ({
      items: prev.items.map(i => i.item.id === id ? { ...i, placed: true } : i),
      zones: prev.zones.map((z, zi) =>
        zi === zoneIdx ? { ...z, placed: [...z.placed, id] } : z
      ),
    }));
  }

  function checkAnswers() {
    setChecked(true);
    const correct = zones.reduce((sum, z) =>
      sum + z.placed.filter(id => z.correctIds.includes(id)).length, 0
    );
    const pts = correct * 10;
    addPoints(pts);
    setConfetti(correct >= 8);
    markGamePlayed('categories');
    if (correct >= 10) addPoints(30); // bonus
  }

  function isCorrectPlacement(zoneIdx: number, id: string) {
    return zones[zoneIdx].correctIds.includes(id);
  }

  const correctCount = checked
    ? zones.reduce((sum, z) => sum + z.placed.filter(id => z.correctIds.includes(id)).length, 0)
    : 0;

  return (
    <div className="game-page">
      <Confetti active={confetti} duration={3500} />
      <Header title="Kategorien" emoji="📦" color="#ea580c" />

      <main className="game-main">
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: 4 }}>
            📦 Sortiere die Bilder!
          </h2>
          <p style={{ color: 'var(--text-muted)', fontWeight: 700 }}>
            {checked
              ? `${correctCount} von 12 richtig!`
              : selected
                ? '👆 Wähle jetzt eine Kategorie!'
                : 'Wähle ein Bild, dann eine Kategorie.'}
          </p>
        </div>

        {/* Items tray */}
        {!allPlaced && !checked && (
          <div className="cats-items">
            {items.filter(i => !i.placed).map(({ item }) => (
              <button
                key={item.id}
                className={`cat-item${selected === item.id ? ' selected' : ''}`}
                onClick={() => onItemClick(item.id)}
                aria-label={item.word}
              >
                <span>{item.emoji}</span>
                <span>{item.word}</span>
              </button>
            ))}
          </div>
        )}

        {/* Category zones */}
        <div className="cats-grid">
          {zones.map((zone, zi) => (
            <div
              key={zi}
              className={`cat-zone${selected ? ' highlight' : ''}`}
              style={{ borderColor: zone.color, background: selected ? zone.color + '18' : undefined }}
              onClick={() => onZoneClick(zi)}
            >
              <div className="cat-zone__header">
                <span className="cat-zone__emoji">{zone.emoji}</span>
                <div className="cat-zone__label" style={{ color: zone.color }}>{zone.label}</div>
              </div>
              <div className="cat-zone__items">
                {zone.placed.map(id => {
                  const w = getWord(id);
                  const ok = isCorrectPlacement(zi, id);
                  return (
                    <span
                      key={id}
                      className={`cat-zone-item${checked ? (ok ? ' correct' : ' wrong') : ''}`}
                      title={w.word}
                    >
                      {w.emoji}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Submit / Result */}
        <div className="cats-submit">
          {!checked ? (
            <button
              className="btn btn--orange"
              style={{ marginTop: 8 }}
              onClick={checkAnswers}
              disabled={!allPlaced}
            >
              ✅ Prüfen!
            </button>
          ) : (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: 16 }}>
                {correctCount === 12 ? '🏆 Perfekt! Alle richtig!' : `✅ ${correctCount}/12 richtig`}
              </div>
              <button className="btn btn--orange" onClick={() => { setGameState(buildState()); setChecked(false); setSelected(null); setConfetti(false); }}>
                🔄 Nochmal
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
