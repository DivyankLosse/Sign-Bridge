import React from 'react';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-surface p-6 text-center">
          <div className="glass-panel p-10 rounded-3xl border border-white/10 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4 italic tracking-tight">Something went wrong</h2>
            <p className="text-on-surface-variant/70 mb-8 max-w-sm">
                A rendering error occurred. Please return to the dashboard and try again.
            </p>
            <button 
                onClick={() => window.location.href = '/dashboard'}
                className="px-8 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-full transition-all shadow-lg"
            >
                Return to Dashboard
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
