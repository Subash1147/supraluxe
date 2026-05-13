import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../config/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Admin emails - in production, this should be managed in Firestore or custom claims
  const adminEmails = [
    'admin@fashionstore.com',
    'manager@fashionstore.com',
    'subashuma95@gmail.com'
    // Add your admin emails here
  ]

  // Check if user is admin
  const isUserAdmin = (email) => {
    return adminEmails.includes(email?.toLowerCase())
  }

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Get additional user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          const userData = userDoc.exists() ? userDoc.data() : {}

          const userWithRole = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || userData.displayName,
            photoURL: firebaseUser.photoURL,
            role: isUserAdmin(firebaseUser.email) ? 'admin' : 'customer',
            createdAt: userData.createdAt || firebaseUser.metadata.creationTime,
            lastLogin: userData.lastLogin || firebaseUser.metadata.lastSignInTime,
          }

          setUser(userWithRole)
        } else {
          setUser(null)
        }
      } catch (err) {
        console.error('Auth state change error:', err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  // Sign up with email and password
  async function signup(email, password, displayName = '') {
    try {
      setError(null)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Update display name if provided
      if (displayName) {
        await updateProfile(userCredential.user, { displayName })
      }

      // Store additional user data in Firestore
      const userData = {
        email: userCredential.user.email,
        displayName: displayName || userCredential.user.email.split('@')[0],
        role: isUserAdmin(userCredential.user.email) ? 'admin' : 'customer',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      }

      await setDoc(doc(db, 'users', userCredential.user.uid), userData)

      return userCredential.user
    } catch (err) {
      const errorMsg = getFirebaseErrorMessage(err)
      setError(errorMsg)
      throw new Error(errorMsg)
    }
  }

  // Sign in with email and password
  async function login(email, password) {
    try {
      setError(null)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      // Update last login in Firestore
      const userRef = doc(db, 'users', userCredential.user.uid)
      await setDoc(userRef, {
        lastLogin: new Date().toISOString()
      }, { merge: true })

      return userCredential.user
    } catch (err) {
      const errorMsg = getFirebaseErrorMessage(err)
      setError(errorMsg)
      throw new Error(errorMsg)
    }
  }

  // Sign in with Google
  async function signInWithGoogle() {
    try {
      setError(null)
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({
        prompt: 'select_account'
      })

      const result = await signInWithPopup(auth, provider)
      const firebaseUser = result.user

      // Check if user document exists, create if not
      const userRef = doc(db, 'users', firebaseUser.uid)
      const userDoc = await getDoc(userRef)

      if (!userDoc.exists()) {
        // Create new user document for Google sign-in
        const userData = {
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          role: isUserAdmin(firebaseUser.email) ? 'admin' : 'customer',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          provider: 'google'
        }
        await setDoc(userRef, userData)
      } else {
        // Update last login for existing user
        await setDoc(userRef, {
          lastLogin: new Date().toISOString()
        }, { merge: true })
      }

      return firebaseUser
    } catch (err) {
      const errorMsg = getFirebaseErrorMessage(err)
      setError(errorMsg)
      throw new Error(errorMsg)
    }
  }

  // Sign out
  async function logout() {
    try {
      setError(null)
      await signOut(auth)
    } catch (err) {
      const errorMsg = getFirebaseErrorMessage(err)
      setError(errorMsg)
      throw new Error(errorMsg)
    }
  }

  // Helper function to get user-friendly error messages
  function getFirebaseErrorMessage(error) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists'
      case 'auth/weak-password':
        return 'Password should be at least 6 characters'
      case 'auth/user-not-found':
        return 'No account found with this email'
      case 'auth/wrong-password':
        return 'Incorrect password'
      case 'auth/invalid-email':
        return 'Invalid email address'
      case 'auth/user-disabled':
        return 'This account has been disabled'
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later'
      case 'auth/popup-closed-by-user':
        return 'Sign-in was cancelled'
      case 'auth/cancelled-popup-request':
        return 'Sign-in was cancelled'
      case 'auth/popup-blocked':
        return 'Sign-in popup was blocked by your browser'
      default:
        return error.message || 'An error occurred during authentication'
    }
  }

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    signInWithGoogle,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
