'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthSession } from '@/hooks/useAuthSession'
import { CheckCircle, Crown, Palette, Shield, Star, Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface RoleUpgradeCardProps {
  onUpgradeSuccess?: () => void
}

export function RoleUpgradeCard({ onUpgradeSuccess }: RoleUpgradeCardProps) {
  const { data: session } = useAuthSession()
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const user = session?.user
  const isCustomer = user?.role === 'CUSTOMER' || !user?.role
  const isCreator = user?.role === 'CREATOR'

  const handleUpgradeToCreator = async () => {
    if (!user?.id) {
      setError('User not authenticated')
      return
    }

    setIsUpgrading(true)
    setError(null)

    try {
      // Clean production upgrade - only use NextAuth sessions
      const requestBody = {
        userId: user.id,
        userEmail: user.email,
        targetRole: 'CREATOR'
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

      onUpgradeSuccess?.()

      // Redirect to creator dashboard
      router.push('/dashboard/creator')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsUpgrading(false)
    }
  }

  if (!user) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Please sign in to manage your role</p>
        </CardContent>
      </Card>
    )
  }

  if (isCreator) {
    return (
      <Card className="w-full max-w-md border-green-200 bg-green-50">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-green-100 p-3">
            <Crown className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-green-800">Creator Account</CardTitle>
          <CardDescription className="text-green-600">
            You have full access to creator features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-green-700">
              <CheckCircle className="h-4 w-4" />
              Create and sell projects
            </div>
            <div className="flex items-center gap-2 text-sm text-green-700">
              <CheckCircle className="h-4 w-4" />
              Manage client communications
            </div>
            <div className="flex items-center gap-2 text-sm text-green-700">
              <CheckCircle className="h-4 w-4" />
              Access creator analytics
            </div>
            <div className="flex items-center gap-2 text-sm text-green-700">
              <CheckCircle className="h-4 w-4" />
              Earn from your work
            </div>
          </div>
          <Button
            onClick={() => router.push('/dashboard/creator')}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Go to Creator Dashboard
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-purple-100 p-3">
          <Palette className="h-6 w-6 text-purple-600" />
        </div>
        <CardTitle>Become a Creator</CardTitle>
        <CardDescription>
          Unlock the ability to showcase and sell your creative work
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="text-center">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            👤 Customer Account
          </Badge>
          <p className="text-sm text-muted-foreground mt-2">
            Upgrade to start selling your creative work
          </p>
        </div>

        {/* Creator Benefits */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Creator Benefits:</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-purple-600" />
              Create project listings
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Upload className="h-4 w-4 text-purple-600" />
              Upload and sell digital products
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-purple-600" />
              Secure payment processing
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Crown className="h-4 w-4 text-purple-600" />
              Enhanced profile visibility
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Upgrade Button */}
        <Button
          onClick={handleUpgradeToCreator}
          disabled={isUpgrading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {isUpgrading ? 'Upgrading...' : 'Upgrade to Creator'}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Free upgrade • No additional fees • Instant activation
        </p>
      </CardContent>
    </Card>
  )
}