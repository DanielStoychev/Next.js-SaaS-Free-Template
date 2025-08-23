import { Metadata } from 'next'
import ComponentDemo from '@/components/sections/component-demo'

export const metadata: Metadata = {
  title: 'Component Demo - SaaS Template',
  description: 'Showcase of all colorful components and UI elements',
}

export default function ComponentDemoPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-muted/5 to-background'>
      <ComponentDemo />
    </div>
  )
}
