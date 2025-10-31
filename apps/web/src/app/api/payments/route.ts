import { NextRequest, NextResponse } from 'next/server'

// Mock payment storage (in real app, this would be a database)
const payments: any[] = []
const wallets: any[] = []

// Pakistani Payment Methods
interface PaymentMethod {
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

const PAKISTANI_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'sadapay',
    name: 'SadaPay',
    type: 'mobile_wallet',
    currency: 'PKR',
    isAvailable: true,
    fees: {
      percentage: 2.5, // 2.5% fee
      fixed: 0 // No fixed fee
    }
  },
  {
    id: 'jazzcash',
    name: 'JazzCash',
    type: 'mobile_wallet',
    currency: 'PKR',
    isAvailable: true,
    fees: {
      percentage: 3.0, // 3% fee
      fixed: 5 // PKR 5 fixed fee
    }
  },
  {
    id: 'easypaisa',
    name: 'EasyPaisa',
    type: 'mobile_wallet',
    currency: 'PKR',
    isAvailable: true,
    fees: {
      percentage: 2.8, // 2.8% fee
      fixed: 3 // PKR 3 fixed fee
    }
  },
  {
    id: 'hbl_bank',
    name: 'HBL Bank Transfer',
    type: 'bank',
    currency: 'PKR',
    isAvailable: true,
    fees: {
      percentage: 1.5, // 1.5% fee
      fixed: 20 // PKR 20 fixed fee
    }
  }
]

// Get available payment methods
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const userId = searchParams.get('userId')

    if (action === 'methods') {
      return NextResponse.json({
        paymentMethods: PAKISTANI_PAYMENT_METHODS,
        currency: 'PKR'
      })
    }

    if (action === 'wallet' && userId) {
      // Get user wallet balance
      const userWallet = wallets.find(w => w.userId === userId) || {
        userId,
        balance: 0,
        currency: 'PKR',
        transactions: []
      }

      return NextResponse.json({ wallet: userWallet })
    }

    if (action === 'transactions' && userId) {
      // Get user payment history
      const userPayments = payments.filter(p => p.userId === userId)
      return NextResponse.json({ transactions: userPayments })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Error processing payment request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Process payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      action,
      userId,
      amount,
      paymentMethodId,
      projectId,
      creatorId,
      phoneNumber,
      description
    } = body

    if (action === 'create_payment') {
      // Validate required fields
      if (!userId || !amount || !paymentMethodId || !projectId || !creatorId) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
      }

      const paymentMethod = PAKISTANI_PAYMENT_METHODS.find(pm => pm.id === paymentMethodId)
      if (!paymentMethod) {
        return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 })
      }

      // Calculate fees
      const feeAmount = (amount * paymentMethod.fees.percentage / 100) + paymentMethod.fees.fixed
      const totalAmount = amount + feeAmount
      const platformCommission = amount * 0.05 // 5% platform commission
      const creatorAmount = amount - platformCommission

      // Create payment record
      const payment = {
        id: `pay_${Date.now()}_${Math.random().toString(36).substring(2)}`,
        userId,
        projectId,
        creatorId,
        amount,
        feeAmount,
        totalAmount,
        platformCommission,
        creatorAmount,
        currency: 'PKR',
        paymentMethod: paymentMethod.name,
        paymentMethodId,
        status: 'pending',
        description: description || 'Project purchase',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {
          phoneNumber: phoneNumber || null
        }
      }

      // Store payment
      payments.push(payment)

      // In a real app, here you would:
      // 1. Call the actual SadaPay/JazzCash API
      // 2. Handle webhooks for payment confirmation
      // 3. Update order status
      // 4. Send notifications

      // Simulate payment processing
      setTimeout(() => {
        const paymentIndex = payments.findIndex(p => p.id === payment.id)
        if (paymentIndex !== -1) {
          payments[paymentIndex].status = 'completed'
          payments[paymentIndex].updatedAt = new Date().toISOString()

          // Update creator wallet
          updateCreatorWallet(creatorId, creatorAmount)
        }
      }, 3000) // Simulate 3-second processing

      return NextResponse.json({
        success: true,
        payment,
        message: 'Payment initiated successfully'
      })
    }

    if (action === 'check_status') {
      const { paymentId } = body
      const payment = payments.find(p => p.id === paymentId)

      if (!payment) {
        return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
      }

      return NextResponse.json({ payment })
    }

    if (action === 'withdraw') {
      // Creator withdrawal request
      if (!userId || !amount || !paymentMethodId) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
      }

      const userWallet = wallets.find(w => w.userId === userId)
      if (!userWallet || userWallet.balance < amount) {
        return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
      }

      const paymentMethod = PAKISTANI_PAYMENT_METHODS.find(pm => pm.id === paymentMethodId)
      if (!paymentMethod) {
        return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 })
      }

      // Calculate withdrawal fees
      const feeAmount = (amount * paymentMethod.fees.percentage / 100) + paymentMethod.fees.fixed
      const netAmount = amount - feeAmount

      // Create withdrawal record
      const withdrawal = {
        id: `with_${Date.now()}_${Math.random().toString(36).substring(2)}`,
        userId,
        amount,
        feeAmount,
        netAmount,
        currency: 'PKR',
        paymentMethod: paymentMethod.name,
        paymentMethodId,
        status: 'processing',
        type: 'withdrawal',
        createdAt: new Date().toISOString(),
        metadata: {
          phoneNumber: phoneNumber || null
        }
      }

      // Update wallet balance
      userWallet.balance -= amount
      userWallet.transactions.push({
        id: withdrawal.id,
        type: 'withdrawal',
        amount: -amount,
        description: `Withdrawal via ${paymentMethod.name}`,
        timestamp: new Date().toISOString()
      })

      payments.push(withdrawal)

      return NextResponse.json({
        success: true,
        withdrawal,
        message: 'Withdrawal request submitted'
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Error processing payment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to update creator wallet
function updateCreatorWallet(creatorId: string, amount: number) {
  let wallet = wallets.find(w => w.userId === creatorId)

  if (!wallet) {
    wallet = {
      userId: creatorId,
      balance: 0,
      currency: 'PKR',
      transactions: []
    }
    wallets.push(wallet)
  }

  wallet.balance += amount
  wallet.transactions.push({
    id: `trans_${Date.now()}_${Math.random().toString(36).substring(2)}`,
    type: 'credit',
    amount,
    description: 'Payment received for project',
    timestamp: new Date().toISOString()
  })
}