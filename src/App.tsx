import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from '@/context/LanguageContext';
import { CartProvider, useCart } from '@/context/CartContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { DatabaseProvider, useDatabase } from '@/context/DatabaseContext';
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

function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addOrder } = useDatabase();
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePlaceOrder = () => {
    if (items.length === 0 || !user) return;

    // Create new order
    addOrder({
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`,
      customerId: user.id,
      customerName: user.name,
      items: items.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      })),
      total: cartTotal,
      status: 'pending',
      paymentStatus: 'paid',
      createdAt: new Date().toISOString().split('T')[0],
      userType: user.role === 'partner' ? 'partner' : 'customer',
      partnerId: user.partnerId || (user.role === 'partner' ? user.id : undefined)
    });

    clearCart();
    setIsSuccess(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container px-4 md:px-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-8 text-center">
          Checkout
        </h1>
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          {isSuccess ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-emerald-600">✓</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Order placed successfully!</h2>
              <p className="text-slate-500 mb-6">Your order has been recorded into the local database.</p>
              <a href="/dashboard" className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800">
                View My Orders
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Order Summary</h2>
              {items.length === 0 ? (
                <p className="text-slate-500">Your cart is empty.</p>
              ) : (
                <>
                  <ul className="space-y-4">
                    {items.map(item => (
                      <li key={item.product.id} className="flex justify-between items-center bg-slate-50 p-3 rounded">
                        <span>{item.quantity}x {item.product.name}</span>
                        <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={handlePlaceOrder}
                    className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                  >
                    Complete Purchase
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
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
