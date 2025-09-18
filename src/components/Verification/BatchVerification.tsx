import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, AlertCircle, Package, Award, MapPin, Calendar, Thermometer } from 'lucide-react';
import { Product, Certification } from '../../types';
import { mockProducts } from '../../utils/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import toast from 'react-hot-toast';

interface VerificationResult {
  id: string;
  productId: string;
  batchId: string;
  verificationStatus: 'verified' | 'pending' | 'failed';
  verifiedBy: string;
  verificationDate: Date;
  authenticity: boolean;
  qualityScore: number;
  certifications: Certification[];
  issues: string[];
}

export const BatchVerification: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [verificationResults, setVerificationResults] = useState<VerificationResult[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductsAndVerifications();
  }, []);

  const fetchProductsAndVerifications = async () => {
    setLoading(true);
    try {
      setProducts(mockProducts);
      
      // Mock verification results
      const mockVerifications: VerificationResult[] = [
        {
          id: 'verify-1',
          productId: 'prod-1',
          batchId: 'BATCH-2024-001',
          verificationStatus: 'verified',
          verifiedBy: 'validator-1',
          verificationDate: new Date('2024-01-16'),
          authenticity: true,
          qualityScore: 95,
          certifications: mockProducts[0].certifications,
          issues: [],
        },
      ];
      
      setVerificationResults(mockVerifications);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch verification data');
    } finally {
      setLoading(false);
    }
  };

  const verifyBatch = async (product: Product) => {
    setVerifying(product.id);
    try {
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const verificationResult: VerificationResult = {
        id: `verify-${Date.now()}`,
        productId: product.id,
        batchId: product.batchId,
        verificationStatus: 'verified',
        verifiedBy: user?.id || 'unknown',
        verificationDate: new Date(),
        authenticity: Math.random() > 0.1, // 90% chance of being authentic
        qualityScore: Math.round(80 + Math.random() * 20), // Score between 80-100
        certifications: product.certifications,
        issues: Math.random() > 0.7 ? ['Minor temperature variation detected'] : [],
      };
      
      setVerificationResults(prev => [verificationResult, ...prev]);
      toast.success(`Batch ${product.batchId} verified successfully!`);
    } catch (error) {
      toast.error('Verification failed');
    } finally {
      setVerifying(null);
    }
  };

  const getVerificationStatus = (productId: string) => {
    return verificationResults.find(v => v.productId === productId);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      verified: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-600">Loading verification data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{t('batch_verification')}</h2>
        <div className="text-sm text-gray-600">
          {verificationResults.length} batches verified
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products List */}
        <div className="lg:col-span-2 space-y-4">
          {products.map((product) => {
            const verification = getVerificationStatus(product.id);
            const isVerifying = verifying === product.id;
            
            return (
              <div
                key={product.id}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedProduct?.id === product.id ? 'ring-2 ring-green-500' : ''
                }`}
                onClick={() => setSelectedProduct(product)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600">Batch: {product.batchId}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {verification ? (
                      <>
                        {getStatusIcon(verification.verificationStatus)}
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(verification.verificationStatus)}`}>
                          {verification.verificationStatus}
                        </span>
                      </>
                    ) : (
                      <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">
                        Not Verified
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Package className="w-4 h-4 mr-2" />
                    <span>{product.quantity} {product.unit}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{product.location.city}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(product.harvestDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Award className="w-4 h-4 mr-2" />
                    <span>{product.certifications.length} certs</span>
                  </div>
                </div>

                {verification && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Quality Score</span>
                      <span className={`text-lg font-bold ${getQualityColor(verification.qualityScore)}`}>
                        {verification.qualityScore}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          verification.qualityScore >= 90 ? 'bg-green-500' :
                          verification.qualityScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${verification.qualityScore}%` }}
                      ></div>
                    </div>
                    {verification.issues.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-orange-600">Issues: {verification.issues.join(', ')}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex space-x-2">
                  {!verification && user?.role !== 'consumer' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        verifyBatch(product);
                      }}
                      disabled={isVerifying}
                      className="bg-green-600 text-white px-3 py-1 text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center"
                    >
                      {isVerifying ? (
                        <>
                          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Shield className="w-3 h-3 mr-1" />
                          Verify Batch
                        </>
                      )}
                    </button>
                  )}
                  {verification && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success('Verification report downloaded');
                      }}
                      className="bg-blue-600 text-white px-3 py-1 text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Download Report
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Verification Details */}
        <div className="lg:col-span-1">
          {selectedProduct ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Product</label>
                  <p className="text-sm text-gray-900">{selectedProduct.name}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Batch ID</label>
                  <p className="text-sm text-gray-900">{selectedProduct.batchId}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Origin</label>
                  <p className="text-sm text-gray-900">
                    {selectedProduct.location.city}, {selectedProduct.location.state}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Harvest Date</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedProduct.harvestDate).toLocaleDateString()}
                  </p>
                </div>

                {selectedProduct.certifications.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Certifications</label>
                    <div className="space-y-2">
                      {selectedProduct.certifications.map((cert) => (
                        <div key={cert.id} className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-sm font-medium text-green-800">{cert.name}</p>
                          <p className="text-xs text-green-600">
                            Issued by: {cert.issuer}
                          </p>
                          <p className="text-xs text-green-600">
                            Valid until: {new Date(cert.validUntil).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mock IoT Data */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Current Conditions</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <Thermometer className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                      <p className="text-xs text-blue-600">Temperature</p>
                      <p className="text-sm font-bold text-blue-800">24°C</p>
                    </div>
                    <div className="bg-cyan-50 rounded-lg p-3 text-center">
                      <div className="w-4 h-4 text-cyan-600 mx-auto mb-1">💧</div>
                      <p className="text-xs text-cyan-600">Humidity</p>
                      <p className="text-sm font-bold text-cyan-800">65%</p>
                    </div>
                  </div>
                </div>

                {getVerificationStatus(selectedProduct.id) && (
                  <div className="pt-4 border-t border-gray-200">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Verification Result</label>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-green-800">Authenticity</span>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-xs text-green-600">
                        Verified on {new Date(getVerificationStatus(selectedProduct.id)!.verificationDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Select a product to view verification details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};