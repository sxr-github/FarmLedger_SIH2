import React, { useState, useEffect } from 'react';
import { Package, Truck, Clock, CheckCircle, AlertCircle, DollarSign, MapPin, Calendar } from 'lucide-react';
import { Order } from '../../types';
import { orderAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import toast from 'react-hot-toast';

export const OrderManagement: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const fetchedOrders = await orderAPI.getOrders(user.id);
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <Package className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      // Mock API call - in production, this would update the order status
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-600">Loading orders...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{t('order_status')}</h2>
        <div className="text-sm text-gray-600">
          {orders.length} orders found
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2 space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedOrder?.id === order.id ? 'ring-2 ring-green-500' : ''
              }`}
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Order #{order.id.slice(-8)}</h3>
                  <p className="text-sm text-gray-600">Product ID: {order.productId}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(order.status)}
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Package className="w-4 h-4 mr-2" />
                  <span>Qty: {order.quantity}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span>₹{order.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    Payment: {order.paymentStatus}
                  </span>
                </div>
              </div>

              {user?.role !== 'consumer' && (
                <div className="flex space-x-2">
                  {order.status === 'pending' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateOrderStatus(order.id, 'confirmed');
                      }}
                      className="bg-blue-600 text-white px-3 py-1 text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Confirm
                    </button>
                  )}
                  {order.status === 'confirmed' && user?.role === 'distributor' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateOrderStatus(order.id, 'shipped');
                      }}
                      className="bg-purple-600 text-white px-3 py-1 text-sm rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Ship
                    </button>
                  )}
                  {order.status === 'shipped' && user?.role === 'retailer' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateOrderStatus(order.id, 'delivered');
                      }}
                      className="bg-green-600 text-white px-3 py-1 text-sm rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Mark Delivered
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          {orders.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Found</h3>
              <p className="text-gray-600">Orders will appear here once they are created.</p>
            </div>
          )}
        </div>

        {/* Order Details */}
        <div className="lg:col-span-1">
          {selectedOrder ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Order ID</label>
                  <p className="text-sm text-gray-900">{selectedOrder.id}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Product ID</label>
                  <p className="text-sm text-gray-900">{selectedOrder.productId}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Quantity</label>
                  <p className="text-sm text-gray-900">{selectedOrder.quantity} units</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Price per Unit</label>
                  <p className="text-sm text-gray-900">₹{selectedOrder.pricePerUnit}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Total Amount</label>
                  <p className="text-lg font-bold text-gray-900">₹{selectedOrder.totalAmount.toLocaleString()}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Created Date</label>
                  <p className="text-sm text-gray-900">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                </div>
                
                {selectedOrder.deliveryDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Delivery Date</label>
                    <p className="text-sm text-gray-900">{new Date(selectedOrder.deliveryDate).toLocaleDateString()}</p>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Status</span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Payment</span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    selectedOrder.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Select an order to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};