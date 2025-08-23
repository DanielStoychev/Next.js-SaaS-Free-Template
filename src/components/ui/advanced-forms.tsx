'use client'

import { motion } from 'framer-motion'
import {
  Check,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react'
import { useState, ReactNode } from 'react'

interface FormStep {
  id: string
  title: string
  description?: string
  content: ReactNode
  validation?: () => boolean | Promise<boolean>
}

interface MultiStepFormProps {
  steps: FormStep[]
  variant?: 'neon' | 'electric' | 'cyber' | 'aurora' | 'plasma'
  onComplete: (data: Record<string, any>) => void
  className?: string
}

export function MultiStepForm({
  steps,
  variant = 'neon',
  onComplete,
  className = '',
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [formData, setFormData] = useState<Record<string, any>>({})

  const variantClasses = {
    neon: {
      container: 'glass-neon border-neon-500/30 shadow-neon-glow',
      button:
        'bg-gradient-to-r from-neon-500 to-neon-600 hover:from-neon-600 hover:to-neon-700 text-white shadow-neon-glow/50',
      progress: 'bg-gradient-to-r from-neon-400 to-neon-600',
      step: 'border-neon-400 bg-neon-500 text-white shadow-neon-glow/50',
    },
    electric: {
      container: 'glass-electric border-electric-500/30 shadow-electric-glow',
      button:
        'bg-gradient-to-r from-electric-500 to-electric-600 hover:from-electric-600 hover:to-electric-700 text-white shadow-electric-glow/50',
      progress: 'bg-gradient-to-r from-electric-400 to-electric-600',
      step: 'border-electric-400 bg-electric-500 text-white shadow-electric-glow/50',
    },
    cyber: {
      container: 'glass-cyber border-cyber-500/30 shadow-cyber-glow',
      button:
        'bg-gradient-to-r from-cyber-500 to-cyber-600 hover:from-cyber-600 hover:to-cyber-700 text-white shadow-cyber-glow/50',
      progress: 'bg-gradient-to-r from-cyber-400 to-cyber-600',
      step: 'border-cyber-400 bg-cyber-500 text-white shadow-cyber-glow/50',
    },
    aurora: {
      container: 'glass-aurora border-aurora-500/30 shadow-aurora-glow',
      button:
        'bg-gradient-to-r from-aurora-500 to-aurora-600 hover:from-aurora-600 hover:to-aurora-700 text-white shadow-aurora-glow/50',
      progress: 'bg-gradient-to-r from-aurora-400 to-aurora-600',
      step: 'border-aurora-400 bg-aurora-500 text-white shadow-aurora-glow/50',
    },
    plasma: {
      container: 'glass-plasma border-plasma-500/30 shadow-plasma-glow',
      button:
        'bg-gradient-to-r from-plasma-500 to-plasma-600 hover:from-plasma-600 hover:to-plasma-700 text-white shadow-plasma-glow/50',
      progress: 'bg-gradient-to-r from-plasma-400 to-plasma-600',
      step: 'border-plasma-400 bg-plasma-500 text-white shadow-plasma-glow/50',
    },
  }

  const classes = variantClasses[variant]

  const nextStep = async () => {
    const step = steps[currentStep]
    if (!step) return

    if (step.validation) {
      const isValid = await step.validation()
      if (!isValid) return
    }

    setCompletedSteps(prev => new Set([...prev, currentStep]))

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete(formData)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progressPercentage = ((currentStep + 1) / steps.length) * 100

  return (
    <div
      className={`max-w-2xl mx-auto p-6 rounded-xl border backdrop-blur-sm ${classes.container} ${className}`}
    >
      {/* Progress Bar */}
      <div className='mb-8'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-bold'>
            Step {currentStep + 1} of {steps.length}
          </h2>
          <span className='text-sm text-muted-foreground'>
            {Math.round(progressPercentage)}% Complete
          </span>
        </div>

        <div className='w-full bg-muted/30 rounded-full h-2 overflow-hidden'>
          <motion.div
            className={`h-full ${classes.progress} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className='flex justify-between items-center mb-8'>
        {steps.map((step, index) => (
          <div key={step.id} className='flex items-center flex-1'>
            <div
              className={`
                w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium
                transition-all duration-300
                ${index <= currentStep ? classes.step : 'border-muted bg-muted/20 text-muted-foreground'}
                ${completedSteps.has(index) ? 'border-green-400 bg-green-500 text-white' : ''}
              `}
            >
              {completedSteps.has(index) ? (
                <Check className='w-5 h-5' />
              ) : (
                index + 1
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`
                  flex-1 h-0.5 mx-2 transition-colors duration-300
                  ${index < currentStep ? classes.progress : 'bg-muted/30'}
                `}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className='mb-8'
      >
        {steps[currentStep] && (
          <>
            <div className='mb-6'>
              <h3 className='text-xl font-semibold mb-2'>
                {steps[currentStep].title}
              </h3>
              {steps[currentStep].description && (
                <p className='text-muted-foreground'>
                  {steps[currentStep].description}
                </p>
              )}
            </div>

            <div className='min-h-[200px]'>{steps[currentStep].content}</div>
          </>
        )}
      </motion.div>

      {/* Navigation */}
      <div className='flex justify-between items-center'>
        <button
          type='button'
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:bg-muted/50
          `}
        >
          <ChevronLeft className='w-4 h-4' />
          Previous
        </button>

        <button
          type='button'
          onClick={nextStep}
          className={`
            flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-200
            transform hover:scale-105 ${classes.button}
          `}
        >
          {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
          <ChevronRight className='w-4 h-4' />
        </button>
      </div>
    </div>
  )
}

// Enhanced Input Components
interface ColorfulInputProps {
  label?: string
  error?: string
  hint?: string
  variant?: 'neon' | 'electric' | 'cyber' | 'aurora' | 'plasma'
  type?: 'text' | 'email' | 'password' | 'number' | 'tel'
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  required?: boolean
  className?: string
}

export function ColorfulInput({
  label,
  error,
  hint,
  variant = 'neon',
  type = 'text',
  placeholder,
  value,
  onChange,
  required,
  className = '',
}: ColorfulInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [focused, setFocused] = useState(false)

  const variantClasses = {
    neon: {
      input: `border-neon-500/30 focus:border-neon-400 focus:shadow-neon-glow/30 ${focused ? 'shadow-neon-glow/20' : ''}`,
      label: 'text-neon-200',
      error: 'text-neon-300',
    },
    electric: {
      input: `border-electric-500/30 focus:border-electric-400 focus:shadow-electric-glow/30 ${focused ? 'shadow-electric-glow/20' : ''}`,
      label: 'text-electric-200',
      error: 'text-electric-300',
    },
    cyber: {
      input: `border-cyber-500/30 focus:border-cyber-400 focus:shadow-cyber-glow/30 ${focused ? 'shadow-cyber-glow/20' : ''}`,
      label: 'text-cyber-200',
      error: 'text-cyber-300',
    },
    aurora: {
      input: `border-aurora-500/30 focus:border-aurora-400 focus:shadow-aurora-glow/30 ${focused ? 'shadow-aurora-glow/20' : ''}`,
      label: 'text-aurora-200',
      error: 'text-aurora-300',
    },
    plasma: {
      input: `border-plasma-500/30 focus:border-plasma-400 focus:shadow-plasma-glow/30 ${focused ? 'shadow-plasma-glow/20' : ''}`,
      label: 'text-plasma-200',
      error: 'text-plasma-300',
    },
  }

  const classes = variantClasses[variant]

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className={`block text-sm font-medium ${classes.label}`}>
          {label}
          {required && <span className='text-red-400 ml-1'>*</span>}
        </label>
      )}

      <div className='relative'>
        <input
          type={
            type === 'password' ? (showPassword ? 'text' : 'password') : type
          }
          placeholder={placeholder}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`
            w-full px-4 py-3 rounded-lg border backdrop-blur-sm
            bg-background/50 text-foreground placeholder-muted-foreground
            transition-all duration-200 focus:outline-none focus:ring-0
            ${classes.input}
            ${error ? 'border-red-400 focus:border-red-400' : ''}
          `}
        />

        {type === 'password' && (
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
          >
            {showPassword ? (
              <EyeOff className='w-4 h-4' />
            ) : (
              <Eye className='w-4 h-4' />
            )}
          </button>
        )}
      </div>

      {error && (
        <div className={`flex items-center gap-2 text-sm ${classes.error}`}>
          <AlertCircle className='w-4 h-4 flex-shrink-0' />
          {error}
        </div>
      )}

      {hint && !error && (
        <p className='text-xs text-muted-foreground'>{hint}</p>
      )}
    </div>
  )
}

// Form validation utilities
export const validators = {
  required: (value: string) => {
    return value.trim() !== '' || 'This field is required'
  },

  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value) || 'Please enter a valid email address'
  },

  minLength: (min: number) => (value: string) => {
    return value.length >= min || `Must be at least ${min} characters`
  },

  password: (value: string) => {
    const hasUpperCase = /[A-Z]/.test(value)
    const hasLowerCase = /[a-z]/.test(value)
    const hasNumbers = /\d/.test(value)
    const hasNonalphas = /\W/.test(value)

    if (value.length < 8) return 'Password must be at least 8 characters'
    if (!hasUpperCase) return 'Password must contain an uppercase letter'
    if (!hasLowerCase) return 'Password must contain a lowercase letter'
    if (!hasNumbers) return 'Password must contain a number'
    if (!hasNonalphas) return 'Password must contain a special character'

    return true
  },
}
