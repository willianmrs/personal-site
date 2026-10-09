import { useEffect, useRef, useState } from 'react';

const W = 620;
const H = 470;
const paths = Array.from({ length: 30 }, (_, index) => {
  const y = 25 + index * 14.4;
  const x = 22 + (index * 37 % 74);
  return { x, y, endY: 228 + Math.sin(index * 2.1) * 3,
    d: `M ${x} ${y} C 280 ${y}, 240 228, 600 ${228 + Math.sin(index * 2.1) * 3}` };
});

function point(t: number, x0: number, y0: number, endY: number) {
  const s = 1 - t;
  return {
    x: s ** 3 * x0 + 3 * s ** 2 * t * 280 + 3 * s * t ** 2 * 240 + t ** 3 * 600,
    y: s ** 3 * y0 + 3 * s ** 2 * t * y0 + 3 * s * t ** 2 * 228 + t ** 3 * endY,
  };
}

export function DataFlow() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const syncAnimation = useRef<(() => void) | null>(null);

  const togglePaused = () => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
    syncAnimation.current?.();
  };
  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext('2d');
    if (!element || !context) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let inView = true;
    let elapsed = 0;
    let lastTime: number | undefined;
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      element.width = W * ratio;
      element.height = H * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw();
    };
    const draw = () => {
      context.clearRect(0, 0, W, H);
      for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        for (let j = 0; j < 2; j++) {
          const t = (elapsed / (5800 + i % 5 * 500) + i * .137 + j * .5) % 1;
          const p = point(t, path.x, path.y, path.endY);
          context.beginPath();
          context.arc(p.x, p.y, i % 6 === 0 ? 2.4 : 1.6, 0, Math.PI * 2);
          context.shadowBlur = 9;
          context.shadowColor = '#20d9e9';
          context.fillStyle = i % 6 === 0 ? '#c8faff' : '#20d9e9';
          context.fill();
        }
      }
      context.shadowBlur = 0;
    };
    const paint = (time: number) => {
      if (lastTime !== undefined) elapsed += Math.min(time - lastTime, 100);
      lastTime = time;
      draw();
      if (!pausedRef.current && !motion.matches && inView && !document.hidden) frame = requestAnimationFrame(paint);
    };
    const resume = () => {
      cancelAnimationFrame(frame);
      lastTime = undefined;
      draw();
      if (!pausedRef.current && !motion.matches && inView && !document.hidden) frame = requestAnimationFrame(paint);
    };
    syncAnimation.current = resume;
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; resume(); });
    observer.observe(element);
    resize();
    resume();
    motion.addEventListener('change', resume);
    document.addEventListener('visibilitychange', resume);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      motion.removeEventListener('change', resume);
      document.removeEventListener('visibilitychange', resume);
      window.removeEventListener('resize', resize);
      syncAnimation.current = null;
    };
  }, []);

  return <div className="data-flow">
    <div className="flow-art" aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`}>
        <defs><linearGradient id="flow-gradient"><stop stopColor="#20d9e9" stopOpacity=".12" /><stop offset=".6" stopColor="#20d9e9" stopOpacity=".35" /><stop offset="1" stopColor="#20d9e9" stopOpacity=".7" /></linearGradient></defs>
        <g className="flow-grid" stroke="#53666a" strokeWidth=".6" fill="none">
          {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${110 + i * 85} ${20 + i * 35} V ${450 - i * 35}`} strokeDasharray="2 8" />)}
          <path d="M110 20 570 210M110 450 570 248" />
        </g>
        <g fill="none" stroke="url(#flow-gradient)" strokeWidth=".8">{paths.map((path, i) => <path key={i} d={path.d} />)}</g>
        <g fill="#20d9e9">{paths.map((path, i) => <circle key={i} cx={path.x} cy={path.y} r={i % 4 === 0 ? 2.5 : 1.4} opacity={i % 3 === 0 ? .8 : .4} />)}</g>
        <path d="M430 228h170" stroke="#20d9e9" strokeWidth="1.4" opacity=".5" />
      </svg>
      <canvas ref={canvas} />
    </div>
    <div className="flow-caption"><span>stream <b>→</b> features <b>→</b> prediction</span><button className="motion-toggle" type="button" onClick={togglePaused} aria-label={paused ? 'Play data flow animation' : 'Pause data flow animation'} title={paused ? 'Play animation' : 'Pause animation'} aria-pressed={paused}><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">{paused ? <path d="m7 4 14 8-14 8Z" /> : <><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></>}</svg></button></div>
  </div>;
}
