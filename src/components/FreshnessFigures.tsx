import { useId, type ReactNode } from 'react';

const styles = `
.prose .freshness-figure { margin: 34px 0; padding: 24px; border: 1px solid var(--line); border-radius: 6px; background: #0d1418; }
.freshness-figure * { box-sizing: border-box; }
.freshness-kicker { display: block; margin-bottom: 18px; font: 10px/1.6 var(--mono); letter-spacing: .09em; text-transform: uppercase; color: var(--cyan); }
.freshness-figure svg { display: block; width: 100%; height: auto; overflow: visible; }
.freshness-figure svg text { font-family: var(--mono); font-size: 12px; fill: #adb5bf; }
.freshness-figure svg .figure-label { fill: #edf0f2; font-size: 13px; }
.freshness-figure svg .figure-accent { fill: var(--cyan); }
.freshness-figure svg .figure-small { font-size: 10px; }
.freshness-figure .timeline-mobile { display: none; max-width: 360px; margin-inline: auto; }
.prose .freshness-figure figcaption { margin-top: 20px; color: var(--muted); font-size: 12px; line-height: 1.75; }
.freshness-snapshots { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.freshness-snapshot { min-width: 0; padding: 20px; border: 1px solid var(--line); border-radius: 4px; }
.freshness-snapshot.current { border-color: #29838c; background: #102126; }
.freshness-snapshot .snapshot-time { display: block; font: 11px/1.8 var(--mono); color: var(--muted); }
.freshness-snapshot .snapshot-value { display: block; margin: 8px 0; font-size: 64px; line-height: 1.1; letter-spacing: -.05em; color: #edf0f2; }
.freshness-snapshot.current .snapshot-value { color: var(--cyan); }
.freshness-snapshot .snapshot-unit { display: block; font-size: 13px; line-height: 1.6; color: #c7cfd7; }
.freshness-events { display: flex; gap: 7px; margin: 18px 0; }
.freshness-event { width: 13px; height: 13px; border-radius: 50%; background: #adb5bf; }
.freshness-event.new { background: var(--cyan); }
.freshness-event.missing { background: transparent; border: 1px dashed #7b8793; }
.freshness-snapshot .snapshot-note { display: block; font: 11px/1.8 var(--mono); color: var(--muted); }
.freshness-snapshot.current .snapshot-note { color: #8edee5; }
.freshness-strategies { display: grid; gap: 12px; }
.freshness-strategy { display: grid; grid-template-columns: 1fr 28px 1.15fr; gap: 14px; align-items: center; padding: 17px; border: 1px solid var(--line); border-radius: 4px; }
.freshness-strategy strong { display: block; font-size: 14px; line-height: 1.6; font-weight: 550; }
.freshness-strategy .strategy-description { display: block; margin-top: 3px; color: var(--muted); font-size: 12px; line-height: 1.7; }
.freshness-strategy .strategy-arrow { color: var(--cyan); font-size: 23px; text-align: center; }
.freshness-strategy .strategy-method { color: var(--cyan); }
@media (max-width: 760px) {
  .freshness-figure .timeline-desktop { display: none; }
  .freshness-figure .timeline-mobile { display: block; }
}
@media (max-width: 600px) {
  .prose .freshness-figure { padding: 19px 16px; }
  .freshness-snapshots { grid-template-columns: 1fr; gap: 12px; }
  .freshness-snapshot { padding: 18px; }
  .freshness-snapshot .snapshot-value { font-size: 54px; }
  .freshness-strategy { grid-template-columns: 1fr; gap: 10px; padding: 16px; }
  .freshness-strategy .strategy-arrow { display: none; }
}
`;

export function FreshnessStyles() {
  return <style>{styles}</style>;
}

function Figure({ number, label, caption, children }: { number: string; label: string; caption: string; children: ReactNode }) {
  return <figure className="freshness-figure">
    <span className="freshness-kicker">{number} / {label}</span>
    {children}
    <figcaption>{caption}</figcaption>
  </figure>;
}

