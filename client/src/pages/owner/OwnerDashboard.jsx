import { useState, useEffect } from 'react';
import api from '../../services/api';
import StarRating from '../../components/StarRating';
import DataTable from '../../components/DataTable';
import { HiOutlineStar, HiOutlineUsers, HiOutlineOfficeBuilding } from 'react-icons/hi';

const OwnerDashboard = () => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/stores/owner/dashboard');
        setStore(response.data.store);
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const raterColumns = [
    { 
      key: 'name', 
      label: 'User Name', 
      sortable: true,
      render: (val) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs uppercase border border-emerald-100 shadow-sm">
            {val[0]}
          </div>
          <span className="font-semibold text-surface-900">{val}</span>
        </div>
      )
    },
    { key: 'email', label: 'Email Address', sortable: true },
    { key: 'rating', label: 'Score Left', sortable: true,
      render: (val) => <StarRating value={val} size="sm" />,
    },
    { key: 'ratedAt', label: 'Rating Date', sortable: true,
      render: (val) => (
        <span className="text-surface-500 font-medium text-xs">
          {new Date(val).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
          })}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="spinner" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="text-center py-20 border-dashed border-2 border-surface-200 rounded-2xl max-w-md mx-auto">
        <HiOutlineOfficeBuilding className="w-12 h-12 text-surface-400 mx-auto mb-4" />
        <p className="text-surface-500 font-semibold">No store found for your account.</p>
        <p className="text-surface-400 text-sm mt-1">Please contact a system administrator.</p>
      </div>
    );
  }

  const avgRating = store.averageRating ? parseFloat(store.averageRating) : 0;
  const ratingPercent = (avgRating / 5) * 100;

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-surface-900 font-display tracking-tight">{store.name}</h2>
        <p className="text-surface-500 text-sm mt-1">Overview, metrics, and customer rating history log</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 stagger-children">
        <div className="stat-card border border-surface-100 relative bg-white">
          <div className="stat-card-glow bg-amber-500" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-surface-400 text-xs font-semibold uppercase tracking-wider">Average Rating</p>
              <div className="flex items-baseline gap-2.5 mt-2.5">
                <p className="text-4xl font-extrabold text-surface-900 font-display tracking-tight">
                  {store.averageRating || '0.0'}
                </p>
                <span className="text-xs text-surface-400 font-semibold">/ 5.0</span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 shadow-sm">
              <HiOutlineStar className="w-7 h-7" />
            </div>
          </div>
          <div className="mt-6">
            <StarRating value={avgRating} size="md" />
            {/* Progress Bar Visual */}
            <div className="w-full bg-surface-100 h-1.5 rounded-full mt-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${ratingPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="stat-card border border-surface-100 relative bg-white">
          <div className="stat-card-glow bg-blue-500" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-surface-400 text-xs font-semibold uppercase tracking-wider">Total Feedback Logs</p>
              <p className="text-4xl font-extrabold text-surface-900 mt-2.5 font-display tracking-tight">
                {store.totalRatings}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 shadow-sm">
              <HiOutlineUsers className="w-7 h-7" />
            </div>
          </div>
          <p className="mt-8 text-xs text-surface-400 font-medium pt-3.5 border-t border-surface-100">
            Total verified ratings submitted by users
          </p>
        </div>
      </div>

      {/* Raters Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-surface-800 font-display tracking-tight">Ratings Log</h3>
        <div className="glass-card-static p-4 border border-surface-100 bg-white">
          <DataTable
            columns={raterColumns}
            data={store.raters}
            emptyMessage="No ratings yet. Encourage customers to leave ratings on the platform!"
          />
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
