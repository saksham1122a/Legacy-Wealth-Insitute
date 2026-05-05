import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, TrendingUp, Shield, Award, ChevronRight,
  LineChart, Target, BookOpen, Sparkles, Quote, Check, Plus, Minus,
  GraduationCap, BarChart3, Compass, Star
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

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

      {/* ───────────────────────────── HERO ───────────────────────────── */}
      <section className="relative bg-gradient-navy text-cream overflow-hidden">
        {/* Layered backgrounds */}
        <div className="absolute inset-0 bg-grid opacity-40 mask-fade-b" aria-hidden />
        <div className="absolute inset-0 opacity-60" aria-hidden>
          <div className="absolute top-20 -left-32 w-[28rem] h-[28rem] bg-gold/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] bg-gold/15 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-navy-500/30 rounded-full blur-3xl" />
        </div>

        <div className="relative container-page py-20 md:py-32">
          <div className="grid lg:grid-cols-12 gap-12 items-center">

            {/* Hero copy */}
            <div className="lg:col-span-7 animate-fade-up">
              <div className="badge-gold mb-6">
                <span className="w-2 h-2 bg-gold rounded-full animate-pulse-soft" />
                Now Enrolling — Cohort 12
              </div>

              <h1 className="h-display text-balance mb-6">
                Trade like the<br />
                <span className="italic text-gold">institutions</span>.<br />
                Not against them.
              </h1>

              <p className="text-cream/75 text-lg md:text-xl max-w-xl leading-relaxed mb-8 text-pretty">
                Stop being someone else's exit liquidity. Master the institutional framework — Smart Money Concepts, real risk management, and the discipline that builds wealth across generations.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Link to="/courses" className="btn-gold">
                  Explore Programs <ArrowRight size={18} />
                </Link>
                <a href="#apply" className="btn-outline border-cream/30 !text-cream hover:!bg-cream hover:!text-navy">
                  Apply for Mentorship
                </a>
              </div>

              {/* Hero stats */}
              <div className="grid grid-cols-3 gap-6 max-w-md border-t border-cream/10 pt-8">
                <Stat number="2,400+" label="Students" />
                <Stat number="90 Days" label="Mentorship" />
                <Stat number="₹50L+" label="AUM Trained" />
              </div>
            </div>

            {/* Lead capture card */}
            <div className="lg:col-span-5 animate-fade-up" style={{ animationDelay: '120ms' }}>
              <div id="apply" className="relative">
                <div className="absolute -inset-1 bg-gradient-gold rounded-3xl opacity-30 blur-lg" aria-hidden />
                <div className="relative bg-cream text-ink rounded-2xl p-8 shadow-2xl border-2 border-gold/30">
                  <div className="text-center mb-6">
                    <div className="eyebrow mb-2">Limited Seats</div>
                    <h3 className="font-display text-2xl text-navy">Apply for the 90-Day Cohort</h3>
                    <p className="text-sm text-ink/70 mt-1">DM "LEGACY" or fill below — we'll respond within 24 hrs.</p>
                  </div>

                  <form onSubmit={handleLeadSubmit} className="space-y-3">
                    <input
                      required
                      type="text"
                      placeholder="Full name"
                      className="input-field"
                      value={lead.name}
                      onChange={e => setLead({ ...lead, name: e.target.value })}
                    />
                    <input
                      required
                      type="email"
                      placeholder="Email"
                      className="input-field"
                      value={lead.email}
                      onChange={e => setLead({ ...lead, email: e.target.value })}
                    />
                    <input
                      required
                      type="tel"
                      placeholder="Mobile (10 digits)"
                      pattern="[6-9][0-9]{9}"
                      maxLength={10}
                      className="input-field"
                      value={lead.phone}
                      onChange={e => setLead({ ...lead, phone: e.target.value })}
                    />
                    <select
                      className="input-field"
                      value={lead.interest}
                      onChange={e => setLead({ ...lead, interest: e.target.value })}
                    >
                      <option value="Mentorship">90-Day Mentorship</option>
                      <option value="SMC Course">SMC Trading</option>
                      <option value="Investing">Long-term Investing</option>
                      <option value="Forex">Currency / Forex</option>
                      <option value="General">Just exploring</option>
                    </select>
                    <button type="submit" disabled={submitting} className="btn-gold w-full !py-3.5">
                      {submitting ? 'Submitting…' : 'Apply Now'}
                    </button>
                    <p className="text-[10px] text-ink/50 text-center">
                      By submitting you agree to receive educational communication. Markets carry risk.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust ticker */}
        <div className="relative border-t border-cream/10 bg-navy-950/50 backdrop-blur">
          <div className="container-page py-6 flex items-center gap-8 overflow-hidden">
            <span className="text-[10px] uppercase tracking-super-wide text-cream/50 whitespace-nowrap shrink-0">As featured in</span>
            <div className="flex gap-12 mask-fade-r overflow-hidden flex-1">
              <div className="flex gap-12 animate-ticker shrink-0">
                {['Moneycontrol', 'ET Markets', 'CNBC TV18', 'Mint', 'Bloomberg Quint', 'YourStory', 'Inc42', 'Forbes India'].map((b, i) => (
                  <span key={i} className="font-display italic text-cream/60 text-lg whitespace-nowrap">{b}</span>
                ))}
              </div>
              <div className="flex gap-12 animate-ticker shrink-0" aria-hidden>
                {['Moneycontrol', 'ET Markets', 'CNBC TV18', 'Mint', 'Bloomberg Quint', 'YourStory', 'Inc42', 'Forbes India'].map((b, i) => (
                  <span key={`d-${i}`} className="font-display italic text-cream/60 text-lg whitespace-nowrap">{b}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── PHILOSOPHY ───────────────────────── */}
      <section className="section bg-cream relative">
        <div className="absolute inset-0 bg-grid-light opacity-50" aria-hidden />
        <div className="relative container-page">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <div className="eyebrow mb-3">Our Philosophy</div>
            <h2 className="h-section mb-5 text-balance">
              Information is free.<br />
              <span className="italic">Conviction</span> isn't.
            </h2>
            <p className="text-ink/70 text-pretty">
              YouTube has the data. ChatGPT has the formulas. Neither will hold your hand at 3pm when the market drops 500 points. We teach the framework, the discipline, and the temperament.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Feature
              icon={<TrendingUp />}
              title="Institutional Logic"
              text="Learn how big players move markets — liquidity sweeps, order blocks, fair value gaps. The framework retail never sees."
            />
            <Feature
              icon={<Shield />}
              title="Risk-First Framework"
              text="Capital preservation comes before profit. Every system we teach starts with one question: how much can you afford to lose?"
            />
            <Feature
              icon={<Award />}
              title="Live Mentorship"
              text="Real charts, real cohorts, real accountability. Weekly live sessions where Sanjeev breaks down current market structure."
            />
          </div>
        </div>
      </section>

      {/* ───────────────────────── METHODOLOGY ───────────────────────── */}
      <section className="section bg-navy-950 text-cream relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial-gold opacity-50" aria-hidden />
        <div className="relative container-page">
          <div className="grid lg:grid-cols-12 gap-12 items-end mb-16">
            <div className="lg:col-span-7">
              <div className="eyebrow-cream mb-3">The Method</div>
              <h2 className="font-display text-4xl md:text-5xl leading-[1.1] text-balance">
                A four-pillar framework. <span className="italic text-gold">Repeatable.</span> Defensible. Yours.
              </h2>
            </div>
            <p className="lg:col-span-5 text-cream/70 text-lg leading-relaxed text-pretty">
              We don't sell signals. We teach a process — one you can run on your own chart, in any market, for the rest of your life.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-gold/10 rounded-2xl overflow-hidden border border-gold/20">
            <Pillar n="01" icon={<Compass />} title="Read structure" text="Identify trend, range, and the precise levels where smart money operates." />
            <Pillar n="02" icon={<Target />} title="Mark the levels" text="Order blocks, fair value gaps, liquidity pools — the map institutions follow." />
            <Pillar n="03" icon={<BarChart3 />} title="Manage the risk" text="Position sizing, asymmetric R:R, capital preservation as the first principle." />
            <Pillar n="04" icon={<LineChart />} title="Execute with discipline" text="Journal every trade. Review weekly. Compound edge across years, not weeks." />
          </div>

          <div className="mt-12 text-center">
            <Link to="/methodology" className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors text-sm tracking-wide font-medium">
              Read the full methodology <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────────────────── FEATURED PROGRAMS ───────────────────────── */}
      <section className="section bg-cream">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div>
              <div className="eyebrow mb-3">Programs</div>
              <h2 className="h-section text-balance">Built for serious students of the market.</h2>
            </div>
            <Link to="/courses" className="btn-ghost">All programs <ArrowRight size={16} /></Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <ProgramCard
              tag="Flagship"
              title="90-Day Mentorship"
              desc="Live cohort. Smart Money Concepts, risk frameworks, weekly accountability calls."
              level="Intermediate → Advanced"
              modules="12 modules"
              hours="60+ hrs"
              icon={<GraduationCap />}
              accent
            />
            <ProgramCard
              tag="Self-paced"
              title="SMC Trading Foundations"
              desc="Order blocks, FVGs, liquidity, and execution playbooks — at your own pace."
              level="Beginner → Intermediate"
              modules="8 modules"
              hours="24 hrs"
              icon={<LineChart />}
            />
            <ProgramCard
              tag="Wealth"
              title="Long-Term Investing"
              desc="Build a multi-decade portfolio. Quality screens, asset allocation, behavioral edge."
              level="All levels"
              modules="10 modules"
              hours="18 hrs"
              icon={<BookOpen />}
            />
          </div>
        </div>
      </section>

      {/* ───────────────────────── FOUNDER ───────────────────────── */}
      <section className="section bg-white relative overflow-hidden">
        <div className="container-page">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] rounded-2xl bg-gradient-navy overflow-hidden shadow-navy-soft">
                <div className="absolute inset-0 bg-noise opacity-[0.04] mix-blend-overlay" aria-hidden />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full bg-gold/20 border-2 border-gold/40 flex items-center justify-center mx-auto mb-6 backdrop-blur">
                      <span className="font-display text-6xl text-gold">SS</span>
                    </div>
                    <div className="font-display text-3xl text-cream">Sanjeev Sharma</div>
                    <div className="eyebrow-cream mt-2">Founder &amp; Lead Mentor</div>
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6 flex justify-between text-cream/70 text-xs uppercase tracking-widest">
                  <span>Mumbai · India</span>
                  <span>Est. 2019</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="eyebrow mb-4">From the Founder</div>
              <Quote className="text-gold mb-6" size={36} />
              <blockquote className="font-display text-2xl md:text-3xl text-navy leading-snug mb-6 text-pretty">
                I lost my first ₹4 lakh trading on tips, retail patterns, and other people's conviction. The next decade I spent building a process that didn't depend on anyone else being right. <span className="italic text-gold-dark">That process is what we teach.</span>
              </blockquote>
              <p className="text-ink/70 leading-relaxed mb-8 text-pretty">
                Legacy Wealth Institute exists because retail traders deserve more than YouTube edits and screenshot lifestyles. We teach the same structural reading institutional desks use — paired with the temperament to actually deploy it.
              </p>
              <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink/70">
                <span className="flex items-center gap-2"><Check className="text-gold" size={16} /> 12 yrs trading</span>
                <span className="flex items-center gap-2"><Check className="text-gold" size={16} /> SEBI-aligned curriculum</span>
                <span className="flex items-center gap-2"><Check className="text-gold" size={16} /> 2,400+ students mentored</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── OUTCOMES BANNER ───────────────────────── */}
      <section className="bg-navy text-cream py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" aria-hidden />
        <div className="relative container-page grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <BigStat number="2,400+" label="Students mentored" />
          <BigStat number="92%" label="Cohort completion" />
          <BigStat number="11" label="Cohorts delivered" />
          <BigStat number="4.9★" label="Avg. rating" />
        </div>
      </section>

      {/* ───────────────────────── TESTIMONIALS ───────────────────────── */}
      <section className="section bg-cream-50">
        <div className="container-page">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <div className="eyebrow mb-3">Voices from the cohort</div>
            <h2 className="h-section text-balance">
              People don't talk about the wins.<br /><span className="italic">They talk about the process.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Testimonial
              quote="I'd been trading for 5 years on YouTube content and breaking even at best. The 90-day cohort was the first time someone actually showed me how to read structure. Six months in, I'm consistently green — and more importantly, I know why."
              name="Rahul M."
              role="Software engineer · Bengaluru"
              rating={5}
            />
            <Testimonial
              quote="What I value isn't the entries — it's the journaling discipline. Sanjeev made me realise my edge wasn't a setup, it was a process. That changed everything."
              name="Priya K."
              role="CA · Mumbai"
              rating={5}
            />
            <Testimonial
              quote="No hype. No screenshots. Just a curriculum that respects your intelligence. This is what financial education should look like in India."
              name="Arjun S."
              role="Founder · Pune"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* ───────────────────────── FAQ ───────────────────────── */}
      <section className="section bg-white">
        <div className="container-page max-w-3xl">
          <div className="text-center mb-12">
            <div className="eyebrow mb-3">Common questions</div>
            <h2 className="h-section text-balance">Honest answers, before you apply.</h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <FaqItem
                key={i}
                q={f.q}
                a={f.a}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── FINAL CTA ───────────────────────── */}
      <section className="relative bg-gradient-navy text-cream py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial-gold opacity-60" aria-hidden />
        <div className="absolute inset-0 bg-grid opacity-30" aria-hidden />
        <div className="relative container-page max-w-4xl text-center">
          <Sparkles className="text-gold mx-auto mb-5" size={36} />
          <h2 className="font-display text-3xl md:text-5xl mb-5 text-balance">
            Ready to stop being <span className="italic text-gold">liquidity</span>?
          </h2>
          <p className="text-cream/75 mb-10 max-w-2xl mx-auto text-lg text-pretty">
            Browse our programs or apply directly for the next cohort. Limited seats per intake. We respond within 24 hours.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/courses" className="btn-gold">View All Programs <ChevronRight size={18} /></Link>
            <a href="#apply" className="btn-outline border-cream/30 !text-cream hover:!bg-cream hover:!text-navy">Apply for Cohort 12</a>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ──────────────────────────── Subcomponents ──────────────────────────── */

