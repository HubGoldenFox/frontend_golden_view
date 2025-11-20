interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  size = 'lg',
}) => {
  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 h-full bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleBackdropClick}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`
            bg-card text-card-foreground rounded-lg border border-border shadow-xl w-full
            ${sizeClasses[size]}
            max-h-[90vh] overflow-hidden flex flex-col
          `}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground text-2xl bg-card border border-border rounded-full w-8 h-8 flex items-center justify-center transition-colors hover:bg-accent"
          >
            ×
          </button>
          <div className="flex-1 overflow-auto p-6">{children}</div>
        </div>
      </div>
    </>
  )
}
