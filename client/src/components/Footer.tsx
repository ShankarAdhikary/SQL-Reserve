import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Shield } from 'lucide-react';
import SqlReserveLogo from './SqlReserveLogo';

const footerLinks = {
  'Quick Links': [
    { label: 'Home', to: '/' },
    { label: 'About Us', to: '/about' },
    { label: 'Services', to: '/services' },
    { label: 'Contact Us', to: '/contact' },
  ],
  'Banking': [
    { label: 'Internet Banking', to: '/login' },
    { label: 'Open Account', to: '/register' },
    { label: 'Savings Account', to: '/services' },
    { label: 'Fund Transfer', to: '/login' },
  ],
  'Important': [
    { label: 'Privacy Policy', to: '#' },
    { label: 'Terms & Conditions', to: '#' },
    { label: 'Grievance Redressal', to: '/contact' },
    { label: 'Security Tips', to: '#' },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800/60">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl gradient-primary">
                <SqlReserveLogo size={22} />
              </div>
              <div>
                <span className="text-lg font-bold text-white tracking-tight">SQL Reserve</span>
                <p className="text-[9px] text-slate-500 uppercase tracking-[0.2em]">Trusted Since 2024</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-sm">
              SQL Reserve is committed to providing secure, reliable, and innovative banking solutions.
              Your trust is our foundation.
            </p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm text-slate-400">
                <Phone size={14} className="text-blue-400 shrink-0" />
                <span>1800-XXX-XXXX (Toll Free)</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-400">
                <Mail size={14} className="text-blue-400 shrink-0" />
                <span>support@sqlreserve.com</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-400">
                <MapPin size={14} className="text-blue-400 shrink-0" />
                <span>SQL Reserve HQ, Financial District</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Security strip */}
      <div className="border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Shield size={12} className="text-emerald-500" />
              256-bit SSL Encryption
            </div>
            <div className="flex items-center gap-1.5">
              <Shield size={12} className="text-emerald-500" />
              AES-256 Data Protection
            </div>
            <div className="flex items-center gap-1.5">
              <Shield size={12} className="text-emerald-500" />
              RBI Compliant
            </div>
            <div className="flex items-center gap-1.5">
              <Shield size={12} className="text-emerald-500" />
              DICGC Insured
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800/60 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} SQL Reserve. All rights reserved.</p>
          <p>
            Disclaimer: This is a demonstration project for educational purposes.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