export function SignalTimeline() {
  const id = useId();
  return <Figure number="01" label="The signal has a deadline" caption="Illustrative sequence. The four new transactions can influence the 14:07 decision only if their feature update is available before it.">
    <svg className="timeline-desktop" viewBox="0 0 680 270" role="img" aria-labelledby={`${id}-desktop-title ${id}-desktop-description`}>
      <title id={`${id}-desktop-title`}>A decision between two scheduled feature updates</title>
      <desc id={`${id}-desktop-description`}>The periodic pipeline stores a count of two at 14:04. Four new transactions occur from 14:05 to 14:06:30. A faster update makes a count of six available at 14:06:45, before the decision at 14:07. The next periodic update at 14:09 arrives after that decision.</desc>
      <g aria-hidden="true">
        <rect x="358" y="32" width="95" height="228" rx="5" fill="#20d9e9" fillOpacity=".06" />
        <text x="404" y="19" textAnchor="middle" className="figure-accent">DECISION · 14:07</text>
        <path d="M404 32V260" stroke="#20d9e9" strokeWidth="1" strokeDasharray="3 5" />
        <text x="0" y="69" className="figure-label">Events</text>
        <path d="M104 89H653" stroke="#34444e" />
        {[224, 269, 314, 359].map((x) => <circle key={x} cx={x} cy="89" r="6" fill="#20d9e9" />)}
        <text x="292" y="116" textAnchor="middle">4 transactions · 14:05–14:06:30</text>
        <text x="0" y="154" className="figure-label">Periodic</text>
        <path d="M104 175H653" stroke="#34444e" />
        <circle cx="134" cy="175" r="6" fill="#adb5bf" />
        <circle cx="584" cy="175" r="6" fill="#adb5bf" />
        <text x="134" y="151" textAnchor="middle">14:04</text>
        <text x="134" y="199" textAnchor="middle">count = 2</text>
        <text x="584" y="151" textAnchor="middle">14:09</text>
        <text x="584" y="199" textAnchor="middle">next update</text>
        <text x="0" y="232" className="figure-label">Faster path</text>
        <path d="M104 249H653" stroke="#34444e" />
        <circle cx="381" cy="249" r="6" fill="#20d9e9" />
        <text x="357" y="228" textAnchor="end" className="figure-accent">14:06:45 · count = 6</text>
      </g>
    </svg>
    <svg className="timeline-mobile" viewBox="0 0 320 444" role="img" aria-labelledby={`${id}-mobile-title ${id}-mobile-description`}>
      <title id={`${id}-mobile-title`}>Recent events must arrive before the decision</title>
      <desc id={`${id}-mobile-description`}>Three separate tracks compare events, periodic updates, and a faster update path on a shared timeline. At 14:04 the periodic feature value is two. Four new transactions happen between 14:05 and 14:06:30. The faster path makes six available at 14:06:45. At the 14:07 decision, the periodic path still provides two while the faster path provides six. The next periodic update at 14:09 is too late for that decision.</desc>
      <g aria-hidden="true">
        <text x="48" y="16" textAnchor="middle" className="figure-label">Events</text>
        <text x="160" y="16" textAnchor="middle" className="figure-label">Periodic</text>
        <text x="272" y="16" textAnchor="middle" className="figure-label">Faster path</text>
        <path d="M48 36V94M48 135V193M48 235V284M160 36V40M160 66V81M160 110V300M160 354V367M160 392V410M272 36V220M272 244V260M272 287V300" stroke="#34444e" strokeWidth="2" />
        <text x="160" y="57" textAnchor="middle">14:04</text>
        <circle cx="160" cy="72" r="5" fill="#adb5bf" />
        <text x="160" y="96" textAnchor="middle">count = 2</text>
        <text x="48" y="112" textAnchor="middle">14:05–</text>
        <text x="48" y="128" textAnchor="middle">14:06:30</text>
        {[145, 158, 171, 184].map((y) => <circle key={y} cx="48" cy={y} r="4" fill="#20d9e9" />)}
        <text x="48" y="208" textAnchor="middle" className="figure-small">4 new</text>
        <text x="48" y="223" textAnchor="middle" className="figure-small">transactions</text>
        <text x="272" y="235" textAnchor="middle" className="figure-accent">14:06:45</text>
        <circle cx="272" cy="250" r="5" fill="#20d9e9" />
        <text x="272" y="274" textAnchor="middle" className="figure-accent">count = 6</text>
        <rect x="3" y="300" width="314" height="54" rx="4" fill="#102a30" />
        <text x="160" y="320" textAnchor="middle" className="figure-accent">14:07 · model decision</text>
        <text x="48" y="344" textAnchor="middle" className="figure-small">Available:</text>
        <text x="160" y="344" textAnchor="middle">count = 2</text>
        <text x="272" y="344" textAnchor="middle" className="figure-accent">count = 6</text>
        <text x="160" y="382" textAnchor="middle">14:09</text>
        <circle cx="160" cy="399" r="5" fill="#adb5bf" />
        <text x="160" y="423" textAnchor="middle">next periodic update</text>
        <text x="160" y="440" textAnchor="middle" className="figure-small">After the decision</text>
      </g>
    </svg>
  </Figure>;
}

