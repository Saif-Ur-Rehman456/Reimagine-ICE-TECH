import React from 'react';

/**
 * ErrorBoundary — catches any render/lifecycle error inside its subtree.
 *
 * Two modes:
 *  1. Global   (default)       — renders a branded full-screen recovery UI.
 *  2. Section  (sectionFallback) — renders a transparent placeholder that
 *     preserves layout height so the rest of the page stays intact.
 *
 * Props:
 *  - children        ReactNode   (required)
 *  - sectionFallback boolean     use the lightweight section fallback
 *  - minHeight       string      e.g. '100vh' (only used with sectionFallback)
 *  - onError         function    optional callback for external error reporting
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Forward to an external error tracking service (e.g. Sentry) if provided.
    if (typeof this.props.onError === 'function') {
      this.props.onError(error, info);
    }
    // Suppress console output in production to avoid leaking stack traces.
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary] Caught error:', error, info.componentStack);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    /* ── Section-level fallback ────────────────────────────────────────── */
    if (this.props.sectionFallback) {
      return (
        <div
          role="alert"
          aria-label="Section failed to load"
          style={{
            minHeight: this.props.minHeight || '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
          }}
        >
          <p
            style={{
              color: 'rgba(248, 250, 252, 0.35)',
              fontFamily: 'system-ui, sans-serif',
              fontSize: '13px',
              margin: 0,
            }}
          >
            This section couldn't be loaded.
          </p>
        </div>
      );
    }

    /* ── Global full-screen fallback ───────────────────────────────────── */
    return (
      <div
        role="alert"
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0D1B2A',
          color: '#F8FAFC',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          gap: '16px',
          padding: '24px',
          textAlign: 'center',
          zIndex: 99999,
        }}
      >
        <span style={{ fontSize: '52px', lineHeight: 1 }} aria-hidden="true">🍦</span>

        <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>
          Something went wrong
        </h1>

        <p
          style={{
            margin: 0,
            opacity: 0.55,
            maxWidth: '380px',
            fontSize: '14px',
            lineHeight: 1.6,
          }}
        >
          We hit an unexpected error. Please refresh the page or try again.
        </p>

        <button
          onClick={this.handleReset}
          style={{
            marginTop: '8px',
            padding: '11px 28px',
            background: '#1c5fdf',
            color: '#fff',
            border: 'none',
            borderRadius: '9999px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          Try again
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
