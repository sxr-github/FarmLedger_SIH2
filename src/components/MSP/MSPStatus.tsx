import React, { useState, useEffect } from 'react';
import { TrendingUp, MapPin, Calendar, DollarSign, Loader } from 'lucide-react';
import { mspAPI } from '../../services/api';
import { MSPRate } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

export const MSPStatus: React.FC = () => {
  const { t } = useLanguage();
  const [mspRates, setMspRates] = useState<MSPRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string>('');

  useEffect(() => {
    fetchMSPRates();
  }, [selectedState]);

  const fetchMSPRates = async () => {
    setLoading(true);
    try {
      const rates = await mspAPI.getMSPRates(selectedState);
      setMspRates(rates);
    } catch (error) {
      console.error('Error fetching MSP rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const states = ['Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan', 'Gujarat'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
          {t('msp_status')} - Minimum Support Price
        </h3>
      </div>

      <div className="p-6 space-y-6">
        {/* State Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select State
          </label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">All States</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        {/* MSP Rates */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-green-600" />
            <span className="ml-2 text-gray-600">Loading MSP rates...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mspRates.map((rate) => (
              <div key={rate.id} className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">{rate.crop}</h4>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    {rate.season}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{rate.state}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{rate.year}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">MSP Rate:</span>
                      <span className="font-bold text-green-600">₹{rate.mspRate}/quintal</span>
                    </div>
                    
                    {rate.marketRate && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Market Rate:</span>
                        <span className="font-bold text-blue-600">₹{rate.marketRate}/quintal</span>
                      </div>
                    )}
                    
                    {rate.marketRate && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Difference:</span>
                        <span className={`font-bold ${
                          rate.marketRate > rate.mspRate ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {rate.marketRate > rate.mspRate ? '+' : ''}₹{rate.marketRate - rate.mspRate}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-green-200">
                  <p className="text-xs text-gray-500">
                    Effective: {new Date(rate.effectiveFrom).toLocaleDateString()} - {new Date(rate.effectiveTo).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Information Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <DollarSign className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">About MSP (Minimum Support Price)</p>
              <p>MSP is the rate at which the government purchases crops from farmers. It ensures farmers get a fair price for their produce and protects them from market fluctuations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};