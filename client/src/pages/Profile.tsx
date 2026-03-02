import { useEffect, useState } from 'react';
import { authAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  UserCircle,
  Mail,
  Phone,
  CreditCard,
  Shield,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  Pencil,
  Save,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showNationalId, setShowNationalId] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ fullName: '', email: '', phone: '' });
  const [saving, setSaving] = useState(false);
  // Password change
  const [showPwdChange, setShowPwdChange] = useState(false);
  const [pwdData, setPwdData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changingPwd, setChangingPwd] = useState(false);
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const { user } = useAuth();

  const fetchProfile = async () => {
    try {
      const res = await authAPI.getProfile();
      setProfile(res.data);
      setEditData({
        fullName: res.data.fullName,
        email: res.data.email,
        phone: res.data.phoneDecrypted,
      });
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates: any = {};
      if (editData.fullName !== profile.fullName) updates.fullName = editData.fullName;
      if (editData.email !== profile.email) updates.email = editData.email;
      if (editData.phone !== profile.phoneDecrypted) updates.phone = editData.phone;

      if (Object.keys(updates).length === 0) {
        toast('No changes to save');
        setEditing(false);
        return;
      }

      await authAPI.updateProfile(updates);
      toast.success('Profile updated successfully');
      setEditing(false);
      await fetchProfile();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (pwdData.newPassword !== pwdData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (pwdData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (!/[A-Z]/.test(pwdData.newPassword)) {
      toast.error('Password must contain an uppercase letter');
      return;
    }
    if (!/[0-9]/.test(pwdData.newPassword)) {
      toast.error('Password must contain a number');
      return;
    }
    setChangingPwd(true);
    try {
      await authAPI.changePassword(pwdData.currentPassword, pwdData.newPassword);
      toast.success('Password changed successfully');
      setShowPwdChange(false);
      setPwdData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPwd(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return <div className="text-red-400 text-center mt-10">Failed to load profile.</div>;
  }

  const infoItems = [
    { icon: UserCircle, label: 'Full Name', value: profile.fullName, color: 'blue' },
    { icon: UserCircle, label: 'Username', value: `@${profile.username}`, color: 'purple' },
    { icon: Mail, label: 'Email', value: profile.email, color: 'cyan' },
    { icon: Phone, label: 'Phone', value: profile.phoneDecrypted, color: 'emerald' },
    {
      icon: CreditCard,
      label: 'National ID',
      value: showNationalId ? profile.nationalIdDecrypted : '•••• •••• ••••',
      color: 'amber',
      toggle: true,
    },
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-400',
    purple: 'bg-purple-500/10 text-purple-400',
    cyan: 'bg-cyan-500/10 text-cyan-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    amber: 'bg-amber-500/10 text-amber-400',
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-8 text-center"
      >
        <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-white shadow-lg shadow-blue-500/25">
          {profile.fullName?.charAt(0)}
        </div>
        <h2 className="text-2xl font-bold text-white">{profile.fullName}</h2>
        <p className="text-slate-400">@{profile.username}</p>
        {user?.role === 'ADMIN' && (
          <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
            <Shield size={12} /> Administrator
          </span>
        )}
      </motion.div>

      {/* Profile Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <KeyRound size={20} className="text-blue-400" /> Personal Information
          </h3>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 text-xs font-medium text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 hover:bg-blue-500/20 transition"
            >
              <Pencil size={12} /> Edit
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditing(false);
                  setEditData({ fullName: profile.fullName, email: profile.email, phone: profile.phoneDecrypted });
                }}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-700/50 px-3 py-1.5 rounded-lg hover:bg-slate-700 transition"
              >
                <X size={12} /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition disabled:opacity-50"
              >
                <Save size={12} /> {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>

        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
              <input
                type="text"
                value={editData.fullName}
                onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
              <input
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Phone Number</label>
              <input
                type="text"
                value={editData.phone}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
            <p className="text-xs text-slate-500">Username and National ID cannot be changed.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {infoItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl border border-slate-700/30"
              >
                <div className={`p-2.5 rounded-xl ${colorMap[item.color]}`}>
                  <item.icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">{item.label}</p>
                  <p className="text-slate-200 font-medium truncate">{item.value}</p>
                </div>
                {item.toggle && (
                  <button
                    onClick={() => setShowNationalId(!showNationalId)}
                    className="p-2 text-slate-500 hover:text-slate-300 transition"
                  >
                    {showNationalId ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Security & Password Change */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Lock size={20} className="text-emerald-400" /> Account Security
          </h3>
          <button
            onClick={() => setShowPwdChange(!showPwdChange)}
            className="flex items-center gap-1.5 text-xs font-medium text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 hover:bg-amber-500/20 transition"
          >
            <KeyRound size={12} /> {showPwdChange ? 'Cancel' : 'Change Password'}
          </button>
        </div>

        {showPwdChange ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPwd ? 'text' : 'password'}
                  value={pwdData.currentPassword}
                  onChange={(e) => setPwdData({ ...pwdData, currentPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all pr-12"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showCurrentPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">New Password</label>
              <div className="relative">
                <input
                  type={showNewPwd ? 'text' : 'password'}
                  value={pwdData.newPassword}
                  onChange={(e) => setPwdData({ ...pwdData, newPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all pr-12"
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPwd(!showNewPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showNewPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Confirm New Password</label>
              <input
                type="password"
                value={pwdData.confirmPassword}
                onChange={(e) => setPwdData({ ...pwdData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="Re-enter new password"
              />
            </div>
            <button
              onClick={handlePasswordChange}
              disabled={changingPwd || !pwdData.currentPassword || !pwdData.newPassword || !pwdData.confirmPassword}
              className="w-full py-3 rounded-xl font-semibold text-white gradient-primary hover:shadow-lg hover:shadow-blue-500/25 transition disabled:opacity-50"
            >
              {changingPwd ? 'Changing...' : 'Update Password'}
            </button>
          </div>
        ) : (
          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <Shield size={16} className="text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-emerald-400 font-medium mb-1">Your data is protected</p>
                <p className="text-xs text-slate-400">
                  All sensitive personal information is encrypted with bank-grade security protocols 
                  and stored securely. Your password is hashed and cannot be viewed by anyone, including bank staff.
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;
