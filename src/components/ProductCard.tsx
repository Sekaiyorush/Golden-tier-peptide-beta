import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Heart, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import type { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
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
      <div className="relative bg-white/60 backdrop-blur-xl rounded-[2rem] border border-gold-200/50 overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-2">
        
        {/* Badge - Featured/New */}
        {product.isNew && (
          <div className="absolute top-4 left-4 z-20 flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white text-[10px] font-bold tracking-widest uppercase rounded-full shadow-lg">
            <Sparkles className="h-3 w-3" />
            <span>New</span>
          </div>
        )}

        {/* Low Stock Badge */}
        {product.stockQuantity < (product.lowStockThreshold || 10) && product.stockQuantity > 0 && (
          <div className="absolute top-4 right-4 z-20 px-3 py-1.5 bg-amber-500 text-white text-[10px] font-bold tracking-widest uppercase rounded-full shadow-lg">
            Low Stock
          </div>
        )}

        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse" />
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
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-gold-200 to-gold-400 rounded-2xl flex items-center justify-center shadow-inner">
                <span className="text-3xl font-serif text-white">{product.name.charAt(0)}</span>
              </div>
            </div>
          )}

          {/* Overlay on Hover */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center space-x-3">
              <Link
                to={`/products/${product.id}`}
                className="flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full text-slate-700 hover:text-gold-600 hover:bg-white transition-all duration-300 shadow-lg"
              >
                <Eye className="h-5 w-5" />
              </Link>
              
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 shadow-lg ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/90 backdrop-blur-sm text-slate-700 hover:text-red-500 hover:bg-white'}`}
              >
                <Heart className={`h-5 w-5 ${isWishlisted && 'fill-current'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Category */}
          <p className="text-[10px] font-bold tracking-widest uppercase text-gold-600 mb-2">{product.category}</p>
          
          {/* Name */}
          <Link to={`/products/${product.id}`}>
            <h3 className="font-serif text-xl text-slate-900 mb-2 group-hover:text-gold-700 transition-colors duration-300 line-clamp-1">{product.name}</h3>
          </Link>
          
          {/* Description */}
          <p className="text-sm text-slate-500 mb-4 line-clamp-2">{product.description}</p>
          
          {/* Price & Action */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {hasDiscount ? (
                <>
                  <span className="text-sm text-slate-400 line-through">${product.price.toFixed(2)}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-serif text-gold-600">${discountedPrice.toFixed(2)}</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">
                      Save ${(product.price - discountedPrice).toFixed(2)}
                    </span>
                  </div>
                </>
              ) : (
                <span className="text-2xl font-serif text-slate-900">${product.price.toFixed(2)}</span>
              )}
            </div>
            
            <button
              onClick={() => addToCart(product)}
              disabled={product.stockQuantity === 0}
              className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                product.stockQuantity === 0
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-gold-500 to-gold-600 text-white hover:shadow-lg hover:shadow-gold-500/30 hover:scale-105'
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
          
          {/* Stock Status */}
          <div className="mt-3 flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              product.stockQuantity === 0 ? 'bg-red-500' :
              product.stockQuantity < (product.lowStockThreshold || 10) ? 'bg-amber-500' :
              'bg-emerald-500'
            }`} />
            <span className={`text-xs ${
              product.stockQuantity === 0 ? 'text-red-600' :
              product.stockQuantity < (product.lowStockThreshold || 10) ? 'text-amber-600' :
              'text-emerald-600'
            }`}>
              {product.stockQuantity === 0 ? 'Out of Stock' :
               product.stockQuantity < (product.lowStockThreshold || 10) ? `Only ${product.stockQuantity} left` :
               'In Stock'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
