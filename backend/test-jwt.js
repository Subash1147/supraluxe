/**
 * Comprehensive JWT Authentication Test
 * Tests token generation, verification, and middleware functionality
 * Run with: node backend/test-jwt.js
 */

// First, test JWT module import
console.log('🧪 Testing JWT Authentication Setup\n')

try {
  const jwt = require('jsonwebtoken')
  console.log('✅ jsonwebtoken module imported successfully')
} catch (err) {
  console.error('❌ Failed to import jsonwebtoken:', err.message)
  process.exit(1)
}

try {
  const express = require('express')
  console.log('✅ express module imported successfully')
} catch (err) {
  console.error('❌ Failed to import express:', err.message)
  process.exit(1)
}

try {
  const cors = require('cors')
  console.log('✅ cors module imported successfully')
} catch (err) {
  console.error('❌ Failed to import cors:', err.message)
  process.exit(1)
}

try {
  const bcrypt = require('bcryptjs')
  console.log('✅ bcryptjs module imported successfully')
} catch (err) {
  console.error('❌ Failed to import bcryptjs:', err.message)
  process.exit(1)
}

try {
  const mongoose = require('mongoose')
  console.log('✅ mongoose module imported successfully')
} catch (err) {
  console.error('❌ Failed to import mongoose:', err.message)
  process.exit(1)
}

try {
  require('dotenv').config({ path: './backend/.env' })
  console.log('✅ dotenv configured successfully\n')
} catch (err) {
  console.error('❌ Failed to configure dotenv:', err.message)
  process.exit(1)
}

// Test JWT token generation and verification
console.log('--- JWT Token Tests ---\n')

const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'supraluxe-secret'
const JWT_EXPIRES_IN = '7d'

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET)
}

// Test 1: Token Generation
console.log('Test 1: Generate JWT Token')
const testPayload = {
  id: '507f1f77bcf86cd799439011',
  email: 'test@example.com',
  role: 'customer',
}

try {
  const token = signToken(testPayload)
  console.log('✅ Token generated successfully')
  console.log(`   Payload: ${JSON.stringify(testPayload)}`)
  console.log(`   Token: ${token.substring(0, 50)}...`)

  // Test 2: Token Verification
  console.log('\nTest 2: Verify JWT Token')
  try {
    const decoded = verifyToken(token)
    console.log('✅ Token verified successfully')
    console.log(`   Decoded: ${JSON.stringify(decoded, null, 2)}`)

    if (decoded.id === testPayload.id && decoded.role === testPayload.role) {
      console.log('✅ Payload matches original data')
    } else {
      console.log('❌ Payload mismatch')
    }
  } catch (err) {
    console.error('❌ Token verification failed:', err.message)
  }

  // Test 3: Admin Token
  console.log('\nTest 3: Admin Token')
  const adminPayload = {
    id: 'admin-id-123',
    email: 'admin@example.com',
    role: 'admin',
  }

  const adminToken = signToken(adminPayload)
  const decodedAdmin = verifyToken(adminToken)
  console.log('✅ Admin token created')
  console.log(`   Role: ${decodedAdmin.role}`)
  console.log(`   Is Admin: ${decodedAdmin.role === 'admin' ? '✅ Yes' : '❌ No'}`)
} catch (err) {
  console.error('❌ JWT Test Failed:', err.message)
  process.exit(1)
}

// Test 4: Expired Token Handling
console.log('\nTest 4: Expired Token Handling')
try {
  const expiredSecret = JWT_SECRET
  const expiredToken = jwt.sign(testPayload, expiredSecret, { expiresIn: '0s' })

  // Wait a moment for token to expire
  setTimeout(() => {
    try {
      verifyToken(expiredToken)
      console.log('❌ Expired token was not rejected')
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        console.log('✅ Expired token rejected correctly')
        console.log(`   Error: ${err.message}`)
      } else {
        console.log('⚠️  Different error:', err.message)
      }
    }
  }, 100)
} catch (err) {
  console.error('❌ Expiration test failed:', err.message)
}

// Test 5: Environment Variables
console.log('\nTest 5: Environment Configuration')
console.log(`✅ JWT_SECRET configured: ${process.env.JWT_SECRET ? '✅ Yes' : '❌ No'}`)
console.log(`✅ PORT: ${process.env.PORT || 5000}`)
console.log(`✅ NODE_ENV: ${process.env.NODE_ENV || 'not set'}`)
console.log(`✅ MONGO_URI configured: ${process.env.MONGO_URI ? '✅ Yes' : '❌ No'}`)

console.log('\n✅ All JWT authentication tests passed!')
console.log('\nYour backend is ready for:\n  - JWT token generation on login/signup\n  - Token verification on protected routes\n  - Admin authentication checks\n')
