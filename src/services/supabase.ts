import { createClient } from '@supabase/supabase-js';
import { Product, User, Order, SmartContract, Certificate } from '../types';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database service class
export class SupabaseService {
  // User Management
  async createUser(user: Omit<User, 'id' | 'createdAt'>) {
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getUser(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateUser(id: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Product Management
  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        ...product,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getProducts(farmerId?: string) {
    let query = supabase.from('products').select('*');
    
    if (farmerId) {
      query = query.eq('farmer_id', farmerId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async updateProduct(id: string, updates: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Order Management
  async createOrder(order: Omit<Order, 'id' | 'createdAt'>) {
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        ...order,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getOrders(userId?: string) {
    let query = supabase.from('orders').select('*');
    
    if (userId) {
      query = query.or(`buyer_id.eq.${userId},seller_id.eq.${userId}`);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async updateOrderStatus(id: string, status: Order['status']) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Smart Contract Management
  async createSmartContract(contract: Omit<SmartContract, 'id' | 'createdAt'>) {
    const { data, error } = await supabase
      .from('smart_contracts')
      .insert([{
        ...contract,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getSmartContracts(userId?: string) {
    let query = supabase.from('smart_contracts').select('*');
    
    if (userId) {
      query = query.or(`buyer_id.eq.${userId},seller_id.eq.${userId}`);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async updateSmartContract(id: string, updates: Partial<SmartContract>) {
    const { data, error } = await supabase
      .from('smart_contracts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Certificate Management
  async createCertificate(certificate: Omit<Certificate, 'id'>) {
    const { data, error } = await supabase
      .from('certificates')
      .insert([certificate])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getCertificates(productId?: string) {
    let query = supabase.from('certificates').select('*');
    
    if (productId) {
      query = query.eq('product_id', productId);
    }
    
    const { data, error } = await query.order('issued_date', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Real-time subscriptions
  subscribeToProducts(callback: (payload: any) => void) {
    return supabase
      .channel('products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, callback)
      .subscribe();
  }

  subscribeToOrders(callback: (payload: any) => void) {
    return supabase
      .channel('orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, callback)
      .subscribe();
  }
}

// Export singleton instance
export const supabaseService = new SupabaseService();