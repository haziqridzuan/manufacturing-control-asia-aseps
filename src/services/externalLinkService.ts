
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink } from '@/types';
import { ExternalLinkRow } from '@/types/supabaseTypes';

// Adapter function to convert Supabase rows to our app type
export function adaptExternalLinkFromSupabase(row: ExternalLinkRow): ExternalLink {
  return {
    id: row.id,
    title: row.title || '',
    url: row.url || '',
    type: row.type as any || 'weekly-report',
    projectId: row.project_id || '',
    poId: row.po_id || '',
    supplierId: row.supplier_id || '',
    clientId: row.client_id || '',
    description: row.description || '',
    dateAdded: row.date_added || '',
  };
}

// Adapter function to convert our app type to Supabase insert type
export function adaptExternalLinkForSupabase(link: Partial<ExternalLink>) {
  return {
    id: link.id,
    title: link.title,
    url: link.url,
    type: link.type,
    project_id: link.projectId,
    po_id: link.poId,
    supplier_id: link.supplierId,
    client_id: link.clientId,
    description: link.description,
    date_added: link.dateAdded,
  };
}

// Service functions
export async function fetchExternalLinks() {
  const { data, error } = await supabase.from('external_links').select('*');
  
  if (error) {
    console.error('Error fetching external links:', error);
    return [];
  }
  
  return data.map(adaptExternalLinkFromSupabase);
}

export async function fetchExternalLinkById(id: string) {
  const { data, error } = await supabase
    .from('external_links')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching external link ${id}:`, error);
    return null;
  }
  
  return adaptExternalLinkFromSupabase(data);
}

export async function fetchExternalLinksByProject(projectId: string) {
  const { data, error } = await supabase
    .from('external_links')
    .select('*')
    .eq('project_id', projectId);
  
  if (error) {
    console.error(`Error fetching external links for project ${projectId}:`, error);
    return [];
  }
  
  return data.map(adaptExternalLinkFromSupabase);
}

export async function fetchExternalLinksByPO(poId: string) {
  const { data, error } = await supabase
    .from('external_links')
    .select('*')
    .eq('po_id', poId);
  
  if (error) {
    console.error(`Error fetching external links for PO ${poId}:`, error);
    return [];
  }
  
  return data.map(adaptExternalLinkFromSupabase);
}

export async function fetchExternalLinksBySupplier(supplierId: string) {
  const { data, error } = await supabase
    .from('external_links')
    .select('*')
    .eq('supplier_id', supplierId);
  
  if (error) {
    console.error(`Error fetching external links for supplier ${supplierId}:`, error);
    return [];
  }
  
  return data.map(adaptExternalLinkFromSupabase);
}

export async function fetchExternalLinksByClient(clientId: string) {
  const { data, error } = await supabase
    .from('external_links')
    .select('*')
    .eq('client_id', clientId);
  
  if (error) {
    console.error(`Error fetching external links for client ${clientId}:`, error);
    return [];
  }
  
  return data.map(adaptExternalLinkFromSupabase);
}

export async function createExternalLink(link: Partial<ExternalLink>) {
  const { data, error } = await supabase
    .from('external_links')
    .insert(adaptExternalLinkForSupabase(link))
    .select()
    .single();
  
  if (error) {
    console.error('Error creating external link:', error);
    return null;
  }
  
  return adaptExternalLinkFromSupabase(data);
}

export async function updateExternalLink(id: string, link: Partial<ExternalLink>) {
  const { data, error } = await supabase
    .from('external_links')
    .update(adaptExternalLinkForSupabase(link))
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating external link ${id}:`, error);
    return null;
  }
  
  return adaptExternalLinkFromSupabase(data);
}

export async function deleteExternalLink(id: string) {
  const { error } = await supabase
    .from('external_links')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting external link ${id}:`, error);
    return false;
  }
  
  return true;
}
