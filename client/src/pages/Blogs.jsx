import { useEffect, useState } from 'react';
import api from '../api/axios';

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/blogs')
            .then(({ data }) => {
                setBlogs(data.blogs);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="bg-cream min-h-screen py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="text-gold uppercase tracking-[0.3em] text-sm mb-4">Latest Insights</div>
                    <h1 className="font-display text-4xl md:text-5xl text-navy">Educational Blogs</h1>
                    <p className="text-ink/60 mt-4 max-w-2xl mx-auto">
                        Stay updated with the latest market trends, trading strategies, and financial insights from our experts.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-20 text-navy font-display text-xl">
                        No blogs available yet.
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog) => (
                            <div key={blog._id} className="card group overflow-hidden transition-all hover:shadow-2xl">
                                <div className="h-64 overflow-hidden relative">
                                    <img 
                                        src={blog.image} 
                                        alt={blog.title} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="badge bg-gold text-navy font-medium">Article</span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 text-xs text-ink/40 mb-3">
                                        <span className="text-gold-dark font-medium">{blog.author}</span>
                                        <span>•</span>
                                        <span>{new Date(blog.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    </div>
                                    <h2 className="font-display text-xl text-navy mb-3 group-hover:text-gold-dark transition-colors line-clamp-2">
                                        {blog.title}
                                    </h2>
                                    <p className="text-sm text-ink/60 line-clamp-3 mb-6">
                                        {blog.description}
                                    </p>
                                    <button className="text-gold-dark font-medium text-sm hover:underline flex items-center gap-1">
                                        Read More <span>→</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blogs;