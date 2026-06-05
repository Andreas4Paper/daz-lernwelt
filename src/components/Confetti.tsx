import { useEffect, useRef } from 'react';

interface Props { active: boolean; duration?: number; }

interface Piece {
  x: number; y: number; vx: number; vy: number;
  r: number; hue: number; rot: number; dr: number; shape: 'r' | 'c';
}

export default function Confetti({ active, duration = 3000 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d')!;

    const pieces: Piece[] = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width,
      y: -(Math.random() * 100 + 10),
      vx: (Math.random() - .5) * 3,
      vy: Math.random() * 4 + 2,
      r: Math.random() * 9 + 4,
      hue: Math.random() * 360,
      rot: Math.random() * 360,
      dr: (Math.random() - .5) * 8,
      shape: Math.random() < .5 ? 'r' : 'c',
    }));

    function loop() {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      for (const p of pieces) {
        p.x += p.vx; p.y += p.vy; p.rot += p.dr;
        if (p.y > canvas!.height + 20) { p.y = -20; p.x = Math.random() * canvas!.width; }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * Math.PI / 180);
        ctx.fillStyle = `hsl(${p.hue},90%,60%)`;
        if (p.shape === 'r') ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2);
        else { ctx.beginPath(); ctx.arc(0, 0, p.r / 2, 0, Math.PI * 2); ctx.fill(); }
        ctx.restore();
      }
      rafRef.current = requestAnimationFrame(loop);
    }

    loop();
    timerRef.current = setTimeout(() => {
      cancelAnimationFrame(rafRef.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, duration);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(timerRef.current);
    };
  }, [active, duration]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}
    />
  );
}
