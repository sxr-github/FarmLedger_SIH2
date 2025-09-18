import React from 'react';
import {
  Home,
  Package,
  Truck,
  Store,
  ShoppingCart,
  Shield,
  BarChart3,
  QrCode,
  Users,
  Settings,
  FileText,
  CreditCard,
  UserCheck,
  MessageCircle,
  TrendingUp,
  X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isOpen, onClose }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: t('dashboard'), icon: Home },
      { id: 'products', label: t('products'), icon: Package },
    ];

    const roleSpecificItems = {
      farmer: [
        { id: 'register', label: t('register_product'), icon: Package },
        { id: 'transaction-registry', label: t('transaction_registry'), icon: FileText },
        { id: 'msp-status', label: t('msp_status'), icon: TrendingUp },
        { id: 'qr-codes', label: t('qr_codes'), icon: QrCode },
        { id: 'contracts', label: t('smart_contracts'), icon: FileText },
        { id: 'active-transactions', label: 'Active Transactions', icon: BarChart3 },
      ],
      distributor: [
        { id: 'orders', label: t('order_status'), icon: ShoppingCart },
        { id: 'verification', label: t('batch_verification'), icon: Shield },
        { id: 'scan', label: t('qr_codes'), icon: QrCode },
        { id: 'logistics', label: t('logistics'), icon: Truck },
        { id: 'contracts', label: t('smart_contracts'), icon: FileText },
      ],
      retailer: [
        { id: 'orders', label: t('order_status'), icon: ShoppingCart },
        { id: 'verification', label: t('batch_verification'), icon: Shield },
        { id: 'scan', label: t('qr_codes'), icon: QrCode },
        { id: 'logistics', label: t('logistics'), icon: Truck },
        { id: 'contracts', label: t('smart_contracts'), icon: FileText },
        { id: 'sales', label: t('sales_tracking'), icon: BarChart3 },
      ],
      consumer: [
        { id: 'scan', label: t('qr_codes'), icon: QrCode },
        { id: 'orders', label: t('order_status'), icon: ShoppingCart },
        { id: 'verification', label: t('verification'), icon: Shield },
        { id: 'certificates', label: 'Certificates', icon: FileText },
        { id: 'contracts', label: t('smart_contracts'), icon: FileText },
        { id: 'logistics', label: t('logistics'), icon: Truck },
        { id: 'farmer-details', label: 'Farmer Details', icon: Users },
      ],
      admin: [
        { id: 'user-management', label: 'User Management', icon: Users },
        { id: 'validators', label: 'Validators', icon: Shield },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'system-settings', label: 'System Settings', icon: Settings },
      ],
      validator: [
        { id: 'validate', label: 'Validate Events', icon: Shield },
        { id: 'validator-rewards', label: 'Rewards', icon: BarChart3 },
      ],
    };

    const commonItems = [
      { id: 'kyc', label: t('kyc_verification'), icon: UserCheck },
      { id: 'payments', label: t('payment_gateway'), icon: CreditCard },
    ];

    return [
      ...baseItems,
      ...roleSpecificItems[user?.role as keyof typeof roleSpecificItems] || [],
      ...commonItems,
    ];
  };

  const menuItems = getMenuItems();

  const handleItemClick = (itemId: string) => {
    onTabChange(itemId);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 lg:z-auto
        w-72 lg:w-64 bg-white/95 backdrop-blur-xl shadow-2xl lg:shadow-lg
        border-r border-gray-200/50 min-h-screen
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile close button */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Logo section for mobile */}
        <div className="lg:hidden px-6 pb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">🌾</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                AgriChain
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Blockchain Agriculture</p>
            </div>
          </div>
        </div>

        <nav className="px-4 pb-6">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`
                    w-full flex items-center px-4 py-3 text-sm font-medium rounded-2xl
                    transition-all duration-200 group relative overflow-hidden
                    ${isActive
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25'
                      : 'text-gray-700 hover:bg-gray-100/80 hover:text-green-600'
                    }
                  `}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-20 animate-pulse rounded-2xl" />
                  )}
                  <Icon className={`w-5 h-5 mr-3 flex-shrink-0 transition-transform duration-200 ${
                    isActive ? 'scale-110' : 'group-hover:scale-105'
                  }`} />
                  <span className="truncate">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* User info at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/50 bg-gradient-to-t from-white to-transparent">
          <div className="flex items-center space-x-3 p-3 rounded-2xl bg-gray-50/80">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-gray-600">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};