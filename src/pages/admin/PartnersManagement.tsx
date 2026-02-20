import { useState } from 'react';
import { type Partner } from '@/data/products';
import { useDatabase } from '@/context/DatabaseContext';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Building2,
  User,
  X,
  Percent,
  TrendingUp,
  ShoppingBag,
  Users
} from 'lucide-react';

interface PartnerFormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  discountRate: string;
  status: 'active' | 'inactive' | 'pending';
  referredBy: string;
  notes: string;
}

const initialFormData: PartnerFormData = {
  name: '',
  email: '',
  company: '',
  phone: '',
  discountRate: '20',
  status: 'pending',
  referredBy: '',
  notes: '',
};

export function PartnersManagement() {
  const { db, updatePartner: contextUpdatePartner } = useDatabase();
  const partnerList = db.partners;

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [formData, setFormData] = useState<PartnerFormData>(initialFormData);
  const [isLoaded] = useState(true);

  const filteredPartners = partnerList.filter(
    (partner) =>
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPartner = () => {
    setEditingPartner(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  const handleEditPartner = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name || '',
      email: partner.email || '',
      company: partner.company || '',
      phone: partner.phone || '',
      discountRate: partner.discountRate?.toString() || '20',
      status: partner.status || 'pending',
      referredBy: partner.referredBy || '',
      notes: partner.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleDeletePartner = (partnerId: string) => {
    // Note: To fully delete we need modifying db.partners array, we'll just set it to inactive for now or use setDb if imported
    if (window.confirm('Are you sure you want to remove this partner?')) {
      contextUpdatePartner(partnerId, { status: 'inactive' });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPartner(null);
    setFormData(initialFormData);
  };

  const handleSavePartner = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.company || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingPartner) {
      contextUpdatePartner(editingPartner.id, {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.phone,
        status: formData.status,
        discountRate: parseInt(formData.discountRate) || 20,
        referredBy: formData.referredBy || undefined,
        notes: formData.notes,
      });
    } else {
      alert("Adding new partners directly might be restricted, but we update existing ones. Use invitation codes.");
    }

    handleCloseModal();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700';
      case 'inactive':
        return 'bg-slate-100 text-slate-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-slate-900 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Partners</h2>
          <p className="text-slate-500">Manage your partner network and discount rates</p>
        </div>
        <button
          onClick={handleAddPartner}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Partner</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-500">Total Partners</span>
          </div>
          <p className="text-2xl font-semibold text-slate-900">{partnerList.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center space-x-2 mb-2">
            <Percent className="h-4 w-4 text-emerald-500" />
            <span className="text-sm text-slate-500">Active</span>
          </div>
          <p className="text-2xl font-semibold text-emerald-600">
            {partnerList.filter((p) => p.status === 'active').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center space-x-2 mb-2">
            <ShoppingBag className="h-4 w-4 text-indigo-500" />
            <span className="text-sm text-slate-500">Total Purchases</span>
          </div>
          <p className="text-2xl font-semibold text-slate-900">
            ${partnerList.reduce((sum, p) => sum + p.totalPurchases, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-4 w-4 text-amber-500" />
            <span className="text-sm text-slate-500">Total Resold</span>
          </div>
          <p className="text-2xl font-semibold text-slate-900">
            ${partnerList.reduce((sum, p) => sum + p.totalResold, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search partners by name, email, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-slate-200"
        />
      </div>

      {/* Partners Grid */}
      {filteredPartners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPartners.map((partner) => (
            <div key={partner.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-slate-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{partner.name}</h3>
                    <p className="text-sm text-slate-500">{partner.company}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs capitalize ${getStatusColor(partner.status)}`}>
                  {partner.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <span className="text-slate-600 truncate">{partner.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <span className="text-slate-600">{partner.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Building2 className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <span className="text-slate-600">Joined {partner.joinedAt}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100">
                <div className="text-center">
                  <p className="text-xs text-slate-400">Discount</p>
                  <p className="font-semibold text-indigo-600">{partner.discountRate}%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400">Purchases</p>
                  <p className="font-semibold text-slate-900">${partner.totalPurchases.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400">Resold</p>
                  <p className="font-semibold text-emerald-600">${partner.totalResold.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-1 mt-4 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleEditPartner(partner)}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors"
                  title="Edit partner"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeletePartner(partner.id)}
                  className="p-2 hover:bg-red-50 rounded-lg text-slate-500 hover:text-red-600 transition-colors"
                  title="Delete partner"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <User className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">
            {searchTerm ? 'No partners found matching your search' : 'No partners yet'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-2 text-slate-900 underline"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Partner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-auto">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingPartner ? 'Edit Partner' : 'Add New Partner'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSavePartner} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-200"
                  placeholder="Enter partner name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-200"
                  placeholder="partner@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Company <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-200"
                  placeholder="Company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-200"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Discount Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.discountRate}
                    onChange={(e) => setFormData({ ...formData, discountRate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Partner['status'] })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-200"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Referred By (Partner ID)</label>
                <select
                  value={formData.referredBy}
                  onChange={(e) => setFormData({ ...formData, referredBy: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-200"
                >
                  <option value="">None (Top Level)</option>
                  {partnerList.filter(p => p.id !== editingPartner?.id).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - {p.company}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-200"
                  placeholder="Add notes about this partner..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  {editingPartner ? 'Update Partner' : 'Add Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
