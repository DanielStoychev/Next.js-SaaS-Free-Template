'use client'

interface ToastOptions {
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  duration?: number
}

// Enhanced toast functions with colorful variants - using simple toast patterns
export const useColorfulToast = () => {
  // Simple toast notification function
  const showToast = (message: string, type: string, options?: ToastOptions) => {
    // Create toast element
    const toast = document.createElement('div')
    toast.className = `
      fixed top-4 right-4 z-50 p-4 rounded-lg border backdrop-blur-sm shadow-lg max-w-sm w-full
      transform transition-all duration-300 ease-out translate-x-full opacity-0
      ${getToastClasses(type)}
    `

    toast.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="flex-1 min-w-0">
          <h4 class="font-semibold text-sm mb-1">${message}</h4>
          ${options?.description ? `<p class="text-xs opacity-90">${options.description}</p>` : ''}
        </div>
        <button class="flex-shrink-0 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors" onclick="this.parentElement.parentElement.remove()">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `

    document.body.appendChild(toast)

    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-x-full', 'opacity-0')
    }, 10)

    // Auto remove
    setTimeout(() => {
      toast.classList.add('translate-x-full', 'opacity-0')
      setTimeout(() => toast.remove(), 300)
    }, options?.duration || 4000)
  }

  const getToastClasses = (type: string) => {
    switch (type) {
      case 'neon':
        return 'glass-neon border-neon-500/50 text-neon-100 shadow-neon-glow'
      case 'electric':
        return 'glass-electric border-electric-500/50 text-electric-100 shadow-electric-glow'
      case 'cyber':
        return 'glass-cyber border-cyber-500/50 text-cyber-100 shadow-cyber-glow'
      case 'aurora':
        return 'glass-aurora border-aurora-500/50 text-aurora-100 shadow-aurora-glow'
      case 'plasma':
        return 'glass-plasma border-plasma-500/50 text-plasma-100 shadow-plasma-glow'
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200'
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
      default:
        return 'bg-background border-border text-foreground'
    }
  }

  const neon = (message: string, options?: ToastOptions) => {
    showToast(message, 'neon', options)
  }

  const electric = (message: string, options?: ToastOptions) => {
    showToast(message, 'electric', options)
  }

  const cyber = (message: string, options?: ToastOptions) => {
    showToast(message, 'cyber', options)
  }

  const aurora = (message: string, options?: ToastOptions) => {
    showToast(message, 'aurora', options)
  }

  const plasma = (message: string, options?: ToastOptions) => {
    showToast(message, 'plasma', options)
  }

  const success = (message: string, options?: ToastOptions) => {
    showToast(message, 'success', options)
  }

  const error = (message: string, options?: ToastOptions) => {
    showToast(message, 'error', options)
  }

  const warning = (message: string, options?: ToastOptions) => {
    showToast(message, 'warning', options)
  }

  const info = (message: string, options?: ToastOptions) => {
    showToast(message, 'info', options)
  }

  return {
    neon,
    electric,
    cyber,
    aurora,
    plasma,
    success,
    error,
    warning,
    info,
  }
}
