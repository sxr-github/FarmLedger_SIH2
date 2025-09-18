import React from 'react';
import { X, Calendar, MapPin, Package, Award, Thermometer, Droplet } from 'lucide-react';
import { Product } from '../../types';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Package className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.variety}</p>
                    <p className="text-sm text-gray-500">Batch: {product.batchId}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Harvest Date</p>
                    <p className="text-sm text-gray-600">
                      {new Date(product.harvestDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Origin</p>
                    <p className="text-sm text-gray-600">{product.location.address}</p>
                    <p className="text-sm text-gray-600">
                      {product.location.city}, {product.location.state}, {product.location.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Supply Chain Status</h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-800">Current Status</span>
                    <span className="px-2 py-1 text-xs font-medium bg-green-200 text-green-800 rounded-full">
                      {product.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-800">Quantity</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {product.quantity} {product.unit}
                  </p>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Blockchain</p>
                  <p className="text-xs text-blue-600 font-mono break-all">
                    {product.blockchainTxId || 'Pending blockchain confirmation'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {product.certifications.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Certifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.certifications.map((cert) => (
                  <div key={cert.id} className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-800">{cert.name}</h4>
                    <p className="text-sm text-green-600">Issued by: {cert.issuer}</p>
                    <p className="text-xs text-green-600 mt-1">
                      Valid until: {new Date(cert.validUntil).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent IoT Data</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Thermometer className="w-5 h-5 text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Temperature</p>
                    <p className="text-lg font-semibold text-blue-900">24.5°C</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-cyan-50 rounded-lg">
                <div className="flex items-center">
                  <Droplet className="w-5 h-5 text-cyan-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-cyan-800">Humidity</p>
                    <p className="text-lg font-semibold text-cyan-900">68%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {product.qrCode && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">QR Code</h3>
              <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                <img src={product.qrCode} alt="Product QR Code" className="w-32 h-32" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};