import React, { useState, useEffect } from 'react';
import { bankAPI } from '../api/client';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Account {
  account_id: string;
  account_number: string;
  account_type: string;
  balance: string;
}

const Transfer = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountNumber, setToAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await bankAPI.getAccounts();
        setAccounts(res.data);
        if (res.data.length > 0) setFromAccountId(res.data[0].account_id);
      } catch {
        toast.error('Failed to load accounts');
      }
    };
    load();
  }, []);

  const selectedAccount = accounts.find((a) => a.account_id === fromAccountId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (amt <= 0) { toast.error('Amount must be positive'); return; }
    if (selectedAccount && amt > parseFloat(selectedAccount.balance)) {
      toast.error('Insufficient funds');
      return;
    }

    setLoading(true);
    try {
      await bankAPI.transfer({
        fromAccountId,
        toAccountNumber,
        amount: amt,
        description: description || undefined,
      });
      setSuccess(true);
      toast.success('Transfer completed successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto mt-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-10 text-center"
        >
          <div className="w-20 h-20 rounded-full gradient-emerald flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Transfer Successful!</h2>
          <p className="text-slate-400 mb-2">
            <span className="text-emerald-400 font-semibold text-xl">${parseFloat(amount).toLocaleString()}</span> sent to account{' '}
            <span className="font-mono text-slate-300">•••• {toAccountNumber.slice(-4)}</span>
          </p>
          {description && <p className="text-slate-500 text-sm italic">"{description}"</p>}
          <div className="flex gap-3 mt-8 justify-center">
            <button
              onClick={() => { setSuccess(false); setAmount(''); setToAccountNumber(''); setDescription(''); }}
              className="px-6 py-3 rounded-xl font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition"
            >
              New Transfer
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 rounded-xl font-semibold text-white gradient-primary hover:shadow-lg transition"
            >
              Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const inputClass =
    'w-full px-4 py-3.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all';

  return (
    <div className="max-w-xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl gradient-primary">
            <ArrowLeftRight size={22} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Transfer Funds</h2>
            <p className="text-slate-400 text-sm">Send money securely between accounts</p>
          </div>
        </div>

        {accounts.length === 0 ? (
          <div className="text-center py-10">
            <AlertCircle size={40} className="text-amber-400 mx-auto mb-3" />
            <p className="text-slate-300">You need an account first.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 px-6 py-2 rounded-xl font-semibold text-white gradient-primary transition"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* From Account */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">From Account</label>
              <select
                className={`${inputClass} appearance-none`}
                value={fromAccountId}
                onChange={(e) => setFromAccountId(e.target.value)}
                required
              >
                {accounts.map((acc) => (
                  <option key={acc.account_id} value={acc.account_id}>
                    {acc.account_type} — •••• {acc.account_number.slice(-4)} ($
                    {parseFloat(acc.balance).toLocaleString()})
                  </option>
                ))}
              </select>
              {selectedAccount && (
                <p className="text-xs text-slate-500 mt-1.5">
                  Available: <span className="text-emerald-400 font-medium">${parseFloat(selectedAccount.balance).toLocaleString()}</span>
                </p>
              )}
            </div>

            {/* To Account */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Recipient Account Number</label>
              <input
                type="text"
                placeholder="Enter 10-digit account number"
                className={inputClass}
                value={toAccountNumber}
                onChange={(e) => setToAccountNumber(e.target.value)}
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                className={`${inputClass} text-xl font-semibold`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Description (optional)</label>
              <input
                type="text"
                placeholder="What's this transfer for?"
                className={inputClass}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Summary */}
            {amount && parseFloat(amount) > 0 && (
              <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4">
                <p className="text-sm text-slate-400 mb-1">Transfer Summary</p>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">
                    •••• {selectedAccount?.account_number.slice(-4)}
                  </span>
                  <ArrowLeftRight size={16} className="text-blue-400" />
                  <span className="text-slate-300 font-medium">
                    •••• {toAccountNumber.slice(-4) || '????'}
                  </span>
                </div>
                <p className="text-2xl font-bold text-white text-center mt-2">
                  ${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 ${
                loading
                  ? 'bg-slate-700 cursor-not-allowed'
                  : 'gradient-primary hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.01] active:scale-[0.99]'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={18} /> Confirm Transfer
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Transfer;
