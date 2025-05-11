
export type Supplier = {
  id: string;
  name: string;
  country: string;
  contactPerson: string;
  email: string;
  phone: string;
  rating: number;
  onTimeDeliveryRate: number;
  comments?: SupplierComment[];
  location?: string;
};

export type SupplierComment = {
  id: string;
  supplierId: string;
  text: string;
  type: 'positive' | 'negative' | 'neutral';
  date: string;
  author?: string;
};

export type ProjectStatus = 'pending' | 'in-progress' | 'delayed' | 'completed';

export type Project = {
  id: string;
  name: string;
  status: ProjectStatus;
  progress: number;
  startDate: string;
  deadline: string;
  supplierId: string;
  location: string;
  description: string;
  budget: number;
  milestones: Milestone[];
  projectManager?: string;
  manufacturingManager?: string;
};

export type Milestone = {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  projectId: string;
};

export type FilterOptions = {
  status?: ProjectStatus;
  supplier?: string;
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
};

export type POStatus = 'active' | 'completed' | 'canceled';

export type PurchaseOrder = {
  id: string;
  poNumber: string;
  projectId: string;
  partName: string;
  quantity: number;
  supplierId: string;
  clientId: string;
  clientName: string;
  dateCreated: string;
  contractualDeadline?: string;
  placedBy: string;
  status: POStatus;
  shipmentDate?: string;
  notes?: string;
  progress?: number;
};

export type ExternalLinkType = 'weekly-report' | 'manufacturing-control' | 'shipment';

export type ExternalLink = {
  id: string;
  title: string;
  url: string;
  type: ExternalLinkType;
  projectId?: string;
  poId?: string;
  description?: string;
  dateAdded: string;
};

export type Client = {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address?: string;
  country?: string;
  notes?: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  department?: string;
  photo?: string;
};
