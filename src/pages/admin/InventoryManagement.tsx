import { useState } from 'react';
import { useDatabase } from '@/context/DatabaseContext';
import {
    PackageSearch,
    Plus,
    Minus,
    Search,
    AlertTriangle,
    X
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export function InventoryManagement() {
    const { db, addInventoryLog } = useDatabase();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
    const [adjustData, setAdjustData] = useState({
        changeQuantity: 0,
        reason: 'received' as 'received' | 'sold' | 'damaged' | 'returned' | 'adjustment',
        notes: ''
    });

    const products = db.products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const logs = db.inventoryLogs.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const productLogs = selectedProduct
        ? logs.filter(l => l.productId === selectedProduct)
        : logs;

    const lowStockProducts = products.filter(p => p.stockQuantity < (p.lowStockThreshold || 10));

    const handleAdjustStock = () => {
        if (!selectedProduct) return;

        addInventoryLog({
            productId: selectedProduct,
            changeQuantity: adjustData.changeQuantity,
            reason: adjustData.reason,
            notes: adjustData.notes
        });

        setIsAdjustModalOpen(false);
        setAdjustData({ changeQuantity: 0, reason: 'received', notes: '' });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">Inventory Management</h2>
                    <p className="text-slate-500">Track and adjust product stock levels</p>
                </div>
            </div>

            {lowStockProducts.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-center space-x-2 text-amber-800 font-medium mb-3">
                        <AlertTriangle className="h-5 w-5" />
                        <span>Low Stock Alerts ({lowStockProducts.length})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {lowStockProducts.map(p => (
                            <div key={p.id} className="bg-white p-3 rounded-lg border border-amber-100 flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-slate-900">{p.name}</p>
                                    <p className="text-xs text-slate-500">SKU: {p.sku}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-red-600">{p.stockQuantity}</p>
                                    <p className="text-xs text-slate-400">Threshold: {p.lowStockThreshold || 10}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Products List */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
                    <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900">Products Stock</h3>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-200"
                            />
                        </div>
                    </div>
                    <div className="overflow-auto flex-1 p-4">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 text-sm text-slate-500">
                                    <th className="pb-3 font-medium">Product / SKU</th>
                                    <th className="pb-3 font-medium text-right">Current Stock</th>
                                    <th className="pb-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {products.map(p => (
                                    <tr key={p.id} className={`hover:bg-slate-50 cursor-pointer ${selectedProduct === p.id ? 'bg-slate-50' : ''}`} onClick={() => setSelectedProduct(p.id)}>
                                        <td className="py-3">
                                            <p className="font-medium text-slate-900">{p.name}</p>
                                            <p className="text-xs text-slate-500">{p.sku}</p>
                                        </td>
                                        <td className="py-3 text-right">
                                            <span className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${p.stockQuantity <= (p.lowStockThreshold || 10) ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                                                }`}>
                                                {p.stockQuantity} units
                                            </span>
                                        </td>
                                        <td className="py-3 text-right">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedProduct(p.id);
                                                    setAdjustData({ changeQuantity: 0, reason: 'received', notes: '' });
                                                    setIsAdjustModalOpen(true);
                                                }}
                                                className="px-3 py-1 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors text-sm font-medium"
                                            >
                                                Adjust
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Product Details & QR */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col h-[600px]">
                    <h3 className="font-semibold text-slate-900 mb-4">Stock History</h3>

                    {selectedProduct ? (
                        <div className="flex-1 overflow-auto">
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-4 flex items-start gap-4">
                                <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm shrink-0">
                                    <QRCodeSVG
                                        value={`https://goldentierpeptide.com/product/${products.find(p => p.id === selectedProduct)?.sku}`}
                                        size={80}
                                    />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{products.find(p => p.id === selectedProduct)?.name}</p>
                                    <p className="text-sm text-slate-500 mb-2">Scan to view product page</p>
                                    <div className="flex gap-2 text-xs">
                                        <span className="bg-white px-2 py-1 rounded border border-slate-200">
                                            Stock: {products.find(p => p.id === selectedProduct)?.stockQuantity}
                                        </span>
                                        <span className="bg-white px-2 py-1 rounded border border-slate-200">
                                            Thr: {products.find(p => p.id === selectedProduct)?.lowStockThreshold || 10}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {productLogs.length > 0 ? productLogs.map(log => (
                                    <div key={log.id} className="p-3 border border-slate-100 rounded-lg">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${log.changeQuantity > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {log.changeQuantity > 0 ? '+' : ''}{log.changeQuantity}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {new Date(log.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-slate-700 capitalize">{log.reason}</p>
                                        {log.notes && <p className="text-xs text-slate-500 mt-1">{log.notes}</p>}
                                        <p className="text-xs text-slate-400 mt-1">By {log.performedByName}</p>
                                    </div>
                                )) : (
                                    <p className="text-sm text-slate-500 italic text-center py-4">No history for this product.</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                            <PackageSearch className="h-12 w-12 mb-2 opacity-50" />
                            <p>Select a product to view details</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Adjust Stock Modal */}
            {isAdjustModalOpen && selectedProduct && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-sm w-full p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-lg">Adjust Stock</h3>
                            <button onClick={() => setIsAdjustModalOpen(false)} className="p-1 hover:bg-slate-100 rounded">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <p className="text-sm font-medium text-slate-700 mb-4">
                            {products.find(p => p.id === selectedProduct)?.name}
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Reason</label>
                                <select
                                    value={adjustData.reason}
                                    onChange={e => setAdjustData({ ...adjustData, reason: e.target.value as any })}
                                    className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                                >
                                    <option value="received">Received (+)</option>
                                    <option value="returned">Returned (+)</option>
                                    <option value="sold">Sold (-)</option>
                                    <option value="damaged">Damaged (-)</option>
                                    <option value="adjustment">Manual Adjustment</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Quantity Change</label>
                                <div className="flex items-center gap-2">
                                    <button type="button" onClick={() => setAdjustData(d => ({ ...d, changeQuantity: d.changeQuantity - 1 }))} className="p-2 bg-slate-100 rounded hover:bg-slate-200"><Minus className="h-4 w-4" /></button>
                                    <input
                                        type="number"
                                        value={adjustData.changeQuantity}
                                        onChange={e => setAdjustData({ ...adjustData, changeQuantity: parseInt(e.target.value) || 0 })}
                                        className="flex-1 p-2 border border-slate-200 rounded-lg text-center font-bold"
                                    />
                                    <button type="button" onClick={() => setAdjustData(d => ({ ...d, changeQuantity: d.changeQuantity + 1 }))} className="p-2 bg-slate-100 rounded hover:bg-slate-200"><Plus className="h-4 w-4" /></button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Notes (Optional)</label>
                                <input
                                    type="text"
                                    value={adjustData.notes}
                                    onChange={e => setAdjustData({ ...adjustData, notes: e.target.value })}
                                    className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                                    placeholder="e.g. Broken vial during shipping"
                                />
                            </div>

                            <button
                                onClick={handleAdjustStock}
                                disabled={adjustData.changeQuantity === 0}
                                className="w-full py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50"
                            >
                                Save Adjustment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
