
import { supabase } from '@/integrations/supabase/client';
import { Milestone } from '@/types';
import { MilestoneRow } from '@/types/supabaseTypes';

// Adapter function to convert Supabase rows to our app type
export function adaptMilestoneFromSupabase(row: MilestoneRow): Milestone {
  return {
    id: row.id,
    title: row.title || '',
    dueDate: row.due_date || '',
    completed: row.completed || false,
    projectId: row.project_id || '',
    poId: row.po_id || '',
  };
}

// Adapter function to convert our app type to Supabase insert type
export function adaptMilestoneForSupabase(milestone: Partial<Milestone>) {
  return {
    id: milestone.id,
    title: milestone.title,
    due_date: milestone.dueDate,
    completed: milestone.completed,
    project_id: milestone.projectId,
    po_id: milestone.poId,
  };
}

// Service functions
export async function fetchMilestones() {
  const { data, error } = await supabase.from('milestones').select('*');
  
  if (error) {
    console.error('Error fetching milestones:', error);
    return [];
  }
  
  return data.map(adaptMilestoneFromSupabase);
}

export async function fetchMilestoneById(id: string) {
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching milestone ${id}:`, error);
    return null;
  }
  
  return adaptMilestoneFromSupabase(data);
}

export async function fetchMilestonesByProject(projectId: string) {
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .eq('project_id', projectId);
  
  if (error) {
    console.error(`Error fetching milestones for project ${projectId}:`, error);
    return [];
  }
  
  return data.map(adaptMilestoneFromSupabase);
}

export async function fetchMilestonesByPO(poId: string) {
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .eq('po_id', poId);
  
  if (error) {
    console.error(`Error fetching milestones for PO ${poId}:`, error);
    return [];
  }
  
  return data.map(adaptMilestoneFromSupabase);
}

export async function createMilestone(milestone: Partial<Milestone>) {
  const { data, error } = await supabase
    .from('milestones')
    .insert(adaptMilestoneForSupabase(milestone))
    .select()
    .single();
  
  if (error) {
    console.error('Error creating milestone:', error);
    return null;
  }
  
  return adaptMilestoneFromSupabase(data);
}

export async function updateMilestone(id: string, milestone: Partial<Milestone>) {
  const { data, error } = await supabase
    .from('milestones')
    .update(adaptMilestoneForSupabase(milestone))
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating milestone ${id}:`, error);
    return null;
  }
  
  return adaptMilestoneFromSupabase(data);
}

export async function deleteMilestone(id: string) {
  const { error } = await supabase
    .from('milestones')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting milestone ${id}:`, error);
    return false;
  }
  
  return true;
}
