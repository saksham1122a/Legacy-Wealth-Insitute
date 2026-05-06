import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, IndianRupee, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const STATUS_TABS = ['all', 'pending', 'active', 'rejected'];

const statusBadge = (s) => {
  const map = {
    pending:  'bg-yellow-100 text-yellow-800',
    active:   'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };
  return map[s] || 'bg-gray-100 text-gray-700';
};

const paymentBadge = (s) => {
  const map = {
    paid:    'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed:  'bg-red-100 text-red-800'
  };
  return map[s] || 'bg-gray-100 text-gray-700';
};

const ManageEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/enrollments?status=${tab}&search=${search}`);
      setEnrollments(data.enrollments);
    } catch {
      toast.error('Failed to load enrollments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [tab]);

  const handleSearch = (e) => {
    e.preventDefault();
    load();
  };

  const approve = async (id) => {
    try {
      await api.patch(`/admin/enrollments/${id}/approve`);
      toast.success('Enrollment approved — user now has active access');
      load();
    } catch { toast.error('Failed'); }
  };

  const reject = async (id) => {
    if (!confirm('Reject this enrollment?')) return;
    try {
      await api.patch(`/admin/enrollments/${id}/reject`);
      toast.success('Enrollment rejected');
      load();
    } catch { toast.error('Failed'); }
  };

  const markPaid = async (id) => {
    try {
      await api.patch(`/admin/enrollments/${id}/payment`, { paymentStatus: 'paid' });
      toast.success('Marked as paid');
      load();
    } catch { toast.error('Failed'); }
  };

  const markPending = async (id) => {
    try {
      await api.patch(`/admin/enrollments/${id}/payment`, { paymentStatus: 'pending' });
      toast.success('Marked as payment pending');
      load();
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="bg-cream min-h-screen">
      <section className="bg-navy-900 text-cream py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs uppercase tracking-[0.3em] text-gold mb-1">Admin</div>
          <h1 className="font-display text-3xl">Manage Enrollments</h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {STATUS_TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                  tab === t ? 'bg-navy text-cream' : 'bg-white text-navy border border-navy-200 hover:border-navy'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <form onSubmit={handleSearch} className="flex gap-2 ml-auto">
            <input
              type="text"
              placeholder="Search name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field !py-2 text-sm w-56"
            />
            <button type="submit" className="btn-gold !py-2 !px-3">
              <Search size={16}/>
            </button>
          </form>
        </div>

        {loading ? (
          <div className="text-center py-16 text-navy">Loading…</div>
        ) : enrollments.length === 0 ? (
          <div className="card p-12 text-center text-ink/60">No enrollments found.</div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-navy-50 text-navy">
                <tr>
                  <th className="text-left p-4">User</th>
                  <th className="text-left p-4 hidden md:table-cell">Program</th>
                  <th className="text-center p-4">Payment</th>
                  <th className="text-center p-4">Status</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map(e => (
                  <tr key={e._id} className="border-t border-navy-100 hover:bg-cream/40">
                    <td className="p-4">
                      <div className="font-medium text-navy">{e.user?.name}</div>
                      <div className="text-xs text-ink/50">{e.user?.email}</div>
                      {e.user?.phone && <div className="text-xs text-ink/50">{e.user.phone}</div>}
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="text-navy font-medium">{e.course?.title}</div>
                      <div className="text-xs text-ink/50">
                        ₹{e.amountPaid.toLocaleString('en-IN')} •{' '}
                        {new Date(e.enrolledAt).toLocaleDateString('en-IN')}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`badge ${paymentBadge(e.paymentStatus)}`}>
                        {e.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`badge ${statusBadge(e.enrollmentStatus)}`}>
                        {e.enrollmentStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1 flex-wrap">
                        {e.enrollmentStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => approve(e._id)}
                              title="Approve"
                              className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-800 rounded text-xs font-medium hover:bg-green-200 transition-colors"
                            >
                              <CheckCircle size={13}/> Approve
                            </button>
                            <button
                              onClick={() => reject(e._id)}
                              title="Reject"
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 transition-colors"
                            >
                              <XCircle size={13}/> Reject
                            </button>
                          </>
                        )}
                        {e.enrollmentStatus === 'active' && (
                          <button
                            onClick={() => reject(e._id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 transition-colors"
                          >
                            <XCircle size={13}/> Deactivate
                          </button>
                        )}
                        {e.enrollmentStatus === 'rejected' && (
                          <button
                            onClick={() => approve(e._id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-800 rounded text-xs font-medium hover:bg-green-200 transition-colors"
                          >
                            <CheckCircle size={13}/> Re-approve
                          </button>
                        )}
                        {e.paymentStatus !== 'paid' ? (
                          <button
                            onClick={() => markPaid(e._id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-gold/20 text-gold-dark rounded text-xs font-medium hover:bg-gold/30 transition-colors"
                          >
                            <IndianRupee size={13}/> Mark Paid
                          </button>
                        ) : (
                          <button
                            onClick={() => markPending(e._id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded text-xs font-medium hover:bg-gray-200 transition-colors"
                          >
                            <IndianRupee size={13}/> Unmark
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageEnrollments;
