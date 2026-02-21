import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useDatabase } from '@/context/DatabaseContext';
import { useToast } from '@/components/ui/Toast';
import { SEO } from '@/components/SEO';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ShoppingCart, Check, ShieldCheck, ArrowLeft, Plus, Minus, FileText } from 'lucide-react';

export function ProductDetails() {
    const { sku } = useParams<{ sku: string }>();
    const { db } = useDatabase();
    const { addToCart } = useCart();
    const { isPartner, user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const [quantity, setQuantity] = useState(1);

    const product = db.products.find(p => p.sku === sku);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!product) {
        return (
            <div className="min-h-screen bg-slate-50 py-24 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Product Not Found</h2>
                    <p className="text-slate-500 mb-6">The product you are looking for does not exist or has been removed.</p>
                    <Link to="/products" className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
                        Return to Catalog
                    </Link>
                </div>
            </div>
        );
    }

    const getDiscountedPrice = (price: number) => {
        if (isPartner && user?.discountRate) {
            return price * (1 - user.discountRate / 100);
        }
        return price;
    };

    const currentPrice = getDiscountedPrice(product.price);

    const handleAddToCart = () => {
        // Add multiple items to cart (CartContext currently doesn't support bulk add, we'll just loop or update context if needed)
        // Actually the CartContext addToCart takes a product, but we might want multiple. For now we will add it N times.
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        toast(`Added ${quantity}x ${product.name} to your cart.`, 'success');
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <SEO
                title={product.name}
                description={product.description || `Premium research grade ${product.name}. >99% purity guaranteed for laboratory research.`}
            />

            <div className="container mx-auto px-4 md:px-6">
                <Breadcrumbs />

                <button
                    onClick={() => navigate('/products')}
                    className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-8 mt-4 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to all products
                </button>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2">

                        {/* Left: Product Image */}
                        <div className="relative bg-slate-100 flex items-center justify-center p-12 md:p-24 border-r border-slate-200">
                            <div className="absolute top-6 left-6 flex items-center space-x-1 px-3 py-1.5 bg-white rounded-lg shadow-sm border border-slate-100">
                                <Check className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm font-semibold text-slate-700">{product.purity}</span>
                            </div>

                            {product.inStock ? (
                                <span className="absolute top-6 right-6 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-semibold border border-emerald-200">
                                    In Stock
                                </span>
                            ) : (
                                <span className="absolute top-6 right-6 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-semibold border border-red-200">
                                    Out of Stock
                                </span>
                            )}

                            <div className="w-48 h-48 md:w-64 md:h-64 bg-slate-200 rounded-2xl flex items-center justify-center shadow-inner overflow-hidden">
                                {product.imageUrl ? (
                                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-slate-700 font-bold text-3xl md:text-5xl">{product.name.split('-')[0]}</span>
                                )}
                            </div>
                        </div>

                        {/* Right: Product Details */}
                        <div className="p-8 md:p-12 flex flex-col justify-center">
                            <div className="mb-2">
                                <span className="text-xs font-bold tracking-wider text-indigo-600 uppercase mb-2 block">{product.category}</span>
                                <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{product.name}</h1>
                                <p className="text-sm text-slate-400 mt-2">SKU: {product.sku}</p>
                            </div>

                            <div className="my-6">
                                <p className="text-slate-600 leading-relaxed text-lg">{product.description}</p>
                            </div>

                            {isPartner ? (
                                <>
                                    <div className="mb-8">
                                        <div className="flex items-end gap-3 mb-2">
                                            <span className="text-4xl font-bold text-slate-900">${currentPrice.toFixed(2)}</span>
                                            {user?.discountRate && (
                                                <span className="text-lg text-slate-400 line-through mb-1">${product.price.toFixed(2)}</span>
                                            )}
                                        </div>
                                        {user?.discountRate && (
                                            <p className="text-sm text-emerald-600 font-medium">Your partner discount ({user.discountRate}%) has been applied.</p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="flex flex-col gap-2">
                                            <span className="text-sm font-medium text-slate-700">Quantity</span>
                                            <div className="flex items-center bg-slate-100 rounded-lg p-1 w-fit border border-slate-200">
                                                <button
                                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                    className="p-2 hover:bg-white rounded-md transition-colors"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="w-12 text-center font-semibold text-slate-900">{quantity}</span>
                                                <button
                                                    onClick={() => setQuantity(quantity + 1)}
                                                    className="p-2 hover:bg-white rounded-md transition-colors"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex-1 flex flex-col justify-end pt-7">
                                            <button
                                                onClick={handleAddToCart}
                                                disabled={!product.inStock}
                                                className="w-full h-12 flex items-center justify-center space-x-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <ShoppingCart className="h-5 w-5" />
                                                <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                    <p className="text-sm font-medium text-slate-700 mb-1">Partner Pricing Only</p>
                                    <p className="text-sm text-slate-500">Pricing and purchasing is available exclusively for verified partners. <a href="/contact" className="text-indigo-600 hover:text-indigo-700 font-medium">Contact us</a> to learn about our partner program.</p>
                                </div>
                            )}

                            {/* Extras Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-slate-100">
                                {product.dosage && (
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                                            <ShieldCheck className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-900">Dosage Info</h4>
                                            <p className="text-sm text-slate-500 mt-0.5">{product.dosage}</p>
                                        </div>
                                    </div>
                                )}

                                {product.benefits && product.benefits.length > 0 && (
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-900">Key Benefits</h4>
                                            <ul className="text-sm text-slate-500 mt-0.5 list-disc list-inside pl-1">
                                                {product.benefits.slice(0, 2).map((b, i) => (
                                                    <li key={i}>{b}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>

                {/* Extended Description Tabs */}
                <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                    <h3 className="text-xl font-semibold text-slate-900 mb-6">Product Details</h3>
                    <div className="text-slate-600 space-y-6">
                        <p className="leading-relaxed whitespace-pre-wrap">{product.fullDescription || product.description}</p>
                        {product.benefits && product.benefits.length > 0 && (
                            <div>
                                <h4 className="text-lg font-semibold text-slate-900 mb-3">Potential Applications</h4>
                                <ul className="list-disc list-inside space-y-2">
                                    {product.benefits.map((b, i) => (
                                        <li key={i}>{b}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className="bg-slate-50 p-4 rounded-xl mt-6 border border-slate-100">
                            <p className="text-sm text-slate-500 mb-0"><strong>Disclaimer:</strong> All products are strictly for research and laboratory use only. Not for human consumption. This product is not intended to diagnose, treat, cure, or prevent any disease.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
