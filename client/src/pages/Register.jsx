import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateName, validateEmail, validatePassword, validateAddress } from '../utils/validators';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', address: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    const nameErr = validateName(formData.name);
    const emailErr = validateEmail(formData.email);
    const passErr = validatePassword(formData.password);
    const addrErr = validateAddress(formData.address);

    if (nameErr) newErrors.name = nameErr;
    if (emailErr) newErrors.email = emailErr;
    if (passErr) newErrors.password = passErr;
    if (addrErr) newErrors.address = addrErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      toast.success('Registration successful!');
      navigate('/stores');
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      const serverErrors = error.response?.data?.errors;
      if (serverErrors) {
        const mapped = {};
        serverErrors.forEach((err) => {
          mapped[err.path] = err.msg;
        });
        setErrors(mapped);
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-surface-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-100/30 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-100/20 rounded-full filter blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-fade-in relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold font-display text-lg shadow-md shadow-primary-500/20">
              S
            </span>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent font-display tracking-tight">
              StoreRate
            </h1>
          </div>
          <p className="text-surface-500 text-sm font-medium">Create your user account</p>
        </div>

        {/* Register Card */}
        <div className="glass-card bg-white/95 backdrop-blur-md" style={{ padding: '2.5rem' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="label">
                Full Name
                <span className="text-surface-400 font-normal ml-1">(20–60 characters)</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`input-field ${errors.name ? 'input-error' : ''}`}
                placeholder="Enter your full name"
              />
              <div className="flex justify-between items-center mt-1">
                {errors.name ? (
                  <p className="error-text !mt-0">{errors.name}</p>
                ) : (
                  <div />
                )}
                <span className={`text-[10px] font-bold ${formData.name.length < 20 || formData.name.length > 60 ? 'text-warning' : 'text-success'}`}>
                  {formData.name.length}/60
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="label">Email Address</label>
              <input
                id="reg-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`input-field ${errors.email ? 'input-error' : ''}`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="reg-password" className="label">
                Password
                <span className="text-surface-400 font-normal ml-1">(8–16 chars, 1 uppercase, 1 special)</span>
              </label>
              <input
                id="reg-password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`input-field ${errors.password ? 'input-error' : ''}`}
                placeholder="••••••••"
              />
              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="address" className="label">
                Address
                <span className="text-surface-400 font-normal ml-1">(max 400 characters)</span>
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className={`input-field resize-none ${errors.address ? 'input-error' : ''}`}
                placeholder="Enter your street address"
              />
              {errors.address && <p className="error-text">{errors.address}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <div className="spinner !w-4 !h-4 !border-2" /> : null}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-surface-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold no-underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
