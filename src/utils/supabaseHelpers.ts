
import { supabase } from '@/integrations/supabase/client';
import type { 
  Project, 
  Supplier, 
  PurchaseOrder, 
  Client, 
  TeamMember,
  ExternalLink,
  Milestone
} from '@/types';

// Projects
export const fetchProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*');
    
  if (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
  
  return data as Project[];
};

export const fetchProjectById = async (id: string) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error(`Error fetching project ${id}:`, error);
    throw error;
  }
  
  return data as Project;
};

export const createProject = async (project: Omit<Project, 'id'>) => {
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select();
    
  if (error) {
    console.error('Error creating project:', error);
    throw error;
  }
  
  return data[0] as Project;
};

export const updateProject = async (id: string, project: Partial<Project>) => {
  const { data, error } = await supabase
    .from('projects')
    .update(project)
    .eq('id', id)
    .select();
    
  if (error) {
    console.error(`Error updating project ${id}:`, error);
    throw error;
  }
  
  return data[0] as Project;
};

// Suppliers
export const fetchSuppliers = async () => {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*');
    
  if (error) {
    console.error('Error fetching suppliers:', error);
    throw error;
  }
  
  return data as Supplier[];
};

export const fetchSupplierById = async (id: string) => {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error(`Error fetching supplier ${id}:`, error);
    throw error;
  }
  
  return data as Supplier;
};

// Purchase Orders
export const fetchPurchaseOrders = async () => {
  const { data, error } = await supabase
    .from('purchase_orders')
    .select('*');
    
  if (error) {
    console.error('Error fetching purchase orders:', error);
    throw error;
  }
  
  return data as PurchaseOrder[];
};

export const fetchPurchaseOrdersByProject = async (projectId: string) => {
  const { data, error } = await supabase
    .from('purchase_orders')
    .select('*')
    .eq('projectId', projectId);
    
  if (error) {
    console.error(`Error fetching purchase orders for project ${projectId}:`, error);
    throw error;
  }
  
  return data as PurchaseOrder[];
};

// Milestones
export const fetchMilestonesByProject = async (projectId: string) => {
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .eq('projectId', projectId);
    
  if (error) {
    console.error(`Error fetching milestones for project ${projectId}:`, error);
    throw error;
  }
  
  return data as Milestone[];
};

// External Links
export const fetchExternalLinks = async () => {
  const { data, error } = await supabase
    .from('external_links')
    .select('*');
    
  if (error) {
    console.error('Error fetching external links:', error);
    throw error;
  }
  
  return data as ExternalLink[];
};

// Fetch suppliers in Asia for a specific project
export const fetchSuppliersInAsia = async (projectId: string) => {
  const { data, error } = await supabase
    .from('suppliers')
    .select('name')
    .eq('projectId', projectId)
    .ilike('location', '%asia%');
    
  if (error) {
    console.error(`Error fetching Asia suppliers for project ${projectId}:`, error);
    throw error;
  }
  
  return data.map(supplier => supplier.name);
};

// Clients
export const fetchClients = async () => {
  const { data, error } = await supabase
    .from('clients')
    .select('*');
    
  if (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
  
  return data as Client[];
};

// Team Members
export const fetchTeamMembers = async () => {
  const { data, error } = await supabase
    .from('team_members')
    .select('*');
    
  if (error) {
    console.error('Error fetching team members:', error);
    throw error;
  }
  
  return data as TeamMember[];
};
