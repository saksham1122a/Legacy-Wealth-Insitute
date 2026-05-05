import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}`);
      navigate(user.role === 'admin' ? '/admin' : from);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-cream px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-navy mb-2">Welcome back</h1>
          <p className="text-ink/60">Login to continue your learning journey</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-navy-100 p-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">Email</label>
            <input
              required
              type="email"
              className="input-field"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">Password</label>
            <input
              required
              type="password"
              className="input-field"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-gold w-full !py-3.5">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>

          <p className="text-center text-sm text-ink/60 pt-2">
            Don't have an account?{' '}
            <Link to="/signup" className="text-gold-dark hover:underline font-medium">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
