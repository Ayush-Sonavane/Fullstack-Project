import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateName, validateEmail, validatePassword, validateAddress } from '../../utils/validators';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft, HiOutlineUser } from 'react-icons/hi';

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', address: '', role: 'user',
  });
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
      await api.post('/users', formData);
      toast.success(`${formData.role.replace('_', ' ')} created successfully!`);
      navigate('/admin/users');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create user';
      toast.error(message);

      const serverErrors = error.response?.data?.errors;
      if (serverErrors) {
        const mapped = {};
        serverErrors.forEach((err) => { mapped[err.path] = err.msg; });
        setErrors(mapped);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto animate-fade-in space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-surface-400 hover:text-surface-800 font-semibold text-sm transition-colors border-0 bg-transparent cursor-pointer outline-none"
      >
        <HiOutlineArrowLeft className="w-4.5 h-4.5" />
        Back to Users
      </button>

      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center border border-primary-100 shadow-sm">
          <HiOutlineUser className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold text-surface-900 font-display tracking-tight">Add New User</h2>
      </div>

      <div className="glass-card-static p-8 border border-surface-100 bg-white">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="add-name" className="label">Full Name</label>
            <input 
              id="add-name" 
              name="name" 
              type="text" 
              value={formData.name}
              onChange={handleChange} 
              className={`input-field ${errors.name ? 'input-error' : ''}`}
              placeholder="Enter full name (20–60 characters)" 
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
            <label htmlFor="add-email" className="label">Email Address</label>
            <input 
              id="add-email" 
              name="email" 
              type="email" 
              value={formData.email}
              onChange={handleChange} 
              className={`input-field ${errors.email ? 'input-error' : ''}`}
              placeholder="user@example.com" 
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="add-password" className="label">Password</label>
            <input 
              id="add-password" 
              name="password" 
              type="password" 
              value={formData.password}
              onChange={handleChange} 
              className={`input-field ${errors.password ? 'input-error' : ''}`}
              placeholder="8–16 chars, 1 uppercase, 1 special symbol" 
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="add-address" className="label">Home Address</label>
            <textarea 
              id="add-address" 
              name="address" 
              value={formData.address}
              onChange={handleChange} 
              rows={2}
              className={`input-field resize-none ${errors.address ? 'input-error' : ''}`}
              placeholder="Full mailing address (max 400 characters)" 
            />
            {errors.address && <p className="error-text">{errors.address}</p>}
          </div>

          <div>
            <label htmlFor="add-role" className="label">System Role</label>
            <select 
              id="add-role" 
              name="role" 
              value={formData.role}
              onChange={handleChange} 
              className="input-field cursor-pointer"
            >
              <option value="user">Normal User</option>
              <option value="admin">Administrator</option>
              <option value="store_owner">Store Owner</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4 border-t border-surface-100">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? <div className="spinner !w-4 !h-4 !border-2" /> : null}
              {loading ? 'Creating...' : 'Create User'}
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

export default AddUser;
