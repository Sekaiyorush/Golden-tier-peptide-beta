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
    <section className="py-24 md:py-32 relative overflow-hidden bg-white">
      {/* Luxury Background Hint */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50/40 via-white to-white pointer-events-none -z-10" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-[10px] font-bold text-gold-500 uppercase tracking-[0.2em] mb-4">Best Sellers</span>
          <h2 className="text-4xl md:text-6xl font-serif text-slate-900 mb-6 tracking-tight">
            Research Essentials
          </h2>
          <p className="max-w-2xl text-slate-500 text-sm md:text-base leading-relaxed">
            Our most requested compounds for advanced laboratory study. Absolute purity guaranteed.
          </p>
          {isPartner && (
            <div className="mt-6 px-4 py-1.5 border border-gold-200 bg-gold-50/50 text-gold-700 rounded-lg text-[10px] font-bold tracking-widest uppercase shadow-sm">
              Partner Discount Active ({user?.discountRate}%)
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                className="group bg-white/80 backdrop-blur-xl rounded-2xl border border-gold-200/50 overflow-hidden hover:shadow-[0_8px_30px_rgba(212,175,55,0.12)] transition-all duration-500 hover:-translate-y-1"
              >
                {/* Product Image Area */}
                <Link to={`/product/${product.sku}`} className="relative block aspect-[4/3] bg-gradient-to-br from-slate-50 to-white overflow-hidden p-8 flex items-center justify-center">
                  {/* Subtle particle effect layered behind image */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  {/* Purity badge */}
                  <div className="absolute top-4 left-4 z-10 flex items-center space-x-1 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-lg shadow-sm border border-gold-100">
                    <Check className="h-3.5 w-3.5 text-gold-500" />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-slate-700">{product.purity}</span>
                  </div>

                  {/* Product image or fallback */}
                  <div className="relative z-0 w-full h-full flex items-center justify-center">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform duration-700 ease-out" />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-white to-slate-50 rounded-2xl flex items-center justify-center shadow-inner border border-gold-100">
                        <span className="text-gold-400 font-serif text-3xl">{product.name.split('-')[0]}</span>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-[9px] font-bold tracking-[0.2em] text-gold-500 uppercase mb-2 block">{product.category}</span>
                      <Link to={`/product/${product.sku}`}>
                        <h3 className="font-serif text-2xl text-slate-900 group-hover:text-gold-600 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{product.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-5 mt-4 border-t border-gold-100/50">
                    <div>
                      {isPartner ? (
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-slate-400 line-through block mb-0.5">${product.price.toFixed(2)}</span>
                          <p className="text-xl font-semibold text-slate-900">
                            ${getPrice(product.price).toFixed(2)}
                          </p>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1.5 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold tracking-widest uppercase">
                          Partner Only
                        </span>
                      )}
                    </div>
                    {isPartner && (
                      <button
                        onClick={() => addToCart(product)}
                        className="flex items-center justify-center w-10 h-10 bg-slate-900 text-white rounded-xl hover:bg-black transition-colors disabled:opacity-50 border border-slate-800 hover:border-gold-500/30 group/btn shadow-md"
                      >
                        <ShoppingCart className="h-4 w-4 group-hover/btn:text-gold-400 transition-colors" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-16">
          <Link
            to="/products"
            className="group flex items-center justify-center space-x-3 px-8 py-4 border border-gold-200 hover:border-gold-500 text-slate-900 rounded-full transition-all duration-500 hover:shadow-[0_4px_20px_rgba(212,175,55,0.15)] bg-white"
          >
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">View full catalog</span>
            <ArrowRight className="h-4 w-4 text-gold-500 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
