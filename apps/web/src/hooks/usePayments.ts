import { useEffect, useState } from 'react'

export interface PaymentMethod {
  id: string
  name: string
  type: 'mobile_wallet' | 'bank' | 'card'
  currency: 'PKR'
  isAvailable: boolean
  fees: {
    percentage: number
    fixed: number
  }
}

export interface Payment {
  id: string
  userId: string
  projectId: string
  creatorId: string
  amount: number
  feeAmount: number
  totalAmount: number
  platformCommission: number
  creatorAmount: number
  currency: 'PKR'
  paymentMethod: string
  paymentMethodId: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  description: string
  createdAt: string
  updatedAt: string
  metadata: {
    phoneNumber?: string
  }
}

export interface Wallet {
  userId: string
  balance: number
  currency: 'PKR'
  transactions: Array<{
    id: string
    type: 'credit' | 'debit' | 'withdrawal'
    amount: number
    description: string
    timestamp: string
  }>
}

export const usePayments = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch available payment methods
  const fetchPaymentMethods = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/payments?action=methods')
      const data = await response.json()

      if (response.ok) {
        setPaymentMethods(data.paymentMethods)
      } else {
        setError(data.error || 'Failed to fetch payment methods')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // Create payment
  const createPayment = async (
    projectId: string,
    creatorId: string,
    amount: number,
    paymentMethodId: string,
    phoneNumber?: string,
    description?: string
  ): Promise<{ success: boolean; payment?: Payment; error?: string }> => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'create_payment',
          userId: 'current_user', // This would come from session
          projectId,
          creatorId,
          amount,
          paymentMethodId,
          phoneNumber,
          description
        })
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true, payment: data.payment }
      } else {
        return { success: false, error: data.error }
      }
    } catch (err) {
      return { success: false, error: 'Network error occurred' }
    } finally {
      setIsLoading(false)
    }
  }

  // Check payment status
  const checkPaymentStatus = async (paymentId: string): Promise<Payment | null> => {
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'check_status',
          paymentId
        })
      })

      const data = await response.json()
      return response.ok ? data.payment : null
    } catch (err) {
      setError('Failed to check payment status')
      return null
    }
  }

  // Get user wallet
  const getUserWallet = async (userId: string): Promise<Wallet | null> => {
    try {
      const response = await fetch(`/api/payments?action=wallet&userId=${userId}`)
      const data = await response.json()

      return response.ok ? data.wallet : null
    } catch (err) {
      setError('Failed to fetch wallet information')
      return null
    }
  }

  // Get payment history
  const getPaymentHistory = async (userId: string): Promise<Payment[]> => {
    try {
      const response = await fetch(`/api/payments?action=transactions&userId=${userId}`)
      const data = await response.json()

      return response.ok ? data.transactions : []
    } catch (err) {
      setError('Failed to fetch payment history')
      return []
    }
  }

  // Request withdrawal
  const requestWithdrawal = async (
    amount: number,
    paymentMethodId: string,
    phoneNumber?: string
  ): Promise<{ success: boolean; withdrawal?: any; error?: string }> => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'withdraw',
          userId: 'current_user', // This would come from session
          amount,
          paymentMethodId,
          phoneNumber
        })
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true, withdrawal: data.withdrawal }
      } else {
        return { success: false, error: data.error }
      }
    } catch (err) {
      return { success: false, error: 'Network error occurred' }
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate payment fees
  const calculateFees = (amount: number, paymentMethodId: string) => {
    const method = paymentMethods.find(pm => pm.id === paymentMethodId)
    if (!method) return { feeAmount: 0, totalAmount: amount }

    const feeAmount = (amount * method.fees.percentage / 100) + method.fees.fixed
    const totalAmount = amount + feeAmount

    return { feeAmount, totalAmount }
  }

  // Load payment methods on mount
  useEffect(() => {
    fetchPaymentMethods()
  }, [])

  return {
    paymentMethods,
    isLoading,
    error,
    createPayment,
    checkPaymentStatus,
    getUserWallet,
    getPaymentHistory,
    requestWithdrawal,
    calculateFees,
    refetchPaymentMethods: fetchPaymentMethods
  }
}