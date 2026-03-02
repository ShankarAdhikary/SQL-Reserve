import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users,
  Shield,
  Target,
  Globe,
  ArrowRight,
  Lightbulb,
  Scale,
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';

const values = [
  { icon: Shield, title: 'Trust & Security', desc: 'We safeguard your assets using cutting-edge encryption and robust security protocols.' },
  { icon: Lightbulb, title: 'Innovation', desc: 'Continuously evolving our digital platforms to bring you the best banking experience.' },
  { icon: Users, title: 'Customer First', desc: 'Every decision is guided by the goal of exceeding customer expectations.' },
  { icon: Scale, title: 'Transparency', desc: 'Honest, clear communication with no hidden fees or surprise charges.' },
];

const milestones = [
  { year: '2024', event: 'SQL Reserve founded with a vision for secure digital banking.' },
  { year: '2024', event: 'Launched Internet Banking with AES-256 encryption.' },
  { year: '2025', event: 'Reached 10,000+ users and ₹500Cr+ in transactions.' },
  { year: '2025', event: 'Introduced real-time fund transfers & mobile banking.' },
];

const leadership = [
  { name: 'Shankar Adhikary', role: 'Managing Director & CEO', initials: 'SA' },
  { name: 'Sri Sai Darahaas', role: 'Chief Technology Officer', initials: 'SD' },
  { name: 'Saumya Mishra', role: 'Chief Financial Officer', initials: 'SM' },
  { name: 'Harshvandhan Maurya', role: 'Chief Operating Officer', initials: 'HM' },
  { name: 'Shreyashee Gupta', role: 'Head of Customer Relations', initials: 'SG' },
];

const About = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-800/50">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-500/6 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <p className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3">About SQL Reserve</p>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
              Building the Future of <span className="text-gradient">Secure Banking</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              SQL Reserve is a next-generation digital banking platform that combines cutting-edge technology 
              with traditional banking values. We are committed to providing secure, transparent, and 
              innovative financial services to individuals and businesses.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-8"
          >
            <div className="p-3 rounded-xl bg-blue-500/10 w-fit mb-5">
              <Target size={24} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Our Mission</h3>
            <p className="text-slate-400 leading-relaxed">
              To democratize banking by making secure, reliable financial services accessible to everyone 
              through technology. We strive to protect every customer's data with military-grade encryption 
              while providing a seamless user experience.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-8"
          >
            <div className="p-3 rounded-xl bg-purple-500/10 w-fit mb-5">
              <Globe size={24} className="text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Our Vision</h3>
            <p className="text-slate-400 leading-relaxed">
              To become the most trusted digital banking platform, known for uncompromising security, 
              technological innovation, and customer-centric approach. We envision a world where banking 
              is safe, simple, and available to everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-slate-900/40 border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">What Drives Us</p>
            <h2 className="text-3xl font-extrabold text-white">Our Core Values</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <div className="inline-flex p-3 rounded-xl bg-blue-500/10 mb-4">
                  <item.icon size={24} className="text-blue-400" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">{item.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">Our Journey</p>
          <h2 className="text-3xl font-extrabold text-white">Key Milestones</h2>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-0">
          {milestones.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-6 pb-8 last:pb-0"
            >
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {item.year.slice(-2)}
                </div>
                {i < milestones.length - 1 && (
                  <div className="w-px flex-1 bg-slate-800 mt-2" />
                )}
              </div>
              <div className="pb-2">
                <p className="text-xs text-blue-400 font-semibold mb-1">{item.year}</p>
                <p className="text-slate-300">{item.event}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Leadership */}
      <section className="bg-slate-900/40 border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">Our Team</p>
            <h2 className="text-3xl font-extrabold text-white">Leadership</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadership.map((person, i) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 text-lg font-bold text-white">
                  {person.initials}
                </div>
                <h4 className="text-base font-bold text-white mb-1">{person.name}</h4>
                <p className="text-xs text-slate-400">{person.role}</p>
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
          <h2 className="text-3xl font-extrabold text-white mb-4">Join the SQL Reserve Family</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            Open your account today and experience banking built on trust, security, and innovation.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold text-white gradient-primary hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300"
          >
            Open an Account <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
