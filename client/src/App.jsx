import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import LeadCapturePopup from './components/LeadCapturePopup';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import About from './pages/About';
import Methodology from './pages/Methodology';
import Contact from './pages/Contact';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import NotFound from './pages/NotFound';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCourses from './pages/admin/ManageCourses';
import ManageUsers from './pages/admin/ManageUsers';
import ManageLeads from './pages/admin/ManageLeads';
import ManageEnrollments from './pages/admin/ManageEnrollments';
import ManageLessons from './pages/admin/ManageLessons';

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Full-screen player — no Navbar/Footer */}
        <Route path="/learn/:slug" element={
          <ProtectedRoute><Learn /></ProtectedRoute>
        } />

        {/* Standard layout */}
        <Route path="/*" element={<StandardLayout />} />
      </Routes>
    </>
  );
}

function StandardLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <LeadCapturePopup />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/"             element={<Home />} />
          <Route path="/about"        element={<About />} />
          <Route path="/methodology"  element={<Methodology />} />
          <Route path="/contact"      element={<Contact />} />
          <Route path="/courses"      element={<Courses />} />
          <Route path="/courses/:slug" element={<CourseDetail />} />
          <Route path="/login"        element={<Login />} />
          <Route path="/signup"       element={<Signup />} />

          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />

          <Route path="/admin" element={
            <AdminRoute><AdminDashboard /></AdminRoute>
          } />
          <Route path="/admin/courses" element={
            <AdminRoute><ManageCourses /></AdminRoute>
          } />
          <Route path="/admin/courses/:courseId/lessons" element={
            <AdminRoute><ManageLessons /></AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute><ManageUsers /></AdminRoute>
          } />
          <Route path="/admin/leads" element={
            <AdminRoute><ManageLeads /></AdminRoute>
          } />
          <Route path="/admin/enrollments" element={
            <AdminRoute><ManageEnrollments /></AdminRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
