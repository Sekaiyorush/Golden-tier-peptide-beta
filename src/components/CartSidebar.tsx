import { useCart, getItemPrice } from '@/context/CartContext';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CartSidebar() {
  const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, cartSubtotal, discountAmount, cartTotal } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white border-l border-slate-200 z-50 shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Your Cart</h2>
            <p className="text-sm text-slate-500">{items.length} items</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-900 font-medium">Your cart is empty</p>
              <p className="text-sm text-slate-500 mt-1">Add some products to get started</p>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-4 px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedVariant?.sku || 'base'}`}
                  className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl"
                >
                  <div className="w-14 h-14 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-slate-600 font-semibold text-sm">
                      {item.product.name.split('-')[0]}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">{item.product.name}</p>
                    {item.selectedVariant && (
                      <p className="text-xs text-slate-400">{item.selectedVariant.label}</p>
                    )}
                    <p className="text-sm text-slate-500">฿{getItemPrice(item).toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedVariant?.sku)}
                      className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVariant?.sku)}
                      className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id, item.selectedVariant?.sku)}
                    className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-slate-100 p-5 space-y-4 bg-slate-50">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium text-slate-900">฿{cartSubtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>Partner Discount</span>
                  <span className="font-medium">-฿{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Shipping</span>
                <span className="text-slate-500">Calculated at checkout</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="font-medium text-slate-900">Total</span>
                <span className="text-xl font-semibold text-slate-900">฿{cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              onClick={() => setIsOpen(false)}
              className="w-full h-11 flex items-center justify-center rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors space-x-2"
            >
              <span>Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full h-10 text-sm text-slate-500 hover:text-slate-900"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
