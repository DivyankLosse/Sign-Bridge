import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-6 text-center">
          <div className="glass-panel p-10 max-w-lg rounded-3xl border border-danger/20 shadow-2xl shadow-danger/10">
            <div className="w-20 h-20 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl text-danger font-bold">error</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4 italic tracking-tight">Something went wrong</h2>
            <p className="text-on-surface-variant/70 mb-8 leading-relaxed">
              Sign Bridge encountered a rendering error. This usually happens if a component fails to load or the API returns unexpected data.
            </p>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-medium transition-all"
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
