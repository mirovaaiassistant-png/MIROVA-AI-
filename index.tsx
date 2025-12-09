import React, { Component, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Simple Error Boundary to prevent white screen of death
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Critical System Failure:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000',
          color: '#ef4444',
          fontFamily: 'Orbitron, sans-serif'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>SYSTEM MALFUNCTION</h2>
          <pre style={{ 
            fontSize: '0.8rem', 
            background: '#111', 
            padding: '1rem', 
            borderRadius: '0.5rem',
            maxWidth: '80%',
            overflow: 'auto'
          }}>
            {this.state.error?.toString() || "Unknown Error"}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '2rem',
              padding: '0.8rem 2rem',
              background: '#22d3ee',
              color: '#000',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            REBOOT CORE
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
const fallbackLoader = document.getElementById('fallback-loader');

if (!rootElement) {
  console.error("Critical Failure: Root element not found.");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
    
    // Smoothly remove loader once React initializes
    if (fallbackLoader) {
      // Small delay to ensure first frame renders
      setTimeout(() => {
        fallbackLoader.classList.add('hidden');
        // Fully remove from layout after fade
        setTimeout(() => {
            fallbackLoader.style.display = 'none';
        }, 500);
      }, 600);
    }
  } catch (error) {
    console.error("Runtime Exception during hydration:", error);
    // Force visibility of root for error display if needed
    if (fallbackLoader) {
        fallbackLoader.innerHTML = '<div style="color:red; text-align:center; padding:20px; font-family:monospace;">FATAL INIT ERROR<br/>Check Console</div>';
    }
  }
}