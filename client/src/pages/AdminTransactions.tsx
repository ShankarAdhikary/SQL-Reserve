import { useEffect, useState } from 'react';
import { adminAPI } from '../api/client';
import { motion } from 'framer-motion';
import { ScrollText, Search, ArrowLeftRight, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Transaction {
  transaction_id: string;
  sender_account_id: string;
  receiver_account_id: string;
  sender_acc: string;
  receiver_acc: string;
  amount: string;
  transaction_type: string;
  description: string;
  status: string;
  created_at: string;
}

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await adminAPI.getTransactions();
        setTransactions(res.data);
      } catch {
        toast.error('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.sender_acc.includes(search) ||
      t.receiver_acc.includes(search) ||
      (t.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || t.transaction_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const typeIcon = (type: string) => {
    switch (type) {
      case 'TRANSFER': return <ArrowLeftRight size={16} className="text-blue-400" />;
      case 'DEPOSIT': return <ArrowDownCircle size={16} className="text-emerald-400" />;
      case 'WITHDRAWAL': return <ArrowUpCircle size={16} className="text-amber-400" />;
      default: return null;
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">Completed</span>;
      case 'PENDING':
        return <span className="text-xs font-medium text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full">Pending</span>;
      case 'FAILED':
        return <span className="text-xs font-medium text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full">Failed</span>;
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
            <ScrollText size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">All Transactions</h1>
            <p className="text-sm text-slate-400">{transactions.length} total transactions</p>
          </div>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-500 outline-none focus:border-blue-500/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 outline-none focus:border-blue-500/50"
          >
            <option value="ALL">All Types</option>
            <option value="TRANSFER">Transfer</option>
            <option value="DEPOSIT">Deposit</option>
            <option value="WITHDRAWAL">Withdrawal</option>
          </select>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">From</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">To</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.transaction_id} className="border-b border-slate-800/50 table-row-hover transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {typeIcon(t.transaction_type)}
                      <span className="text-sm text-slate-300 capitalize">{t.transaction_type.toLowerCase()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-400">•••{t.sender_acc.slice(-4)}</td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-400">•••{t.receiver_acc.slice(-4)}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-white">
                    ${parseFloat(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4">{statusBadge(t.status)}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 max-w-[200px] truncate">
                    {t.description || '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(t.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-slate-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminTransactions;
