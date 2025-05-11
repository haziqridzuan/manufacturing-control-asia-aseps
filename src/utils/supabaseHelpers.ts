
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
import {
  adaptClient,
  adaptExternalLink,
  adaptMilestone,
  adaptProject,
  adaptPurchaseOrder,
  adaptSupplier,
  adaptTeamMember,
  adaptToExternalLinkRow,
  adaptToPurchaseOrderRow,
  adaptToProjectRow,
  adaptToSupplierRow
} from './typeAdapters';

// Projects
export const fetchProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*');
    
  if (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
  
  return data.map(adaptProject) as Project[];
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
  
  return adaptProject(data);
};

export const createProject = async (project: Omit<Project, 'id'>) => {
  const { data, error } = await supabase
    .from('projects')
    .insert([adaptToProjectRow(project)])
    .select();
    
  if (error) {
    console.error('Error creating project:', error);
    throw error;
  }
  
  return adaptProject(data[0]);
};

export const updateProject = async (id: string, project: Partial<Project>) => {
  const { data, error } = await supabase
    .from('projects')
    .update(adaptToProjectRow(project))
    .eq('id', id)
    .select();
    
  if (error) {
    console.error(`Error updating project ${id}:`, error);
    throw error;
  }
  
  return adaptProject(data[0]);
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
  
  return data.map(adaptSupplier) as Supplier[];
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
  
  return adaptSupplier(data);
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
  
  return data.map(adaptPurchaseOrder) as PurchaseOrder[];
};

export const fetchPurchaseOrdersByProject = async (projectId: string) => {
  const { data, error } = await supabase
    .from('purchase_orders')
    .select('*')
    .eq('project_id', projectId);
    
  if (error) {
    console.error(`Error fetching purchase orders for project ${projectId}:`, error);
    throw error;
  }
  
  return data.map(adaptPurchaseOrder) as PurchaseOrder[];
};

// Milestones
export const fetchMilestonesByProject = async (projectId: string) => {
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .eq('project_id', projectId);
    
  if (error) {
    console.error(`Error fetching milestones for project ${projectId}:`, error);
    throw error;
  }
  
  return data.map(adaptMilestone) as Milestone[];
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
  
  return data.map(adaptExternalLink) as ExternalLink[];
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
  
  return data.map(adaptClient) as Client[];
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
  
  return data.map(adaptTeamMember) as TeamMember[];
};

// Create or update functions for other entities
export const createSupplier = async (supplier: Omit<Supplier, 'id' | 'comments'>) => {
  const { data, error } = await supabase
    .from('suppliers')
    .insert([adaptToSupplierRow(supplier)])
    .select();
    
  if (error) {
    console.error('Error creating supplier:', error);
    throw error;
  }
  
  return adaptSupplier(data[0]);
};

export const updateSupplier = async (id: string, supplier: Partial<Supplier>) => {
  const { data, error } = await supabase
    .from('suppliers')
    .update(adaptToSupplierRow(supplier))
    .eq('id', id)
    .select();
    
  if (error) {
    console.error(`Error updating supplier ${id}:`, error);
    throw error;
  }
  
  return adaptSupplier(data[0]);
};

export const createPurchaseOrder = async (order: Omit<PurchaseOrder, 'id'>) => {
  const { data, error } = await supabase
    .from('purchase_orders')
    .insert([adaptToPurchaseOrderRow(order)])
    .select();
    
  if (error) {
    console.error('Error creating purchase order:', error);
    throw error;
  }
  
  return adaptPurchaseOrder(data[0]);
};

export const updatePurchaseOrder = async (id: string, order: Partial<PurchaseOrder>) => {
  const { data, error } = await supabase
    .from('purchase_orders')
    .update(adaptToPurchaseOrderRow(order))
    .eq('id', id)
    .select();
    
  if (error) {
    console.error(`Error updating purchase order ${id}:`, error);
    throw error;
  }
  
  return adaptPurchaseOrder(data[0]);
};

export const createExternalLink = async (link: Omit<ExternalLink, 'id'>) => {
  const { data, error } = await supabase
    .from('external_links')
    .insert([adaptToExternalLinkRow(link)])
    .select();
    
  if (error) {
    console.error('Error creating external link:', error);
    throw error;
  }
  
  return adaptExternalLink(data[0]);
};

export const updateExternalLink = async (id: string, link: Partial<ExternalLink>) => {
  const { data, error } = await supabase
    .from('external_links')
    .update(adaptToExternalLinkRow(link))
    .eq('id', id)
    .select();
    
  if (error) {
    console.error(`Error updating external link ${id}:`, error);
    throw error;
  }
  
  return adaptExternalLink(data[0]);
};