const Stat = ({ number, label }) => (
  <div>
    <div className="font-display text-3xl text-gold">{number}</div>
    <div className="text-xs uppercase tracking-widest text-cream/60 mt-1">{label}</div>
  </div>
);

const BigStat = ({ number, label }) => (
  <div>
    <div className="font-display text-4xl md:text-5xl text-gold mb-2">{number}</div>
    <div className="text-xs uppercase tracking-super-wide text-cream/70">{label}</div>
  </div>
);

const Feature = ({ icon, title, text }) => (
  <div className="card-premium p-7">
    <div className="w-12 h-12 bg-navy-50 rounded-lg flex items-center justify-center mb-5 text-gold">
      {icon}
    </div>
    <h3 className="font-display text-xl text-navy mb-2">{title}</h3>
    <p className="text-ink/70 text-sm leading-relaxed">{text}</p>
  </div>
);

const Pillar = ({ n, icon, title, text }) => (
  <div className="bg-navy-950 p-8 hover:bg-navy-900 transition-colors group">
    <div className="flex items-center justify-between mb-6">
      <span className="font-display text-gold text-sm tracking-widest">{n}</span>
      <div className="text-gold/60 group-hover:text-gold transition-colors">{icon}</div>
    </div>
    <h3 className="font-display text-xl text-cream mb-2">{title}</h3>
    <p className="text-cream/60 text-sm leading-relaxed">{text}</p>
  </div>
);

