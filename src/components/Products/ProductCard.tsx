import React from 'react';
import { Calendar, MapPin, Package, QrCode, ExternalLink, Trash2 } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onGenerateQR?: (productId: string) => void;
  onDeleteProduct?: (productId: string) => void;
  showQRAction?: boolean;
  showDeleteAction?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onGenerateQR,
  onDeleteProduct,
  showQRAction = false,
  showDeleteAction = false,
}) => {
  const getStatusColor = (status: string) => {
    const colors = {
      registered: 'bg-green-100 text-green-800',
      in_transit: 'bg-yellow-100 text-yellow-800',
      at_distributor: 'bg-blue-100 text-blue-800',
      at_retailer: 'bg-purple-100 text-purple-800',
      sold: 'bg-gray-100 text-gray-800',
      expired: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || colors.registered;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      grains: 'bg-amber-100 text-amber-800',
      fruits: 'bg-orange-100 text-orange-800',
      vegetables: 'bg-green-100 text-green-800',
      dairy: 'bg-blue-100 text-blue-800',
      meat: 'bg-red-100 text-red-800',
      spices: 'bg-purple-100 text-purple-800',
    };
    return colors[category as keyof typeof colors] || colors.grains;
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent group-hover:from-green-600 group-hover:to-emerald-600 transition-all duration-300">{product.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{product.variety}</p>
          </div>
          <div className="flex flex-col space-y-2">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${getStatusColor(product.status)}`}>
              {product.status.replace('_', ' ')}
            </span>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${getCategoryColor(product.category)}`}>
              {product.category}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
            <Package className="w-4 h-4 mr-2" />
            <span>Batch: {product.batchId}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Harvested: {new Date(product.harvestDate).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{product.location.city}, {product.location.state}</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-sm">
              <span className="font-bold text-gray-900">{product.quantity} {product.unit}</span>
            </div>
            <div className="flex space-x-2">
              {showQRAction && onGenerateQR && (
                <button
                  onClick={() => onGenerateQR(product.id)}
                  className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 transform hover:scale-110 hover:rotate-6"
                  title="Generate QR Code"
                >
                  <QrCode className="w-4 h-4" />
                </button>
              )}
              {showDeleteAction && onDeleteProduct && (
                <button
                  onClick={() => onDeleteProduct(product.id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 transform hover:scale-110 hover:rotate-6"
                  title="Delete Product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => onViewDetails(product)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 transform hover:scale-110 hover:rotate-6"
                title="View Details"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {product.certifications.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200/50">
            <p className="text-xs text-gray-500 mb-2">Certifications:</p>
            <div className="flex flex-wrap gap-2">
              {product.certifications.slice(0, 2).map((cert) => (
                <span key={cert.id} className="px-3 py-1 text-xs bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-full font-medium shadow-sm">
                  {cert.name}
                </span>
              ))}
              {product.certifications.length > 2 && (
                <span className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full font-medium">
                  +{product.certifications.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};