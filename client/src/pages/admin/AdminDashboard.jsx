import { useState, useEffect } from 'react';
import { HiOutlineUsers, HiOutlineOfficeBuilding, HiOutlineStar } from 'react-icons/hi';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/users/dashboard/stats');
        setStats(response.data.stats);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: HiOutlineUsers,
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50/50',
      iconColor: 'text-blue-600',
      glowColor: '#3b82f6',
    },
    {
      label: 'Total Stores',
      value: stats.totalStores,
      icon: HiOutlineOfficeBuilding,
      gradient: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-50/50',
      iconColor: 'text-indigo-600',
      glowColor: '#6366f1',
    },
    {
      label: 'Total Ratings',
      value: stats.totalRatings,
      icon: HiOutlineStar,
      gradient: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50/50',
      iconColor: 'text-amber-600',
      glowColor: '#f59e0b',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-surface-900 font-display tracking-tight">System Overview</h2>
        <p className="text-surface-500 text-sm mt-1">Real-time status metrics and platform performance metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
        {statCards.map((card) => (
          <div key={card.label} className="stat-card animate-fade-in group border border-surface-100 relative">
            <div 
              className="stat-card-glow"
              style={{ backgroundColor: card.glowColor }}
            />
            
            <div className="flex justify-between items-start">
              <div>
                <p className="text-surface-400 text-xs font-semibold uppercase tracking-wider">{card.label}</p>
                <p className="text-4xl font-extrabold text-surface-900 mt-2.5 font-display tracking-tight">
                  {card.value.toLocaleString()}
                </p>
              </div>
              
              <div className={`p-3 rounded-2xl ${card.bgColor} ${card.iconColor} transition-transform duration-300 group-hover:scale-105 shadow-sm`}>
                <card.icon className="w-7 h-7" />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-surface-100 flex items-center justify-between text-xs">
              <span className="text-surface-400 font-medium">Updated just now</span>
              <span className={`font-semibold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                Live stats
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
