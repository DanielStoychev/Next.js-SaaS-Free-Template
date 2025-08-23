'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Palette, Zap, Sparkles, Cpu, Sun, Flame } from 'lucide-react'
import {
  LoadingSpinner,
  LoadingPulse,
  LoadingWave,
  LoadingProgress,
  LoadingSkeleton,
} from '@/components/ui/loading'
import {
  MultiStepForm,
  ColorfulInput,
  validators,
} from '@/components/ui/advanced-forms'
import { useColorfulToast } from '@/hooks/use-colorful-toast'

export default function ComponentDemo() {
  const [selectedVariant, setSelectedVariant] = useState<
    'neon' | 'electric' | 'cyber' | 'aurora' | 'plasma'
  >('neon')
  const [progress, setProgress] = useState(65)
  const [inputValue, setInputValue] = useState('')
  const [emailValue, setEmailValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')

  const toast = useColorfulToast()

  const variants = [
    {
      name: 'neon',
      icon: Sparkles,
      color: 'from-neon-400 to-neon-600',
      label: 'Neon Cyan',
    },
    {
      name: 'electric',
      icon: Zap,
      color: 'from-electric-400 to-electric-600',
      label: 'Electric Blue',
    },
    {
      name: 'cyber',
      icon: Cpu,
      color: 'from-cyber-400 to-cyber-600',
      label: 'Cyber Purple',
    },
    {
      name: 'aurora',
      icon: Sun,
      color: 'from-aurora-400 to-aurora-600',
      label: 'Aurora Teal',
    },
    {
      name: 'plasma',
      icon: Flame,
      color: 'from-plasma-400 to-plasma-600',
      label: 'Plasma Orange',
    },
  ]

  const demoSteps = [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Tell us about yourself',
      content: (
        <div className='space-y-4'>
          <ColorfulInput
            label='Full Name'
            placeholder='Enter your full name'
            variant={selectedVariant}
            required
          />
          <ColorfulInput
            label='Email'
            type='email'
            placeholder='your@email.com'
            variant={selectedVariant}
            required
          />
        </div>
      ),
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Customize your experience',
      content: (
        <div className='space-y-4'>
          <ColorfulInput
            label='Company'
            placeholder='Your company name'
            variant={selectedVariant}
          />
          <ColorfulInput
            label='Phone'
            type='tel'
            placeholder='+1 (555) 123-4567'
            variant={selectedVariant}
          />
        </div>
      ),
    },
    {
      id: 'complete',
      title: 'Complete',
      description: 'Review and finish',
      content: (
        <div className='text-center space-y-4'>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className='w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto'
          >
            <Sparkles className='w-8 h-8 text-white' />
          </motion.div>
          <p className='text-lg'>
            Almost there! Review your information and click Complete.
          </p>
        </div>
      ),
    },
  ]

  return (
    <div className='container mx-auto px-6 py-12 space-y-12'>
      {/* Header */}
      <div className='text-center space-y-4'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='flex items-center justify-center gap-3 mb-6'
        >
          <div
            className={`p-3 rounded-xl bg-gradient-to-r ${variants.find(v => v.name === selectedVariant)?.color} shadow-lg`}
          >
            <Palette className='w-6 h-6 text-white' />
          </div>
          <h1 className='text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
            Component Showcase
          </h1>
        </motion.div>
        <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
          Explore our colorful component library with 5 stunning themes. Switch
          between variants to see the magic!
        </p>
      </div>

      {/* Variant Selector */}
      <div className='text-center'>
        <h2 className='text-2xl font-semibold mb-6'>Choose Your Theme</h2>
        <div className='grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto'>
          {variants.map(variant => {
            const Icon = variant.icon
            return (
              <button
                key={variant.name}
                onClick={() => setSelectedVariant(variant.name as any)}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-300 text-center space-y-2
                  ${
                    selectedVariant === variant.name
                      ? `border-${variant.name}-400 glass-${variant.name} shadow-${variant.name}-glow scale-105`
                      : 'border-muted hover:border-muted-foreground/50 hover:glass-neon/20'
                  }
                `}
              >
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-r ${variant.color} flex items-center justify-center mx-auto`}
                >
                  <Icon className='w-5 h-5 text-white' />
                </div>
                <div className='text-sm font-medium'>{variant.label}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Loading Components */}
      <section className='space-y-8'>
        <h2 className='text-3xl font-bold text-center'>Loading Components</h2>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          <div className='text-center space-y-4 p-6 rounded-xl glass-neon/20 border border-muted'>
            <h3 className='font-semibold'>Spinner</h3>
            <LoadingSpinner
              variant={selectedVariant}
              size='lg'
              message='Loading...'
            />
          </div>

          <div className='text-center space-y-4 p-6 rounded-xl glass-electric/20 border border-muted'>
            <h3 className='font-semibold'>Pulse</h3>
            <LoadingPulse variant={selectedVariant} />
          </div>

          <div className='text-center space-y-4 p-6 rounded-xl glass-cyber/20 border border-muted'>
            <h3 className='font-semibold'>Wave</h3>
            <LoadingWave variant={selectedVariant} />
          </div>

          <div className='text-center space-y-4 p-6 rounded-xl glass-aurora/20 border border-muted'>
            <h3 className='font-semibold'>Progress</h3>
            <LoadingProgress
              progress={progress}
              variant={selectedVariant}
              showPercentage
            />
            <div className='flex gap-2 mt-4'>
              <button
                onClick={() => setProgress(Math.max(0, progress - 10))}
                className='px-3 py-1 text-xs bg-muted rounded'
              >
                -10%
              </button>
              <button
                onClick={() => setProgress(Math.min(100, progress + 10))}
                className='px-3 py-1 text-xs bg-muted rounded'
              >
                +10%
              </button>
            </div>
          </div>
        </div>

        <div className='max-w-md mx-auto'>
          <h3 className='font-semibold text-center mb-4'>Skeleton Loading</h3>
          <LoadingSkeleton variant={selectedVariant} lines={4} />
        </div>
      </section>

      {/* Toast Demo */}
      <section className='space-y-8'>
        <h2 className='text-3xl font-bold text-center'>Toast Notifications</h2>

        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-4xl mx-auto'>
          {variants.map(variant => (
            <button
              key={`toast-${variant.name}`}
              onClick={() =>
                toast[variant.name as keyof typeof toast](
                  `${variant.label} Toast!`,
                  {
                    description: `This is a ${variant.label.toLowerCase()} notification`,
                  }
                )
              }
              className={`
                px-4 py-3 rounded-lg font-medium transition-all duration-200
                bg-gradient-to-r ${variant.color} text-white
                hover:scale-105 shadow-lg hover:shadow-xl
              `}
            >
              {variant.label}
            </button>
          ))}
        </div>

        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto'>
          <button
            onClick={() =>
              toast.success('Success!', {
                description: 'Operation completed successfully',
              })
            }
            className='px-4 py-3 rounded-lg font-medium bg-green-500 hover:bg-green-600 text-white transition-colors'
          >
            Success
          </button>
          <button
            onClick={() =>
              toast.error('Error!', { description: 'Something went wrong' })
            }
            className='px-4 py-3 rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white transition-colors'
          >
            Error
          </button>
          <button
            onClick={() =>
              toast.warning('Warning!', {
                description: 'Please check your input',
              })
            }
            className='px-4 py-3 rounded-lg font-medium bg-yellow-500 hover:bg-yellow-600 text-white transition-colors'
          >
            Warning
          </button>
          <button
            onClick={() =>
              toast.info('Info', { description: "Here's some information" })
            }
            className='px-4 py-3 rounded-lg font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors'
          >
            Info
          </button>
        </div>
      </section>

      {/* Form Components */}
      <section className='space-y-8'>
        <h2 className='text-3xl font-bold text-center'>Form Components</h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto'>
          <div className='space-y-4'>
            <ColorfulInput
              label='Text Input'
              placeholder='Enter some text'
              variant={selectedVariant}
              value={inputValue}
              onChange={setInputValue}
              hint='This is a helpful hint'
            />
          </div>

          <div className='space-y-4'>
            <ColorfulInput
              label='Email Input'
              type='email'
              placeholder='your@email.com'
              variant={selectedVariant}
              value={emailValue}
              onChange={setEmailValue}
              error={
                emailValue && !validators.email(emailValue)
                  ? 'Invalid email format'
                  : undefined
              }
              required
            />
          </div>

          <div className='space-y-4'>
            <ColorfulInput
              label='Password Input'
              type='password'
              placeholder='Enter password'
              variant={selectedVariant}
              value={passwordValue}
              onChange={setPasswordValue}
              error={
                passwordValue && validators.password(passwordValue) !== true
                  ? (validators.password(passwordValue) as string)
                  : undefined
              }
              required
            />
          </div>
        </div>
      </section>

      {/* Multi-Step Form */}
      <section className='space-y-8'>
        <h2 className='text-3xl font-bold text-center'>Multi-Step Form</h2>

        <div className='max-w-4xl mx-auto'>
          <MultiStepForm
            steps={demoSteps}
            variant={selectedVariant}
            onComplete={data => {
              toast[selectedVariant]('Form Completed!', {
                description:
                  'Your multi-step form has been submitted successfully',
              })
            }}
          />
        </div>
      </section>

      {/* Color Palette */}
      <section className='space-y-8'>
        <h2 className='text-3xl font-bold text-center'>Color Palettes</h2>

        {variants.map(variant => (
          <div key={`palette-${variant.name}`} className='space-y-4'>
            <h3 className='text-xl font-semibold text-center'>
              {variant.label}
            </h3>
            <div className='grid grid-cols-9 gap-2 max-w-2xl mx-auto'>
              {[50, 100, 200, 300, 400, 500, 600, 700, 800].map(shade => (
                <div
                  key={shade}
                  className={`aspect-square rounded-lg bg-${variant.name}-${shade} border border-border/20`}
                  title={`${variant.name}-${shade}`}
                >
                  <div className='w-full h-full flex items-center justify-center text-xs font-mono text-white text-shadow'>
                    {shade}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Glass Effects */}
      <section className='space-y-8'>
        <h2 className='text-3xl font-bold text-center'>
          Glass Morphism Effects
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6'>
          {variants.map(variant => {
            const Icon = variant.icon
            return (
              <div
                key={`glass-${variant.name}`}
                className={`
                  p-6 rounded-xl border backdrop-blur-sm text-center space-y-4
                  glass-${variant.name} border-${variant.name}-500/30 shadow-${variant.name}-glow
                `}
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${variant.color} flex items-center justify-center mx-auto`}
                >
                  <Icon className='w-6 h-6 text-white' />
                </div>
                <h3 className='font-semibold'>{variant.label}</h3>
                <p className='text-sm text-muted-foreground'>
                  Glass morphism effect with {variant.label.toLowerCase()} theme
                </p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
