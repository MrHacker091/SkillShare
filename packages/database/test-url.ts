// Test different password formats for DATABASE_URL
const passwords = [
  'Ik1436677@',
  'Ik1436677%40',
  encodeURIComponent('Ik1436677@')
]

console.log('Testing password encoding formats:')
passwords.forEach((pwd, i) => {
  const url = `postgresql://postgres:${pwd}@db.pqtvdfmdztcrmctsupxb.supabase.co:5432/postgres`
  console.log(`${i + 1}. ${url}`)
})

// Check what encodeURIComponent does to our password
console.log('\nPassword encoding:')
console.log('Original:', 'Ik1436677@')
console.log('Encoded:', encodeURIComponent('Ik1436677@'))