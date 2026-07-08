import Link from 'next/link';

import {
  authUserChangedEventName,
  authUserChangedPreview,
  mockShellUser,
} from '../lib/auth-contract';
import { NAV_ITEMS } from '../lib/navigation';

const learningGoals = [
  'Use this shell as the single entrypoint for the portal.',
  'Load remotes at runtime while keeping each domain independently runnable.',
  'Keep host responsibilities focused on layout, navigation, and orchestration.',
];

export default function HomePage() {
  return (
    <div className="stack-xl">
      <section className="hero-grid">
        <div className="ui-section panel--feature ui-stack-md">
          <p className="ui-eyebrow">Week 2 / Day 14</p>
          <h2>Shell now composes the domain apps at runtime.</h2>
          <p className="ui-copy">
            This Next.js shell still owns the global layout and top navigation, but the route surfaces now load domain apps from their own runtime origins.
            That lets us keep clear boundaries while proving the host can compose both Next.js and Nuxt remotes.
          </p>
          <ul className="checklist">
            {learningGoals.map((goal) => (
              <li key={goal}>{goal}</li>
            ))}
          </ul>
        </div>

        <aside className="ui-section ui-stack-md">
          <h3 className="panel-subtitle">Available host routes</h3>
          <div className="route-grid">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className="route-card">
                <span className="route-card__label">{item.label}</span>
                <span className="route-card__path">{item.href}</span>
              </Link>
            ))}
          </div>
          <p className="ui-copy route-note">
            Try <Link href="/profile/security">/profile/security</Link> to confirm a Nuxt remote route can still be reached through the shell.
          </p>
        </aside>
      </section>

      <section className="ui-section ui-stack-md">
        <p className="ui-eyebrow">Architecture checkpoint</p>
        <h3 className="panel-subtitle">What the host now proves</h3>
        <div className="two-column-copy">
          <div>
            <h4>Working today</h4>
            <ul className="checklist">
              <li>Single user entrypoint through the shell</li>
              <li>Runtime route composition for products, cart, and profile</li>
              <li>Cross-framework integration with a Nuxt remote</li>
            </ul>
          </div>
          <div>
            <h4>Still coming next</h4>
            <ul className="checklist">
              <li>Typed event flow between products and cart</li>
              <li>Error isolation and explicit fallback states</li>
              <li>More advanced lazy loading and observability</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="ui-section ui-stack-md">
        <p className="ui-eyebrow">Day 15 / Shared auth contract</p>
        <h3 className="panel-subtitle">The shell shares a small typed auth boundary.</h3>
        <div className="two-column-copy">
          <div className="ui-card ui-stack-sm">
            <p className="ui-copy">Current shell user: {mockShellUser.name}</p>
            <p className="ui-copy">email: {mockShellUser.email}</p>
            <p className="ui-copy">role: {mockShellUser.role}</p>
          </div>
          <div className="ui-card ui-stack-sm">
            <p className="ui-copy">
              Event name: <code>{authUserChangedEventName}</code>
            </p>
            <p className="ui-copy">userId: {authUserChangedPreview.userId}</p>
          </div>
        </div>
      </section>
    </div>
  );
}