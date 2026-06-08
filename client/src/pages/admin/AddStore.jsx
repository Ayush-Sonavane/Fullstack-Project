import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateName, validateEmail, validatePassword, validateAddress } from '../../utils/validators';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft, HiOutlineOfficeBuilding, HiOutlineUser } from 'react-icons/hi';

const AddStore = () => {
  const [formData, setFormData] = useState({
    // Store details
    name: '', email: '', address: '',
    // Owner details
    ownerName: '', ownerEmail: '', ownerPassword: '', ownerAddress: '',
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

    // Validate all fields
    const newErrors = {};

    // Store validations
    if (!formData.name.trim()) newErrors.name = 'Store name is required';
    if (formData.name.length > 60) newErrors.name = 'Store name must not exceed 60 characters';
    const storeEmailErr = validateEmail(formData.email);
    if (storeEmailErr) newErrors.email = storeEmailErr;
    const storeAddrErr = validateAddress(formData.address);
    if (storeAddrErr) newErrors.address = storeAddrErr;

    // Owner validations
    const ownerNameErr = validateName(formData.ownerName);
    if (ownerNameErr) newErrors.ownerName = ownerNameErr;
    const ownerEmailErr = validateEmail(formData.ownerEmail);
    if (ownerEmailErr) newErrors.ownerEmail = ownerEmailErr;
    const ownerPassErr = validatePassword(formData.ownerPassword);
    if (ownerPassErr) newErrors.ownerPassword = ownerPassErr;
    const ownerAddrErr = validateAddress(formData.ownerAddress);
    if (ownerAddrErr) newErrors.ownerAddress = ownerAddrErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await api.post('/stores', formData);
      toast.success('Store and owner created successfully!');
      navigate('/admin/stores');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create store';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-surface-400 hover:text-surface-800 font-semibold text-sm transition-colors border-0 bg-transparent cursor-pointer outline-none"
      >
        <HiOutlineArrowLeft className="w-4.5 h-4.5" />
        Back
      </button>

      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center border border-primary-100 shadow-sm">
          <HiOutlineOfficeBuilding className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold text-surface-900 font-display tracking-tight">Add New Store</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ─── Store Details ─── */}
        <div className="glass-card-static p-8 border border-surface-100 bg-white space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-surface-100">
            <HiOutlineOfficeBuilding className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-bold text-surface-900 font-display">Store Information</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="store-name" className="label">Store Name</label>
              <input id="store-name" name="name" type="text" value={formData.name}
                onChange={handleChange} className={`input-field ${errors.name ? 'input-error' : ''}`}
                placeholder="Name of the physical store location (max 60 chars)" />
              {errors.name && <p className="error-text">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="store-email" className="label">Store Contact Email</label>
              <input id="store-email" name="email" type="email" value={formData.email}
                onChange={handleChange} className={`input-field ${errors.email ? 'input-error' : ''}`}
                placeholder="store@example.com" />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="store-address" className="label">Store Physical Address</label>
              <textarea id="store-address" name="address" value={formData.address}
                onChange={handleChange} rows={2}
                className={`input-field resize-none ${errors.address ? 'input-error' : ''}`}
                placeholder="Full address details (max 400 chars)" />
              {errors.address && <p className="error-text">{errors.address}</p>}
            </div>
          </div>
        </div>

        {/* ─── Owner Details ─── */}
        <div className="glass-card-static p-8 border border-surface-100 bg-white space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-surface-100">
            <HiOutlineUser className="w-5 h-5 text-amber-700" />
            <h3 className="text-lg font-bold text-surface-900 font-display">Store Owner Account Details</h3>
          </div>
          <p className="text-surface-500 text-xs font-semibold bg-amber-50/50 border border-amber-100 p-3.5 rounded-xl">
            Note: An owner login profile will automatically be generated using these credentials. They can manage the store dashboard upon logging in.
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="owner-name" className="label">Owner Full Name</label>
              <input id="owner-name" name="ownerName" type="text" value={formData.ownerName}
                onChange={handleChange} className={`input-field ${errors.ownerName ? 'input-error' : ''}`}
                placeholder="Full name of the designated owner" />
              <div className="flex justify-between items-center mt-1">
                {errors.ownerName ? (
                  <p className="error-text !mt-0">{errors.ownerName}</p>
                ) : (
                  <div />
                )}
                <span className={`text-[10px] font-bold ${formData.ownerName.length < 20 || formData.ownerName.length > 60 ? 'text-warning' : 'text-success'}`}>
                  {formData.ownerName.length}/60
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="owner-email" className="label">Owner Email Address</label>
              <input id="owner-email" name="ownerEmail" type="email" value={formData.ownerEmail}
                onChange={handleChange} className={`input-field ${errors.ownerEmail ? 'input-error' : ''}`}
                placeholder="owner@example.com" />
              {errors.ownerEmail && <p className="error-text">{errors.ownerEmail}</p>}
            </div>

            <div>
              <label htmlFor="owner-password" className="label">Owner Access Password</label>
              <input id="owner-password" name="ownerPassword" type="password" value={formData.ownerPassword}
                onChange={handleChange} className={`input-field ${errors.ownerPassword ? 'input-error' : ''}`}
                placeholder="Choose a strong password (8–16 chars, 1 uppercase, 1 special)" />
              {errors.ownerPassword && <p className="error-text">{errors.ownerPassword}</p>}
            </div>

            <div>
              <label htmlFor="owner-address" className="label">Owner Address</label>
              <textarea id="owner-address" name="ownerAddress" value={formData.ownerAddress}
                onChange={handleChange} rows={2}
                className={`input-field resize-none ${errors.ownerAddress ? 'input-error' : ''}`}
                placeholder="Mailing address of the store owner" />
              {errors.ownerAddress && <p className="error-text">{errors.ownerAddress}</p>}
            </div>
          </div>
        </div>

        {/* ─── Actions ─── */}
        <div className="flex gap-4 pt-4 border-t border-surface-100">
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? <div className="spinner !w-4 !h-4 !border-2" /> : null}
            {loading ? 'Creating...' : 'Create Store & Owner'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStore;
