import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, TrendingUp, Shield, Award, ChevronRight,
  LineChart, Target, BookOpen, Sparkles, Quote, Check, Plus,
  GraduationCap, BarChart3, Compass, Star, Play, Users,
  Trophy, CheckCircle, MapPin, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { fadeUp, fadeLeft, fadeRight, fadeIn, stagger, scaleIn } from '../utils/motion';

const VP = { once: true, margin: '-80px' };

const MEDIA_MENTIONS = ['Moneycontrol', 'ET Markets', 'CNBC TV18', 'Mint', 'Bloomberg Quint', 'YourStory', 'Inc42', 'Forbes India'];

const PROGRAMS = [
  {
    tag: 'Flagship', title: '90-Day Mentorship',
    desc: 'Live cohort. Smart Money Concepts, institutional risk frameworks, and weekly 1-on-1 accountability calls with Sanjeev.',
    level: 'Intermediate → Advanced', modules: '12 modules', hours: '60+ hrs',
    price: '25,000', originalPrice: '35,000',
    icon: <GraduationCap size={20} />, accent: true
  },
  {
    tag: 'Self-paced', title: 'SMC Trading Foundations',
    desc: 'Order blocks, FVGs, liquidity sweeps, and execution playbooks — structured for self-directed learners.',
    level: 'Beginner → Intermediate', modules: '8 modules', hours: '24 hrs',
    price: '8,000',
    icon: <LineChart size={20} />
  },
  {
    tag: 'Wealth', title: 'Long-Term Investing',
    desc: 'Build a multi-decade portfolio using quality screens, asset allocation models, and behavioral edge.',
    level: 'All levels', modules: '10 modules', hours: '18 hrs',
    price: '6,000',
    icon: <BookOpen size={20} />
  }
];

const STUDENT_WINS = [
  {
    initials: 'SN', name: 'Saksham N.', role: 'Software Engineer', city: 'Bengaluru',
    before: '5 years of trading on YouTube setups. Consistently breaking even or losing small amounts every quarter.',
    after: 'Positive for 6 straight months. Understands WHY each trade works — not just where to enter.',
    cohort: 'Cohort 9'
  },
  {
    initials: 'PK', name: 'Priya K.', role: 'Chartered Accountant', city: 'Mumbai',
    before: 'Emotional trading with no journaling. 3–4 impulsive trades per day, most driven by FOMO.',
    after: '5–6 high-conviction setups per week. Portfolio drawdown reduced by over 60%.',
    cohort: 'Cohort 10'
  },
  {
    initials: 'AS', name: 'Arjun S.', role: 'Startup Founder', city: 'Pune',
    before: 'Lost ₹1.2L following social media calls. No personal framework, no process, no edge.',
    after: 'Built a rule-based system. First profitable quarter in 18 months of active trading.',
    cohort: 'Cohort 11'
  }
];

const TESTIMONIALS = [
  {
    quote: "I'd been trading for 5 years on YouTube content and breaking even at best. The 90-day cohort was the first time someone showed me how to actually read structure. Six months later, I'm consistently green — and I know why.",
    name: 'Saksham N.', role: 'Software engineer · Bengaluru', rating: 5, initials: 'SN'
  },
  {
    quote: "What I value isn't the entries — it's the journaling discipline. Sanjeev made me realise my edge wasn't a setup, it was a process. That single shift changed everything about how I trade.",
    name: 'Priya K.', role: 'CA · Mumbai', rating: 5, initials: 'PK'
  },
  {
    quote: "No hype. No screenshots. Just a curriculum that respects your intelligence. This is what financial education should look like in India.",
    name: 'Arjun S.', role: 'Founder · Pune', rating: 5, initials: 'AS'
  }
];

