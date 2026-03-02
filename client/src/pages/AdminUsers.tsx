import { useEffect, useState } from 'react';
import { adminAPI } from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Shield,
  Trash2,
  ChevronDown,
  ChevronUp,
  Snowflake,
  CheckCircle2,
  XCircle,
  Wallet,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface UserRow {
  user_id: string;
  username: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  last_login: string;
  account_count: string;
  total_balance: string;
}

interface UserAccount {
  account_id: string;
  account_number: string;
  account_type: string;
  balance: string;
  status: string;
  created_at: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(false);

  // Balance adjustment modal
  const [adjustModal, setAdjustModal] = useState<{ account: UserAccount } | null>(null);
  const [adjustType, setAdjustType] = useState<'CREDIT' | 'DEBIT'>('CREDIT');
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustReason, setAdjustReason] = useState('');
  const [adjusting, setAdjusting] = useState(false);

  // Delete confirmation
  const [deleteModal, setDeleteModal] = useState<UserRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadUsers = async () => {
    try {
      const res = await adminAPI.getUsers();
      setUsers(res.data);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleUser = async (userId: string) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
      return;
    }
    setExpandedUser(userId);
    setAccountsLoading(true);
    try {
      const res = await adminAPI.getUserAccounts(userId);
      setUserAccounts(res.data);
    } catch {
      toast.error('Failed to load accounts');
    } finally {
      setAccountsLoading(false);
    }
  };

  const handleStatusChange = async (accountId: string, newStatus: 'ACTIVE' | 'FROZEN' | 'CLOSED') => {
    try {
      await adminAPI.updateAccountStatus({ accountId, status: newStatus });
      toast.success(`Account ${newStatus.toLowerCase()} successfully`);
      if (expandedUser) {
        const res = await adminAPI.getUserAccounts(expandedUser);
        setUserAccounts(res.data);
      }
      loadUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleAdjust = async () => {
    if (!adjustModal || !adjustAmount) return;
    setAdjusting(true);
    try {
      await adminAPI.adjustBalance({
        accountId: adjustModal.account.account_id,
        amount: parseFloat(adjustAmount),
        type: adjustType,
        reason: adjustReason,
      });
      toast.success(`Balance ${adjustType.toLowerCase()}ed successfully`);
      setAdjustModal(null);
      setAdjustAmount('');
      setAdjustReason('');
      if (expandedUser) {
        const res = await adminAPI.getUserAccounts(expandedUser);
        setUserAccounts(res.data);
      }
      loadUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Adjustment failed');
    } finally {
      setAdjusting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);
    try {
      await adminAPI.deleteUser(deleteModal.user_id);
      toast.success(`User ${deleteModal.username} deleted`);
      setDeleteModal(null);
      setExpandedUser(null);
      loadUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
            <CheckCircle2 size={10} /> Active
          </span>
        );
      case 'FROZEN':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full">
            <Snowflake size={10} /> Frozen
          </span>
        );
      case 'CLOSED':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full">
            <XCircle size={10} /> Closed
          </span>
        );
      default:
        return <span className="text-xs text-slate-400">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl gradient-primary">
            <Users size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">User Management</h1>
            <p className="text-sm text-slate-400">{users.length} registered users</p>
          </div>
        </div>

        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-500 outline-none focus:border-blue-500/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Users List — expandable cards */}
      <div className="space-y-3">
        {filtered.map((u) => (
          <motion.div
            key={u.user_id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            {/* User Row */}
            <button
              onClick={() => toggleUser(u.user_id)}
              className="w-full px-6 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition text-left"
            >
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
                {u.full_name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-200">{u.full_name}</p>
                  {u.role === 'ADMIN' && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                      <Shield size={8} /> Admin
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">@{u.username} &middot; {u.email}</p>
              </div>
              <div className="hidden sm:flex items-center gap-6 text-sm">
                <div className="text-right">
                  <p className="text-xs text-slate-500">Accounts</p>
                  <p className="text-slate-300 font-medium">{u.account_count}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Balance</p>
                  <p className="text-emerald-400 font-medium">
                    ${parseFloat(u.total_balance || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Joined</p>
                  <p className="text-slate-400">{new Date(u.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              {expandedUser === u.user_id ? (
                <ChevronUp size={18} className="text-slate-500 shrink-0" />
              ) : (
                <ChevronDown size={18} className="text-slate-500 shrink-0" />
              )}
            </button>

            {/* Expanded Section — accounts + actions */}
            <AnimatePresence>
              {expandedUser === u.user_id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-slate-800/50"
                >
                  <div className="px-6 py-5 space-y-4">
                    {accountsLoading ? (
                      <div className="flex justify-center py-6">
                        <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                      </div>
                    ) : userAccounts.length === 0 ? (
                      <p className="text-sm text-slate-500 text-center py-4">No accounts found for this user.</p>
                    ) : (
                      <>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Accounts</p>
                        <div className="space-y-2">
                          {userAccounts.map((acc) => (
                            <div
                              key={acc.account_id}
                              className="flex flex-wrap items-center gap-4 p-4 bg-slate-800/30 rounded-xl border border-slate-700/20"
                            >
                              <div className="flex items-center gap-3 min-w-[180px]">
                                <Wallet size={16} className="text-blue-400 shrink-0" />
                                <div>
                                  <p className="text-sm font-mono text-slate-300">{acc.account_number}</p>
                                  <p className="text-xs text-slate-500">{acc.account_type}</p>
                                </div>
                              </div>
                              <div className="min-w-[100px]">
                                <p className="text-sm font-semibold text-white">
                                  ${parseFloat(acc.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </p>
                              </div>
                              <div>{statusBadge(acc.status)}</div>
                              <div className="flex items-center gap-2 ml-auto">
                                <button
                                  onClick={() => setAdjustModal({ account: acc })}
                                  className="text-xs font-medium text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-lg hover:bg-blue-500/20 transition"
                                >
                                  Adjust Balance
                                </button>
                                {acc.status === 'ACTIVE' ? (
                                  <>
                                    <button
                                      onClick={() => handleStatusChange(acc.account_id, 'FROZEN')}
                                      className="text-xs font-medium text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded-lg hover:bg-blue-500/20 transition flex items-center gap-1"
                                    >
                                      <Snowflake size={12} /> Freeze
                                    </button>
                                    <button
                                      onClick={() => handleStatusChange(acc.account_id, 'CLOSED')}
                                      className="text-xs font-medium text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition flex items-center gap-1"
                                    >
                                      <XCircle size={12} /> Close
                                    </button>
                                  </>
                                ) : acc.status === 'FROZEN' ? (
                                  <>
                                    <button
                                      onClick={() => handleStatusChange(acc.account_id, 'ACTIVE')}
                                      className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg hover:bg-emerald-500/20 transition flex items-center gap-1"
                                    >
                                      <CheckCircle2 size={12} /> Activate
                                    </button>
                                    <button
                                      onClick={() => handleStatusChange(acc.account_id, 'CLOSED')}
                                      className="text-xs font-medium text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition flex items-center gap-1"
                                    >
                                      <XCircle size={12} /> Close
                                    </button>
                                  </>
                                ) : (
                                  <span className="text-xs text-slate-500 italic">Closed</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Delete User button */}
                    {u.role !== 'ADMIN' && (
                      <div className="pt-3 border-t border-slate-800/50">
                        <button
                          onClick={() => setDeleteModal(u)}
                          className="flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-300 transition"
                        >
                          <Trash2 size={14} /> Delete User
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="glass-card rounded-2xl p-16 text-center text-slate-500">
            No users found
          </div>
        )}
      </div>

      {/* Balance Adjustment Modal */}
      {adjustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setAdjustModal(null)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative glass-card rounded-2xl p-8 w-full max-w-md shadow-2xl z-10"
          >
            <h3 className="text-xl font-bold text-white mb-1">Balance Adjustment</h3>
            <p className="text-sm text-slate-400 mb-6">
              Account: {adjustModal.account.account_number} &middot; Balance: ${parseFloat(adjustModal.account.balance).toLocaleString()}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAdjustType('CREDIT')}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${
                      adjustType === 'CREDIT'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
                    }`}
                  >
                    Credit (+)
                  </button>
                  <button
                    onClick={() => setAdjustType('DEBIT')}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${
                      adjustType === 'DEBIT'
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
                    }`}
                  >
                    Debit (-)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 outline-none focus:border-blue-500/50"
                  placeholder="0.00"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Reason</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 outline-none focus:border-blue-500/50"
                  placeholder="e.g., Error correction, Bank charge reversal"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAdjust}
                  disabled={adjusting || !adjustAmount}
                  className={`flex-1 py-3 rounded-xl font-semibold text-white transition disabled:opacity-50 ${
                    adjustType === 'CREDIT' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {adjusting ? 'Processing...' : `Confirm ${adjustType}`}
                </button>
                <button
                  onClick={() => setAdjustModal(null)}
                  className="py-3 px-5 rounded-xl font-semibold text-slate-400 bg-slate-800/50 hover:bg-slate-700/50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteModal(null)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative glass-card rounded-2xl p-8 w-full max-w-md shadow-2xl z-10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-red-500/10">
                <AlertTriangle size={22} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Delete User</h3>
                <p className="text-sm text-slate-400">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 mb-6">
              Are you sure you want to delete <strong className="text-white">{deleteModal.full_name}</strong> (@{deleteModal.username})?
              All their accounts and transaction history will be permanently removed.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-3 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete User'}
              </button>
              <button
                onClick={() => setDeleteModal(null)}
                className="py-3 px-5 rounded-xl font-semibold text-slate-400 bg-slate-800/50 hover:bg-slate-700/50 transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
