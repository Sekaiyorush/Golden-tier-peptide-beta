import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDatabase } from '@/context/DatabaseContext';
import { SEO } from '@/components/SEO';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ProductCard } from '@/components/ProductCard';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Products() {
  const { db, isLoading } = useDatabase();
  const products = db.products;
  const { isPartner, user } = useAuth();
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
  }, [searchTerm, selectedCategory, sortBy, products]);

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
                  <option value="all">All Categories</option>
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
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gold-100 flex items-center justify-between">
            <span className="text-xs font-bold tracking-widest uppercase text-slate-400">
              Showing <span className="text-gold-600">{filteredProducts.length}</span> Products
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
              <div key={i} className="bg-white/60 backdrop-blur-sm rounded-[2rem] border border-gold-200/30 overflow-hidden animate-pulse">
                <div className="aspect-square bg-slate-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                  <div className="h-6 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-full" />
                  <div className="flex justify-between pt-4">
                    <div className="h-8 bg-slate-200 rounded w-24" />
                    <div className="h-12 bg-slate-200 rounded-full w-12" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white/40 backdrop-blur-md rounded-3xl border border-gold-200/50">
            <div className="w-20 h-20 bg-gradient-to-br from-gold-50 to-white border border-gold-100 shadow-sm rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-8 w-8 text-gold-400" />
            </div>
            <h3 className="text-2xl font-serif text-slate-900 mb-2">No products found</h3>
            <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
              We couldn't find any products matching your search. Try adjusting your filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold text-xs tracking-widest uppercase rounded-xl hover:shadow-lg transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
