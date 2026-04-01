"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { AlertTriangle, X, Info, CheckCircle, Wifi, Lock, ShieldOff, Clock } from "lucide-react";
import {
  AppError,
  ErrorContext,
  BloodDonationError,
  logError,
  getUserFriendlyMessage,
  createAppError,
} from "@/lib/errorHandler";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ToastType = "error" | "warning" | "info" | "success";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  /** Optional sub-label shown below message (e.g. error code, component) */
  detail?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration: number;
  createdAt: number;
}

interface ErrorToastContextType {
  showError: (error: AppError | Error | unknown, context?: ErrorContext) => void;
  showWarning: (message: string, options?: ToastOptions) => void;
  showInfo: (message: string, options?: ToastOptions) => void;
  showSuccess: (message: string, options?: ToastOptions) => void;
  clearToast: (id: string) => void;
  clearAll: () => void;
}

interface ToastOptions {
  detail?: string;
  action?: { label: string; onClick: () => void };
  duration?: number;
}

// ── Context ───────────────────────────────────────────────────────────────────

const ErrorToastContext = createContext<ErrorToastContextType | null>(null);

export const useErrorToast = () => {
  const context = useContext(ErrorToastContext);
  if (!context) {
    throw new Error("useErrorToast must be used within an ErrorToastProvider");
  }
  return context;
};

// ── Provider ──────────────────────────────────────────────────────────────────

interface ErrorToastProviderProps {
  children: ReactNode;
  /** Max number of toasts shown simultaneously (default: 4) */
  maxToasts?: number;
}

export const ErrorToastProvider: React.FC<ErrorToastProviderProps> = ({
  children,
  maxToasts = 4,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (toast: Omit<Toast, "id" | "createdAt">) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newToast: Toast = { ...toast, id, createdAt: Date.now() };

      setToasts((prev) => {
        // Deduplicate: if same message + type already visible, skip
        const isDuplicate = prev.some(
          (t) => t.message === toast.message && t.type === toast.type
        );
        if (isDuplicate) return prev;

        // Enforce max toast limit (drop oldest)
        const trimmed = prev.length >= maxToasts ? prev.slice(1) : prev;
        return [...trimmed, newToast];
      });

      // Auto-dismiss
      if (toast.duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, toast.duration);
      }

      return id;
    },
    [maxToasts]
  );

  const showError = useCallback(
    (error: AppError | Error | unknown, context?: ErrorContext) => {
      logError(error, context);

      const appError = createAppError(error);
      const message = getUserFriendlyMessage(appError);

      // Surface the error code as a detail label for extra context
      let detail: string | undefined;
      if (appError instanceof BloodDonationError && appError.statusCode) {
        detail =
          appError.statusCode > 0
            ? `Status ${appError.statusCode}`
            : undefined;
      }
      if (context?.component) {
        detail = detail
          ? `${detail} · ${context.component}`
          : context.component;
      }

      addToast({ message, type: "error", detail, duration: 7000 });
    },
    [addToast]
  );

  const showWarning = useCallback(
    (message: string, options: ToastOptions = {}) => {
      addToast({
        message,
        type: "warning",
        detail: options.detail,
        action: options.action,
        duration: options.duration ?? 5000,
      });
    },
    [addToast]
  );

  const showInfo = useCallback(
    (message: string, options: ToastOptions = {}) => {
      addToast({
        message,
        type: "info",
        detail: options.detail,
        action: options.action,
        duration: options.duration ?? 4000,
      });
    },
    [addToast]
  );

  const showSuccess = useCallback(
    (message: string, options: ToastOptions = {}) => {
      addToast({
        message,
        type: "success",
        detail: options.detail,
        action: options.action,
        duration: options.duration ?? 3500,
      });
    },
    [addToast]
  );

  const clearToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ErrorToastContext.Provider
      value={{ showError, showWarning, showInfo, showSuccess, clearToast, clearAll }}
    >
      {children}
      <ToastContainer toasts={toasts} onClear={clearToast} />
    </ErrorToastContext.Provider>
  );
};

// ── Toast Container ───────────────────────────────────────────────────────────

interface ToastContainerProps {
  toasts: Toast[];
  onClear: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClear }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-sm pointer-events-none"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClear={onClear} />
      ))}
    </div>
  );
};

// ── Toast Item ────────────────────────────────────────────────────────────────

interface ToastItemProps {
  toast: Toast;
  onClear: (id: string) => void;
}

const TOAST_ICONS: Record<ToastType, React.FC<{ className?: string }>> = {
  error: AlertTriangle,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle,
};

