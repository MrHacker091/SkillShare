'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAuthSession } from '@/hooks/useAuthSession'
import { CheckCircle, Crown, GraduationCap, Palette, Shield, Star, Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface CreatorUpgradeFormProps {
  onUpgradeSuccess?: () => void
}

export function CreatorUpgradeForm({ onUpgradeSuccess }: CreatorUpgradeFormProps) {
  const { data: session } = useAuthSession()
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    university: '',
    major: '',
    graduationYear: '',
    skills: '',
    portfolio: '',
    experience: '',
    motivation: ''
  })

  const user = session?.user
  const isCustomer = user?.role === 'CUSTOMER' || !user?.role
  const isCreator = user?.role === 'CREATOR'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.id) {
      setError('User not authenticated')
      return
    }

    // Validate required fields
    if (!formData.university || !formData.major || !formData.skills) {
      setError('Please fill in all required fields')
      return
    }

    setIsUpgrading(true)
    setError(null)

    try {
      // Clean production upgrade - only use NextAuth sessions
      const requestBody = {
        userId: user.id,
        userEmail: user.email,
        targetRole: 'CREATOR',
        creatorData: formData
      }

      const response = await fetch('/api/user/upgrade-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upgrade role')
      }

      // Success! Redirect to creator dashboard
      setShowForm(false)
      onUpgradeSuccess?.()
      router.push('/dashboard/creator')
      router.refresh()

    } catch (error: any) {
      setError(error.message || 'Upgrade failed. Please try again.')
    } finally {
      setIsUpgrading(false)
    }
  }

  if (isCreator) {
    return (
      <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/50">
              <Crown className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-100">Creator Account Active</h3>
              <p className="text-sm text-green-600 dark:text-green-400">
                You already have creator privileges
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!isCustomer) {
    return null
  }

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:border-blue-800 dark:from-blue-950/50 dark:to-indigo-950/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-2">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-blue-900 dark:text-blue-100">
                Become a Creator
              </CardTitle>
              <CardDescription className="text-blue-600 dark:text-blue-400">
                Start showcasing your skills and earning money
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
            Student Creators
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Benefits */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2 text-sm">
            <Upload className="h-4 w-4 text-blue-500" />
            <span>Upload Portfolio</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Palette className="h-4 w-4 text-blue-500" />
            <span>Showcase Skills</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Shield className="h-4 w-4 text-blue-500" />
            <span>Verified Profile</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Star className="h-4 w-4 text-blue-500" />
            <span>Earn Money</span>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
            {error}
          </div>
        )}

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              size="lg"
            >
              <Crown className="h-4 w-4 mr-2" />
              Apply to Become Creator
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-500" />
                Creator Application Form
              </DialogTitle>
              <DialogDescription>
                Please provide your academic and professional information to upgrade to a Creator account.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Academic Information */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="university">University *</Label>
                    <Input
                      id="university"
                      value={formData.university}
                      onChange={(e) => setFormData(prev => ({ ...prev, university: e.target.value }))}
                      placeholder="Your University Name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="major">Major/Field of Study *</Label>
                    <Input
                      id="major"
                      value={formData.major}
                      onChange={(e) => setFormData(prev => ({ ...prev, major: e.target.value }))}
                      placeholder="e.g., Computer Science, Graphic Design"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="graduationYear">Expected Graduation Year</Label>
                  <Input
                    id="graduationYear"
                    value={formData.graduationYear}
                    onChange={(e) => setFormData(prev => ({ ...prev, graduationYear: e.target.value }))}
                    placeholder="e.g., 2025"
                    type="number"
                    min="2020"
                    max="2030"
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills & Expertise *</Label>
                  <Textarea
                    id="skills"
                    value={formData.skills}
                    onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                    placeholder="List your key skills (e.g., Web Development, UI/UX Design, Photography)"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolio">Portfolio URL</Label>
                  <Input
                    id="portfolio"
                    value={formData.portfolio}
                    onChange={(e) => setFormData(prev => ({ ...prev, portfolio: e.target.value }))}
                    placeholder="https://yourportfolio.com"
                    type="url"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Previous Experience</Label>
                  <Textarea
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                    placeholder="Describe any relevant work experience, projects, or achievements"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motivation">Why do you want to become a Creator?</Label>
                  <Textarea
                    id="motivation"
                    value={formData.motivation}
                    onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
                    placeholder="Tell us about your goals and what you hope to achieve"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUpgrading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  {isUpgrading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <p className="text-xs text-center text-muted-foreground">
          Your application will be reviewed and approved instantly for verified students
        </p>
      </CardContent>
    </Card>
  )
}