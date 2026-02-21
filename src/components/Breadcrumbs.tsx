import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Breadcrumbs() {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    if (pathnames.length === 0) return null;

    return (
        <nav aria-label="breadcrumb" className="py-4">
            <ol className="flex items-center space-x-2 text-sm text-slate-500">
                <li>
                    <Link to="/" className="hover:text-slate-900 transition-colors flex items-center">
                        <Home className="h-4 w-4" />
                    </Link>
                </li>
                {pathnames.map((value, index) => {
                    const isLast = index === pathnames.length - 1;
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const label = decodeURIComponent(value).replace(/-/g, ' ');

                    return (
                        <li key={to} className="flex items-center space-x-2">
                            <ChevronRight className="h-4 w-4 text-slate-300" />
                            {isLast ? (
                                <span className="text-slate-900 font-medium capitalize" aria-current="page">
                                    {label}
                                </span>
                            ) : (
                                <Link to={to} className="hover:text-slate-900 transition-colors capitalize">
                                    {label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
