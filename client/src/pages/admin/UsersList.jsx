import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import DataTable from '../../components/DataTable';
import SearchBar from '../../components/SearchBar';
import { HiOutlinePlus } from 'react-icons/hi';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', role: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.name) params.name = filters.name;
      if (filters.email) params.email = filters.email;
      if (filters.role) params.role = filters.role;

      const response = await api.get('/users', { params });
      setUsers(response.data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch on filter change with debounce
  useEffect(() => {
    const timeout = setTimeout(fetchUsers, 400);
    return () => clearTimeout(timeout);
  }, [filters]);

  const columns = [
    { 
      key: 'name', 
      label: 'Name', 
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center font-bold text-xs uppercase border border-primary-100">
            {val[0]}
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
    { key: 'role', label: 'Role', sortable: true,
      render: (val) => {
        const roleStyles = {
          admin: 'bg-violet-50 text-violet-700 border-violet-100',
          store_owner: 'bg-amber-50 text-amber-700 border-amber-100',
          user: 'bg-emerald-50 text-emerald-700 border-emerald-100'
        };
        return (
          <span className={`
            inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold rounded-full capitalize border
            ${roleStyles[val] || 'bg-surface-50 text-surface-600 border-surface-100'}
          `}>
            {val?.replace('_', ' ')}
          </span>
        );
      },
    },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-surface-900 font-display tracking-tight">Users</h2>
          <p className="text-surface-500 text-sm mt-1">Manage user, admin, and store owner registrations</p>
        </div>
        <button
          onClick={() => navigate('/admin/users/new')}
          className="btn-primary flex items-center gap-2 self-start sm:self-center"
        >
          <HiOutlinePlus className="w-4.5 h-4.5" />
          Add User
        </button>
      </div>

      <div className="glass-card-static p-4 border border-surface-100 bg-white">
        <SearchBar
          value={filters.name}
          onChange={(val) => setFilters((p) => ({ ...p, name: val }))}
          placeholder="Search by name..."
        >
          <input
            type="text"
            value={filters.email}
            onChange={(e) => setFilters((p) => ({ ...p, email: e.target.value }))}
            placeholder="Filter by email..."
            className="input-field w-full sm:w-48"
          />
          <select
            value={filters.role}
            onChange={(e) => setFilters((p) => ({ ...p, role: e.target.value }))}
            className="input-field w-full sm:w-40"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="store_owner">Store Owner</option>
          </select>
        </SearchBar>

        {loading && users.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="spinner" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={users}
            onRowClick={(user) => navigate(`/admin/users/${user.id}`)}
            emptyMessage="No users found matching your filters."
          />
        )}
      </div>
    </div>
  );
};

export default UsersList;
