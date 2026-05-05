import { Link } from 'react-router-dom';
import {
  ArrowRight, Compass, Target, BarChart3, LineChart,
  Check, BookOpen, Layers, RefreshCw, ShieldCheck
} from 'lucide-react';

const Methodology = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-navy text-cream overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40 mask-fade-b" aria-hidden />
        <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] bg-gold/20 rounded-full blur-3xl" aria-hidden />
        <div className="relative container-page py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="badge-gold mb-6">The Method</div>
            <h1 className="h-display text-balance mb-6">
              The <span className="italic text-gold">four-pillar</span> framework that runs every Legacy Wealth student.
            </h1>
            <p className="text-cream/75 text-lg md:text-xl leading-relaxed text-pretty max-w-2xl">
              Markets aren't random. But they're not predictable either — they're structural. Our framework teaches you to read that structure, mark the levels, manage the risk, and execute with the kind of repeatable discipline that compounds over decades.
            </p>
          </div>
        </div>
      </section>

      {/* The Four Pillars - detailed */}
      <section className="section bg-cream">
        <div className="container-page space-y-20">
          <Pillar
            n="01"
            title="Read the structure"
            tagline="Trend, range, transition."
            icon={<Compass />}
            text="Before you draw a single level, you need to know what kind of market you're in. We teach a clear hierarchy — from monthly bias down to 5-min execution — so you never trade a range like a trend, or a trend like a range."
            bullets={[
              'Multi-timeframe top-down analysis',
              'Identifying trend, range, and the transition between them',
              'Classifying market regime in under 90 seconds',
              'Recognizing when not to trade — often the most profitable skill'
            ]}
          />

          <Pillar
            n="02"
            title="Mark the levels"
            tagline="Where smart money operates."
            icon={<Target />}
            reverse
            text="Once you know the regime, you mark the actual levels institutions defend. Not arbitrary supply-demand zones from YouTube. Real, repeatable, structural levels — order blocks, fair value gaps, liquidity pools."
            bullets={[
              'Identifying valid order blocks (and rejecting fakes)',
              'Fair value gaps and inefficiency mapping',
              'Liquidity engineering — sweeps, raids, and traps',
              'Multi-timeframe confluence to filter weak setups'
            ]}
          />

          <Pillar
            n="03"
            title="Manage the risk"
            tagline="Capital preservation, first."
            icon={<BarChart3 />}
            text="A great entry with bad sizing is still a losing trader. We teach the risk math first — position sizing, asymmetric R:R, drawdown thresholds, and capital allocation across uncorrelated systems."
            bullets={[
              'Position sizing by account % and ATR-adjusted stops',
              'Asymmetric risk:reward — never less than 1:2',
              'Drawdown rules and circuit breakers for losing streaks',
              'Capital allocation across multiple uncorrelated systems'
            ]}
          />

          <Pillar
            n="04"
            title="Execute with discipline"
            tagline="The edge is in repetition."
            icon={<LineChart />}
            reverse
            text="Mechanical execution. Detailed journaling. Weekly review. The boring 80% that separates a profitable system from a profitable trader. We don't just teach this — we audit your journal in cohort calls."
            bullets={[
              'Pre-trade checklists and entry criteria',
              'Detailed journal templates (we provide ours)',
              'Weekly review rituals — what worked, what didn’t, why',
              'Quarterly system audits to detect drift before it costs you'
            ]}
          />
        </div>
      </section>

      {/* What you walk away with */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <div className="eyebrow mb-3">Outcomes</div>
            <h2 className="h-section text-balance">By the end of the cohort, you'll have:</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {[
              'A documented trading plan you actually follow',
              'A 90-day journal of executed trades with reviews',
              'A risk framework calibrated to your account size',
              'Three repeatable setups you understand structurally',
              'A weekly review ritual you can sustain for years',
              'A peer cohort of accountability partners',
              'A library of recorded modules to revisit forever',
              'Direct access to Sanjeev for one year post-cohort'
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-lg border border-navy-100 bg-cream-50">
                <Check className="text-gold mt-0.5 shrink-0" size={20} />
                <span className="text-ink/85 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum overview */}
      <section className="section bg-navy-950 text-cream relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" aria-hidden />
        <div className="relative container-page">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <div className="eyebrow-cream mb-3">Inside the cohort</div>
            <h2 className="font-display text-3xl md:text-5xl text-cream text-balance">
              90 days. 12 modules. <span className="italic text-gold">One process.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-gold/10 rounded-2xl overflow-hidden border border-gold/20">
            <Phase
              week="Weeks 1–3"
              title="Foundations"
              icon={<BookOpen />}
              modules={['Market structure 101', 'Multi-timeframe reading', 'Risk math from first principles']}
            />
            <Phase
              week="Weeks 4–7"
              title="Frameworks"
              icon={<Layers />}
              modules={['Order blocks & FVGs', 'Liquidity engineering', 'Setup library: 3 core patterns']}
            />
            <Phase
              week="Weeks 8–11"
              title="Execution"
              icon={<RefreshCw />}
              modules={['Live trade reviews', 'Journal audits', 'Behavioral edge & psychology']}
            />
          </div>

          <div className="mt-10 max-w-2xl mx-auto bg-navy-900/50 border border-gold/20 rounded-xl p-6 flex items-start gap-4">
            <ShieldCheck className="text-gold shrink-0 mt-1" />
            <div className="text-sm text-cream/80 leading-relaxed">
              <strong className="text-cream">Week 12 is graduation.</strong> You present your plan, your journal, and your 90-day P&amp;L to the cohort. Sanjeev gives you a written evaluation. That's the moment you stop being a student and start being a trader with a process.
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream py-20 relative">
        <div className="container-page text-center max-w-3xl">
          <h2 className="h-section mb-5 text-balance">
            Want to see if this framework fits how you trade?
          </h2>
          <p className="text-ink/70 mb-10 text-lg text-pretty">
            Apply for the next cohort or browse the program catalog. We respond to every application personally.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="btn-primary">Apply for Cohort 12 <ArrowRight size={18} /></Link>
            <Link to="/courses" className="btn-outline">View all programs</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const Pillar = ({ n, title, tagline, text, bullets, icon, reverse }) => (
  <div className={`grid lg:grid-cols-12 gap-10 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}>
    <div className={`lg:col-span-5 ${reverse ? 'lg:order-2' : ''}`}>
      <div className="relative aspect-square max-w-sm mx-auto">
        <div className="absolute inset-0 bg-gradient-navy rounded-3xl shadow-navy-soft" />
        <div className="absolute inset-0 bg-gradient-radial-gold opacity-50 rounded-3xl" />
        <div className="relative h-full flex flex-col items-center justify-center text-cream p-10">
          <div className="font-display text-7xl text-gold mb-4">{n}</div>
          <div className="w-14 h-14 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-gold">
            {icon}
          </div>
          <div className="eyebrow-cream mt-6">{tagline}</div>
        </div>
      </div>
    </div>
    <div className={`lg:col-span-7 ${reverse ? 'lg:order-1' : ''}`}>
      <h2 className="font-display text-3xl md:text-4xl text-navy mb-4 text-balance">{title}</h2>
      <p className="text-ink/75 leading-relaxed mb-6 text-pretty">{text}</p>
      <ul className="space-y-2.5">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-3 text-ink/80 text-sm">
            <Check className="text-gold mt-0.5 shrink-0" size={18} />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const Phase = ({ week, title, icon, modules }) => (
  <div className="bg-navy-950 p-8 hover:bg-navy-900 transition-colors">
    <div className="flex items-center justify-between mb-5">
      <span className="text-gold text-xs uppercase tracking-super-wide">{week}</span>
      <div className="text-gold/70">{icon}</div>
    </div>
    <h3 className="font-display text-2xl text-cream mb-4">{title}</h3>
    <ul className="space-y-2 text-sm text-cream/70">
      {modules.map((m, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="text-gold/60 mt-0.5">·</span>
          <span>{m}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default Methodology;
