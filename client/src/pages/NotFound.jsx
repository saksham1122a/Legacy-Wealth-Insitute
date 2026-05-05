import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-[70vh] flex items-center justify-center bg-cream px-4">
    <div className="text-center">
      <div className="font-display text-9xl text-navy/10 mb-2">404</div>
      <h1 className="font-display text-3xl text-navy mb-3">Page not found</h1>
      <p className="text-ink/60 mb-6 max-w-sm mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-gold">Back to Home</Link>
    </div>
  </div>
);

export default NotFound;
