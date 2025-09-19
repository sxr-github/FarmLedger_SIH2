import React, { useState } from 'react';
import { CreditCard, Wallet, DollarSign, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { paymentAPI } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import toast from 'react-hot-toast';

interface PaymentGatewayProps {
  orderId: string;
  amount: number;
  onPaymentSuccess: (paymentId: string) => void;
  onPaymentError: (error: string) => void;
}

export const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  orderId,
  amount,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const { t } = useLanguage();
  const [selectedMethod, setSelectedMethod] = useState<'razorpay' | 'stripe'>('razorpay');
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const paymentMethods = [
    {
      id: 'razorpay' as const,
      name: 'Razorpay',
      description: 'UPI, Cards, Net Banking, Wallets',
      icon: Wallet,
      color: 'bg-blue-50 border-blue-200 text-blue-700',
    },
    {
      id: 'stripe' as const,
      name: 'Stripe',
      description: 'International Cards',
      icon: CreditCard,
      color: 'bg-purple-50 border-purple-200 text-purple-700',
    },
  ];

  const handlePayment = async () => {
    setProcessing(true);
    setPaymentStatus('processing');

    try {
      // Simulate payment processing
      const payment = await paymentAPI.processPayment({
        orderId,
        amount,
        paymentMethod: selectedMethod,
      });

      if (payment.status === 'completed') {
        setPaymentStatus('success');
        toast.success(t('payment_success'));
        onPaymentSuccess(payment.id);
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      setPaymentStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      toast.error(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  if (paymentStatus === 'success') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h3>
        <p className="text-gray-600 mb-4">Your payment of ₹{amount.toLocaleString()} has been processed successfully.</p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700">
            <span className="font-medium">Order ID:</span> {orderId}
          </p>
          <p className="text-sm text-green-700">
            <span className="font-medium">Amount:</span> ₹{amount.toLocaleString()}
          </p>
          <p className="text-sm text-green-700">
            <span className="font-medium">Method:</span> {selectedMethod}
          </p>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'error') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Failed</h3>
        <p className="text-gray-600 mb-4">There was an issue processing your payment. Please try again.</p>
        <button
          onClick={() => setPaymentStatus('idle')}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          {t('Bill Details')}
        </h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium text-gray-900">{orderId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium text-gray-900">₹{amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Processing Fee:</span>
              <span className="font-medium text-gray-900">₹{Math.round(amount * 0.02)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-medium text-gray-900">Total:</span>
                <span className="font-bold text-gray-900">₹{(amount + Math.round(amount * 0.02)).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Select Payment Method</h4>
          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full p-4 border-2 rounded-lg transition-all duration-200 ${
                    selectedMethod === method.id
                      ? method.color
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-6 h-6" />
                    <div className="text-left">
                      <p className="font-medium">{method.name}</p>
                      <p className="text-sm opacity-75">{method.description}</p>
                    </div>
                    {selectedMethod === method.id && (
                      <CheckCircle className="w-5 h-5 ml-auto" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={processing}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center"
        >
          {processing ? (
            <>
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              Pay ₹{(amount + Math.round(amount * 0.02)).toLocaleString()}
            </>
          )}
        </button>

        {/* Security Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-700">
              <p className="font-medium mb-1">Secure Payment</p>
              <p>Your payment information is encrypted and secure. We don't store your card details.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};