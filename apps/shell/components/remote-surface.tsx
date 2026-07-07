'use client';

import { useEffect, useState } from 'react';

type RemoteSurfaceProps = {
  title: string;
  description: string;
  framework: string;
  origin: string;
  routeLabel: string;
  src: string;
  devCommand: string;
};

export function RemoteSurface({
  title,
  description,
  framework,
  origin,
  routeLabel,
  src,
  devCommand,
}: RemoteSurfaceProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, [src]);

  return (
    <section className="ui-section remote-surface ui-stack-md">
      <div className="remote-toolbar">
        <div className="ui-stack-sm">
          <p className="ui-eyebrow">Runtime composition surface</p>
          <h3>{title}</h3>
          <p className="ui-copy">{description}</p>
        </div>

        <div className="remote-actions">
          <a className="ui-button ui-button--ghost" href={origin} target="_blank" rel="noreferrer">
            Open standalone app
          </a>
          <a className="ui-button ui-button--primary" href={src} target="_blank" rel="noreferrer">
            Open current remote route
          </a>
        </div>
      </div>

      <div className="remote-facts">
        <span className="remote-pill">{framework}</span>
        <span className="remote-pill">{routeLabel}</span>
        <span className="remote-pill">{origin}</span>
      </div>

      <div className="remote-frame-shell">
        {!isLoaded ? (
          <div className="remote-frame-shell__loading">
            <p>Loading remote app from its own runtime origin...</p>
          </div>
        ) : null}

        <iframe
          key={src}
          title={title}
          src={src}
          className={isLoaded ? 'remote-frame remote-frame--visible' : 'remote-frame'}
          onLoad={() => setIsLoaded(true)}
        />
      </div>

      <p className="remote-helper">
        The shell keeps navigation and layout outside the frame. If this panel stays blank, start the remote with <code>{devCommand}</code>.
      </p>
    </section>
  );
}