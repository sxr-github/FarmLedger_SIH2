import React, { useState } from 'react';
import { Download, QrCode, Package, Copy, Check, Printer, Share2 } from 'lucide-react';
import { generateQRCode } from '../../utils/qrcode';
import { mockProducts } from '../../utils/mockData';
import toast from 'react-hot-toast';

interface QRGeneratorProps {
  productId?: string;
}

export const QRGenerator: React.FC<QRGeneratorProps> = ({ productId }) => {
  const [selectedProductId, setSelectedProductId] = useState(productId || '');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateQR = async () => {
    if (!selectedProductId) return;
    
    setLoading(true);
    try {
      const qrUrl = await generateQRCode(selectedProductId);
      setQrCodeUrl(qrUrl);
      toast.success('QR Code generated successfully!', {
        icon: '🎯',
        duration: 3000,
      });
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `agricchain-qr-${selectedProductId}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('QR Code downloaded!', {
      icon: '📥',
      duration: 2000,
    });
  };

  const handleCopyLink = async () => {
    if (!selectedProductId) return;
    
    const productUrl = `${window.location.origin}/verify/${selectedProductId}`;
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Verification link copied!', {
        icon: '📋',
        duration: 2000,
      });
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast.error('Failed to copy link');
    }
  };

  const handlePrint = () => {
    if (!qrCodeUrl) return;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const selectedProduct = mockProducts.find(p => p.id === selectedProductId);
      printWindow.document.write(`
        <html>
          <head>
            <title>FarmLegder QR Code - ${selectedProduct?.name}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 20px;
                background: white;
              }
              .qr-container {
                border: 2px solid #22C55E;
                border-radius: 12px;
                padding: 20px;
                margin: 20px auto;
                max-width: 400px;
                background: #F0FDF4;
              }
              .product-info {
                margin-bottom: 20px;
                color: #166534;
              }
              .qr-code {
                margin: 20px 0;
              }
              .footer {
                margin-top: 20px;
                font-size: 12px;
                color: #6B7280;
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <h1 style="color: #22C55E; margin-bottom: 10px;">🌾 AgriChain</h1>
              <div class="product-info">
                <h2>${selectedProduct?.name || 'Product'}</h2>
                <p><strong>Batch:</strong> ${selectedProduct?.batchId || 'N/A'}</p>
                <p><strong>Quantity:</strong> ${selectedProduct?.quantity || 'N/A'} ${selectedProduct?.unit || ''}</p>
              </div>
              <div class="qr-code">
                <img src="${qrCodeUrl}" alt="QR Code" style="max-width: 200px; height: auto;" />
              </div>
              <div class="footer">
                <p>Scan to verify authenticity and track supply chain</p>
                <p>Generated on ${new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleShare = async () => {
    if (!selectedProductId || !qrCodeUrl) return;
    
    const selectedProduct = mockProducts.find(p => p.id === selectedProductId);
    const shareData = {
      title: `FarmLegder - ${selectedProduct?.name}`,
      text: `Verify this agricultural product: ${selectedProduct?.name} (Batch: ${selectedProduct?.batchId})`,
      url: `${window.location.origin}/verify/${selectedProductId}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success('Shared successfully!', {
          icon: '📤',
          duration: 2000,
        });
      } else {
        // Fallback to copying URL
        await navigator.clipboard.writeText(shareData.url);
        toast.success('Link copied to clipboard!', {
          icon: '📋',
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  const selectedProduct = mockProducts.find(p => p.id === selectedProductId);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <QrCode className="w-5 h-5 mr-2 text-green-600" />
          QR Code Generator
        </h3>
      </div>
      
      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Product to Generate QR Code
          </label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
          >
            <option value="">Choose a product...</option>
            {mockProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - {product.batchId} ({product.quantity} {product.unit})
              </option>
            ))}
          </select>
        </div>

        {selectedProduct && (
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-start space-x-3">
              <Package className="w-5 h-5 text-gray-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">{selectedProduct.name}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <p><span className="font-medium">Batch:</span> {selectedProduct.batchId}</p>
                  <p><span className="font-medium">Category:</span> {selectedProduct.category}</p>
                  <p><span className="font-medium">Quantity:</span> {selectedProduct.quantity} {selectedProduct.unit}</p>
                  <p><span className="font-medium">Status:</span> 
                    <span className="ml-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      {selectedProduct.status.replace('_', ' ')}
                    </span>
                  </p>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-medium">Origin:</span> {selectedProduct.location.city}, {selectedProduct.location.state}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleGenerateQR}
            disabled={!selectedProductId || loading}
            className="flex-1 min-w-[200px] bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center"
          >
            <QrCode className="w-5 h-5 mr-2" />
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Generating...
              </>
            ) : (
              'Generate QR Code'
            )}
          </button>
          
          <button
            onClick={handleCopyLink}
            disabled={!selectedProductId}
            className="bg-blue-100 text-blue-700 py-3 px-4 rounded-lg hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
            title="Copy verification link"
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>

        {qrCodeUrl && (
          <div className="text-center space-y-6 animate-in slide-in-from-bottom duration-500">
            <div className="inline-block p-6 bg-white border-2 border-green-200 rounded-xl shadow-lg bg-gradient-to-br from-white to-green-50">
              <img src={qrCodeUrl} alt="Generated QR Code" className="w-64 h-64 mx-auto rounded-lg" />
              <div className="mt-4 text-sm text-gray-600">
                <p className="font-medium">Secure QR Code Generated</p>
                <p>Valid for verification and tracking</p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={handleDownload}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-md flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PNG
              </button>
              
              <button
                onClick={handlePrint}
                className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-all duration-200 transform hover:scale-105 shadow-md flex items-center"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Label
              </button>
              
              <button
                onClick={handleShare}
                className="bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-all duration-200 transform hover:scale-105 shadow-md flex items-center"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
              <h5 className="font-medium text-gray-800 mb-2">QR Code Features</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">HMAC Signed</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Tamper Proof</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Blockchain Linked</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-500 max-w-md mx-auto">
              <p>This QR code contains encrypted product information and blockchain references. 
              It can be scanned by consumers, distributors, and retailers to verify authenticity 
              and track the complete supply chain journey.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};