// Quick Firebase connectivity test
const firebaseConfig = {
  apiKey: 'AIzaSyBxEKbL7lAHHadJz-a1M9Ekn7YevxQFPSI',
  authDomain: 'fashion-5c5c0.firebaseapp.com',
  projectId: 'fashion-5c5c0',
  storageBucket: 'fashion-5c5c0.firebasestorage.app',
  messagingSenderId: '555297308868',
  appId: '1:555297308868:web:5b9a5ba0f04dedd624c991',
  measurementId: 'G-EP8T803Q5S',
}

console.log('Firebase Config Status:')
console.log('✓ API Key:', firebaseConfig.apiKey ? 'Present' : 'Missing')
console.log('✓ Auth Domain:', firebaseConfig.authDomain ? 'Present' : 'Missing')
console.log('✓ Project ID:', firebaseConfig.projectId ? 'Present' : 'Missing')
console.log('✓ App ID:', firebaseConfig.appId ? 'Present' : 'Missing')

// Test connectivity by checking if authDomain is reachable
const testUrl = `https://${firebaseConfig.authDomain}/__/auth/`

fetch(testUrl, { method: 'HEAD', mode: 'no-cors' })
  .then(() => {
    console.log('\n✓ Firebase Auth Server: Connected')
  })
  .catch((err) => {
    console.log('\n✗ Firebase Auth Server: Not Connected')
    console.log('Error:', err.message)
  })
