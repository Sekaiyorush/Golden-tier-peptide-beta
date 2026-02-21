import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useDatabase } from '@/context/DatabaseContext';
import { ShoppingCart, ArrowRight, Check } from 'lucide-react';

export function FeaturedProducts() {
  const { addToCart } = useCart();
  const { isPartner, user } = useAuth();
  const { db, isLoading } = useDatabase();

  const featuredProducts = db.products.slice(0, 3);

  // Calculate partner price if applicable
  const getPrice = (price: number) => {
    if (isPartner && user?.discountRate) {
      return price * (1 - user.discountRate / 100);
    }
    return price;
  };

  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">Best Sellers</span>
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
            Research Essentials
          </h2>
          <p className="max-w-2xl text-slate-500">
            Our most requested compounds for advanced laboratory study. Purity guaranteed.
          </p>
          {isPartner && (
            <div className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">
              Partner Discount: {user?.discountRate}% off applied
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Skeleton loading cards
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-slate-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-full" />
                  <div className="flex justify-between pt-4 border-t border-slate-100">
                    <div className="h-6 bg-slate-200 rounded w-20" />
                    <div className="h-9 bg-slate-200 rounded w-16" />
                  </div>
                </div>
              </div>
            ))
          ) : featuredProducts.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <p className="text-slate-500">Products coming soon. Check back shortly!</p>
            </div>
          ) : (
            featuredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-soft transition-shadow"
              >
                {/* Product Image Area */}
                <Link to={`/product/${product.sku}`} className="relative block aspect-[4/3] bg-slate-100 overflow-hidden">
                  {/* Purity badge */}
                  <div className="absolute top-4 left-4 z-10 flex items-center space-x-1 px-2.5 py-1 bg-white rounded-md shadow-xs">
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span className="text-xs font-medium text-slate-700">{product.purity}</span>
                  </div>

                  {/* Product image or fallback */}
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100">
                      <div className="w-20 h-20 bg-slate-200 rounded-xl flex items-center justify-center group-hover:bg-slate-300 transition-colors">
                        <span className="text-slate-600 font-semibold text-lg">{product.name.split('-')[0]}</span>
                      </div>
                    </div>
                  )}
                </Link>

                {/* Product Info */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Link to={`/product/${product.sku}`}>
                        <h3 className="font-semibold text-lg text-slate-900 group-hover:text-slate-700 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-slate-500">{product.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      {isPartner ? (
                        <div>
                          <span className="text-xs text-slate-400 line-through">${product.price.toFixed(2)}</span>
                          <p className="text-xl font-semibold text-indigo-600">
                            ${getPrice(product.price).toFixed(2)}
                          </p>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 bg-slate-100 text-slate-500 rounded-md text-xs font-medium">
                          Partner Only
                        </span>
                      )}
                    </div>
                    {isPartner && (
                      <button
                        onClick={() => addToCart(product)}
                        className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-10">
          <Link
            to="/products"
            className="group inline-flex items-center space-x-2 px-6 py-3 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span className="font-medium">View All Products</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
