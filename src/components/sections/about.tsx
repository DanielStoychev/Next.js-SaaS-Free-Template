'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Target,
  Users,
  Zap,
  Shield,
  Heart,
  Globe,
  Award,
  Rocket,
} from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ValueCardProps {
  icon: any
  title: string
  description: string
  color: string
  delay: number
}

interface TeamMemberProps {
  name: string
  role: string
  image?: string
  color: string
  delay: number
}

function ValueCard({
  icon: Icon,
  title,
  description,
  color,
  delay,
}: ValueCardProps) {
  const colorClasses = {
    neon: 'glass-neon border-neon-400/30 hover:shadow-neon-400/25',
    electric:
      'glass-electric border-electric-400/30 hover:shadow-electric-400/25',
    cyber: 'glass-cyber border-cyber-400/30 hover:shadow-cyber-400/25',
    aurora: 'glass-aurora border-aurora-400/30 hover:shadow-aurora-400/25',
    plasma: 'glass-plasma border-plasma-400/30 hover:shadow-plasma-400/25',
  }

  const iconColors = {
    neon: 'text-neon-400',
    electric: 'text-electric-400',
    cyber: 'text-cyber-400',
    aurora: 'text-aurora-400',
    plasma: 'text-plasma-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.03, y: -5 }}
    >
      <Card
        className={`h-full transition-all duration-300 ${colorClasses[color as keyof typeof colorClasses]}`}
      >
        <CardHeader className='text-center'>
          <div
            className={`mx-auto mb-4 p-4 rounded-full bg-gradient-to-br from-${color}-400/20 to-${color}-600/10`}
          >
            <Icon
              className={`h-6 w-6 ${iconColors[color as keyof typeof iconColors]}`}
            />
          </div>
          <CardTitle className='gradient-text'>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground text-center'>{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function TeamMember({ name, role, image, color, delay }: TeamMemberProps) {
  const colorClasses = {
    neon: 'glass-neon border-neon-400/30',
    electric: 'glass-electric border-electric-400/30',
    cyber: 'glass-cyber border-cyber-400/30',
    aurora: 'glass-aurora border-aurora-400/30',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.02, y: -3 }}
    >
      <Card
        className={`text-center transition-all duration-300 ${colorClasses[color as keyof typeof colorClasses]}`}
      >
        <CardHeader>
          <Avatar className='w-20 h-20 mx-auto mb-4'>
            <AvatarImage src={image} alt={name} />
            <AvatarFallback
              className={`bg-gradient-to-br from-${color}-400/20 to-${color}-600/10 text-${color}-400`}
            >
              {name
                .split(' ')
                .map(n => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <CardTitle className='gradient-text'>{name}</CardTitle>
          <CardDescription>{role}</CardDescription>
        </CardHeader>
      </Card>
    </motion.div>
  )
}

export function AboutSection() {
  const values = [
    {
      icon: Target,
      title: 'Mission-Driven',
      description:
        "We're focused on empowering businesses to achieve their goals through innovative technology solutions.",
      color: 'neon',
    },
    {
      icon: Users,
      title: 'Customer-Centric',
      description:
        "Every decision we make is guided by what's best for our customers and their success.",
      color: 'electric',
    },
    {
      icon: Zap,
      title: 'Innovation First',
      description:
        "We constantly push the boundaries of what's possible in SaaS technology.",
      color: 'cyber',
    },
    {
      icon: Shield,
      title: 'Security Focus',
      description:
        'Your data security and privacy are our top priorities in everything we build.',
      color: 'aurora',
    },
    {
      icon: Heart,
      title: 'People-First',
      description:
        'We believe that great products come from great people working together.',
      color: 'plasma',
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description:
        'Our platform serves customers worldwide, making business growth accessible everywhere.',
      color: 'neon',
    },
  ]

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Co-Founder',
      color: 'neon',
    },
    {
      name: 'Michael Chen',
      role: 'CTO & Co-Founder',
      color: 'electric',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Product',
      color: 'cyber',
    },
    {
      name: 'David Kim',
      role: 'Head of Engineering',
      color: 'aurora',
    },
  ]

  const stats = [
    { label: 'Happy Customers', value: '10,000+', color: 'neon' },
    { label: 'Countries Served', value: '50+', color: 'electric' },
    { label: 'Team Members', value: '100+', color: 'cyber' },
    { label: 'Uptime', value: '99.9%', color: 'aurora' },
  ]

  return (
    <section className='min-h-screen relative overflow-hidden py-20'>
      {/* Colorful animated background */}
      <div className='absolute inset-0 bg-gradient-to-br from-background via-background to-background/95' />
      <div className='absolute inset-0'>
        <div className='absolute top-0 left-0 w-96 h-96 bg-neon-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse' />
        <div className='absolute top-1/4 right-0 w-96 h-96 bg-electric-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse animation-delay-300' />
        <div className='absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyber-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse animation-delay-600' />
        <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-aurora-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse animation-delay-900' />
      </div>

      <div className='container mx-auto px-4 relative z-10 space-y-20'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='text-center max-w-4xl mx-auto'
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className='mb-6'
          >
            <Badge
              variant='outline'
              className='glass-neon border-neon-400/30 text-neon-400 px-4 py-2'
            >
              <Heart className='w-4 h-4 mr-2' />
              Our Story
            </Badge>
          </motion.div>

          <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6'>
            Building the <span className='gradient-text'>Future of SaaS</span>
          </h1>

          <p className='text-xl text-muted-foreground leading-relaxed'>
            We're on a mission to democratize access to powerful business tools,
            making it easier for companies of all sizes to succeed in the
            digital age.
          </p>
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className='max-w-4xl mx-auto'
        >
          <Card className='glass-electric border-electric-400/30'>
            <CardHeader>
              <CardTitle className='text-2xl gradient-text text-center'>
                Our Journey
              </CardTitle>
            </CardHeader>
            <CardContent className='prose prose-lg max-w-none'>
              <p className='text-muted-foreground leading-relaxed text-center'>
                Founded in 2020, our platform was born from a simple
                observation: too many businesses were struggling with complex,
                expensive software that didn't fit their needs. We set out to
                create something different—a platform that's powerful yet
                intuitive, comprehensive yet affordable, and scalable yet
                personal.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className='grid grid-cols-2 md:grid-cols-4 gap-8'
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.6 + index * 0.1,
                type: 'spring',
                stiffness: 200,
              }}
              className='text-center'
            >
              <div className='text-3xl md:text-4xl font-bold gradient-text mb-2'>
                {stat.value}
              </div>
              <div className='text-muted-foreground'>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Values */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className='text-center mb-12'
          >
            <h2 className='text-3xl font-bold gradient-text mb-4'>
              Our Values
            </h2>
            <p className='text-muted-foreground max-w-2xl mx-auto'>
              These core principles guide everything we do and shape how we
              build our platform
            </p>
          </motion.div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {values.map((value, index) => (
              <ValueCard
                key={value.title}
                {...value}
                delay={0.6 + index * 0.1}
              />
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className='text-center mb-12'
          >
            <h2 className='text-3xl font-bold gradient-text mb-4'>
              Meet Our Team
            </h2>
            <p className='text-muted-foreground max-w-2xl mx-auto'>
              We're a diverse group of makers, thinkers, and problem-solvers
              united by our passion for great software
            </p>
          </motion.div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {teamMembers.map((member, index) => (
              <TeamMember
                key={member.name}
                {...member}
                delay={0.9 + index * 0.1}
              />
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className='text-center max-w-4xl mx-auto'
        >
          <Card className='glass-aurora border-aurora-400/30'>
            <CardHeader>
              <div className='flex items-center justify-center space-x-3 mb-4'>
                <Rocket className='h-6 w-6 text-aurora-400' />
                <CardTitle className='text-2xl gradient-text'>
                  Looking Forward
                </CardTitle>
                <Award className='h-6 w-6 text-aurora-400' />
              </div>
            </CardHeader>
            <CardContent>
              <p className='text-lg text-muted-foreground leading-relaxed'>
                As we continue to grow, our commitment remains the same: to
                build tools that empower businesses to achieve more. We're just
                getting started, and we're excited to have you join us on this
                journey toward a more connected, efficient, and innovative
                future.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
