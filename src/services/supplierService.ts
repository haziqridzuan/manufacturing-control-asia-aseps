
import { supabase } from "@/integrations/supabase/client";
import { SupplierInsert, SupplierRow } from "@/types/supabaseTypes";

export async function getSuppliers() {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .order('name');
    
  if (error) {
    console.error('Error fetching suppliers:', error);
    throw error;
  }
  
  return data as SupplierRow[];
}

export async function getSupplierById(id: string) {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching supplier:', error);
    throw error;
  }
  
  return data as SupplierRow;
}

export async function createSupplier(supplier: SupplierInsert) {
  const { data, error } = await supabase
    .from('suppliers')
    .insert(supplier)
    .select()
    .single();
    
  if (error) {
    console.error('Error creating supplier:', error);
    throw error;
  }
  
  return data as SupplierRow;
}

export async function updateSupplier(id: string, updates: Partial<SupplierInsert>) {
  const { data, error } = await supabase
    .from('suppliers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating supplier:', error);
    throw error;
  }
  
  return data as SupplierRow;
}

export async function deleteSupplier(id: string) {
  const { error } = await supabase
    .from('suppliers')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting supplier:', error);
    throw error;
  }
  
  return true;
}
