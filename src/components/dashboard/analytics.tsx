'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Users,
  DollarSign,
  Eye,
} from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { api } from '@/trpc/react'
import { LoadingSpinner } from '@/components/ui/loading'

interface MetricCardProps {
  title: string
  value: string | number
  change?: {
    value: string
    type: 'up' | 'down' | 'neutral'
  }
  icon: any
  color?: string
  delay?: number
}

interface ChartData {
  label: string
  value: number
  color: string
}

function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  color = 'neon',
  delay = 0,
}: MetricCardProps) {
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
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <Card
        className={`transition-all duration-300 ${colorClasses[color as keyof typeof colorClasses]}`}
      >
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium text-muted-foreground'>
            {title}
          </CardTitle>
          <div
            className={`p-2 rounded-full bg-gradient-to-br from-${color}-400/20 to-${color}-600/10`}
          >
            <Icon
              className={`h-4 w-4 ${iconColors[color as keyof typeof iconColors]}`}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold gradient-text mb-1'>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          {change && (
            <div className='flex items-center text-xs'>
              {change.type === 'up' && (
                <TrendingUp className='h-3 w-3 text-aurora-400 mr-1' />
              )}
              {change.type === 'down' && (
                <TrendingDown className='h-3 w-3 text-plasma-400 mr-1' />
              )}
              <span
                className={
                  change.type === 'up'
                    ? 'text-aurora-400'
                    : change.type === 'down'
                      ? 'text-plasma-400'
                      : 'text-muted-foreground'
                }
              >
                {change.value} from last month
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

function SimpleBarChart({
  data,
  title,
  color = 'neon',
}: {
  data: ChartData[]
  title: string
  color?: string
}) {
  const maxValue = Math.max(...data.map(d => d.value))

  const colorClasses = {
    neon: 'glass-neon border-neon-400/30',
    electric: 'glass-electric border-electric-400/30',
    cyber: 'glass-cyber border-cyber-400/30',
    aurora: 'glass-aurora border-aurora-400/30',
    plasma: 'glass-plasma border-plasma-400/30',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <Card
        className={`transition-all duration-300 ${colorClasses[color as keyof typeof colorClasses]}`}
      >
        <CardHeader>
          <CardTitle className='gradient-text'>{title}</CardTitle>
          <CardDescription>Performance over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex items-end space-x-2 h-40'>
            {data.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ height: 0 }}
                animate={{ height: `${(item.value / maxValue) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                className='flex-1 flex flex-col items-center'
              >
                <motion.div
                  className={`w-full rounded-t-md bg-gradient-to-t ${item.color} mb-2`}
                  whileHover={{ scale: 1.05 }}
                />
                <span className='text-xs text-muted-foreground'>
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function DonutChart({
  data,
  title,
  color = 'electric',
}: {
  data: ChartData[]
  title: string
  color?: string
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  const colorClasses = {
    neon: 'glass-neon border-neon-400/30',
    electric: 'glass-electric border-electric-400/30',
    cyber: 'glass-cyber border-cyber-400/30',
    aurora: 'glass-aurora border-aurora-400/30',
    plasma: 'glass-plasma border-plasma-400/30',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Card
        className={`transition-all duration-300 ${colorClasses[color as keyof typeof colorClasses]}`}
      >
        <CardHeader>
          <CardTitle className='gradient-text'>{title}</CardTitle>
          <CardDescription>Distribution breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex items-center space-x-6'>
            {/* Simple visual representation */}
            <div className='relative w-32 h-32 rounded-full bg-gradient-to-r from-cyber-400/20 to-aurora-400/20 flex items-center justify-center'>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className='w-20 h-20 rounded-full bg-background flex items-center justify-center'
              >
                <PieChart className='h-8 w-8 text-electric-400' />
              </motion.div>
            </div>
            <div className='flex-1 space-y-2'>
              {data.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  className='flex items-center justify-between'
                >
                  <div className='flex items-center space-x-2'>
                    <div
                      className={`w-3 h-3 rounded-full bg-gradient-to-r ${item.color}`}
                    />
                    <span className='text-sm'>{item.label}</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <span className='text-sm font-medium'>
                      {item.value.toLocaleString()}
                    </span>
                    <Badge variant='outline' className='text-xs'>
                      {Math.round((item.value / total) * 100)}%
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function AnalyticsSection() {
  const { data: dashboardStats, isLoading } =
    api.analytics.getDashboardStats.useQuery()
  const { data: revenueChart } = api.analytics.getRevenueChart.useQuery({
    period: '7d',
  })
  const { data: activityFeed } = api.analytics.getActivityFeed.useQuery({
    limit: 5,
  })

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <LoadingSpinner />
      </div>
    )
  }

  const metricsData = [
    {
      title: 'Total Revenue',
      value: `$${dashboardStats?.totalRevenue?.toLocaleString() ?? '0'}`,
      change: {
        value: `+${dashboardStats?.revenueGrowth?.toFixed(1) ?? '0'}%`,
        type:
          (dashboardStats?.revenueGrowth ?? 0) >= 0
            ? ('up' as const)
            : ('down' as const),
      },
      icon: DollarSign,
      color: 'neon',
    },
    {
      title: 'Total Users',
      value: dashboardStats?.totalUsers?.toLocaleString() ?? '0',
      change: {
        value: `+${dashboardStats?.userGrowth?.toFixed(1) ?? '0'}%`,
        type:
          (dashboardStats?.userGrowth ?? 0) >= 0
            ? ('up' as const)
            : ('down' as const),
      },
      icon: Users,
      color: 'electric',
    },
    {
      title: 'Organization Users',
      value: dashboardStats?.organizationUsers?.toLocaleString() ?? '0',
      change: {
        value: `+15%`,
        type: 'up' as const,
      },
      icon: Eye,
      color: 'cyber',
    },
    {
      title: 'Conversion Rate',
      value: `${dashboardStats?.conversionRate?.toFixed(1) ?? '0'}%`,
      change: {
        value: `${dashboardStats?.conversionGrowth ? (dashboardStats.conversionGrowth >= 0 ? '+' : '') + dashboardStats.conversionGrowth.toFixed(1) : '0'}%`,
        type:
          (dashboardStats?.conversionGrowth ?? 0) >= 0
            ? ('up' as const)
            : ('down' as const),
      },
      icon: Activity,
      color: 'aurora',
    },
  ]

  const colorGradients = [
    'from-neon-400 to-neon-600',
    'from-electric-400 to-electric-600',
    'from-cyber-400 to-cyber-600',
    'from-aurora-400 to-aurora-600',
    'from-plasma-400 to-plasma-600',
    'from-neon-400 to-electric-600',
    'from-cyber-400 to-aurora-600',
  ]

  const barChartData: ChartData[] = revenueChart?.map((item, index) => ({
    label: item.name ?? item.date ?? 'N/A',
    value: item.revenue,
    color: colorGradients[index % colorGradients.length]!,
  })) ?? [
    { label: 'Mon', value: 12, color: 'from-neon-400 to-neon-600' },
    { label: 'Tue', value: 19, color: 'from-electric-400 to-electric-600' },
    { label: 'Wed', value: 15, color: 'from-cyber-400 to-cyber-600' },
    { label: 'Thu', value: 25, color: 'from-aurora-400 to-aurora-600' },
    { label: 'Fri', value: 22, color: 'from-plasma-400 to-plasma-600' },
    { label: 'Sat', value: 18, color: 'from-neon-400 to-electric-600' },
    { label: 'Sun', value: 16, color: 'from-cyber-400 to-aurora-600' },
  ]

  const donutChartData: ChartData[] = [
    { label: 'Direct', value: 1200, color: 'from-neon-400 to-neon-600' },
    { label: 'Social', value: 800, color: 'from-electric-400 to-electric-600' },
    { label: 'Email', value: 600, color: 'from-cyber-400 to-cyber-600' },
    { label: 'Referral', value: 400, color: 'from-aurora-400 to-aurora-600' },
  ]

  return (
    <div className='space-y-8'>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='text-center space-y-4'
      >
        <h2 className='text-3xl font-bold gradient-text'>
          Analytics Dashboard
        </h2>
        <p className='text-muted-foreground max-w-2xl mx-auto'>
          Track your performance with real-time analytics and beautiful
          visualizations
        </p>
      </motion.div>

      {/* Metrics Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {metricsData.map((metric, index) => (
          <MetricCard key={metric.title} {...metric} delay={index * 0.1} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <SimpleBarChart
          data={barChartData}
          title='Daily Activity'
          color='cyber'
        />
        <DonutChart
          data={donutChartData}
          title='Traffic Sources'
          color='electric'
        />
      </div>

      {/* Additional Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className='grid grid-cols-1 md:grid-cols-3 gap-6'
      >
        <Card className='glass-aurora border-aurora-400/30'>
          <CardHeader>
            <CardTitle className='text-lg gradient-text'>
              Top Performing
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex justify-between items-center'>
              <span className='text-sm'>Dashboard Page</span>
              <Badge className='gradient-aurora text-white'>+45%</Badge>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm'>Settings Page</span>
              <Badge className='gradient-aurora text-white'>+32%</Badge>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm'>Pricing Page</span>
              <Badge className='gradient-aurora text-white'>+28%</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className='glass-plasma border-plasma-400/30'>
          <CardHeader>
            <CardTitle className='text-lg gradient-text'>
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='text-sm text-muted-foreground'>
              {activityFeed?.map((activity: any, index: number) => {
                const colors = [
                  'neon-400',
                  'electric-400',
                  'cyber-400',
                  'aurora-400',
                  'plasma-400',
                ]
                const colorClass = colors[index % colors.length]

                return (
                  <div
                    key={activity.id}
                    className='flex items-center space-x-2 mb-2'
                  >
                    <div className={`w-2 h-2 rounded-full bg-${colorClass}`} />
                    <span>{activity.description}</span>
                  </div>
                )
              }) ?? (
                <>
                  <div className='flex items-center space-x-2 mb-2'>
                    <div className='w-2 h-2 rounded-full bg-neon-400' />
                    <span>New user signed up</span>
                  </div>
                  <div className='flex items-center space-x-2 mb-2'>
                    <div className='w-2 h-2 rounded-full bg-electric-400' />
                    <span>Payment processed</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <div className='w-2 h-2 rounded-full bg-cyber-400' />
                    <span>Feature update deployed</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className='glass-neon border-neon-400/30'>
          <CardHeader>
            <CardTitle className='text-lg gradient-text'>
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className='w-full p-2 rounded-md glass-electric border-electric-400/30 text-sm text-electric-400 hover:bg-electric-400/10 transition-colors'
            >
              Export Data
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className='w-full p-2 rounded-md glass-cyber border-cyber-400/30 text-sm text-cyber-400 hover:bg-cyber-400/10 transition-colors'
            >
              Generate Report
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className='w-full p-2 rounded-md glass-aurora border-aurora-400/30 text-sm text-aurora-400 hover:bg-aurora-400/10 transition-colors'
            >
              Schedule Analysis
            </motion.button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
