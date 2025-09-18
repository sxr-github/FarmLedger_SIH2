// Core Types and Interfaces
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization?: string;
  walletAddress?: string;
  isVerified: boolean;
  createdAt: Date;
}

export type UserRole = 'farmer' | 'distributor' | 'retailer' | 'consumer' | 'admin' | 'validator';

export interface Product {
  id: string;
  batchId: string;
  name: string;
  variety: string;
  category: ProductCategory;
  farmerId: string;
  currentOwnerId: string;
  harvestDate: Date;
  expiryDate: Date;
  quantity: number;
  unit: string;
  certifications: Certification[];
  location: Location;
  qrCode: string;
  blockchainTxId?: string;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductCategory = 'grains' | 'fruits' | 'vegetables' | 'dairy' | 'meat' | 'spices';
export type ProductStatus = 'registered' | 'in_transit' | 'at_distributor' | 'at_retailer' | 'sold' | 'expired';

export interface SupplyChainEvent {
  id: string;
  productId: string;
  eventType: EventType;
  fromUserId?: string;
  toUserId: string;
  location: Location;
  timestamp: Date;
  data: Record<string, any>;
  blockchainTxId?: string;
  iotData?: IoTReading[];
}

export type EventType = 'registered' | 'ownership_transferred' | 'logistics_updated' | 'quality_checked' | 'delivered';

export interface Location {
  address: string;
  city: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
  pincode?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  validUntil: Date;
  documentUrl?: string;
}

export interface IoTReading {
  sensorId: string;
  timestamp: Date;
  temperature?: number;
  humidity?: number;
  location?: { lat: number; lng: number };
  batteryLevel?: number;
}

export interface SmartContract {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  escrowReleased: boolean;
  terms: string;
  createdAt: Date;
  ethereumTxHash?: string;
  ethereumAddress?: string;
  ethAmount?: number;
}

// Ripple/XRP Types
export interface RippleTransaction {
  id: string;
  hash: string;
  account: string;
  destination: string;
  amount: string;
  fee: string;
  sequence: number;
  timestamp: Date;
  status: 'pending' | 'validated' | 'failed';
}

export interface RippleWallet {
  address: string;
  balance: number;
  sequence: number;
}

// New Types for Under-Development Sections
export interface TransactionRecord {
  id: string;
  type: 'product_registration' | 'ownership_transfer' | 'payment' | 'verification';
  productId?: string;
  fromAddress: string;
  toAddress: string;
  amount?: number;
  timestamp: Date;
  blockHash: string;
  status: 'pending' | 'confirmed' | 'failed';
  gasUsed?: number;
}

export interface Certificate {
  id: string;
  productId: string;
  type: 'organic' | 'quality' | 'safety' | 'origin';
  issuer: string;
  issuedDate: Date;
  expiryDate: Date;
  certificateNumber: string;
  documentUrl?: string;
  verificationStatus: 'valid' | 'expired' | 'revoked';
}

export interface FarmerProfile {
  id: string;
  name: string;
  farmName: string;
  location: Location;
  contactInfo: {
    phone: string;
    email: string;
  };
  farmSize: number;
  cropTypes: string[];
  certifications: Certificate[];
  experience: number;
  rating: number;
  totalProducts: number;
  joinedDate: Date;
}

export interface Validator {
  id: string;
  name: string;
  walletAddress: string;
  stake: number;
  validationsCount: number;
  successRate: number;
  rewards: number;
  status: 'active' | 'inactive' | 'suspended';
  joinedDate: Date;
}

export interface SystemSettings {
  id: string;
  category: 'general' | 'blockchain' | 'security' | 'notifications';
  key: string;
  value: string;
  description: string;
  updatedBy: string;
  updatedAt: Date;
}

export interface AnalyticsData {
  totalUsers: number;
  totalProducts: number;
  totalTransactions: number;
  totalVolume: number;
  userGrowth: { month: string; users: number }[];
  productCategories: { category: string; count: number }[];
  transactionTrends: { date: string; count: number; volume: number }[];
  topFarmers: { name: string; products: number; revenue: number }[];
}
export interface QRCodePayload {
  productId: string;
  timestamp: number;
  signature: string;
}

export interface DashboardStats {
  totalProducts: number;
  activeContracts: number;
  completedTransactions: number;
  revenue: number;
  recentActivity: SupplyChainEvent[];
}

// Payment Types
export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'razorpay' | 'stripe' | 'wallet';
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: Date;
  deliveryDate?: Date;
}

// KYC Types
export interface KYCDocument {
  id: string;
  userId: string;
  documentType: 'aadhaar' | 'pan' | 'driving_license' | 'passport';
  documentNumber: string;
  documentUrl?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verifiedAt?: Date;
  rejectionReason?: string;
}

export interface KYCProfile {
  id: string;
  userId: string;
  fullName: string;
  dateOfBirth: Date;
  address: string;
  phoneNumber: string;
  email: string;
  documents: KYCDocument[];
  overallStatus: 'incomplete' | 'pending' | 'verified' | 'rejected';
  verifiedAt?: Date;
}

// Chatbot Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// Transaction Types
export interface Transaction {
  id: string;
  fromUserId: string;
  toUserId: string;
  productId: string;
  orderId: string;
  amount: number;
  type: 'payment' | 'escrow_release' | 'refund';
  status: 'pending' | 'completed' | 'failed';
  blockchainTxId?: string;
  createdAt: Date;
}

// MSP (Minimum Support Price) Types
export interface MSPRate {
  id: string;
  crop: string;
  variety: string;
  season: string;
  year: number;
  mspRate: number;
  marketRate?: number;
  state: string;
  effectiveFrom: Date;
  effectiveTo: Date;
}