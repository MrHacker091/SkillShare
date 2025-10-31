'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePayments } from '@/hooks/usePayments'
import { AlertCircle, Building, CheckCircle2, CreditCard, Smartphone } from 'lucide-react'
import { useState } from 'react'

interface PaymentFormProps {
  projectId: string
  creatorId: string
  amount: number
  title: string
  onSuccess?: (paymentId: string) => void
  onCancel?: () => void
}

export default function PaymentForm({
  projectId,
  creatorId,
  amount,
  title,
  onSuccess,
  onCancel
}: PaymentFormProps) {
  const {
    paymentMethods,
    isLoading,
    error,
    createPayment,
    checkPaymentStatus,
    calculateFees
  } = usePayments()

  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle')
  const [paymentId, setPaymentId] = useState<string>('')
  const [statusMessage, setStatusMessage] = useState('')

  const selectedPaymentMethod = paymentMethods.find(pm => pm.id === selectedMethod)
  const { feeAmount, totalAmount } = selectedMethod ? calculateFees(amount, selectedMethod) : { feeAmount: 0, totalAmount: amount }

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'mobile_wallet':
        return <Smartphone className="w-5 h-5" />
      case 'bank':
        return <Building className="w-5 h-5" />
      case 'card':
        return <CreditCard className="w-5 h-5" />
      default:
        return <CreditCard className="w-5 h-5" />
    }
  }

  const handlePayment = async () => {
    if (!selectedMethod || !phoneNumber) {
      setStatusMessage('Please select a payment method and enter phone number')
      return
    }

    setIsProcessing(true)
    setPaymentStatus('processing')
    setStatusMessage('Processing payment...')

    try {
      const result = await createPayment(
        projectId,
        creatorId,
        amount,
        selectedMethod,
        phoneNumber,
        `Purchase: ${title}`
      )

      if (result.success && result.payment) {
        setPaymentId(result.payment.id)
        setStatusMessage('Payment initiated. Checking status...')

        // Poll payment status
        let attempts = 0
        const maxAttempts = 10
        const pollStatus = setInterval(async () => {
          attempts++
          const payment = await checkPaymentStatus(result.payment!.id)

          if (payment?.status === 'completed') {
            setPaymentStatus('success')
            setStatusMessage('Payment completed successfully!')
            clearInterval(pollStatus)
            setTimeout(() => {
              onSuccess?.(payment.id)
            }, 2000)
          } else if (payment?.status === 'failed' || attempts >= maxAttempts) {
            setPaymentStatus('failed')
            setStatusMessage('Payment failed. Please try again.')
            clearInterval(pollStatus)
          }
        }, 1000)

      } else {
        setPaymentStatus('failed')
        setStatusMessage(result.error || 'Payment failed')
      }
    } catch (err) {
      setPaymentStatus('failed')
      setStatusMessage('An error occurred during payment')
    } finally {
      setIsProcessing(false)
    }
  }

  if (paymentStatus === 'success') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-4">{statusMessage}</p>
            <p className="text-sm text-gray-500">
              Payment ID: {paymentId}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-lg">Complete Payment</CardTitle>
        <p className="text-sm text-gray-600">{title}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment Summary */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex justify-between text-sm mb-1">
            <span>Project Price:</span>
            <span>PKR {amount.toLocaleString()}</span>
          </div>
          {selectedMethod && (
            <>
              <div className="flex justify-between text-sm mb-1">
                <span>Payment Fee:</span>
                <span>PKR {feeAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-1">
                <span>Total Amount:</span>
                <span>PKR {totalAmount.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-2">
          <Label htmlFor="payment-method">Payment Method</Label>
          <Select value={selectedMethod} onValueChange={setSelectedMethod}>
            <SelectTrigger>
              <SelectValue placeholder="Choose payment method" />
            </SelectTrigger>
            <SelectContent>
              {paymentMethods.map((method) => (
                <SelectItem key={method.id} value={method.id}>
                  <div className="flex items-center gap-2">
                    {getPaymentIcon(method.type)}
                    <span>{method.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {method.fees.percentage}% + PKR {method.fees.fixed}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Phone Number Input */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="03XX-XXXXXXX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full"
          />
          <p className="text-xs text-gray-500">
            Enter your {selectedPaymentMethod?.name || 'mobile wallet'} registered number
          </p>
        </div>

        {/* Payment Instructions */}
        {selectedPaymentMethod && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-700">
                <p className="font-medium mb-1">Payment Instructions:</p>
                <ul className="space-y-1">
                  <li>• You will receive a payment request on your {selectedPaymentMethod.name} app</li>
                  <li>• Approve the transaction within 5 minutes</li>
                  <li>• Payment will be processed automatically</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Status Message */}
        {statusMessage && (
          <div className={`p-3 rounded-lg text-sm ${paymentStatus === 'failed' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
            }`}>
            {statusMessage}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isProcessing || paymentStatus === 'processing'}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            disabled={!selectedMethod || !phoneNumber || isProcessing || paymentStatus === 'processing'}
            className="flex-1"
          >
            {isProcessing ? 'Processing...' : `Pay PKR ${totalAmount.toFixed(2)}`}
          </Button>
        </div>

        {/* Loading State */}
        {paymentStatus === 'processing' && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Please wait...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}