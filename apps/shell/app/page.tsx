import Link from 'next/link';

import { NAV_ITEMS } from '../lib/navigation';

const learningGoals = [
  'Use this shell as the single entrypoint for the portal.',
  'Mount remote apps here once products, cart, and profile are ready.',
  'Keep host responsibilities focused on layout, navigation, and orchestration.',
];

export default function HomePage() {
  return (
    <div className="stack-xl">
      <section className="hero-grid">
        <div className="panel panel--feature stack-md">
          <p className="panel-eyebrow">Week 2 / Day 9</p>
          <h2>Shell boundary is ready for remote integration.</h2>
          <p className="panel-copy">
            This Next.js shell owns the global layout, top navigation, and route skeleton.
            The business logic for domain features stays in remote apps.
          </p>
          <ul className="checklist">
            {learningGoals.map((goal) => (
              <li key={goal}>{goal}</li>
            ))}
          </ul>
        </div>

        <aside className="panel stack-md">
          <h3 className="panel-subtitle">Planned routes</h3>
          <div className="route-grid">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className="route-card">
                <span className="route-card__label">{item.label}</span>
                <span className="route-card__path">{item.href}</span>
              </Link>
            ))}
          </div>
        </aside>
      </section>

      <section className="panel stack-md">
        <p className="panel-eyebrow">Architecture checkpoint</p>
        <h3 className="panel-subtitle">What belongs in the shell?</h3>
        <div className="two-column-copy">
          <div>
            <h4>Keep in shell</h4>
            <ul className="checklist">
              <li>App-wide layout and navigation</li>
              <li>Top-level route orchestration</li>
              <li>Authentication context handoff</li>
            </ul>
          </div>
          <div>
            <h4>Keep out of shell</h4>
            <ul className="checklist">
              <li>Products business rules</li>
              <li>Cart calculation logic</li>
              <li>Profile-specific data management</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
