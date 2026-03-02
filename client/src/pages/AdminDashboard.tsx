import { useEffect, useState } from 'react';
import { adminAPI } from '../api/client';
import { motion } from 'framer-motion';
import {
  Users,
  Wallet,
  ArrowLeftRight,
  TrendingUp,
  DollarSign,
  Activity,
  CreditCard,
  BarChart3,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Stats {
  total_users: string;
  total_accounts: string;
  active_accounts: string;
  frozen_accounts: string;
  closed_accounts: string;
  total_transactions: string;
  total_transaction_volume: string;
  total_deposits: string;
  total_withdrawals: string;
  total_transfers: string;
  system_balance: string;
}

interface RecentTxn {
  transaction_id: string;
  amount: string;
  transaction_type: string;
  status: string;
  created_at: string;
  sender_acc: string;
  receiver_acc: string;
  description: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentTxns, setRecentTxns] = useState<RecentTxn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminAPI.getStats();
        setStats(res.data.stats);
        setRecentTxns(res.data.recentTransactions);
      } catch {
        toast.error('Failed to load admin stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return <div className="text-red-400 text-center mt-10">Failed to load stats.</div>;
  }

  const statCards = [
    { label: 'Total Users', value: stats.total_users, icon: Users, color: 'blue', link: '/admin/users' },
    { label: 'Total Accounts', value: stats.total_accounts, icon: CreditCard, color: 'purple' },
    { label: 'Active Accounts', value: stats.active_accounts, icon: Activity, color: 'emerald' },
    { label: 'Frozen Accounts', value: stats.frozen_accounts, icon: Wallet, color: 'cyan' },
    { label: 'Total Transactions', value: stats.total_transactions, icon: ArrowLeftRight, color: 'amber', link: '/admin/transactions' },
    { label: 'System Balance', value: `$${parseFloat(stats.system_balance || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: 'emerald' },
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-400',
    purple: 'bg-purple-500/10 text-purple-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    cyan: 'bg-cyan-500/10 text-cyan-400',
    amber: 'bg-amber-500/10 text-amber-400',
  };

  const txnTypeColor = (type: string) => {
    switch (type) {
      case 'DEPOSIT': return 'text-emerald-400 bg-emerald-500/10';
      case 'WITHDRAWAL': return 'text-red-400 bg-red-500/10';
      case 'TRANSFER': return 'text-blue-400 bg-blue-500/10';
      default: return 'text-slate-400 bg-slate-500/10';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl gradient-primary">
          <BarChart3 size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-sm text-slate-400">System overview and statistics</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
          >
            {card.link ? (
              <Link to={card.link} className="block glass-card rounded-2xl p-6 hover-lift transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${colorMap[card.color]}`}>
                    <card.icon size={22} />
                  </div>
                  <TrendingUp size={16} className="text-slate-600" />
                </div>
                <p className="text-sm text-slate-400 mb-1">{card.label}</p>
                <p className="text-2xl font-bold text-white">{card.value}</p>
              </Link>
            ) : (
              <div className="glass-card rounded-2xl p-6 hover-lift">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${colorMap[card.color]}`}>
                    <card.icon size={22} />
                  </div>
                </div>
                <p className="text-sm text-slate-400 mb-1">{card.label}</p>
                <p className="text-2xl font-bold text-white">{card.value}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Transaction Volume Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Transaction Volume</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 text-center">
            <p className="text-sm text-slate-400 mb-1">Total Deposits</p>
            <p className="text-xl font-bold text-emerald-400">{stats.total_deposits}</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 text-center">
            <p className="text-sm text-slate-400 mb-1">Total Withdrawals</p>
            <p className="text-xl font-bold text-red-400">{stats.total_withdrawals}</p>
          </div>
          <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 text-center">
            <p className="text-sm text-slate-400 mb-1">Total Transfers</p>
            <p className="text-xl font-bold text-blue-400">{stats.total_transfers}</p>
          </div>
        </div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
          <Link
            to="/admin/transactions"
            className="text-xs font-medium text-blue-400 hover:text-blue-300 transition"
          >
            View All →
          </Link>
        </div>
        {recentTxns.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-6">No transactions yet.</p>
        ) : (
          <div className="space-y-2">
            {recentTxns.map((txn) => (
              <div
                key={txn.transaction_id}
                className="flex flex-wrap items-center gap-4 p-4 bg-slate-800/30 rounded-xl border border-slate-700/20"
              >
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${txnTypeColor(txn.transaction_type)}`}>
                  {txn.transaction_type}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300 truncate">
                    {txn.sender_acc && txn.receiver_acc
                      ? `${txn.sender_acc} → ${txn.receiver_acc}`
                      : txn.description || 'Transaction'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(txn.created_at).toLocaleString()}
                  </p>
                </div>
                <p className="text-sm font-semibold text-white">
                  ${parseFloat(txn.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
