
import { supabase } from "@/integrations/supabase/client";
import { MilestoneInsert, MilestoneRow } from "@/types/supabaseTypes";

export async function getMilestonesByProjectId(projectId: string) {
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .eq('project_id', projectId)
    .order('due_date');
    
  if (error) {
    console.error('Error fetching milestones:', error);
    throw error;
  }
  
  return data as MilestoneRow[];
}

export async function createMilestone(milestone: MilestoneInsert) {
  const { data, error } = await supabase
    .from('milestones')
    .insert(milestone)
    .select()
    .single();
    
  if (error) {
    console.error('Error creating milestone:', error);
    throw error;
  }
  
  return data as MilestoneRow;
}

export async function updateMilestone(id: string, updates: Partial<MilestoneInsert>) {
  const { data, error } = await supabase
    .from('milestones')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating milestone:', error);
    throw error;
  }
  
  return data as MilestoneRow;
}

export async function deleteMilestone(id: string) {
  const { error } = await supabase
    .from('milestones')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting milestone:', error);
    throw error;
  }
  
  return true;
}