const ProgramCard = ({ tag, title, desc, level, modules, hours, icon, accent }) => (
  <div className={`card-premium p-7 flex flex-col ${accent ? 'ring-1 ring-gold/30' : ''}`}>
    <div className="flex items-center justify-between mb-5">
      <span className={`badge ${accent ? 'bg-gold/15 text-gold-dark' : 'bg-navy-50 text-navy'}`}>{tag}</span>
      <div className="text-gold">{icon}</div>
    </div>
    <h3 className="font-display text-2xl text-navy mb-3">{title}</h3>
    <p className="text-ink/70 text-sm leading-relaxed mb-6 flex-1">{desc}</p>
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/60 border-t border-navy-100 pt-4 mb-5">
      <span>{level}</span>
      <span className="text-navy-200">·</span>
      <span>{modules}</span>
      <span className="text-navy-200">·</span>
      <span>{hours}</span>
    </div>
    <Link to="/courses" className="text-navy font-medium text-sm flex items-center gap-1.5 hover:text-gold-dark transition-colors">
      View program <ArrowRight size={14} />
    </Link>
  </div>
);

const Testimonial = ({ quote, name, role, rating }) => (
  <figure className="card-premium p-7 flex flex-col h-full">
    <div className="flex gap-0.5 mb-4 text-gold">
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} size={16} fill="currentColor" />
      ))}
    </div>
    <blockquote className="text-ink/80 text-sm leading-relaxed mb-6 flex-1">
      "{quote}"
    </blockquote>
    <figcaption className="border-t border-navy-100 pt-4">
      <div className="font-medium text-navy text-sm">{name}</div>
      <div className="text-xs text-ink/55 mt-0.5">{role}</div>
    </figcaption>
  </figure>
);

