import React, { useState, useEffect } from 'react';
import { User, MapPin, Award, Star, Calendar, Package, Phone, Mail, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FarmerProfile } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { QRScanner } from '../QR/QRScanner';
import toast from 'react-hot-toast';

export const FarmerDetails: React.FC = () => {
  const { user } = useAuth();
  const [farmers, setFarmers] = useState<FarmerProfile[]>([]);
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    setLoading(true);
    try {
      // Mock farmer data
      const mockFarmers: FarmerProfile[] = [
        {
          id: 'farmer-1',
          name: 'Rajesh Kumar',
          farmName: 'Kumar Organic Farms',
          location: {
            address: 'Village Rampur, Tehsil Thanesar',
            city: 'Kurukshetra',
            state: 'Haryana',
            country: 'India',
            pincode: '136118',
            latitude: 29.9457,
            longitude: 76.8781,
          },
          contactInfo: {
            phone: '+91-9876543210',
            email: 'rajesh.kumar@example.com',
          },
          farmSize: 25.5,
          cropTypes: ['Rice', 'Wheat', 'Sugarcane', 'Cotton'],
          certifications: [],
          experience: 15,
          rating: 4.8,
          totalProducts: 45,
          joinedDate: new Date('2020-03-15'),
        },
        {
          id: 'farmer-2',
          name: 'Priya Sharma',
          farmName: 'Sharma Sustainable Agriculture',
          location: {
            address: 'Village Khetri, Tehsil Sikar',
            city: 'Sikar',
            state: 'Rajasthan',
            country: 'India',
            pincode: '332027',
          },
          contactInfo: {
            phone: '+91-9123456789',
            email: 'priya.sharma@example.com',
          },
          farmSize: 18.2,
          cropTypes: ['Millet', 'Barley', 'Mustard', 'Chickpea'],
          certifications: [],
          experience: 12,
          rating: 4.6,
          totalProducts: 32,
          joinedDate: new Date('2021-07-22'),
        },
      ];

      setFarmers(mockFarmers);
      if (mockFarmers.length > 0) {
        setSelectedFarmer(mockFarmers[0]);
      }
    } catch (error) {
      console.error('Error fetching farmers:', error);
      toast.error('Failed to fetch farmer details');
    } finally {
      setLoading(false);
    }
  };

  const handleQRScan = (productId: string) => {
    // Mock: Find farmer associated with the product
    const farmer = farmers.find(f => f.id === 'farmer-1'); // Mock association
    if (farmer) {
      setSelectedFarmer(farmer);
      toast.success(`Found farmer details for product ${productId}`);
    } else {
      toast.error('No farmer details found for this product');
    }
    setShowScanner(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-600">Loading farmer details...</span>
      </div>
    );
  }

  if (showScanner) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Scan Product QR Code</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowScanner(false)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Farmers
          </motion.button>
        </div>
        <QRScanner onProductFound={handleQRScan} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Farmer Details</h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            {farmers.length} farmers registered
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowScanner(true)}
            className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 flex items-center shadow-lg"
          >
            <Camera className="w-4 h-4 mr-2" />
            Scan Product QR
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Farmers List */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {farmers.map((farmer) => (
              <motion.div
                key={farmer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.02 }}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedFarmer?.id === farmer.id ? 'ring-2 ring-green-500' : ''
                }`}
                onClick={() => setSelectedFarmer(farmer)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{farmer.name}</h3>
                      <p className="text-sm text-gray-600">{farmer.farmName}</p>
                      <div className="flex items-center mt-1">
                        {renderStars(farmer.rating)}
                        <span className="ml-2 text-sm text-gray-600">({farmer.rating})</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Experience</div>
                    <div className="text-lg font-bold text-green-600">{farmer.experience} years</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{farmer.location.city}, {farmer.location.state}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Package className="w-4 h-4 mr-2" />
                    <span>{farmer.totalProducts} products</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Farm Size: {farmer.farmSize} acres
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Since {farmer.joinedDate.getFullYear()}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Crop Types:</div>
                  <div className="flex flex-wrap gap-2">
                    {farmer.cropTypes.slice(0, 3).map((crop) => (
                      <span key={crop} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                        {crop}
                      </span>
                    ))}
                    {farmer.cropTypes.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                        +{farmer.cropTypes.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Phone className="w-3 h-3 mr-1" />
                      <span>{farmer.contactInfo.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {farmer.certifications.length > 0 && (
                      <Award className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Farmer Details */}
        <div className="lg:col-span-1">
          {selectedFarmer ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6"
            >
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedFarmer.name}</h3>
                <p className="text-gray-600">{selectedFarmer.farmName}</p>
                <div className="flex items-center justify-center mt-2">
                  {renderStars(selectedFarmer.rating)}
                  <span className="ml-2 text-sm text-gray-600">({selectedFarmer.rating})</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Contact Information</label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{selectedFarmer.contactInfo.phone}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>{selectedFarmer.contactInfo.email}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Farm Location</label>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>{selectedFarmer.location.address}</p>
                    <p>{selectedFarmer.location.city}, {selectedFarmer.location.state}</p>
                    <p>{selectedFarmer.location.country} - {selectedFarmer.location.pincode}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Farm Size</label>
                    <p className="text-lg font-bold text-green-600">{selectedFarmer.farmSize} acres</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Experience</label>
                    <p className="text-lg font-bold text-blue-600">{selectedFarmer.experience} years</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Crop Types</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedFarmer.cropTypes.map((crop) => (
                      <span key={crop} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Total Products</label>
                    <p className="text-lg font-bold text-purple-600">{selectedFarmer.totalProducts}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Member Since</label>
                    <p className="text-sm text-gray-600">{selectedFarmer.joinedDate.toLocaleDateString()}</p>
                  </div>
                </div>
                
                {selectedFarmer.certifications.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Certifications</label>
                    <div className="mt-2 space-y-2">
                      {selectedFarmer.certifications.map((cert) => (
                        <div key={cert.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <div className="flex items-center">
                            <Award className="w-4 h-4 text-yellow-600 mr-2" />
                            <span className="text-sm font-medium text-yellow-800">{cert.type}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Select a farmer to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};