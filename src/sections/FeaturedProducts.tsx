import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { featuredProducts } from '@/data/products';
import { ShoppingCart, ArrowRight, Check } from 'lucide-react';

export function FeaturedProducts() {
  const { addToCart } = useCart();
  const { isPartner, user } = useAuth();

  // Calculate partner price if applicable
  const getPrice = (price: number) => {
    if (isPartner && user?.discountRate) {
      return price * (1 - user.discountRate / 100);
    }
    return price;
  };

  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="container px-4 md:px-6">
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
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-soft transition-shadow"
            >
              {/* Product Image Area */}
              <div className="relative aspect-[4/3] bg-slate-100 flex items-center justify-center p-8">
                {/* Purity badge */}
                <div className="absolute top-4 left-4 flex items-center space-x-1 px-2.5 py-1 bg-white rounded-md shadow-xs">
                  <Check className="h-3 w-3 text-emerald-500" />
                  <span className="text-xs font-medium text-slate-700">{product.purity}</span>
                </div>
                
                {/* Product visual */}
                <div className="w-20 h-20 bg-slate-200 rounded-xl flex items-center justify-center group-hover:bg-slate-300 transition-colors">
                  <span className="text-slate-600 font-semibold text-lg">{product.name.split('-')[0]}</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg text-slate-900 group-hover:text-slate-700 transition-colors">
                      {product.name}
                    </h3>
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
                      <p className="text-xl font-semibold text-slate-900">
                        ${product.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
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
