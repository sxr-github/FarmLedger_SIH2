/*
  # AgriChain Database Schema

  1. New Tables
    - `users` - User profiles and authentication
    - `products` - Agricultural products and batches
    - `orders` - Order management and tracking
    - `smart_contracts` - Blockchain smart contract records
    - `certificates` - Product certifications
    - `transactions` - Transaction history
    - `supply_chain_events` - Product journey tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('farmer', 'distributor', 'retailer', 'consumer', 'admin', 'validator')),
  organization text,
  wallet_address text,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id text UNIQUE NOT NULL,
  name text NOT NULL,
  variety text,
  category text NOT NULL,
  farmer_id uuid REFERENCES users(id),
  current_owner_id uuid REFERENCES users(id),
  harvest_date timestamptz NOT NULL,
  expiry_date timestamptz,
  quantity numeric NOT NULL,
  unit text NOT NULL,
  location jsonb NOT NULL,
  certifications jsonb DEFAULT '[]',
  qr_code text,
  blockchain_tx_id text,
  status text DEFAULT 'registered',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id),
  buyer_id uuid REFERENCES users(id),
  seller_id uuid REFERENCES users(id),
  quantity numeric NOT NULL,
  price_per_unit numeric NOT NULL,
  total_amount numeric NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  created_at timestamptz DEFAULT now(),
  delivery_date timestamptz
);

-- Smart contracts table
CREATE TABLE IF NOT EXISTS smart_contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id),
  buyer_id uuid REFERENCES users(id),
  seller_id uuid REFERENCES users(id),
  amount numeric NOT NULL,
  currency text DEFAULT 'INR',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  escrow_released boolean DEFAULT false,
  terms text NOT NULL,
  ethereum_tx_hash text,
  ethereum_address text,
  eth_amount numeric,
  created_at timestamptz DEFAULT now()
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id),
  type text NOT NULL CHECK (type IN ('organic', 'quality', 'safety', 'origin')),
  issuer text NOT NULL,
  issued_date timestamptz NOT NULL,
  expiry_date timestamptz NOT NULL,
  certificate_number text UNIQUE NOT NULL,
  document_url text,
  verification_status text DEFAULT 'valid' CHECK (verification_status IN ('valid', 'expired', 'revoked'))
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('product_registration', 'ownership_transfer', 'payment', 'verification')),
  product_id uuid REFERENCES products(id),
  from_address text NOT NULL,
  to_address text NOT NULL,
  amount numeric DEFAULT 0,
  timestamp timestamptz DEFAULT now(),
  block_hash text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  gas_used numeric
);

-- Supply chain events table
CREATE TABLE IF NOT EXISTS supply_chain_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id),
  event_type text NOT NULL,
  from_user_id uuid REFERENCES users(id),
  to_user_id uuid REFERENCES users(id),
  location jsonb NOT NULL,
  timestamp timestamptz DEFAULT now(),
  data jsonb DEFAULT '{}',
  blockchain_tx_id text,
  iot_data jsonb DEFAULT '[]'
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_chain_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Products policies
CREATE POLICY "Anyone can read products"
  ON products
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Farmers can create products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Product owners can update"
  ON products
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = current_owner_id OR auth.uid() = farmer_id);

-- Orders policies
CREATE POLICY "Users can read their orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can create orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Order participants can update"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Smart contracts policies
CREATE POLICY "Users can read their contracts"
  ON smart_contracts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can create contracts"
  ON smart_contracts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Contract participants can update"
  ON smart_contracts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Certificates policies
CREATE POLICY "Anyone can read certificates"
  ON certificates
  FOR SELECT
  TO authenticated
  USING (true);

-- Transactions policies
CREATE POLICY "Anyone can read transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (true);

-- Supply chain events policies
CREATE POLICY "Anyone can read supply chain events"
  ON supply_chain_events
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create supply chain events"
  ON supply_chain_events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = to_user_id OR auth.uid() = from_user_id);