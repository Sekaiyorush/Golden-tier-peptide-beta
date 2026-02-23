import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useDatabase } from '@/context/DatabaseContext';
import { ShoppingCart, ArrowRight, Check } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function FeaturedProducts() {
  const { addToCart } = useCart();
  const { isPartner, user } = useAuth();
  const { db, isLoading } = useDatabase();

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Parallax effects
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "150%"]);

  const featuredProducts = db.products.slice(0, 3);

  // Calculate partner price if applicable
  const getPrice = (price: number) => {
    if (isPartner && user?.discountRate) {
      return price * (1 - user.discountRate / 100);
    }
    return price;
  };

  return (
    <section ref={sectionRef} className="py-24 md:py-32 relative overflow-hidden bg-white">
      {/* Luxury Background Hint - Scroll Linked Parallax */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.03)_0%,_rgba(255,255,255,1)_60%)]"
      />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          style={{ y: textY }}
          className="flex flex-col items-center text-center mb-16"
        >
          <span className="text-[10px] font-bold text-[#AA771C] uppercase tracking-[0.3em] mb-4">Best Sellers</span>
          <h2 className="text-4xl md:text-6xl font-serif tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#AA771C] via-[#F3E5AB] to-[#D4AF37] mb-6">
            Research Essentials
          </h2>
          <p className="max-w-2xl text-slate-400 text-sm md:text-base leading-relaxed tracking-wide">
            Our most requested compounds for advanced laboratory study. Absolute purity guaranteed.
          </p>
          {isPartner && (
            <div className="mt-6 px-6 py-2 border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#AA771C] text-[10px] font-bold tracking-[0.2em] uppercase">
              Partner Discount Active ({user?.discountRate}%)
            </div>
          )}
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {isLoading ? (
            // Skeleton loading cards
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white border border-[#D4AF37]/10 overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-slate-100" />
                <div className="p-8 space-y-4">
                  <div className="h-4 bg-slate-100 w-3/4" />
                  <div className="h-3 bg-slate-100 w-full" />
                  <div className="flex justify-between pt-6 border-t border-[#D4AF37]/10">
                    <div className="h-6 bg-slate-100 w-20" />
                    <div className="h-10 bg-slate-100 w-16" />
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
                className="group bg-white border border-[#D4AF37]/20 overflow-hidden hover:shadow-[0_20px_40px_rgba(212,175,55,0.08)] transition-all duration-500 hover:-translate-y-2 flex flex-col"
              >
                {/* Product Image Area */}
                <Link
                  to={`/product/${product.sku}`}
                  aria-label={`View details for ${product.name}`}
                  className="relative block aspect-[4/3] bg-slate-50 overflow-hidden p-8 flex items-center justify-center border-b border-[#D4AF37]/10 focus:ring-2 focus:ring-[#D4AF37] outline-none"
                >
                  {/* Subtle particle effect layered behind image */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  {/* Purity badge */}
                  <div className="absolute top-4 left-4 z-10 flex items-center space-x-1 px-3 py-1 bg-white border border-[#D4AF37]/20 text-[#D4AF37] text-[9px] font-bold tracking-[0.3em] uppercase shadow-sm">
                    <Check className="h-3 w-3" aria-hidden="true" />
                    <span>{product.purity}</span>
                  </div>

                  {/* Product image or fallback */}
                  <div className="relative z-0 w-full h-full flex items-center justify-center">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain filter group-hover:scale-105 transition-transform duration-700 ease-out" />
                    ) : (
                      <div className="w-24 h-24 bg-white border border-[#D4AF37]/20 flex items-center justify-center">
                        <span className="text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#AA771C] to-[#D4AF37]">{product.name.split('-')[0]}</span>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-[9px] font-bold tracking-[0.3em] text-[#AA771C] uppercase mb-3 block">{product.category}</span>
                      <Link to={`/product/${product.sku}`}>
                        <h3 className="font-serif text-2xl text-slate-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#AA771C] group-hover:to-[#D4AF37] transition-all duration-300">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed tracking-wide">{product.description}</p>
                    </div>
                  </div>

                  <div className="flex items-end justify-between pt-6 mt-auto border-t border-[#D4AF37]/10">
                    <div>
                      {isPartner ? (
                        <div>
                          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 line-through block mb-1">${product.price.toFixed(2)}</span>
                          <p className="text-2xl font-serif text-[#D4AF37]">
                            ${getPrice(product.price).toFixed(2)}
                          </p>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-4 py-2 border border-[#D4AF37]/20 bg-slate-50 text-slate-500 text-[9px] font-bold tracking-[0.3em] uppercase">
                          Partner Only
                        </span>
                      )}
                    </div>
                    {isPartner && (
                      <button
                        onClick={() => addToCart(product)}
                        aria-label={`Add ${product.name} to cart`}
                        className="relative flex items-center justify-center w-12 h-12 bg-[#111] text-white hover:bg-black transition-all disabled:opacity-50 border border-[#111] group-btn shadow-md overflow-hidden focus:ring-2 focus:ring-[#D4AF37] outline-none"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent -translate-x-[150%] animate-[shimmer_3s_infinite]" />
                        <ShoppingCart className="relative z-10 h-4 w-4" aria-hidden="true" />
                        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] transition-all duration-500 ease-out group-hover:w-full" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-center mt-20">
          <Link
            to="/products"
            aria-label="View full product catalog"
            className="group flex items-center justify-center space-x-3 px-10 py-5 border border-[#D4AF37]/30 text-slate-900 transition-all duration-500 hover:border-[#D4AF37] hover:shadow-[0_10px_30px_rgba(212,175,55,0.1)] bg-white relative overflow-hidden focus:ring-2 focus:ring-[#D4AF37] outline-none"
          >
            <span className="relative z-10 text-[10px] font-bold tracking-[0.3em] uppercase">VIEW FULL CATALOG</span>
            <ArrowRight className="relative z-10 h-4 w-4 text-[#D4AF37] group-hover:translate-x-2 transition-transform duration-300" aria-hidden="true" />
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] transition-all duration-500 ease-out group-hover:w-full" />
          </Link>
        </div>
      </div>
    </section>
  );
}
