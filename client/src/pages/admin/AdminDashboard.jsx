import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Inbox, IndianRupee, BadgeCheck, ArrowRight } from 'lucide-react';
import api from '../../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(({ data }) => setStats(data.stats))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-navy">Loading…</div>;

  return (
    <div className="bg-cream min-h-screen">
      <section className="bg-navy-900 text-cream py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs uppercase tracking-[0.3em] text-gold mb-2">Admin</div>
          <h1 className="font-display text-3xl md:text-4xl">Control Centre</h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Quick stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard icon={<Users/>} label="Users" value={stats?.users || 0} link="/admin/users"/>
          <StatCard icon={<BookOpen/>} label="Courses" value={stats?.courses || 0} link="/admin/courses"/>
          <StatCard icon={<Inbox/>} label="Leads" value={stats?.leads || 0} sub={`${stats?.newLeads || 0} new`} link="/admin/leads"/>
          <StatCard icon={<IndianRupee/>} label="Revenue" value={`₹${(stats?.revenue || 0).toLocaleString('en-IN')}`}/>
        </div>

        {/* Quick actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <ActionCard title="Manage Courses" desc="Add, edit, publish programs" to="/admin/courses"/>
          <ActionCard title="Manage Users" desc="View and control user accounts" to="/admin/users"/>
          <ActionCard title="View Leads" desc="Track funnel and conversions" to="/admin/leads"/>
        </div>

        {/* Recent enrollments */}
        <div className="card p-6">
          <h2 className="font-display text-xl text-navy mb-4 flex items-center gap-2">
            <BadgeCheck className="text-gold"/> Recent Enrollments
          </h2>

          {stats?.recentEnrollments?.length === 0 ? (
            <p className="text-ink/60 text-sm">No enrollments yet.</p>
          ) : (
            <div className="space-y-3">
              {stats?.recentEnrollments?.map(e => (
                <div key={e._id} className="flex items-center justify-between py-3 border-b border-navy-100 last:border-0">
                  <div>
                    <div className="font-medium text-navy">{e.user?.name || 'Unknown'}</div>
                    <div className="text-xs text-ink/60">{e.user?.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-navy">{e.course?.title}</div>
                    <div className="text-xs text-gold-dark">₹{e.amountPaid.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, sub, link }) => {
  const content = (
    <div className="card p-5 h-full">
      <div className="flex items-start justify-between mb-2">
        <div className="w-10 h-10 bg-navy text-gold rounded-lg flex items-center justify-center">{icon}</div>
        {link && <ArrowRight className="text-ink/30" size={16}/>}
      </div>
      <div className="text-xs uppercase tracking-widest text-ink/60 mt-3">{label}</div>
      <div className="font-display text-2xl text-navy">{value}</div>
      {sub && <div className="text-xs text-gold-dark mt-1">{sub}</div>}
    </div>
  );
  return link ? <Link to={link} className="block hover:scale-[1.02] transition-transform">{content}</Link> : content;
};

const ActionCard = ({ title, desc, to }) => (
  <Link to={to} className="card p-6 group">
    <h3 className="font-display text-lg text-navy mb-1 group-hover:text-gold-dark transition-colors">{title}</h3>
    <p className="text-sm text-ink/60 mb-3">{desc}</p>
    <span className="text-sm font-medium text-gold-dark">Open →</span>
  </Link>
);

export default AdminDashboard;
