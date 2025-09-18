import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Package, Users, Calendar, BarChart3, PieChart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface SalesData {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  customerType: 'individual' | 'business';
  saleDate: Date;
  paymentMethod: 'cash' | 'card' | 'upi' | 'bank_transfer';
  status: 'completed' | 'pending' | 'refunded';
}

interface SalesMetrics {
  totalRevenue: number;
  totalSales: number;
  averageOrderValue: number;
  topProducts: { name: string; sales: number; revenue: number }[];
  monthlyTrend: { month: string; revenue: number; sales: number }[];
}

export const SalesTracking: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [metrics, setMetrics] = useState<SalesMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    fetchSalesData();
  }, [selectedPeriod]);

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      // Mock sales data
      const mockSales: SalesData[] = [
        {
          id: 'sale-1',
          productId: 'prod-1',
          productName: 'Organic Basmati Rice',
          quantity: 50,
          unitPrice: 120,
          totalAmount: 6000,
          customerType: 'business',
          saleDate: new Date('2024-01-15'),
          paymentMethod: 'bank_transfer',
          status: 'completed',
        },
        {
          id: 'sale-2',
          productId: 'prod-2',
          productName: 'Fresh Tomatoes',
          quantity: 25,
          unitPrice: 40,
          totalAmount: 1000,
          customerType: 'individual',
          saleDate: new Date('2024-01-16'),
          paymentMethod: 'upi',
          status: 'completed',
        },
        {
          id: 'sale-3',
          productId: 'prod-1',
          productName: 'Organic Basmati Rice',
          quantity: 100,
          unitPrice: 115,
          totalAmount: 11500,
          customerType: 'business',
          saleDate: new Date('2024-01-18'),
          paymentMethod: 'card',
          status: 'completed',
        },
        {
          id: 'sale-4',
          productId: 'prod-3',
          productName: 'Organic Wheat',
          quantity: 75,
          unitPrice: 35,
          totalAmount: 2625,
          customerType: 'individual',
          saleDate: new Date('2024-01-20'),
          paymentMethod: 'cash',
          status: 'pending',
        },
      ];

      setSalesData(mockSales);

      // Calculate metrics
      const totalRevenue = mockSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
      const totalSales = mockSales.length;
      const averageOrderValue = totalRevenue / totalSales;

      // Top products
      const productSales = mockSales.reduce((acc, sale) => {
        if (!acc[sale.productName]) {
          acc[sale.productName] = { sales: 0, revenue: 0 };
        }
        acc[sale.productName].sales += sale.quantity;
        acc[sale.productName].revenue += sale.totalAmount;
        return acc;
      }, {} as Record<string, { sales: number; revenue: number }>);

      const topProducts = Object.entries(productSales)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Monthly trend (mock data)
      const monthlyTrend = [
        { month: 'Dec', revenue: 15000, sales: 8 },
        { month: 'Jan', revenue: totalRevenue, sales: totalSales },
      ];

      setMetrics({
        totalRevenue,
        totalSales,
        averageOrderValue,
        topProducts,
        monthlyTrend,
      });
    } catch (error) {
      console.error('Error fetching sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      refunded: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getPaymentMethodIcon = (method: string) => {
    const icons = {
      cash: '💵',
      card: '💳',
      upi: '📱',
      bank_transfer: '🏦',
    };
    return icons[method as keyof typeof icons] || '💳';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-600">Loading sales data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{t('sales_tracking')}</h2>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Metrics Cards */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">₹{metrics.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">+12% from last month</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.totalSales}</p>
                <p className="text-sm text-blue-600 mt-1">+8% from last month</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-3xl font-bold text-gray-900">₹{Math.round(metrics.averageOrderValue).toLocaleString()}</p>
                <p className="text-sm text-purple-600 mt-1">+5% from last month</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customers</p>
                <p className="text-3xl font-bold text-gray-900">{salesData.length}</p>
                <p className="text-sm text-orange-600 mt-1">+15% from last month</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Sales</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {salesData.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{sale.productName}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(sale.status)}`}>
                          {sale.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Package className="w-4 h-4 mr-2" />
                          <span>Qty: {sale.quantity}</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-2" />
                          <span>₹{sale.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{new Date(sale.saleDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">{getPaymentMethodIcon(sale.paymentMethod)}</span>
                          <span>{sale.paymentMethod.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Products & Analytics */}
        <div className="space-y-6">
          {/* Top Products */}
          {metrics && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Top Products
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {metrics.topProducts.map((product, index) => (
                    <div key={product.name} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.sales} units sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₹{product.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sales Trend */}
          {metrics && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Monthly Trend
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {metrics.monthlyTrend.map((month) => (
                    <div key={month.month} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{month.month}</p>
                        <p className="text-sm text-gray-600">{month.sales} sales</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₹{month.revenue.toLocaleString()}</p>
                        <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(month.revenue / Math.max(...metrics.monthlyTrend.map(m => m.revenue))) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};