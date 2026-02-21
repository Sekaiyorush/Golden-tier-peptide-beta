import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from '@/context/LanguageContext';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { DatabaseProvider } from '@/context/DatabaseContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartSidebar } from '@/components/CartSidebar';
import { Hero } from '@/sections/Hero';
import { FeaturedProducts } from '@/sections/FeaturedProducts';
import { TrustFeatures } from '@/sections/TrustFeatures';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { Products } from '@/pages/Products';
import { ProductDetails } from '@/pages/ProductDetails';
import { ForgotPassword } from '@/pages/ForgotPassword';
import { ResetPassword } from '@/pages/ResetPassword';
import { CheckoutPage } from '@/pages/Checkout';
import { About } from '@/pages/About';
import { Contact } from '@/pages/Contact';
import { Research } from '@/pages/Research';
import { Terms } from '@/pages/Terms';
import { Privacy } from '@/pages/Privacy';
import { Shipping } from '@/pages/Shipping';
import { UserDashboard } from '@/pages/dashboard/UserDashboard';
import { PartnerDashboard } from '@/pages/partner/PartnerDashboard';

// Protected Route component
function ProtectedRoute({ children, requireAdmin = false, requirePartner = false }: {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requirePartner?: boolean;
}) {
  const { isAuthenticated, isAdmin, isPartner } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requirePartner && !isPartner) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <FeaturedProducts />
      <TrustFeatures />
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 bg-slate-50">
      <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
      <p className="text-slate-500 text-lg mb-8">Page not found</p>
      <a href="/" className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
        Return Home
      </a>
    </div>
  );
}

// Main App Content with Router
function AppContent() {

  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Partner Routes */}
        <Route
          path="/partner/*"
          element={
            <ProtectedRoute requirePartner={true}>
              <PartnerDashboard />
            </ProtectedRoute>
          }
        />

        {/* User Dashboard Routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Public Routes */}
        <Route
          path="/*"
          element={
            <div className="min-h-screen bg-white">
              <Header />
              <CartSidebar />
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:sku" element={<ProductDetails />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/research" element={<Research />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/shipping" element={<Shipping />} />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <CheckoutPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <DatabaseProvider>
      <AuthProvider>
        <LanguageProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </LanguageProvider>
      </AuthProvider>
    </DatabaseProvider>
  );
}

export default App;
