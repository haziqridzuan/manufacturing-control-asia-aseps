
import {
  Project,
  Supplier,
  PurchaseOrder,
  SupplierComment,
  Milestone,
  ExternalLink,
  Client,
  TeamMember,
  ProjectStatus,
  POStatus
} from '@/types';
import {
  ProjectRow,
  SupplierRow,
  PurchaseOrderRow,
  SupplierCommentRow,
  MilestoneRow,
  ExternalLinkRow,
  ClientRow,
  TeamMemberRow,
} from '@/types/supabaseTypes';

// Function to adapt Supabase Supplier row to our app's Supplier type
export function adaptSupplier(row: SupplierRow): Supplier {
  return {
    id: row.id,
    name: row.name,
    country: row.country,
    contactPerson: row.contact_person,
    email: row.email,
    phone: row.phone,
    rating: row.rating,
    onTimeDeliveryRate: row.on_time_delivery_rate,
    comments: [], // Comments will need to be loaded separately
    location: row.location || '',
  };
}

// Function to adapt Supabase Project row to our app's Project type
export function adaptProject(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    status: row.status as ProjectStatus,
    progress: row.progress,
    startDate: row.start_date,
    deadline: row.deadline,
    budget: row.budget,
    supplierId: row.supplier_id,
    location: row.location,
    milestones: [], // Milestones will need to be loaded separately
    projectManager: row.project_manager || undefined,
    manufacturingManager: row.manufacturing_manager || undefined,
  };
}

// Function to adapt Supabase PurchaseOrder row to our app's PurchaseOrder type
export function adaptPurchaseOrder(row: PurchaseOrderRow): PurchaseOrder {
  return {
    id: row.id,
    poNumber: row.po_number,
    projectId: row.project_id,
    partName: row.part_name,
    quantity: row.quantity,
    supplierId: row.supplier_id,
    clientId: row.client_id,
    clientName: row.client_name,
    dateCreated: row.date_created,
    contractualDeadline: row.contractual_deadline || '',
    placedBy: row.placed_by,
    status: row.status as POStatus,
    shipmentDate: row.shipment_date || undefined,
    notes: row.notes || undefined,
    progress: row.progress || 0,
  };
}

// Function to adapt Supabase Milestone row to our app's Milestone type
export function adaptMilestone(row: MilestoneRow): Milestone {
  return {
    id: row.id,
    title: row.title,
    dueDate: row.due_date,
    completed: row.completed,
    projectId: row.project_id,
  };
}

// Function to adapt Supabase ExternalLink row to our app's ExternalLink type
export function adaptExternalLink(row: ExternalLinkRow): ExternalLink {
  return {
    id: row.id,
    title: row.title,
    url: row.url,
    type: row.type as any,
    dateAdded: row.date_added,
    projectId: row.project_id || undefined,
    poId: row.po_id || undefined,
    description: row.description || undefined,
  };
}

// Function to adapt Supabase Client row to our app's Client type
export function adaptClient(row: ClientRow): Client {
  return {
    id: row.id,
    name: row.name,
    contactPerson: row.contact_person,
    email: row.email,
    phone: row.phone,
    country: row.country || '',
    address: row.address || undefined,
    notes: row.notes || undefined,
  };
}

// Function to adapt Supabase TeamMember row to our app's TeamMember type
export function adaptTeamMember(row: TeamMemberRow): TeamMember {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    email: row.email,
    department: row.department || '',
    phone: row.phone || undefined,
  };
}

// Functions to adapt our app types to Supabase row types for insert/update operations
export function adaptToSupplierRow(supplier: Partial<Supplier>): Partial<SupplierRow> {
  return {
    id: supplier.id,
    name: supplier.name,
    country: supplier.country,
    contact_person: supplier.contactPerson,
    email: supplier.email,
    phone: supplier.phone,
    rating: supplier.rating,
    on_time_delivery_rate: supplier.onTimeDeliveryRate,
    location: supplier.location,
  };
}

export function adaptToProjectRow(project: Partial<Project>): Partial<ProjectRow> {
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    status: project.status,
    progress: project.progress,
    start_date: project.startDate,
    deadline: project.deadline,
    budget: project.budget,
    supplier_id: project.supplierId,
    location: project.location,
    project_manager: project.projectManager,
    manufacturing_manager: project.manufacturingManager,
  };
}

export function adaptToPurchaseOrderRow(po: Partial<PurchaseOrder>): Partial<PurchaseOrderRow> {
  return {
    id: po.id,
    po_number: po.poNumber,
    project_id: po.projectId,
    part_name: po.partName,
    quantity: po.quantity,
    supplier_id: po.supplierId,
    client_id: po.clientId,
    client_name: po.clientName,
    date_created: po.dateCreated,
    contractual_deadline: po.contractualDeadline,
    placed_by: po.placedBy,
    status: po.status,
    shipment_date: po.shipmentDate,
    notes: po.notes,
    progress: po.progress,
  };
}

export function adaptToExternalLinkRow(link: Partial<ExternalLink>): Partial<ExternalLinkRow> {
  return {
    id: link.id,
    title: link.title,
    url: link.url,
    type: link.type,
    date_added: link.dateAdded,
    project_id: link.projectId,
    po_id: link.poId,
    description: link.description,
  };
}
