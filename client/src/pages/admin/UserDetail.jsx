import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import StarRating from '../../components/StarRating';
import { HiOutlineArrowLeft, HiOutlineUser, HiOutlineOfficeBuilding } from 'react-icons/hi';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/users/${id}`);
        setUser(response.data.user);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 border-dashed border-2 border-surface-200 rounded-2xl max-w-md mx-auto">
        <p className="text-surface-500 font-medium">User not found.</p>
        <button onClick={() => navigate(-1)} className="btn-secondary mt-4">
          Go Back
        </button>
      </div>
    );
  }

  const roleColors = {
    admin: 'bg-violet-50 text-violet-700 border-violet-100',
    store_owner: 'bg-amber-50 text-amber-700 border-amber-100',
    user: 'bg-emerald-50 text-emerald-700 border-emerald-100'
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-surface-400 hover:text-surface-800 font-semibold text-sm transition-colors border-0 bg-transparent cursor-pointer outline-none"
      >
        <HiOutlineArrowLeft className="w-4.5 h-4.5" />
        Back to Users
      </button>

      <div className="glass-card-static p-8 border border-surface-100 relative bg-white overflow-hidden">
        {/* Header Profile Section */}
        <div className="flex items-center gap-4 pb-6 border-b border-surface-100">
          <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-700 flex items-center justify-center border border-primary-100 shadow-sm">
            <HiOutlineUser className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-surface-900 font-display tracking-tight leading-none">{user.name}</h2>
            <span className={`
              inline-flex mt-2 px-2.5 py-0.5 text-[10px] font-bold rounded-full capitalize border
              ${roleColors[user.role] || 'bg-surface-50 text-surface-600 border-surface-100'}
            `}>
              {user.role?.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* User Details Grid */}
        <div className="py-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] text-surface-400 font-semibold uppercase tracking-wider mb-1.5">Email Address</p>
              <p className="text-surface-800 text-sm font-semibold">{user.email}</p>
            </div>
            <div>
              <p className="text-[10px] text-surface-400 font-semibold uppercase tracking-wider mb-1.5">Registered Address</p>
              <p className="text-surface-800 text-sm font-medium leading-relaxed">{user.address}</p>
            </div>
          </div>

          {/* Store owner specific section */}
          {user.role === 'store_owner' && user.store && (
            <div className="mt-8 pt-8 border-t border-surface-100 space-y-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100 shadow-sm">
                  <HiOutlineOfficeBuilding className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-base font-bold text-surface-800 font-display">Assigned Store Information</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-surface-50/50 p-6 rounded-2xl border border-surface-100">
                <div>
                  <p className="text-[10px] text-surface-400 font-semibold uppercase tracking-wider mb-1">Store Name</p>
                  <p className="text-surface-800 text-sm font-semibold">{user.store.name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-surface-400 font-semibold uppercase tracking-wider mb-1">Store Email</p>
                  <p className="text-surface-800 text-sm font-medium">{user.store.email}</p>
                </div>
                <div>
                  <p className="text-[10px] text-surface-400 font-semibold uppercase tracking-wider mb-1">Store Address</p>
                  <p className="text-surface-800 text-sm font-medium leading-relaxed">{user.store.address}</p>
                </div>
                <div>
                  <p className="text-[10px] text-surface-400 font-semibold uppercase tracking-wider mb-1">Store Performance</p>
                  {user.store.averageRating ? (
                    <div className="flex items-center gap-2 mt-0.5">
                      <StarRating value={parseFloat(user.store.averageRating)} size="sm" />
                      <span className="text-surface-400 text-xs font-semibold">
                        ({user.store.totalRatings} ratings)
                      </span>
                    </div>
                  ) : (
                    <p className="text-surface-400 text-xs italic font-medium mt-1">No ratings yet</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
