import { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Heart, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import type { Product } from '@/data/products';
import { ProductRating } from '@/components/reviews/ProductRating';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard = memo(function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isPartner, user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const getDiscountedPrice = (price: number) => {
    if (isPartner && user?.discountRate) {
      return price * (1 - user.discountRate / 100);
    }
    return price;
  };

  const discountedPrice = getDiscountedPrice(product.price);
  const hasDiscount = isPartner && user?.discountRate;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Container */}
      <div className="relative bg-white border border-[#D4AF37]/20 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(212,175,55,0.08)] transition-all duration-500 hover:-translate-y-2 group/card">

        {/* Badge - Featured/New */}
        {product.isNew && (
          <div className="absolute top-4 left-4 z-20 flex items-center space-x-1 px-3 py-1 bg-white border border-[#D4AF37]/20 text-[#D4AF37] text-[9px] font-bold tracking-[0.3em] uppercase shadow-sm">
            <Sparkles className="h-3 w-3" />
            <span>New</span>
          </div>
        )}

        {/* Low Stock Badge */}
        {product.stockQuantity < (product.lowStockThreshold || 10) && product.stockQuantity > 0 && (
          <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-red-50 text-red-600 border border-red-100 text-[9px] font-bold tracking-[0.3em] uppercase shadow-sm">
            Low Stock
          </div>
        )}

        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-slate-50 border-b border-[#D4AF37]/10">
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-slate-100 animate-pulse" />
          )}

          {/* Product Image */}
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white">
              <div className="w-24 h-24 border border-[#D4AF37]/20 flex items-center justify-center">
                <span className="text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#AA771C] to-[#D4AF37]">{product.name.charAt(0)}</span>
              </div>
            </div>
          )}

          {/* Overlay on Hover */}
          <div className={`absolute inset-0 bg-white/40 backdrop-blur-[2px] transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 flex items-center justify-center space-x-4">
              <Link
                to={`/product/${product.sku}`}
                className="flex items-center justify-center w-12 h-12 bg-white border border-[#D4AF37]/30 text-[#AA771C] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300"
              >
                <Eye className="h-5 w-5" />
              </Link>

              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`flex items-center justify-center w-12 h-12 transition-all duration-300 border ${isWishlisted ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]' : 'bg-white border-[#D4AF37]/30 text-[#AA771C] hover:text-[#D4AF37] hover:border-[#D4AF37]'}`}
              >
                <Heart className={`h-5 w-5 ${isWishlisted && 'fill-current'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Category */}
          <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#AA771C] mb-3">{product.category}</p>

          {/* Name */}
          <Link to={`/product/${product.sku}`}>
            <h3 className="font-serif text-2xl tracking-tight text-slate-900 mb-3 group-hover/card:text-transparent group-hover/card:bg-clip-text group-hover/card:bg-gradient-to-r group-hover/card:from-[#AA771C] group-hover/card:to-[#D4AF37] transition-all duration-300 line-clamp-1">{product.name}</h3>
          </Link>

          {/* Description */}
          <p className="text-xs text-slate-400 mb-3 line-clamp-2 leading-relaxed tracking-wide">{product.description}</p>

          {/* Rating */}
          <div className="mb-6">
            <ProductRating productId={product.id} size="sm" showCount />
          </div>

          {/* Price & Action */}
          <div className="flex items-end justify-between border-t border-[#D4AF37]/10 pt-6">
            {isPartner ? (
              <>
                <div className="flex flex-col">
                  {hasDiscount ? (
                    <>
                      <span className="text-xs text-slate-300 line-through mb-1">${product.price.toFixed(2)}</span>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl font-serif text-[#D4AF37]">${discountedPrice.toFixed(2)}</span>
                      </div>
                    </>
                  ) : (
                    <span className="text-2xl font-serif text-slate-900">${product.price.toFixed(2)}</span>
                  )}
                </div>

                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stockQuantity === 0}
                  className={`relative flex items-center justify-center w-12 h-12 overflow-hidden transition-all duration-300 ${product.stockQuantity === 0
                    ? 'bg-slate-50 border border-slate-200 text-slate-300 cursor-not-allowed'
                    : 'bg-[#111] text-white hover:bg-black group/btn border border-[#111]'
                    }`}
                >
                  {product.stockQuantity > 0 && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent -translate-x-[150%] animate-[shimmer_3s_infinite]" />
                  )}
                  <ShoppingCart className="relative z-10 h-4 w-4" />
                  {product.stockQuantity > 0 && (
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] transition-all duration-500 ease-out group-hover/btn:w-full" />
                  )}
                </button>
              </>
            ) : (
              <div className="w-full flex justify-between items-center py-2">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400">Partner Only</span>
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div className="mt-4 flex items-center space-x-2">
            <div className={`w-1.5 h-1.5 rounded-full ${product.stockQuantity === 0 ? 'bg-red-400' :
              product.stockQuantity < (product.lowStockThreshold || 10) ? 'bg-amber-400' :
                'bg-[#D4AF37]'
              }`} />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400">
              {product.stockQuantity === 0 ? 'OUT OF STOCK' :
                product.stockQuantity < (product.lowStockThreshold || 10) ? `ONLY ${product.stockQuantity} LEFT` :
                  'IN STOCK'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
