# Supraluxe - React + Node.js Ecommerce Website

A full-stack ecommerce website built with React, Node.js, Express, MongoDB, and integrated with Razorpay payment gateway.

## Features

- 🛍️ **Product Catalog**: Browse products by category (Men/Women)
- 🛒 **Shopping Cart**: Add/remove items, quantity management
- 🔐 **Authentication**: Firebase email/password and Google sign-in
- 💳 **Payment Integration**: Razorpay payment gateway
- 📊 **Admin Dashboard**: Product and order management
- 📱 **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## Tech Stack

### Frontend
- React 18 with Vite
- React Router for navigation
- Tailwind CSS for styling
- Firebase Authentication
- Razorpay Checkout integration

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Razorpay payment processing
- CORS enabled

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Firebase project
- Razorpay account

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Environment Configuration

#### Backend (.env)
Create `backend/.env` file:

```env
PORT=5000
MONGO_URI=mongodb+srv://your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

#### Frontend Firebase Config
Update `src/app/config/firebase.js` with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your_api_key",
  authDomain: "your_project.firebaseapp.com",
  projectId: "your_project_id",
  storageBucket: "your_project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your_app_id"
};
```

### 3. Razorpay Setup

1. **Create Razorpay Account**: Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. **Get API Keys**:
   - Go to Settings → API Keys
   - Generate Test API Key ID and Key Secret
   - Add them to `backend/.env`

### 4. Run the Application

```bash
# Start backend server
cd backend
npm run dev

# In another terminal, start frontend
cd ..
npm run dev
```

Visit `http://localhost:5173` for the frontend and `http://localhost:5000` for the API.

## Payment Flow

1. **Add to Cart**: Users browse products and add items to cart
2. **Checkout**: Review cart items and enter shipping details
3. **Payment**: Razorpay checkout modal opens for secure payment
4. **Verification**: Payment is verified on backend
5. **Confirmation**: Order confirmation page with order details

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create order

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify-payment` - Verify payment
- `GET /api/payments/payment-status/:orderId` - Get payment status

### Cart
- `GET /api/cart/:userId` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update cart item
- `DELETE /api/cart/:userId/:productId` - Remove item from cart

## Project Structure

```
supraluxe/
├── src/
│   ├── app/
│   │   ├── config/
│   │   │   └── firebase.js
│   │   ├── data/
│   │   │   ├── products.js
│   │   │   └── reviews.js
│   │   ├── layout/
│   │   │   └── SiteLayout.jsx
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── OrderConfirmationPage.jsx
│   │   │   ├── ProductDetailsPage.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   └── SignupPage.jsx
│   │   ├── state/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── ui/
│   │   │   ├── Header.jsx
│   │   │   ├── Payment.jsx
│   │   │   └── ...
│   │   └── utils/
│   │       └── money.js
│   ├── App.jsx
│   └── main.jsx
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── Cart.js
│   │   │   ├── Order.js
│   │   │   ├── Product.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── cart.js
│   │   │   ├── orders.js
│   │   │   ├── payments.js
│   │   │   ├── products.js
│   │   │   └── users.js
│   │   ├── server/
│   │   │   ├── createApp.js
│   │   │   └── mongo.js
│   │   └── index.js
│   ├── .env
│   └── package.json
└── package.json
```

## Testing Payments

For testing Razorpay payments, use the following test card details:
- **Card Number**: 4111 1111 1111 1111
- **Expiry**: Any future date (MM/YY)
- **CVV**: 123
- **Name**: Any name

## Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/Railway)
```bash
cd backend
# Set environment variables in deployment platform
# Deploy the backend folder
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
