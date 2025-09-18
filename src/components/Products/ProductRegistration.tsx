import React, { useState } from 'react';
import { Package, MapPin, Calendar, Award, Upload, Save, Plus, X } from 'lucide-react';
import { Product, ProductCategory, Certification, Location } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface ProductRegistrationProps {
  onProductRegistered: (product: Product) => void;
}

export const ProductRegistration: React.FC<ProductRegistrationProps> = ({ onProductRegistered }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    variety: '',
    category: 'grains' as ProductCategory,
    harvestDate: '',
    expiryDate: '',
    quantity: '',
    unit: 'kg',
    description: '',
  });

  const [location, setLocation] = useState<Partial<Location>>({
    address: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
  });

  const [certifications, setCertifications] = useState<Partial<Certification>[]>([]);
  const [newCertification, setNewCertification] = useState({
    name: '',
    issuer: '',
    validUntil: '',
  });

  const categories: { value: ProductCategory; label: string }[] = [
    { value: 'grains', label: 'Grains & Cereals' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'dairy', label: 'Dairy Products' },
    { value: 'meat', label: 'Meat & Poultry' },
    { value: 'spices', label: 'Spices & Herbs' },
  ];

  const units = ['kg', 'tons', 'liters', 'pieces', 'boxes', 'bags'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (field: string, value: string) => {
    setLocation(prev => ({ ...prev, [field]: value }));
  };

  const addCertification = () => {
    if (newCertification.name && newCertification.issuer && newCertification.validUntil) {
      setCertifications(prev => [...prev, {
        id: uuidv4(),
        ...newCertification,
        validUntil: new Date(newCertification.validUntil),
      }]);
      setNewCertification({ name: '', issuer: '', validUntil: '' });
      toast.success('Certification added!');
    }
  };

  const removeCertification = (index: number) => {
    setCertifications(prev => prev.filter((_, i) => i !== index));
    toast.success('Certification removed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newProduct: Product = {
        id: `prod-${uuidv4()}`,
        batchId: `BATCH-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
        name: formData.name,
        variety: formData.variety,
        category: formData.category,
        farmerId: user.id,
        currentOwnerId: user.id,
        harvestDate: new Date(formData.harvestDate),
        expiryDate: new Date(formData.expiryDate),
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        certifications: certifications as Certification[],
        location: location as Location,
        qrCode: '',
        status: 'registered',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      onProductRegistered(newProduct);
      
      // Reset form
      setFormData({
        name: '',
        variety: '',
        category: 'grains',
        harvestDate: '',
        expiryDate: '',
        quantity: '',
        unit: 'kg',
        description: '',
      });
      setLocation({
        address: '',
        city: '',
        state: '',
        country: 'India',
        pincode: '',
      });
      setCertifications([]);

      toast.success('Product registered successfully! 🎉', {
        duration: 4000,
        icon: '✅',
      });
    } catch (error) {
      toast.error('Failed to register product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Package className="w-5 h-5 mr-2 text-green-600" />
          Register New Product
        </h3>
        <p className="text-sm text-gray-600 mt-1">Add your agricultural produce to the blockchain</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <h4 className="text-md font-medium text-gray-900 flex items-center">
            <Package className="w-4 h-4 mr-2" />
            Basic Information
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Organic Basmati Rice"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Variety
              </label>
              <input
                type="text"
                value={formData.variety}
                onChange={(e) => handleInputChange('variety', e.target.value)}
                placeholder="e.g., Pusa Basmati 1121"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  placeholder="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit *
                </label>
                <select
                  required
                  value={formData.unit}
                  onChange={(e) => handleInputChange('unit', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                >
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="space-y-6">
          <h4 className="text-md font-medium text-gray-900 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Important Dates
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harvest Date *
              </label>
              <input
                type="date"
                required
                value={formData.harvestDate}
                onChange={(e) => handleInputChange('harvestDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-6">
          <h4 className="text-md font-medium text-gray-900 flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Farm Location
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <input
                type="text"
                required
                value={location.address}
                onChange={(e) => handleLocationChange('address', e.target.value)}
                placeholder="Farm address or village name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                required
                value={location.city}
                onChange={(e) => handleLocationChange('city', e.target.value)}
                placeholder="City name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <input
                type="text"
                required
                value={location.state}
                onChange={(e) => handleLocationChange('state', e.target.value)}
                placeholder="State name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PIN Code
              </label>
              <input
                type="text"
                value={location.pincode}
                onChange={(e) => handleLocationChange('pincode', e.target.value)}
                placeholder="123456"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                value={location.country}
                onChange={(e) => handleLocationChange('country', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="space-y-6">
          <h4 className="text-md font-medium text-gray-900 flex items-center">
            <Award className="w-4 h-4 mr-2" />
            Certifications
          </h4>
          
          {/* Add New Certification */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h5 className="text-sm font-medium text-gray-700">Add Certification</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                value={newCertification.name}
                onChange={(e) => setNewCertification(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Certification name"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
              <input
                type="text"
                value={newCertification.issuer}
                onChange={(e) => setNewCertification(prev => ({ ...prev, issuer: e.target.value }))}
                placeholder="Issuing authority"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={newCertification.validUntil}
                  onChange={(e) => setNewCertification(prev => ({ ...prev, validUntil: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={addCertification}
                  className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Existing Certifications */}
          {certifications.length > 0 && (
            <div className="space-y-3">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                  <div>
                    <p className="font-medium text-green-800">{cert.name}</p>
                    <p className="text-sm text-green-600">
                      Issued by: {cert.issuer} | Valid until: {cert.validUntil ? new Date(cert.validUntil).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCertification(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-8 rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Registering...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Register Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};