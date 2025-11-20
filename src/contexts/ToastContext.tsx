'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

type tratativaErro = {
  msg: string
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (message: string, type: ToastType, duration?: number) => void
  removeToast: (id: string) => void
  toast: {
    success: (message: string, duration?: number) => void
    error: (message: string, duration?: number) => void
    warning: (message: string, duration?: number) => void
    info: (message: string, duration?: number) => void
  }
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)
const DEFAULT_TOAST_DURATION = 3000 // 3 segundos
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  // Memoizando a função removeToast
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  // Memoizando a função addToast
  const addToast = useCallback(
    (message: string, type: ToastType, duration?: number) => {
      const id = Math.random().toString(36).substring(2, 9)
      const toastDuration = duration ?? DEFAULT_TOAST_DURATION

      setToasts((prev) => [
        ...prev,
        { id, message, type, duration: toastDuration },
      ])

      if (toastDuration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, toastDuration)
      }
    },
    [removeToast]
  )

  // Criando o objeto toast com métodos específicos
  const toast = React.useMemo(
    () => ({
      success: (message: string, duration?: number) =>
        addToast(message, 'success', duration),
      error: (message: string, duration?: number) =>
        addToast(message, 'error', duration),
      warning: (message: string, duration?: number) =>
        addToast(message, 'warning', duration),
      info: (message: string, duration?: number) =>
        addToast(message, 'info', duration),
    }),
    [addToast]
  )

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, toast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

const ToastContainer = () => {
  const { toasts, removeToast } = useContext(ToastContext)!

  if (!toasts.length) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </div>
  )
}

const Toast = ({
  toast,
  onDismiss,
}: {
  toast: Toast
  onDismiss: (id: string) => void
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [progress, setProgress] = useState(100)
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const lastUpdateRef = useRef<number>(0)

  const iconMap = {
    success: (
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5 text-success"
        fill="currentColor"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
    error: (
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5 text-destructive"
        fill="currentColor"
      >
        <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
      </svg>
    ),
    warning: (
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5 text-warning"
        fill="currentColor"
      >
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
      </svg>
    ),
    info: (
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5 text-info"
        fill="currentColor"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
      </svg>
    ),
    close: (
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4 text-muted-foreground"
        fill="currentColor"
      >
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
      </svg>
    ),
  }

  const styleMap = {
    success: {
      bg: 'bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-700',
      border: 'border-green-200 dark:border-green-700',
      progress: 'bg-green-600 dark:bg-green-500',
      text: 'text-green-800 dark:text-green-100',
      icon: 'text-green-600 dark:text-green-400',
    },
    error: {
      bg: 'bg-red-100 dark:bg-red-900 border-red-200 dark:border-red-700',
      border: 'border-red-200 dark:border-red-700',
      progress: 'bg-red-600 dark:bg-red-500',
      text: 'text-red-800 dark:text-red-100',
      icon: 'text-red-600 dark:text-red-400',
    },
    warning: {
      bg: 'bg-yellow-100 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700',
      border: 'border-yellow-200 dark:border-yellow-700',
      progress: 'bg-yellow-600 dark:bg-yellow-500',
      text: 'text-yellow-800 dark:text-yellow-100',
      icon: 'text-yellow-600 dark:text-yellow-400',
    },
    info: {
      bg: 'bg-blue-100 dark:bg-blue-900 border-blue-200 dark:border-blue-700',
      border: 'border-blue-200 dark:border-blue-700',
      progress: 'bg-blue-600 dark:bg-blue-500',
      text: 'text-blue-800 dark:text-blue-100',
      icon: 'text-blue-600 dark:text-blue-400',
    },
  }

  const styles = styleMap[toast.type]
  const duration = toast.duration ?? DEFAULT_TOAST_DURATION

  const handleClose = useCallback(() => {
    setIsVisible(false)
    setTimeout(() => onDismiss(toast.id), 300)
  }, [onDismiss, toast.id])

  const updateProgress = useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp
        lastUpdateRef.current = timestamp
      }

      const elapsed = timestamp - startTimeRef.current
      const remaining = Math.max(0, duration - elapsed)
      const newProgress = (remaining / duration) * 100

      // Atualiza visualmente apenas a cada 16ms (~60fps)
      if (timestamp - lastUpdateRef.current >= 16 || newProgress <= 0) {
        setProgress(newProgress)
        lastUpdateRef.current = timestamp
      }

      if (newProgress <= 0) {
        handleClose()
      } else if (!isHovered) {
        animationRef.current = requestAnimationFrame(updateProgress)
      }
    },
    [duration, handleClose, isHovered]
  )

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (duration === 0) return

    startTimeRef.current = null
    animationRef.current = requestAnimationFrame(updateProgress)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [duration, updateProgress])

  useEffect(() => {
    if (isHovered) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    } else {
      startTimeRef.current = null
      animationRef.current = requestAnimationFrame(updateProgress)
    }
  }, [isHovered, updateProgress])

  const tratativaDeErro = (erro: tratativaErro[]) => {
    if (erro[0]?.msg) {
      return erro[0].msg
    } else {
      return 'teste'
    }
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`
        relative overflow-hidden rounded-lg border shadow-lg transition-all duration-300 transform min-w-80 max-w-md
        ${styles.bg} ${styles.border}
        ${isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {iconMap[toast.type]}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-card-foreground">
              {typeof toast.message === 'string'
                ? toast.message
                : tratativaDeErro(toast.message)}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-card-foreground transition-colors"
            aria-label="Fechar notificação"
          >
            {iconMap.close}
          </button>
        </div>
      </div>

      {duration > 0 && (
        <div className="h-1 bg-muted">
          <div
            className={`h-full transition-all duration-100 ease-linear ${styles.progress}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}
export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
