
import { supabase } from "@/integrations/supabase/client";
import { ProjectInsert, ProjectRow } from "@/types/supabaseTypes";

export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
  
  return data as ProjectRow[];
}

export async function getProjectById(id: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
  
  return data as ProjectRow;
}

export async function getProjectsBySupplierId(supplierId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('supplier_id', supplierId);
    
  if (error) {
    console.error('Error fetching projects by supplier:', error);
    throw error;
  }
  
  return data as ProjectRow[];
}

export async function createProject(project: ProjectInsert) {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single();
    
  if (error) {
    console.error('Error creating project:', error);
    throw error;
  }
  
  return data as ProjectRow;
}

export async function updateProject(id: string, updates: Partial<ProjectInsert>) {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating project:', error);
    throw error;
  }
  
  return data as ProjectRow;
}

export async function deleteProject(id: string) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
  
  return true;
}
