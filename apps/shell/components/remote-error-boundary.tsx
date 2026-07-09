'use client';

import { Component, type ReactNode } from 'react';

type RemoteErrorBoundaryProps = {
  children: ReactNode;
  remoteLabel: string;
  resetKey: string;
};

type RemoteErrorBoundaryState = {
  hasError: boolean;
  message: string;
};

export class RemoteErrorBoundary extends Component<
  RemoteErrorBoundaryProps,
  RemoteErrorBoundaryState
> {
  state: RemoteErrorBoundaryState = {
    hasError: false,
    message: '',
  };

  static getDerivedStateFromError(error: Error): RemoteErrorBoundaryState {
    return {
      hasError: true,
      message: error.message,
    };
  }

  componentDidUpdate(previousProps: RemoteErrorBoundaryProps) {
    if (previousProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({
        hasError: false,
        message: '',
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="ui-section remote-boundary-fallback ui-stack-md">
          <div>
            <p className="ui-eyebrow">Day 18 / Shell error boundary</p>
            <h3>{this.props.remoteLabel} failed inside the shell surface.</h3>
          </div>
          <p className="ui-copy">
            The shell stays usable even if one integration surface throws. Error message: <code>{this.state.message || 'Unknown runtime error'}</code>
          </p>
          <button
            type="button"
            className="ui-button ui-button--primary"
            onClick={() => this.setState({ hasError: false, message: '' })}
          >
            Retry surface render
          </button>
        </section>
      );
    }

    return this.props.children;
  }
}