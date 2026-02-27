import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { formatDateTime } from '@/lib/formatDate';
import { TableRowSkeleton } from '@/components/skeletons/TableRowSkeleton';
import {
  Search,
  Filter,
  Shield,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  User,
  Package,
  ShoppingCart,
  Settings,
  Key,
  AlertTriangle
} from 'lucide-react';

interface AuditEntry {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
  // Joined profile data
  user_email?: string;
  user_name?: string;
}

const PAGE_SIZE = 20;

const ACTION_ICONS: Record<string, typeof Shield> = {
  login: Key,
  logout: Key,
  register: User,
  order: ShoppingCart,
  product: Package,
  partner: User,
  settings: Settings,
  security: AlertTriangle,
};

const ACTION_COLORS: Record<string, string> = {
  create: 'bg-emerald-100 text-emerald-700',
  update: 'bg-blue-100 text-blue-700',
  delete: 'bg-red-100 text-red-700',
  login: 'bg-purple-100 text-purple-700',
  logout: 'bg-slate-100 text-slate-700',
  view: 'bg-amber-100 text-amber-700',
};

function getActionColor(action: string): string {
  const lowerAction = action.toLowerCase();
  for (const [key, color] of Object.entries(ACTION_COLORS)) {
    if (lowerAction.includes(key)) return color;
  }
  return 'bg-slate-100 text-slate-700';
}

function getEntityIcon(entityType: string | null) {
  if (!entityType) return Shield;
  const lower = entityType.toLowerCase();
  for (const [key, icon] of Object.entries(ACTION_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return Shield;
}

export function AuditLogViewer() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [entityFilter, setEntityFilter] = useState('all');
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAuditLogs = useCallback(async () => {
    setIsLoading(true);

    let query = supabase
      .from('audit_log')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (entityFilter !== 'all') {
      query = query.eq('entity_type', entityFilter);
    }

    if (searchTerm) {
      query = query.or(`action.ilike.%${searchTerm}%,entity_type.ilike.%${searchTerm}%,entity_id.ilike.%${searchTerm}%`);
    }

    const { data, count, error } = await query;

    if (error) {
      console.error('Error fetching audit logs:', error);
      setIsLoading(false);
      return;
    }

    // Fetch user profiles for the user_ids
    const userIds = [...new Set((data || []).map(e => e.user_id).filter(Boolean))];
    let profileMap: Record<string, { email: string; full_name: string | null }> = {};

    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .in('id', userIds);

      if (profiles) {
        profileMap = Object.fromEntries(
          profiles.map(p => [p.id, { email: p.email, full_name: p.full_name }])
        );
      }
    }

    const enriched: AuditEntry[] = (data || []).map(entry => ({
      ...entry,
      user_email: entry.user_id ? profileMap[entry.user_id]?.email : undefined,
      user_name: entry.user_id ? profileMap[entry.user_id]?.full_name || undefined : undefined,
    }));

    setEntries(enriched);
    setTotalCount(count || 0);
    setIsLoading(false);
  }, [page, entityFilter, searchTerm]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAuditLogs();
    setIsRefreshing(false);
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // Get unique entity types for filter
  const entityTypes = ['all', 'order', 'product', 'partner', 'customer', 'invitation_code', 'settings', 'auth'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Audit Log</h2>
          <p className="text-slate-500">Track all system actions and changes</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="text-sm">Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search actions, entities..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-slate-200 focus:border-slate-300"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={entityFilter}
            onChange={(e) => { setEntityFilter(e.target.value); setPage(0); }}
            className="px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-slate-200"
          >
            {entityTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center space-x-4 text-sm text-slate-500">
        <span>{totalCount} total entries</span>
        <span>•</span>
        <span>Page {page + 1} of {totalPages || 1}</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Time</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">User</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Action</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Entity</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">IP</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <TableRowSkeleton columns={6} rows={8} />
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <Shield className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No audit log entries found</p>
                  </td>
                </tr>
              ) : entries.map((entry) => {
                const Icon = getEntityIcon(entry.entity_type);
                return (
                  <React.Fragment key={entry.id}>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">
                        {formatDateTime(entry.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{entry.user_name || 'System'}</p>
                          <p className="text-xs text-slate-400">{entry.user_email || entry.user_id || '—'}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getActionColor(entry.action)}`}>
                          {entry.action}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4 text-slate-400" />
                          <div>
                            <p className="text-sm text-slate-700">{entry.entity_type || '—'}</p>
                            {entry.entity_id && (
                              <p className="text-xs text-slate-400 font-mono truncate max-w-[150px]">{entry.entity_id}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400 font-mono">
                        {entry.ip_address || '—'}
                      </td>
                      <td className="px-4 py-3">
                        {entry.details && Object.keys(entry.details).length > 0 && (
                          <button
                            onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            {expandedEntry === entry.id ? (
                              <ChevronUp className="h-4 w-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-slate-400" />
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                    {expandedEntry === entry.id && entry.details && (
                      <tr>
                        <td colSpan={6} className="px-4 py-4 bg-slate-50">
                          <div className="max-w-3xl">
                            <h4 className="text-sm font-medium text-slate-700 mb-2">Details</h4>
                            <pre className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 overflow-x-auto whitespace-pre-wrap font-mono">
                              {JSON.stringify(entry.details, null, 2)}
                            </pre>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="text-sm">Previous</span>
          </button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i;
              } else if (page < 3) {
                pageNum = i;
              } else if (page > totalPages - 4) {
                pageNum = totalPages - 5 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    page === pageNum
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-sm">Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
