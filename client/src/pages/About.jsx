import { Link } from 'react-router-dom';
import { ArrowRight, Quote, Check, Award, Users, Calendar, BookOpen } from 'lucide-react';

const About = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-navy text-cream overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40 mask-fade-b" aria-hidden />
        <div className="absolute top-20 -right-32 w-[28rem] h-[28rem] bg-gold/20 rounded-full blur-3xl" aria-hidden />
        <div className="relative container-page py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="badge-gold mb-6">About</div>
            <h1 className="h-display text-balance mb-6">
              Built for the trader who wants <span className="italic text-gold">a process</span> — not a prediction.
            </h1>
            <p className="text-cream/75 text-lg md:text-xl leading-relaxed text-pretty max-w-2xl">
              Legacy Wealth Institute is India's premium financial education studio for serious students of the market. We teach institutional logic, risk discipline, and the temperament to compound capital across decades.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section bg-cream">
        <div className="container-page grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="eyebrow mb-3">Our Story</div>
            <h2 className="h-section mb-4">A different kind of trading school.</h2>
            <p className="text-ink/70 leading-relaxed">
              Founded in 2019 after a decade of trading the hard way, Legacy Wealth was built on one belief: retail traders deserve the same structural reading institutions use, taught with the same rigor.
            </p>
          </div>
          <div className="lg:col-span-7 space-y-5 text-ink/80 leading-relaxed">
            <p>
              The Indian retail trader is sold three lies — that markets reward intuition, that screenshots equal track record, and that complexity equals edge. We don't teach any of that.
            </p>
            <p>
              What we teach instead is structural. How smart money positions before announcements. How liquidity is engineered. How to size a trade so a 10-loss streak doesn't end your career. And how to journal your own decisions until your conviction is built on data, not vibes.
            </p>
            <p>
              We've now run 11 cohorts, mentored over 2,400 students across India, and built a curriculum that's been refined every single quarter since launch. We are slow, deliberate, and unapologetically picky about who we admit.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <div className="eyebrow mb-3">What we believe</div>
            <h2 className="h-section text-balance">Five principles. Non-negotiable.</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Value n="01" title="Process beats prediction"
              text="Anyone can be right once. We build students who are right for the right reasons — and accept being wrong gracefully." />
            <Value n="02" title="Risk first, always"
              text="The trader who survives 12 months is rare. We start every framework with: how do you not blow up?" />
            <Value n="03" title="No signals, ever"
              text="We refuse to issue calls. Dependence breeds fragility. Our success is measured by your independence." />
            <Value n="04" title="Honest with risk"
              text="Markets carry real risk. We won't sugarcoat it for marketing copy. If you want hype, this isn't the place." />
            <Value n="05" title="Compound discipline"
              text="The edge isn't in any single trade. It's in 5,000 trades executed with the same boring rigor." />
            <Value n="06" title="Slow and deliberate"
              text="We accept ~80 students per cohort. We could double that. We won't. Quality of mentorship is the product." />
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="section bg-navy-950 text-cream relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial-gold opacity-50" aria-hidden />
        <div className="relative container-page grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] rounded-2xl bg-navy-900 border border-gold/20 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-gold/20 border-2 border-gold/40 flex items-center justify-center mx-auto mb-6 backdrop-blur">
                    <span className="font-display text-6xl text-gold">SS</span>
                  </div>
                  <div className="font-display text-3xl text-cream">Sanjeev Sharma</div>
                  <div className="eyebrow-cream mt-2">Founder &amp; Lead Mentor</div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="eyebrow-cream mb-4">From the Founder</div>
            <Quote className="text-gold mb-6" size={36} />
            <blockquote className="font-display text-2xl md:text-3xl text-cream leading-snug mb-6 text-pretty">
              I started trading in 2012. By 2014 I was down ₹4 lakh, demoralised, and certain I was wrong about markets. Turns out I wasn't wrong about markets — I was wrong about <span className="italic text-gold">myself</span>. The decade since has been about building a process that survives my own bad days.
            </blockquote>
            <p className="text-cream/70 leading-relaxed mb-8 text-pretty">
              That process — refined over 12 years, 5,000+ trades, and four bear markets — is what we now teach. Not because I have all the answers, but because I've made every expensive mistake so my students don't have to.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 text-sm text-cream/70 max-w-md">
              <span className="flex items-center gap-2"><Check className="text-gold shrink-0" size={16} /> 12+ years active trader</span>
              <span className="flex items-center gap-2"><Check className="text-gold shrink-0" size={16} /> 5,000+ documented trades</span>
              <span className="flex items-center gap-2"><Check className="text-gold shrink-0" size={16} /> 2,400+ students mentored</span>
              <span className="flex items-center gap-2"><Check className="text-gold shrink-0" size={16} /> SEBI-aligned curriculum</span>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section bg-cream">
        <div className="container-page">
          <div className="text-center mb-14">
            <div className="eyebrow mb-3">The Journey</div>
            <h2 className="h-section">Seven years. Eleven cohorts. One mission.</h2>
          </div>

          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gold/30 -translate-x-1/2 hidden md:block" />
            <div className="space-y-10">
              <Milestone year="2019" title="Legacy Wealth founded" text="First curriculum drafted after 7 years of personal trade journals and 200+ pages of reflection." icon={<BookOpen />} />
              <Milestone year="2020" title="First cohort delivered" text="32 students. 90 days. The model worked — students were trading independently, not following calls." icon={<Users />} />
              <Milestone year="2022" title="500-student milestone" text="Curriculum doubled in depth. Added forex, long-term investing, and risk modules." icon={<Award />} />
              <Milestone year="2024" title="Featured in financial press" text="Coverage from Moneycontrol, ET Markets, and CNBC TV18 brought a wave of new applicants." icon={<Calendar />} />
              <Milestone year="2026" title="Cohort 12 — now open" text="2,400+ alumni. Refined curriculum. Same picky admissions. Same obsession with quality." icon={<Award />} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy text-cream py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" aria-hidden />
        <div className="relative container-page text-center max-w-3xl">
          <h2 className="font-display text-3xl md:text-5xl mb-5 text-balance">
            Want to know if this is right for you?
          </h2>
          <p className="text-cream/75 mb-10 text-lg text-pretty">
            We talk to every applicant before they enroll. No pressure, no pitch — just an honest conversation.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="btn-gold">Book a discovery call <ArrowRight size={18} /></Link>
            <Link to="/courses" className="btn-outline border-cream/30 !text-cream hover:!bg-cream hover:!text-navy">Browse programs</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const Value = ({ n, title, text }) => (
  <div className="card-premium p-7">
    <span className="font-display text-gold text-sm tracking-widest">{n}</span>
    <h3 className="font-display text-xl text-navy mt-3 mb-2">{title}</h3>
    <p className="text-ink/70 text-sm leading-relaxed">{text}</p>
  </div>
);

const Milestone = ({ year, title, text, icon }) => (
  <div className="md:grid md:grid-cols-2 md:gap-12 relative">
    <div className="md:text-right md:pr-12 mb-2 md:mb-0">
      <div className="font-display text-3xl text-gold">{year}</div>
    </div>
    <div className="absolute left-4 md:left-1/2 top-2 -translate-x-1/2 w-8 h-8 rounded-full bg-navy text-gold flex items-center justify-center border-2 border-cream hidden md:flex">
      {icon}
    </div>
    <div className="md:pl-12 pl-12 relative">
      <div className="absolute left-0 top-2 md:hidden w-8 h-8 rounded-full bg-navy text-gold flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-display text-xl text-navy mb-1">{title}</h3>
      <p className="text-ink/70 text-sm leading-relaxed">{text}</p>
    </div>
  </div>
);

export default About;
