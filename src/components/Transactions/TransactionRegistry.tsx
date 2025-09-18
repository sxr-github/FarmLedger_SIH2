import React, { useState, useEffect } from 'react';
import { FileText, ExternalLink, Clock, CheckCircle, AlertCircle, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TransactionRecord } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export const TransactionRegistry: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionRecord | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // Mock transaction data
      const mockTransactions: TransactionRecord[] = [
        {
          id: 'tx_001',
          type: 'product_registration',
          productId: 'prod-1',
          fromAddress: '0x1234...5678',
          toAddress: '0xabcd...efgh',
          amount: 0,
          timestamp: new Date('2024-01-15T10:30:00'),
          blockHash: '0xblock123...456',
          status: 'confirmed',
          gasUsed: 21000,
        },
        {
          id: 'tx_002',
          type: 'ownership_transfer',
          productId: 'prod-1',
          fromAddress: '0xabcd...efgh',
          toAddress: '0x9876...5432',
          amount: 25000,
          timestamp: new Date('2024-01-16T14:20:00'),
          blockHash: '0xblock789...012',
          status: 'confirmed',
          gasUsed: 45000,
        },
        {
          id: 'tx_003',
          type: 'payment',
          fromAddress: '0x9876...5432',
          toAddress: '0xabcd...efgh',
          amount: 25000,
          timestamp: new Date('2024-01-17T09:15:00'),
          blockHash: '0xblock345...678',
          status: 'pending',
          gasUsed: 21000,
        },
        {
          id: 'tx_004',
          type: 'verification',
          productId: 'prod-2',
          fromAddress: '0xvalidator1',
          toAddress: '0xsystem',
          timestamp: new Date('2024-01-18T16:45:00'),
          blockHash: '0xblock901...234',
          status: 'confirmed',
          gasUsed: 35000,
        },
      ];

      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      product_registration: 'bg-blue-100 text-blue-800',
      ownership_transfer: 'bg-purple-100 text-purple-800',
      payment: 'bg-green-100 text-green-800',
      verification: 'bg-orange-100 text-orange-800',
    };
    return colors[type as keyof typeof colors] || colors.product_registration;
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.blockHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (tx.productId && tx.productId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'all' || tx.type === filterType;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-600">Loading transactions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Transaction Registry</h2>
        <div className="text-sm text-gray-600">
          {filteredTransactions.length} transactions found
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by transaction ID, block hash, or product ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="product_registration">Product Registration</option>
              <option value="ownership_transfer">Ownership Transfer</option>
              <option value="payment">Payment</option>
              <option value="verification">Verification</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions List */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {filteredTransactions.map((transaction) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.02 }}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedTransaction?.id === transaction.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedTransaction(transaction)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {transaction.id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {transaction.productId && `Product: ${transaction.productId}`}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(transaction.status)}
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(transaction.type)}`}>
                      {transaction.type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {transaction.timestamp.toLocaleString()}
                  </div>
                  {transaction.amount && transaction.amount > 0 && (
                    <div className="text-sm text-gray-600">
                      Amount: ₹{transaction.amount.toLocaleString()}
                    </div>
                  )}
                  <div className="text-sm text-gray-600">
                    Gas: {transaction.gasUsed?.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500 font-mono">
                    Block: {transaction.blockHash.substring(0, 20)}...
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`https://etherscan.io/tx/${transaction.blockHash}`, '_blank');
                    }}
                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Explorer
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredTransactions.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions Found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {/* Transaction Details */}
        <div className="lg:col-span-1">
          {selectedTransaction ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Transaction ID</label>
                  <p className="text-sm text-gray-900 font-mono">{selectedTransaction.id}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Type</label>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(selectedTransaction.type)}`}>
                    {selectedTransaction.type.replace('_', ' ')}
                  </span>
                </div>
                
                {selectedTransaction.productId && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Product ID</label>
                    <p className="text-sm text-gray-900">{selectedTransaction.productId}</p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-gray-700">From Address</label>
                  <p className="text-xs text-gray-900 font-mono break-all bg-gray-50 p-2 rounded">
                    {selectedTransaction.fromAddress}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">To Address</label>
                  <p className="text-xs text-gray-900 font-mono break-all bg-gray-50 p-2 rounded">
                    {selectedTransaction.toAddress}
                  </p>
                </div>
                
                {selectedTransaction.amount && selectedTransaction.amount > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Amount</label>
                    <p className="text-lg font-bold text-green-600">₹{selectedTransaction.amount.toLocaleString()}</p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Timestamp</label>
                  <p className="text-sm text-gray-900">{selectedTransaction.timestamp.toLocaleString()}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Block Hash</label>
                  <p className="text-xs text-gray-900 font-mono break-all bg-gray-50 p-2 rounded">
                    {selectedTransaction.blockHash}
                  </p>
                </div>
                
                {selectedTransaction.gasUsed && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Gas Used</label>
                    <p className="text-sm text-gray-900">{selectedTransaction.gasUsed.toLocaleString()}</p>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Status</span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedTransaction.status)}`}>
                      {selectedTransaction.status}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Select a transaction to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};