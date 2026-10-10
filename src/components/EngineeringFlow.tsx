import { useEffect, useId, useRef, useState } from 'react';

function geometry(compact: boolean) {
  return compact
    ? { width: 390, height: 260, merge: 144, queue: 159, cell: 6, gap: 8, gate: 237, end: 366, center: 126 }
    : { width: 760, height: 260, merge: 282, queue: 302, cell: 12, gap: 18, gate: 462, end: 736, center: 126 };
}

function streamPoint(t: number, row: number, compact: boolean) {
  const g = geometry(compact);
  const y = 62 + row * 9;
  const s = 1 - t;
  return {
    x: s ** 3 * 24 + 3 * s ** 2 * t * g.merge * .6 + 3 * s * t ** 2 * g.merge * .72 + t ** 3 * g.merge,
    y: s ** 3 * y + 3 * s ** 2 * t * y + (3 * s * t ** 2 + t ** 3) * g.center,
  };
}

function Scene({ compact, titleId }: { compact: boolean; titleId: string }) {
  const g = geometry(compact);
  return <svg className={compact ? 'engineering-scene mobile-scene' : 'engineering-scene desktop-scene'} viewBox={`0 0 ${g.width} ${g.height}`} role="img" aria-labelledby={`${titleId}-title ${titleId}-description`}>
    <title id={`${titleId}-title`}>Code generation, verification, and delivery</title>
    <desc id={`${titleId}-description`}>Many code changes converge into a queue before a verification checkpoint. A smaller number of validated changes move toward delivery. This illustrates a possible bottleneck, not measured research data.</desc>
    <g aria-hidden="true">
      <g className="engineering-grid" stroke="currentColor" strokeWidth=".6" strokeDasharray="1 7">
        {[1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${g.width * i / 6} 48V207`} />)}
        <path d={`M24 126H${g.end}`} />
      </g>
      <g className="engineering-streams" fill="none" stroke="currentColor" strokeWidth=".8">
        {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M24 ${62 + i * 9} C${g.merge * .6} ${62 + i * 9}, ${g.merge * .72} ${g.center}, ${g.merge} ${g.center}`} />)}
        <path d={`M${g.merge} ${g.center}H${g.gate - 17}`} />
        {[-1, 0, 1].map((i) => <path key={i} d={`M${g.gate + 18} ${g.center}C${g.gate + 65} ${g.center}, ${g.end - 60} ${g.center + i * 34}, ${g.end} ${g.center + i * 34}`} />)}
      </g>
      <g fill="currentColor">
        {Array.from({ length: 16 }, (_, i) => <circle key={i} cx="24" cy={62 + i * 9} r={i % 4 === 0 ? 2 : 1.4} opacity={i % 4 === 0 ? '.7' : '.3'} />)}
        {[-1, 0, 1].map((i) => <circle key={i} cx={g.end} cy={g.center + i * 34} r="2.5" opacity=".8" />)}
      </g>
      <g className="engineering-queue" stroke="currentColor" strokeWidth=".8">
        {Array.from({ length: 21 }, (_, i) => <rect key={i} x={g.queue + i % 7 * g.gap} y={g.center - g.gap + Math.floor(i / 7) * g.gap - g.cell / 2} width={g.cell} height={g.cell} rx="2" fill="currentColor" fillOpacity={.08 + i % 4 * .035} />)}
      </g>
      <rect x={g.gate - 16} y="62" width="32" height="128" rx="7" fill="#0d171b" stroke="currentColor" strokeOpacity=".7" />
      <path d={`m${g.gate - 7} ${g.center} 5 5 9-11`} fill="none" stroke="#d4faff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <g className="engineering-labels" fill="currentColor">
        <text x="24" y="28">GENERATE</text>
        <text x={g.gate} y="28" textAnchor="middle">VERIFY</text>
        <text x={g.end} y="28" textAnchor="end">SHIP</text>
      </g>
      <g className="engineering-notes" fill="currentColor">
        <text x={g.queue + 3 * g.gap + g.cell / 2} y="223" textAnchor="middle">changes waiting</text>
        {!compact && <><text x="24" y="223">incoming code changes</text><text x={g.end} y="223" textAnchor="end">validated changes</text></>}
      </g>
    </g>
  </svg>;
}

export function EngineeringFlow() {
  const id = useId();
  const canvas = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const syncAnimation = useRef<(() => void) | null>(null);

  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext('2d');
    if (!element || !context) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const layout = window.matchMedia('(max-width: 760px)');
    let frame = 0;
    let inView = false;
    let elapsed = 0;
    let lastTime: number | undefined;
    const draw = () => {
      const g = geometry(layout.matches);
      context.clearRect(0, 0, g.width, g.height);
      context.fillStyle = '#63e4ef';
      for (let i = 0; i < 16; i++) {
        const p = streamPoint((elapsed / 4200 + i * .173) % 1, i, layout.matches);
        context.beginPath();
        context.arc(p.x, p.y, i % 4 === 0 ? 2.2 : 1.6, 0, Math.PI * 2);
        context.fill();
      }
      context.fillStyle = '#dbfaff';
      for (let i = -1; i <= 1; i++) {
        const t = (elapsed / 7200 + (i + 1) * .333) % 1;
        const s = 1 - t;
        const x = s ** 3 * (g.gate + 18) + 3 * s ** 2 * t * (g.gate + 65) + 3 * s * t ** 2 * (g.end - 60) + t ** 3 * g.end;
        const y = (s ** 3 + 3 * s ** 2 * t) * g.center + (3 * s * t ** 2 + t ** 3) * (g.center + i * 34);
        context.beginPath();
        context.arc(x, y, 2.4, 0, Math.PI * 2);
        context.fill();
      }
    };
    const paint = (time: number) => {
      if (lastTime !== undefined) elapsed += Math.min(time - lastTime, 100);
      lastTime = time;
      draw();
      frame = requestAnimationFrame(paint);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      lastTime = undefined;
      draw();
      if (!pausedRef.current && !motion.matches && inView && !document.hidden) frame = requestAnimationFrame(paint);
    };
    const resize = () => {
      const g = geometry(layout.matches);
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      element.width = g.width * ratio;
      element.height = g.height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      sync();
    };
    syncAnimation.current = sync;
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); });
    observer.observe(element);
    resize();
    motion.addEventListener('change', sync);
    layout.addEventListener('change', resize);
    document.addEventListener('visibilitychange', sync);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      motion.removeEventListener('change', sync);
      layout.removeEventListener('change', resize);
      document.removeEventListener('visibilitychange', sync);
      syncAnimation.current = null;
    };
  }, []);

  const togglePaused = () => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
    syncAnimation.current?.();
  };

  return <figure className="engineering-flow">
    <div className="engineering-flow-art">
      <Scene compact={false} titleId={`${id}-desktop`} />
      <Scene compact titleId={`${id}-mobile`} />
      <canvas ref={canvas} aria-hidden="true" />
    </div>
    <figcaption><div><span className="engineering-model-label">A conceptual model</span><p>Faster implementation can move the bottleneck to verification.</p></div>
      <button className="motion-toggle" type="button" onClick={togglePaused} aria-label={paused ? 'Play engineering flow animation' : 'Pause engineering flow animation'} title={paused ? 'Play animation' : 'Pause animation'} aria-pressed={paused}><svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">{paused ? <path d="m7 4 14 8-14 8Z" /> : <><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></>}</svg></button>
    </figcaption>
  </figure>;
}
