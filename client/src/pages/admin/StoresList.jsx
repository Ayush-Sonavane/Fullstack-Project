import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import DataTable from '../../components/DataTable';
import SearchBar from '../../components/SearchBar';
import StarRating from '../../components/StarRating';
import { HiOutlinePlus as PlusIcon, HiOutlineOfficeBuilding as StoreIcon } from 'react-icons/hi';

const StoresList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const navigate = useNavigate();

  const fetchStores = async () => {
    try {
      setLoading(true);
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

  const columns = [
    { 
      key: 'name', 
      label: 'Store Name', 
      sortable: true,
      render: (val) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100 shadow-sm">
            <StoreIcon className="w-4.5 h-4.5" />
          </div>
          <span className="font-semibold text-surface-900">{val}</span>
        </div>
      )
    },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true,
      render: (val) => (
        <span className="truncate max-w-[200px] block text-surface-500 text-xs font-medium" title={val}>{val}</span>
      ),
    },
    { key: 'averageRating', label: 'Rating', sortable: true,
      render: (val) => val ? (
        <div className="py-1">
          <StarRating value={parseFloat(val)} size="sm" />
        </div>
      ) : (
        <span className="text-surface-400 text-xs italic font-medium">No ratings yet</span>
      ),
    },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-surface-900 font-display tracking-tight">Stores</h2>
          <p className="text-surface-500 text-sm mt-1">Manage and audit registered stores and ratings</p>
        </div>
        <button
          onClick={() => navigate('/admin/stores/new')}
          className="btn-primary flex items-center gap-2 self-start sm:self-center"
        >
          <PlusIcon className="w-4.5 h-4.5" />
          Add Store
        </button>
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

        {loading && stores.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="spinner" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={stores}
            emptyMessage="No stores found."
          />
        )}
      </div>
    </div>
  );
};

export default StoresList;
