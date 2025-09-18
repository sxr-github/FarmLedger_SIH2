import React, { useState, useEffect } from 'react';
import { FileText, DollarSign, Clock, CheckCircle, AlertCircle, Users, Shield, Zap, ExternalLink, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SmartContract } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { ethereumService, EthereumTransaction } from '../../services/ethereum';
import toast from 'react-hot-toast';

export const SmartContractManager: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [contracts, setContracts] = useState<SmartContract[]>([]);
  const [selectedContract, setSelectedContract] = useState<SmartContract | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newContract, setNewContract] = useState({
    productId: '',
    buyerId: '',
    sellerId: user?.id || '',
    amount: '',
    terms: '',
    ethAmount: '',
  });
  const [ethereumConnected, setEthereumConnected] = useState(false);

  useEffect(() => {
    fetchContracts();
    checkEthereumConnection();
  }, []);

  const checkEthereumConnection = async () => {
    try {
      const walletInfo = await ethereumService.getWalletInfo();
      setEthereumConnected(!!walletInfo);
    } catch (error) {
      console.error('Ethereum connection check failed:', error);
      setEthereumConnected(false);
    }
  };

  const fetchContracts = async () => {
    setLoading(true);
    try {
      // Mock smart contracts data with Ethereum integration
      const mockContracts: SmartContract[] = [
        {
          id: 'contract-1',
          productId: 'prod-1',
          buyerId: 'distributor-1',
          sellerId: 'farmer-1',
          amount: 25000,
          currency: 'INR',
          status: 'active',
          escrowReleased: false,
          terms: 'Payment upon delivery confirmation within 48 hours. Quality standards must be met.',
          createdAt: new Date('2024-01-16'),
          ethereumTxHash: '0x1234567890abcdef1234567890abcdef12345678901234567890abcdef12345678',
          ethereumAddress: '0x742d35Cc6634C0532925a3b8D0C9C0C0C0C0C0C0',
          ethAmount: 0.05,
        },
        {
          id: 'contract-2',
          productId: 'prod-2',
          buyerId: 'retailer-1',
          sellerId: 'distributor-1',
          amount: 15000,
          currency: 'INR',
          status: 'completed',
          escrowReleased: true,
          terms: 'Immediate payment upon receipt. Temperature maintained below 25°C.',
          createdAt: new Date('2024-01-10'),
          ethereumTxHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          ethAmount: 0.03,
        },
        {
          id: 'contract-3',
          productId: 'prod-3',
          buyerId: 'consumer-1',
          sellerId: 'retailer-1',
          amount: 500,
          currency: 'INR',
          status: 'pending',
          escrowReleased: false,
          terms: 'Payment on delivery. Return policy: 24 hours.',
          createdAt: new Date('2024-01-18'),
          ethAmount: 0.001,
        },
      ];

      setContracts(mockContracts);
      if (mockContracts.length > 0) {
        setSelectedContract(mockContracts[0]);
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
      toast.error('Failed to fetch smart contracts');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'active':
        return <Shield className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const createContract = async () => {
    if (!ethereumConnected) {
      toast.error('Please connect your MetaMask wallet first');
      return;
    }

    setCreating(true);
    try {
      // Create contract on Ethereum blockchain
      const tx: EthereumTransaction = await ethereumService.createSmartContract(
        newContract.productId,
        newContract.buyerId, // In real app, this would be the seller's Ethereum address
        newContract.terms,
        newContract.ethAmount
      );

      const contract: SmartContract = {
        id: `contract-${Date.now()}`,
        productId: newContract.productId,
        buyerId: newContract.buyerId,
        sellerId: newContract.sellerId,
        amount: parseFloat(newContract.amount),
        currency: 'INR',
        status: 'pending',
        escrowReleased: false,
        terms: newContract.terms,
        createdAt: new Date(),
        ethAmount: parseFloat(newContract.ethAmount),
        ethereumTxHash: tx.hash,
        ethereumAddress: tx.to,
      };

      setContracts(prev => [contract, ...prev]);
      setNewContract({
        productId: '',
        buyerId: '',
        sellerId: user?.id || '',
        amount: '',
        terms: '',
        ethAmount: '',
      });
      setShowCreateForm(false);
      
      toast.success('Smart contract created on Ethereum blockchain!', {
        icon: '⛓️',
        duration: 4000,
      });
    } catch (error: any) {
      console.error('Failed to create contract:', error);
      toast.error(error.message || 'Failed to create smart contract');
    } finally {
      setCreating(false);
    }
  };

  const executeContract = async (contractId: string) => {
    try {
      setContracts(prev => prev.map(contract => 
        contract.id === contractId 
          ? { ...contract, status: 'active' as const }
          : contract
      ));
      toast.success('Smart contract executed successfully!');
    } catch (error) {
      toast.error('Failed to execute contract');
    }
  };

  const releaseEscrow = async (contractId: string) => {
    const contract = contracts.find(c => c.id === contractId);
    
    if (!ethereumConnected) {
      toast.error('Please connect your MetaMask wallet first');
      return;
    }

    try {
      // Release escrow on Ethereum blockchain
      if (contract?.ethereumTxHash) {
        // In a real implementation, you would call the releaseEscrow function
        // const tx = await ethereumService.releaseEscrow(escrowId);
        toast.success('Ethereum escrow released successfully!', {
          icon: '⛓️',
          duration: 3000,
        });
      }

      setContracts(prev => prev.map(contract => 
        contract.id === contractId 
          ? { ...contract, escrowReleased: true, status: 'completed' as const }
          : contract
      ));
      toast.success('Escrow released successfully!');
    } catch (error: any) {
      console.error('Failed to release escrow:', error);
      toast.error(error.message || 'Failed to release escrow');
    }
  };

  const connectWallet = async () => {
    try {
      await ethereumService.connectWallet();
      setEthereumConnected(true);
      toast.success('MetaMask wallet connected!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to connect wallet');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-600">Loading smart contracts...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{t('smart_contracts')}</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${ethereumConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              Ethereum {ethereumConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          {!ethereumConnected && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={connectWallet}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center shadow-lg"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center shadow-lg"
          >
            <FileText className="w-4 h-4 mr-2" />
            Create Contract
          </motion.button>
        </div>
      </div>

      {/* Create Contract Form */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Smart Contract</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product ID</label>
                <input
                  type="text"
                  value={newContract.productId}
                  onChange={(e) => setNewContract(prev => ({ ...prev, productId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="prod-123"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Buyer Address</label>
                <input
                  type="text"
                  value={newContract.buyerId}
                  onChange={(e) => setNewContract(prev => ({ ...prev, buyerId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0x742d35Cc..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (INR)</label>
                <input
                  type="number"
                  value={newContract.amount}
                  onChange={(e) => setNewContract(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="25000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seller Address</label>
                <input
                  type="text"
                  value={newContract.sellerId}
                  onChange={(e) => setNewContract(prev => ({ ...prev, sellerId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0x1234567..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ETH Amount</label>
                <input
                  type="number"
                  step="0.001"
                  value={newContract.ethAmount}
                  onChange={(e) => setNewContract(prev => ({ ...prev, ethAmount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.05"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Contract Terms</label>
              <textarea
                value={newContract.terms}
                onChange={(e) => setNewContract(prev => ({ ...prev, terms: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter contract terms and conditions..."
              />
            </div>
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={createContract}
                disabled={creating || !ethereumConnected}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg disabled:opacity-50 flex items-center"
              >
                {creating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Create on Ethereum
                  </>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all duration-200"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contracts List */}
        <div className="lg:col-span-2 space-y-4">
          {contracts.map((contract) => (
            <motion.div
              key={contract.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedContract?.id === contract.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedContract(contract)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Contract #{contract.id.slice(-8)}</h3>
                  <p className="text-sm text-gray-600">Product: {contract.productId}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(contract.status)}
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(contract.status)}`}>
                    {contract.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span>₹{contract.amount.toLocaleString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Buyer: {contract.buyerId.slice(-8)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="w-4 h-4 mr-2" />
                  <span>Escrow: {contract.escrowReleased ? 'Released' : 'Locked'}</span>
                </div>
                {contract.ethAmount && contract.ethAmount > 0 && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Zap className="w-4 h-4 mr-2 text-blue-500" />
                    <span>ETH: {contract.ethAmount}</span>
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{new Date(contract.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                {contract.status === 'pending' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      executeContract(contract.id);
                    }}
                    className="bg-blue-600 text-white px-3 py-1 text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Execute
                  </motion.button>
                )}
                {contract.status === 'active' && !contract.escrowReleased && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      releaseEscrow(contract.id);
                    }}
                    className="bg-green-600 text-white px-3 py-1 text-sm rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Release Escrow
                  </motion.button>
                )}
                {contract.ethereumTxHash && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`https://sepolia.etherscan.io/tx/${contract.ethereumTxHash}`, '_blank');
                    }}
                    className="bg-blue-600 text-white px-3 py-1 text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Etherscan
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contract Details */}
        <div className="lg:col-span-1">
          {selectedContract ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Contract ID</label>
                  <p className="text-sm text-gray-900">{selectedContract.id}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Product ID</label>
                  <p className="text-sm text-gray-900">{selectedContract.productId}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Amount</label>
                  <p className="text-lg font-bold text-gray-900">₹{selectedContract.amount.toLocaleString()}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Buyer</label>
                  <p className="text-sm text-gray-900">{selectedContract.buyerId}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Seller</label>
                  <p className="text-sm text-gray-900">{selectedContract.sellerId}</p>
                </div>
                
                {selectedContract.ethAmount && selectedContract.ethAmount > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">ETH Amount</label>
                    <p className="text-lg font-bold text-blue-600 flex items-center">
                      <Zap className="w-4 h-4 mr-1" />
                      {selectedContract.ethAmount} ETH
                    </p>
                  </div>
                )}
                
                {selectedContract.ethereumAddress && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Ethereum Contract</label>
                    <p className="text-xs text-gray-900 font-mono break-all bg-gray-50 p-2 rounded">
                      {selectedContract.ethereumAddress}
                    </p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Created Date</label>
                  <p className="text-sm text-gray-900">{new Date(selectedContract.createdAt).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Terms & Conditions</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg mt-1">
                    {selectedContract.terms}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Status</span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedContract.status)}`}>
                      {selectedContract.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Escrow</span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      selectedContract.escrowReleased ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {selectedContract.escrowReleased ? 'Released' : 'Locked'}
                    </span>
                  </div>
                </div>
                
                {selectedContract.ethereumTxHash && (
                  <div className="pt-4 border-t border-gray-200">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Blockchain Details</label>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-800">Ethereum Transaction</span>
                        <Zap className="w-4 h-4 text-blue-600" />
                      </div>
                      <p className="text-xs text-blue-600 font-mono break-all mb-2">
                        {selectedContract.ethereumTxHash}
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.open(`https://sepolia.etherscan.io/tx/${selectedContract.ethereumTxHash}`, '_blank')}
                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View on Etherscan
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Select a contract to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};