import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    lines: ['1800-XXX-XXXX (Toll Free)', '+91-11-XXXX-XXXX (Head Office)'],
    color: 'blue',
  },
  {
    icon: Mail,
    title: 'Email',
    lines: ['support@sqlreserve.com', 'grievance@sqlreserve.com'],
    color: 'purple',
  },
  {
    icon: MapPin,
    title: 'Head Office',
    lines: ['SQL Reserve Tower, Financial District', 'New Delhi, India - 110001'],
    color: 'emerald',
  },
  {
    icon: Clock,
    title: 'Working Hours',
    lines: ['Mon - Fri: 9:00 AM - 5:00 PM', 'Sat: 9:00 AM - 1:00 PM'],
    color: 'amber',
  },
];

const faqs = [
  { q: 'How do I open an account?', a: 'Click on "Open Account" in the navigation bar, fill in your details, and your account will be created instantly.' },
  { q: 'Is my data secure?', a: 'Yes. We use AES-256 encryption for sensitive data and bcrypt for password hashing. All connections are SSL encrypted.' },
  { q: 'How do I transfer funds?', a: 'Login to Internet Banking, go to the Transfer section, enter the recipient account number and amount to initiate a transfer.' },
  { q: 'What if I forget my password?', a: 'Please contact our support team via email or phone for password reset assistance.' },
];

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500/10 text-blue-400',
  purple: 'bg-purple-500/10 text-purple-400',
  emerald: 'bg-emerald-500/10 text-emerald-400',
  amber: 'bg-amber-500/10 text-amber-400',
};

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Your message has been sent. We will get back to you soon!');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-800/50">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-blue-500/6 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <p className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3">Get In Touch</p>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
              We're Here to <span className="text-gradient">Help You</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              Have questions or need assistance? Our support team is ready to help you 
              with any banking queries, grievances, or general inquiries.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {contactInfo.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className={`p-3 rounded-xl ${colorMap[item.color]} w-fit mb-4`}>
                <item.icon size={22} />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
              {item.lines.map((line, j) => (
                <p key={j} className="text-sm text-slate-400">{line}</p>
              ))}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Form + FAQs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="glass-card rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-blue-500/10">
                  <MessageSquare size={20} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Send us a Message</h3>
                  <p className="text-xs text-slate-400">We'll respond within 24 hours</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="How can we help?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                    placeholder="Describe your query..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-semibold text-white gradient-primary hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Send size={16} /> Send Message
                </button>
              </form>
            </div>
          </motion.div>

          {/* FAQs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-purple-500/10">
                <HelpCircle size={20} className="text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Frequently Asked Questions</h3>
                <p className="text-xs text-slate-400">Quick answers to common queries</p>
              </div>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="glass-card rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left"
                  >
                    <span className="text-sm font-medium text-slate-200">{faq.q}</span>
                    <span className={`text-slate-500 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}>
                      ▾
                    </span>
                  </button>
                  {openFaq === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="px-6 pb-4"
                    >
                      <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
