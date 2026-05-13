import { Outlet } from 'react-router-dom'
import { Header } from '../ui/Header.jsx'
import { Footer } from '../ui/Footer.jsx'
import { ScrollToTop } from '../ui/ScrollToTop.jsx'

export function SiteLayout() {
  return (
    <div className="min-h-dvh bg-charcoal text-cream">
      <div className="bg-black text-white">
        <div className="container-pad flex items-center justify-between py-2 text-xs sm:text-sm">
          <p className="opacity-90">Free shipping on orders above ₹999</p>
          <p className="hidden sm:block opacity-80">
            Easy returns • Secure payments • Fast delivery
          </p>
        </div>
      </div>

      <Header />
      <ScrollToTop />
      <main className="container-pad py-6 sm:py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

