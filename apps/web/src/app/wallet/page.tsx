'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePayments, Wallet } from '@/hooks/usePayments'
import { useSession } from 'next-auth/react'
import {
  ArrowDownLeft,
  ArrowUpRight,
  Building,
  CreditCard,
  Download,
  History,
  Smartphone,
  Wallet as WalletIcon
} from 'lucide-react'
import { useEffect, useState } from 'react'

export default function WalletPage() {
  const { data: session } = useSession()
  const user = session?.user
  const {
    paymentMethods,
    getUserWallet,
    getPaymentHistory,
    requestWithdrawal,
    calculateFees,
    isLoading
  } = usePayments()

  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [paymentHistory, setPaymentHistory] = useState<any[]>([])
  const [withdrawalAmount, setWithdrawalAmount] = useState('')
  const [selectedWithdrawalMethod, setSelectedWithdrawalMethod] = useState('')
  const [withdrawalPhone, setWithdrawalPhone] = useState('')
  const [isWithdrawing, setIsWithdrawing] = useState(false)

  useEffect(() => {
    if (user?.email) {
      loadWalletData()
    }
  }, [user])

  const loadWalletData = async () => {
    if (!user?.email) return

    try {
      const walletData = await getUserWallet(user.email)
      const historyData = await getPaymentHistory(user.email)

      setWallet(walletData)
      setPaymentHistory(historyData)
    } catch (error) {
      console.error('Error loading wallet data:', error)
    }
  }

  const handleWithdrawal = async () => {
    if (!withdrawalAmount || !selectedWithdrawalMethod || !withdrawalPhone) {
      return
    }

    const amount = parseFloat(withdrawalAmount)
    if (amount <= 0 || (wallet && amount > wallet.balance)) {
      return
    }

    setIsWithdrawing(true)
    try {
      const result = await requestWithdrawal(amount, selectedWithdrawalMethod, withdrawalPhone)

      if (result.success) {
        setWithdrawalAmount('')
        setSelectedWithdrawalMethod('')
        setWithdrawalPhone('')
        await loadWalletData() // Refresh wallet data
      }
    } catch (error) {
      console.error('Withdrawal error:', error)
    } finally {
      setIsWithdrawing(false)
    }
  }

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'mobile_wallet':
        return <Smartphone className="w-4 h-4" />
      case 'bank':
        return <Building className="w-4 h-4" />
      case 'card':
        return <CreditCard className="w-4 h-4" />
      default:
        return <CreditCard className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const withdrawalFees = selectedWithdrawalMethod && withdrawalAmount
    ? calculateFees(parseFloat(withdrawalAmount), selectedWithdrawalMethod)
    : { feeAmount: 0, totalAmount: 0 }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Please sign in to view your wallet</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Wallet</h1>

        {/* Wallet Balance Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WalletIcon className="w-6 h-6" />
              Wallet Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">
              PKR {wallet ? wallet.balance.toLocaleString() : '0'}
            </div>
            <p className="text-gray-600">Available for withdrawal</p>
          </CardContent>
        </Card>

        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Transaction History
            </TabsTrigger>
            <TabsTrigger value="withdraw" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Withdraw Funds
            </TabsTrigger>
          </TabsList>

          {/* Transaction History */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {wallet?.transactions && wallet.transactions.length > 0 ? (
                  <div className="space-y-4">
                    {wallet.transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {transaction.type === 'credit' ? (
                            <ArrowDownLeft className="w-5 h-5 text-green-500" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5 text-red-500" />
                          )}
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-gray-500">{formatDate(transaction.timestamp)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {transaction.type === 'credit' ? '+' : ''}PKR {Math.abs(transaction.amount).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">No transactions yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Withdraw Funds */}
          <TabsContent value="withdraw">
            <Card>
              <CardHeader>
                <CardTitle>Withdraw Funds</CardTitle>
                <p className="text-sm text-gray-600">
                  Available balance: PKR {wallet ? wallet.balance.toLocaleString() : '0'}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Amount Input */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Withdrawal Amount (PKR)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    max={wallet?.balance || 0}
                  />
                </div>

                {/* Payment Method Selection */}
                <div className="space-y-2">
                  <Label htmlFor="method">Withdrawal Method</Label>
                  <Select value={selectedWithdrawalMethod} onValueChange={setSelectedWithdrawalMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose withdrawal method" />
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

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="03XX-XXXXXXX"
                    value={withdrawalPhone}
                    onChange={(e) => setWithdrawalPhone(e.target.value)}
                  />
                </div>

                {/* Fee Breakdown */}
                {withdrawalAmount && selectedWithdrawalMethod && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Withdrawal Amount:</span>
                      <span>PKR {parseFloat(withdrawalAmount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Processing Fee:</span>
                      <span>PKR {withdrawalFees.feeAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-1">
                      <span>You'll Receive:</span>
                      <span>PKR {(parseFloat(withdrawalAmount) - withdrawalFees.feeAmount).toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleWithdrawal}
                  disabled={
                    !withdrawalAmount ||
                    !selectedWithdrawalMethod ||
                    !withdrawalPhone ||
                    isWithdrawing ||
                    (wallet ? parseFloat(withdrawalAmount) > wallet.balance : false)
                  }
                  className="w-full"
                >
                  {isWithdrawing ? 'Processing...' : 'Request Withdrawal'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}