const FaqItem = ({ q, a, open, onToggle }) => (
  <div className={`border rounded-xl transition-all ${open ? 'border-gold/40 bg-cream-50' : 'border-navy-100 bg-white'}`}>
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
    >
      <span className={`font-medium ${open ? 'text-navy' : 'text-navy/90'}`}>{q}</span>
      <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${open ? 'bg-gold text-navy-900' : 'bg-navy-50 text-navy'}`}>
        {open ? <Minus size={16} /> : <Plus size={16} />}
      </span>
    </button>
    {open && (
      <div className="px-6 pb-5 text-ink/70 text-sm leading-relaxed animate-fade-in">
        {a}
      </div>
    )}
  </div>
);

const FAQS = [
  {
    q: 'Is this a signal service or a course?',
    a: "Neither, fully. It's a structured curriculum plus live mentorship. We don't give buy/sell calls — we teach you a framework you can run on any market, any timeframe, for life."
  },
  {
    q: 'Do I need prior trading experience?',
    a: "Our flagship cohort is built for traders with at least 6 months of screen time who've hit a plateau. Complete beginners should start with the self-paced SMC Foundations course first."
  },
  {
    q: 'How is this different from YouTube content?',
    a: "Sequencing, accountability, and feedback. YouTube gives you ten thousand fragments. We give you one process — and a mentor reviewing your trades weekly."
  },
  {
    q: "What's the time commitment?",
    a: '6–8 hours per week for 90 days: live sessions, recorded modules, journaling, and trade review. The students who treat it like a part-time MBA get the most out of it.'
  },
  {
    q: 'Is there a refund policy?',
    a: "Yes — a 7-day no-questions-asked refund from your enrollment date. After that, we're committed and so are you."
  },
  {
    q: 'Are you SEBI-registered?',
    a: "We provide educational content only — not personalised investment advice. If you need RIA-level advisory, we can refer you to a SEBI-registered partner."
  }
];

export default Home;
