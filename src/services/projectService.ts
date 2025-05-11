import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types';
import { ProjectRow } from '@/types/supabaseTypes';

// Adapter function to convert Supabase rows to our app type
export function adaptProjectFromSupabase(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name || '',
    status: row.status as any || 'pending',
    progress: row.progress || 0,
    startDate: row.start_date || '',
    deadline: row.deadline || '',
    supplierId: row.supplier_id || '',
    clientId: '', // This field is not in the Supabase schema
    location: row.location || '',
    description: row.description || '',
    budget: row.budget || 0,
    milestones: [], // Fetched separately
    projectManager: row.project_manager || '',
    manufacturingManager: row.manufacturing_manager || '',
    budgetSpent: 0, // This field is not in the Supabase schema
  };
}

// Adapter function to convert our app type to Supabase insert type
export function adaptProjectForSupabase(project: Partial<Project>) {
  return {
    id: project.id,
    name: project.name,
    status: project.status,
    progress: project.progress,
    start_date: project.startDate,
    deadline: project.deadline,
    supplier_id: project.supplierId,
    location: project.location,
    description: project.description,
    budget: project.budget,
    project_manager: project.projectManager,
    manufacturing_manager: project.manufacturingManager,
    // client_id and budget_spent are not included as they're not in the schema
  };
}

// Service functions
export async function fetchProjects() {
  const { data, error } = await supabase.from('projects').select('*');
  
  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
  
  return data.map(adaptProjectFromSupabase);
}

export async function fetchProjectById(id: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching project ${id}:`, error);
    return null;
  }
  
  return adaptProjectFromSupabase(data);
}

export async function createProject(project: Partial<Project>) {
  const { data, error } = await supabase
    .from('projects')
    .insert(adaptProjectForSupabase(project))
    .select()
    .single();
  
  if (error) {
    console.error('Error creating project:', error);
    return null;
  }
  
  return adaptProjectFromSupabase(data);
}

export async function updateProject(id: string, project: Partial<Project>) {
  const { data, error } = await supabase
    .from('projects')
    .update(adaptProjectForSupabase(project))
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating project ${id}:`, error);
    return null;
  }
  
  return adaptProjectFromSupabase(data);
}

export async function deleteProject(id: string) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting project ${id}:`, error);
    return false;
  }
  
  return true;
}
