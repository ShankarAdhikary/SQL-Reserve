import { useEffect, useState } from 'react';
import { bankAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  PlusCircle,
  Wallet,
  ArrowLeftRight,
  TrendingUp,
  CreditCard,
  DollarSign,
  ArrowDownCircle,
  ArrowUpCircle,
  Banknote,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Account {
  account_id: string;
  account_number: string;
  account_type: string;
  balance: string;
  currency: string;
  status: string;
  created_at: string;
}

const Dashboard = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [createType, setCreateType] = useState('SAVINGS');
  const [createBalance, setCreateBalance] = useState('0');
  const [creating, setCreating] = useState(false);
  // Deposit/Withdraw modal
  const [actionModal, setActionModal] = useState<{ type: 'deposit' | 'withdraw'; account: Account } | null>(null);
  const [actionAmount, setActionAmount] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await bankAPI.getAccounts();
      setAccounts(res.data);
    } catch {
      toast.error('Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async () => {
    setCreating(true);
    try {
      await bankAPI.createAccount(createType, parseFloat(createBalance) || 0);
      toast.success('Account created successfully!');
      setShowCreate(false);
      setCreateBalance('0');
      fetchAccounts();
    } catch {
      toast.error('Error creating account');
    } finally {
      setCreating(false);
    }
  };

  const handleAction = async () => {
    if (!actionModal || !actionAmount) return;
    setActionLoading(true);
    try {
      const amt = parseFloat(actionAmount);
      if (amt <= 0) { toast.error('Amount must be positive'); return; }

      if (actionModal.type === 'deposit') {
        await bankAPI.deposit(actionModal.account.account_id, amt);
        toast.success(`$${amt.toLocaleString()} deposited successfully`);
      } else {
        await bankAPI.withdraw(actionModal.account.account_id, amt);
        toast.success(`$${amt.toLocaleString()} withdrawn successfully`);
      }
      setActionModal(null);
      setActionAmount('');
      fetchAccounts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setActionLoading(false);
    }
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + parseFloat(acc.balance), 0);
  const activeCount = accounts.filter(acc => acc.status === 'ACTIVE').length;

  const cardGradients = [
    'from-blue-600 to-indigo-700',
    'from-violet-600 to-purple-700',
    'from-cyan-600 to-blue-700',
    'from-emerald-600 to-teal-700',
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'},{' '}
          <span className="text-gradient">{user?.fullName?.split(' ')[0]}</span>
        </h1>
        <p className="text-slate-400 mt-1">Here's your financial overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 hover-lift"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-blue-500/10">
              <DollarSign size={22} className="text-blue-400" />
            </div>
            <TrendingUp size={18} className="text-emerald-400" />
          </div>
          <p className="text-sm text-slate-400 mb-1">Total Balance</p>
          <p className="text-3xl font-bold text-white">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6 hover-lift"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-purple-500/10">
              <CreditCard size={22} className="text-purple-400" />
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-1">Active Accounts</p>
          <p className="text-3xl font-bold text-white">{activeCount}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6 hover-lift"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-emerald-500/10">
              <Banknote size={22} className="text-emerald-400" />
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-1">Currency</p>
          <p className="text-3xl font-bold text-white">USD</p>
        </motion.div>
      </div>

      {/* Accounts Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-white">Your Accounts</h2>
        <div className="flex gap-3">
          <Link
            to="/transfer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition"
          >
            <ArrowLeftRight size={16} /> Transfer
          </Link>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white gradient-primary hover:shadow-lg hover:shadow-blue-500/25 transition"
          >
            <PlusCircle size={16} /> New Account
          </button>
        </div>
      </div>

      {/* Create Account Panel */}
      {showCreate && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Create New Account</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Account Type</label>
              <select
                value={createType}
                onChange={(e) => setCreateType(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 outline-none focus:border-blue-500/50"
              >
                <option value="SAVINGS">Savings</option>
                <option value="CHECKING">Checking</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Initial Balance ($)</label>
              <input
                type="number"
                value={createBalance}
                onChange={(e) => setCreateBalance(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 outline-none focus:border-blue-500/50"
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={createAccount}
                disabled={creating}
                className="flex-1 py-3 rounded-xl font-semibold text-white gradient-emerald hover:shadow-lg transition disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="py-3 px-4 rounded-xl font-semibold text-slate-400 bg-slate-800/50 hover:bg-slate-700/50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {accounts.map((acc, i) => (
          <motion.div
            key={acc.account_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${cardGradients[i % cardGradients.length]} hover-lift shadow-xl`}
          >
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/20 -translate-y-10 translate-x-10" />
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/10 translate-y-10 -translate-x-10" />
            </div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="p-2.5 bg-white/15 rounded-xl backdrop-blur-sm">
                  <Wallet size={22} className="text-white" />
                </div>
                <div className="flex items-center gap-2">
                  {acc.status !== 'ACTIVE' && (
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm ${
                      acc.status === 'FROZEN' ? 'bg-blue-400/20 text-blue-200' : 'bg-red-400/20 text-red-200'
                    }`}>
                      {acc.status === 'FROZEN' ? '❄ Frozen' : '✕ Closed'}
                    </span>
                  )}
                  <span className="text-xs font-bold bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-white uppercase tracking-wider">
                    {acc.account_type}
                  </span>
                </div>
              </div>

              <p className="text-white/60 text-sm mb-1">Account Number</p>
              <p className="font-mono font-semibold text-white text-lg mb-5 tracking-wider">
                •••• •••• {acc.account_number.slice(-4)}
              </p>

              <p className="text-white/60 text-sm mb-1">Balance</p>
              <p className="text-3xl font-bold text-white">
                ${parseFloat(acc.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>

              {/* Quick Actions */}
              <div className="flex gap-2 mt-5 pt-4 border-t border-white/15">
                {acc.status === 'ACTIVE' ? (
                  <>
                    <button
                      onClick={() => { setActionModal({ type: 'deposit', account: acc }); setActionAmount(''); }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition backdrop-blur-sm"
                    >
                      <ArrowDownCircle size={14} /> Deposit
                    </button>
                    <button
                      onClick={() => { setActionModal({ type: 'withdraw', account: acc }); setActionAmount(''); }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition backdrop-blur-sm"
                    >
                      <ArrowUpCircle size={14} /> Withdraw
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-white/40 italic">Account {acc.status.toLowerCase()} — actions disabled</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {accounts.length === 0 && (
          <div className="col-span-full glass-card rounded-2xl p-16 text-center">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
              <Wallet size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Accounts Yet</h3>
            <p className="text-slate-400 mb-6">Create your first bank account to get started</p>
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white gradient-primary hover:shadow-lg hover:shadow-blue-500/25 transition"
            >
              <PlusCircle size={18} /> Create Account
            </button>
          </div>
        )}
      </div>

      {/* Deposit/Withdraw Modal */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActionModal(null)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative glass-card rounded-2xl p-8 w-full max-w-md shadow-2xl z-10"
          >
            <h3 className="text-xl font-bold text-white mb-1 capitalize">{actionModal.type}</h3>
            <p className="text-sm text-slate-400 mb-6">
              Account •••• {actionModal.account.account_number.slice(-4)} — Balance: $
              {parseFloat(actionModal.account.balance).toLocaleString()}
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={actionAmount}
                onChange={(e) => setActionAmount(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-lg"
                placeholder="0.00"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAction}
                disabled={actionLoading || !actionAmount}
                className={`flex-1 py-3 rounded-xl font-semibold text-white transition disabled:opacity-50 ${
                  actionModal.type === 'deposit' ? 'gradient-emerald' : 'gradient-danger'
                }`}
              >
                {actionLoading ? 'Processing...' : `Confirm ${actionModal.type === 'deposit' ? 'Deposit' : 'Withdrawal'}`}
              </button>
              <button
                onClick={() => setActionModal(null)}
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

export default Dashboard;
