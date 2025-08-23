'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Command as CommandIcon,
  Hash,
  Calendar,
  Settings,
  Users,
  FileText,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CommandItem {
  id: string
  title: string
  subtitle?: string
  icon?: React.ReactNode
  shortcut?: string[]
  category?: string
  onSelect?: () => void
}

interface CommandGroup {
  heading: string
  items: CommandItem[]
}

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  groups: CommandGroup[]
  placeholder?: string
  className?: string
}

const categoryIcons: Record<string, React.ReactNode> = {
  navigation: <Hash className='h-4 w-4' />,
  actions: <Zap className='h-4 w-4' />,
  settings: <Settings className='h-4 w-4' />,
  users: <Users className='h-4 w-4' />,
  files: <FileText className='h-4 w-4' />,
  calendar: <Calendar className='h-4 w-4' />,
}

export function CommandPalette({
  open,
  onOpenChange,
  groups,
  placeholder = 'Type a command or search...',
  className,
}: CommandPaletteProps) {
  const [search, setSearch] = React.useState('')
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Flatten all items for keyboard navigation
  const allItems = React.useMemo(
    () => groups.flatMap(group => group.items),
    [groups]
  )

  // Filter items based on search
  const filteredGroups = React.useMemo(() => {
    if (!search) return groups

    return groups
      .map(group => ({
        ...group,
        items: group.items.filter(
          item =>
            item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.subtitle?.toLowerCase().includes(search.toLowerCase())
        ),
      }))
      .filter(group => group.items.length > 0)
  }, [groups, search])

  const filteredItems = React.useMemo(
    () => filteredGroups.flatMap(group => group.items),
    [filteredGroups]
  )

  // Reset selection when search changes
  React.useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  // Focus input when opened
  React.useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev =>
            prev < filteredItems.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev =>
            prev > 0 ? prev - 1 : filteredItems.length - 1
          )
          break
        case 'Enter':
          e.preventDefault()
          if (filteredItems[selectedIndex]) {
            filteredItems[selectedIndex].onSelect?.()
            onOpenChange(false)
            setSearch('')
          }
          break
        case 'Escape':
          e.preventDefault()
          onOpenChange(false)
          setSearch('')
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, filteredItems, selectedIndex, onOpenChange])

  if (!open) return null

  let itemIndex = 0

  return (
    <div className='fixed inset-0 z-50 flex items-start justify-center pt-[10vh]'>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='fixed inset-0 bg-black/50 backdrop-blur-sm'
        onClick={() => onOpenChange(false)}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.2 }}
        className={cn(
          'relative w-full max-w-2xl mx-4 rounded-lg glass-cyber border-cyber-400/30 shadow-2xl shadow-cyber-400/25',
          className
        )}
      >
        {/* Header */}
        <div className='flex items-center gap-3 p-4 border-b border-cyber-400/20'>
          <Search className='h-5 w-5 text-cyber-400' />
          <input
            ref={inputRef}
            type='text'
            placeholder={placeholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className='flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none'
          />
          <div className='flex items-center gap-1 text-xs text-cyber-400'>
            <kbd className='px-1.5 py-0.5 rounded glass-electric border-electric-400/30 text-electric-400'>
              ⌘
            </kbd>
            <kbd className='px-1.5 py-0.5 rounded glass-electric border-electric-400/30 text-electric-400'>
              K
            </kbd>
          </div>
        </div>

        {/* Results */}
        <div className='max-h-96 overflow-y-auto'>
          {filteredGroups.length > 0 ? (
            <div className='p-2'>
              {filteredGroups.map((group, groupIndex) => (
                <div
                  key={group.heading}
                  className={groupIndex > 0 ? 'mt-6' : ''}
                >
                  <div className='px-2 py-1.5 text-xs font-medium text-neon-400 uppercase tracking-wider'>
                    {group.heading}
                  </div>
                  <div className='mt-1'>
                    {group.items.map(item => {
                      const isSelected = itemIndex === selectedIndex
                      const currentIndex = itemIndex++

                      return (
                        <motion.div
                          key={item.id}
                          whileHover={{
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          }}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors hover:glass-aurora hover:border-aurora-400/20',
                            isSelected && 'glass-aurora border-aurora-400/30'
                          )}
                          onClick={() => {
                            item.onSelect?.()
                            onOpenChange(false)
                            setSearch('')
                          }}
                        >
                          <div className='flex-shrink-0'>
                            {item.icon ||
                              categoryIcons[item.category || ''] || (
                                <CommandIcon className='h-4 w-4 text-white/50' />
                              )}
                          </div>
                          <div className='flex-1 min-w-0'>
                            <div className='font-medium text-foreground text-sm'>
                              {item.title}
                            </div>
                            {item.subtitle && (
                              <div className='text-xs text-muted-foreground mt-0.5'>
                                {item.subtitle}
                              </div>
                            )}
                          </div>
                          {item.shortcut && (
                            <div className='flex items-center gap-0.5'>
                              {item.shortcut.map((key, index) => (
                                <kbd
                                  key={index}
                                  className='px-1.5 py-0.5 text-xs rounded glass-neon border-neon-400/30 text-neon-400'
                                >
                                  {key}
                                </kbd>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='p-8 text-center'>
              <Search className='h-8 w-8 text-electric-400/60 mx-auto mb-2' />
              <div className='text-muted-foreground text-sm'>
                No results found for "{search}"
              </div>
              <div className='text-muted-foreground/60 text-xs mt-1'>
                Try searching for something else
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// Hook for managing command palette state
export function useCommandPalette() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(open => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return { open, setOpen }
}
