import { Link } from 'react-router-dom';
import { Instagram, Youtube, Linkedin, Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp, stagger } from '../utils/motion';
import LogoMark from './LogoMark';

const VP = { once: true, margin: '-60px' };

const Footer = () => (
  <footer className="bg-navy-950 text-cream/80 relative overflow-hidden">
    {/* Top gold rule */}
    <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

    {/* Subtle background grid */}
    <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" aria-hidden />

    {/* Newsletter strip */}
    <div className="relative border-b border-cream/8">
      <div className="container-page py-12 grid lg:grid-cols-2 gap-8 items-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={VP}>
          <div className="eyebrow-cream mb-2">The Weekly Edge</div>
          <h3 className="font-display text-2xl md:text-3xl text-cream mb-2">
            Market structure, every Sunday.
          </h3>
          <p className="text-cream/55 text-sm max-w-md">
            One email a week — what moved, why it moved, and what to watch. No noise, no signals.
          </p>
        </motion.div>
        <motion.form
          variants={fadeUp} initial="hidden" whileInView="show" viewport={VP}
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row gap-3 lg:justify-end"
        >
          <input
            type="email"
            placeholder="you@example.com"
            required
            className="flex-1 lg:max-w-sm px-4 py-3 rounded-md bg-navy-900/60 border border-cream/12 text-cream placeholder:text-cream/35 focus:outline-none focus:border-gold/60 focus:bg-navy-900 transition-all"
          />
          <button type="submit" className="btn-gold !py-3 !px-5 whitespace-nowrap">
            Subscribe <ArrowUpRight size={16} />
          </button>
        </motion.form>
      </div>
    </div>

    {/* Main grid */}
    <motion.div
      className="relative container-page py-14"
      variants={stagger} initial="hidden" whileInView="show" viewport={VP}
    >
      <div className="grid md:grid-cols-12 gap-10">

        {/* Brand */}
        <motion.div variants={fadeUp} className="md:col-span-5">
          <div className="flex items-center gap-3 mb-5">
            <LogoMark className="w-12 h-10" />
            <div>
              <div className="font-display text-cream text-lg leading-none">Legacy Wealth Institute</div>
              <div className="text-gold text-[10px] tracking-super-wide uppercase mt-1">Trade with logic. Invest with patience.</div>
            </div>
          </div>
          <p className="text-sm leading-relaxed max-w-md mb-6 text-cream/60">
            Premium financial education focused on Smart Money Concepts, institutional trading logic, and long-term wealth building for serious Indian investors.
          </p>
          <div className="space-y-2.5 text-sm text-cream/60">
            <div className="flex items-center gap-2"><MapPin size={14} className="text-gold flex-shrink-0" /> Ludhiana, India</div>
            <div className="flex items-center gap-2"><Mail size={14} className="text-gold flex-shrink-0" /> akshat@legacywealth.info</div>
            <div className="flex items-center gap-2"><Phone size={14} className="text-gold flex-shrink-0" /> +91 6284364679</div>
          </div>
        </motion.div>

        {/* Programs */}
        <motion.div variants={fadeUp} className="md:col-span-2">
          <h4 className="font-display text-gold mb-4 text-xs uppercase tracking-super-wide">Programs</h4>
          <ul className="space-y-2.5 text-sm text-cream/65">
            <li><Link to="/courses" className="hover:text-gold transition-colors">All Programs</Link></li>
            <li><Link to="/courses" className="hover:text-gold transition-colors">90-Day Mentorship</Link></li>
            <li><Link to="/courses" className="hover:text-gold transition-colors">SMC Foundations</Link></li>
            <li><Link to="/courses" className="hover:text-gold transition-colors">Investing</Link></li>
            <li><Link to="/courses" className="hover:text-gold transition-colors">Forex</Link></li>
          </ul>
        </motion.div>

        {/* Company */}
        <motion.div variants={fadeUp} className="md:col-span-2">
          <h4 className="font-display text-gold mb-4 text-xs uppercase tracking-super-wide">Company</h4>
          <ul className="space-y-2.5 text-sm text-cream/65">
            <li><Link to="/about" className="hover:text-gold transition-colors">About</Link></li>
            <li><Link to="/methodology" className="hover:text-gold transition-colors">Methodology</Link></li>
            <li><Link to="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
            <li><Link to="/login" className="hover:text-gold transition-colors">Student Login</Link></li>
          </ul>
        </motion.div>

        {/* Connect */}
        <motion.div variants={fadeUp} className="md:col-span-3">
          <h4 className="font-display text-gold mb-4 text-xs uppercase tracking-super-wide">Connect</h4>
          <div className="flex gap-2 mb-5">
            <SocialIcon href="https://instagram.com/legacywealth.institute" icon={<Instagram size={17} />} label="Instagram" />
            <SocialIcon href="#" icon={<Youtube size={17} />} label="YouTube" />
            <SocialIcon href="#" icon={<Linkedin size={17} />} label="LinkedIn" />
            <SocialIcon href="mailto:akshat@legacywealth.info" icon={<Mail size={17} />} label="Email" />
          </div>
          <p className="text-xs text-cream/55 leading-relaxed">
            DM <span className="text-gold font-bold">"LEGACY"</span> on Instagram to apply for the next cohort.
          </p>
        </motion.div>
      </div>
    </motion.div>

    {/* Disclaimer + bottom bar */}
    <div className="relative border-t border-cream/8">
      <div className="container-page py-6 text-xs text-cream/45">
        <p className="mb-3 leading-relaxed max-w-4xl">
          <strong className="text-cream/70">Risk Disclosure:</strong> Investments and trading involve substantial risk of loss. This platform provides educational content only and is not investment advice. Past performance is not indicative of future results. Please consult a SEBI-registered investment advisor before making any financial decisions.
        </p>
        <div className="flex flex-col md:flex-row gap-2 md:gap-6 md:items-center justify-between mt-4 pt-4 border-t border-cream/5">
          <p className="text-cream/40">© {new Date().getFullYear()} Legacy Wealth Institute. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-gold transition-colors">Privacy</a>
            <a href="#" className="hover:text-gold transition-colors">Terms</a>
            <a href="#" className="hover:text-gold transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

const SocialIcon = ({ href, icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    aria-label={label}
    className="w-9 h-9 rounded-md border border-cream/12 bg-navy-900/40 flex items-center justify-center text-cream/65 hover:text-navy-900 hover:bg-gold hover:border-gold transition-all duration-200"
  >
    {icon}
  </a>
);

export default Footer;