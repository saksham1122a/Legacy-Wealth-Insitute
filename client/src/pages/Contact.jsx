import { useState } from 'react';
import { Mail, Phone, MapPin, Instagram, Send, MessageSquare, Clock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { fadeUp, fadeLeft, fadeRight, stagger } from '../utils/motion';
import api from '../api/axios';

const VP = { once: true, margin: '-80px' };

const Contact = () => {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', interest: 'Mentorship', message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/leads', { ...form, source: 'Contact Page' });
      toast.success("Message received. We'll respond within 24 hours.");
      setForm({ name: '', email: '', phone: '', interest: 'Mentorship', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-navy text-cream overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40 mask-fade-b" aria-hidden />
        <div className="absolute top-20 -right-32 w-96 h-96 bg-gold/20 rounded-full blur-3xl" aria-hidden />
        <div className="relative container-page py-20 md:py-28">
          <motion.div
            className="max-w-3xl"
            variants={fadeLeft} initial="hidden" animate="show"
          >
            <div className="badge-gold mb-6">Get in touch</div>
            <h1 className="h-display text-balance mb-6">
              Talk to us before you <span className="italic text-gold">enroll</span>.
            </h1>
            <p className="text-cream/75 text-lg leading-relaxed text-pretty max-w-2xl">
              We'd rather have a real 30-minute conversation than push you into the wrong program. Send us a note and we'll respond within 24 hours — usually faster.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact grid */}
      <section className="section bg-cream">
        <div className="container-page grid lg:grid-cols-12 gap-10">

          {/* Form */}
          <motion.div
            className="lg:col-span-7"
            variants={fadeLeft} initial="hidden" whileInView="show" viewport={VP}
          >
            <div className="bg-white rounded-2xl border border-navy-100 shadow-sm p-8 md:p-10">
              <div className="mb-8">
                <div className="eyebrow mb-2">Send us a message</div>
                <h2 className="font-display text-3xl text-navy">We read every message personally.</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="Full name" required>
                    <input
                      required
                      type="text"
                      className="input-field"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                  </Field>
                  <Field label="Email" required>
                    <input
                      required
                      type="email"
                      className="input-field"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                  </Field>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="Mobile (10 digits)" required>
                    <input
                      required
                      type="tel"
                      pattern="[6-9][0-9]{9}"
                      maxLength={10}
                      className="input-field"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                    />
                  </Field>
                  <Field label="I'm interested in">
                    <select
                      className="input-field"
                      value={form.interest}
                      onChange={e => setForm({ ...form, interest: e.target.value })}
                    >
                      <option value="Mentorship">90-Day Mentorship</option>
                      <option value="SMC Course">SMC Trading</option>
                      <option value="Investing">Long-term Investing</option>
                      <option value="Forex">Currency / Forex</option>
                      <option value="General">Just exploring</option>
                    </select>
                  </Field>
                </div>

                <Field label="Tell us a bit about your goals">
                  <textarea
                    rows={5}
                    placeholder="Where are you in your trading journey? What are you trying to solve?"
                    className="input-field resize-none"
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                  />
                </Field>

                <motion.button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold w-full sm:w-auto"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {submitting ? 'Sending…' : <>Send message <Send size={16} /></>}
                </motion.button>
                <p className="text-xs text-ink/50">
                  By submitting you agree to receive educational communication. Markets carry risk.
                </p>
              </form>
            </div>
          </motion.div>

          {/* Side info */}
          <motion.aside
            className="lg:col-span-5 space-y-6"
            variants={stagger} initial="hidden" whileInView="show" viewport={VP}
          >
            <motion.div variants={fadeRight}>
              <InfoCard icon={<Mail />} title="Email">
                <a href="mailto:akshat@legacywealth.info" className="text-navy hover:text-gold-dark transition-colors font-medium">
                  akshat@legacywealth.info
                </a>
                <p className="text-sm text-ink/60 mt-1">For applications and inquiries</p>
              </InfoCard>
            </motion.div>

            <motion.div variants={fadeRight}>
              <InfoCard icon={<Phone />} title="Phone">
                <span className="text-navy font-medium">+91 6284364679</span>
                <p className="text-sm text-ink/60 mt-1">Mon–Fri, 10 AM – 7 PM IST</p>
              </InfoCard>
            </motion.div>

            <motion.div variants={fadeRight}>
              <InfoCard icon={<Instagram />} title="DM 'LEGACY' on Instagram">
                <a
                  href="https://instagram.com/legacywealth.institute"
                  target="_blank"
                  rel="noreferrer"
                  className="text-navy hover:text-gold-dark transition-colors font-medium inline-flex items-center gap-1"
                >
                  @legacywealth <ArrowRight size={14} />
                </a>
                <p className="text-sm text-ink/60 mt-1">Fastest path for cohort applications</p>
              </InfoCard>
            </motion.div>

            <motion.div variants={fadeRight}>
              <InfoCard icon={<MapPin />} title="Studio">
                <span className="text-navy font-medium">Ludhiana, Punjab</span>
                <p className="text-sm text-ink/60 mt-1">By appointment only</p>
              </InfoCard>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="bg-navy text-cream rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-radial-gold opacity-30" aria-hidden />
              <div className="relative">
                <Clock className="text-gold mb-3" />
                <h3 className="font-display text-xl text-cream mb-2">Response time</h3>
                <p className="text-cream/75 text-sm leading-relaxed">
                  We respond to every application personally within 24 hours, often within a few. If you don't hear from us, check your spam folder — or DM us directly.
                </p>
              </div>
            </motion.div>
          </motion.aside>
        </div>
      </section>

      {/* FAQ teaser */}
      <section className="bg-white py-16">
        <motion.div
          className="container-page text-center max-w-2xl"
          variants={fadeUp} initial="hidden" whileInView="show" viewport={VP}
        >
          <MessageSquare className="text-gold mx-auto mb-4" />
          <h2 className="font-display text-2xl md:text-3xl text-navy mb-3">Have a quick question first?</h2>
          <p className="text-ink/70 mb-6">Most common questions are answered on the homepage FAQ. Have a look — and reach out if it's not covered.</p>
          <motion.a
            href="/#faq"
            className="btn-outline"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Read the FAQ
          </motion.a>
        </motion.div>
      </section>
    </div>
  );
};

const Field = ({ label, required, children }) => (
  <label className="block">
    <span className="text-xs uppercase tracking-widest text-navy/70 font-medium mb-1.5 block">
      {label}{required && <span className="text-gold ml-1">*</span>}
    </span>
    {children}
  </label>
);

const InfoCard = ({ icon, title, children }) => (
  <div className="bg-white border border-navy-100 rounded-xl p-5 flex items-start gap-4 hover:border-gold/40 transition-colors">
    <div className="w-10 h-10 rounded-lg bg-cream-100 text-gold flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="flex-1">
      <div className="text-xs uppercase tracking-widest text-navy/60 font-medium mb-1">{title}</div>
      {children}
    </div>
  </div>
);

export default Contact;