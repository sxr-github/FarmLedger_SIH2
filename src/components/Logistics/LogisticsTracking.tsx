import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Clock, Package, CheckCircle, AlertTriangle, Navigation } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import toast from 'react-hot-toast';

interface LogisticsEvent {
  id: string;
  timestamp: Date;
  location: string;
  status: string;
  description: string;
  temperature?: number;
  humidity?: number;
}

interface LogisticsItem {
  id: string;
  productId: string;
  productName: string;
  batchId: string;
  currentLocation: string;
  destination: string;
  status: 'in_transit' | 'delivered' | 'delayed' | 'pending';
  estimatedDelivery: Date;
  events: LogisticsEvent[];
}

export const LogisticsTracking: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [logisticsItems, setLogisticsItems] = useState<LogisticsItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<LogisticsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogisticsData();
  }, []);

  const fetchLogisticsData = async () => {
    setLoading(true);
    try {
      // Mock logistics data
      const mockData: LogisticsItem[] = [
        {
          id: 'logistics-1',
          productId: 'prod-1',
          productName: 'Organic Basmati Rice',
          batchId: 'BATCH-2024-001',
          currentLocation: 'Delhi Distribution Center',
          destination: 'Mumbai Retail Store',
          status: 'in_transit',
          estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          events: [
            {
              id: 'event-1',
              timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
              location: 'Kurukshetra Farm',
              status: 'picked_up',
              description: 'Product picked up from farm',
              temperature: 25,
              humidity: 60,
            },
            {
              id: 'event-2',
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
              location: 'Delhi Distribution Center',
              status: 'arrived',
              description: 'Arrived at distribution center',
              temperature: 22,
              humidity: 55,
            },
            {
              id: 'event-3',
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
              location: 'Delhi Distribution Center',
              status: 'in_transit',
              description: 'Out for delivery to Mumbai',
              temperature: 24,
              humidity: 58,
            },
          ],
        },
        {
          id: 'logistics-2',
          productId: 'prod-2',
          productName: 'Fresh Tomatoes',
          batchId: 'BATCH-2024-002',
          currentLocation: 'Pune Retail Store',
          destination: 'Pune Retail Store',
          status: 'delivered',
          estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          events: [
            {
              id: 'event-4',
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
              location: 'Nashik Farm',
              status: 'picked_up',
              description: 'Fresh tomatoes harvested and picked up',
              temperature: 18,
              humidity: 70,
            },
            {
              id: 'event-5',
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
              location: 'Pune Retail Store',
              status: 'delivered',
              description: 'Successfully delivered to retail store',
              temperature: 20,
              humidity: 65,
            },
          ],
        },
      ];

      setLogisticsItems(mockData);
      if (mockData.length > 0) {
        setSelectedItem(mockData[0]);
      }
    } catch (error) {
      console.error('Error fetching logistics data:', error);
      toast.error('Failed to fetch logistics data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_transit: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      delayed: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'in_transit':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'delayed':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const updateLocation = async (itemId: string, newLocation: string) => {
    try {
      setLogisticsItems(prev => prev.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              currentLocation: newLocation,
              events: [
                ...item.events,
                {
                  id: `event-${Date.now()}`,
                  timestamp: new Date(),
                  location: newLocation,
                  status: 'location_updated',
                  description: `Location updated to ${newLocation}`,
                  temperature: Math.round(20 + Math.random() * 10),
                  humidity: Math.round(50 + Math.random() * 30),
                }
              ]
            }
          : item
      ));
      toast.success('Location updated successfully');
    } catch (error) {
      toast.error('Failed to update location');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-600">Loading logistics data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{t('logistics')}</h2>
        <div className="text-sm text-gray-600">
          {logisticsItems.length} shipments tracked
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Logistics Items List */}
        <div className="lg:col-span-2 space-y-4">
          {logisticsItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedItem?.id === item.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedItem(item)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.productName}</h3>
                  <p className="text-sm text-gray-600">Batch: {item.batchId}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(item.status)}
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(item.status)}`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Current: {item.currentLocation}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Navigation className="w-4 h-4 mr-2" />
                  <span>Destination: {item.destination}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>ETA: {item.estimatedDelivery.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Package className="w-4 h-4 mr-2" />
                  <span>{item.events.length} tracking events</span>
                </div>
              </div>

              {user?.role !== 'consumer' && (
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const newLocation = prompt('Enter new location:');
                      if (newLocation) {
                        updateLocation(item.id, newLocation);
                      }
                    }}
                    className="bg-blue-600 text-white px-3 py-1 text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Update Location
                  </button>
                  {item.status === 'in_transit' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLogisticsItems(prev => prev.map(i => 
                          i.id === item.id ? { ...i, status: 'delivered' as const } : i
                        ));
                        toast.success('Marked as delivered');
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
        </div>

        {/* Tracking Timeline */}
        <div className="lg:col-span-1">
          {selectedItem ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tracking Timeline</h3>
              
              <div className="space-y-4">
                {selectedItem.events.map((event, index) => (
                  <div key={event.id} className="relative">
                    {index < selectedItem.events.length - 1 && (
                      <div className="absolute left-4 top-8 w-0.5 h-8 bg-gray-200"></div>
                    )}
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{event.description}</p>
                          <span className="text-xs text-gray-500">
                            {event.timestamp.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {event.location}
                        </p>
                        {(event.temperature || event.humidity) && (
                          <div className="flex space-x-4 mt-2 text-xs text-gray-500">
                            {event.temperature && (
                              <span>🌡️ {event.temperature}°C</span>
                            )}
                            {event.humidity && (
                              <span>💧 {event.humidity}%</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <Truck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Select a shipment to view tracking details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};