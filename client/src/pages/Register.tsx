import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api/client';
import { motion } from 'framer-motion';
import { Eye, EyeOff, UserPlus, Shield, Lock } from 'lucide-react';
import SqlReserveLogo from '../components/SqlReserveLogo';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phone: '',
    nationalId: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.register(formData);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all';

  return (
    <div className="min-h-screen auth-bg flex items-center justify-center p-4 py-10">
      {/* Floating orbs */}
      <div className="absolute top-32 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-500/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4 shadow-lg shadow-blue-500/25"
          >
            <SqlReserveLogo size={32} />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Open an Account</h1>
          <p className="text-slate-400">Join SQL Reserve — Secure Digital Banking</p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <input
                name="fullName"
                type="text"
                className={inputClass}
                placeholder="John Doe"
                onChange={handleChange}
                required
              />
            </div>

            {/* Username + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                <input
                  name="username"
                  type="text"
                  className={inputClass}
                  placeholder="johndoe"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  name="email"
                  type="email"
                  className={inputClass}
                  placeholder="john@email.com"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Phone + National ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
                <input
                  name="phone"
                  type="text"
                  className={inputClass}
                  placeholder="+1234567890"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">National ID</label>
                <input
                  name="nationalId"
                  type="text"
                  className={inputClass}
                  placeholder="ID Number"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`${inputClass} pr-12`}
                  placeholder="Create a strong password"
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Security notice */}
            <div className="flex items-start gap-2 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
              <Shield size={16} className="text-emerald-400 mt-0.5 shrink-0" />
              <p className="text-xs text-emerald-400/80">
                Your personal information is protected with bank-grade encryption and security protocols.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 mt-2 ${
                loading
                  ? 'bg-slate-700 cursor-not-allowed'
                  : 'gradient-primary hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={18} /> Create Account
                </>
              )}
            </button>
          </form>

          <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-slate-700/50">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Shield size={12} className="text-emerald-500" />
              Bank-grade Security
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Lock size={12} className="text-emerald-500" />
              End-to-End Encryption
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition">
            Sign In
          </Link>
        </p>
        <p className="mt-3 text-center text-sm">
          <Link to="/" className="text-slate-600 hover:text-slate-400 font-medium transition">
            &larr; Back to Home
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
