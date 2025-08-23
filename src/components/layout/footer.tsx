'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Twitter,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Zap,
  Cpu,
  Sun,
  Flame,
} from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'GitHub', href: '#', icon: Github },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
    { name: 'Email', href: 'mailto:contact@saasify.com', icon: Mail },
  ]

  const footerSections = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '#' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'API', href: '#' },
        { name: 'Documentation', href: '#' },
        { name: 'Components', href: '/components' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Blog', href: '#' },
        { name: 'Careers', href: '#' },
        { name: 'Press', href: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Help Center', href: '#' },
        { name: 'Community', href: '#' },
        { name: 'Templates', href: '#' },
        { name: 'Tutorials', href: '#' },
        { name: 'Status', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' },
        { name: 'Cookie Policy', href: '#' },
        { name: 'GDPR', href: '#' },
      ],
    },
  ]

  const colorIcons = [
    { icon: Sparkles, color: 'neon' },
    { icon: Zap, color: 'electric' },
    { icon: Cpu, color: 'cyber' },
    { icon: Sun, color: 'aurora' },
    { icon: Flame, color: 'plasma' },
  ]

  return (
    <footer className='relative bg-gradient-to-t from-muted/20 to-background border-t'>
      {/* Animated background elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        {colorIcons.map((item, index) => {
          const Icon = item.icon
          return (
            <motion.div
              key={index}
              className={`absolute text-${item.color}-400/10`}
              style={{
                left: `${20 + index * 20}%`,
                top: `${20 + (index % 2) * 40}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.1, 0.3, 0.1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 8 + index,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <Icon className='w-32 h-32' />
            </motion.div>
          )
        })}
      </div>

      <div className='relative container mx-auto px-6 py-16'>
        <div className='grid grid-cols-1 lg:grid-cols-6 gap-12'>
          {/* Brand Section */}
          <div className='lg:col-span-2 space-y-6'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='space-y-4'
            >
              <Link href='/' className='flex items-center space-x-3 group'>
                <div className='relative'>
                  <div className='h-10 w-10 rounded-xl gradient-neon shadow-lg shadow-neon-400/25 group-hover:shadow-neon-400/50 transition-all duration-300' />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className='absolute inset-0 rounded-xl border-2 border-neon-400/30'
                  />
                </div>
                <span className='font-bold text-2xl gradient-text'>
                  SaaSify
                </span>
              </Link>

              <p className='text-muted-foreground max-w-md'>
                The most colorful and modern SaaS template. Built with Next.js
                15, featuring 5 stunning color themes and glass morphism
                effects.
              </p>

              <div className='flex items-center space-x-4 text-sm text-muted-foreground'>
                <div className='flex items-center gap-2'>
                  <MapPin className='w-4 h-4' />
                  <span>San Francisco, CA</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Phone className='w-4 h-4' />
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className='flex space-x-4'
            >
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                const colorClasses = [
                  'hover:text-neon-400 hover:shadow-neon-glow/50',
                  'hover:text-electric-400 hover:shadow-electric-glow/50',
                  'hover:text-cyber-400 hover:shadow-cyber-glow/50',
                  'hover:text-aurora-400 hover:shadow-aurora-glow/50',
                ]
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className={`
                      p-2 rounded-lg bg-muted/50 text-muted-foreground transition-all duration-300
                      hover:bg-muted hover:scale-110 ${colorClasses[index % colorClasses.length]}
                    `}
                  >
                    <Icon className='w-5 h-5' />
                    <span className='sr-only'>{social.name}</span>
                  </Link>
                )
              })}
            </motion.div>
          </div>

          {/* Footer Links */}
          <div className='lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8'>
            {footerSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * sectionIndex }}
                className='space-y-4'
              >
                <h3 className='font-semibold text-foreground'>
                  {section.title}
                </h3>
                <ul className='space-y-3'>
                  {section.links.map(link => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className='text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm'
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Newsletter Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className='mt-16 p-8 rounded-2xl glass-aurora border-aurora-400/30 shadow-aurora-glow/20'
        >
          <div className='max-w-2xl mx-auto text-center space-y-4'>
            <h3 className='text-2xl font-bold gradient-text'>Stay Updated</h3>
            <p className='text-muted-foreground'>
              Subscribe to our newsletter for the latest updates, features, and
              colorful inspiration.
            </p>
            <div className='flex flex-col sm:flex-row gap-3 max-w-md mx-auto'>
              <input
                type='email'
                placeholder='Enter your email'
                className='flex-1 px-4 py-2 rounded-lg border border-aurora-400/30 bg-background/50 backdrop-blur-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-aurora-400 focus:shadow-aurora-glow/30 transition-all duration-200'
              />
              <button className='px-6 py-2 rounded-lg bg-gradient-to-r from-aurora-500 to-aurora-600 hover:from-aurora-600 hover:to-aurora-700 text-white font-medium shadow-aurora-glow/50 hover:shadow-aurora-glow transition-all duration-200 transform hover:scale-105'>
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className='mt-16 pt-8 border-t border-muted-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4'
        >
          <div className='text-sm text-muted-foreground'>
            © {currentYear} SaaSify. All rights reserved. Built with ❤️ and
            lots of colors.
          </div>

          <div className='flex items-center gap-4 text-sm text-muted-foreground'>
            <div className='flex items-center gap-2'>
              <span>Powered by</span>
              <div className='flex items-center gap-1'>
                {colorIcons.slice(0, 3).map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={index}
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: index * 0.5,
                      }}
                    >
                      <Icon className={`w-4 h-4 text-${item.color}-400`} />
                    </motion.div>
                  )
                })}
              </div>
              <span className='font-medium gradient-text'>Next.js 15</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
