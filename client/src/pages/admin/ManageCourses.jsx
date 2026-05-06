import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, X, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const emptyForm = {
  title: '', tagline: '', description: '',
  category: 'Foundation', level: 'Beginner',
  price: 0, discountPrice: 0, durationDays: 90,
  highlights: '', isPublished: false
};

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/courses/admin/all');
      setCourses(data.courses);
    } catch (err) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setModal(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({
      ...c,
      highlights: (c.highlights || []).join('\n')
    });
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      discountPrice: Number(form.discountPrice),
      durationDays: Number(form.durationDays),
      highlights: form.highlights.split('\n').map(h => h.trim()).filter(Boolean)
    };

    try {
      if (editing) {
        await api.put(`/courses/${editing._id}`, payload);
        toast.success('Course updated');
      } else {
        await api.post('/courses', payload);
        toast.success('Course created');
      }
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
  };

  const togglePublish = async (c) => {
    try {
      await api.put(`/courses/${c._id}`, { isPublished: !c.isPublished });
      toast.success(c.isPublished ? 'Unpublished' : 'Published');
      load();
    } catch {
      toast.error('Failed');
    }
  };

  const handleDelete = async (c) => {
    if (!confirm(`Delete "${c.title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/courses/${c._id}`);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="bg-cream min-h-screen">
      <section className="bg-navy-900 text-cream py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-gold mb-1">Admin</div>
            <h1 className="font-display text-3xl">Manage Courses</h1>
          </div>
          <button onClick={openNew} className="btn-gold !py-2.5">
            <Plus size={16}/> New Course
          </button>
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
                  <th className="text-left p-4">Title</th>
                  <th className="text-left p-4 hidden md:table-cell">Category</th>
                  <th className="text-right p-4">Price</th>
                  <th className="text-center p-4">Status</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(c => (
                  <tr key={c._id} className="border-t border-navy-100 hover:bg-cream/50">
                    <td className="p-4">
                      <div className="font-medium text-navy">{c.title}</div>
                      <div className="text-xs text-ink/50">{c.slug}</div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="badge bg-navy-50 text-navy">{c.category}</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="text-navy">₹{(c.discountPrice || c.price).toLocaleString('en-IN')}</div>
                      {c.discountPrice > 0 && (
                        <div className="text-xs text-ink/40 line-through">₹{c.price.toLocaleString('en-IN')}</div>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`badge ${c.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                        {c.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/courses/${c._id}/lessons`} title="Manage Lessons" className="p-2 hover:bg-gold/10 text-gold-dark rounded">
                          <BookOpen size={16}/>
                        </Link>
                        <button onClick={() => togglePublish(c)} title={c.isPublished ? 'Unpublish' : 'Publish'} className="p-2 hover:bg-navy-50 rounded">
                          {c.isPublished ? <EyeOff size={16}/> : <Eye size={16}/>}
                        </button>
                        <button onClick={() => openEdit(c)} title="Edit" className="p-2 hover:bg-navy-50 rounded">
                          <Edit2 size={16}/>
                        </button>
                        <button onClick={() => handleDelete(c)} title="Delete" className="p-2 hover:bg-red-50 text-red-600 rounded">
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {courses.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-ink/60">No courses yet. Click "New Course" above.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-navy-900/70 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-cream rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-navy text-cream p-5 flex items-center justify-between">
              <h2 className="font-display text-xl">{editing ? 'Edit Course' : 'New Course'}</h2>
              <button onClick={() => setModal(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Title *</label>
                <input required className="input-field" value={form.title} onChange={e => setForm({...form, title: e.target.value})}/>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Tagline</label>
                <input className="input-field" value={form.tagline} onChange={e => setForm({...form, tagline: e.target.value})}/>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Description *</label>
                <textarea required rows={4} className="input-field" value={form.description} onChange={e => setForm({...form, description: e.target.value})}/>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">Category</label>
                  <select className="input-field" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    <option>Foundation</option>
                    <option>SMC Trading</option>
                    <option>Investing</option>
                    <option>Forex</option>
                    <option>Mentorship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">Level</label>
                  <select className="input-field" value={form.level} onChange={e => setForm({...form, level: e.target.value})}>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">Price (₹)</label>
                  <input type="number" min="0" className="input-field" value={form.price} onChange={e => setForm({...form, price: e.target.value})}/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">Discount Price</label>
                  <input type="number" min="0" className="input-field" value={form.discountPrice} onChange={e => setForm({...form, discountPrice: e.target.value})}/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">Duration (days)</label>
                  <input type="number" min="1" className="input-field" value={form.durationDays} onChange={e => setForm({...form, durationDays: e.target.value})}/>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-1">Highlights (one per line)</label>
                <textarea rows={4} className="input-field" placeholder="Live mentorship sessions&#10;Real chart breakdowns&#10;..." value={form.highlights} onChange={e => setForm({...form, highlights: e.target.value})}/>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isPublished} onChange={e => setForm({...form, isPublished: e.target.checked})} className="w-4 h-4 accent-navy"/>
                <span className="text-sm text-navy">Publish immediately (visible to users)</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" className="btn-gold flex-1">{editing ? 'Update' : 'Create'} Course</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCourses;
