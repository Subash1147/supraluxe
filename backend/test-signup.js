/**
 * Test signup endpoint to verify JSON responses
 * Run with: node backend/test-signup.js
 */

const http = require('http')

const testData = {
  validSignup: {
    name: 'Test User',
    email: `test-${Date.now()}@example.com`,
    password: 'Test123456',
  },
  missingFields: {
    email: 'test@example.com',
    password: 'Test123456',
    // missing name
  },
  invalidEmail: {
    name: 'Test User',
    email: 'invalid-email',
    password: 'Test123456',
  },
}

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const req = http.request(options, (res) => {
      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data)
          resolve({
            status: res.statusCode,
            body: parsed,
            headers: res.headers,
          })
        } catch (err) {
          resolve({
            status: res.statusCode,
            body: data,
            parseError: err.message,
            headers: res.headers,
          })
        }
      })
    })

    req.on('error', reject)

    if (body) {
      req.write(JSON.stringify(body))
    }
    req.end()
  })
}

async function runTests() {
  console.log('🧪 Starting Signup Endpoint Tests\n')
  console.log('API: http://localhost:5000\n')

  // Test 1: Valid signup
  console.log('Test 1: Valid Signup')
  console.log('Sending:', JSON.stringify(testData.validSignup, null, 2))
  const response1 = await makeRequest(
    'POST',
    '/api/users',
    testData.validSignup
  )
  console.log('Response Status:', response1.status)
  console.log('Response Body:', JSON.stringify(response1.body, null, 2))
  console.log('✓ Parse Error:', response1.parseError ? '❌ ' + response1.parseError : '✓ Valid JSON\n')

  // Test 2: Missing required fields
  console.log('Test 2: Missing Required Fields (name)')
  console.log('Sending:', JSON.stringify(testData.missingFields, null, 2))
  const response2 = await makeRequest(
    'POST',
    '/api/users',
    testData.missingFields
  )
  console.log('Response Status:', response2.status)
  console.log('Response Body:', JSON.stringify(response2.body, null, 2))
  console.log('✓ Expected 400, Got:', response2.status === 400 ? '✓' : '❌')
  console.log('✓ Has success flag:', response2.body.success !== undefined ? '✓' : '❌')
  console.log('Parse Error:', response2.parseError ? '❌ ' + response2.parseError : '✓ Valid JSON\n')

  // Test 3: Health check
  console.log('Test 3: Health Check')
  const healthResponse = await makeRequest('GET', '/health')
  console.log('Response Status:', healthResponse.status)
  console.log('Response Body:', JSON.stringify(healthResponse.body, null, 2))
  console.log('Parse Error:', healthResponse.parseError ? '❌ ' + healthResponse.parseError : '✓ Valid JSON\n')

  console.log('✅ All tests completed!')
  process.exit(0)
}

runTests().catch((err) => {
  console.error('❌ Test Error:', err)
  process.exit(1)
})
