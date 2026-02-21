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
            <div className="min-h-screen bg-transparent py-24 flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50/50 via-white to-white pointer-events-none -z-10" />
                <div className="text-center bg-white/60 backdrop-blur-xl p-12 rounded-3xl border border-gold-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <h2 className="text-3xl font-serif text-slate-900 mb-2 tracking-tight">Compound Not Found</h2>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">The specific compound you are looking for does not exist or has been removed from our catalog.</p>
                    <Link to="/products" className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 text-white font-semibold text-xs tracking-widest uppercase rounded-xl hover:bg-black hover:border-gold-500/50 border border-transparent transition-all shadow-md">
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
        <div className="min-h-screen bg-transparent py-12 relative overflow-hidden">
            {/* Luxury Background Hint */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50/30 via-white to-white pointer-events-none -z-10" />

            <SEO
                title={`${product.name} | Golden Tier`}
                description={product.description || `Premium research grade ${product.name}. >99% purity guaranteed for laboratory research.`}
            />

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <Breadcrumbs />

                <button
                    onClick={() => navigate('/products')}
                    className="inline-flex items-center text-[10px] font-bold tracking-widest uppercase text-slate-400 hover:text-gold-600 mb-10 mt-6 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to catalog
                </button>

                <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-gold-200/50 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="grid grid-cols-1 md:grid-cols-2">

                        {/* Left: Product Image */}
                        <div className="relative bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-12 md:p-32 border-r border-gold-100/50 overflow-hidden">
                            {/* Subtle particle effect layered behind image */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-50/50 via-transparent to-transparent opacity-100 pointer-events-none" />

                            <div className="absolute top-8 left-8 z-10 flex items-center space-x-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl shadow-sm border border-gold-100">
                                <Check className="h-4 w-4 text-gold-500" />
                                <span className="text-xs font-bold tracking-widest uppercase text-slate-700">{product.purity}</span>
                            </div>

                            <span className={`absolute top-8 right-8 px-4 py-2 rounded-xl text-xs font-bold tracking-widest uppercase z-10 shadow-sm ${product.inStock ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
                                }`}>
                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>

                            <div className="relative z-0 w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
                                {product.imageUrl ? (
                                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain filter drop-shadow-md" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-white to-slate-50 rounded-[2rem] flex items-center justify-center shadow-inner border border-gold-100">
                                        <span className="text-gold-400 font-serif text-6xl">{product.name.split('-')[0]}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Product Details */}
                        <div className="p-8 md:p-14 lg:p-20 flex flex-col justify-center bg-white/50">
                            <div className="mb-2">
                                <span className="text-[10px] font-bold tracking-[0.2em] text-gold-500 uppercase mb-4 block">{product.category}</span>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-slate-900 tracking-tight leading-tight">{product.name}</h1>
                                <p className="text-[10px] font-semibold tracking-widest text-slate-400 mt-4 uppercase font-mono">SKU: {product.sku}</p>
                            </div>

                            <div className="my-8">
                                <p className="text-slate-500 leading-relaxed text-sm md:text-base font-light">{product.description}</p>
                            </div>

                            {isPartner ? (
                                <>
                                    <div className="mb-10">
                                        <div className="flex items-end gap-4 mb-2">
                                            <span className="text-5xl font-serif text-slate-900 tracking-tight">${currentPrice.toFixed(2)}</span>
                                            {user?.discountRate && (
                                                <span className="text-xl text-slate-400 line-through mb-1.5 font-light">${product.price.toFixed(2)}</span>
                                            )}
                                        </div>
                                        {user?.discountRate && (
                                            <p className="text-xs font-semibold tracking-widest uppercase text-gold-600 mt-3 flex items-center">
                                                <Check className="h-3 w-3 mr-1.5" />
                                                Partner Privilege: {user.discountRate}% Discount
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-6 mb-10">
                                        <div className="flex flex-col gap-3">
                                            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">Quantity</span>
                                            <div className="flex items-center bg-white rounded-xl p-1 border border-gold-200/60 shadow-sm">
                                                <button
                                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                    className="p-3 hover:bg-gold-50 text-slate-400 hover:text-gold-600 rounded-lg transition-colors"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="w-12 text-center font-bold text-slate-900 text-lg">{quantity}</span>
                                                <button
                                                    onClick={() => setQuantity(quantity + 1)}
                                                    className="p-3 hover:bg-gold-50 text-slate-400 hover:text-gold-600 rounded-lg transition-colors"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex-1 flex flex-col justify-end pt-[26px]">
                                            <button
                                                onClick={handleAddToCart}
                                                disabled={!product.inStock}
                                                className="w-full h-[52px] flex items-center justify-center space-x-3 bg-slate-900 text-white rounded-xl font-semibold text-xs tracking-widest uppercase hover:bg-black hover:border-gold-500/50 border border-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-md"
                                            >
                                                <ShoppingCart className="h-4 w-4 group-hover:text-gold-400 transition-colors" />
                                                <span>{product.inStock ? 'Acquire Compound' : 'Currently Unavailable'}</span>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="mb-10 p-6 bg-gradient-to-br from-white to-slate-50 border border-gold-100/50 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
                                    <p className="text-xs font-bold tracking-widest uppercase text-slate-900 mb-2">Partner Access Required</p>
                                    <p className="text-sm text-slate-500 leading-relaxed font-light">Pricing and procurement are strictly reserved for verified partners. <a href="/contact" className="text-gold-600 hover:text-gold-700 font-semibold underline underline-offset-4 decoration-gold-200 transition-all">Request access</a> to join our network.</p>
                                </div>
                            )}

                            {/* Extras Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-10 border-t border-gold-100/50">
                                {product.dosage && (
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-gold-50/50 border border-gold-100 text-gold-600 rounded-xl shadow-sm">
                                            <ShieldCheck className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-bold tracking-widest uppercase text-slate-900 mb-1.5">Dosage Protocol</h4>
                                            <p className="text-sm text-slate-500 font-light leading-relaxed">{product.dosage}</p>
                                        </div>
                                    </div>
                                )}

                                {product.benefits && product.benefits.length > 0 && (
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-gold-50/50 border border-gold-100 text-gold-600 rounded-xl shadow-sm">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-bold tracking-widest uppercase text-slate-900 mb-1.5">Primary Focus</h4>
                                            <ul className="text-sm text-slate-500 font-light leading-relaxed space-y-1">
                                                {product.benefits.slice(0, 2).map((b, i) => (
                                                    <li key={i} className="flex items-start">
                                                        <span className="text-gold-400 mr-2 mt-1">•</span>
                                                        <span>{b}</span>
                                                    </li>
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
                <div className="mt-12 bg-white/60 backdrop-blur-xl rounded-[2rem] border border-gold-200/50 p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <h3 className="text-2xl font-serif text-slate-900 mb-8 tracking-tight">Compound Specifications</h3>
                    <div className="text-slate-500 space-y-8 font-light leading-relaxed text-sm md:text-base">
                        <p className="whitespace-pre-wrap">{product.fullDescription || product.description}</p>
                        {product.benefits && product.benefits.length > 0 && (
                            <div>
                                <h4 className="text-[10px] font-bold tracking-widest uppercase text-slate-900 mb-4">Investigative Pathways</h4>
                                <ul className="space-y-3">
                                    {product.benefits.map((b, i) => (
                                        <li key={i} className="flex items-start">
                                            <div className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-2 mr-4 shrink-0" />
                                            <span>{b}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className="bg-slate-900 p-6 md:p-8 rounded-2xl mt-10 border border-slate-800 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-900/20 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full" />
                            <h4 className="text-[10px] font-bold tracking-widest uppercase text-gold-500 mb-3 block">Mandatory Disclaimer</h4>
                            <p className="text-sm text-slate-300 mb-0 font-light leading-relaxed relative z-10">All formulations distributed by Golden Tier are strictly synthesized for laboratory research and analytical methodology only. They are expressly restricted from use as human therapeutics, diagnostics, or consumable supplements.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
