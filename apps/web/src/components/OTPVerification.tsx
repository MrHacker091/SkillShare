'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CheckCircle, Clock, Mail, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'

interface OTPVerificationProps {
  email: string
  onVerify: (otp: string) => Promise<boolean>
  onResend: () => void
  loading?: boolean
}

export function OTPVerification({ email, onVerify, onResend, loading = false }: OTPVerificationProps) {
  const [otp, setOtp] = useState('')
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  const handleVerify = async () => {
    if (otp.length !== 6) return

    setIsVerifying(true)
    try {
      const success = await onVerify(otp)
      setVerificationStatus(success ? 'success' : 'error')
      if (!success) {
        setOtp('')
      }
    } catch (error) {
      setVerificationStatus('error')
      setOtp('')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = () => {
    onResend()
    setCountdown(60)
    setCanResend(false)
    setOtp('')
    setVerificationStatus('idle')
  }

  const handleOtpChange = (value: string) => {
    if (value.length <= 6 && /^\d*$/.test(value)) {
      setOtp(value)
      setVerificationStatus('idle')
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-blue-100 p-3">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>
          We've sent a 6-digit code to
          <br />
          <strong>{email}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-center">
            <Input
              type="text"
              inputMode="numeric"
              placeholder="000000"
              value={otp}
              onChange={(e) => handleOtpChange(e.target.value)}
              className={`text-center text-2xl tracking-wider font-mono w-40 ${verificationStatus === 'error' ? 'border-red-500' : ''
                }`}
              maxLength={6}
              disabled={isVerifying || loading}
            />
          </div>
          {verificationStatus === 'error' && (
            <p className="text-sm text-red-600 text-center mt-2">
              Invalid code. Please try again.
            </p>
          )}
          {verificationStatus === 'success' && (
            <div className="flex items-center justify-center mt-2 text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              <p className="text-sm">Code verified successfully!</p>
            </div>
          )}
        </div>

        <Button
          onClick={handleVerify}
          disabled={otp.length !== 6 || isVerifying || loading}
          className="w-full"
        >
          {isVerifying ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : null}
          {isVerifying ? 'Verifying...' : 'Verify Code'}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          <p>Didn't receive the code?</p>
          <Button
            variant="link"
            onClick={handleResend}
            disabled={!canResend || loading}
            className="p-0 h-auto"
          >
            {canResend ? (
              'Resend code'
            ) : (
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Resend in {countdown}s
              </span>
            )}
          </Button>
        </div>

        <div className="text-center">
          <Badge variant="outline" className="text-xs">
            Demo Mode: Check console for OTP
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}