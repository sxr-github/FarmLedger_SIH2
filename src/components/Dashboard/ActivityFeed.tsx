import React from 'react';
import { Clock, Package, Truck, Store, CheckCircle } from 'lucide-react';
import { SupplyChainEvent } from '../../types';

interface ActivityFeedProps {
  events: SupplyChainEvent[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ events }) => {
  const getEventIcon = (eventType: string) => {
    const icons = {
      registered: Package,
      ownership_transferred: Truck,
      logistics_updated: Truck,
      quality_checked: CheckCircle,
      delivered: Store,
    };
    return icons[eventType as keyof typeof icons] || Package;
  };

  const getEventColor = (eventType: string) => {
    const colors = {
      registered: 'bg-green-100 text-green-600',
      ownership_transferred: 'bg-blue-100 text-blue-600',
      logistics_updated: 'bg-yellow-100 text-yellow-600',
      quality_checked: 'bg-purple-100 text-purple-600',
      delivered: 'bg-gray-100 text-gray-600',
    };
    return colors[eventType as keyof typeof colors] || colors.registered;
  };

  const formatEventText = (event: SupplyChainEvent) => {
    const eventTexts = {
      registered: 'Product registered in system',
      ownership_transferred: 'Ownership transferred',
      logistics_updated: 'Logistics status updated',
      quality_checked: 'Quality check completed',
      delivered: 'Product delivered successfully',
    };
    return eventTexts[event.eventType as keyof typeof eventTexts] || 'Event occurred';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {events.map((event) => {
            const Icon = getEventIcon(event.eventType);
            return (
              <div key={event.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getEventColor(event.eventType)}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {formatEventText(event)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {event.location.city}, {event.location.state}
                  </p>
                  <div className="flex items-center mt-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(event.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};