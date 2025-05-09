
import { supabase } from "@/integrations/supabase/client";
import { PurchaseOrderInsert, PurchaseOrderRow } from "@/types/supabaseTypes";
import { useQueryClient } from "@tanstack/react-query";

export async function getPurchaseOrders() {
  const { data, error } = await supabase
    .from('purchase_orders')
    .select('*')
    .order('date_created', { ascending: false });
    
  if (error) {
    console.error('Error fetching purchase orders:', error);
    throw error;
  }
  
  return data as PurchaseOrderRow[];
}

export async function getPurchaseOrderById(id: string) {
  const { data, error } = await supabase
    .from('purchase_orders')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching purchase order:', error);
    throw error;
  }
  
  return data as PurchaseOrderRow;
}

export async function getPurchaseOrdersByProjectId(projectId: string) {
  const { data, error } = await supabase
    .from('purchase_orders')
    .select('*')
    .eq('project_id', projectId);
    
  if (error) {
    console.error('Error fetching purchase orders by project:', error);
    throw error;
  }
  
  return data as PurchaseOrderRow[];
}

export async function createPurchaseOrder(po: PurchaseOrderInsert) {
  const { data, error } = await supabase
    .from('purchase_orders')
    .insert(po)
    .select()
    .single();
    
  if (error) {
    console.error('Error creating purchase order:', error);
    throw error;
  }

  // Invalidate queries to refresh data
  const queryClient = useQueryClient();
  queryClient?.invalidateQueries({queryKey: ['purchaseOrders']});
  
  return data as PurchaseOrderRow;
}

export async function updatePurchaseOrder(id: string, updates: Partial<PurchaseOrderInsert>) {
  const { data, error } = await supabase
    .from('purchase_orders')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating purchase order:', error);
    throw error;
  }

  // Invalidate queries to refresh data
  const queryClient = useQueryClient();
  queryClient?.invalidateQueries({queryKey: ['purchaseOrders']});
  
  return data as PurchaseOrderRow;
}

export async function deletePurchaseOrder(id: string) {
  const { error } = await supabase
    .from('purchase_orders')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting purchase order:', error);
    throw error;
  }

  // Invalidate queries to refresh data
  const queryClient = useQueryClient();
  queryClient?.invalidateQueries({queryKey: ['purchaseOrders']});
  
  return true;
}
