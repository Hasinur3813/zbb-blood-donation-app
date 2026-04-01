"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home, RotateCcw } from "lucide-react";
import { logError } from "@/lib/errorHandler";

interface Props {
  children: ReactNode;
  /** Custom fallback UI — receives the error + a reset handler */
  fallback?: (props: { error: Error; reset: () => void }) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Context label for logging (e.g. "DonorList") */
  context?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });

    logError(error, {
      component: this.props.context ?? "ErrorBoundary",
      action: "componentDidCatch",
      timestamp: new Date().toISOString(),
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    const { hasError, error, errorInfo } = this.state;

    if (hasError) {
      if (this.props.fallback && error) {
        return this.props.fallback({ error, reset: this.handleReset });
      }

      return (
        <ErrorFallback
          error={error}
          errorInfo={errorInfo}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

// ── Error Fallback UI ─────────────────────────────────────────────────────────

interface ErrorFallbackProps {
  error?: Error;
  errorInfo?: ErrorInfo;
  onReset: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorInfo,
  onReset,
}) => {
  // Classify error type for smarter messaging
  const isNetworkError =
    error?.message?.toLowerCase().includes("network") ||
    error?.message?.toLowerCase().includes("fetch");
  const isAuthError =
    error?.message?.toLowerCase().includes("401") ||
    error?.message?.toLowerCase().includes("unauthorized") ||
    error?.message?.toLowerCase().includes("session");

  const title = isAuthError
    ? "Session Expired"
    : isNetworkError
      ? "Connection Problem"
      : "Something Went Wrong";

  const subtitle = isAuthError
    ? "Your session has expired. Please log in again to continue."
    : isNetworkError
      ? "We couldn't reach our servers. Please check your connection and try again."
      : "An unexpected error occurred. Our team has been notified.";

  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleLogin = () => {
    window.location.href = "/login";
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            {/* Subtle pulse ring */}
            <div className="absolute inset-0 rounded-full border-2 border-red-500/20 animate-ping" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-500 text-sm leading-relaxed">{subtitle}</p>
        </div>

        {/* Dev-only error details */}
        {process.env.NODE_ENV === "development" && error && (
          <details className="mb-6 rounded-lg border border-red-200 bg-red-50 overflow-hidden">
            <summary className="cursor-pointer text-xs font-semibold text-red-700 px-4 py-2 select-none hover:bg-red-100 transition-colors">
              ▸ Error Details (Dev Only)
            </summary>
            <div className="px-4 pb-4 pt-2 font-mono text-xs text-red-800 space-y-1">
              <div>
                <span className="text-red-500 font-bold">Name: </span>
                {error.name}
              </div>
              <div>
                <span className="text-red-500 font-bold">Message: </span>
                {error.message}
              </div>
              {errorInfo?.componentStack && (
                <div className="mt-2">
                  <span className="text-red-500 font-bold">Component: </span>
                  <pre className="whitespace-pre-wrap mt-1 text-red-700 overflow-auto max-h-32">
                    {errorInfo.componentStack.trim()}
                  </pre>
                </div>
              )}
            </div>
          </details>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          {isAuthError ? (
            <button
              onClick={handleLogin}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <RotateCcw className="w-4 h-4" />
              Sign In Again
            </button>
          ) : (
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg border border-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Page
            </button>
          )}

          <button
            onClick={handleGoHome}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-gray-500 hover:text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            <Home className="w-4 h-4" />
            Go to Homepage
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          If this problem persists, contact{" "}
          <a
            href="mailto:support@vitalflow.com"
            className="underline hover:text-gray-600 transition-colors"
          >
            support@vitalflow.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default ErrorBoundary;
