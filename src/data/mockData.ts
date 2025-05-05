import { Milestone, Project, ProjectStatus, Supplier, PurchaseOrder, POStatus } from "@/types";

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
6 title: "Production Phase I",
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

export const purchaseOrders: PurchaseOrder[] = [
  {
    id: "po1",
    poNumber: "PO-2025-001",
    projectId: "p1",
    partName: "Steel Beams Type A",
    quantity: 250,
    supplierId: "s1",
    clientName: "NYC Development Corp",
    dateCreated: "2025-01-20",
    deadline: "2025-05-10",
    placedBy: "Sarah Johnson",
    status: "active",
    notes: "Custom dimensions as per specifications"
  },
  {
    id: "po2",
    poNumber: "PO-2025-002",
    projectId: "p1",
    partName: "Connection Joints",
    quantity: 1200,
    supplierId: "s1",
    clientName: "NYC Development Corp",
    dateCreated: "2025-01-25",
    deadline: "2025-04-15",
    placedBy: "Sarah Johnson",
    status: "active",
    notes: "Heat treated as per specifications"
  },
  {
    id: "po3",
    poNumber: "PO-2024-089",
    projectId: "p2",
    partName: "Glass Panels",
    quantity: 120,
    supplierId: "s2",
    clientName: "Tokyo Metro Authority",
    dateCreated: "2024-09-05",
    deadline: "2025-01-10",
    placedBy: "Takeshi Yamamoto",
    status: "completed",
    shipmentDate: "2025-01-05",
    notes: "Special tempered glass with UV protection"
  },
  {
    id: "po4",
    poNumber: "PO-2024-090",
    projectId: "p2",
    partName: "Structural Frames",
    quantity: 85,
    supplierId: "s2",
    clientName: "Tokyo Metro Authority",
    dateCreated: "2024-09-10",
    deadline: "2024-12-20",
    placedBy: "Takeshi Yamamoto",
    status: "completed",
    shipmentDate: "2024-12-15"
  },
  {
    id: "po5",
    poNumber: "PO-2024-118",
    projectId: "p3",
    partName: "Support Columns",
    quantity: 48,
    supplierId: "s3",
    clientName: "Berlin Commercial Developers",
    dateCreated: "2024-11-15",
    deadline: "2025-02-28",
    placedBy: "Franz Mueller",
    status: "completed",
    shipmentDate: "2025-02-25"
  },
  {
    id: "po6",
    poNumber: "PO-2024-119",
    projectId: "p3",
    partName: "Facade Panels",
    quantity: 320,
    supplierId: "s3",
    clientName: "Berlin Commercial Developers",
    dateCreated: "2024-11-20",
    deadline: "2025-04-15",
    placedBy: "Franz Mueller",
    status: "active"
  },
  {
    id: "po7",
    poNumber: "PO-2025-045",
    projectId: "p5",
    partName: "Terminal Roof Trusses",
    quantity: 36,
    supplierId: "s5",
    clientName: "Cape Town Airport Authority",
    dateCreated: "2025-02-05",
    deadline: "2025-06-20",
    placedBy: "Nkosi Mbeki",
    status: "active"
  },
  {
    id: "po8",
    poNumber: "PO-2025-046",
    projectId: "p5",
    partName: "Glass Walls",
    quantity: 180,
    supplierId: "s2",
    clientName: "Cape Town Airport Authority",
    dateCreated: "2025-02-10",
    deadline: "2025-07-15",
    placedBy: "Nkosi Mbeki",
    status: "active"
  },
  {
    id: "po9",
    poNumber: "PO-2025-070",
    projectId: "p6",
    partName: "Aluminum Frames",
    quantity: 540,
    supplierId: "s2",
    clientName: "Dubai Property Development",
    dateCreated: "2025-03-15",
    deadline: "2025-08-10",
    placedBy: "Ahmed Al-Farsi",
    status: "active"
  },
  {
    id: "po10",
    poNumber: "PO-2025-071",
    projectId: "p6",
    partName: "Specialized Glass Panels",
    quantity: 480,
    supplierId: "s2",
    clientName: "Dubai Property Development",
    dateCreated: "2025-03-18",
    deadline: "2025-09-05",
    placedBy: "Ahmed Al-Farsi",
    status: "active"
  }
];

// Update projects with manager information
projects.forEach(project => {
  if (project.id === "p1") {
    project.projectManager = "John Davis";
    project.manufacturingManager = "Michael Chen";
  } else if (project.id === "p2") {
    project.projectManager = "Akira Tanaka";
    project.manufacturingManager = "Yuki Sato";
  } else if (project.id === "p3") {
    project.projectManager = "Klaus Schmidt";
    project.manufacturingManager = "Hans Muller";
  } else if (project.id === "p4") {
    project.projectManager = "Roberto Silva";
    project.manufacturingManager = "Carlos Fernandez";
  } else if (project.id === "p5") {
    project.projectManager = "David Nkosi";
    project.manufacturingManager = "Samuel Okafor";
  } else if (project.id === "p6") {
    project.projectManager = "Mohammed Al-Farsi";
    project.manufacturingManager = "Tariq Hasan";
  }
});

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

// Get purchase orders by project ID
export const getPOsByProjectId = (projectId: string): PurchaseOrder[] => {
  return purchaseOrders.filter(po => po.projectId === projectId);
};

// Get active purchase orders
export const getActivePOs = (): PurchaseOrder[] => {
  return purchaseOrders.filter(po => po.status === "active");
};

// Get completed purchase orders
export const getCompletedPOs = (): PurchaseOrder[] => {
  return purchaseOrders.filter(po => po.status === "completed");
};

// Get purchase orders by status
export const getPOsByStatus = (status: POStatus): PurchaseOrder[] => {
  return purchaseOrders.filter(po => po.status === status);
};

// Get purchase order by ID
export const getPOById = (id: string): PurchaseOrder | undefined => {
  return purchaseOrders.find(po => po.id === id);
};
