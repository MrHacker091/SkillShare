import * as dotenv from 'dotenv'

// Load .env file
const result = dotenv.config()

console.log('📁 Current directory:', process.cwd())
console.log('🔧 Environment loading result:', result)
console.log('💾 DATABASE_URL from process.env:', process.env.DATABASE_URL)

// Also try loading from different paths
console.log('\n--- Testing different .env paths ---')
const envPaths = ['.env', '../.env', '../../.env']

envPaths.forEach(path => {
  try {
    const testResult = dotenv.config({ path })
    console.log(`${path}:`, testResult.parsed?.DATABASE_URL || 'not found')
  } catch (err) {
    console.log(`${path}: error loading`)
  }
})