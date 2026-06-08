import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, IndianRupee, BadgeCheck, ArrowRight, Clock, Edit2, Trash2, X, Plus } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  
  // Blog Management States
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({ title: '', description: '', image: '' });
  const [showBlogForm, setShowBlogForm] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchBlogs();
  }, []);

  const fetchStats = () => {
    api.get('/admin/stats')
      .then(({ data }) => setStats(data.stats))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const fetchBlogs = () => {
    setBlogsLoading(true);
    api.get('/blogs')
      .then(({ data }) => setBlogs(data.blogs || []))
      .catch(() => toast.error("Failed to fetch blogs"))
      .finally(() => setBlogsLoading(false));
  };

  const fetchUsers = () => {
    setUsersLoading(true);
    api.get('/admin/users')
      .then(({ data }) => setUsers(data.users || []))
      .catch(() => {})
      .finally(() => setUsersLoading(false));
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    
    const payload = { ...blogForm };
    
    // If it's a new blog, we need an image. If editing, it can be the same.
    if (!editingBlog && !blogForm.image) {
      toast.error("Please upload an image");
      return;
    }

    try {
      if (editingBlog && editingBlog._id) {
        console.log("Updating blog with ID:", editingBlog._id);
        await api.put(`/blogs/${editingBlog._id}`, payload);
        toast.success("Blog updated successfully");
      } else {
        await api.post('/blogs', payload);
        toast.success("Blog added successfully");
      }
      
      resetBlogForm();
      fetchBlogs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const resetBlogForm = () => {
    setBlogForm({ title: '', description: '', image: '' });
    setEditingBlog(null);
    setShowBlogForm(false);
  };

  const handleEditClick = (blog) => {
    setEditingBlog(blog);
    setBlogForm({ title: blog.title, description: blog.description, image: blog.image });
    setShowBlogForm(true);
    window.scrollTo({ top: document.getElementById('blog-form-section')?.offsetTop - 100, behavior: 'smooth' });
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    
    try {
      await api.delete(`/blogs/${id}`);
      toast.success("Blog deleted");
      fetchBlogs();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setBlogForm({ ...blogForm, image: reader.result });
      };
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-navy font-display text-xl animate-pulse">Loading Control Centre...</div>;

  return (
    <div className="bg-cream min-h-screen pb-20">
      <section className="bg-navy-900 text-cream py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-gold rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-xs uppercase tracking-[0.3em] text-gold mb-2 font-medium">Admin</div>
          <h1 className="font-display text-3xl md:text-5xl">Control Centre</h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard icon={<Users/>}       label="Users"              value={stats?.users || 0}             link="/admin/users"/>
          <StatCard icon={<BookOpen/>}    label="Courses"            value={stats?.courses || 0}           link="/admin/courses"/>
          <StatCard icon={<Clock/>}       label="Pending Approvals"  value={stats?.pendingEnrollments || 0} link="/admin/enrollments" highlight={stats?.pendingEnrollments > 0}/>
          <StatCard icon={<IndianRupee/>} label="Revenue Collected"  value={`₹${(stats?.revenue || 0).toLocaleString('en-IN')}`}/>
        </div>

        {/* Pending approval alert */}
        {stats?.pendingEnrollments > 0 && (
          <Link to="/admin/enrollments?status=pending" className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8 hover:bg-yellow-100 transition-all hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="text-yellow-600" size={20}/>
              </div>
              <div>
                <p className="font-medium text-yellow-800">{stats.pendingEnrollments} enrollment{stats.pendingEnrollments > 1 ? 's' : ''} waiting for your approval</p>
                <p className="text-xs text-yellow-700 font-medium">Click to review and approve</p>
              </div>
            </div>
            <ArrowRight className="text-yellow-600" size={18}/>
          </Link>
        )}

        {/* Quick actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          <ActionCard title="Manage Enrollments" desc="Approve, reject, mark payments" to="/admin/enrollments"/>
          <ActionCard title="Manage Courses"     desc="Add, edit, publish programs"    to="/admin/courses"/>
          <ActionCard title="Manage Users"       desc="View and control accounts"      to="/admin/users"/>
          <ActionCard title="View Leads"         desc="Track funnel and conversions"   to="/admin/leads"/>
        </div>

        {/* Blog Management Section */}
        <div id="blog-form-section" className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl text-navy flex items-center gap-2">
              <BookOpen className="text-gold"/> Blog Management
            </h2>
            <button 
              onClick={() => {
                if (showBlogForm && !editingBlog) setShowBlogForm(false);
                else {
                  resetBlogForm();
                  setShowBlogForm(true);
                }
              }} 
              className={`btn-${showBlogForm && !editingBlog ? 'outline' : 'gold'} !py-2 flex items-center gap-2`}
            >
              {showBlogForm && !editingBlog ? <><X size={16}/> Cancel</> : <><Plus size={16}/> New Blog</>}
            </button>
          </div>

          {showBlogForm && (
            <div className="card p-6 mb-8 border-gold/30 bg-cream-50 animate-fade-in">
              <div className="flex items-center justify-between mb-6 border-b border-navy-50 pb-4">
                <h3 className="font-display text-xl text-navy">{editingBlog ? 'Edit Blog' : 'Create New Blog'}</h3>
                <button onClick={resetBlogForm} className="text-ink/40 hover:text-navy"><X size={20}/></button>
              </div>
              <form onSubmit={handleBlogSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-1.5">Blog Title</label>
                      <input 
                        required 
                        value={blogForm.title}
                        onChange={e => setBlogForm({ ...blogForm, title: e.target.value })}
                        className="input-field bg-white" 
                        placeholder="e.g. Master the SMC Strategy" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-1.5">Description</label>
                      <textarea 
                        required 
                        rows={6}
                        value={blogForm.description}
                        onChange={e => setBlogForm({ ...blogForm, description: e.target.value })}
                        className="input-field bg-white" 
                        placeholder="Content of the blog post..."
                      ></textarea>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-navy mb-1.5">Featured Image</label>
                    <div className="relative group aspect-video rounded-xl border-2 border-dashed border-navy-100 overflow-hidden bg-navy-50/30 flex flex-col items-center justify-center p-4 transition-all hover:border-gold">
                      {blogForm.image ? (
                        <>
                          <img src={blogForm.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-sm font-medium">Change Image</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-full bg-navy-50 flex items-center justify-center mb-2">
                            <Plus className="text-navy/40" />
                          </div>
                          <span className="text-xs text-navy/40 font-medium text-center">Click to upload<br/>(PNG, JPG, max 5MB)</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        onChange={handleImageChange}
                        accept="image/*" 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-navy-50">
                  <button type="button" onClick={resetBlogForm} className="btn-outline !py-2.5 px-6">Discard</button>
                  <button type="submit" className="btn-gold !py-2.5 px-8">
                    {editingBlog ? 'Update Blog' : 'Publish Blog'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Blogs List */}
          <div className="card overflow-hidden">
            <div className="bg-navy-50/50 p-4 border-b border-navy-100">
              <h3 className="font-display text-lg text-navy">Existing Blogs</h3>
            </div>
            {blogsLoading ? (
              <div className="p-12 text-center text-navy/40 animate-pulse">Loading blogs...</div>
            ) : blogs.length === 0 ? (
              <div className="p-12 text-center text-navy/40">No blogs found. Click "New Blog" to get started.</div>
            ) : (
              <div className="divide-y divide-navy-50">
                {blogs.map(blog => (
                  <div key={blog._id} className="p-4 hover:bg-cream/30 transition-colors flex items-center gap-4">
                    <div className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-navy-100">
                      <img src={blog.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display text-navy truncate">{blog.title}</h4>
                      <p className="text-xs text-navy/40 truncate">{blog.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEditClick(blog)}
                        className="p-2 text-gold-dark hover:bg-gold/10 rounded-lg transition-colors"
                        title="Edit Blog"
                      >
                        <Edit2 size={18}/>
                      </button>
                      <button 
                        onClick={() => handleDeleteBlog(blog._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Blog"
                      >
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent enrollments */}
        <div className="card p-6 mb-12">
          <h2 className="font-display text-xl text-navy mb-4 flex items-center gap-2">
            <BadgeCheck className="text-gold"/> Recent Enrollments
          </h2>
          {!stats?.recentEnrollments?.length ? (
            <p className="text-ink/60 text-sm italic">No enrollments recorded yet.</p>
          ) : (
            <div className="space-y-1">
              {stats.recentEnrollments.map(e => (
                <div key={e._id} className="flex items-center justify-between py-3 border-b border-navy-50 last:border-0 hover:bg-navy-50/30 px-2 rounded-lg transition-colors">
                  <div>
                    <div className="font-semibold text-navy">{e.user?.name || 'Unknown'}</div>
                    <div className="text-[10px] text-navy/40 uppercase tracking-widest">{e.user?.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-navy">{e.course?.title}</div>
                    <div className="flex items-center gap-2 justify-end mt-0.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter ${
                        e.enrollmentStatus === 'active'   ? 'bg-green-100 text-green-700' :
                        e.enrollmentStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>{e.enrollmentStatus}</span>
                      <span className="text-xs font-bold text-gold-dark font-display">₹{e.amountPaid.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link to="/admin/enrollments" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-dark hover:text-gold transition-colors">
            View all enrollments <ArrowRight size={14}/>
          </Link>
        </div>

        {/* User Investment Setup */}
        <div className="card p-6">
          <h2 className="font-display text-xl text-navy mb-4 flex items-center gap-2">
            <Users className="text-gold"/> User Investment Setup
          </h2>
          <p className="text-sm text-ink/60 mb-6">Select a user to configure their individual profile investments</p>
          
          {!users.length ? (
            <button
              onClick={fetchUsers}
              disabled={usersLoading}
              className="px-6 py-2.5 bg-navy text-gold rounded-lg hover:bg-navy-800 transition-all shadow-lg shadow-navy/20 disabled:opacity-50 flex items-center gap-2"
            >
              {usersLoading ? <><div className="w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin"></div> Fetching...</> : 'Fetch User List'}
            </button>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {users.map(user => (
                  <Link
                    key={user._id}
                    to={`/admin/users/${user._id}/investment`}
                    className="flex items-center justify-between p-3 border border-navy-50 rounded-xl hover:bg-white hover:border-gold hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-navy text-gold flex items-center justify-center font-display text-lg ring-2 ring-gold/0 group-hover:ring-gold/30 transition-all">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-navy truncate">{user.name || 'Unknown'}</div>
                        <div className="text-[10px] text-navy/40 truncate">{user.email}</div>
                      </div>
                    </div>
                    <ArrowRight className="text-navy/20 group-hover:text-gold-dark transition-colors" size={16}/>
                  </Link>
                ))}
              </div>
              <button
                onClick={() => setUsers([])}
                className="mt-6 text-xs font-semibold text-navy/40 hover:text-red-500 transition-colors uppercase tracking-widest"
              >
                Clear list
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, sub, link, highlight }) => {
  const content = (
    <div className={`card p-5 h-full relative transition-all overflow-hidden group ${highlight ? 'border-yellow-300 bg-yellow-50/50' : 'hover:border-gold/50'}`}>
      <div className="flex items-start justify-between relative z-10">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${highlight ? 'bg-yellow-100 text-yellow-700' : 'bg-navy text-gold'}`}>{icon}</div>
        {link && <ArrowRight className="text-navy/10 group-hover:text-gold-dark transition-colors" size={18}/>}
      </div>
      <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-navy/40 mt-6 relative z-10">{label}</div>
      <div className={`font-display text-2xl mt-1 relative z-10 ${highlight ? 'text-yellow-800' : 'text-navy'}`}>{value}</div>
      {sub && <div className="text-xs text-gold-dark mt-1 font-medium relative z-10">{sub}</div>}
      
      {/* Decorative bg element */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-navy/5 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-gold/10 transition-colors"></div>
    </div>
  );
  return link ? <Link to={link} className="block">{content}</Link> : content;
};

const ActionCard = ({ title, desc, to }) => (
  <Link to={to} className="card p-6 group transition-all hover:bg-navy-900 border-gold/20">
    <h3 className="font-display text-lg text-navy mb-1 group-hover:text-gold transition-colors">{title}</h3>
    <p className="text-xs text-navy/50 mb-4 group-hover:text-cream/60 transition-colors leading-relaxed">{desc}</p>
    <div className="flex items-center gap-1.5 text-xs font-bold text-gold-dark group-hover:text-gold uppercase tracking-wider transition-colors pt-2 border-t border-navy-50 group-hover:border-gold/20">
      Open Module <ArrowRight size={12}/>
    </div>
  </Link>
);

export default AdminDashboard;
