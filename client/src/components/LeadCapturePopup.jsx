import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { X, CheckCircle, Download, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

// ── Config ────────────────────────────────────────────────────────────────────
const POPUP_COOLDOWN_MS  = 24 * 60 * 60 * 1000; // 24 hours
const TIMER_DELAY_MS     = 10_000;               // 10 seconds
const SCROLL_THRESHOLD   = 40;                   // 40% page scroll
const STORAGE_KEY        = 'lw_popup_ts';
const BROCHURE_URL       = 'https://drive.google.com/file/d/1YdmNGU5RIdAIueyszYLN5Yd2SOHcBkMS/view?usp=sharing';

// Pages where popup must NOT appear
const EXCLUDED_PATHS = ['/login', '/signup', '/dashboard'];
const isExcluded = (path) =>
  EXCLUDED_PATHS.includes(path) ||
  path.startsWith('/admin') ||
  path.startsWith('/learn');

// ── Option lists ──────────────────────────────────────────────────────────────
const AGE_OPTIONS               = ['18–24', '25–34', '35–44', '45+'];
const EXPERIENCE_OPTIONS        = ['None', 'Less than 1 year', '1–3 years', '3+ years'];
const CAPITAL_OPTIONS           = ['Under ₹50K', '₹50K – ₹2L', '₹2L – ₹5L', '₹5L – ₹10L', 'Above ₹10L'];
const CONTACT_TIME_OPTIONS      = ['Morning (9–12)', 'Afternoon (12–5)', 'Evening (5–9)', 'Anytime'];

const EMPTY_FORM = {
  firstName: '', lastName: '', email: '', phone: '',
  city: '', age: '', tradingExperience: '',
  plannedCapital: '', preferredContactTime: '', interestedCourse: ''
};

// ── Component ─────────────────────────────────────────────────────────────────
const LeadCapturePopup = () => {
  const { pathname } = useLocation();
  const [visible, setVisible]     = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [courses, setCourses]     = useState([]);
  const [form, setForm]           = useState(EMPTY_FORM);

  // Fetch published courses for the program dropdown
  useEffect(() => {
    api.get('/courses')
      .then(({ data }) => setCourses(data.courses || []))
      .catch(() => {});
  }, []);

  // Trigger logic: timer + scroll
  useEffect(() => {
    if (isExcluded(pathname)) return;

    const lastShown = localStorage.getItem(STORAGE_KEY);
    if (lastShown && Date.now() - Number(lastShown) < POPUP_COOLDOWN_MS) return;

    let fired = false;
    const fire = () => {
      if (fired) return;
      fired = true;
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
      setVisible(true);
    };

    const onScroll = () => {
      const el  = document.documentElement;
      const pct = (window.scrollY / (el.scrollHeight - el.clientHeight)) * 100;
      if (pct >= SCROLL_THRESHOLD) fire();
    };

    const timer = setTimeout(fire, TIMER_DELAY_MS);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, [pathname]);

  const close = useCallback(() => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!visible) return;
    const handler = (e) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [visible, close]);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName.trim()) return toast.error('First name is required');
    if (!form.phone.match(/^[6-9]\d{9}$/)) return toast.error('Enter a valid 10-digit mobile number');
    if (!form.email.includes('@')) return toast.error('Enter a valid email address');

    setSubmitting(true);
    try {
      await api.post('/leads', {
        ...form,
        source: 'Popup',
        sourcePage: pathname,
        interest: 'General'
      });
      setSubmitted(true);
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-overlay-in"
      style={{ background: 'rgba(10,22,40,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div className="bg-navy-900 border border-gold/20 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-gold-glow animate-pop-in">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="relative bg-gradient-navy px-6 pt-6 pb-5 border-b border-gold/15">
          {/* Gold accent line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-gold rounded-t-2xl" />

          <button
            onClick={close}
            aria-label="Close"
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-cream/50 hover:text-cream transition-all"
          >
            <X size={16} />
          </button>

          <div className="text-xs uppercase tracking-[0.3em] text-gold mb-2">Legacy Wealth Institute</div>
          <h2 className="font-display text-2xl md:text-3xl text-cream leading-tight">
            Download Free <span className="italic text-gold">Trading Brochure</span>
          </h2>
          <p className="text-cream/50 text-sm mt-1.5">
            Get our complete program guide + free consultation call with our expert.
          </p>

          {/* Trust signals */}
          <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3">
            {['500+ Students Trained', 'SEBI-Compliant Curriculum', 'Free Callback in 24 hrs'].map(t => (
              <span key={t} className="flex items-center gap-1 text-xs text-gold/70">
                <span className="w-1 h-1 rounded-full bg-gold/50 inline-block" /> {t}
              </span>
            ))}
          </div>
        </div>

        {/* ── Body ───────────────────────────────────────────────────────── */}
        {submitted ? (
          // ── Success state ──────────────────────────────────────────────
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={32} className="text-green-400" />
            </div>
            <h3 className="font-display text-2xl text-cream mb-2">You're All Set!</h3>
            <p className="text-cream/50 text-sm mb-8">
              Our advisor will call you within <strong className="text-cream/80">24 hours</strong>.
              Meanwhile, download your free brochure below.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {BROCHURE_URL ? (
                <a
                  href={BROCHURE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold inline-flex items-center gap-2"
                >
                  <Download size={16} /> Download Brochure
                </a>
              ) : (
                <div className="text-cream/30 text-sm italic">
                  Brochure link will be set up by admin.
                </div>
              )}
              <button onClick={close} className="btn-outline text-cream border-cream/20 hover:border-cream/40">
                Close
              </button>
            </div>

            <p className="text-cream/25 text-xs mt-8 flex items-center justify-center gap-1">
              <Phone size={11} /> Expect a call from our team shortly.
            </p>
          </div>
        ) : (
          // ── Form ──────────────────────────────────────────────────────
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {/* Row 1: Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="popup-label">First Name *</label>
                <input
                  required
                  autoFocus
                  className="popup-field"
                  placeholder="Saksham"
                  value={form.firstName}
                  onChange={set('firstName')}
                />
              </div>
              <div>
                <label className="popup-label">Last Name</label>
                <input
                  className="popup-field"
                  placeholder="Nanda"
                  value={form.lastName}
                  onChange={set('lastName')}
                />
              </div>
            </div>

            {/* Row 2: Phone + Email */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="popup-label">Phone Number *</label>
                <input
                  required
                  type="tel"
                  maxLength={10}
                  className="popup-field"
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={set('phone')}
                />
              </div>
              <div>
                <label className="popup-label">Email Address *</label>
                <input
                  required
                  type="email"
                  className="popup-field"
                  placeholder="saksham@email.com"
                  value={form.email}
                  onChange={set('email')}
                />
              </div>
            </div>

            {/* Row 3: City + Age */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="popup-label">City</label>
                <input
                  className="popup-field"
                  placeholder="Ludhiana"
                  value={form.city}
                  onChange={set('city')}
                />
              </div>
              <div>
                <label className="popup-label">Age Group</label>
                <select className="popup-field" value={form.age} onChange={set('age')}>
                  <option value="">Select age</option>
                  {AGE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>

            {/* Row 4: Experience + Capital */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="popup-label">Trading Experience</label>
                <select className="popup-field" value={form.tradingExperience} onChange={set('tradingExperience')}>
                  <option value="">Select experience</option>
                  {EXPERIENCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="popup-label">Planned Capital</label>
                <select className="popup-field" value={form.plannedCapital} onChange={set('plannedCapital')}>
                  <option value="">Select amount</option>
                  {CAPITAL_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>

            {/* Row 5: Contact Time + Program */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="popup-label">Best Time to Call</label>
                <select className="popup-field" value={form.preferredContactTime} onChange={set('preferredContactTime')}>
                  <option value="">Select time</option>
                  {CONTACT_TIME_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="popup-label">Interested Program</label>
                <select className="popup-field" value={form.interestedCourse} onChange={set('interestedCourse')}>
                  <option value="">Select program</option>
                  <option value="General">Not sure yet</option>
                  {courses.map(c => (
                    <option key={c._id} value={c.title}>{c.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-gold !py-3 text-base font-semibold flex items-center justify-center gap-2 disabled:opacity-60 mt-1"
            >
              {submitting ? (
                <><span className="w-4 h-4 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" /> Submitting…</>
              ) : (
                <><Download size={17} /> Get Free Brochure</>
              )}
            </button>

            <p className="text-center text-cream/25 text-[11px] pb-1">
              🔒 We respect your privacy. No spam, ever. Your details are 100% secure.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default LeadCapturePopup;