const FAQS = [
  { q: 'Is this a signal service or a course?', a: "Neither, fully. It's a structured curriculum plus live mentorship. We don't give buy/sell calls — we teach you a framework you can run on any market, any timeframe, for life." },
  { q: 'Do I need prior trading experience?', a: "Our flagship cohort is built for traders with at least 6 months of screen time who've hit a plateau. Complete beginners should start with the self-paced SMC Foundations course first." },
  { q: 'How is this different from YouTube content?', a: "Sequencing, accountability, and feedback. YouTube gives you ten thousand fragments. We give you one process — and a mentor reviewing your trades weekly." },
  { q: "What's the time commitment?", a: '6–8 hours per week for 90 days: live sessions, recorded modules, journaling, and trade review. Students who treat it like a part-time MBA get the most out of it.' },
  { q: 'Is there a refund policy?', a: "Yes — a 7-day no-questions-asked refund from your enrollment date. After that, we're committed and so are you." },
  { q: 'Are you SEBI-registered?', a: "We provide educational content only — not personalised investment advice. If you need RIA-level advisory, we can refer you to a SEBI-registered partner." }
];

const Home = () => {
  const [lead, setLead] = useState({ name: '', email: '', phone: '', interest: 'Mentorship' });
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/leads', { ...lead, source: 'Website', message: 'Submitted from homepage CTA' });
      toast.success("Got it! We'll reach out within 24 hours.");
      setLead({ name: '', email: '', phone: '', interest: 'Mentorship' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="overflow-hidden">

      {/* ─────────────────────────────── HERO ─────────────────────────────── */}
      <section className="relative bg-navy-950 text-cream overflow-hidden">
        {/* Layered background */}
        <div className="absolute inset-0 bg-gradient-navy" aria-hidden />
        <div className="absolute inset-0 bg-grid opacity-25 mask-fade-b" aria-hidden />

        {/* Glow system */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {/* Central top glow */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[56rem] h-[32rem] bg-gold/8 rounded-full blur-[100px]" />
          {/* Left floating orb */}
          <div className="absolute top-24 -left-40 w-[32rem] h-[32rem] bg-gold/18 rounded-full blur-3xl animate-float" />
          {/* Right ambient */}
          <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-navy-500/20 rounded-full blur-3xl" />
          {/* Mid accent */}
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gold/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        </div>

        <div className="relative container-page py-16 md:py-24 lg:py-28">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">

            {/* ── Left: Copy ── */}
            <motion.div className="lg:col-span-7" initial="hidden" animate="show" variants={stagger}>

              {/* Enrollment badge */}
              <motion.div variants={fadeUp}>
                <div className="inline-flex items-center gap-2.5 rounded-full border border-gold/30 bg-gold/6 px-4 py-2 mb-8 backdrop-blur-sm">
                  <span className="w-2 h-2 bg-gold rounded-full animate-pulse-soft flex-shrink-0" />
                  <span className="text-gold text-[11px] font-semibold tracking-[0.18em] uppercase">Now Enrolling — Cohort 12 · Limited Seats</span>
                </div>
              </motion.div>

              <motion.h1 variants={fadeUp} className="h-display text-balance mb-6">
                Trade like the<br />
                <span className="italic text-gold">institutions</span>.<br />
                Not against them.
              </motion.h1>

              <motion.p variants={fadeUp} className="text-cream/70 text-lg md:text-xl max-w-xl leading-relaxed mb-10 text-pretty">
                Stop being someone else's exit liquidity. Master the institutional framework — Smart Money Concepts, real risk management, and the discipline that builds wealth across generations.
              </motion.p>

              {/* Three-way CTA */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-12">
                <Link to="/courses" className="btn-gold">
                  Explore Programs <ArrowRight size={16} />
                </Link>
                <a href="#apply" className="btn-outline border-cream/25 !text-cream hover:!bg-cream hover:!text-navy-900">
                  Apply for Mentorship
                </a>
                <a href="#masterclass" className="inline-flex items-center gap-2.5 px-4 py-3 rounded-lg text-cream/65 hover:text-gold text-sm font-medium transition-colors">
                  <span className="w-7 h-7 rounded-full border border-cream/20 bg-cream/5 flex items-center justify-center flex-shrink-0">
                    <Play size={10} fill="currentColor" />
                  </span>
                  Free Masterclass
                </a>
              </motion.div>

              {/* Stats strip */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-8">
                {[
                  { number: '2,400+', label: 'Students Trained' },
                  { number: '90 Days', label: 'Flagship Cohort' },
                  { number: '4.9 ★', label: 'Avg. Rating' },
                ].map(s => (
                  <div key={s.label} className="border-l-2 border-gold/30 pl-4">
                    <div className="font-display text-2xl text-gold leading-none">{s.number}</div>
                    <div className="text-[10px] uppercase tracking-widest text-cream/45 mt-1">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* ── Right: Lead card ── */}
            <motion.div
              className="lg:col-span-5"
              initial={{ opacity: 0, y: 36, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
            >
              <div id="apply" className="relative">
                {/* Premium glow border */}
                <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-gold/60 via-gold/20 to-gold/50 opacity-50 blur-sm" aria-hidden />
                <div className="absolute -inset-4 bg-gold/10 rounded-3xl blur-2xl opacity-40" aria-hidden />

                <div className="relative bg-cream text-ink rounded-2xl p-8 shadow-2xl">
                  {/* Card header */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1.5 mb-4">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">Seats Available · Cohort 12</span>
                    </div>
                    <h3 className="font-display text-2xl text-navy">Apply for the 90-Day Cohort</h3>
                    <p className="text-sm text-ink/55 mt-1.5">Fill below — our team responds within 24 hrs.</p>
                  </div>

                  <form onSubmit={handleLeadSubmit} className="space-y-3">
                    <input required type="text" placeholder="Full name" className="input-field"
                      value={lead.name} onChange={e => setLead({ ...lead, name: e.target.value })} />
                    <input required type="email" placeholder="Email address" className="input-field"
                      value={lead.email} onChange={e => setLead({ ...lead, email: e.target.value })} />
                    <input required type="tel" placeholder="Mobile number (10 digits)" pattern="[6-9][0-9]{9}" maxLength={10} className="input-field"
                      value={lead.phone} onChange={e => setLead({ ...lead, phone: e.target.value })} />
                    <select className="input-field" value={lead.interest} onChange={e => setLead({ ...lead, interest: e.target.value })}>
                      <option value="Mentorship">90-Day Mentorship</option>
                      <option value="SMC Course">SMC Trading Foundations</option>
                      <option value="Investing">Long-term Investing</option>
                      <option value="Forex">Currency / Forex</option>
                      <option value="General">Just exploring</option>
                    </select>
                    <motion.button
                      type="submit"
                      disabled={submitting}
                      className="btn-gold w-full !py-3.5 text-base"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {submitting ? 'Submitting…' : 'Apply Now — Free'}
                    </motion.button>
                  </form>

                  {/* Micro trust signals */}
                  <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-navy-100">
                    {['SEBI-compliant', 'No spam ever', '24 hr response'].map(t => (
                      <span key={t} className="flex items-center gap-1 text-[10px] text-ink/45">
                        <CheckCircle size={9} className="text-green-500 flex-shrink-0" /> {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Media ticker */}
        <div className="relative border-t border-white/8 bg-navy-950/60 backdrop-blur-sm">
          <div className="container-page py-5 flex items-center gap-6 overflow-hidden">
            <span className="text-[10px] uppercase tracking-super-wide text-cream/35 whitespace-nowrap shrink-0">As featured in</span>
            <div className="flex gap-10 mask-fade-r overflow-hidden flex-1">
              <div className="flex gap-10 animate-ticker shrink-0">
                {MEDIA_MENTIONS.map((m, i) => (
                  <span key={i} className="font-display italic text-cream/45 text-base whitespace-nowrap hover:text-gold/60 transition-colors cursor-default">{m}</span>
                ))}
              </div>
              <div className="flex gap-10 animate-ticker shrink-0" aria-hidden>
                {MEDIA_MENTIONS.map((m, i) => (
                  <span key={`d-${i}`} className="font-display italic text-cream/45 text-base whitespace-nowrap">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────── PHILOSOPHY ─────────────────────────── */}
      <section className="section bg-cream relative">
        <div className="absolute inset-0 bg-grid-light opacity-50" aria-hidden />
        <div className="relative container-page">
          <motion.div
            className="text-center mb-16 max-w-2xl mx-auto"
            variants={fadeUp} initial="hidden" whileInView="show" viewport={VP}
          >
            <div className="eyebrow mb-3">Our Philosophy</div>
            <h2 className="h-section mb-5 text-balance">
              Information is free.<br /><span className="italic">Conviction</span> isn't.
            </h2>
            <p className="text-ink/65 text-pretty leading-relaxed">
              YouTube has the data. ChatGPT has the formulas. Neither will hold your hand at 3pm when the market drops 500 points. We teach the framework, the discipline, and the temperament.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={stagger} initial="hidden" whileInView="show" viewport={VP}
          >
            {[
              { icon: <TrendingUp />, title: 'Institutional Logic', text: 'Learn how big players move markets — liquidity sweeps, order blocks, fair value gaps. The framework retail never sees.' },
              { icon: <Shield />,     title: 'Risk-First Framework', text: 'Capital preservation comes before profit. Every system we teach starts with one question: how much can you afford to lose?' },
              { icon: <Award />,      title: 'Live Mentorship',      text: 'Real charts, real cohorts, real accountability. Weekly live sessions where Sanjeev breaks down current market structure.' }
            ].map(f => (
              <motion.div key={f.title} variants={fadeUp}>
                <Feature icon={f.icon} title={f.title} text={f.text} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────── METHODOLOGY ─────────────────────────── */}
      <section className="section bg-navy-950 text-cream relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial-gold opacity-50" aria-hidden />
        <div className="relative container-page">
          <div className="grid lg:grid-cols-12 gap-12 items-end mb-16">
            <motion.div
              className="lg:col-span-7"
              variants={fadeLeft} initial="hidden" whileInView="show" viewport={VP}
            >
              <div className="eyebrow-cream mb-3">The Method</div>
              <h2 className="font-display text-4xl md:text-5xl leading-[1.1] text-balance">
                A four-pillar framework. <span className="italic text-gold">Repeatable.</span> Defensible. Yours.
              </h2>
            </motion.div>
            <motion.p
              className="lg:col-span-5 text-cream/70 text-lg leading-relaxed text-pretty"
              variants={fadeRight} initial="hidden" whileInView="show" viewport={VP}
            >
              We don't sell signals. We teach a process — one you can run on your own chart, in any market, for the rest of your life.
            </motion.p>
          </div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-gold/10 rounded-2xl overflow-hidden border border-gold/20"
            variants={stagger} initial="hidden" whileInView="show" viewport={VP}
          >
            {[
              { n: '01', icon: <Compass />,   title: 'Read structure',        text: 'Identify trend, range, and the precise levels where smart money operates.' },
              { n: '02', icon: <Target />,     title: 'Mark the levels',       text: 'Order blocks, fair value gaps, liquidity pools — the map institutions follow.' },
              { n: '03', icon: <BarChart3 />,  title: 'Manage the risk',       text: 'Position sizing, asymmetric R:R, capital preservation as the first principle.' },
              { n: '04', icon: <LineChart />,  title: 'Execute with discipline',text: 'Journal every trade. Review weekly. Compound edge across years, not weeks.' }
            ].map(p => (
              <motion.div key={p.n} variants={fadeUp}>
                <Pillar n={p.n} icon={p.icon} title={p.title} text={p.text} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-12 text-center"
            variants={fadeIn} initial="hidden" whileInView="show" viewport={VP}
          >
            <Link to="/methodology" className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors text-sm tracking-wide font-medium">
              Read the full methodology <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────── PROGRAMS ─────────────────────────── */}
      <section className="section bg-cream relative">
        <div className="absolute inset-0 bg-grid-light opacity-40" aria-hidden />
        <div className="relative container-page">
          <motion.div
            className="flex flex-wrap items-end justify-between gap-6 mb-12"
            variants={fadeUp} initial="hidden" whileInView="show" viewport={VP}
          >
            <div>
              <div className="eyebrow mb-3">Programs</div>
              <h2 className="h-section text-balance">Built for serious students of the market.</h2>
            </div>
            <Link to="/courses" className="btn-ghost">All programs <ArrowRight size={16} /></Link>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={stagger} initial="hidden" whileInView="show" viewport={VP}
          >
            {PROGRAMS.map(p => (
              <motion.div
                key={p.title}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <ProgramCard {...p} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────── FREE MASTERCLASS ─────────────────────────── */}
      <section id="masterclass" className="bg-navy-900 border-y border-gold/15 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial-gold opacity-40" aria-hidden />
        <div className="absolute inset-0 bg-grid opacity-20" aria-hidden />
        <div className="relative container-page">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            variants={fadeUp} initial="hidden" whileInView="show" viewport={VP}
          >
            <div className="eyebrow-cream mb-4">Free Resource</div>
            <h2 className="font-display text-3xl md:text-4xl text-cream mb-5 text-balance">
              Watch the <span className="italic text-gold">45-Minute Free Masterclass</span>
            </h2>
            <p className="text-cream/60 mb-10 max-w-xl mx-auto leading-relaxed">
              How institutional traders read market structure — no opt-in required. The 45 minutes that reframes everything you think you know about price action.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.a
                href="#apply"
                className="inline-flex items-center gap-4 bg-white/5 border border-gold/30 text-cream rounded-xl px-6 py-4 hover:bg-gold/10 hover:border-gold/50 transition-all w-full sm:w-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-11 h-11 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center flex-shrink-0">
                  <Play size={16} fill="currentColor" className="text-gold ml-0.5" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm text-cream">Watch Free Masterclass</div>
                  <div className="text-gold/60 text-xs mt-0.5">45 min · No sign-up needed</div>
                </div>
              </motion.a>
              <Link to="/courses" className="btn-outline border-cream/20 !text-cream hover:!bg-cream hover:!text-navy-900 w-full sm:w-auto">
                Browse All Programs
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────── STUDENT WINS ─────────────────────────── */}
      <section className="section bg-white relative">
        <div className="absolute inset-0 bg-grid-light opacity-35" aria-hidden />
        <div className="relative container-page">
          <motion.div
            className="text-center mb-14 max-w-2xl mx-auto"
            variants={fadeUp} initial="hidden" whileInView="show" viewport={VP}
          >
            <div className="eyebrow mb-3">Real Results</div>
            <h2 className="h-section text-balance">
              Numbers are vanity.<br /><span className="italic">Process is reality.</span>
            </h2>
            <p className="text-ink/60 mt-4 text-pretty">What students actually change isn't their returns — it's their relationship with risk, discipline, and the market.</p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={stagger} initial="hidden" whileInView="show" viewport={VP}
          >
            {STUDENT_WINS.map(w => (
              <motion.div key={w.name} variants={fadeUp} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <WinCard {...w} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────── FOUNDER ─────────────────────────── */}
      <section className="section bg-cream relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-light opacity-40" aria-hidden />
        <div className="relative container-page">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <motion.div
              className="lg:col-span-5"
              variants={fadeLeft} initial="hidden" whileInView="show" viewport={VP}
            >
              <div className="relative aspect-[4/5] rounded-2xl bg-gradient-navy overflow-hidden shadow-navy-soft">
                <div className="absolute inset-0 bg-noise opacity-[0.04] mix-blend-overlay" aria-hidden />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full bg-gold/20 border-2 border-gold/40 flex items-center justify-center mx-auto mb-6 backdrop-blur">
                      <span className="font-display text-6xl text-gold">AJ</span>
                    </div>
                    <div className="font-display text-3xl text-cream">Akshat Jain</div>
                    <div className="eyebrow-cream mt-2">Founder &amp; Lead Mentor</div>
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6 flex justify-between text-cream/55 text-xs uppercase tracking-widest">
                  <span className="flex items-center gap-1"><MapPin size={10} /> Ludhiana</span>
                  <span>Est. 2019</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="lg:col-span-7"
              variants={fadeRight} initial="hidden" whileInView="show" viewport={VP}
            >
              <div className="eyebrow mb-4">From the Founder</div>
              <Quote className="text-gold mb-6" size={36} />
              <blockquote className="font-display text-2xl md:text-3xl text-navy leading-snug mb-6 text-pretty">
                I lost my first ₹80 lakh trading on tips, retail patterns, and other people's conviction. The next decade I spent building a process that didn't depend on anyone else being right.{' '}
                <span className="italic text-gold-dark">That process is what we teach.</span>
              </blockquote>
              <p className="text-ink/70 leading-relaxed mb-8 text-pretty">
                Legacy Wealth Institute exists because retail traders deserve more than YouTube edits and screenshot lifestyles. We teach the same structural reading institutional desks use — paired with the temperament to actually deploy it.
              </p>
              <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink/70">
                <span className="flex items-center gap-2"><Check className="text-gold" size={16} /> 12 yrs trading</span>
                <span className="flex items-center gap-2"><Check className="text-gold" size={16} /> SEBI-aligned curriculum</span>
                <span className="flex items-center gap-2"><Check className="text-gold" size={16} /> 2,400+ students mentored</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────── OUTCOMES BANNER ─────────────────────────── */}
      <section className="bg-navy text-cream py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-35" aria-hidden />
        <div className="absolute inset-0 bg-gradient-radial-gold opacity-30" aria-hidden />
        <motion.div
          className="relative container-page grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          variants={stagger} initial="hidden" whileInView="show" viewport={VP}
        >
          {[
            { number: '2,400+', label: 'Students Mentored',   icon: <Users size={22} /> },
            { number: '92%',    label: 'Cohort Completion',   icon: <Trophy size={22} /> },
            { number: '11',     label: 'Cohorts Delivered',   icon: <Award size={22} /> },
            { number: '4.9 ★',  label: 'Average Rating',      icon: <Star size={22} /> }
          ].map(s => (
            <motion.div key={s.label} variants={scaleIn}>
              <BigStat number={s.number} label={s.label} icon={s.icon} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─────────────────────────── TESTIMONIALS ─────────────────────────── */}
      <section className="section bg-cream">
        <div className="container-page">
          <motion.div
            className="text-center mb-14 max-w-2xl mx-auto"
            variants={fadeUp} initial="hidden" whileInView="show" viewport={VP}
          >
            <div className="eyebrow mb-3">Voices from the cohort</div>
            <h2 className="h-section text-balance">
              People don't talk about the wins.<br /><span className="italic">They talk about the process.</span>
            </h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={stagger} initial="hidden" whileInView="show" viewport={VP}
          >
            {TESTIMONIALS.map(t => (
              <motion.div key={t.name} variants={fadeUp} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <Testimonial {...t} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────── FAQ ─────────────────────────── */}
      <section className="section bg-white">
        <div className="container-page max-w-3xl">
          <motion.div
            className="text-center mb-12"
            variants={fadeUp} initial="hidden" whileInView="show" viewport={VP}
          >
            <div className="eyebrow mb-3">Common questions</div>
            <h2 className="h-section text-balance">Honest answers, before you apply.</h2>
          </motion.div>

          <motion.div
            className="space-y-3"
            variants={stagger} initial="hidden" whileInView="show" viewport={VP}
          >
            {FAQS.map((f, i) => (
              <motion.div key={i} variants={fadeUp}>
                <FaqItem
                  q={f.q} a={f.a}
                  open={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────── FINAL CTA ─────────────────────────── */}
      <section className="relative bg-navy-950 text-cream py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-navy opacity-90" aria-hidden />
        <div className="absolute inset-0 bg-gradient-radial-gold opacity-55" aria-hidden />
        <div className="absolute inset-0 bg-grid opacity-20" aria-hidden />
        {/* Top radial glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[48rem] h-[24rem] bg-gold/8 rounded-full blur-3xl pointer-events-none" aria-hidden />

        <motion.div
          className="relative container-page max-w-4xl text-center"
          variants={fadeUp} initial="hidden" whileInView="show" viewport={VP}
        >
          <Sparkles className="text-gold mx-auto mb-5" size={36} />
          <h2 className="font-display text-3xl md:text-5xl mb-5 text-balance leading-[1.08]">
            Ready to stop being <span className="italic text-gold">liquidity</span>?
          </h2>
          <p className="text-cream/65 mb-10 max-w-2xl mx-auto text-lg text-pretty">
            Browse our programs or apply directly for the next cohort. Limited seats per intake. We respond within 24 hours.
          </p>

          {/* Three-way CTA */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/courses" className="btn-gold">
                View All Programs <ChevronRight size={18} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <a href="#apply" className="btn-outline border-cream/25 !text-cream hover:!bg-cream hover:!text-navy-900">
                Apply for Cohort 12
              </a>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <a href="#masterclass" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-gold/30 text-gold hover:bg-gold/10 text-sm font-semibold transition-all">
                <Play size={13} fill="currentColor" /> Watch Masterclass
              </a>
            </motion.div>
          </div>

          {/* Social proof mini-strip */}
          <div className="flex items-center justify-center gap-3 text-cream/30 text-xs">
            <span className="flex -space-x-2">
              {['RM', 'PK', 'AS', 'VJ', 'DT'].map(i => (
                <span key={i} className="w-7 h-7 rounded-full bg-navy-700 border-2 border-navy-800 flex items-center justify-center text-[8px] font-bold text-cream/70">{i}</span>
              ))}
            </span>
            <span>Joined by 2,400+ serious traders from across India</span>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

/* ──────────────────────────── Sub-components ──────────────────────────── */

const Feature = ({ icon, title, text }) => (
  <motion.div
    className="card-premium p-7 h-full group"
    whileHover={{ y: -5, boxShadow: '0 24px 64px -20px rgba(20,37,64,0.2)' }}
    transition={{ duration: 0.22 }}
  >
    <div className="w-12 h-12 bg-gradient-to-br from-gold/15 to-gold/5 rounded-xl flex items-center justify-center mb-5 text-gold group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="font-display text-xl text-navy mb-3">{title}</h3>
    <p className="text-ink/65 text-sm leading-relaxed">{text}</p>
  </motion.div>
);

const Pillar = ({ n, icon, title, text }) => (
  <div className="bg-navy-950 p-8 hover:bg-navy-900 transition-all duration-300 group h-full">
    <div className="flex items-center justify-between mb-6">
      <span className="font-display text-gold/70 text-sm tracking-widest">{n}</span>
      <div className="text-gold/40 group-hover:text-gold transition-colors duration-300">{icon}</div>
    </div>
    <h3 className="font-display text-xl text-cream mb-3">{title}</h3>
    <p className="text-cream/55 text-sm leading-relaxed">{text}</p>
    <div className="mt-6 w-8 h-px bg-gold/25 group-hover:w-16 transition-all duration-500" />
  </div>
);

const ProgramCard = ({ tag, title, desc, level, modules, hours, price, originalPrice, icon, accent }) => (
  <div className={`relative card-premium p-7 flex flex-col h-full transition-all duration-300 ${accent ? 'ring-1 ring-gold/35 hover:ring-gold/60 hover:shadow-gold-glow' : 'hover:shadow-navy-soft'}`}>
    {accent && (
      <div className="absolute -top-3 left-6">
        <span className="bg-gold text-navy-900 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow">
          Most Popular
        </span>
      </div>
    )}

    <div className="flex items-center justify-between mb-5 mt-2">
      <span className={`badge ${accent ? 'bg-gold/15 text-gold-dark' : 'bg-navy-50 text-navy'}`}>{tag}</span>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accent ? 'bg-gold/10 text-gold' : 'bg-navy-50 text-navy'}`}>
        {icon}
      </div>
    </div>

    <h3 className="font-display text-2xl text-navy mb-3">{title}</h3>
    <p className="text-ink/65 text-sm leading-relaxed mb-5 flex-1">{desc}</p>

    {/* Metadata */}
    <div className="flex flex-wrap gap-3 text-[11px] text-ink/50 mb-5">
      <span className="flex items-center gap-1"><Clock size={11} /> {hours}</span>
      <span className="flex items-center gap-1"><BookOpen size={11} /> {modules}</span>
      <span className="flex items-center gap-1"><BarChart3 size={11} /> {level}</span>
    </div>

    <div className="border-t border-navy-100 pt-4 flex items-end justify-between">
      <div>
        {originalPrice && (
          <div className="text-xs text-ink/35 line-through mb-0.5">₹{originalPrice}</div>
        )}
        <div className="font-display text-xl text-navy">₹{price}</div>
      </div>
      <Link
        to="/courses"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-dark hover:text-navy transition-colors"
      >
        View <ArrowRight size={13} />
      </Link>
    </div>
  </div>
);

const WinCard = ({ initials, name, role, city, before, after, cohort }) => (
  <div className="card-premium p-7 h-full flex flex-col">
    {/* Avatar + name */}
    <div className="flex items-center gap-3 mb-6">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold/25 to-gold/8 border border-gold/30 flex items-center justify-center flex-shrink-0">
        <span className="font-display text-gold font-bold text-sm">{initials}</span>
      </div>
      <div>
        <div className="font-semibold text-navy text-sm">{name}</div>
        <div className="text-xs text-ink/50 mt-0.5">{role} · {city}</div>
      </div>
    </div>

    {/* Before / After */}
    <div className="space-y-3 flex-1">
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-50/60 border border-red-100">
        <span className="text-[9px] font-black text-red-400 uppercase tracking-wider mt-0.5 w-10 shrink-0 pt-0.5">Before</span>
        <p className="text-xs text-ink/70 leading-relaxed">{before}</p>
      </div>
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-green-50/70 border border-green-100">
        <span className="text-[9px] font-black text-green-500 uppercase tracking-wider mt-0.5 w-10 shrink-0 pt-0.5">After</span>
        <p className="text-xs text-ink/70 leading-relaxed">{after}</p>
      </div>
    </div>

    <div className="mt-5 pt-4 border-t border-navy-100 flex items-center justify-between">
      <span className="text-[10px] text-ink/35 uppercase tracking-widest">Cohort</span>
      <span className="text-xs font-semibold text-navy">{cohort}</span>
    </div>
  </div>
);

const BigStat = ({ number, label, icon }) => (
  <div>
    <div className="flex justify-center mb-3 text-gold/50">{icon}</div>
    <div className="font-display text-4xl md:text-5xl text-gold mb-2">{number}</div>
    <div className="text-xs uppercase tracking-super-wide text-cream/60">{label}</div>
  </div>
);

const Testimonial = ({ quote, name, role, rating, initials }) => (
  <figure className="card-premium p-7 flex flex-col h-full">
    {/* Header: avatar + name + stars */}
    <div className="flex items-center gap-3 mb-5">
      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-navy/15 to-navy/5 border border-navy-200 flex items-center justify-center flex-shrink-0">
        <span className="font-display text-navy text-sm font-bold">{initials}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-navy text-sm">{name}</div>
        <div className="text-xs text-ink/50 mt-0.5 truncate">{role}</div>
      </div>
      <div className="flex gap-0.5 text-gold flex-shrink-0">
        {Array.from({ length: rating }).map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
      </div>
    </div>

    <blockquote className="text-ink/75 text-sm leading-relaxed flex-1">"{quote}"</blockquote>

    <div className="mt-5 pt-4 border-t border-navy-100">
      <span className="flex items-center gap-1.5 text-[10px] text-ink/35 uppercase tracking-widest">
        <CheckCircle size={10} className="text-green-400" /> Verified Cohort Graduate
      </span>
    </div>
  </figure>
);

const FaqItem = ({ q, a, open, onToggle }) => (
  <div className={`border rounded-xl overflow-hidden transition-colors duration-200 ${open ? 'border-gold/40' : 'border-navy-100'}`}>
    <motion.button
      onClick={onToggle}
      className={`w-full flex items-center justify-between gap-4 px-6 py-5 text-left transition-colors ${open ? 'bg-cream-50' : 'bg-white hover:bg-cream-50/50'}`}
      whileTap={{ scale: 0.995 }}
    >
      <span className={`font-medium text-sm sm:text-base ${open ? 'text-navy' : 'text-navy/85'}`}>{q}</span>
      <motion.span
        animate={{ rotate: open ? 45 : 0 }}
        transition={{ duration: 0.2 }}
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${open ? 'bg-gold text-navy-900' : 'bg-navy-50 text-navy'}`}
      >
        <Plus size={16} />
      </motion.span>
    </motion.button>
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="px-6 pb-5 pt-1 text-ink/70 text-sm leading-relaxed bg-cream-50">
            {a}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default Home;