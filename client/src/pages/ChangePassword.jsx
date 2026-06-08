import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validatePassword } from '../utils/validators';
import api from '../services/api';
import toast from 'react-hot-toast';
import { HiOutlineKey, HiOutlineArrowLeft } from 'react-icons/hi';

const ChangePassword = () => {
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.currentPassword) newErrors.currentPassword = 'Current password is required';
    const passErr = validatePassword(formData.newPassword);
    if (passErr) newErrors.newPassword = passErr;
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await api.put('/users/password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      toast.success('Password updated successfully!');
      navigate(-1);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update password';
      toast.error(message);
      if (message.includes('Current password')) {
        setErrors({ currentPassword: message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto animate-fade-in space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-surface-400 hover:text-surface-800 font-semibold text-sm transition-colors border-0 bg-transparent cursor-pointer outline-none"
      >
        <HiOutlineArrowLeft className="w-4.5 h-4.5" />
        Back
      </button>

      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center border border-primary-100 shadow-sm">
          <HiOutlineKey className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold text-surface-900 font-display tracking-tight">Change Password</h2>
      </div>

      <div className="glass-card-static p-8 border border-surface-100 bg-white">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="currentPassword" className="label">Current Password</label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
              className={`input-field ${errors.currentPassword ? 'input-error' : ''}`}
              placeholder="••••••••"
            />
            {errors.currentPassword && <p className="error-text">{errors.currentPassword}</p>}
          </div>

          <div>
            <label htmlFor="newPassword" className="label">
              New Password
              <span className="text-surface-400 font-normal ml-1">(8–16 chars, 1 uppercase, 1 special)</span>
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              className={`input-field ${errors.newPassword ? 'input-error' : ''}`}
              placeholder="••••••••"
            />
            {errors.newPassword && <p className="error-text">{errors.newPassword}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="label">Confirm New Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`input-field ${errors.confirmPassword ? 'input-error' : ''}`}
              placeholder="••••••••"
            />
            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
          </div>

          <div className="flex gap-3 pt-4 border-t border-surface-100">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? <div className="spinner !w-4 !h-4 !border-2" /> : null}
              {loading ? 'Updating...' : 'Update Password'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
