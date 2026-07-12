'use client';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@commerce/shared-ui';
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
        <Card className="hf-terminal-border bg-card">
          <CardHeader className="space-y-3">
            <Badge variant="destructive" className="w-fit">
              Shell fallback
            </Badge>
            <CardTitle>{this.props.remoteLabel} failed inside the storefront surface.</CardTitle>
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
              The host shell stays usable even if one integration surface throws. Error message:{' '}
              <code>{this.state.message || 'Unknown runtime error'}</code>
            </p>
          </CardHeader>
          <CardContent>
            <Button variant="dark" onClick={() => this.setState({ hasError: false, message: '' })}>
              Retry surface render
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
