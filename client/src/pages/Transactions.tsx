import { useEffect, useState } from 'react';
import { bankAPI } from '../api/client';
import { motion } from 'framer-motion';
import {
  ScrollText,
  Search,
  ArrowLeftRight,
  ArrowDownCircle,
  ArrowUpCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Transaction {
  transaction_id: string;
  sender_acc: string;
  receiver_acc: string;
  amount: string;
  transaction_type: string;
  description: string;
  status: string;
  direction: string;
  created_at: string;
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [directionFilter, setDirectionFilter] = useState('ALL');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await bankAPI.getTransactions();
        // Support both paginated and non-paginated response
        const data = res.data.transactions || res.data;
        setTransactions(Array.isArray(data) ? data : []);
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
      t.sender_acc?.includes(search) ||
      t.receiver_acc?.includes(search) ||
      (t.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || t.transaction_type === typeFilter;
    const matchesDirection = directionFilter === 'ALL' || t.direction === directionFilter;
    return matchesSearch && matchesType && matchesDirection;
  });

  const typeIcon = (type: string, direction: string) => {
    if (type === 'TRANSFER') return <ArrowLeftRight size={16} className={direction === 'CREDIT' ? 'text-emerald-400' : 'text-blue-400'} />;
    if (type === 'DEPOSIT') return <ArrowDownCircle size={16} className="text-emerald-400" />;
    if (type === 'WITHDRAWAL') return <ArrowUpCircle size={16} className="text-amber-400" />;
    return null;
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl gradient-primary">
            <ScrollText size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Transaction History</h1>
            <p className="text-sm text-slate-400">{transactions.length} transactions found</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by account or description..."
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
        <select
          value={directionFilter}
          onChange={(e) => setDirectionFilter(e.target.value)}
          className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 outline-none focus:border-blue-500/50"
        >
          <option value="ALL">All</option>
          <option value="CREDIT">Credit (Incoming)</option>
          <option value="DEBIT">Debit (Outgoing)</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <p className="text-xs text-slate-400 mb-1">Total Credited</p>
          <p className="text-xl font-bold text-emerald-400">
            +${filtered
              .filter((t) => t.direction === 'CREDIT')
              .reduce((sum, t) => sum + parseFloat(t.amount), 0)
              .toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <p className="text-xs text-slate-400 mb-1">Total Debited</p>
          <p className="text-xl font-bold text-red-400">
            -${filtered
              .filter((t) => t.direction === 'DEBIT')
              .reduce((sum, t) => sum + parseFloat(t.amount), 0)
              .toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <p className="text-xs text-slate-400 mb-1">Total Transactions</p>
          <p className="text-xl font-bold text-white">{filtered.length}</p>
        </div>
      </div>

      {/* Transaction Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">From</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">To</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.transaction_id} className="border-b border-slate-800/50 table-row-hover transition">
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {new Date(t.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                    <br />
                    <span className="text-xs text-slate-600">
                      {new Date(t.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {typeIcon(t.transaction_type, t.direction)}
                      <span className="text-sm text-slate-300 capitalize">{t.transaction_type.toLowerCase()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-400">
                    {t.sender_acc ? `•••• ${t.sender_acc.slice(-4)}` : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-400">
                    {t.receiver_acc ? `•••• ${t.receiver_acc.slice(-4)}` : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-semibold ${t.direction === 'CREDIT' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {t.direction === 'CREDIT' ? '+' : '-'}${parseFloat(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 max-w-[200px] truncate">{t.description || '—'}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                      {t.status}
                    </span>
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

export default Transactions;
