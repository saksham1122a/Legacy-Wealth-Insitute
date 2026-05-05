import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, BarChart3, Tag } from 'lucide-react';
import api from '../api/axios';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    api.get('/courses')
      .then(({ data }) => setCourses(data.courses))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', 'Mentorship', 'SMC Trading', 'Investing', 'Forex', 'Foundation'];
  const filtered = filter === 'All' ? courses : courses.filter(c => c.category === filter);

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <section className="bg-navy-900 text-cream py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Programs</div>
          <h1 className="font-display text-4xl md:text-6xl mb-4">
            Learn the <span className="italic text-gold">framework</span>.<br/>
            Not just the tricks.
          </h1>
          <p className="text-cream/75 max-w-2xl">
            Every program is built around institutional logic, real risk management, and the discipline to execute under pressure.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === c
                  ? 'bg-navy text-cream'
                  : 'bg-white text-navy border border-navy-200 hover:border-navy'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Course grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading ? (
          <div className="text-center py-20 text-navy">Loading programs…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-ink/60">No programs in this category yet.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(course => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CourseCard = ({ course }) => {
  const effectivePrice = course.discountPrice > 0 ? course.discountPrice : course.price;
  const hasDiscount = course.discountPrice > 0 && course.discountPrice < course.price;

  return (
    <Link to={`/courses/${course.slug}`} className="card p-6 group flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <span className="badge bg-navy-50 text-navy">{course.category}</span>
        <span className="badge bg-gold/10 text-gold-dark">{course.level}</span>
      </div>

      <h3 className="font-display text-xl text-navy mb-2 group-hover:text-gold-dark transition-colors">
        {course.title}
      </h3>

      {course.tagline && (
        <p className="text-sm text-ink/60 italic mb-4">{course.tagline}</p>
      )}

      <div className="flex flex-wrap gap-3 text-xs text-ink/70 mb-5 mt-auto">
        <span className="flex items-center gap-1"><Clock size={13}/> {course.durationDays} days</span>
        <span className="flex items-center gap-1"><BarChart3 size={13}/> {course.modules?.length || 0} modules</span>
      </div>

      <div className="flex items-end justify-between border-t border-navy-100 pt-4">
        <div>
          {hasDiscount && (
            <div className="text-xs text-ink/40 line-through">₹{course.price.toLocaleString('en-IN')}</div>
          )}
          <div className="font-display text-2xl text-navy">₹{effectivePrice.toLocaleString('en-IN')}</div>
        </div>
        <span className="text-sm font-medium text-gold-dark group-hover:translate-x-1 transition-transform">
          View →
        </span>
      </div>
    </Link>
  );
};

export default Courses;
