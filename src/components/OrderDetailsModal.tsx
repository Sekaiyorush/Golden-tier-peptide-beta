import { X, CheckCircle2, Truck, Clock, MapPin, Package, AlertCircle } from 'lucide-react';
import type { Order } from '@/data/products';
import { useDatabase } from '@/context/DatabaseContext';
import { formatTHB } from '@/lib/formatPrice';

interface OrderDetailsModalProps {
    order: Order;
    onClose: () => void;
}

export function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
    const { db } = useDatabase();
    const customer = db.customers.find(c => c.id === order.customerId);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'delivered': return <CheckCircle2 className="h-6 w-6 text-emerald-500" />;
            case 'shipped': return <Truck className="h-6 w-6 text-blue-500" />;
            case 'processing': return <Clock className="h-6 w-6 text-amber-500" />;
            case 'cancelled': return <AlertCircle className="h-6 w-6 text-red-500" />;
            default: return <Clock className="h-6 w-6 text-slate-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-emerald-50 border-emerald-200 text-emerald-700';
            case 'shipped': return 'bg-blue-50 border-blue-200 text-blue-700';
            case 'processing': return 'bg-amber-50 border-amber-200 text-amber-700';
            case 'cancelled': return 'bg-red-50 border-red-200 text-red-700';
            default: return 'bg-slate-50 border-slate-200 text-slate-700';
        }
    };

    // Tracking timeline mock
    const trackingSteps = [
        { status: 'pending', label: 'Order Placed', date: order.createdAt, completed: true },
        { status: 'processing', label: 'Processing', date: 'In Progress', completed: ['processing', 'shipped', 'delivered'].includes(order.status) },
        { status: 'shipped', label: 'Shipped', date: 'Pending', completed: ['shipped', 'delivered'].includes(order.status) },
        { status: 'delivered', label: 'Delivered', date: 'Pending', completed: order.status === 'delivered' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm z-[100]">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">Order Details</h2>
                        <p className="text-sm text-slate-500 mt-1">ID: {order.id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* Status Banner */}
                    <div className={`p-4 rounded-xl border flex items-center space-x-4 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <div>
                            <p className="font-semibold capitalize">{order.status}</p>
                            <p className="text-sm opacity-80">
                                {order.status === 'delivered' && 'Package has been delivered to the destination.'}
                                {order.status === 'shipped' && 'Package is currently in transit with the carrier.'}
                                {order.status === 'processing' && 'We are preparing your items for shipment.'}
                                {order.status === 'pending' && 'We have received your order and are waiting to process it.'}
                                {order.status === 'cancelled' && 'This order has been cancelled.'}
                            </p>
                        </div>
                    </div>

                    {/* Tracking Timeline */}
                    {order.status !== 'cancelled' && (
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-4">Tracking History</h3>
                            <div className="relative">
                                <div className="absolute left-3.5 top-3 bottom-3 w-0.5 bg-slate-200"></div>
                                <div className="space-y-6">
                                    {trackingSteps.map((step, idx) => (
                                        <div key={idx} className="relative flex items-center space-x-4">
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center relative z-10 ${step.completed ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                                {step.completed ? <CheckCircle2 className="h-4 w-4" /> : <div className="w-2 h-2 rounded-full bg-slate-400" />}
                                            </div>
                                            <div>
                                                <p className={`font-medium ${step.completed ? 'text-slate-900' : 'text-slate-500'}`}>{step.label}</p>
                                                <p className="text-xs text-slate-500">{step.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-900 flex items-center">
                                <MapPin className="h-4 w-4 mr-2" /> Shipping Address
                            </h3>
                            <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600">
                                <p className="font-medium text-slate-900 mb-1">{order.customerName}</p>
                                {customer?.address?.street ? (
                                    <address className="not-italic">
                                        {customer.address.street}<br />
                                        {customer.address.city}, {customer.address.state} {customer.address.zip}<br />
                                        {customer.address.country}
                                    </address>
                                ) : (
                                    <p>Shipping address not provided or legacy order.</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-900 flex items-center">
                                <Package className="h-4 w-4 mr-2" /> Order Metadata
                            </h3>
                            <div className="bg-slate-50 p-4 rounded-lg text-sm space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Date Placed</span>
                                    <span className="text-slate-900 font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Payment Status</span>
                                    <span className="text-slate-900 font-medium capitalize">{order.paymentStatus}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Items Summary</h3>
                        <div className="bg-white border text-sm border-slate-200 rounded-xl overflow-hidden">
                            <div className="divide-y divide-slate-100">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="p-4 flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="font-medium text-slate-900">{item.quantity}x</div>
                                            <div className="text-slate-600">{item.name}</div>
                                        </div>
                                        <div className="font-medium text-slate-900">{formatTHB(item.price * item.quantity)}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
                                <span className="font-medium text-slate-700">Total</span>
                                <span className="font-bold text-slate-900 text-lg">{formatTHB(order.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
