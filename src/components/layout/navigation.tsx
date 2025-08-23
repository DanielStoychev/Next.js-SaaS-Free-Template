'use client'

import * as React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { User, Settings, LogOut, Menu, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface NavigationProps {
  className?: string
}

export function Navigation({ className }: NavigationProps) {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        'sticky top-0 z-50 w-full glass-neon border-neon-400/20 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg shadow-neon-400/10',
        className
      )}
    >
      <div className='container mx-auto px-4'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href='/' className='flex items-center space-x-2'>
              <div className='h-8 w-8 rounded-full gradient-neon shadow-lg shadow-neon-400/25' />
              <span className='font-bold text-xl gradient-text'>SaaSify</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-8'>
            <NavLink href='/'>Home</NavLink>
            <NavLink href='/about'>About</NavLink>
            <NavLink href='/pricing'>Pricing</NavLink>
            <NavLink href='/contact'>Contact</NavLink>
            <NavLink href='/components'>Components</NavLink>
            {session && <NavLink href='/dashboard'>Dashboard</NavLink>}
            {session && <NavLink href='/settings'>Settings</NavLink>}
          </div>

          {/* User Actions */}
          <div className='flex items-center space-x-4'>
            {status === 'loading' && (
              <div className='h-8 w-8 animate-spin rounded-full border-2 border-electric-400 border-t-transparent' />
            )}

            {status === 'authenticated' && session && (
              <div className='flex items-center space-x-3'>
                <Badge
                  variant='outline'
                  className='hidden sm:inline-flex glass-electric border-electric-400/30 text-electric-400'
                >
                  {session.user.role || 'USER'}
                </Badge>
                <UserMenu user={session.user} />
              </div>
            )}

            {status === 'unauthenticated' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  asChild
                  className='gradient-cyber text-white hover:shadow-lg hover:shadow-cyber-400/25'
                >
                  <Link href='/signin'>Sign In</Link>
                </Button>
              </motion.div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant='ghost'
              size='icon'
              className='md:hidden'
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='md:hidden border-t py-4'
          >
            <div className='flex flex-col space-y-3'>
              <MobileNavLink href='/' onClick={() => setIsMenuOpen(false)}>
                Home
              </MobileNavLink>
              <MobileNavLink href='/about' onClick={() => setIsMenuOpen(false)}>
                About
              </MobileNavLink>
              <MobileNavLink
                href='/pricing'
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </MobileNavLink>
              <MobileNavLink
                href='/contact'
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </MobileNavLink>
              <MobileNavLink
                href='/components'
                onClick={() => setIsMenuOpen(false)}
              >
                Components
              </MobileNavLink>
              {session && (
                <MobileNavLink
                  href='/dashboard'
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </MobileNavLink>
              )}
              {session && (
                <MobileNavLink
                  href='/settings'
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                </MobileNavLink>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

function NavLink({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'text-sm font-medium transition-colors hover:text-neon-400 relative group',
        className
      )}
    >
      {children}
      <motion.span
        className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-neon-400 to-electric-400 group-hover:w-full transition-all duration-200'
        whileHover={{ width: '100%' }}
      />
    </Link>
  )
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className='text-sm font-medium transition-colors hover:text-electric-400 px-2 py-1'
    >
      {children}
    </Link>
  )
}

function UserMenu({ user }: { user: any }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className='relative'>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center space-x-2'
      >
        <Avatar className='h-8 w-8'>
          <AvatarImage
            src={user.image || undefined}
            alt={user.name || 'User'}
          />
          <AvatarFallback>
            {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className='absolute right-0 mt-2 w-56 rounded-md glass-cyber border-cyber-400/30 shadow-lg shadow-cyber-400/25 z-50'
        >
          <div className='px-4 py-3 border-b'>
            <p className='text-sm font-medium'>{user.name || 'User'}</p>
            <p className='text-xs text-muted-foreground'>{user.email}</p>
          </div>
          <div className='py-1'>
            <MenuLink href='/dashboard' icon={User}>
              Dashboard
            </MenuLink>
            <MenuLink href='/settings' icon={Settings}>
              Settings
            </MenuLink>
            <button
              onClick={() => signOut()}
              className='flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950'
            >
              <LogOut className='mr-3 h-4 w-4' />
              Sign Out
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

function MenuLink({
  href,
  icon: Icon,
  children,
}: {
  href: string
  icon: any
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className='flex items-center px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground'
    >
      <Icon className='mr-3 h-4 w-4' />
      {children}
    </Link>
  )
}
