import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-cream px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-navy mb-2">Create your account</h1>
          <p className="text-ink/60">Join the institute. Trade with logic.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-navy-100 p-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">Full Name</label>
            <input
              required
              type="text"
              className="input-field"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">Email</label>
            <input
              required
              type="email"
              className="input-field"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">Mobile</label>
            <input
              required
              type="tel"
              pattern="[6-9][0-9]{9}"
              maxLength={10}
              className="input-field"
              value={form.phone}
              onChange={e => setForm({...form, phone: e.target.value})}
              placeholder="10-digit Indian mobile"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">Password</label>
            <input
              required
              type="password"
              minLength={8}
              className="input-field"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              placeholder="Minimum 8 characters"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-gold w-full !py-3.5">
            {loading ? 'Creating…' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-ink/60 pt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-gold-dark hover:underline font-medium">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
