import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, TrendingUp, Award } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

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

  const totalSpent = enrollments
    .filter(e => e.paymentStatus === 'success')
    .reduce((sum, e) => sum + e.amountPaid, 0);

  const avgProgress = enrollments.length
    ? Math.round(enrollments.reduce((s, e) => s + e.progressPercent, 0) / enrollments.length)
    : 0;

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
          <StatCard icon={<BookOpen/>} label="Enrolled Programs" value={enrollments.length}/>
          <StatCard icon={<TrendingUp/>} label="Average Progress" value={`${avgProgress}%`}/>
          <StatCard icon={<Award/>} label="Total Invested" value={`₹${totalSpent.toLocaleString('en-IN')}`}/>
        </div>

        {/* My Courses */}
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
            {enrollments.map(e => (
              <EnrollmentCard key={e._id} enrollment={e}/>
            ))}
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

  return (
    <Link to={`/courses/${course.slug}`} className="card p-6 group">
      <div className="flex justify-between items-start mb-3">
        <span className="badge bg-navy-50 text-navy">{course.category}</span>
        <span className={`badge ${
          enrollment.paymentStatus === 'success'
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {enrollment.paymentStatus}
        </span>
      </div>

      <h3 className="font-display text-xl text-navy mb-3 group-hover:text-gold-dark transition-colors">
        {course.title}
      </h3>

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

      <div className="flex justify-between text-xs text-ink/60 pt-3 border-t border-navy-100">
        <span className="flex items-center gap-1">
          <Calendar size={12}/>
          Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString('en-IN')}
        </span>
        <span>₹{enrollment.amountPaid.toLocaleString('en-IN')}</span>
      </div>
    </Link>
  );
};

export default Dashboard;
