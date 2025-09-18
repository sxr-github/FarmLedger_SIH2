import React from 'react';
import { Package, Truck, Store, DollarSign, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { StatsCard } from './StatsCard';
import { ActivityFeed } from './ActivityFeed';
import { generateMockStats } from '../../utils/mockData';

interface DashboardViewProps {
  onTabChange: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onTabChange }) => {
  const { user } = useAuth();
  const stats = generateMockStats(user?.role || 'consumer');

  const getRoleSpecificStats = () => {
    switch (user?.role) {
      case 'farmer':
        return [
          {
            title: 'Total Products',
            value: stats.totalProducts,
            icon: Package,
            color: 'green' as const,
            trend: { value: 12, isPositive: true },
          },
          {
            title: 'Active Contracts',
            value: stats.activeContracts,
            icon: DollarSign,
            color: 'blue' as const,
            trend: { value: 8, isPositive: true },
          },
          {
            title: 'Total Revenue',
            value: `₹${(stats.revenue / 1000).toFixed(0)}K`,
            icon: TrendingUp,
            color: 'purple' as const,
            trend: { value: 15, isPositive: true },
          },
          {
            title: 'Completed Sales',
            value: stats.completedTransactions,
            icon: Store,
            color: 'orange' as const,
          },
        ];
      case 'distributor':
        return [
          {
            title: 'Products Handled',
            value: stats.totalProducts,
            icon: Truck,
            color: 'blue' as const,
            trend: { value: 18, isPositive: true },
          },
          {
            title: 'Active Routes',
            value: stats.activeContracts,
            icon: Package,
            color: 'green' as const,
          },
          {
            title: 'Total Throughput',
            value: `₹${(stats.revenue / 1000).toFixed(0)}K`,
            icon: DollarSign,
            color: 'purple' as const,
            trend: { value: 22, isPositive: true },
          },
          {
            title: 'Deliveries',
            value: stats.completedTransactions,
            icon: Store,
            color: 'orange' as const,
          },
        ];
      case 'retailer':
        return [
          {
            title: 'Inventory Items',
            value: stats.totalProducts,
            icon: Package,
            color: 'green' as const,
          },
          {
            title: 'Active Orders',
            value: stats.activeContracts,
            icon: Store,
            color: 'blue' as const,
          },
          {
            title: 'Monthly Sales',
            value: `₹${(stats.revenue / 1000).toFixed(0)}K`,
            icon: DollarSign,
            color: 'purple' as const,
            trend: { value: 10, isPositive: true },
          },
          {
            title: 'Customers Served',
            value: stats.completedTransactions,
            icon: Users,
            color: 'orange' as const,
          },
        ];
      case 'admin':
        return [
          {
            title: 'Total Users',
            value: stats.totalProducts * 2,
            icon: Users,
            color: 'blue' as const,
            trend: { value: 25, isPositive: true },
          },
          {
            title: 'Active Validators',
            value: 12,
            icon: Package,
            color: 'green' as const,
          },
          {
            title: 'Network Volume',
            value: `₹${(stats.revenue * 5 / 1000000).toFixed(1)}M`,
            icon: TrendingUp,
            color: 'purple' as const,
            trend: { value: 30, isPositive: true },
          },
          {
            title: 'Transactions',
            value: stats.completedTransactions * 10,
            icon: DollarSign,
            color: 'orange' as const,
          },
        ];
      default:
        return [
          {
            title: 'Products Scanned',
            value: 24,
            icon: Package,
            color: 'green' as const,
          },
          {
            title: 'Verified Items',
            value: 18,
            icon: Store,
            color: 'blue' as const,
          },
          {
            title: 'Trusted Brands',
            value: 8,
            icon: TrendingUp,
            color: 'purple' as const,
          },
          {
            title: 'Savings',
            value: '₹2.4K',
            icon: DollarSign,
            color: 'orange' as const,
          },
        ];
    }
  };

  const statsCards = getRoleSpecificStats();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="animate-slide-up">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2 text-base">
            Here's what's happening with your {user?.role} dashboard today.
          </p>
        </div>
        <div className="text-right hidden lg:block animate-slide-up">
          <p className="text-sm text-gray-500">Today</p>
          <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {new Date().toLocaleDateString('en-IN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
        {statsCards.map((stat, index) => (
          <div key={index} className="animate-bounce-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-slide-up">
        <ActivityFeed events={stats.recentActivity} />
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50">
          <div className="px-6 py-5 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-t-2xl">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {user?.role === 'farmer' && (
                <>
                  <button 
                    onClick={() => onTabChange('register')}
                    className="w-full text-left p-4 rounded-2xl border border-gray-200/50 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:border-green-300 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] group"
                  >
                    <div className="font-semibold text-gray-900 text-base group-hover:text-green-700 transition-colors">Register New Product</div>
                    <div className="text-sm text-gray-500 mt-1">Add a new batch to the supply chain</div>
                  </button>
                  <button 
                    onClick={() => onTabChange('qr-codes')}
                    className="w-full text-left p-4 rounded-2xl border border-gray-200/50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] group"
                  >
                    <div className="font-semibold text-gray-900 text-base group-hover:text-blue-700 transition-colors">Generate QR Code</div>
                    <div className="text-sm text-gray-500 mt-1">Create QR codes for your products</div>
                  </button>
                </>
              )}
              {(user?.role === 'distributor' || user?.role === 'retailer') && (
                <>
                  <button 
                    onClick={() => onTabChange('scan')}
                    className="w-full text-left p-4 rounded-2xl border border-gray-200/50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] group"
                  >
                    <div className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">Scan QR Code</div>
                    <div className="text-sm text-gray-500 mt-1">Verify and update product status</div>
                  </button>
                  <button 
                    onClick={() => onTabChange('logistics')}
                    className="w-full text-left p-4 rounded-2xl border border-gray-200/50 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:border-purple-300 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] group"
                  >
                    <div className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">Update Logistics</div>
                    <div className="text-sm text-gray-500 mt-1">Track product movement</div>
                  </button>
                </>
              )}
              {user?.role === 'consumer' && (
                <>
                  <button 
                    onClick={() => onTabChange('scan')}
                    className="w-full text-left p-4 rounded-2xl border border-gray-200/50 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:border-green-300 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] group"
                  >
                    <div className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">Verify Product</div>
                    <div className="text-sm text-gray-500 mt-1">Scan QR to check authenticity</div>
                  </button>
                  <button 
                    onClick={() => onTabChange('certificates')}
                    className="w-full text-left p-4 rounded-2xl border border-gray-200/50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] group"
                  >
                    <div className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">View Certificates</div>
                    <div className="text-sm text-gray-500 mt-1">Check product certifications</div>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};