// Smart icon based on error code
function getSmartIcon(toast: Toast) {
  if (toast.detail?.includes("401") || toast.detail?.includes("Auth")) {
    return <Lock className="w-5 h-5 shrink-0" />;
  }
  if (toast.detail?.includes("403") || toast.detail?.includes("Shield")) {
    return <ShieldOff className="w-5 h-5 shrink-0" />;
  }
  if (
    toast.detail?.includes("408") ||
    toast.detail?.includes("timeout") ||
    toast.detail?.toLowerCase().includes("network")
  ) {
    return <Wifi className="w-5 h-5 shrink-0" />;
  }
  if (toast.detail?.includes("429")) {
    return <Clock className="w-5 h-5 shrink-0" />;
  }

  const Icon = TOAST_ICONS[toast.type];
  return <Icon className="w-5 h-5 shrink-0" />;
}

const TOAST_STYLES: Record<
  ToastType,
  {
    container: string;
    iconColor: string;
    title: string;
    detail: string;
    progress: string;
    button: string;
  }
> = {
  error: {
    container:
      "bg-red-950/95 border border-red-700/60 shadow-xl shadow-red-900/30",
    iconColor: "text-red-400",
    title: "text-red-100",
    detail: "text-red-400/80",
    progress: "bg-red-500",
    button: "text-red-400 hover:text-red-200",
  },
  warning: {
    container:
      "bg-amber-950/95 border border-amber-600/60 shadow-xl shadow-amber-900/30",
    iconColor: "text-amber-400",
    title: "text-amber-100",
    detail: "text-amber-400/80",
    progress: "bg-amber-500",
    button: "text-amber-400 hover:text-amber-200",
  },
  info: {
    container:
      "bg-blue-950/95 border border-blue-600/60 shadow-xl shadow-blue-900/30",
    iconColor: "text-blue-400",
    title: "text-blue-100",
    detail: "text-blue-400/80",
    progress: "bg-blue-500",
    button: "text-blue-400 hover:text-blue-200",
  },
  success: {
    container:
      "bg-emerald-950/95 border border-emerald-600/60 shadow-xl shadow-emerald-900/30",
    iconColor: "text-emerald-400",
    title: "text-emerald-100",
    detail: "text-emerald-400/80",
    progress: "bg-emerald-500",
    button: "text-emerald-400 hover:text-emerald-200",
  },
};

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClear }) => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const styles = TOAST_STYLES[toast.type];

  // Mount animation
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 16);
    return () => clearTimeout(t);
  }, []);

  // Progress bar countdown
  useEffect(() => {
    if (toast.duration <= 0) return;

    const startTime = Date.now();
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / toast.duration) * 100);
      setProgress(remaining);
      if (remaining === 0 && progressRef.current) {
        clearInterval(progressRef.current);
      }
    }, 50);

    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [toast.duration]);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => onClear(toast.id), 300);
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="pointer-events-auto"
      style={{
        transform: visible ? "translateX(0)" : "translateX(calc(100% + 1rem))",
        opacity: visible ? 1 : 0,
        transition: "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease",
      }}
    >
      <div className={`rounded-xl overflow-hidden ${styles.container} backdrop-blur-sm`}>
        {/* Progress bar */}
        {toast.duration > 0 && (
          <div className="h-0.5 w-full bg-white/10">
            <div
              className={`h-full ${styles.progress} transition-all duration-100 ease-linear`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="flex items-start gap-3 p-4">
          {/* Icon */}
          <div className={`mt-0.5 ${styles.iconColor}`}>
            {getSmartIcon(toast)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium leading-snug ${styles.title}`}>
              {toast.message}
            </p>

            {toast.detail && (
              <p className={`mt-0.5 text-xs font-mono ${styles.detail}`}>
                {toast.detail}
              </p>
            )}

            {toast.action && (
              <button
                onClick={() => {
                  toast.action!.onClick();
                  handleDismiss();
                }}
                className={`mt-2 text-xs font-semibold underline underline-offset-2 ${styles.button} transition-colors`}
              >
                {toast.action.label}
              </button>
            )}
          </div>

          {/* Close */}
          <button
            onClick={handleDismiss}
            aria-label="Dismiss notification"
            className={`${styles.button} transition-colors rounded p-0.5 focus:outline-none focus:ring-2 focus:ring-white/30`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Convenience hook alias ────────────────────────────────────────────────────

/** Backward-compat alias — prefer useErrorToast directly. */
export { useErrorToast as useToast };
