import React, { useState } from 'react';
import { Shield, Upload, CheckCircle, AlertCircle, User, FileText, Camera } from 'lucide-react';
import { kycAPI } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export const KYCVerification: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [kycStatus, setKycStatus] = useState<'incomplete' | 'pending' | 'verified' | 'rejected'>('incomplete');
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    dateOfBirth: '',
    address: '',
    phoneNumber: '',
    email: user?.email || '',
    aadhaarNumber: '',
    panNumber: '',
  });

  const [documents, setDocuments] = useState({
    aadhaar: null as File | null,
    pan: null as File | null,
    photo: null as File | null,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (documentType: keyof typeof documents, file: File) => {
    setDocuments(prev => ({ ...prev, [documentType]: file }));
    toast.success(`${documentType.toUpperCase()} document uploaded`);
  };

  const handleSubmitKYC = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const kycData = {
        userId: user.id,
        fullName: formData.fullName,
        dateOfBirth: new Date(formData.dateOfBirth),
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        documents: [
          {
            id: `doc-${Date.now()}-1`,
            userId: user.id,
            documentType: 'aadhaar' as const,
            documentNumber: formData.aadhaarNumber,
            verificationStatus: 'pending' as const,
          },
          {
            id: `doc-${Date.now()}-2`,
            userId: user.id,
            documentType: 'pan' as const,
            documentNumber: formData.panNumber,
            verificationStatus: 'pending' as const,
          },
        ],
      };

      await kycAPI.submitKYC(kycData);
      setKycStatus('pending');
      toast.success(t('kyc_submitted'));
    } catch (error) {
      toast.error('Failed to submit KYC documents');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      incomplete: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || colors.incomplete;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Shield className="w-5 h-5 text-yellow-600" />;
      default:
        return <User className="w-5 h-5 text-gray-600" />;
    }
  };

  if (kycStatus === 'verified') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">KYC Verified</h3>
        <p className="text-gray-600 mb-4">Your identity has been successfully verified.</p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700">
            ✅ All documents verified<br />
            ✅ Identity confirmed<br />
            ✅ Account fully activated
          </p>
        </div>
      </div>
    );
  }

  if (kycStatus === 'pending') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-yellow-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">KYC Under Review</h3>
        <p className="text-gray-600 mb-4">Your documents are being verified. This usually takes 24-48 hours.</p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-700">
            📋 Documents submitted<br />
            ⏳ Verification in progress<br />
            📧 You'll be notified via email
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-600" />
            {t('kyc_verification')}
          </h3>
          <div className="flex items-center space-x-2">
            {getStatusIcon(kycStatus)}
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(kycStatus)}`}>
              {kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Personal Information */}
        <div className="space-y-6">
          <h4 className="text-md font-medium text-gray-900 flex items-center">
            <User className="w-4 h-4 mr-2" />
            Personal Information
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <textarea
                required
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Document Information */}
        <div className="space-y-6">
          <h4 className="text-md font-medium text-gray-900 flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Document Information
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aadhaar Number *
              </label>
              <input
                type="text"
                required
                value={formData.aadhaarNumber}
                onChange={(e) => handleInputChange('aadhaarNumber', e.target.value)}
                placeholder="1234 5678 9012"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PAN Number *
              </label>
              <input
                type="text"
                required
                value={formData.panNumber}
                onChange={(e) => handleInputChange('panNumber', e.target.value)}
                placeholder="ABCDE1234F"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Document Upload */}
        <div className="space-y-6">
          <h4 className="text-md font-medium text-gray-900 flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            Document Upload
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { key: 'aadhaar', label: 'Aadhaar Card', icon: FileText },
              { key: 'pan', label: 'PAN Card', icon: FileText },
              { key: 'photo', label: 'Profile Photo', icon: Camera },
            ].map((doc) => {
              const Icon = doc.icon;
              return (
                <div key={doc.key} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Icon className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-700 mb-2">{doc.label}</p>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(doc.key as keyof typeof documents, file);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <button className="bg-blue-100 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                      Choose File
                    </button>
                  </div>
                  {documents[doc.key as keyof typeof documents] && (
                    <p className="text-xs text-green-600 mt-2">
                      ✅ {documents[doc.key as keyof typeof documents]?.name}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            onClick={handleSubmitKYC}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-8 rounded-lg hover:from-blue-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5 mr-2" />
                Submit for Verification
              </>
            )}
          </button>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Secure & Confidential</p>
              <p>Your documents are encrypted and stored securely. We comply with all data protection regulations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};