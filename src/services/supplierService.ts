
import { supabase } from '@/integrations/supabase/client';
import { Supplier } from '@/types';
import { SupplierRow } from '@/types/supabaseTypes';

// Adapter function to convert Supabase rows to our app type
export function adaptSupplierFromSupabase(row: SupplierRow): Supplier {
  return {
    id: row.id,
    name: row.name || '',
    country: row.country || '',
    contactPerson: row.contact_person || '',
    email: row.email || '',
    phone: row.phone || '',
    rating: row.rating || 0,
    onTimeDeliveryRate: row.on_time_delivery_rate || 0,
    comments: [], // Fetched separately
    location: row.location || '',
  };
}

// Adapter function to convert our app type to Supabase insert type
export function adaptSupplierForSupabase(supplier: Partial<Supplier>) {
  return {
    id: supplier.id,
    name: supplier.name,
    country: supplier.country,
    contact_person: supplier.contactPerson,
    email: supplier.email,
    phone: supplier.phone,
    rating: supplier.rating,
    on_time_delivery_rate: supplier.onTimeDeliveryRate,
    location: supplier.location,
  };
}

// Service functions
export async function fetchSuppliers() {
  const { data, error } = await supabase.from('suppliers').select('*');
  
  if (error) {
    console.error('Error fetching suppliers:', error);
    return [];
  }
  
  return data.map(adaptSupplierFromSupabase);
}

export async function fetchSupplierById(id: string) {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching supplier ${id}:`, error);
    return null;
  }
  
  return adaptSupplierFromSupabase(data);
}

export async function createSupplier(supplier: Partial<Supplier>) {
  const { data, error } = await supabase
    .from('suppliers')
    .insert(adaptSupplierForSupabase(supplier))
    .select()
    .single();
  
  if (error) {
    console.error('Error creating supplier:', error);
    return null;
  }
  
  return adaptSupplierFromSupabase(data);
}

export async function updateSupplier(id: string, supplier: Partial<Supplier>) {
  const { data, error } = await supabase
    .from('suppliers')
    .update(adaptSupplierForSupabase(supplier))
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating supplier ${id}:`, error);
    return null;
  }
  
  return adaptSupplierFromSupabase(data);
}

export async function deleteSupplier(id: string) {
  const { error } = await supabase
    .from('suppliers')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting supplier ${id}:`, error);
    return false;
  }
  
  return true;
}
