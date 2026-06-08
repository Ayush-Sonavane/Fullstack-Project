import { useState, useEffect } from 'react';
import api from '../../services/api';
import SearchBar from '../../components/SearchBar';
import StarRating from '../../components/StarRating';
import toast from 'react-hot-toast';
import { HiOutlineOfficeBuilding, HiOutlineLocationMarker, HiOutlineStar } from 'react-icons/hi';

const StoreListing = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [submitting, setSubmitting] = useState(null); // store id being rated

  const fetchStores = async () => {
    try {
      const params = {};
      if (filters.name) params.name = filters.name;
      if (filters.address) params.address = filters.address;

      const response = await api.get('/stores', { params });
      setStores(response.data.stores);
    } catch (error) {
      console.error('Failed to fetch stores:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(fetchStores, 400);
    return () => clearTimeout(timeout);
  }, [filters]);

  const handleRate = async (storeId, rating, existingRatingId) => {
    setSubmitting(storeId);
    try {
      if (existingRatingId) {
        // Update existing rating
        await api.put(`/ratings/${existingRatingId}`, { rating });
        toast.success('Rating updated!');
      } else {
        // Submit new rating
        await api.post('/ratings', { store_id: storeId, rating });
        toast.success('Rating submitted!');
      }
      // Refresh stores to get updated averages
      await fetchStores();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit rating';
      toast.error(message);
    } finally {
      setSubmitting(null);
    }
  };

  if (loading && stores.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold text-surface-900 font-display tracking-tight">Explore Stores</h2>
        <p className="text-surface-500 text-sm mt-1">Discover, read ratings, and leave your honest feedback</p>
      </div>

      <div className="glass-card-static p-4 border border-surface-100 bg-white">
        <SearchBar
          value={filters.name}
          onChange={(val) => setFilters((p) => ({ ...p, name: val }))}
          placeholder="Search by store name..."
        >
          <input
            type="text"
            value={filters.address}
            onChange={(e) => setFilters((p) => ({ ...p, address: e.target.value }))}
            placeholder="Filter by address..."
            className="input-field w-full sm:w-48"
          />
        </SearchBar>

        {stores.length === 0 ? (
          <div className="p-16 text-center border-dashed border-2 border-surface-200 rounded-2xl bg-surface-50/20">
            <p className="text-surface-400 text-sm font-medium">No stores match your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {stores.map((store) => {
              const avgRating = store.averageRating ? parseFloat(store.averageRating) : 0;
              const ratingPercent = (avgRating / 5) * 100;
              return (
                <div key={store.id} className="glass-card p-6 flex flex-col justify-between border border-surface-100 bg-white">
                  {/* Top Block: Info */}
                  <div>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100/50 shadow-sm">
                        <HiOutlineOfficeBuilding className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-surface-900 truncate font-display leading-tight">
                          {store.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-surface-400 font-medium">
                          <HiOutlineLocationMarker className="w-3.5 h-3.5 flex-shrink-0 text-surface-400" />
                          <span className="truncate" title={store.address}>{store.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Overall Rating Section */}
                    <div className="my-6 p-4 rounded-2xl bg-surface-50 border border-surface-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider">Overall score</span>
                        <span className="text-xs text-surface-400 font-semibold">
                          {store.totalRatings} {store.totalRatings === 1 ? 'review' : 'reviews'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <StarRating value={avgRating} size="sm" />
                      </div>

                      {/* Visual Progress Bar Accent */}
                      <div className="w-full bg-surface-200 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${ratingPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Block: Rating Submission */}
                  <div className="pt-4 border-t border-surface-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-surface-400 font-bold uppercase tracking-wider mb-1">
                        {store.userRating ? 'Your Rating' : 'Leave Rating'}
                      </p>
                      <div className="flex items-center gap-2">
                        <StarRating
                          value={store.userRating?.rating || 0}
                          onChange={(rating) => handleRate(store.id, rating, store.userRating?.id)}
                          size="md"
                        />
                      </div>
                    </div>
                    {submitting === store.id && (
                      <div className="spinner !w-5 !h-5 !border-2" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreListing;
