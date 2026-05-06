import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Circle, ChevronDown, ChevronRight, ArrowLeft, ArrowRight, FileText, Video, File, ExternalLink, Lock, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const getEmbedUrl = (url) => {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return url;
};

const getPdfEmbedUrl = (url) => {
  if (!url) return null;
  // Google Drive file link → preview embed
  const driveFile = url.match(/drive\.google\.com\/file\/d\/([^/?\s]+)/);
  if (driveFile) return `https://drive.google.com/file/d/${driveFile[1]}/preview`;
  // Google Drive open?id= link
  const driveOpen = url.match(/drive\.google\.com\/open\?id=([^&\s]+)/);
  if (driveOpen) return `https://drive.google.com/file/d/${driveOpen[1]}/preview`;
  // Direct .pdf URL → Google Docs viewer
  if (/\.pdf(\?|$)/i.test(url)) return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  // Dropbox → swap to streaming URL then Google Docs viewer
  if (url.includes('dropbox.com')) {
    const direct = url.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace(/[?&]dl=0/, '');
    return `https://docs.google.com/viewer?url=${encodeURIComponent(direct)}&embedded=true`;
  }
  return url;
};

// ── Access-denied screen ─────────────────────────────────────────────────────
const AccessDenied = ({ status }) => {
  const messages = {
    pending:  { title: 'Enrollment Pending', body: 'Your enrollment is waiting for admin approval. Once approved, you will get full access.', icon: <Clock size={40} className="text-yellow-400 mx-auto mb-4"/> },
    rejected: { title: 'Enrollment Rejected', body: 'Your enrollment was not approved. Please contact support for more information.', icon: <Lock size={40} className="text-red-400 mx-auto mb-4"/> },
    default:  { title: 'Access Required', body: 'You need an active enrollment to access this course. Please enroll first.', icon: <Lock size={40} className="text-gold mx-auto mb-4"/> }
  };
  const m = messages[status] || messages.default;
  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-6">
      <div className="bg-navy-900 rounded-2xl p-10 max-w-md w-full text-center border border-gold/20">
        {m.icon}
        <h2 className="font-display text-2xl text-cream mb-3">{m.title}</h2>
        <p className="text-cream/60 text-sm mb-6">{m.body}</p>
        <Link to="/dashboard" className="btn-gold inline-flex">← Back to Dashboard</Link>
      </div>
    </div>
  );
};

