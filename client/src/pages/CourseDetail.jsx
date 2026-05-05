import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Check, Clock, Users, BookOpen, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const CourseDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    api.get(`/courses/${slug}`)
      .then(({ data }) => setCourse(data.course))
      .catch(() => toast.error('Course not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please login to enroll');
      navigate('/login', { state: { from: `/courses/${slug}` } });
      return;
    }

    setEnrolling(true);
    try {
      // V1: Direct enrollment without payment.
      // For Razorpay flow, call /api/payment/order first, then verify, then enroll.
      await api.post('/enrollments', {
        courseId: course._id,
        amountPaid: course.discountPrice > 0 ? course.discountPrice : course.price
      });
      toast.success('Enrolled successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-navy">Loading…</div>;
  if (!course) return <div className="min-h-[60vh] flex items-center justify-center text-navy">Course not found</div>;

  const effectivePrice = course.discountPrice > 0 ? course.discountPrice : course.price;
  const savings = course.discountPrice > 0 ? course.price - course.discountPrice : 0;

  return (
    <div className="bg-cream min-h-screen">
      <section className="bg-navy-900 text-cream py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/courses" className="inline-flex items-center gap-1 text-cream/70 hover:text-gold text-sm mb-6">
            <ArrowLeft size={16}/> Back to Programs
          </Link>

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="flex gap-2 mb-4">
                <span className="badge bg-gold/20 text-gold">{course.category}</span>
                <span className="badge bg-cream/10 text-cream/80">{course.level}</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl mb-3">{course.title}</h1>
              {course.tagline && <p className="text-gold italic text-lg mb-6">{course.tagline}</p>}
              <p className="text-cream/80 leading-relaxed mb-6">{course.description}</p>

              <div className="flex flex-wrap gap-6 text-sm">
                <span className="flex items-center gap-2"><Clock size={16}/> {course.durationDays} days</span>
                <span className="flex items-center gap-2"><BookOpen size={16}/> {course.modules?.length || 0} modules</span>
                <span className="flex items-center gap-2"><Users size={16}/> {course.enrollmentCount || 0} enrolled</span>
              </div>
            </div>

            {/* Price card (sticky on desktop) */}
            <div className="lg:col-span-1">
              <div className="bg-cream text-ink rounded-xl p-6 shadow-2xl border-2 border-gold/30 sticky top-24">
                <div className="text-xs uppercase tracking-widest text-gold-dark mb-2">Investment</div>
                {savings > 0 && (
                  <div className="text-sm text-ink/40 line-through mb-1">₹{course.price.toLocaleString('en-IN')}</div>
                )}
                <div className="font-display text-4xl text-navy mb-1">₹{effectivePrice.toLocaleString('en-IN')}</div>
                {savings > 0 && (
                  <div className="text-xs text-green-700 mb-4">Save ₹{savings.toLocaleString('en-IN')}</div>
                )}

                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="btn-gold w-full !py-3.5 mt-3"
                >
                  {enrolling ? 'Processing…' : user ? 'Enroll Now' : 'Login & Enroll'}
                </button>

                <div className="mt-5 pt-5 border-t border-navy-100 text-xs text-ink/60 space-y-1">
                  <p>✓ Lifetime access to materials</p>
                  <p>✓ Live mentor sessions</p>
                  <p>✓ Private community</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      {course.highlights?.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl text-navy mb-8">What's included</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {course.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-lg border border-navy-100">
                <Check className="text-gold mt-0.5 flex-shrink-0" size={20}/>
                <span className="text-ink">{h}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Modules */}
      {course.modules?.length > 0 && (
        <section className="py-16 bg-navy-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl text-navy mb-8">Curriculum</h2>
            <div className="space-y-3">
              {course.modules.map((m, i) => (
                <div key={m._id || i} className="bg-white rounded-lg p-5 border border-navy-100 flex items-center gap-4">
                  <div className="w-10 h-10 bg-navy text-cream rounded-full flex items-center justify-center font-display font-semibold flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg text-navy">{m.title}</h3>
                    {m.description && <p className="text-sm text-ink/60 mt-1">{m.description}</p>}
                  </div>
                  {m.durationMinutes > 0 && (
                    <span className="text-xs text-ink/60 flex items-center gap-1">
                      <Clock size={12}/> {m.durationMinutes} min
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default CourseDetail;
