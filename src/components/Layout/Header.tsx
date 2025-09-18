import React, { useState, useEffect } from 'react';
import { LogOut, Bell, Menu, X, Wallet, ExternalLink, ChevronDown, Globe } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { ethereumService, WalletInfo } from '../../services/ethereum';
import toast from 'react-hot-toast';

interface HeaderProps {
  title: string;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, onToggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showWalletMenu, setShowWalletMenu] = useState(false);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
      const info = await ethereumService.getWalletInfo();
      setWalletInfo(info);
    } catch (error) {
      console.error('Failed to check wallet connection:', error);
    }
  };

  const connectWallet = async () => {
    setConnecting(true);
    try {
      const info = await ethereumService.connectWallet();
      setWalletInfo(info);
      toast.success('Wallet connected successfully!', {
        icon: '🔗',
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      toast.error(error.message || 'Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = () => {
    ethereumService.disconnect();
    setWalletInfo(null);
    setShowWalletMenu(false);
    toast.success('Wallet disconnected', {
      icon: '🔌',
      duration: 2000,
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const openEtherscan = () => {
    if (walletInfo?.address) {
      window.open(`https://sepolia.etherscan.io/address/${walletInfo.address}`, '_blank');
    }
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'or', name: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left Section - Logo & Menu */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                <span className="text-lg font-bold text-white">🌾</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  AgriChain
                </h1>
              </div>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Language Selector */}
            <div className="relative group hidden sm:block">
              <button className="flex items-center space-x-1 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200">
                <Globe className="w-4 h-4" />
                <span className="text-sm">{languages.find(lang => lang.code === language)?.flag}</span>
              </button>
              
              <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code as any)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2 ${
                        language === lang.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span className="text-xs">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Wallet Connection */}
            {walletInfo ? (
              <div className="relative">
                <button
                  onClick={() => setShowWalletMenu(!showWalletMenu)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl px-3 py-2 hover:from-emerald-100 hover:to-teal-100 transition-all duration-200"
                >
                  <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <div className="hidden sm:block text-sm">
                    <div className="font-semibold text-emerald-800">
                      {formatAddress(walletInfo.address)}
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-emerald-600" />
                </button>

                {showWalletMenu && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                    <div className="p-4">
                      <div className="text-sm text-gray-600 mb-2">Wallet Address</div>
                      <div className="font-mono text-xs bg-gray-50 p-2 rounded-lg mb-3 break-all">
                        {walletInfo.address}
                      </div>
                      <div className="text-sm text-gray-600 mb-1">Balance</div>
                      <div className="font-semibold text-lg text-gray-900 mb-3">
                        {parseFloat(walletInfo.balance).toFixed(4)} ETH
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={openEtherscan}
                          className="flex-1 bg-blue-600 text-white text-sm py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Explorer
                        </button>
                        <button
                          onClick={disconnectWallet}
                          className="flex-1 bg-red-600 text-white text-sm py-2 px-3 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Disconnect
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={connecting}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 sm:px-4 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg disabled:opacity-50"
              >
                <Wallet className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">
                  {connecting ? 'Connecting...' : 'Connect'}
                </span>
              </button>
            )}
            
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">3</span>
              </span>
            </button>
            
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                <div className="h-8 w-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-xl flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400 hidden sm:block" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <p className="text-xs text-gray-500 capitalize mt-1">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                      {user?.role}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-b-xl"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close menus */}
      {(showUserMenu || showWalletMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false);
            setShowWalletMenu(false);
          }}
        />
      )}
    </header>
  );
};