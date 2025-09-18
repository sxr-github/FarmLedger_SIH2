import React, { useState, useEffect } from 'react';
import { Award, Download, Eye, Calendar, Shield, CheckCircle, AlertTriangle, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Certificate } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { QRScanner } from '../QR/QRScanner';
import toast from 'react-hot-toast';

export const CertificateManager: React.FC = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      // Mock certificate data
      const mockCertificates: Certificate[] = [
        {
          id: 'cert_001',
          productId: 'prod-1',
          type: 'organic',
          issuer: 'India Organic Certification Agency',
          issuedDate: new Date('2024-01-01'),
          expiryDate: new Date('2024-12-31'),
          certificateNumber: 'IOCA-2024-001',
          documentUrl: 'https://example.com/cert1.pdf',
          verificationStatus: 'valid',
        },
        {
          id: 'cert_002',
          productId: 'prod-1',
          type: 'quality',
          issuer: 'Agricultural Quality Council',
          issuedDate: new Date('2024-01-15'),
          expiryDate: new Date('2025-01-15'),
          certificateNumber: 'AQC-2024-002',
          documentUrl: 'https://example.com/cert2.pdf',
          verificationStatus: 'valid',
        },
        {
          id: 'cert_003',
          productId: 'prod-2',
          type: 'safety',
          issuer: 'Food Safety Standards Authority',
          issuedDate: new Date('2023-12-01'),
          expiryDate: new Date('2024-02-01'),
          certificateNumber: 'FSSA-2023-003',
          documentUrl: 'https://example.com/cert3.pdf',
          verificationStatus: 'expired',
        },
      ];

      setCertificates(mockCertificates);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast.error('Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      valid: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      revoked: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || colors.valid;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-4 h-4" />;
      case 'expired':
      case 'revoked':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      organic: 'bg-green-100 text-green-800',
      quality: 'bg-blue-100 text-blue-800',
      safety: 'bg-orange-100 text-orange-800',
      origin: 'bg-purple-100 text-purple-800',
    };
    return colors[type as keyof typeof colors] || colors.organic;
  };

  const handleQRScan = (productId: string) => {
    // Find certificates for the scanned product
    const productCertificates = certificates.filter(cert => cert.productId === productId);
    if (productCertificates.length > 0) {
      setSelectedCertificate(productCertificates[0]);
      toast.success(`Found ${productCertificates.length} certificate(s) for product ${productId}`);
    } else {
      toast.error('No certificates found for this product');
    }
    setShowScanner(false);
  };

  const downloadCertificate = (certificate: Certificate) => {
    // Mock download functionality
    toast.success(`Downloading certificate ${certificate.certificateNumber}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-600">Loading certificates...</span>
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
            Back to Certificates
          </motion.button>
        </div>
        <QRScanner onProductFound={handleQRScan} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Certificates</h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            {certificates.length} certificates found
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowScanner(true)}
            className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 flex items-center shadow-lg"
          >
            <Camera className="w-4 h-4 mr-2" />
            Scan QR Code
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Certificates List */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {certificates.map((certificate) => (
              <motion.div
                key={certificate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.02 }}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedCertificate?.id === certificate.id ? 'ring-2 ring-green-500' : ''
                }`}
                onClick={() => setSelectedCertificate(certificate)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {certificate.certificateNumber}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Product: {certificate.productId}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(certificate.verificationStatus)}
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(certificate.verificationStatus)}`}>
                      {certificate.verificationStatus}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(certificate.type)}`}>
                      {certificate.type.charAt(0).toUpperCase() + certificate.type.slice(1)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Issuer: {certificate.issuer}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Issued: {certificate.issuedDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Expires: {certificate.expiryDate.toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Valid until {certificate.expiryDate.toLocaleDateString()}
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadCertificate(certificate);
                      }}
                      className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </motion.button>
                    {certificate.documentUrl && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(certificate.documentUrl, '_blank');
                        }}
                        className="text-green-600 hover:text-green-800 flex items-center text-sm"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {certificates.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Certificates Found</h3>
              <p className="text-gray-600">Scan a product QR code to view its certificates.</p>
            </div>
          )}
        </div>

        {/* Certificate Details */}
        <div className="lg:col-span-1">
          {selectedCertificate ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Certificate Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Certificate Number</label>
                  <p className="text-sm text-gray-900 font-mono">{selectedCertificate.certificateNumber}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Type</label>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(selectedCertificate.type)}`}>
                    {selectedCertificate.type.charAt(0).toUpperCase() + selectedCertificate.type.slice(1)}
                  </span>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Product ID</label>
                  <p className="text-sm text-gray-900">{selectedCertificate.productId}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Issuing Authority</label>
                  <p className="text-sm text-gray-900">{selectedCertificate.issuer}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Issue Date</label>
                  <p className="text-sm text-gray-900">{selectedCertificate.issuedDate.toLocaleDateString()}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Expiry Date</label>
                  <p className="text-sm text-gray-900">{selectedCertificate.expiryDate.toLocaleDateString()}</p>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-700">Status</span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedCertificate.verificationStatus)}`}>
                      {selectedCertificate.verificationStatus}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => downloadCertificate(selectedCertificate)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Certificate
                    </motion.button>
                    
                    {selectedCertificate.documentUrl && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.open(selectedCertificate.documentUrl, '_blank')}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Document
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Select a certificate to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};