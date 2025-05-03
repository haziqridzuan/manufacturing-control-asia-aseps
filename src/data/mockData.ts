
import { Milestone, Project, ProjectStatus, Supplier } from "@/types";

export const suppliers: Supplier[] = [
  {
    id: "s1",
    name: "Global Manufacturing Inc.",
    country: "United States",
    contactPerson: "John Smith",
    email: "john.smith@globalmanufacturing.com",
    phone: "+1 555-123-4567",
    rating: 4.8,
    onTimeDeliveryRate: 95
  },
  {
    id: "s2",
    name: "Asia Tech Solutions",
    country: "Japan",
    contactPerson: "Hiroshi Tanaka",
    email: "h.tanaka@asiatech.co.jp",
    phone: "+81 3-1234-5678",
    rating: 4.9,
    onTimeDeliveryRate: 98
  },
  {
    id: "s3",
    name: "European Fabricators Ltd",
    country: "Germany",
    contactPerson: "Anna Mueller",
    email: "a.mueller@eurofab.de",
    phone: "+49 30 12345678",
    rating: 4.5,
    onTimeDeliveryRate: 90
  },
  {
    id: "s4",
    name: "South America Materials Co.",
    country: "Brazil",
    contactPerson: "Carlos Mendez",
    email: "carlos@samaterials.com.br",
    phone: "+55 11 98765-4321",
    rating: 4.2,
    onTimeDeliveryRate: 85
  },
  {
    id: "s5",
    name: "African Industrial Partners",
    country: "South Africa",
    contactPerson: "David Nkosi",
    email: "david@africanindustrial.co.za",
    phone: "+27 11 987 6543",
    rating: 4.0,
    onTimeDeliveryRate: 80
  },
];

