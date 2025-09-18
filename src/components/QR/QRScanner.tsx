import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, CheckCircle, AlertCircle, Package, X, RotateCcw } from 'lucide-react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { parseQRCode, QRCodePayload } from '../../utils/qrcode';
import { mockProducts } from '../../utils/mockData';
import toast from 'react-hot-toast';

interface QRScannerProps {
  onProductFound: (productId: string) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onProductFound }) => {
  const [scanResult, setScanResult] = useState<{
    payload: QRCodePayload;
    product: any;
  } | null>(null);
  const [error, setError] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [scannerMode, setScannerMode] = useState<'camera' | 'upload'>('camera');
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannerElementId = 'qr-scanner';

  useEffect(() => {
    if (isScanning && scannerMode === 'camera') {
      startCameraScanner();
    }
    
    return () => {
      stopScanner();
    };
  }, [isScanning, scannerMode]);

  const startCameraScanner = () => {
    if (scannerRef.current) {
      stopScanner();
    }

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
      showTorchButtonIfSupported: true,
      showZoomSliderIfSupported: true,
    };

    scannerRef.current = new Html5QrcodeScanner(scannerElementId, config, false);
    
    scannerRef.current.render(
      (decodedText) => {
        handleScanSuccess(decodedText);
        stopScanner();
        setIsScanning(false);
      },
      (error) => {
        // Ignore frequent scanning errors
        if (!error.includes('NotFoundException')) {
          console.warn('QR scan error:', error);
        }
      }
    );
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      try {
        scannerRef.current.clear();
        scannerRef.current = null;
      } catch (error) {
        console.warn('Error stopping scanner:', error);
      }
    }
  };

  const handleScanSuccess = (qrData: string) => {
    try {
      const payload = parseQRCode(qrData);
      if (payload) {
        const product = mockProducts.find(p => p.id === payload.productId);
        if (product) {
          setScanResult({ payload, product });
          setError('');
          onProductFound(payload.productId);
          toast.success(`Product verified: ${product.name}`, {
            icon: '✅',
            duration: 4000,
          });
        } else {
          setError('Product not found in system');
          toast.error('Product not found in system');
        }
      } else {
        setError('Invalid or expired QR code');
        toast.error('Invalid or expired QR code');
      }
    } catch (error) {
      setError('Failed to parse QR code');
      toast.error('Failed to parse QR code');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // For demo purposes, simulate successful scan
    const mockQRData = JSON.stringify({
      productId: 'prod-1',
      timestamp: Date.now(),
      signature: 'demo-signature'
    });

    handleScanSuccess(mockQRData);
  };

  const handleStartScanning = () => {
    setIsScanning(true);
    setError('');
    setScanResult(null);
  };

  const handleStopScanning = () => {
    setIsScanning(false);
    stopScanner();
  };

  const handleReset = () => {
    setScanResult(null);
    setError('');
    setIsScanning(false);
    stopScanner();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">QR Code Scanner</h3>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setScannerMode('camera')}
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-colors ${
                scannerMode === 'camera'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Camera
            </button>
            <button
              onClick={() => setScannerMode('upload')}
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-colors ${
                scannerMode === 'upload'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Upload
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {scannerMode === 'camera' && (
          <div className="space-y-4">
            {!isScanning ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 text-center bg-gradient-to-br from-gray-50 to-gray-100">
                <Camera className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-sm sm:text-base text-gray-600 mb-4">Ready to scan QR codes</p>
                <button
                  onClick={handleStartScanning}
                  className="bg-green-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                >
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5 mr-2 inline" />
                  Start Camera Scan
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs sm:text-sm text-gray-600">Position QR code within the frame</p>
                  <div className="flex space-x-1 sm:space-x-2">
                    <button
                      onClick={handleReset}
                      className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Reset Scanner"
                    >
                      <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={handleStopScanning}
                      className="p-1.5 sm:p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Stop Scanning"
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
                <div 
                  id={scannerElementId}
                  className="rounded-lg overflow-hidden border-2 border-green-200 bg-black"
                  style={{ minHeight: '250px' }}
                />
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-gray-500">
                    📱 Allow camera access when prompted
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {scannerMode === 'upload' && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 text-center bg-gradient-to-br from-blue-50 to-indigo-50">
            <Upload className="w-12 h-12 sm:w-16 sm:h-16 text-blue-400 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-gray-600 mb-4">Upload QR code image</p>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="qr-upload"
              />
              <label
                htmlFor="qr-upload"
                className="inline-flex items-center justify-center bg-blue-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg cursor-pointer text-sm sm:text-base"
              >
                <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Choose Image
              </label>
            </div>
          </div>
        )}

        {/* Demo Button */}
        <div className="text-center">
          <button
            onClick={() => handleScanSuccess(JSON.stringify({
              productId: 'prod-1',
              timestamp: Date.now(),
              signature: 'demo-signature'
            }))}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-3 sm:px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg text-xs sm:text-sm"
          >
            🎯 Demo Scan (Try Me!)
          </button>
        </div>

        {error && (
          <div className="flex items-center p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg animate-pulse">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {scanResult && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 sm:p-6 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
              <h4 className="font-semibold text-green-800 text-base sm:text-lg">Product Verified Successfully! 🎉</h4>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <Package className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-green-800 text-sm sm:text-base">{scanResult.product.name}</p>
                    <p className="text-xs sm:text-sm text-green-600">{scanResult.product.variety}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-green-700">
                    <span className="font-medium">Batch:</span> {scanResult.product.batchId}
                  </p>
                  <p className="text-xs sm:text-sm text-green-700">
                    <span className="font-medium">Status:</span> 
                    <span className="ml-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {scanResult.product.status.replace('_', ' ')}
                    </span>
                  </p>
                  <p className="text-xs sm:text-sm text-green-700">
                    <span className="font-medium">Origin:</span> {scanResult.product.location.city}, {scanResult.product.location.state}
                  </p>
                  <p className="text-xs sm:text-sm text-green-700">
                    <span className="font-medium">Quantity:</span> {scanResult.product.quantity} {scanResult.product.unit}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 sm:p-4 border border-green-200">
                <h5 className="font-medium text-gray-800 mb-2 text-sm sm:text-base">Blockchain Verification</h5>
                <div className="space-y-2">
                  <div className="flex items-center text-xs sm:text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-gray-600">Authenticity Verified</span>
                  </div>
                  <div className="flex items-center text-xs sm:text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-gray-600">Supply Chain Tracked</span>
                  </div>
                  <div className="flex items-center text-xs sm:text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-gray-600">Quality Assured</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-green-200">
              <p className="text-xs text-green-600 flex items-center">
                <span className="mr-2">🕒</span>
                Scanned at: {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};