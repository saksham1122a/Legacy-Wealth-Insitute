import { useEffect, useState } from 'react';
import { Trash2, ShieldCheck, ShieldOff, UserCog } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data.users);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggleActive = async (u) => {
    try {
      await api.put(`/admin/users/${u._id}`, { isActive: !u.isActive });
      toast.success(u.isActive ? 'User deactivated' : 'User activated');
      load();
    } catch {
      toast.error('Failed');
    }
  };

  const toggleAdmin = async (u) => {
    if (!confirm(`${u.role === 'admin' ? 'Demote' : 'Promote'} ${u.name}?`)) return;
    try {
      await api.put(`/admin/users/${u._id}`, { role: u.role === 'admin' ? 'user' : 'admin' });
      toast.success('Role updated');
      load();
    } catch {
      toast.error('Failed');
    }
  };

  const handleDelete = async (u) => {
    if (!confirm(`Delete ${u.name}? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/users/${u._id}`);
      toast.success('User deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="bg-cream min-h-screen">
      <section className="bg-navy-900 text-cream py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs uppercase tracking-[0.3em] text-gold mb-1">Admin</div>
          <h1 className="font-display text-3xl">Manage Users</h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12 text-navy">Loading…</div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-navy-50 text-navy">
                <tr>
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4 hidden md:table-cell">Email</th>
                  <th className="text-left p-4 hidden lg:table-cell">Phone</th>
                  <th className="text-center p-4">Role</th>
                  <th className="text-center p-4">Status</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-t border-navy-100 hover:bg-cream/50">
                    <td className="p-4 font-medium text-navy">{u.name}</td>
                    <td className="p-4 hidden md:table-cell text-ink/70">{u.email}</td>
                    <td className="p-4 hidden lg:table-cell text-ink/70">{u.phone || '—'}</td>
                    <td className="p-4 text-center">
                      <span className={`badge ${u.role === 'admin' ? 'bg-gold/20 text-gold-dark' : 'bg-navy-50 text-navy'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`badge ${u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
                        {u.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => toggleAdmin(u)} title="Toggle admin role" className="p-2 hover:bg-navy-50 rounded">
                          <UserCog size={16}/>
                        </button>
                        <button onClick={() => toggleActive(u)} title={u.isActive ? 'Deactivate' : 'Activate'} className="p-2 hover:bg-navy-50 rounded">
                          {u.isActive ? <ShieldOff size={16}/> : <ShieldCheck size={16}/>}
                        </button>
                        <button onClick={() => handleDelete(u)} title="Delete" className="p-2 hover:bg-red-50 text-red-600 rounded">
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={6} className="p-8 text-center text-ink/60">No users registered yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
