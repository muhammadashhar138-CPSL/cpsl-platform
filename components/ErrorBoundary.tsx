'use client';

import React from 'react';

interface State {
  hasError: boolean;
  error: Error | null;
  info: string;
}

/**
 * Catches runtime render/lifecycle errors anywhere below it and shows the
 * actual error instead of a blank screen. Without this, an uncaught error
 * unmounts the whole React tree — which looks like "everything disappears".
 */
export default class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false, error: null, info: '' };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Surface everything to the console for debugging.
    console.error('🛑 [CPSL ErrorBoundary] caught a render crash:', error);
    console.error('🛑 [CPSL ErrorBoundary] component stack:', info.componentStack);
    this.setState({ info: info.componentStack || '' });
  }

  reset = () => this.setState({ hasError: false, error: null, info: '' });

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div style={{ minHeight: '100vh', background: '#0a0f1a', color: '#e2e8f0', padding: 32, fontFamily: 'ui-monospace, monospace' }}>
        <div style={{ maxWidth: 900, margin: '40px auto', background: '#130606', border: '1px solid #ef4444', borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#ef4444', marginBottom: 8 }}>🛑 A component crashed</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16 }}>
            This is the real error that was blanking the screen. It is now caught and shown instead of disappearing.
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Message</div>
          <pre style={{ background: '#000', padding: 12, borderRadius: 8, overflow: 'auto', color: '#fca5a5', fontSize: 13, whiteSpace: 'pre-wrap' }}>
            {this.state.error?.message || String(this.state.error)}
          </pre>
          {this.state.error?.stack && (
            <>
              <div style={{ fontSize: 14, fontWeight: 700, margin: '14px 0 6px' }}>Stack</div>
              <pre style={{ background: '#000', padding: 12, borderRadius: 8, overflow: 'auto', color: '#fcd34d', fontSize: 11, maxHeight: 200, whiteSpace: 'pre-wrap' }}>
                {this.state.error.stack}
              </pre>
            </>
          )}
          {this.state.info && (
            <>
              <div style={{ fontSize: 14, fontWeight: 700, margin: '14px 0 6px' }}>Component stack</div>
              <pre style={{ background: '#000', padding: 12, borderRadius: 8, overflow: 'auto', color: '#93c5fd', fontSize: 11, maxHeight: 200, whiteSpace: 'pre-wrap' }}>
                {this.state.info}
              </pre>
            </>
          )}
          <button onClick={this.reset} style={{ marginTop: 18, background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 700, cursor: 'pointer' }}>
            ↻ Try to recover
          </button>
        </div>
      </div>
    );
  }
}