export const projects: Project[] = [
  {
    id: "p1",
    name: "New York Office Tower Components",
    status: "in-progress",
    progress: 65,
    startDate: "2025-01-15",
    deadline: "2025-07-30",
    supplierId: "s1",
    location: "New York, USA",
    description: "Fabrication of custom steel components for a new office tower in Manhattan.",
    budget: 1500000,
    milestones: [
      {
        id: "m1p1",
        title: "Initial Designs Approved",
        dueDate: "2025-02-15",
        completed: true,
        projectId: "p1"
      },
      {
        id: "m2p1",
        title: "Materials Procurement",
        dueDate: "2025-03-30",
        completed: true,
        projectId: "p1"
      },
      {
        id: "m3p1",
        title: "Fabrication 50% Complete",
        dueDate: "2025-05-15",
        completed: true,
        projectId: "p1"
      },
      {
        id: "m4p1",
        title: "Quality Testing",
        dueDate: "2025-06-15",
        completed: false,
        projectId: "p1"
      },
      {
        id: "m5p1",
        title: "Delivery to Site",
        dueDate: "2025-07-15",
        completed: false,
        projectId: "p1"
      }
    ]
  },
  {
    id: "p2",
    name: "Tokyo Metro Station Structures",
    status: "completed",
    progress: 100,
    startDate: "2024-08-10",
    deadline: "2025-02-28",
    supplierId: "s2",
    location: "Tokyo, Japan",
    description: "Custom steel and glass structures for a new metro station in Tokyo.",
    budget: 2200000,
    milestones: [
      {
        id: "m1p2",
        title: "Design Phase",
        dueDate: "2024-09-15",
        completed: true,
        projectId: "p2"
      },
      {
        id: "m2p2",
        title: "Material Sourcing",
        dueDate: "2024-10-20",
        completed: true,
        projectId: "p2"
      },
      {
        id: "m3p2",
        title: "Production Phase",
        dueDate: "2024-12-15",
        completed: true,
        projectId: "p2"
      },
      {
        id: "m4p2",
        title: "Testing and Quality Control",
        dueDate: "2025-01-20",
        completed: true,
        projectId: "p2"
      },
      {
        id: "m5p2",
        title: "Delivery and Installation",
        dueDate: "2025-02-25",
        completed: true,
        projectId: "p2"
      }
    ]
  },
  {
    id: "p3",
    name: "Berlin Commercial Complex",
    status: "delayed",
    progress: 40,
    startDate: "2024-11-05",
    deadline: "2025-06-15",
    supplierId: "s3",
    location: "Berlin, Germany",
    description: "Fabrication of structural elements for a new commercial complex.",
    budget: 1800000,
    milestones: [
      {
        id: "m1p3",
        title: "Design Approval",
        dueDate: "2024-12-10",
        completed: true,
        projectId: "p3"
      },
      {
        id: "m2p3",
        title: "Raw Materials Procurement",
        dueDate: "2025-01-20",
        completed: true,
        projectId: "p3"
      },
      {
        id: "m3p3",
        title: "Fabrication Process",
        dueDate: "2025-03-15",
        completed: false,
        projectId: "p3"
      },
      {
        id: "m4p3",
        title: "Quality Inspection",
        dueDate: "2025-04-30",
        completed: false,
        projectId: "p3"
      },
      {
        id: "m5p3",
        title: "Shipping and Delivery",
        dueDate: "2025-06-05",
        completed: false,
        projectId: "p3"
      }
    ]
  },
  {
    id: "p4",
    name: "Sao Paulo Bridge Components",
    status: "pending",
    progress: 0,
    startDate: "2025-06-01",
    deadline: "2025-12-15",
    supplierId: "s4",
    location: "Sao Paulo, Brazil",
    description: "Custom steel components for a new bridge project.",
    budget: 2500000,
    milestones: [
      {
        id: "m1p4",
        title: "Design Finalization",
        dueDate: "2025-07-01",
        completed: false,
        projectId: "p4"
      },
      {
        id: "m2p4",
        title: "Material Sourcing",
        dueDate: "2025-08-15",
        completed: false,
        projectId: "p4"
      },
      {
        id: "m3p4",
        title: "Manufacturing Process",
        dueDate: "2025-10-01",
        completed: false,
        projectId: "p4"
      },
      {
        id: "m4p4",
        title: "Quality Testing",
        dueDate: "2025-11-10",
        completed: false,
        projectId: "p4"
      },
      {
        id: "m5p4",
        title: "Shipping and Delivery",
        dueDate: "2025-12-05",
        completed: false,
        projectId: "p4"
      }
    ]
  },
  {
    id: "p5",
    name: "Cape Town Airport Terminal",
    status: "in-progress",
    progress: 30,
    startDate: "2025-01-20",
    deadline: "2025-09-30",
    supplierId: "s5",
    location: "Cape Town, South Africa",
    description: "Fabrication of architectural elements for a new airport terminal.",
    budget: 1900000,
    milestones: [
      {
        id: "m1p5",
        title: "Design Approval",
        dueDate: "2025-02-20",
        completed: true,
        projectId: "p5"
      },
      {
        id: "m2p5",
        title: "Materials Procurement",
        dueDate: "2025-03-30",
        completed: true,
        projectId: "p5"
      },
      {
        id: "m3p5",
        title: "Production Phase I",
        dueDate: "2025-06-15",
        completed: false,
        projectId: "p5"
      },
      {
        id: "m4p5",
        title: "Production Phase II",
        dueDate: "2025-08-10",
        completed: false,
        projectId: "p5"
      },
      {
        id: "m5p5",
        title: "Delivery and Installation",
        dueDate: "2025-09-20",
        completed: false,
        projectId: "p5"
      }
    ]
  },
  {
    id: "p6",
    name: "Dubai Skyscraper Facade",
    status: "in-progress",
    progress: 20,
    startDate: "2025-03-01",
    deadline: "2025-11-15",
    supplierId: "s2",
    location: "Dubai, UAE",
    description: "Manufacturing of custom glass and aluminum facade elements for a new skyscraper.",
    budget: 3200000,
    milestones: [
      {
        id: "m1p6",
        title: "Design Phase Completion",
        dueDate: "2025-04-15",
        completed: true,
        projectId: "p6"
      },
      {
        id: "m2p6",
        title: "Materials Sourcing",
        dueDate: "2025-05-30",
        completed: false,
        projectId: "p6"
      },
      {
        id: "m3p6",
        title: "Prototype Production",
        dueDate: "2025-07-15",
        completed: false,
        projectId: "p6"
      },
      {
        id: "m4p6",
        title: "Mass Production",
        dueDate: "2025-09-20",
        completed: false,
        projectId: "p6"
      },
      {
        id: "m5p6",
        title: "Delivery to Site",
        dueDate: "2025-10-30",
        completed: false,
        projectId: "p6"
      }
    ]
  }
];

// Helper function to get supplier name by ID
export const getSupplierById = (id: string): Supplier | undefined => {
  return suppliers.find(supplier => supplier.id === id);
};

// Helper function to get supplier by project ID
export const getSupplierByProjectId = (projectId: string): Supplier | undefined => {
  const project = projects.find(p => p.id === projectId);
  if (!project) return undefined;
  
  return suppliers.find(s => s.id === project.supplierId);
};

// Get projects by supplier ID
export const getProjectsBySupplierId = (supplierId: string): Project[] => {
  return projects.filter(project => project.supplierId === supplierId);
};

// Get projects by status
export const getProjectsByStatus = (status: ProjectStatus): Project[] => {
  return projects.filter(project => project.status === status);
};

// Get milestones by project ID
export const getMilestonesByProjectId = (projectId: string): Milestone[] => {
  const project = projects.find(p => p.id === projectId);
  return project ? project.milestones : [];
};

// Calculate days remaining until deadline
export const getDaysRemaining = (deadline: string): number => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Format date to display format
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};
