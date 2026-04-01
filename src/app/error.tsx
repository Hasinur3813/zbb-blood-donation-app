"use client";

import { useEffect } from "react";
import { AlertTriangle, Home, RefreshCw, Mail } from "lucide-react";
import { useErrorToast } from "@/components/ErrorToast/ErrorToastProvider";
import { logError } from "@/lib/errorHandler";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { showError } = useErrorToast();

  useEffect(() => {
    // Log the error to an error reporting service
    logError(error, {
      component: "GlobalErrorPage",
      action: "render",
      timestamp: new Date().toISOString(),
    });

    // Show error toast
    showError(error, {
      component: "GlobalErrorPage",
      action: "render",
    });
  }, [error, showError]);

  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleContactSupport = () => {
    window.location.href =
      "mailto:support@vitalflow.com?subject=Error Report&body=" +
      encodeURIComponent(
        `Error: ${error.name}\nMessage: ${error.message}\nDigest: ${error.digest || "N/A"}\nTimestamp: ${new Date().toISOString()}`,
      );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 rounded-full p-4">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Application Error
        </h1>

        <p className="text-gray-600 mb-6">
          We're sorry, but something went wrong with the application. Our team
          has been notified and is working to fix this issue.
        </p>

        {process.env.NODE_ENV === "development" && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2 hover:text-gray-900">
              Error Details (Development Only)
            </summary>
            <div className="bg-gray-100 rounded p-4 text-xs font-mono text-gray-800 overflow-auto max-h-48">
              <div className="mb-2">
                <strong>Name:</strong> {error.name}
              </div>
              <div className="mb-2">
                <strong>Message:</strong> {error.message}
              </div>
              {error.digest && (
                <div className="mb-2">
                  <strong>Digest:</strong> {error.digest}
                </div>
              )}
              {error.stack && (
                <div>
                  <strong>Stack Trace:</strong>
                  <pre className="whitespace-pre-wrap mt-1">{error.stack}</pre>
                </div>
              )}
            </div>
          </details>
        )}

        <div className="space-y-3 mb-6">
          <button
            onClick={reset}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>

          <button
            onClick={handleGoHome}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
          >
            <Home className="w-5 h-5" />
            Go to Homepage
          </button>

          <button
            onClick={handleContactSupport}
            className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
          >
            <Mail className="w-5 h-5" />
            Contact Support
          </button>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm text-gray-500 mb-2">
            Error Reference:{" "}
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
              {error.digest || "N/A"}
            </span>
          </p>
          <p className="text-xs text-gray-400">
            If this problem persists, please contact our support team with the
            error reference above.
          </p>
        </div>
      </div>
    </div>
  );
}
