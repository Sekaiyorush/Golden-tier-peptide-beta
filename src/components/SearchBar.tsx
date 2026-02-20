import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { Search } from 'lucide-react';

export function SearchBar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [text, setText] = useState(searchParams.get('q') || '');
  const [query] = useDebounce(text, 500);

  useEffect(() => {
    if (query) {
      navigate(`/products?q=${encodeURIComponent(query)}`);
    } else if (location.pathname === '/products' && searchParams.get('q')) {
      navigate('/products');
    }
  }, [query, navigate, location.pathname, searchParams]);

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-4 h-4 text-slate-400" />
      </div>
      <input
        type="search"
        className="block w-full py-2 pl-9 pr-3 text-sm text-slate-900 border border-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all placeholder:text-slate-400"
        placeholder="Search products..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
}
