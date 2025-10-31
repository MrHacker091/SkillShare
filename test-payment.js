// Test script for payment API
const testPaymentAPI = async () => {
  try {
    console.log('🧪 Testing Payment API...')

    // Test 1: Get Payment Methods
    console.log('📋 Test 1: Getting payment methods...')
    const methodsResponse = await fetch('/api/payments?action=methods')
    const methodsData = await methodsResponse.json()
    console.log('✅ Payment methods:', methodsData)

    // Test 2: Get Wallet (mock user)
    console.log('💰 Test 2: Getting wallet for test user...')
    const walletResponse = await fetch('/api/payments?action=wallet&userId=test_user')
    const walletData = await walletResponse.json()
    console.log('✅ Wallet data:', walletData)

    // Test 3: Create Payment
    console.log('💳 Test 3: Creating payment...')
    const paymentResponse = await fetch('/api/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'create_payment',
        userId: 'test_user',
        projectId: 'test_project_1',
        creatorId: 'test_creator_1',
        amount: 1400, // PKR 1400 (equivalent to $5 USD)
        paymentMethodId: 'sadapay',
        phoneNumber: '03001234567',
        description: 'Test payment for project'
      })
    })
    const paymentData = await paymentResponse.json()
    console.log('✅ Payment created:', paymentData)

    if (paymentData.success) {
      // Test 4: Check Payment Status
      console.log('🔍 Test 4: Checking payment status...')
      setTimeout(async () => {
        const statusResponse = await fetch('/api/payments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'check_status',
            paymentId: paymentData.payment.id
          })
        })
        const statusData = await statusResponse.json()
        console.log('✅ Payment status:', statusData)

        // Test 5: Check updated wallet after payment completion
        setTimeout(async () => {
          console.log('💰 Test 5: Checking creator wallet after payment...')
          const creatorWalletResponse = await fetch('/api/payments?action=wallet&userId=test_creator_1')
          const creatorWalletData = await creatorWalletResponse.json()
          console.log('✅ Creator wallet after payment:', creatorWalletData)
        }, 4000) // Wait for payment to complete

      }, 1000)
    }

  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run the test
testPaymentAPI()