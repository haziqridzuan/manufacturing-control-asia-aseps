
import { supabase } from "@/integrations/supabase/client";
import { ExternalLinkInsert, ExternalLinkRow } from "@/types/supabaseTypes";

export async function getExternalLinks() {
  const { data, error } = await supabase
    .from('external_links')
    .select('*')
    .order('date_added', { ascending: false });
    
  if (error) {
    console.error('Error fetching external links:', error);
    throw error;
  }
  
  return data as ExternalLinkRow[];
}

export async function getExternalLinkById(id: string) {
  const { data, error } = await supabase
    .from('external_links')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching external link:', error);
    throw error;
  }
  
  return data as ExternalLinkRow;
}

export async function getExternalLinksByProjectId(projectId: string) {
  const { data, error } = await supabase
    .from('external_links')
    .select('*')
    .eq('project_id', projectId);
    
  if (error) {
    console.error('Error fetching external links by project:', error);
    throw error;
  }
  
  return data as ExternalLinkRow[];
}

export async function createExternalLink(link: ExternalLinkInsert) {
  const { data, error } = await supabase
    .from('external_links')
    .insert(link)
    .select()
    .single();
    
  if (error) {
    console.error('Error creating external link:', error);
    throw error;
  }
  
  return data as ExternalLinkRow;
}

export async function updateExternalLink(id: string, updates: Partial<ExternalLinkInsert>) {
  const { data, error } = await supabase
    .from('external_links')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating external link:', error);
    throw error;
  }
  
  return data as ExternalLinkRow;
}

export async function deleteExternalLink(id: string) {
  const { error } = await supabase
    .from('external_links')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting external link:', error);
    throw error;
  }
  
  return true;
}
