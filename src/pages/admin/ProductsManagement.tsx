import { useState } from 'react';
import { type Product } from '@/data/products';
import { useDatabase } from '@/context/DatabaseContext';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  QrCode,
  ChevronLeft,
  Package
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface ProductFormData {
  name: string;
  description: string;
  fullDescription: string;
  price: string;
  category: string;
  purity: string;
  stockQuantity: string;
  sku: string;
  benefits: string;
  dosage: string;
  imageUrl: string;
}

export function ProductsManagement() {
  const { db, addProduct: contextAddProduct, updateProduct: contextUpdateProduct, deleteProduct: contextDeleteProduct } = useDatabase();
  const productList = db.products;
  const dynamicCategories = Array.from(new Set(productList.map(p => p.category))).sort();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showQRCode, setShowQRCode] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    fullDescription: '',
    price: '',
    category: '',
    purity: '99.0%',
    stockQuantity: '0',
    sku: '',
    benefits: '',
    dosage: '',
    imageUrl: '',
  });

  const filteredProducts = productList.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      fullDescription: '',
      price: '',
      category: '',
      purity: '99.0%',
      stockQuantity: '0',
      sku: '',
      benefits: '',
      dosage: '',
      imageUrl: '',
    });
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      fullDescription: product.fullDescription || '',
      price: product.price.toString(),
      category: product.category,
      purity: product.purity,
      stockQuantity: product.stockQuantity.toString(),
      sku: product.sku,
      benefits: product.benefits?.join('\n') || '',
      dosage: product.dosage || '',
      imageUrl: product.imageUrl || '',
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      contextDeleteProduct(productId);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const newProduct: Product = {
      id: editingProduct?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      fullDescription: formData.fullDescription,
      price: parseFloat(formData.price),
      category: formData.category,
      purity: formData.purity,
      inStock: parseInt(formData.stockQuantity) > 0,
      stockQuantity: parseInt(formData.stockQuantity),
      sku: formData.sku,
      benefits: formData.benefits.split('\n').filter(Boolean),
      dosage: formData.dosage,
      imageUrl: formData.imageUrl,
      createdAt: editingProduct?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    if (editingProduct) {
      contextUpdateProduct(editingProduct.id, newProduct);
    } else {
      contextAddProduct(newProduct);
    }

    setIsModalOpen(false);
  };

  const generateQRData = (product: Product) => {
    return JSON.stringify({
      id: product.id,
      sku: product.sku,
      name: product.name,
      batch: `BATCH-${Date.now().toString(36).toUpperCase()}`, // eslint-disable-line react-hooks/purity -- event handler, not render
      manufactured: new Date().toISOString().split('T')[0],
      purity: product.purity,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Products Management</h2>
        <button
          onClick={handleAddProduct}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search products by name, SKU, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Products Table */}
      <div className="bg-background rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-alt">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Product</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">SKU</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Stock</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Purity</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-surface-alt/50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-xs">
                        {product.description}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{product.sku}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`${product.stockQuantity < 20 ? 'text-destructive' : 'text-green-600'
                      }`}>
                      {product.stockQuantity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{product.purity}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowQRCode(product)}
                        className="p-2 hover:bg-surface-alt rounded-lg text-muted-foreground hover:text-primary"
                        title="Generate QR Code"
                      >
                        <QrCode className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-2 hover:bg-surface-alt rounded-lg text-muted-foreground hover:text-primary"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 hover:bg-surface-alt rounded-lg text-muted-foreground hover:text-destructive"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-8 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No products found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-surface-alt rounded-lg"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">SKU *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Short Description *</label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-primary focus:border-primary"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Purity</label>
                  <input
                    type="text"
                    value={formData.purity}
                    onChange={(e) => setFormData({ ...formData, purity: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <input
                    type="text"
                    list="category-options"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-primary focus:border-primary"
                    placeholder="e.g. Healing, Metabolism"
                    required
                  />
                  <datalist id="category-options">
                    {dynamicCategories.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Dosage Protocol</label>
                  <input
                    type="text"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Benefits (one per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-primary focus:border-primary"
                  placeholder="Enter benefits, one per line..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-input rounded-lg hover:bg-surface-alt transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg p-6 max-w-sm w-full">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">Product QR Code</h3>
              <p className="text-sm text-muted-foreground">{showQRCode.name}</p>
              <p className="text-xs text-muted-foreground">{showQRCode.sku}</p>
            </div>
            <div className="flex justify-center mb-4">
              <QRCodeSVG
                value={generateQRData(showQRCode)}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <div className="text-center text-xs text-muted-foreground mb-4">
              <p>Scan to track product inventory</p>
            </div>
            <button
              onClick={() => setShowQRCode(null)}
              className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
