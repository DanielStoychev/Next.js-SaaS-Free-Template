'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Zap,
  Save,
  AlertTriangle,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { api } from '@/trpc/react'
import { LoadingSpinner } from '@/components/ui/loading'

interface SettingsPageProps {}

interface SettingsSectionProps {
  title: string
  description: string
  icon: any
  children: React.ReactNode
  color?: string
  delay?: number
}

function SettingsSection({
  title,
  description,
  icon: Icon,
  children,
  color = 'neon',
  delay = 0,
}: SettingsSectionProps) {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <Card
        className={`transition-all duration-300 ${colorClasses[color as keyof typeof colorClasses]}`}
      >
        <CardHeader>
          <div className='flex items-center space-x-3'>
            <div
              className={`p-2 rounded-full bg-gradient-to-br from-${color}-400/20 to-${color}-600/10`}
            >
              <Icon
                className={`h-5 w-5 ${iconColors[color as keyof typeof iconColors]}`}
              />
            </div>
            <div>
              <CardTitle className='gradient-text'>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  )
}

export function SettingsPage({}: SettingsPageProps) {
  const { data: session } = useSession()
  const router = useRouter()

  // Fetch user profile data
  const { data: userProfile, isLoading: profileLoading } =
    api.user.getCurrentUser.useQuery()
  const { data: preferences, isLoading: preferencesLoading } =
    api.user.getPreferences.useQuery()

  // Mutations
  const updateProfile = api.user.updateProfile.useMutation()
  const changePassword = api.user.changePassword.useMutation()
  const updatePreferences = api.user.updatePreferences.useMutation()
  const deleteAccount = api.user.deleteAccount.useMutation()

  // Queries
  const exportDataQuery = api.user.exportData.useQuery(undefined, {
    enabled: false,
  })

  // Form states
  const [profileForm, setProfileForm] = React.useState({
    name: '',
    email: '',
  })
  const [passwordForm, setPasswordForm] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [deleteForm, setDeleteForm] = React.useState({
    password: '',
    confirmation: '',
  })

  // Update form when user data loads
  React.useEffect(() => {
    if (userProfile) {
      setProfileForm({
        name: userProfile.name || '',
        email: userProfile.email || '',
      })
    }
  }, [userProfile])

  const handleUpdateProfile = async () => {
    try {
      await updateProfile.mutateAsync({
        name: profileForm.name,
        email: profileForm.email,
      })
      alert('Profile updated successfully')
    } catch (error) {
      alert('Failed to update profile')
    }
  }

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match')
      return
    }

    try {
      await changePassword.mutateAsync({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      alert('Password changed successfully')
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error) {
      alert('Failed to change password')
    }
  }

  const handleExportData = async () => {
    try {
      const data = await exportDataQuery.refetch()
      if (data.data) {
        // Create and download JSON file
        const blob = new Blob([JSON.stringify(data.data, null, 2)], {
          type: 'application/json',
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `user-data-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        alert('Data exported successfully')
      }
    } catch (error) {
      alert('Failed to export data')
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteForm.confirmation !== 'DELETE') {
      alert('Please type DELETE to confirm')
      return
    }

    try {
      await deleteAccount.mutateAsync({
        password: deleteForm.password,
        confirmation: 'DELETE' as const,
      })
      alert('Account deleted successfully')
      router.push('/')
    } catch (error) {
      alert('Failed to delete account')
    }
  }

  if (profileLoading || preferencesLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <LoadingSpinner />
      </div>
    )
  }

  if (!session || !userProfile) {
    return (
      <div className='flex items-center justify-center h-64'>
        <p>Please sign in to access settings</p>
      </div>
    )
  }

  const user = userProfile
  return (
    <div className='min-h-screen relative overflow-hidden'>
      {/* Colorful animated background */}
      <div className='absolute inset-0 bg-gradient-to-br from-background via-background to-background/95' />
      <div className='absolute inset-0'>
        <div className='absolute top-0 left-0 w-96 h-96 bg-neon-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse' />
        <div className='absolute top-0 right-0 w-96 h-96 bg-electric-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse animation-delay-300' />
        <div className='absolute bottom-0 left-1/3 w-96 h-96 bg-cyber-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse animation-delay-600' />
        <div className='absolute bottom-0 right-1/3 w-96 h-96 bg-aurora-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse animation-delay-900' />
      </div>

      <div className='container mx-auto py-8 space-y-8 relative z-10'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='text-center space-y-4'
        >
          <h1 className='text-4xl font-bold gradient-text'>Settings</h1>
          <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
            Customize your account preferences and manage your SaaS experience
          </p>
          <div className='flex items-center justify-center space-x-2'>
            <Badge
              variant='outline'
              className='glass-electric border-electric-400/30 text-electric-400'
            >
              {user.role || 'USER'}
            </Badge>
            <Badge
              variant='outline'
              className='glass-neon border-neon-400/30 text-neon-400'
            >
              {user.email}
            </Badge>
          </div>
        </motion.div>

        {/* Settings Sections */}
        <div className='max-w-4xl mx-auto space-y-6'>
          <SettingsSection
            title='Profile Settings'
            description='Manage your personal information and profile details'
            icon={User}
            color='neon'
            delay={0.1}
          >
            <div className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label
                    htmlFor='name'
                    className='text-sm font-medium text-muted-foreground'
                  >
                    Name
                  </Label>
                  <Input
                    id='name'
                    value={profileForm.name}
                    onChange={e =>
                      setProfileForm(prev => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder='Enter your name'
                    className='mt-1'
                  />
                </div>
                <div>
                  <Label
                    htmlFor='email'
                    className='text-sm font-medium text-muted-foreground'
                  >
                    Email
                  </Label>
                  <Input
                    id='email'
                    type='email'
                    value={profileForm.email}
                    onChange={e =>
                      setProfileForm(prev => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder='Enter your email'
                    className='mt-1'
                  />
                </div>
              </div>
              <Button
                onClick={handleUpdateProfile}
                disabled={updateProfile.isPending}
                className='gradient-neon text-white hover:shadow-lg hover:shadow-neon-400/25'
              >
                {updateProfile.isPending ? (
                  <>
                    <div className='w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white/30 border-t-white' />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className='w-4 h-4 mr-2' />
                    Update Profile
                  </>
                )}
              </Button>
            </div>
          </SettingsSection>

          <SettingsSection
            title='Notifications'
            description='Configure how you receive updates and alerts'
            icon={Bell}
            color='electric'
            delay={0.2}
          >
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Email Notifications</p>
                  <p className='text-sm text-muted-foreground'>
                    Receive updates via email
                  </p>
                </div>
                <Button
                  variant='outline'
                  className='glass-electric border-electric-400/30'
                >
                  Enable
                </Button>
              </div>
              <Separator />
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Push Notifications</p>
                  <p className='text-sm text-muted-foreground'>
                    Browser notifications for important updates
                  </p>
                </div>
                <Button
                  variant='outline'
                  className='glass-electric border-electric-400/30'
                >
                  Configure
                </Button>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection
            title='Security'
            description='Manage your account security and privacy settings'
            icon={Shield}
            color='cyber'
            delay={0.3}
          >
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Two-Factor Authentication</p>
                  <p className='text-sm text-muted-foreground'>
                    Add an extra layer of security
                  </p>
                </div>
                <Button className='gradient-cyber text-white hover:shadow-lg hover:shadow-cyber-400/25'>
                  Setup 2FA
                </Button>
              </div>
              <Separator />
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Password</p>
                  <p className='text-sm text-muted-foreground'>
                    Change your account password
                  </p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant='outline'
                      className='glass-cyber border-cyber-400/30'
                    >
                      <Shield className='w-4 h-4 mr-2' />
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='glass-cyber border-cyber-400/30'>
                    <DialogHeader>
                      <DialogTitle className='gradient-text'>
                        Change Password
                      </DialogTitle>
                      <DialogDescription>
                        Enter your current password and choose a new one
                      </DialogDescription>
                    </DialogHeader>
                    <div className='space-y-4'>
                      <div>
                        <Label htmlFor='currentPassword'>
                          Current Password
                        </Label>
                        <Input
                          id='currentPassword'
                          type='password'
                          value={passwordForm.currentPassword}
                          onChange={e =>
                            setPasswordForm(prev => ({
                              ...prev,
                              currentPassword: e.target.value,
                            }))
                          }
                          placeholder='Enter current password'
                        />
                      </div>
                      <div>
                        <Label htmlFor='newPassword'>New Password</Label>
                        <Input
                          id='newPassword'
                          type='password'
                          value={passwordForm.newPassword}
                          onChange={e =>
                            setPasswordForm(prev => ({
                              ...prev,
                              newPassword: e.target.value,
                            }))
                          }
                          placeholder='Enter new password'
                        />
                      </div>
                      <div>
                        <Label htmlFor='confirmPassword'>
                          Confirm New Password
                        </Label>
                        <Input
                          id='confirmPassword'
                          type='password'
                          value={passwordForm.confirmPassword}
                          onChange={e =>
                            setPasswordForm(prev => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }))
                          }
                          placeholder='Confirm new password'
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={handleChangePassword}
                        disabled={changePassword.isPending}
                        className='gradient-cyber text-white'
                      >
                        {changePassword.isPending ? (
                          <>
                            <div className='w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white/30 border-t-white' />
                            Changing...
                          </>
                        ) : (
                          'Update Password'
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection
            title='Appearance'
            description='Customize the look and feel of your interface'
            icon={Palette}
            color='aurora'
            delay={0.4}
          >
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Theme</p>
                  <p className='text-sm text-muted-foreground'>
                    Choose your preferred color theme
                  </p>
                </div>
                <div className='flex space-x-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='glass-neon border-neon-400/30'
                  >
                    Neon
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='glass-electric border-electric-400/30'
                  >
                    Electric
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='glass-cyber border-cyber-400/30'
                  >
                    Cyber
                  </Button>
                </div>
              </div>
              <Separator />
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Layout Density</p>
                  <p className='text-sm text-muted-foreground'>
                    Adjust spacing and component sizes
                  </p>
                </div>
                <Button
                  variant='outline'
                  className='glass-aurora border-aurora-400/30'
                >
                  Customize
                </Button>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection
            title='Data & Storage'
            description='Manage your data, exports, and storage preferences'
            icon={Database}
            color='plasma'
            delay={0.5}
          >
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Export Data</p>
                  <p className='text-sm text-muted-foreground'>
                    Download your account data
                  </p>
                </div>
                <Button
                  onClick={handleExportData}
                  disabled={exportDataQuery.isFetching}
                  variant='outline'
                  className='glass-plasma border-plasma-400/30'
                >
                  {exportDataQuery.isFetching ? (
                    <>
                      <div className='w-4 h-4 mr-2 animate-spin rounded-full border-2 border-plasma-400/30 border-t-plasma-400' />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Database className='w-4 h-4 mr-2' />
                      Export
                    </>
                  )}
                </Button>
              </div>
              <Separator />
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Storage Usage</p>
                  <p className='text-sm text-muted-foreground'>
                    Monitor your storage consumption
                  </p>
                </div>
                <Badge
                  variant='outline'
                  className='glass-plasma border-plasma-400/30 text-plasma-400'
                >
                  2.4 GB / 10 GB
                </Badge>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection
            title='Performance'
            description='Optimize performance and advanced settings'
            icon={Zap}
            color='neon'
            delay={0.6}
          >
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Auto-sync</p>
                  <p className='text-sm text-muted-foreground'>
                    Automatically sync data across devices
                  </p>
                </div>
                <Button className='gradient-neon text-white hover:shadow-lg hover:shadow-neon-400/25'>
                  Enabled
                </Button>
              </div>
              <Separator />
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Cache Settings</p>
                  <p className='text-sm text-muted-foreground'>
                    Manage local cache and performance
                  </p>
                </div>
                <Button
                  variant='outline'
                  className='glass-neon border-neon-400/30'
                >
                  Clear Cache
                </Button>
              </div>
            </div>
          </SettingsSection>

          {/* Danger Zone */}
          <SettingsSection
            title='Danger Zone'
            description='Irreversible account actions - proceed with caution'
            icon={AlertTriangle}
            color='aurora'
            delay={0.7}
          >
            <div className='space-y-4'>
              <div className='p-4 border border-red-300 bg-red-50 dark:bg-red-900/10 dark:border-red-800 rounded-lg'>
                <div className='flex items-start space-x-3'>
                  <AlertTriangle className='w-5 h-5 text-red-500 mt-0.5 flex-shrink-0' />
                  <div className='flex-1'>
                    <h4 className='text-sm font-semibold text-red-800 dark:text-red-400'>
                      Delete Account
                    </h4>
                    <p className='text-sm text-red-700 dark:text-red-300 mt-1'>
                      Once you delete your account, there is no going back. This
                      will permanently delete your profile, posts, and all
                      associated data.
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant='destructive'
                          size='sm'
                          className='mt-3'
                        >
                          Delete Account
                        </Button>
                      </DialogTrigger>
                      <DialogContent className='glass-aurora border-red-400/30'>
                        <DialogHeader>
                          <DialogTitle className='text-red-400'>
                            Delete Account
                          </DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. Please enter your
                            password and type "DELETE" to confirm.
                          </DialogDescription>
                        </DialogHeader>
                        <div className='space-y-4'>
                          <div>
                            <Label htmlFor='deletePassword'>Password</Label>
                            <Input
                              id='deletePassword'
                              type='password'
                              value={deleteForm.password}
                              onChange={e =>
                                setDeleteForm(prev => ({
                                  ...prev,
                                  password: e.target.value,
                                }))
                              }
                              placeholder='Enter your password'
                            />
                          </div>
                          <div>
                            <Label htmlFor='deleteConfirmation'>
                              Type "DELETE" to confirm
                            </Label>
                            <Input
                              id='deleteConfirmation'
                              value={deleteForm.confirmation}
                              onChange={e =>
                                setDeleteForm(prev => ({
                                  ...prev,
                                  confirmation: e.target.value,
                                }))
                              }
                              placeholder='Type DELETE'
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant='destructive'
                            onClick={handleDeleteAccount}
                            disabled={deleteAccount.isPending}
                          >
                            {deleteAccount.isPending ? (
                              <>
                                <div className='w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white/30 border-t-white' />
                                Deleting...
                              </>
                            ) : (
                              'Delete My Account'
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </div>
          </SettingsSection>
        </div>
      </div>
    </div>
  )
}
