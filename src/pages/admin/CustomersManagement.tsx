import { useState } from 'react';
import { useDatabase } from '@/context/DatabaseContext';
import { formatDate } from '@/lib/formatDate';
import { formatTHB } from '@/lib/formatPrice';
import { TableRowSkeleton } from '@/components/skeletons/TableRowSkeleton';
import {
  Search,
  Mail,
  Phone,
  ShoppingBag,
  DollarSign,
  User,
  ChevronDown,
  ChevronUp,
  Filter
} from 'lucide-react';

export function CustomersManagement() {
  const { db, isLoading } = useDatabase();
  const customerList = db.customers;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);

  const filteredCustomers = customerList.filter((customer) => {
    const matchesSearch =
      (customer.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700';
      case 'inactive':
        return 'bg-slate-100 text-slate-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Customers</h2>
        <p className="text-slate-500">Manage your customer base</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-500">Total Customers</p>
          <p className="text-2xl font-semibold text-slate-900">{customerList.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-500">Active</p>
          <p className="text-2xl font-semibold text-emerald-600">
            {customerList.filter((c) => c.status === 'active').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-500">Inactive</p>
          <p className="text-2xl font-semibold text-slate-600">
            {customerList.filter((c) => c.status === 'inactive').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-500">Total Revenue</p>
          <p className="text-2xl font-semibold text-slate-900">
            {formatTHB(customerList.reduce((sum, c) => sum + c.totalSpent, 0))}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-slate-200 focus:border-slate-300"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-slate-200"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Contact</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Orders</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Total Spent</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <TableRowSkeleton columns={6} rows={5} />
              ) : filteredCustomers.map((customer) => (
                <>
                  <tr key={customer.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-slate-500" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{customer.name || customer.email}</p>
                          <p className="text-xs text-slate-500">Since {formatDate(customer.joinedAt)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <Mail className="h-3.5 w-3.5" />
                          <span>{customer.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <Phone className="h-3.5 w-3.5" />
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <ShoppingBag className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-900">{customer.totalOrders}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-slate-400" />
                        <span className="font-medium text-slate-900">{customer.totalSpent.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setExpandedCustomer(expandedCustomer === customer.id ? null : customer.id)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        {expandedCustomer === customer.id ? (
                          <ChevronUp className="h-4 w-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        )}
                      </button>
                    </td>
                  </tr>
                  {expandedCustomer === customer.id && (
                    <tr>
                      <td colSpan={6} className="px-4 py-4 bg-slate-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-slate-700 mb-2">Customer Details</h4>
                            <div className="space-y-2 text-sm">
                              <p className="text-slate-600">
                                <span className="text-slate-400">Last Order:</span> {customer.lastOrderAt ? formatDate(customer.lastOrderAt) : 'Never'}
                              </p>
                              {customer.notes && (
                                <p className="text-slate-600">
                                  <span className="text-slate-400">Notes:</span> {customer.notes}
                                </p>
                              )}
                            </div>
                          </div>
                          {customer.address && (
                            <div>
                              <h4 className="text-sm font-medium text-slate-700 mb-2">Address</h4>
                              <div className="text-sm text-slate-600">
                                <p>{customer.address.street}</p>
                                <p>{customer.address.city}, {customer.address.state} {customer.address.zip}</p>
                                <p>{customer.address.country}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))
              }
            </tbody>
          </table>
        </div>

        {!isLoading && filteredCustomers.length === 0 && (
          <div className="p-8 text-center">
            <User className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No customers found</p>
          </div>
        )}
      </div>
    </div>
  );
}
