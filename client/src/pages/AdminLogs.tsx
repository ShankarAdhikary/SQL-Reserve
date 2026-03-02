import { useEffect, useState } from 'react';
import { adminAPI } from '../api/client';
import { motion } from 'framer-motion';
import { FileText, Search, Activity, AlertTriangle, CheckCircle, LogIn, LogOut, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

interface LogEntry {
  log_id: number;
  user_id: string;
  username: string;
  action: string;
  details: string;
  ip_address: string;
  timestamp: string;
}

const AdminLogs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await adminAPI.getLogs();
        // Support both paginated and non-paginated response
        const data = res.data.logs || res.data;
        setLogs(Array.isArray(data) ? data : []);
      } catch {
        toast.error('Failed to load system logs');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = logs.filter(
    (l) =>
      (l.username || '').toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      (l.details || '').toLowerCase().includes(search.toLowerCase())
  );

  const actionIcon = (action: string) => {
    if (action.includes('LOGIN_SUCCESS')) return <LogIn size={16} className="text-emerald-400" />;
    if (action.includes('LOGIN_FAILED')) return <AlertTriangle size={16} className="text-red-400" />;
    if (action.includes('REGISTER')) return <UserPlus size={16} className="text-blue-400" />;
    if (action.includes('TRANSFER_COMPLETED')) return <CheckCircle size={16} className="text-emerald-400" />;
    if (action.includes('TRANSFER_FAILED')) return <AlertTriangle size={16} className="text-red-400" />;
    if (action.includes('DEPOSIT')) return <CheckCircle size={16} className="text-cyan-400" />;
    if (action.includes('WITHDRAWAL')) return <LogOut size={16} className="text-amber-400" />;
    if (action.includes('ACCOUNT_CREATED')) return <CheckCircle size={16} className="text-purple-400" />;
    return <Activity size={16} className="text-slate-400" />;
  };

  const actionColor = (action: string) => {
    if (action.includes('FAILED')) return 'text-red-400 bg-red-500/10';
    if (action.includes('SUCCESS') || action.includes('COMPLETED') || action.includes('DEPOSIT') || action.includes('CREATED')) return 'text-emerald-400 bg-emerald-500/10';
    if (action.includes('REGISTER')) return 'text-blue-400 bg-blue-500/10';
    return 'text-slate-400 bg-slate-700/50';
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
            <FileText size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">System Audit Logs</h1>
            <p className="text-sm text-slate-400">Last 100 events</p>
          </div>
        </div>

        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search logs..."
            className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-500 outline-none focus:border-blue-500/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Action</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Details</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">IP Address</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log.log_id} className="border-b border-slate-800/50 table-row-hover transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {actionIcon(log.action)}
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${actionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300 font-medium">
                    {log.username || 'System'}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400 max-w-[300px] truncate">
                    {log.details || '—'}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-500">
                    {log.ip_address || '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                    No logs found
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

export default AdminLogs;
