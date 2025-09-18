import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { LoginForm } from './components/Auth/LoginForm';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { Toast } from './components/Layout/Toast';
import { Chatbot } from './components/Chatbot/Chatbot';
import { DashboardView } from './components/Dashboard/DashboardView';
import { ProductCard } from './components/Products/ProductCard';
import { ProductModal } from './components/Products/ProductModal';
import { ProductRegistration } from './components/Products/ProductRegistration';
import { PaymentGateway } from './components/Payment/PaymentGateway';
import { KYCVerification } from './components/KYC/KYCVerification';
import { MSPStatus } from './components/MSP/MSPStatus';
import { QRScanner } from './components/QR/QRScanner';
import { QRGenerator } from './components/QR/QRGenerator';
import { OrderManagement } from './components/Orders/OrderManagement';
import { LogisticsTracking } from './components/Logistics/LogisticsTracking';
import { SmartContractManager } from './components/SmartContracts/SmartContractManager';
import { BatchVerification } from './components/Verification/BatchVerification';
import { SalesTracking } from './components/Sales/SalesTracking';
import { TransactionRegistry } from './components/Transactions/TransactionRegistry';
import { CertificateManager } from './components/Certificates/CertificateManager';
import { FarmerDetails } from './components/Farmers/FarmerDetails';
import { mockProducts as initialMockProducts } from './utils/mockData';
import { Product } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useLocalStorage<Product[]>('agricchain_products', initialMockProducts);

  const handleProductRegistered = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    setActiveTab('products');
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast.success('Product deleted successfully', {
        icon: '🗑️',
        duration: 3000,
      });
      toast.success('Product deleted successfully', {
        icon: '🗑️',
        duration: 3000,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView onTabChange={setActiveTab} />;
      
      case 'products':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Products</h1>
              <div className="text-sm text-gray-600">
                {products.length} products in system
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={setSelectedProduct}
                  onGenerateQR={() => console.log('Generate QR for', product.id)}
                  onDeleteProduct={handleDeleteProduct}
                  showQRAction={user.role === 'farmer'}
                  showDeleteAction={user.role === 'farmer'}
                />
              ))}
            </div>
          </div>
        );
      
      case 'register':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Register New Product</h1>
            <ProductRegistration onProductRegistered={handleProductRegistered} />
          </div>
        );
      
      case 'scan':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Scan QR Code</h1>
            <QRScanner onProductFound={(productId) => console.log('Found product:', productId)} />
          </div>
        );
      
      case 'qr-codes':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Generate QR Codes</h1>
            <QRGenerator />
          </div>
        );
      
      case 'kyc':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">KYC Verification</h1>
            <KYCVerification />
          </div>
        );
      
      case 'payments':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Payment Gateway</h1>
            <PaymentGateway
              orderId="demo-order-123"
              amount={5000}
              onPaymentSuccess={(paymentId) => console.log('Payment successful:', paymentId)}
              onPaymentError={(error) => console.log('Payment error:', error)}
            />
          </div>
        );
      
      case 'msp-status':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">MSP Status</h1>
            <MSPStatus />
          </div>
        );
      
      case 'orders':
        return (
          <div className="space-y-6">
            <OrderManagement />
          </div>
        );
      
      case 'logistics':
        return (
          <div className="space-y-6">
            <LogisticsTracking />
          </div>
        );
      
      case 'contracts':
        return (
          <div className="space-y-6">
            <SmartContractManager />
          </div>
        );
      
      case 'verification':
        return (
          <div className="space-y-6">
            <BatchVerification />
          </div>
        );
      
      case 'sales':
        return (
          <div className="space-y-6">
            <SalesTracking />
          </div>
        );
      
      case 'transaction-registry':
        return (
          <div className="space-y-6">
            <TransactionRegistry />
          </div>
        );
      
      case 'certificates':
        return (
          <div className="space-y-6">
            <CertificateManager />
          </div>
        );
      
      case 'farmer-details':
        return (
          <div className="space-y-6">
            <FarmerDetails />
          </div>
        );
      
      case 'active-transactions':
      case 'user-management':
      case 'validators':
      case 'analytics':
      case 'system-settings':
      case 'validator-rewards':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">{activeTab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚧</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon!</h3>
              <p className="text-gray-600 mb-4">
                The {activeTab.replace('-', ' ')} feature is currently under development and will be available soon.
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Expected features:</strong> Advanced analytics, user management tools, 
                  validator rewards system, and comprehensive system settings.
                </p>
              </div>
            </motion.div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">{activeTab}</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600">
                This section is under development. The {activeTab} functionality will be implemented here.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header 
        title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Dashboard`}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />
      <div className="flex">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 p-4 lg:p-6 min-w-0">
          {renderContent()}
        </main>
      </div>
      
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
      
      <Chatbot />
      <Toast />
    </div>
  );
};

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;