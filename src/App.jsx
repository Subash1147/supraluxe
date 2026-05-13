import { Navigate, Route, Routes } from 'react-router-dom'
import { SiteLayout } from './app/layout/SiteLayout.jsx'
import { HomePage } from './app/pages/HomePage.jsx'
import { CategoryPage } from './app/pages/CategoryPage.jsx'
import { ProductsPage } from './app/pages/ProductsPage.jsx'
import { ShoePage } from './app/pages/ShoePage.jsx'
import { ProductDetailsPage } from './app/pages/ProductDetailsPage.jsx'
import { CartPage } from './app/pages/CartPage.jsx'
import { LoginPage } from './app/pages/LoginPage.jsx'
import { SignupPage } from './app/pages/SignupPage.jsx'
import { ProfilePage } from './app/pages/ProfilePage.jsx'
import { WishlistPage } from './app/pages/WishlistPage.jsx'
import { AdminDashboard } from './app/pages/AdminDashboard.jsx'
import { CheckoutPage } from './app/pages/CheckoutPage.jsx'
import { OrdersPage } from './app/pages/OrdersPage.jsx'
import { AdminRoute } from './app/ui/AdminRoute.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="shoes" element={<ShoePage />} />
        <Route path="men" element={<CategoryPage gender="men" />} />
        <Route path="women" element={<CategoryPage gender="women" />} />
        <Route path="product/:productId" element={<ProductDetailsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="home" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
