export function checkFirebaseStatus() {
  const firebaseConfig = {
    apiKey: 'AIzaSyBxEKbL7lAHHadJz-a1M9Ekn7YevxQFPSI',
    authDomain: 'fashion-5c5c0.firebaseapp.com',
    projectId: 'fashion-5c5c0',
    storageBucket: 'fashion-5c5c0.firebasestorage.app',
    messagingSenderId: '555297308868',
    appId: '1:555297308868:web:5b9a5ba0f04dedd624c991',
    measurementId: 'G-EP8T803Q5S',
  }

  const requiredFields = [
    'apiKey',
    'authDomain',
    'projectId',
    'appId',
  ]

  const status = {
    configured: true,
    missingFields: [],
    allFieldsPresent: true,
  }

  requiredFields.forEach((field) => {
    if (!firebaseConfig[field]) {
      status.missingFields.push(field)
      status.allFieldsPresent = false
    }
  })

  // Test if we can reach Firebase auth server
  const testUrl = `https://${firebaseConfig.authDomain}/__/auth/`

  return {
    status,
    testUrl,
    config: firebaseConfig,
  }
}

// Usage: Call checkFirebaseStatus() in browser console to see the result
if (typeof window !== 'undefined') {
  window.checkFirebaseStatus = checkFirebaseStatus
  console.log('Firebase Status Check Available')
  console.log('Run: checkFirebaseStatus() in console')
}
