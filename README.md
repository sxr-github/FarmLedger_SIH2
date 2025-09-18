# FarmLedger - Blockchain Agricultural Supply Chain Platform

A comprehensive blockchain-based agricultural supply chain transparency platform built with React, TypeScript, Tailwind CSS, and Supabase. Developed for Smart India Hackathon (SIH).

## 🌾 Overview

FarmLedger provides end-to-end transparency for agricultural produce using blockchain technology. The platform enables immutable provenance tracking from farm to consumer with role-based dashboards, QR code verification, and smart contract automation.

## 🔗 Ethereum Integration

- **Smart Contracts**: Solidity-based contracts for Sepolia testnet deployment
- **MetaMask Integration**: Seamless wallet connectivity and transaction signing
- **Ethers.js**: Modern Web3 library for blockchain interactions
- **Escrow System**: Automated payment release upon delivery confirmation
- **Gas Optimization**: Efficient contract design for minimal transaction costs

## ✨ Features

### Database & Backend
- **Supabase Integration**: PostgreSQL database with real-time subscriptions
- **Row Level Security**: Secure data access with user-based policies
- **Real-time Updates**: Live data synchronization across clients
- **Offline Support**: Fallback to localStorage when database unavailable
- **Type-safe APIs**: Full TypeScript integration with database schema
- **Migration System**: Version-controlled database schema updates

### Core Functionality
- **Role-based Dashboards**: Farmer, Distributor, Retailer, Consumer, Admin, and Validator interfaces
- **Product Registration**: Complete batch tracking with metadata and certifications
- **QR Code System**: Secure generation and verification with HMAC signing
- **Supply Chain Tracking**: Immutable history from farm to consumer
- **Smart Contracts**: Ethereum-based automated escrow and ownership transfers
- **IoT Integration**: Temperature, humidity, and GPS sensor data
- **Offline Support**: PWA capabilities with local storage sync

### User Roles

#### 🚜 Farmer
- Register produce with batch details
- Generate secure QR codes
- Track product journey
- Manage certifications
- View sales analytics

#### 🚚 Distributor
- Scan and verify QR codes
- Update logistics status
- Manage transportation
- Transfer ownership
- Track deliveries

#### 🏪 Retailer
- Verify product authenticity
- Manage inventory
- Update retail pricing
- View supply chain history
- Process sales

#### 👥 Consumer
- Scan QR for product verification
- View complete provenance timeline
- Check certifications
- Verify authenticity
- Access quality reports

#### 🔐 Admin
- Monitor network activity
- Manage user validation
- System analytics
- Dispute resolution
- Network governance

#### ✅ Validator
- Validate blockchain events
- Earn validation rewards
- Confirm transactions
- Maintain network integrity

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for responsive design
- **Supabase** for database and real-time features
- **Lucide React** for icons
- **React Router** for navigation
- **Context API** for state management

### QR Code System
- HMAC-SHA256 signature validation
- Time-limited tokens (24-hour expiry)
- Tamper-proof payload encryption
- Cross-platform scanning support

### Data Layer
- Supabase PostgreSQL for production data
- Local storage for offline fallback
- Extensible for backend integration
- Real-time synchronization ready

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Modern web browser
- Camera access for QR scanning (optional)

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Database Setup (Supabase)

