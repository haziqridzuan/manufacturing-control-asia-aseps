
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from '@/types';
import { TeamMemberRow } from '@/types/supabaseTypes';

// Adapter function to convert Supabase rows to our app type
export function adaptTeamMemberFromSupabase(row: TeamMemberRow): TeamMember {
  return {
    id: row.id,
    name: row.name || '',
    role: row.role || '',
    email: row.email || '',
    phone: row.phone || '',
    department: row.department || '',
    photo: row.photo || '',
  };
}

// Adapter function to convert our app type to Supabase insert type
export function adaptTeamMemberForSupabase(member: Partial<TeamMember>) {
  return {
    id: member.id,
    name: member.name,
    role: member.role,
    email: member.email,
    phone: member.phone,
    department: member.department,
    photo: member.photo,
  };
}

// Service functions
export async function fetchTeamMembers() {
  const { data, error } = await supabase.from('team_members').select('*');
  
  if (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
  
  return data.map(adaptTeamMemberFromSupabase);
}

export async function fetchTeamMemberById(id: string) {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching team member ${id}:`, error);
    return null;
  }
  
  return adaptTeamMemberFromSupabase(data);
}

export async function createTeamMember(member: Partial<TeamMember>) {
  const { data, error } = await supabase
    .from('team_members')
    .insert(adaptTeamMemberForSupabase(member))
    .select()
    .single();
  
  if (error) {
    console.error('Error creating team member:', error);
    return null;
  }
  
  return adaptTeamMemberFromSupabase(data);
}

export async function updateTeamMember(id: string, member: Partial<TeamMember>) {
  const { data, error } = await supabase
    .from('team_members')
    .update(adaptTeamMemberForSupabase(member))
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating team member ${id}:`, error);
    return null;
  }
  
  return adaptTeamMemberFromSupabase(data);
}

export async function deleteTeamMember(id: string) {
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting team member ${id}:`, error);
    return false;
  }
  
  return true;
}
