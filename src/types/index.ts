
export type Supplier = {
  id: string;
  name: string;
  country: string;
  contactPerson: string;
  email: string;
  phone: string;
  rating: number;
  onTimeDeliveryRate: number;
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