// ── Main component ───────────────────────────────────────────────────────────
const Learn = () => {
  const { slug } = useParams();

  const [courseData, setCourseData]   = useState(null);
  const [enrollment, setEnrollment]   = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [openModules, setOpenModules] = useState({});
  const [loading, setLoading]         = useState(true);
  const [completing, setCompleting]   = useState(false);
  const [accessError, setAccessError] = useState(null); // 'pending' | 'rejected' | 'denied'

  const allLessons      = courseData?.modules?.flatMap(m => m.lessons) ?? [];
  const activeLessonIdx = allLessons.findIndex(l => l._id === activeLesson?._id);
  const prevLesson      = activeLessonIdx > 0 ? allLessons[activeLessonIdx - 1] : null;
  const nextLesson      = activeLessonIdx < allLessons.length - 1 ? allLessons[activeLessonIdx + 1] : null;
  const completedIds    = new Set((enrollment?.completedLessons || []).map(id => id?.toString?.() ?? id));

  const load = useCallback(async () => {
    setLoading(true);
    setAccessError(null);
    try {
      // Fetch course+lessons first — backend checks active enrollment
      const courseRes = await api.get(`/courses/${slug}/learn`);
      const data = courseRes.data;
      setCourseData(data);

      // Fetch enrollment for progress data
      const enrollRes = await api.get('/enrollments/me');
      const myEnrollment = enrollRes.data.enrollments.find(
        e => e.course?._id === data.course._id || e.course?.slug === slug
      );
      setEnrollment(myEnrollment ?? null);

      // Open first module; resume from last lesson
      if (data.modules?.length > 0) {
        setOpenModules({ [data.modules[0]._id]: true });
        const lastLessonId  = myEnrollment?.lastLesson?._id ?? myEnrollment?.lastLesson;
        const resumeLesson  = lastLessonId
          ? data.modules.flatMap(m => m.lessons).find(l => l._id === lastLessonId)
          : null;
        const start = resumeLesson ?? data.modules.flatMap(m => m.lessons)[0] ?? null;
        setActiveLesson(start);
      }
    } catch (err) {
      const status  = err.response?.status;
      const message = err.response?.data?.message || '';

      if (status === 403) {
        // Map backend message to UI state
        if (message.toLowerCase().includes('pending')) setAccessError('pending');
        else if (message.toLowerCase().includes('reject')) setAccessError('rejected');
        else setAccessError('denied');
      } else if (status === 404) {
        setAccessError('denied');
      } else {
        toast.error(message || 'Failed to load course');
        setAccessError('denied');
      }
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => { load(); }, [load]);

  const selectLesson = (lesson, moduleId) => {
    setActiveLesson(lesson);
    setOpenModules(prev => ({ ...prev, [moduleId]: true }));
  };

  const toggleModule = (moduleId) =>
    setOpenModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));

  const findModuleId = (lesson) =>
    courseData?.modules?.find(m => m.lessons.some(l => l._id === lesson._id))?._id;

  const markComplete = async () => {
    if (!enrollment || !activeLesson) return;
    setCompleting(true);
    try {
      const { data } = await api.post(`/enrollments/${enrollment._id}/complete-lesson`, { lessonId: activeLesson._id });
      setEnrollment(prev => ({
        ...prev,
        completedLessons: data.enrollment.completedLessons,
        progressPercent:  data.enrollment.progressPercent,
        lastLesson:       data.enrollment.lastLesson
      }));
      toast.success('Lesson complete!');
      if (nextLesson) {
        setTimeout(() => selectLesson(nextLesson, findModuleId(nextLesson)), 500);
      }
    } catch {
      toast.error('Could not save progress');
    } finally {
      setCompleting(false);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-navy-950">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-3"/>
        <p className="text-cream/60 text-sm">Loading course…</p>
      </div>
    </div>
  );

  // ── Access denied ────────────────────────────────────────────────────────
  if (accessError) return <AccessDenied status={accessError} />;

  if (!courseData) return null;

  const { course, modules } = courseData;
  const isCompleted = activeLesson && completedIds.has(activeLesson._id);
  const embedUrl    = activeLesson?.videoUrl ? getEmbedUrl(activeLesson.videoUrl) : null;
  const progress    = enrollment?.progressPercent ?? 0;

  return (
    <div className="min-h-screen flex flex-col bg-navy-950">
      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <div className="bg-navy-900 border-b border-gold/20 px-4 py-3 flex items-center gap-4 sticky top-0 z-40">
        <Link to="/dashboard" className="text-cream/60 hover:text-gold flex items-center gap-1 text-sm flex-shrink-0">
          <ArrowLeft size={15}/> Dashboard
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-cream font-display text-sm md:text-base truncate">{course.title}</p>
        </div>
        <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
          <span className="text-cream/50 text-xs">{progress}% complete</span>
          <div className="w-28 h-1.5 bg-navy-700 rounded-full">
            <div className="h-1.5 bg-gold rounded-full transition-all duration-500" style={{ width: `${progress}%` }}/>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 57px)' }}>

        {/* Sidebar */}
        <aside className="w-72 flex-shrink-0 bg-navy-900 border-r border-gold/10 overflow-y-auto hidden md:block">
          <div className="px-4 py-3 border-b border-gold/10">
            <p className="text-xs uppercase tracking-widest text-gold/60">Course Content</p>
            <p className="text-cream/40 text-xs mt-0.5">
              {completedIds.size}/{allLessons.length} lessons · {progress}% done
            </p>
          </div>

          {modules.map(mod => (
            <div key={mod._id} className="border-b border-navy-800">
              <button
                onClick={() => toggleModule(mod._id)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-navy-800 transition-colors gap-2"
              >
                <span className="text-cream/90 text-sm font-medium leading-snug">{mod.title}</span>
                {openModules[mod._id] ? <ChevronDown size={15} className="text-cream/30 flex-shrink-0"/> : <ChevronRight size={15} className="text-cream/30 flex-shrink-0"/>}
              </button>

              {openModules[mod._id] && (
                <div className="bg-navy-950/60">
                  {mod.lessons.length === 0
                    ? <p className="text-cream/20 text-xs px-6 py-3">No lessons yet</p>
                    : mod.lessons.map(lesson => {
                        const done      = completedIds.has(lesson._id);
                        const isCurrent = activeLesson?._id === lesson._id;
                        return (
                          <button
                            key={lesson._id}
                            onClick={() => selectLesson(lesson, mod._id)}
                            className={`w-full flex items-start gap-3 px-5 py-2.5 text-left border-l-2 transition-colors ${
                              isCurrent ? 'bg-gold/10 border-gold' : 'hover:bg-navy-800 border-transparent'
                            }`}
                          >
                            <span className="mt-0.5 flex-shrink-0">
                              {done
                                ? <CheckCircle size={14} className="text-green-400"/>
                                : <Circle size={14} className="text-cream/25"/>}
                            </span>
                            <div className="min-w-0">
                              <p className={`text-xs leading-snug ${isCurrent ? 'text-gold' : done ? 'text-cream/50' : 'text-cream/75'}`}>
                                {lesson.title}
                              </p>
                              {lesson.duration > 0 && (
                                <p className="text-cream/25 text-[10px] mt-0.5">{lesson.duration} min</p>
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

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {!activeLesson ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <Video size={40} className="text-gold/40 mb-4"/>
              <p className="text-cream/40">
                {allLessons.length === 0
                  ? 'No lessons have been added to this course yet.'
                  : 'Select a lesson from the sidebar to begin.'}
              </p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto px-4 py-6">

              {/* Video */}
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
                <div className="w-full aspect-video bg-navy-900 rounded-xl flex items-center justify-center mb-6 border border-navy-700">
                  <div className="text-center text-cream/30">
                    <Video size={36} className="mx-auto mb-2"/>
                    <p className="text-sm">Video URL not set for this lesson</p>
                  </div>
                </div>
              )}

              {/* PDF */}
              {activeLesson.type === 'pdf' && (
                activeLesson.videoUrl ? (
                  <div className="mb-6">
                    {/* Primary: always-visible open card */}
                    <div className="bg-navy-900 border border-navy-700 rounded-xl p-8 flex flex-col sm:flex-row items-center gap-5 mb-4">
                      <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <File size={28} className="text-red-400"/>
                      </div>
                      <div className="flex-1 min-w-0 text-center sm:text-left">
                        <p className="text-cream font-medium">{activeLesson.title}</p>
                        <p className="text-cream/40 text-sm mt-0.5">PDF Document</p>
                      </div>
                      <a
                        href={activeLesson.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-gold flex items-center gap-2 flex-shrink-0"
                      >
                        <ExternalLink size={14}/> Open PDF
                      </a>
                    </div>
                    {/* Inline embed — works for publicly shared files */}
                    <div className="w-full rounded-xl overflow-hidden border border-navy-700 bg-navy-900" style={{ height: '640px' }}>
                      <iframe
                        src={getPdfEmbedUrl(activeLesson.videoUrl)}
                        className="w-full h-full"
                        title={activeLesson.title}
                        allow="fullscreen"
                      />
                    </div>
                    <p className="text-cream/30 text-xs mt-2">
                      If the preview shows an error, click <strong className="text-cream/50">Open PDF</strong> above. For Google Drive files, make sure sharing is set to <em>"Anyone with the link"</em>.
                    </p>
                  </div>
                ) : (
                  <div className="w-full bg-navy-900 rounded-xl flex items-center justify-center mb-6 border border-navy-700" style={{ height: '160px' }}>
                    <div className="text-center text-cream/30">
                      <File size={36} className="mx-auto mb-2"/>
                      <p className="text-sm">No PDF URL set for this lesson</p>
                    </div>
                  </div>
                )
              )}

              {/* Lesson header */}
              <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {activeLesson.type === 'video'
                      ? <Video size={13} className="text-gold"/>
                      : <FileText size={13} className="text-gold"/>}
                    <span className="text-gold text-xs uppercase tracking-wider">{activeLesson.type}</span>
                    {activeLesson.duration > 0 && (
                      <span className="text-cream/30 text-xs">· {activeLesson.duration} min</span>
                    )}
                  </div>
                  <h1 className="font-display text-xl md:text-2xl text-cream">{activeLesson.title}</h1>
                </div>

                <button
                  onClick={markComplete}
                  disabled={completing || isCompleted || !enrollment}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0 ${
                    isCompleted
                      ? 'bg-green-900/40 text-green-400 cursor-default border border-green-700/30'
                      : 'bg-gold text-navy-900 hover:bg-gold-dark disabled:opacity-50'
                  }`}
                >
                  <CheckCircle size={15}/>
                  {isCompleted ? 'Completed' : completing ? 'Saving…' : 'Mark Complete'}
                </button>
              </div>

              {activeLesson.description && (
                <p className="text-cream/60 text-sm leading-relaxed mb-6">{activeLesson.description}</p>
              )}

              {/* Text content */}
              {activeLesson.type === 'text' && activeLesson.content && (
                <div className="bg-navy-900 rounded-xl p-6 mb-6 text-cream/80 text-sm leading-relaxed whitespace-pre-wrap border border-navy-700">
                  {activeLesson.content}
                </div>
              )}

              {/* Resources */}
              {activeLesson.resources?.length > 0 && (
                <div className="bg-navy-900 rounded-xl p-5 mb-6 border border-navy-700">
                  <h3 className="text-cream/50 text-xs uppercase tracking-widest mb-3">Resources</h3>
                  <div className="space-y-2">
                    {activeLesson.resources.map((r, i) => (
                      <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gold hover:text-gold-light text-sm transition-colors">
                        <ExternalLink size={13}/> {r.name || r.url}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Prev / Next */}
              <div className="flex justify-between gap-4 pt-4 border-t border-navy-800 mt-2">
                <button
                  onClick={() => prevLesson && selectLesson(prevLesson, findModuleId(prevLesson))}
                  disabled={!prevLesson}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-navy-800 text-cream/60 hover:text-cream disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft size={14}/> Previous
                </button>
                <button
                  onClick={() => nextLesson && selectLesson(nextLesson, findModuleId(nextLesson))}
                  disabled={!nextLesson}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-navy-800 text-cream/60 hover:text-cream disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                >
                  Next <ArrowRight size={14}/>
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
