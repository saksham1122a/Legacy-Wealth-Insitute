import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, X, ArrowLeft, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const emptyForm = { title: '', description: '', type: 'video', videoUrl: '', duration: 0, isPreview: false, content: '', resources: '' };

const ManageLessons = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedModule, setSelectedModule] = useState('');
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    try {
      const [courseRes, lessonsRes] = await Promise.all([
        api.get('/courses/admin/all'),
        api.get(`/admin/lessons?courseId=${courseId}`)
      ]);
      const found = courseRes.data.courses.find(c => c._id === courseId);
      setCourse(found);
      setLessons(lessonsRes.data.lessons);
      if (found?.modules?.length > 0 && !selectedModule) {
        setSelectedModule(found.modules[0]._id);
      }
    } catch {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [courseId]);

  const openNew = (moduleId) => {
    setEditing(null);
    setSelectedModule(moduleId);
    setForm(emptyForm);
    setModal(true);
  };

  const openEdit = (lesson) => {
    setEditing(lesson);
    setSelectedModule(lesson.moduleId);
    setForm({
      title: lesson.title,
      description: lesson.description,
      type: lesson.type,
      videoUrl: lesson.videoUrl,
      duration: lesson.duration,
      isPreview: lesson.isPreview,
      content: lesson.content,
      resources: (lesson.resources || []).map(r => `${r.name}|${r.url}`).join('\n')
    });
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resources = form.resources
      ? form.resources.split('\n').map(line => {
          const [name, url] = line.split('|');
          return { name: name?.trim(), url: url?.trim() };
        }).filter(r => r.url)
      : [];

    const payload = { ...form, courseId, moduleId: selectedModule, duration: Number(form.duration), resources };

    try {
      if (editing) {
        await api.put(`/admin/lessons/${editing._id}`, payload);
        toast.success('Lesson updated');
      } else {
        await api.post('/admin/lessons', payload);
        toast.success('Lesson created');
      }
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (lesson) => {
    if (!confirm(`Delete "${lesson.title}"?`)) return;
    try {
      await api.delete(`/admin/lessons/${lesson._id}`);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-navy">Loading…</div>;

  return (
    <div className="bg-cream min-h-screen">
      <section className="bg-navy-900 text-cream py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/admin/courses" className="inline-flex items-center gap-1 text-cream/60 hover:text-gold text-sm mb-4">
            <ArrowLeft size={15}/> Back to Courses
          </Link>
          <div className="text-xs uppercase tracking-[0.3em] text-gold mb-1">Admin · Lesson Manager</div>
          <h1 className="font-display text-3xl">{course?.title}</h1>
          <p className="text-cream/60 text-sm mt-1">{course?.modules?.length || 0} modules · {lessons.length} lessons total</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {course?.modules?.length === 0 && (
          <div className="card p-8 text-center text-ink/60">
            No modules found. Add modules first from the{' '}
            <Link to="/admin/courses" className="text-gold-dark underline">Courses page</Link>.
          </div>
        )}

        {course?.modules?.map((mod) => {
          const modLessons = lessons.filter(l => l.moduleId === mod._id || l.moduleId?.toString() === mod._id?.toString());
          return (
            <div key={mod._id} className="card overflow-hidden">
              <div className="bg-navy-50 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg text-navy">{mod.title}</h2>
                  {mod.description && <p className="text-xs text-ink/60 mt-0.5">{mod.description}</p>}
                </div>
                <button onClick={() => openNew(mod._id)} className="btn-gold !py-2 !px-3 text-sm flex items-center gap-1">
                  <Plus size={15}/> Add Lesson
                </button>
              </div>

              {modLessons.length === 0 ? (
                <p className="text-ink/40 text-sm px-6 py-5">No lessons yet — click Add Lesson above.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-ink/50 border-b border-navy-100">
                      <th className="px-6 py-2">Title</th>
                      <th className="px-4 py-2 hidden sm:table-cell">Type</th>
                      <th className="px-4 py-2 hidden md:table-cell">Duration</th>
                      <th className="px-4 py-2 hidden md:table-cell">Preview</th>
                      <th className="px-4 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modLessons.map((lesson, i) => (
                      <tr key={lesson._id} className="border-t border-navy-100 hover:bg-cream/50">
                        <td className="px-6 py-3 flex items-center gap-2">
                          <GripVertical size={14} className="text-ink/20"/>
                          <div>
                            <div className="font-medium text-navy">{lesson.title}</div>
                            {lesson.description && <div className="text-xs text-ink/50 truncate max-w-xs">{lesson.description}</div>}
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="badge bg-navy-50 text-navy capitalize">{lesson.type}</span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-ink/60">{lesson.duration > 0 ? `${lesson.duration} min` : '—'}</td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          {lesson.isPreview ? <span className="badge bg-gold/10 text-gold-dark">Free</span> : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEdit(lesson)} className="p-2 hover:bg-navy-50 rounded" title="Edit">
                              <Edit2 size={15}/>
                            </button>
                            <button onClick={() => handleDelete(lesson)} className="p-2 hover:bg-red-50 text-red-600 rounded" title="Delete">
                              <Trash2 size={15}/>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-navy-900/70 z-50 flex items-center justify-center p-4">
          <div className="bg-cream rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-navy text-cream p-5 flex items-center justify-between">
              <h2 className="font-display text-xl">{editing ? 'Edit Lesson' : 'New Lesson'}</h2>
              <button onClick={() => setModal(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Module</label>
                <select className="input-field" value={selectedModule} onChange={e => setSelectedModule(e.target.value)}>
                  {course?.modules?.map(m => <option key={m._id} value={m._id}>{m.title}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-1">Lesson Title *</label>
                <input required className="input-field" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. What is Market Structure?"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-1">Description</label>
                <textarea rows={2} className="input-field" value={form.description} onChange={e => setForm({...form, description: e.target.value})}/>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">Type</label>
                  <select className="input-field" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                    <option value="video">Video</option>
                    <option value="text">Text / Notes</option>
                    <option value="pdf">PDF</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">Duration (mins)</label>
                  <input type="number" min="0" className="input-field" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})}/>
                </div>
              </div>

              {form.type === 'video' && (
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">Video URL</label>
                  <input className="input-field" value={form.videoUrl} onChange={e => setForm({...form, videoUrl: e.target.value})} placeholder="YouTube, Vimeo or direct URL"/>
                </div>
              )}

              {form.type === 'text' && (
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">Content</label>
                  <textarea rows={5} className="input-field" value={form.content} onChange={e => setForm({...form, content: e.target.value})} placeholder="Lesson text content…"/>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  Resources <span className="text-ink/40 font-normal">(one per line: Name|URL)</span>
                </label>
                <textarea rows={3} className="input-field text-xs" value={form.resources} onChange={e => setForm({...form, resources: e.target.value})} placeholder="Slide Deck|https://drive.google.com/...&#10;Cheatsheet|https://..."/>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isPreview} onChange={e => setForm({...form, isPreview: e.target.checked})} className="w-4 h-4 accent-navy"/>
                <span className="text-sm text-navy">Free preview (visible without enrollment)</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" className="btn-gold flex-1">{editing ? 'Update' : 'Create'} Lesson</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageLessons;
