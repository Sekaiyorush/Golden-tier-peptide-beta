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
    <div className="min-h-screen bg-slate-50 py-12">
      <SEO
        title="Research Peptides & Compounds"
        description="Browse our complete catalog of premium research peptides and laboratory compounds. Over 99% purity guaranteed."
      />
      <div className="container mx-auto px-4">
        <Breadcrumbs />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 mt-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">Products</h1>
          <p className="text-slate-500 mt-1">Browse our complete catalog of research peptides</p>
          {isPartner && (
            <div className="mt-3 inline-flex items-center space-x-2 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm">
              <span className="font-medium">Partner Price:</span>
              <span>{user?.discountRate}% discount applied</span>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-200"
              />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-200 appearance-none bg-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-200 bg-white"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Showing <span className="font-medium text-slate-900">{filteredProducts.length}</span> products
            </span>
            {(searchTerm || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-sm transition-shadow"
              >
                <Link to={`/product/${product.sku}`} className="relative block aspect-[4/3] bg-slate-100 flex items-center justify-center p-6 group-hover:opacity-90 transition-opacity">
                  <div className="absolute top-4 left-4 flex items-center space-x-1 px-2 py-1 bg-white rounded-md shadow-xs">
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span className="text-xs font-medium text-slate-700">{product.purity}</span>
                  </div>
                  <span className={`absolute top-4 right-4 px-2 py-1 rounded-md text-xs font-medium ${product.inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                  <div className="absolute inset-0 bg-slate-100 flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-24 h-24 bg-slate-200 rounded-xl flex items-center justify-center">
                        <span className="text-slate-600 font-semibold text-xl">{product.name.split('-')[0]}</span>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Link to={`/product/${product.sku}`}>
                        <h3 className="font-semibold text-lg text-slate-900 hover:text-slate-700 transition-colors">{product.name}</h3>
                      </Link>
                      <p className="text-sm text-slate-500">{product.description}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">SKU: {product.sku}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      {isPartner ? (
                        <div>
                          <span className="text-xs text-slate-400 line-through">${product.price.toFixed(2)}</span>
                          <p className="text-xl font-semibold text-indigo-600">
                            ${getDiscountedPrice(product.price).toFixed(2)}
                          </p>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 bg-slate-100 text-slate-500 rounded-md text-xs font-medium">
                          Partner Only
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/product/${product.sku}`}
                        className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-transparent"
                      >
                        Details
                      </Link>
                      {isPartner && (
                        <button
                          onClick={() => addToCart(product)}
                          disabled={!product.inStock}
                          className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No products found</h3>
            <p className="text-slate-500 mb-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
