import Link from 'next/link';

import {
  authUserChangedEventName,
  authUserChangedPreview,
  mockShellUser,
} from '../lib/auth-contract';
import { NAV_ITEMS } from '../lib/navigation';

const learningGoals = [
  'Products emits a typed contract instead of calling cart directly.',
  'The shell receives the event and keeps shared cart state at the host boundary.',
  'The cart route lazy loads and then hydrates from shell-owned state.',
];

export default function HomePage() {
  return (
    <div className="stack-xl">
      <section className="hero-grid">
        <div className="ui-section panel--feature ui-stack-md">
          <p className="ui-eyebrow">Week 3 / Days 16-18</p>
          <h2>Cross-app events, lazy loading, and shell resilience are now in place.</h2>
          <p className="ui-copy">
            The host is no longer only a route orchestrator. It now acts as an event hub for typed communication, defers remote loading until it is useful, and keeps the overall portal usable when a remote surface is slow or broken.
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
            Try <Link href="/products">/products</Link>, add an item, then open <Link href="/cart">/cart</Link> to see shell-mediated sync. For the Nuxt remote, <Link href="/profile/security">/profile/security</Link> still deep-links through the host.
          </p>
        </aside>
      </section>

      <section className="ui-section ui-stack-md">
        <p className="ui-eyebrow">Event flow checkpoint</p>
        <h3 className="panel-subtitle">How data moves without remote-to-remote imports</h3>
        <div className="two-column-copy">
          <div>
            <h4>Products path</h4>
            <ul className="checklist">
              <li>Products builds a typed <code>cart:item-added</code> payload</li>
              <li>The iframe posts that envelope to the shell</li>
              <li>The shell updates host-owned cart state and top-nav badge</li>
            </ul>
          </div>
          <div>
            <h4>Cart path</h4>
            <ul className="checklist">
              <li>Cart never imports products business code</li>
              <li>Cart receives a shell sync message with cart snapshot data</li>
              <li>The cart view re-renders from shared contract payloads only</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="ui-section ui-stack-md">
        <p className="ui-eyebrow">Shared auth contract</p>
        <h3 className="panel-subtitle">The shell still owns a small typed auth boundary.</h3>
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