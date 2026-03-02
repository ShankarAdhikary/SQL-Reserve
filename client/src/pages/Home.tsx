import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Shield,
  Smartphone,
  Globe,
  PiggyBank,
  CreditCard,
  TrendingUp,
  Users,
  Clock,
  Lock,
  Zap,
  ChevronRight,
  ArrowLeftRight,
  Wallet,
  BadgeCheck,
} from 'lucide-react';
import SqlReserveLogo from '../components/SqlReserveLogo';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';

const quickLinks = [
  { icon: Globe, label: 'Internet Banking', desc: 'Access your account online', to: '/login', color: 'blue' },
  { icon: Smartphone, label: 'Mobile Banking', desc: 'Bank on the go', to: '/login', color: 'purple' },
  { icon: ArrowLeftRight, label: 'Fund Transfer', desc: 'Send money instantly', to: '/login', color: 'cyan' },
  { icon: CreditCard, label: 'Open Account', desc: 'Start banking today', to: '/register', color: 'emerald' },
];

const services = [
  {
    icon: PiggyBank,
    title: 'Savings Account',
    desc: 'Grow your savings with competitive interest rates and zero minimum balance requirements.',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    icon: Wallet,
    title: 'Current Account',
    desc: 'Seamless transactions for businesses with unlimited daily withdrawals and deposits.',
    color: 'from-purple-500 to-violet-600',
  },
  {
    icon: ArrowLeftRight,
    title: 'Fund Transfer',
    desc: 'Instant transfers across accounts with real-time notifications and full transparency.',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    icon: Shield,
    title: 'Secure Banking',
    desc: 'AES-256 encryption, bcrypt password hashing, and multi-layer security protocols.',
    color: 'from-emerald-500 to-teal-600',
  },
];

const stats = [
  { value: '10,000+', label: 'Active Users', icon: Users },
  { value: '₹500Cr+', label: 'Transactions', icon: TrendingUp },
  { value: '99.9%', label: 'Uptime', icon: Zap },
  { value: '24/7', label: 'Support', icon: Clock },
];

const whyChoose = [
  { icon: Lock, title: 'Bank-Grade Security', desc: 'Your data is encrypted with military-grade AES-256 encryption.' },
  { icon: Zap, title: 'Instant Transfers', desc: 'Real-time fund transfers with instant confirmation and receipts.' },
  { icon: BadgeCheck, title: 'Trusted & Reliable', desc: 'DICGC insured deposits with RBI compliant banking operations.' },
  { icon: Clock, title: '24/7 Availability', desc: 'Access your accounts anytime, anywhere through our digital platforms.' },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <PublicNavbar />

      {/* ── Hero Section ───────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/6 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-blue-300">Secure Digital Banking Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                Banking Made{' '}
                <span className="text-gradient">Simple,</span>
                <br />
                Secure & Smart
              </h1>

              <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-lg">
                Experience the future of banking with SQL Reserve. Manage your finances, 
                transfer funds instantly, and enjoy bank-grade security — all from one platform.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold text-white gradient-primary hover:shadow-xl hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  Open an Account <ArrowRight size={18} />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold text-slate-300 border border-slate-700 hover:border-slate-600 hover:bg-white/5 transition-all duration-300"
                >
                  Login to Internet Banking
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 mt-10 pt-8 border-t border-slate-800/50">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Shield size={14} className="text-emerald-500" />
                  <span>256-bit SSL</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Lock size={14} className="text-emerald-500" />
                  <span>AES-256 Encrypted</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <BadgeCheck size={14} className="text-emerald-500" />
                  <span>DICGC Insured</span>
                </div>
              </div>
            </motion.div>

            {/* Right - Visual card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Main card */}
                <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 shadow-2xl shadow-blue-500/20 overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/20 -translate-y-12 translate-x-12" />
                    <div className="absolute bottom-0 left-0 w-36 h-36 rounded-full bg-white/15 translate-y-10 -translate-x-10" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-2">
                        <SqlReserveLogo size={24} />
                        <span className="text-white font-bold text-lg">SQL Reserve</span>
                      </div>
                      <span className="text-white/60 text-xs font-medium tracking-wider uppercase">Platinum</span>
                    </div>
                    <div className="mb-8">
                      <p className="text-white/50 text-xs mb-1">Card Number</p>
                      <p className="text-white font-mono text-xl tracking-[0.25em]">•••• •••• •••• 4829</p>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-white/50 text-xs mb-1">Account Holder</p>
                        <p className="text-white font-semibold">NOVA BANK USER</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/50 text-xs mb-1">Balance</p>
                        <p className="text-white font-bold text-2xl">$24,580</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating notification */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -bottom-6 -left-6 glass-card rounded-2xl p-4 shadow-xl max-w-[200px]"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/15">
                      <TrendingUp size={18} className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Monthly Growth</p>
                      <p className="text-sm font-bold text-emerald-400">+12.5%</p>
                    </div>
                  </div>
                </motion.div>

                {/* Floating security badge */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="absolute -top-4 -right-4 glass-card rounded-2xl p-4 shadow-xl"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-blue-500/15">
                      <Shield size={18} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Secured</p>
                      <p className="text-sm font-bold text-blue-400">AES-256</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Quick Links ────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 mb-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={item.to}
                className="group flex flex-col items-center gap-3 p-6 glass-card rounded-2xl hover-lift text-center transition-all duration-300 hover:border-blue-500/20"
              >
                <div className={`p-3 rounded-xl bg-${item.color}-500/10 group-hover:bg-${item.color}-500/20 transition`}>
                  <item.icon size={24} className={`text-${item.color}-400`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-0.5">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────── */}
      <section className="border-y border-slate-800/50 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <stat.icon size={28} className="text-blue-400 mx-auto mb-3" />
                <p className="text-3xl font-extrabold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ───────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">What We Offer</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white">Our Banking Services</h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto">
            Comprehensive banking solutions designed for individuals and businesses alike.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((svc, i) => (
            <motion.div
              key={svc.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group glass-card rounded-2xl p-6 hover-lift transition-all duration-300 hover:border-blue-500/20"
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${svc.color} mb-4 shadow-lg`}>
                <svc.icon size={22} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{svc.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{svc.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-blue-400 text-sm font-semibold hover:text-blue-300 transition"
          >
            View All Services <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Why Choose Us ──────────────────────────── */}
      <section className="bg-slate-900/40 border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">Why SQL Reserve</p>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
                Your Trusted Banking Partner
              </h2>
              <p className="text-slate-400 leading-relaxed mb-8">
                At SQL Reserve, we combine cutting-edge technology with trusted banking practices 
                to deliver a secure, seamless, and superior banking experience.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white gradient-primary hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
              >
                Learn More About Us <ArrowRight size={16} />
              </Link>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-4">
              {whyChoose.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-2xl p-5"
                >
                  <div className="p-2.5 rounded-xl bg-blue-500/10 w-fit mb-3">
                    <item.icon size={20} className="text-blue-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-10 lg:p-16 text-center"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-60 h-60 rounded-full bg-white/20 -translate-y-20 translate-x-20" />
            <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white/15 translate-y-10 -translate-x-10" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
              Ready to Start Banking with Us?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              Open your account in minutes and enjoy secure, hassle-free banking. No minimum balance required.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold bg-white text-indigo-700 hover:bg-blue-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg"
              >
                Open Account Now <ArrowRight size={18} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold text-white border-2 border-white/30 hover:bg-white/10 transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
