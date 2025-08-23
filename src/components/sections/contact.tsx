'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  Clock,
  Headphones,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ContactMethodProps {
  icon: any
  title: string
  description: string
  value: string
  color: string
  delay: number
}

function ContactMethod({
  icon: Icon,
  title,
  description,
  value,
  color,
  delay,
}: ContactMethodProps) {
  const colorClasses = {
    neon: 'glass-neon border-neon-400/30 hover:shadow-neon-400/25',
    electric:
      'glass-electric border-electric-400/30 hover:shadow-electric-400/25',
    cyber: 'glass-cyber border-cyber-400/30 hover:shadow-cyber-400/25',
    aurora: 'glass-aurora border-aurora-400/30 hover:shadow-aurora-400/25',
  }

  const iconColors = {
    neon: 'text-neon-400',
    electric: 'text-electric-400',
    cyber: 'text-cyber-400',
    aurora: 'text-aurora-400',
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
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className='text-center'>
          <p className='font-medium'>{value}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ContactForm() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <Card className='glass-cyber border-cyber-400/30 hover:shadow-cyber-400/25 transition-all duration-300'>
        <CardHeader>
          <CardTitle className='text-2xl gradient-text'>
            Send us a Message
          </CardTitle>
          <CardDescription>
            We'd love to hear from you. Fill out the form below and we'll get
            back to you as soon as possible.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='firstName'>First Name</Label>
              <Input
                id='firstName'
                placeholder='John'
                className='glass-neon border-neon-400/30 focus:border-neon-400 focus:ring-neon-400/20'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='lastName'>Last Name</Label>
              <Input
                id='lastName'
                placeholder='Doe'
                className='glass-neon border-neon-400/30 focus:border-neon-400 focus:ring-neon-400/20'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              placeholder='john@example.com'
              className='glass-electric border-electric-400/30 focus:border-electric-400 focus:ring-electric-400/20'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='subject'>Subject</Label>
            <Input
              id='subject'
              placeholder='How can we help you?'
              className='glass-aurora border-aurora-400/30 focus:border-aurora-400 focus:ring-aurora-400/20'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='message'>Message</Label>
            <textarea
              id='message'
              rows={6}
              placeholder='Tell us more about your inquiry...'
              className='w-full px-3 py-2 text-sm rounded-md glass-plasma border-plasma-400/30 focus:border-plasma-400 focus:ring-2 focus:ring-plasma-400/20 focus:outline-none bg-background/50 backdrop-blur-sm placeholder:text-muted-foreground resize-none'
            />
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              className='w-full gradient-cyber text-white hover:shadow-lg hover:shadow-cyber-400/25'
              size='lg'
            >
              <Send className='w-4 h-4 mr-2' />
              Send Message
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function ContactSection() {
  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us an email anytime',
      value: 'support@saastemplate.com',
      color: 'neon',
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Call us during business hours',
      value: '+1 (555) 123-4567',
      color: 'electric',
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team',
      value: 'Available 24/7',
      color: 'aurora',
    },
    {
      icon: Headphones,
      title: 'Premium Support',
      description: 'Priority support for enterprise',
      value: 'Enterprise customers',
      color: 'plasma',
    },
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

      <div className='container mx-auto px-4 relative z-10'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='text-center max-w-3xl mx-auto mb-16'
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
              <Mail className='w-4 h-4 mr-2' />
              Get In Touch
            </Badge>
          </motion.div>

          <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6'>
            Let's <span className='gradient-text'>Start a Conversation</span>
          </h1>

          <p className='text-xl text-muted-foreground leading-relaxed'>
            Have questions about our platform? Need help getting started? Our
            team is here to help you succeed.
          </p>
        </motion.div>

        {/* Contact Methods */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16'>
          {contactMethods.map((method, index) => (
            <ContactMethod
              key={method.title}
              {...method}
              delay={0.2 + index * 0.1}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-start'>
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className='space-y-8'
          >
            <div>
              <h2 className='text-3xl font-bold gradient-text mb-4'>
                Ready to Get Started?
              </h2>
              <p className='text-muted-foreground text-lg leading-relaxed mb-6'>
                Whether you're a startup looking to scale or an enterprise
                seeking advanced features, we're here to help you make the most
                of our platform.
              </p>
            </div>

            <div className='space-y-6'>
              <Card className='glass-electric border-electric-400/30'>
                <CardHeader>
                  <div className='flex items-center space-x-3'>
                    <Clock className='h-5 w-5 text-electric-400' />
                    <CardTitle className='text-lg'>Business Hours</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM PST</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Saturday</span>
                      <span>10:00 AM - 4:00 PM PST</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className='glass-aurora border-aurora-400/30'>
                <CardHeader>
                  <div className='flex items-center space-x-3'>
                    <MapPin className='h-5 w-5 text-aurora-400' />
                    <CardTitle className='text-lg'>Our Office</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className='text-sm'>
                    123 Innovation Drive
                    <br />
                    Tech Valley, CA 94043
                    <br />
                    United States
                  </p>
                </CardContent>
              </Card>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className='text-center'
            >
              <p className='text-muted-foreground mb-4'>
                Prefer to schedule a call?
              </p>
              <Button
                variant='outline'
                className='glass-plasma border-plasma-400/30 hover:bg-plasma-400/10 hover:shadow-plasma-400/25'
                size='lg'
              >
                Schedule a Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <ContactForm />
        </div>

        {/* FAQ Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className='mt-20 text-center'
        >
          <h3 className='text-2xl font-bold gradient-text mb-4'>
            Need Quick Answers?
          </h3>
          <p className='text-muted-foreground mb-6'>
            Check out our frequently asked questions or browse our documentation
          </p>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <Button
              variant='outline'
              className='glass-neon border-neon-400/30 hover:bg-neon-400/10 hover:shadow-neon-400/25'
            >
              View FAQ
            </Button>
            <Button
              variant='outline'
              className='glass-electric border-electric-400/30 hover:bg-electric-400/10 hover:shadow-electric-400/25'
            >
              Documentation
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