export function FeatureSnapshots() {
  return <Figure number="02" label="One decision, different information" caption="Illustrative counts for previous transactions in the ten-minute window at 14:07. The two older events remain in the window; the current transaction is excluded. These counts do not imply a fraud classification.">
    <div className="freshness-snapshots">
      <div className="freshness-snapshot">
        <span className="snapshot-time">Last update · 14:04</span>
        <span className="snapshot-value">2</span>
        <span className="snapshot-unit">previous transactions visible</span>
        <div className="freshness-events" aria-hidden="true">{Array.from({ length: 6 }, (_, i) => <span key={i} className={`freshness-event${i > 1 ? ' missing' : ''}`} />)}</div>
        <span className="snapshot-note">4 recent events not yet reflected</span>
      </div>
      <div className="freshness-snapshot current">
        <span className="snapshot-time">Last update · 14:06:45</span>
        <span className="snapshot-value">6</span>
        <span className="snapshot-unit">previous transactions visible</span>
        <div className="freshness-events" aria-hidden="true">{Array.from({ length: 6 }, (_, i) => <span key={i} className={`freshness-event${i > 1 ? ' new' : ''}`} />)}</div>
        <span className="snapshot-note">4 recent events now reflected</span>
      </div>
    </div>
  </Figure>;
}

const strategies = [
  { signal: 'Recent event history', description: 'E.g. transaction velocity', method: 'Streaming updates', detail: 'Maintain values as events arrive' },
  { signal: 'Current request context', description: 'E.g. amount / spending baseline', method: 'Request-time computation', detail: 'Combine the request with stored inputs' },
  { signal: 'Slower-changing signals', description: 'Where longer delays are acceptable', method: 'Periodic batch updates', detail: 'Refresh within the tolerated delay' },
];

export function UpdateStrategies() {
  return <Figure number="03" label="Match the update path to the signal" caption="Conceptual options, rather than fixed rules. One prediction can use all three paths. The appropriate choice depends on freshness requirements, source availability, and cost.">
    <div className="freshness-strategies">{strategies.map((strategy) => <div className="freshness-strategy" key={strategy.method}>
      <div><strong>{strategy.signal}</strong><span className="strategy-description">{strategy.description}</span></div>
      <span className="strategy-arrow" aria-hidden="true">→</span>
      <div><strong className="strategy-method">{strategy.method}</strong><span className="strategy-description">{strategy.detail}</span></div>
    </div>)}</div>
  </Figure>;
}
