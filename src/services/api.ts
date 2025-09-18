import axios from 'axios';
import { supabaseService } from './supabase';
import { Product, Order, Payment, KYCProfile, Transaction, MSPRate } from '../types';

// Mock API base URL - in production, this would be your actual backend
const API_BASE_URL = 'https://api.agricchain.com'; // Mock URL

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('agricchain_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mock API responses for demo purposes
const mockApiCall = <T>(data: T, delay = 1000): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

export const productAPI = {
  // Get all products
  getProducts: async (): Promise<Product[]> => {
    try {
      // Try Supabase first, fallback to localStorage
      try {
        const products = await supabaseService.getProducts();
        return products;
      } catch {
        const products = JSON.parse(localStorage.getItem('agricchain_products') || '[]');
        return mockApiCall(products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Register new product
  registerProduct: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    try {
      // Try Supabase first
      try {
        const newProduct = await supabaseService.createProduct(product);
        return newProduct;
      } catch (supabaseError) {
        console.warn('Supabase unavailable, using localStorage:', supabaseError);
      }
      
      const newProduct: Product = {
        ...product,
        id: `prod-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const existingProducts = JSON.parse(localStorage.getItem('agricchain_products') || '[]');
      const updatedProducts = [newProduct, ...existingProducts];
      localStorage.setItem('agricchain_products', JSON.stringify(updatedProducts));
      
      return mockApiCall(newProduct);
    } catch (error) {
      console.error('Error registering product:', error);
      throw error;
    }
  },

  // Update product
  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product> => {
    try {
      // Try Supabase first
      try {
        const updatedProduct = await supabaseService.updateProduct(id, updates);
        return updatedProduct;
      } catch (supabaseError) {
        console.warn('Supabase unavailable, using localStorage:', supabaseError);
      }
      
      const products = JSON.parse(localStorage.getItem('agricchain_products') || '[]');
      const productIndex = products.findIndex((p: Product) => p.id === id);
      
      if (productIndex === -1) {
        throw new Error('Product not found');
      }
      
      products[productIndex] = { ...products[productIndex], ...updates, updatedAt: new Date() };
      localStorage.setItem('agricchain_products', JSON.stringify(products));
      
      return mockApiCall(products[productIndex]);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (id: string): Promise<void> => {
    try {
      // Try Supabase first
      try {
        await supabaseService.deleteProduct(id);
        return;
      } catch (supabaseError) {
        console.warn('Supabase unavailable, using localStorage:', supabaseError);
      }
      
      const products = JSON.parse(localStorage.getItem('agricchain_products') || '[]');
      const filteredProducts = products.filter((p: Product) => p.id !== id);
      localStorage.setItem('agricchain_products', JSON.stringify(filteredProducts));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },
};

export const orderAPI = {
  // Get orders for user
  getOrders: async (userId: string): Promise<Order[]> => {
    try {
      const mockOrders: Order[] = [
        {
          id: 'order-1',
          productId: 'prod-1',
          buyerId: 'user-2',
          sellerId: 'user-1',
          quantity: 100,
          pricePerUnit: 50,
          totalAmount: 5000,
          status: 'confirmed',
          paymentStatus: 'paid',
          createdAt: new Date('2024-01-15'),
          deliveryDate: new Date('2024-01-20'),
        },
      ];
      return mockApiCall(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Create new order
  createOrder: async (order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
    try {
      const newOrder: Order = {
        ...order,
        id: `order-${Date.now()}`,
        createdAt: new Date(),
      };
      return mockApiCall(newOrder);
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },
};

export const paymentAPI = {
  // Process payment
  processPayment: async (paymentData: {
    orderId: string;
    amount: number;
    paymentMethod: 'razorpay' | 'stripe';
  }): Promise<Payment> => {
    try {
      const payment: Payment = {
        id: `payment-${Date.now()}`,
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        currency: 'INR',
        status: 'completed',
        paymentMethod: paymentData.paymentMethod,
        transactionId: `txn-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return mockApiCall(payment, 2000);
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  },

  // Get payment status
  getPaymentStatus: async (paymentId: string): Promise<Payment> => {
    try {
      const payment: Payment = {
        id: paymentId,
        orderId: 'order-1',
        amount: 5000,
        currency: 'INR',
        status: 'completed',
        paymentMethod: 'razorpay',
        transactionId: `txn-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return mockApiCall(payment);
    } catch (error) {
      console.error('Error fetching payment status:', error);
      throw error;
    }
  },
};

export const kycAPI = {
  // Submit KYC documents
  submitKYC: async (kycData: Omit<KYCProfile, 'id' | 'overallStatus'>): Promise<KYCProfile> => {
    try {
      const kycProfile: KYCProfile = {
        ...kycData,
        id: `kyc-${Date.now()}`,
        overallStatus: 'pending',
      };
      return mockApiCall(kycProfile, 2000);
    } catch (error) {
      console.error('Error submitting KYC:', error);
      throw error;
    }
  },

  // Get KYC status
  getKYCStatus: async (userId: string): Promise<KYCProfile | null> => {
    try {
      const kycProfile: KYCProfile = {
        id: `kyc-${userId}`,
        userId,
        fullName: 'John Doe',
        dateOfBirth: new Date('1990-01-01'),
        address: '123 Farm Street, Village, State',
        phoneNumber: '+91-9876543210',
        email: 'john@example.com',
        documents: [],
        overallStatus: 'verified',
        verifiedAt: new Date(),
      };
      return mockApiCall(kycProfile);
    } catch (error) {
      console.error('Error fetching KYC status:', error);
      throw error;
    }
  },
};

export const transactionAPI = {
  // Get transactions for user
  getTransactions: async (userId: string): Promise<Transaction[]> => {
    try {
      const mockTransactions: Transaction[] = [
        {
          id: 'txn-1',
          fromUserId: 'user-1',
          toUserId: 'user-2',
          productId: 'prod-1',
          orderId: 'order-1',
          amount: 5000,
          type: 'payment',
          status: 'completed',
          blockchainTxId: '0x1234567890abcdef',
          createdAt: new Date('2024-01-15'),
        },
      ];
      return mockApiCall(mockTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },
};

export const mspAPI = {
  // Get MSP rates
  getMSPRates: async (state?: string): Promise<MSPRate[]> => {
    try {
      const mockMSPRates: MSPRate[] = [
        {
          id: 'msp-1',
          crop: 'Rice',
          variety: 'Basmati',
          season: 'Kharif',
          year: 2024,
          mspRate: 2040,
          marketRate: 2100,
          state: 'Punjab',
          effectiveFrom: new Date('2024-01-01'),
          effectiveTo: new Date('2024-12-31'),
        },
        {
          id: 'msp-2',
          crop: 'Wheat',
          variety: 'Common',
          season: 'Rabi',
          year: 2024,
          mspRate: 2275,
          marketRate: 2300,
          state: 'Haryana',
          effectiveFrom: new Date('2024-01-01'),
          effectiveTo: new Date('2024-12-31'),
        },
      ];
      return mockApiCall(mockMSPRates);
    } catch (error) {
      console.error('Error fetching MSP rates:', error);
      throw error;
    }
  },
};

// Chatbot API
export const chatbotAPI = {
  sendMessage: async (message: string, userId: string): Promise<string> => {
    try {
      // Mock OpenAI API response
      const responses = [
        "I can help you with information about agricultural supply chain, product registration, and blockchain verification.",
        "For product registration, please go to the 'Register Product' section and fill in all required details.",
        "QR codes help verify product authenticity. You can generate them after registering your products.",
        "MSP (Minimum Support Price) rates are updated regularly. Check the MSP Status section for current rates.",
        "For payment issues, please contact our support team or check the Payment Gateway section.",
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      return mockApiCall(randomResponse, 1500);
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      throw error;
    }
  },
};