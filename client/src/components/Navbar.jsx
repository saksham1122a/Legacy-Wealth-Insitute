import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, LogOut, Shield, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for translucent navbar effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLink = ({ isActive }) =>
    `relative text-sm font-medium tracking-wide transition-colors py-1 ${
      isActive
        ? 'text-gold after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-px after:bg-gold'
        : 'text-cream/80 hover:text-gold'
    }`;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? 'bg-navy-950/85 backdrop-blur-md border-gold/20 shadow-navy-soft'
          : 'bg-navy-950 border-gold/10'
      }`}
    >
      <div className="container-page">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-10 h-10 bg-gradient-gold rounded-lg flex items-center justify-center font-display font-bold text-navy-900 text-xl shadow-gold-glow group-hover:scale-105 transition-transform">
              L
              <span className="absolute -inset-1 rounded-lg ring-1 ring-gold/40 group-hover:ring-gold transition-colors" aria-hidden />
            </div>
            <div className="hidden sm:block">
              <div className="font-display text-cream text-lg leading-none">Legacy Wealth</div>
              <div className="text-gold text-[10px] tracking-super-wide uppercase mt-0.5">Institute</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-9">
            <NavLink to="/" end className={navLink}>Home</NavLink>
            <NavLink to="/courses" className={navLink}>Programs</NavLink>
            <NavLink to="/methodology" className={navLink}>Methodology</NavLink>
            <NavLink to="/about" className={navLink}>About</NavLink>
            <NavLink to="/contact" className={navLink}>Contact</NavLink>
            {user && (
              <NavLink to="/dashboard" className={navLink}>Dashboard</NavLink>
            )}
            {user?.role === 'admin' && (
              <NavLink to="/admin" className={navLink}>
                <span className="flex items-center gap-1"><Shield size={14} />Admin</span>
              </NavLink>
            )}
          </nav>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <span className="text-cream/70 text-sm">Hi, {user.name.split(' ')[0]}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-cream/80 hover:text-gold text-sm transition-colors"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-cream/80 hover:text-gold text-sm font-medium transition-colors">Login</Link>
                <Link to="/signup" className="btn-gold !py-2 !px-4 text-sm">
                  Get Started <ChevronRight size={14} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-cream p-1"
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-5 space-y-1 border-t border-gold/15 pt-4 animate-fade-in">
            {[
              { to: '/', label: 'Home', end: true },
              { to: '/courses', label: 'Programs' },
              { to: '/methodology', label: 'Methodology' },
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' }
            ].map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `block py-2.5 px-2 rounded text-base transition-colors ${
                    isActive ? 'text-gold' : 'text-cream/90 hover:text-gold'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {user && (
              <NavLink to="/dashboard" className="block py-2.5 px-2 text-cream/90 hover:text-gold">Dashboard</NavLink>
            )}
            {user?.role === 'admin' && (
              <NavLink to="/admin" className="block py-2.5 px-2 text-gold">Admin Panel</NavLink>
            )}
            <div className="pt-4 border-t border-gold/15 mt-3">
              {user ? (
                <button onClick={handleLogout} className="text-cream/80 py-2 flex items-center gap-2">
                  <LogOut size={16} /> Logout
                </button>
              ) : (
                <div className="flex gap-3">
                  <Link to="/login" className="flex-1 text-center py-2.5 border border-cream/20 rounded-md text-cream/90">Login</Link>
                  <Link to="/signup" className="flex-1 btn-gold !py-2.5 !px-4 text-sm">Get Started</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
