import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Calendar, User as UserIcon, IndianRupee, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const UserInvestmentSetup = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadUserAndInvestments();
  }, [userId]);

  const loadUserAndInvestments = async () => {
    setLoading(true);
    try {
      const [userRes, investmentsRes] = await Promise.all([
        api.get(`/admin/users/${userId}`),
        api.get(`/admin/users/${userId}/investments`)
      ]);
      setUser(userRes.data.user);
      setInvestments(investmentsRes.data.investments || []);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      if (editingId) {
        await api.put(`/admin/users/${userId}/investments/${editingId}`, {
          amount: parseFloat(formData.amount),
          description: formData.description,
          date: formData.date
        });
        toast.success('Investment updated successfully');
      } else {
        await api.post(`/admin/users/${userId}/investments`, {
          amount: parseFloat(formData.amount),
          description: formData.description,
          date: formData.date
        });
        toast.success('Investment added successfully');
      }
      setFormData({
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      setEditingId(null);
      setShowForm(false);
      loadUserAndInvestments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save investment');
    }
  };

  const handleEdit = (investment) => {
    setFormData({
      amount: investment.amount,
      description: investment.description || '',
      date: investment.date.split('T')[0]
    });
    setEditingId(investment._id);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setFormData({
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleDelete = async (investmentId) => {
    if (!confirm('Delete this investment record?')) return;
    try {
      await api.delete(`/admin/users/${userId}/investments/${investmentId}`);
      toast.success('Investment deleted');
      loadUserAndInvestments();
    } catch (err) {
      toast.error('Failed to delete investment');
    }
  };

  if (loading) {
    return (
      <div className="bg-cream min-h-screen">
        <section className="bg-navy-900 text-cream py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-xs uppercase tracking-[0.3em] text-gold mb-1">Admin</div>
            <h1 className="font-display text-3xl">Loading…</h1>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <section className="bg-navy-900 text-cream py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs uppercase tracking-[0.3em] text-gold mb-1">Admin</div>
          <h1 className="font-display text-3xl">User Investment Setup</h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link to="/admin" className="inline-flex items-center gap-2 text-navy hover:text-gold-dark mb-6 transition-colors">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        {/* User info card */}
        {user && (
          <div className="card p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-navy text-gold flex items-center justify-center font-display text-2xl">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="font-display text-2xl text-navy">{user.name}</h2>
                <p className="text-ink/60">{user.email}</p>
                {user.phone && <p className="text-sm text-ink/60">{user.phone}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Add investment button */}
        <div className="mb-6">
          <button
            onClick={() => {
              if (editingId) {
                handleCancelEdit();
              } else {
                setShowForm(!showForm);
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-navy text-gold rounded-lg hover:bg-navy-800 transition-colors"
          >
            <Plus size={18} />
            {editingId ? 'Cancel Edit' : (showForm ? 'Cancel' : 'Add Investment')}
          </button>
        </div>

        {/* Investment form */}
        {showForm && (
          <div className="card p-6 mb-6">
            <h3 className="font-display text-xl text-navy mb-4">{editingId ? 'Edit Investment' : 'Add New Investment'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Amount (₹) *</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-navy-200 rounded-lg focus:outline-none focus:border-gold"
                  placeholder="Enter amount"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-navy-200 rounded-lg focus:outline-none focus:border-gold"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-navy-200 rounded-lg focus:outline-none focus:border-gold"
                  rows="3"
                  placeholder="Optional description or notes"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-navy text-gold rounded-lg hover:bg-navy-800 transition-colors"
                >
                  {editingId ? 'Update Investment' : 'Save Investment'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-2 border border-navy-200 text-navy rounded-lg hover:bg-navy-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Investment history */}
        <div className="card p-6">
          <h3 className="font-display text-xl text-navy mb-4 flex items-center gap-2">
            <IndianRupee className="text-gold" size={20} />
            Investment History
          </h3>
          {!investments.length ? (
            <p className="text-ink/60 text-sm">No investment records found.</p>
          ) : (
            <div className="space-y-3">
              {investments.map((inv) => (
                <div key={inv._id} className="flex items-start justify-between p-4 border border-navy-100 rounded-lg hover:bg-navy-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-display text-lg text-navy">₹{inv.amount.toLocaleString('en-IN')}</span>
                    </div>
                    {inv.description && (
                      <p className="text-sm text-ink/70 mb-2">{inv.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-ink/60">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(inv.date).toLocaleDateString('en-IN')}
                      </span>
                      <span className="flex items-center gap-1">
                        <UserIcon size={12} />
                        Added by {inv.addedBy?.name || 'Admin'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(inv)}
                      className="p-2 hover:bg-navy-50 text-navy rounded transition-colors"
                      title="Edit investment"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(inv._id)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors"
                      title="Delete investment"
                    >
                      <Trash2 size={16} />
                    </button>
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

export default UserInvestmentSetup;