1. **Create Supabase Project**: Go to https://supabase.com and create a new project
2. **Get Credentials**: Copy your project URL and anon key
3. **Environment Variables**: Create `.env` file with your Supabase credentials:
   ```bash
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. **Run Migrations**: Execute the SQL in `supabase/migrations/create_tables.sql` in your Supabase SQL editor
5. **Enable RLS**: Row Level Security is automatically enabled with the migration

### Demo Login
1. Select any role (Farmer, Distributor, Retailer, Consumer, Admin, Validator)
2. Enter any email and password
3. Explore role-specific features

### Supabase Configuration

The project is pre-configured with Supabase integration. The environment variables are already set up in the `.env` file:

- **Database URL**: https://jqnxqxrsotjimikxrhax.supabase.co
- **Anonymous Key**: Configured for public access
- **Database Schema**: Automatically created via migrations

#### Database Setup

1. The database schema is defined in `supabase/migrations/20250918190846_jolly_gate.sql`
2. Tables include: users, products, orders, smart_contracts, certificates, transactions, supply_chain_events
3. Row Level Security (RLS) is enabled for all tables
4. Policies are configured for role-based access control

### MetaMask & Ethereum Setup

#### Prerequisites

1. **Install MetaMask**: Browser extension for Ethereum wallet management
2. **Get Sepolia ETH**: Use faucets like https://sepoliafaucet.com/
3. **Deploy Contract**: Use Remix IDE to deploy the AgriChainContract.sol
4. **Update Contract Address**: Replace the address in ethereum.ts service

## 🔧 Usage Guide

#### Step-by-Step MetaMask Integration

1. **Install MetaMask Extension**:
   - Go to https://metamask.io/
   - Install the browser extension
   - Create a new wallet or import existing one

2. **Add Sepolia Testnet**:
   - Open MetaMask
   - Click network dropdown (usually shows "Ethereum Mainnet")
   - Click "Add Network" → "Add a network manually"
   - Enter Sepolia details:
     - Network Name: Sepolia Test Network
     - RPC URL: https://sepolia.infura.io/v3/YOUR_INFURA_KEY
     - Chain ID: 11155111
     - Currency Symbol: SEP
     - Block Explorer: https://sepolia.etherscan.io/

3. **Get Test ETH**:
   - Visit https://sepoliafaucet.com/
   - Enter your MetaMask wallet address
   - Request test ETH (usually 0.5 SEP per request)

4. **Deploy Smart Contract**:
   - Open https://remix.ethereum.org/
   - Create new file: `AgriChainContract.sol`
   - Copy contract code from `src/contracts/AgriChainContract.sol`
   - Compile with Solidity 0.8.19+
   - Deploy to Sepolia using MetaMask
   - Copy deployed contract address

5. **Update Frontend**:
   - Replace `CONTRACT_ADDRESS` in `src/services/ethereum.ts`
   - The app will automatically detect MetaMask and connect

#### How MetaMask Integration Works

- **Automatic Detection**: App detects MetaMask on page load
- **Network Switching**: Automatically switches to Sepolia if needed
- **Transaction Signing**: All blockchain transactions require MetaMask approval
- **Balance Display**: Real-time ETH balance shown in header
- **Error Handling**: User-friendly error messages for common issues

### For Farmers
1. **Register Products**: Add new batches with detailed information
2. **Generate QR Codes**: Create secure QR codes for each product
3. **Track Sales**: Monitor product journey through supply chain
4. **Manage Certifications**: Upload and manage organic/quality certificates

### For Distributors/Retailers
1. **Scan QR Codes**: Verify product authenticity
2. **Update Status**: Log product movement and handling
3. **Transfer Ownership**: Update blockchain records
4. **Monitor Inventory**: Track product flow

### For Consumers
1. **Verify Products**: Scan QR codes for authenticity
2. **View History**: See complete supply chain journey
3. **Check Certifications**: Verify organic and quality standards
4. **Report Issues**: Flag suspicious products

## 🎯 Key Features Demonstrated

### Authentication & Authorization
- Role-based access control
- Secure session management
- User profile management

### Product Management
- Comprehensive product registration
- Batch tracking and identification
- Certification management
- Status updates throughout lifecycle

### QR Code Security
- Cryptographic signature validation
- Time-limited token system
- Tamper detection
- Cross-device compatibility

### Supply Chain Transparency
- End-to-end product journey
- Real-time status updates
- IoT sensor integration
- Immutable audit trail

### Smart Dashboard Analytics
- Role-specific metrics
- Real-time activity feeds
- Performance indicators
- Trend analysis

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **QR Codes**: qrcode library
- **Storage**: LocalStorage with sync capabilities
- **Blockchain**: Ethereum with Ethers.js and MetaMask
- **Routing**: React Router DOM
- **State**: React Context + Hooks
- **Build**: Vite
- **Real-time**: Supabase Realtime
- **Styling**: Tailwind CSS + Custom Components

## 📱 Mobile Support

- Responsive design for all screen sizes
- Touch-optimized interactions
- Camera access for QR scanning
- Offline capability
- PWA features ready

## 🔒 Security Features

- HMAC-SHA256 QR code signing
- Time-limited token validation
- Role-based access control
- Secure data handling
- Tamper detection

## 🌐 Scalability

### Ready for Production
- Supabase backend with PostgreSQL database
- Modular component architecture
- Extensible type system
- Real-time data synchronization
- Environment-based configuration
- Row Level Security for data protection

### Backend Integration Ready
- Supabase APIs with full CRUD operations
- Real-time subscriptions for live updates
- Ethereum blockchain integration
- IoT data ingestion endpoints

## 📊 Demo Data

The platform includes comprehensive demo data:
- Database migrations with sample data
- Supabase integration with fallback to localStorage
- Realistic supply chain events
- Mock IoT sensor readings
- User profiles across all roles
- Smart contract examples

## 🔄 Future Enhancements

- Mainnet deployment and Layer 2 scaling
- Advanced Supabase features (Edge Functions, Storage)
- Mobile app (React Native)
- IoT device connectivity
- Advanced analytics dashboard
- Multi-language support
- Payment gateway integration

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines and submit pull requests for any improvements.

---

**FarmLedger** - Bringing transparency and trust to agricultural supply chains through blockchain technology.

## 🏆 Smart India Hackathon (SIH)

This project was developed as part of the Smart India Hackathon, focusing on revolutionizing agricultural supply chain management through blockchain technology and modern web development practices.