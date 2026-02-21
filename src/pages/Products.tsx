import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '@/context/CartContext';

import { useDatabase } from '@/context/DatabaseContext';
import { SEO } from '@/components/SEO';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ShoppingCart, Search, Filter, Check, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext'; // Keep useAuth for partner discount logic

export function Products() {
  const { db, isLoading } = useDatabase();
  const products = db.products;
  const { addToCart } = useCart();
  const { isPartner, user } = useAuth(); // Keep useAuth for partner discount logic
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const categories = useMemo(() => Array.from(new Set(products.map(p => p.category))).sort(), [products]);

  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  const filteredProducts = useMemo(() => {
    let result = products;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term)
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return result;
  }, [searchTerm, selectedCategory, sortBy, products]); // Added products to dependency array

  const getDiscountedPrice = (price: number) => {
    if (isPartner && user?.discountRate) {
      return price * (1 - user.discountRate / 100);
    }
    return price;
  };

  return (
    <div className="min-h-screen bg-transparent py-12">
      <SEO
        title="Research Catalog | Golden Tier"
        description="Browse our complete catalog of premium research peptides and laboratory compounds. Supreme purity guaranteed."
      />
      <div className="container mx-auto px-6 md:px-12">
        <Breadcrumbs />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4 mt-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tight">Research Catalog</h1>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-gold-600 mt-3">Curated selection of premium peptides</p>
          </div>
          {isPartner && (
            <div className="mt-3 inline-flex items-center space-x-2 px-4 py-2 border border-gold-200 bg-gold-50/50 text-gold-700 rounded-xl text-xs font-bold tracking-widest uppercase shadow-sm">
              <span>Partner Privileges:</span>
              <span className="text-gold-900">{user?.discountRate}% Discount Active</span>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-gold-200/50 p-6 mb-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gold-400" />
              <input
                type="text"
                placeholder="Search compounds..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 h-12 bg-white border border-gold-200/60 rounded-xl focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 text-sm transition-all"
              />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gold-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-11 pr-10 h-12 bg-white border border-gold-200/60 rounded-xl focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 text-xs font-semibold tracking-wider uppercase text-slate-700 appearance-none transition-all cursor-pointer"
                >
                  <option value="all">Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-4 pr-10 h-12 bg-white border border-gold-200/60 rounded-xl focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 text-xs font-semibold tracking-wider uppercase text-slate-700 appearance-none transition-all cursor-pointer"
                >
                  <option value="name">Sort A-Z</option>
                  <option value="price-low">Price: Low</option>
                  <option value="price-high">Price: High</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gold-100 flex items-center justify-between">
            <span className="text-xs font-bold tracking-widest uppercase text-slate-400">
              Showing <span className="text-gold-600">{filteredProducts.length}</span> Results
            </span>
            {(searchTerm || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="text-[10px] font-bold tracking-widest uppercase text-slate-500 hover:text-gold-600 transition-colors"
              >
                Clear Filters ×
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gold-200/30 overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-slate-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-full" />
                  <div className="h-3 bg-slate-200 rounded w-1/3 mt-2" />
                  <div className="flex justify-between pt-4 border-t border-slate-100">
                    <div className="h-6 bg-slate-200 rounded w-20" />
                    <div className="flex space-x-2">
                      <div className="h-9 bg-slate-200 rounded w-16" />
                      <div className="h-9 bg-slate-200 rounded w-16" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white/80 backdrop-blur-xl rounded-2xl border border-gold-200/50 overflow-hidden hover:shadow-[0_8px_30px_rgba(212,175,55,0.12)] transition-all duration-500 hover:-translate-y-1"
              >
                <Link to={`/product/${product.sku}`} className="relative block aspect-[4/3] bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-8 group-hover:opacity-95 transition-opacity overflow-hidden">
                  <div className="absolute top-4 left-4 flex items-center space-x-1 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-lg shadow-sm border border-gold-100 z-10">
                    <Check className="h-3.5 w-3.5 text-gold-500" />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-slate-700">{product.purity}</span>
                  </div>
                  <span className={`absolute top-4 right-4 px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase z-10 shadow-sm ${product.inStock ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
                    }`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>

                  {/* Subtle particle effect layered behind image */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

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

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-[9px] font-bold tracking-[0.2em] text-gold-500 uppercase mb-2 block">{product.category}</span>
                      <Link to={`/product/${product.sku}`}>
                        <h3 className="font-serif text-2xl text-slate-900 group-hover:text-gold-600 transition-colors">{product.name}</h3>
                      </Link>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">{product.description}</p>
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-6 font-mono">SKU: {product.sku}</p>

                  <div className="flex items-center justify-between pt-5 border-t border-gold-100/50">
                    <div>
                      {isPartner ? (
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-slate-400 line-through block mb-0.5">${product.price.toFixed(2)}</span>
                          <p className="text-xl font-semibold text-slate-900">
                            ${getDiscountedPrice(product.price).toFixed(2)}
                          </p>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1.5 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold tracking-widest uppercase">
                          Partner Only
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <Link
                        to={`/product/${product.sku}`}
                        className="px-4 py-2 text-[10px] font-bold tracking-widest uppercase text-slate-500 hover:text-gold-600 transition-colors"
                      >
                        Details
                      </Link>
                      {isPartner && (
                        <button
                          onClick={() => addToCart(product)}
                          disabled={!product.inStock}
                          className="flex items-center justify-center w-10 h-10 bg-slate-900 text-white rounded-xl hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-slate-800 hover:border-gold-500/30 group/btn shadow-md"
                        >
                          <ShoppingCart className="h-4 w-4 group-hover/btn:text-gold-400 transition-colors" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white/40 backdrop-blur-md rounded-3xl border border-gold-200/50">
            <div className="w-20 h-20 bg-gradient-to-br from-gold-50 to-white border border-gold-100 shadow-sm rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-8 w-8 text-gold-400" />
            </div>
            <h3 className="text-2xl font-serif text-slate-900 mb-2">No compounds found</h3>
            <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">We couldn't find any products matching your current search criteria. Try adjusting your filters.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="px-6 py-3 bg-slate-900 text-white font-semibold text-xs tracking-widest uppercase rounded-xl hover:bg-black hover:border-gold-500/50 border border-transparent transition-all shadow-md"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
