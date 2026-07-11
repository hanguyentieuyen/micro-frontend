import Link from 'next/link';

import {
  authUserChangedEventName,
  authUserChangedPreview,
  mockShellUser,
} from '../lib/auth-contract';
import { NAV_ITEMS } from '../lib/navigation';

const learningGoals = [
  'Day 19: the shell can simulate a cart remote outage and still keep the portal usable.',
  'Day 20: products and cart keep domain-specific styles inside CSS Modules rather than broad global selectors.',
  'Day 21: the repository now documents boundaries clearly and includes a direct import boundary check.',
];

export default function HomePage() {
  return (
    <div className="stack-xl">
      <section className="hero-grid">
        <div className="ui-section panel--feature ui-stack-md">
          <p className="ui-eyebrow">Week 3 / Days 19-21</p>
          <h2>Failure drills, stronger style boundaries, and architecture rules are now part of the host story.</h2>
          <p className="ui-copy">
            The shell is now more than a route orchestrator. It can demonstrate cart remote failure without manual server shutdown, preserve style boundaries with stricter domain scoping, and make the app-to-app communication rules explicit in both code and documentation.
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
            Healthy flow: <Link href="/products">/products</Link>{' -> '}add an item{' -> '}<Link href="/cart">/cart</Link>. Failure drill: <Link href="/cart?simulate=cart-outage">/cart?simulate=cart-outage</Link>. Nuxt deep link: <Link href="/profile/security">/profile/security</Link>.
          </p>
        </aside>
      </section>

      <section className="ui-section ui-stack-md">
        <p className="ui-eyebrow">Day 19 / Outage drill</p>
        <h3 className="panel-subtitle">The host can prove its fallback behavior without stopping the cart server by hand.</h3>
        <div className="two-column-copy">
          <div>
            <h4>Healthy route</h4>
            <ul className="checklist">
              <li><Link href="/cart">/cart</Link> loads the real cart remote</li>
              <li>The shell syncs cart state through <code>shell:cart-state-sync</code></li>
              <li>The standalone cart remote still works on its own origin</li>
            </ul>
          </div>
          <div>
            <h4>Simulated failure</h4>
            <ul className="checklist">
              <li><Link href="/cart?simulate=cart-outage">/cart?simulate=cart-outage</Link> points the iframe to an unavailable origin</li>
              <li>The shell times out, logs the failure, and shows fallback UI</li>
              <li>The rest of the portal remains usable</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="ui-section ui-stack-md">
        <p className="ui-eyebrow">Day 20 / Style isolation</p>
        <h3 className="panel-subtitle">Shared tokens stay global, but domain-specific layout classes are now scoped.</h3>
        <div className="two-column-copy">
          <div className="ui-card ui-stack-sm">
            <p className="ui-copy">Shared layer: <code>@commerce/shared-ui</code> still owns design tokens and primitive classes.</p>
            <p className="ui-copy">Runtime layer: `iframe` composition already gives a hard style boundary between remotes.</p>
          </div>
          <div className="ui-card ui-stack-sm">
            <p className="ui-copy">Domain layer: `products` and `cart` now keep page-specific classes inside CSS Modules.</p>
            <p className="ui-copy">That lowers the risk if one remote is later rendered without an iframe or if selectors grow more generic over time.</p>
          </div>
        </div>
      </section>

      <section className="ui-section ui-stack-md">
        <p className="ui-eyebrow">Day 21 / Boundaries</p>
        <h3 className="panel-subtitle">The shell still owns a small typed auth boundary and the repo now checks direct imports.</h3>
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
            <p className="ui-copy">Workspace rule check: <code>npm run check:boundaries</code></p>
          </div>
        </div>
      </section>
    </div>
  );
}