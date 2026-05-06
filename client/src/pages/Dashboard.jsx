import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const statusConfig = {
  active:   { label: 'Active',            cls: 'bg-green-100 text-green-800',  icon: <CheckCircle size={12}/> },
  pending:  { label: 'Pending Approval',  cls: 'bg-yellow-100 text-yellow-800', icon: <Clock size={12}/> },
  rejected: { label: 'Rejected',          cls: 'bg-red-100 text-red-800',      icon: <XCircle size={12}/> }
};

const paymentConfig = {
  paid:    { label: 'Paid',            cls: 'bg-green-100 text-green-800' },
  pending: { label: 'Payment Pending', cls: 'bg-yellow-100 text-yellow-800' },
  failed:  { label: 'Payment Failed',  cls: 'bg-red-100 text-red-800' }
};

const Dashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/enrollments/me')
      .then(({ data }) => setEnrollments(data.enrollments))
      .catch(() => setEnrollments([]))
      .finally(() => setLoading(false));
  }, []);

  const active   = enrollments.filter(e => e.enrollmentStatus === 'active');
  const pending  = enrollments.filter(e => e.enrollmentStatus === 'pending');
  const totalInvested = enrollments
    .filter(e => e.paymentStatus === 'paid')
    .reduce((s, e) => s + e.amountPaid, 0);

  return (
    <div className="bg-cream min-h-screen">
      <section className="bg-navy-900 text-cream py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs uppercase tracking-[0.3em] text-gold mb-2">Your Dashboard</div>
          <h1 className="font-display text-3xl md:text-4xl">
            Welcome back, <span className="italic text-gold">{user?.name?.split(' ')[0]}</span>
          </h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <StatCard icon={<BookOpen/>} label="Active Programs"  value={active.length} />
          <StatCard icon={<Clock/>}    label="Pending Approval" value={pending.length} />
          <StatCard icon={<TrendingUp/>} label="Total Invested" value={`₹${totalInvested.toLocaleString('en-IN')}`} />
        </div>

        {/* Pending notice */}
        {pending.length > 0 && (
          <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={18}/>
            <div>
              <p className="text-sm font-medium text-yellow-800">
                {pending.length} enrollment{pending.length > 1 ? 's' : ''} awaiting admin approval
              </p>
              <p className="text-xs text-yellow-700 mt-0.5">
                Make your offline payment and contact us — we'll activate your access within 24 hours.
              </p>
            </div>
          </div>
        )}

        <h2 className="font-display text-2xl text-navy mb-5">My Programs</h2>

        {loading ? (
          <div className="text-center py-12 text-navy">Loading…</div>
        ) : enrollments.length === 0 ? (
          <div className="card p-10 text-center">
            <BookOpen className="text-gold mx-auto mb-3" size={40}/>
            <h3 className="font-display text-xl text-navy mb-2">No programs yet</h3>
            <p className="text-ink/60 mb-5">Browse our programs and start your learning journey.</p>
            <Link to="/courses" className="btn-gold">Explore Programs</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {enrollments.map(e => <EnrollmentCard key={e._id} enrollment={e}/>)}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className="w-12 h-12 bg-navy text-gold rounded-lg flex items-center justify-center">{icon}</div>
    <div>
      <div className="text-xs uppercase tracking-widest text-ink/60">{label}</div>
      <div className="font-display text-2xl text-navy">{value}</div>
    </div>
  </div>
);

const EnrollmentCard = ({ enrollment }) => {
  const course = enrollment.course;
  if (!course) return null;

  const es = statusConfig[enrollment.enrollmentStatus] || statusConfig.pending;
  const ps = paymentConfig[enrollment.paymentStatus] || paymentConfig.pending;
  const isActive = enrollment.enrollmentStatus === 'active';

  return (
    <div className={`card p-6 ${!isActive ? 'opacity-90' : ''}`}>
      <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
        <span className="badge bg-navy-50 text-navy">{course.category}</span>
        <div className="flex gap-2">
          <span className={`badge flex items-center gap-1 ${es.cls}`}>{es.icon}{es.label}</span>
          <span className={`badge ${ps.cls}`}>{ps.label}</span>
        </div>
      </div>

      <h3 className="font-display text-xl text-navy mb-3">{course.title}</h3>

      {isActive ? (
        <>
          <div className="mb-4">
            <div className="flex justify-between text-xs text-ink/60 mb-1.5">
              <span>Progress</span>
              <span>{enrollment.progressPercent}%</span>
            </div>
            <div className="w-full bg-navy-100 rounded-full h-2">
              <div
                className="bg-gold h-2 rounded-full transition-all duration-500"
                style={{ width: `${enrollment.progressPercent}%` }}
              />
            </div>
          </div>
          <Link to={`/courses/${course.slug}`} className="btn-gold w-full !py-2.5 text-sm">
            Continue Learning →
          </Link>
        </>
      ) : enrollment.enrollmentStatus === 'rejected' ? (
        <div className="text-sm text-red-700 bg-red-50 rounded-lg p-3">
          Your enrollment was not approved. Please contact us for more information.
        </div>
      ) : (
        <div className="text-sm text-yellow-800 bg-yellow-50 rounded-lg p-3">
          Your enrollment is pending admin approval. Please complete your offline payment if not done yet.
        </div>
      )}

      <div className="flex justify-between text-xs text-ink/60 pt-3 mt-3 border-t border-navy-100">
        <span className="flex items-center gap-1">
          <Calendar size={12}/> Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString('en-IN')}
        </span>
        <span>₹{enrollment.amountPaid.toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
};

export default Dashboard;
