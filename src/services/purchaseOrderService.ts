
import { supabase } from '@/integrations/supabase/client';
import { PurchaseOrder } from '@/types';
import { PurchaseOrderRow } from '@/types/supabaseTypes';

// Adapter function to convert Supabase rows to our app type
export function adaptPurchaseOrderFromSupabase(row: PurchaseOrderRow): PurchaseOrder {
  return {
    id: row.id,
    poNumber: row.po_number || '',
    projectId: row.project_id || '',
    partName: row.part_name || '',
    quantity: row.quantity || 0,
    supplierId: row.supplier_id || '',
    clientId: row.client_id || '',
    clientName: row.client_name || '',
    dateCreated: row.date_created || '',
    contractualDeadline: row.contractual_deadline || '',
    placedBy: row.placed_by || '',
    status: row.status as any || 'active',
    shipmentDate: row.shipment_date || '',
    notes: row.notes || '',
    progress: row.progress || 0,
    budgetSpent: row.budget_spent || 0,
  };
}

// Adapter function to convert our app type to Supabase insert type
export function adaptPurchaseOrderForSupabase(po: Partial<PurchaseOrder>) {
  return {
    id: po.id,
    po_number: po.poNumber,
    project_id: po.projectId,
    part_name: po.partName,
    quantity: po.quantity,
    supplier_id: po.supplierId,
    client_id: po.clientId,
    client_name: po.clientName,
    date_created: po.dateCreated,
    contractual_deadline: po.contractualDeadline,
    placed_by: po.placedBy,
    status: po.status,
    shipment_date: po.shipmentDate,
    notes: po.notes,
    progress: po.progress,
    budget_spent: po.budgetSpent,
  };
}

// Service functions
export async function fetchPurchaseOrders() {
  const { data, error } = await supabase.from('purchase_orders').select('*');
  
  if (error) {
    console.error('Error fetching purchase orders:', error);
    return [];
  }
  
  return data.map(adaptPurchaseOrderFromSupabase);
}

export async function fetchPurchaseOrderById(id: string) {
  const { data, error } = await supabase
    .from('purchase_orders')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching purchase order ${id}:`, error);
    return null;
  }
  
  return adaptPurchaseOrderFromSupabase(data);
}

export async function fetchPurchaseOrdersByProject(projectId: string) {
  const { data, error } = await supabase
    .from('purchase_orders')
    .select('*')
    .eq('project_id', projectId);
  
  if (error) {
    console.error(`Error fetching purchase orders for project ${projectId}:`, error);
    return [];
  }
  
  return data.map(adaptPurchaseOrderFromSupabase);
}

export async function fetchPurchaseOrdersBySupplier(supplierId: string) {
  const { data, error } = await supabase
    .from('purchase_orders')
    .select('*')
    .eq('supplier_id', supplierId);
  
  if (error) {
    console.error(`Error fetching purchase orders for supplier ${supplierId}:`, error);
    return [];
  }
  
  return data.map(adaptPurchaseOrderFromSupabase);
}

export async function createPurchaseOrder(po: Partial<PurchaseOrder>) {
  const { data, error } = await supabase
    .from('purchase_orders')
    .insert(adaptPurchaseOrderForSupabase(po))
    .select()
    .single();
  
  if (error) {
    console.error('Error creating purchase order:', error);
    return null;
  }
  
  return adaptPurchaseOrderFromSupabase(data);
}

export async function updatePurchaseOrder(id: string, po: Partial<PurchaseOrder>) {
  const { data, error } = await supabase
    .from('purchase_orders')
    .update(adaptPurchaseOrderForSupabase(po))
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating purchase order ${id}:`, error);
    return null;
  }
  
  return adaptPurchaseOrderFromSupabase(data);
}

export async function deletePurchaseOrder(id: string) {
  const { error } = await supabase
    .from('purchase_orders')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting purchase order ${id}:`, error);
    return false;
  }
  
  return true;
}
