import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  PiggyBank,
  Wallet,
  ArrowLeftRight,
  Shield,
  Globe,
  Lock,
  BadgeCheck,
  Users,
  FileText,
  ArrowRight,
  CheckCircle2,
  Receipt,
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';

const mainServices = [
  {
    icon: PiggyBank,
    title: 'Savings Account',
    desc: 'Open a savings account with zero minimum balance. Earn competitive interest rates and enjoy free digital banking services.',
    features: ['Zero Minimum Balance', 'Competitive Interest Rates', 'Free Internet Banking', 'Instant Account Opening'],
    color: 'blue',
    gradient: 'from-blue-600 to-indigo-700',
  },
  {
    icon: Wallet,
    title: 'Current Account',
    desc: 'Designed for businesses and professionals who need seamless, unlimited transactions with robust account management tools.',
    features: ['Unlimited Transactions', 'Business Analytics', 'Multi-user Access', 'Overdraft Facility'],
    color: 'purple',
    gradient: 'from-purple-600 to-violet-700',
  },
  {
    icon: ArrowLeftRight,
    title: 'Fund Transfer',
    desc: 'Transfer funds instantly between SQL Reserve accounts with real-time processing and end-to-end encrypted transactions.',
    features: ['Instant Transfers', 'Real-time Notifications', 'Transaction History', 'Encrypted Processing'],
    color: 'cyan',
    gradient: 'from-cyan-600 to-blue-700',
  },
  {
    icon: Globe,
    title: 'Internet Banking',
    desc: 'Full-featured online banking platform with 24/7 access to your accounts, transfers, and financial statements.',
    features: ['24/7 Access', 'Account Dashboard', 'Deposit & Withdraw', 'Transaction Reports'],
    color: 'emerald',
    gradient: 'from-emerald-600 to-teal-700',
  },
];

const digitalFeatures = [
  { icon: Shield, title: 'AES-256 Encryption', desc: 'Sensitive data encrypted before storage.' },
  { icon: Lock, title: 'Bcrypt Passwords', desc: 'Industry-standard password hashing.' },
  { icon: BadgeCheck, title: 'SSL Secured', desc: '256-bit SSL for all connections.' },
  { icon: FileText, title: 'Audit Logs', desc: 'Complete activity trail for compliance.' },
  { icon: Users, title: 'Role-based Access', desc: 'Admin and user-level access control.' },
  { icon: Receipt, title: 'Transaction Receipts', desc: 'Detailed records for every transaction.' },
];

const Services = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-800/50">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-purple-500/6 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <p className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3">Our Services</p>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
              Comprehensive <span className="text-gradient">Banking Solutions</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              From savings accounts to instant fund transfers, SQL Reserve offers a complete suite of 
              digital banking services designed with security and simplicity in mind.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-8">
          {mainServices.map((svc, i) => (
            <motion.div
              key={svc.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-8 lg:p-10"
            >
              <div className="grid lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${svc.gradient} mb-4 shadow-lg`}>
                    <svc.icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{svc.title}</h3>
                  <p className="text-slate-400 leading-relaxed mb-6">{svc.desc}</p>
                  <Link
                    to={svc.title === 'Savings Account' || svc.title === 'Current Account' ? '/register' : '/login'}
                    className={`inline-flex items-center gap-2 text-sm font-semibold text-${svc.color}-400 hover:text-${svc.color}-300 transition`}
                  >
                    {svc.title.includes('Account') ? 'Open Account' : 'Get Started'} <ArrowRight size={16} />
                  </Link>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Key Features</p>
                  <ul className="space-y-2.5">
                    {svc.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                        <CheckCircle2 size={16} className={`text-${svc.color}-400 shrink-0`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Security Features */}
      <section className="bg-slate-900/40 border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2">Security First</p>
            <h2 className="text-3xl font-extrabold text-white">Enterprise-Grade Security</h2>
            <p className="text-slate-400 mt-3 max-w-lg mx-auto">
              Your data and transactions are protected by multiple layers of security.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {digitalFeatures.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-2xl p-6 flex items-start gap-4"
              >
                <div className="p-2.5 rounded-xl bg-emerald-500/10 shrink-0">
                  <item.icon size={20} className="text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-extrabold text-white mb-4">Start Banking Today</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            Open your SQL Reserve account in minutes and enjoy all our banking services.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold text-white gradient-primary hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300"
            >
              Open an Account <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold text-slate-300 border border-slate-700 hover:border-slate-600 hover:bg-white/5 transition-all duration-300"
            >
              Login to Internet Banking
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
