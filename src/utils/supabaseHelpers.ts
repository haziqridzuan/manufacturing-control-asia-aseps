
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
  adaptTeamMember
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
  // Ensure all required fields are present
  const requiredProject = {
    budget: project.budget,
    deadline: project.deadline,
    description: project.description,
    location: project.location,
    name: project.name,
    progress: project.progress,
    start_date: project.startDate,
    status: project.status,
    supplier_id: project.supplierId,
    // Optional fields with defaults
    manufacturing_manager: project.manufacturingManager || null,
    project_manager: project.projectManager || null,
  };
  
  const { data, error } = await supabase
    .from('projects')
    .insert(requiredProject)
    .select();
    
  if (error) {
    console.error('Error creating project:', error);
    throw error;
  }
  
  return adaptProject(data[0]);
};

export const updateProject = async (id: string, project: Partial<Project>) => {
  // Create an object with just the fields to update using the correct structure
  const updateData: Record<string, unknown> = {};
  
  if (project.name !== undefined) updateData.name = project.name;
  if (project.description !== undefined) updateData.description = project.description;
  if (project.status !== undefined) updateData.status = project.status;
  if (project.progress !== undefined) updateData.progress = project.progress;
  if (project.startDate !== undefined) updateData.start_date = project.startDate;
  if (project.deadline !== undefined) updateData.deadline = project.deadline;
  if (project.budget !== undefined) updateData.budget = project.budget;
  if (project.supplierId !== undefined) updateData.supplier_id = project.supplierId;
  if (project.location !== undefined) updateData.location = project.location;
  if (project.projectManager !== undefined) updateData.project_manager = project.projectManager;
  if (project.manufacturingManager !== undefined) updateData.manufacturing_manager = project.manufacturingManager;
  
  const { data, error } = await supabase
    .from('projects')
    .update(updateData)
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
  // Ensure all required fields are present for the Supabase insert
  const requiredSupplier = {
    contact_person: supplier.contactPerson,
    country: supplier.country,
    email: supplier.email,
    name: supplier.name,
    on_time_delivery_rate: supplier.onTimeDeliveryRate,
    phone: supplier.phone,
    rating: supplier.rating,
    location: supplier.location || null,
  };
  
  const { data, error } = await supabase
    .from('suppliers')
    .insert(requiredSupplier)
    .select();
    
  if (error) {
    console.error('Error creating supplier:', error);
    throw error;
  }
  
  return adaptSupplier(data[0]);
};

export const updateSupplier = async (id: string, supplier: Partial<Supplier>) => {
  // Use a simpler approach without type adapters to avoid infinite recursion
  const updateData: Record<string, unknown> = {};
  
  if (supplier.name !== undefined) updateData.name = supplier.name;
  if (supplier.country !== undefined) updateData.country = supplier.country;
  if (supplier.contactPerson !== undefined) updateData.contact_person = supplier.contactPerson;
  if (supplier.email !== undefined) updateData.email = supplier.email;
  if (supplier.phone !== undefined) updateData.phone = supplier.phone;
  if (supplier.rating !== undefined) updateData.rating = supplier.rating;
  if (supplier.onTimeDeliveryRate !== undefined) updateData.on_time_delivery_rate = supplier.onTimeDeliveryRate;
  if (supplier.location !== undefined) updateData.location = supplier.location;
  
  const { data, error } = await supabase
    .from('suppliers')
    .update(updateData)
    .eq('id', id)
    .select();
    
  if (error) {
    console.error(`Error updating supplier ${id}:`, error);
    throw error;
  }
  
  return adaptSupplier(data[0]);
};

export const createPurchaseOrder = async (order: Omit<PurchaseOrder, 'id'>) => {
  // Ensure all required fields are present for Supabase insert
  const requiredPO = {
    client_id: order.clientId,
    client_name: order.clientName,
    date_created: order.dateCreated,
    part_name: order.partName,
    placed_by: order.placedBy,
    po_number: order.poNumber,
    project_id: order.projectId,
    quantity: order.quantity,
    status: order.status,
    supplier_id: order.supplierId,
    contractual_deadline: order.contractualDeadline || null,
    notes: order.notes || null,
    shipment_date: order.shipmentDate || null,
    progress: order.progress || null,
  };
  
  const { data, error } = await supabase
    .from('purchase_orders')
    .insert(requiredPO)
    .select();
    
  if (error) {
    console.error('Error creating purchase order:', error);
    throw error;
  }
  
  return adaptPurchaseOrder(data[0]);
};

export const updatePurchaseOrder = async (id: string, order: Partial<PurchaseOrder>) => {
  // Use a simpler approach without type adapters to avoid infinite recursion
  const updateData: Record<string, unknown> = {};
  
  if (order.poNumber !== undefined) updateData.po_number = order.poNumber;
  if (order.projectId !== undefined) updateData.project_id = order.projectId;
  if (order.partName !== undefined) updateData.part_name = order.partName;
  if (order.quantity !== undefined) updateData.quantity = order.quantity;
  if (order.supplierId !== undefined) updateData.supplier_id = order.supplierId;
  if (order.clientId !== undefined) updateData.client_id = order.clientId;
  if (order.clientName !== undefined) updateData.client_name = order.clientName;
  if (order.dateCreated !== undefined) updateData.date_created = order.dateCreated;
  if (order.contractualDeadline !== undefined) updateData.contractual_deadline = order.contractualDeadline;
  if (order.placedBy !== undefined) updateData.placed_by = order.placedBy;
  if (order.status !== undefined) updateData.status = order.status;
  if (order.shipmentDate !== undefined) updateData.shipment_date = order.shipmentDate;
  if (order.notes !== undefined) updateData.notes = order.notes;
  if (order.progress !== undefined) updateData.progress = order.progress;
  
  const { data, error } = await supabase
    .from('purchase_orders')
    .update(updateData)
    .eq('id', id)
    .select();
    
  if (error) {
    console.error(`Error updating purchase order ${id}:`, error);
    throw error;
  }
  
  return adaptPurchaseOrder(data[0]);
};

export const createExternalLink = async (link: Omit<ExternalLink, 'id'>) => {
  // Ensure all required fields are present for Supabase insert
  const requiredLink = {
    title: link.title,
    url: link.url,
    type: link.type,
    date_added: link.dateAdded,
    project_id: link.projectId || null,
    po_id: link.poId || null,
    description: link.description || null,
  };
  
  const { data, error } = await supabase
    .from('external_links')
    .insert(requiredLink)
    .select();
    
  if (error) {
    console.error('Error creating external link:', error);
    throw error;
  }
  
  return adaptExternalLink(data[0]);
};

export const updateExternalLink = async (id: string, link: Partial<ExternalLink>) => {
  // Use a simpler approach without type adapters to avoid infinite recursion
  const updateData: Record<string, unknown> = {};
  
  if (link.title !== undefined) updateData.title = link.title;
  if (link.url !== undefined) updateData.url = link.url;
  if (link.type !== undefined) updateData.type = link.type;
  if (link.dateAdded !== undefined) updateData.date_added = link.dateAdded;
  if (link.projectId !== undefined) updateData.project_id = link.projectId;
  if (link.poId !== undefined) updateData.po_id = link.poId;
  if (link.description !== undefined) updateData.description = link.description;
  
  const { data, error } = await supabase
    .from('external_links')
    .update(updateData)
    .eq('id', id)
    .select();
    
  if (error) {
    console.error(`Error updating external link ${id}:`, error);
    throw error;
  }
  
  return adaptExternalLink(data[0]);
};
