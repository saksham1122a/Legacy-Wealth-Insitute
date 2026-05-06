import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Circle, ChevronDown, ChevronRight, ArrowLeft, ArrowRight, Lock, FileText, Video, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const getEmbedUrl = (url) => {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return url;
};

const Learn = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [courseData, setCourseData] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [openModules, setOpenModules] = useState({});
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  const allLessons = courseData?.modules?.flatMap(m => m.lessons) ?? [];
  const activeLessonIndex = allLessons.findIndex(l => l._id === activeLesson?._id);
  const prevLesson = activeLessonIndex > 0 ? allLessons[activeLessonIndex - 1] : null;
  const nextLesson = activeLessonIndex < allLessons.length - 1 ? allLessons[activeLessonIndex + 1] : null;
  const completedIds = new Set((enrollment?.completedLessons || []).map(id => id?.toString?.() ?? id));

  const load = useCallback(async () => {
    try {
      const [courseRes, enrollRes] = await Promise.all([
        api.get(`/courses/${slug}/learn`),
        api.get('/enrollments/me')
      ]);

      const data = courseRes.data;
      setCourseData(data);

      const myEnrollment = enrollRes.data.enrollments.find(
        e => e.course?._id === data.course._id || e.course?.slug === slug
      );
      setEnrollment(myEnrollment);

      // Open first module and set first lesson
      if (data.modules?.length > 0) {
        const firstMod = data.modules[0];
        setOpenModules({ [firstMod._id]: true });

        // Resume from last lesson or start from first
        const lastLessonId = myEnrollment?.lastLesson?._id ?? myEnrollment?.lastLesson;
        const resumeLesson = lastLessonId
          ? data.modules.flatMap(m => m.lessons).find(l => l._id === lastLessonId)
          : null;

        const startLesson = resumeLesson ?? data.modules.flatMap(m => m.lessons)[0];
        if (startLesson) setActiveLesson(startLesson);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Access denied');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [slug, navigate]);

  useEffect(() => { load(); }, [load]);

  const selectLesson = (lesson, moduleId) => {
    setActiveLesson(lesson);
    setOpenModules(prev => ({ ...prev, [moduleId]: true }));
  };

  const toggleModule = (moduleId) => {
    setOpenModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const markComplete = async () => {
    if (!enrollment || !activeLesson) return;
    setCompleting(true);
    try {
      const { data } = await api.post(`/enrollments/${enrollment._id}/complete-lesson`, {
        lessonId: activeLesson._id
      });
      setEnrollment(prev => ({
        ...prev,
        completedLessons: data.enrollment.completedLessons,
        progressPercent: data.enrollment.progressPercent,
        lastLesson: data.enrollment.lastLesson
      }));
      toast.success('Lesson marked as complete!');
      if (nextLesson) {
        setTimeout(() => selectLesson(nextLesson, courseData.modules.find(m => m.lessons.some(l => l._id === nextLesson._id))?._id), 600);
      }
    } catch {
      toast.error('Failed to mark complete');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900 text-cream">
      Loading course…
    </div>
  );

  if (!courseData) return null;

  const { course, modules } = courseData;
  const isCompleted = activeLesson && completedIds.has(activeLesson._id);
  const embedUrl = activeLesson?.videoUrl ? getEmbedUrl(activeLesson.videoUrl) : null;

  return (
    <div className="min-h-screen flex flex-col bg-navy-950">
      {/* Top bar */}
      <div className="bg-navy-900 border-b border-gold/20 px-4 py-3 flex items-center gap-4 sticky top-0 z-40">
        <Link to="/dashboard" className="text-cream/70 hover:text-gold flex items-center gap-1 text-sm">
          <ArrowLeft size={16}/> Dashboard
        </Link>
        <div className="flex-1 truncate">
          <span className="text-cream font-display text-sm md:text-base">{course.title}</span>
        </div>
        <div className="text-xs text-cream/60 hidden sm:block">
          {enrollment?.progressPercent ?? 0}% complete
        </div>
        <div className="w-24 h-1.5 bg-navy-700 rounded-full hidden sm:block">
          <div className="h-1.5 bg-gold rounded-full transition-all" style={{ width: `${enrollment?.progressPercent ?? 0}%` }}/>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 57px)' }}>
        {/* Sidebar */}
        <aside className="w-80 flex-shrink-0 bg-navy-900 border-r border-gold/10 overflow-y-auto hidden md:block">
          <div className="p-4 border-b border-gold/10">
            <p className="text-xs uppercase tracking-widest text-gold/70">Course Content</p>
            <p className="text-cream/60 text-xs mt-1">{allLessons.length} lessons · {enrollment?.progressPercent ?? 0}% done</p>
          </div>

          {modules.map((mod) => (
            <div key={mod._id} className="border-b border-navy-800">
              <button
                onClick={() => toggleModule(mod._id)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-navy-800 transition-colors"
              >
                <span className="text-cream/90 text-sm font-medium leading-snug pr-2">{mod.title}</span>
                <span className="flex-shrink-0 text-cream/40">
                  {openModules[mod._id] ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
                </span>
              </button>

              {openModules[mod._id] && (
                <div className="bg-navy-950">
                  {mod.lessons.length === 0 ? (
                    <p className="text-cream/30 text-xs px-6 py-3">No lessons yet</p>
                  ) : mod.lessons.map((lesson) => {
                    const done = completedIds.has(lesson._id);
                    const isCurrent = activeLesson?._id === lesson._id;
                    return (
                      <button
                        key={lesson._id}
                        onClick={() => selectLesson(lesson, mod._id)}
                        className={`w-full flex items-start gap-3 px-6 py-3 text-left transition-colors ${
                          isCurrent ? 'bg-gold/10 border-l-2 border-gold' : 'hover:bg-navy-800 border-l-2 border-transparent'
                        }`}
                      >
                        <span className="mt-0.5 flex-shrink-0">
                          {done
                            ? <CheckCircle size={15} className="text-green-400"/>
                            : <Circle size={15} className="text-cream/30"/>}
                        </span>
                        <div className="min-w-0">
                          <p className={`text-xs leading-snug ${isCurrent ? 'text-gold' : done ? 'text-cream/60' : 'text-cream/80'}`}>
                            {lesson.title}
                          </p>
                          {lesson.duration > 0 && (
                            <p className="text-cream/30 text-[10px] mt-0.5">{lesson.duration} min</p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </aside>

        {/* Main player */}
        <main className="flex-1 overflow-y-auto bg-navy-950">
          {!activeLesson ? (
            <div className="flex items-center justify-center h-full text-cream/40">
              Select a lesson to begin
            </div>
          ) : (
            <div className="max-w-4xl mx-auto px-4 py-6">
              {/* Video player */}
              {activeLesson.type === 'video' && embedUrl && (
                <div className="w-full aspect-video bg-black rounded-xl overflow-hidden mb-6 shadow-2xl">
                  <iframe
                    src={embedUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={activeLesson.title}
                  />
                </div>
              )}

              {activeLesson.type === 'video' && !embedUrl && (
                <div className="w-full aspect-video bg-navy-900 rounded-xl flex items-center justify-center mb-6">
                  <div className="text-center text-cream/40">
                    <Video size={40} className="mx-auto mb-2"/>
                    <p className="text-sm">No video URL set for this lesson</p>
                  </div>
                </div>
              )}

              {/* Lesson info */}
              <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {activeLesson.type === 'video'
                      ? <Video size={14} className="text-gold"/>
                      : <FileText size={14} className="text-gold"/>}
                    <span className="text-gold text-xs uppercase tracking-wider">{activeLesson.type}</span>
                    {activeLesson.duration > 0 && (
                      <span className="text-cream/40 text-xs">· {activeLesson.duration} min</span>
                    )}
                  </div>
                  <h1 className="font-display text-xl md:text-2xl text-cream">{activeLesson.title}</h1>
                </div>

                <button
                  onClick={markComplete}
                  disabled={completing || isCompleted}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0 ${
                    isCompleted
                      ? 'bg-green-900/40 text-green-400 cursor-default'
                      : 'bg-gold text-navy-900 hover:bg-gold-dark'
                  }`}
                >
                  {isCompleted
                    ? <><CheckCircle size={15}/> Completed</>
                    : completing ? 'Saving…' : <><CheckCircle size={15}/> Mark Complete</>}
                </button>
              </div>

              {activeLesson.description && (
                <p className="text-cream/70 text-sm leading-relaxed mb-6">{activeLesson.description}</p>
              )}

              {/* Text content */}
              {activeLesson.type === 'text' && activeLesson.content && (
                <div className="bg-navy-900 rounded-xl p-6 mb-6 text-cream/80 text-sm leading-relaxed whitespace-pre-wrap">
                  {activeLesson.content}
                </div>
              )}

              {/* Resources */}
              {activeLesson.resources?.length > 0 && (
                <div className="bg-navy-900 rounded-xl p-5 mb-6">
                  <h3 className="text-cream/70 text-xs uppercase tracking-widest mb-3">Resources</h3>
                  <div className="space-y-2">
                    {activeLesson.resources.map((r, i) => (
                      <a
                        key={i}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gold hover:text-gold-light text-sm transition-colors"
                      >
                        <ExternalLink size={14}/> {r.name || r.url}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between gap-4 pt-4 border-t border-navy-800">
                <button
                  onClick={() => prevLesson && selectLesson(prevLesson, modules.find(m => m.lessons.some(l => l._id === prevLesson._id))?._id)}
                  disabled={!prevLesson}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-navy-800 text-cream/70 hover:text-cream disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft size={15}/> Previous
                </button>
                <button
                  onClick={() => nextLesson && selectLesson(nextLesson, modules.find(m => m.lessons.some(l => l._id === nextLesson._id))?._id)}
                  disabled={!nextLesson}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-navy-800 text-cream/70 hover:text-cream disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Next <ArrowRight size={15}/>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Learn;
