import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Clock, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { fadeUp, stagger, fadeLeft } from '../utils/motion';

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

  const normalize = (s) => s?.toString?.().trim().toLowerCase?.() || '';
  const filtered = filter === 'All'
    ? courses
    : courses.filter(c => normalize(c.category) === normalize(filter));

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat) {
      // Accept any non-empty category from querystring — normalize for comparison
      setFilter(decodeURIComponent(cat));
    }
  }, [location.search]);

  return (
    <div className="bg-cream min-h-screen">

      {/* Header */}
      <section className="bg-navy-900 text-cream py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeLeft} initial="hidden" animate="show">
            <div className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Programs</div>
            <h1 className="font-display text-4xl md:text-6xl mb-4">
              Learn the <span className="italic text-gold">framework</span>.<br />Not just the tricks.
            </h1>
            <p className="text-cream/75 max-w-2xl">
              Every program is built around institutional logic, real risk management, and the discipline to execute under pressure.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="flex flex-wrap gap-2"
          variants={stagger} initial="hidden" animate="show"
        >
          {categories.map(c => (
            <motion.button
              key={c}
              variants={fadeUp}
              onClick={() => setFilter(c)}
              whileTap={{ scale: 0.93 }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === c
                  ? 'bg-navy text-cream shadow-sm'
                  : 'bg-white text-navy border border-navy-200 hover:border-navy'
              }`}
            >
              {c}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Course grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading ? (
          /* Skeleton loading */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="flex justify-between mb-3">
                  <div className="h-5 w-24 bg-navy-100 rounded-full" />
                  <div className="h-5 w-20 bg-navy-100 rounded-full" />
                </div>
                <div className="h-6 w-3/4 bg-navy-100 rounded mb-2" />
                <div className="h-4 w-full bg-navy-100 rounded mb-1" />
                <div className="h-4 w-2/3 bg-navy-100 rounded mb-5" />
                <div className="flex gap-3 mb-5">
                  <div className="h-4 w-20 bg-navy-100 rounded" />
                  <div className="h-4 w-20 bg-navy-100 rounded" />
                </div>
                <div className="border-t border-navy-100 pt-4 flex justify-between">
                  <div className="h-7 w-24 bg-navy-100 rounded" />
                  <div className="h-5 w-12 bg-navy-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            className="text-center py-20 text-ink/60"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            No programs in this category yet.
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={stagger}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              {filtered.map(course => (
                <motion.div key={course._id} variants={fadeUp} layout>
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

const CourseCard = ({ course }) => {
  const effectivePrice = course.discountPrice > 0 ? course.discountPrice : course.price;
  const hasDiscount = course.discountPrice > 0 && course.discountPrice < course.price;

  const navigate = useNavigate();

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link to={`/courses/${course.slug}`} className="card p-6 group flex flex-col h-full">
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
          <span className="flex items-center gap-1"><Clock size={13} /> {course.durationDays} days</span>
          <span className="flex items-center gap-1"><BarChart3 size={13} /> {course.modules?.length || 0} modules</span>
        </div>

        <div className="flex items-end justify-between border-t border-navy-100 pt-4">
          <div>
            {hasDiscount && (
              <div className="text-xs text-ink/40 line-through">₹{course.price.toLocaleString('en-IN')}</div>
            )}
            <div className="font-display text-2xl text-navy">₹{effectivePrice.toLocaleString('en-IN')}</div>
          </div>
          <motion.span
            className="text-sm font-medium text-gold-dark"
            whileHover={{ x: 4 }}
            transition={{ duration: 0.15 }}
          >
            View →
          </motion.span>
        </div>
      </Link>
    </motion.div>
  );
};

export default Courses;