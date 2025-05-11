
export type ProjectStatus = "in-progress" | "completed" | "delayed" | "pending";

export type POStatus = "active" | "completed" | "cancelled";

export type SupplierCommentType = "positive" | "negative" | "neutral";

export type ExternalLinkType = "weekly-report" | "manufacturing-control" | "shipment" | "photos" | "tracking";

export interface SupplierComment {
  id: string;
  supplierId: string;
  text: string;
  type: SupplierCommentType;
  date: string;
  author: string;
}

export interface Supplier {
  id: string;
  name: string;
  country: string;
  contactPerson: string;
  email: string;
  phone: string;
  rating: number;
  onTimeDeliveryRate: number;
  comments: SupplierComment[];
  location: string;
}

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  projectId: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  startDate: string;
  deadline: string;
  budget: number;
  supplierId: string;
  location: string;
  milestones: Milestone[];
  projectManager?: string;
  manufacturingManager?: string;
  clientName?: string;
  clientId?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  projectId: string;
  partName: string;
  quantity: number;
  supplierId: string;
  clientId: string;
  clientName: string;
  dateCreated: string;
  contractualDeadline: string;
  placedBy: string;
  status: POStatus;
  shipmentDate?: string;
  notes?: string;
  progress?: number; // Added progress property to fix errors in Admin.tsx
}

// Adding missing types needed for Admin.tsx
export interface Client {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  country: string;
  address?: string;
  notes?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  department: string;
  phone?: string;
}

export interface ExternalLink {
  id: string;
  title: string;
  url: string;
  type: ExternalLinkType;
  projectId?: string;
  poId?: string;
  dateAdded: string;
  description?: string;
}

// Adding FilterOptions for Projects.tsx
export interface FilterOptions {
  status?: ProjectStatus;
  supplier?: string;
  client?: string;
  date?: string;
}
