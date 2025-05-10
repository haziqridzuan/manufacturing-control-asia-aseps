import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { projects, suppliers, purchaseOrders, getSupplierById } from '@/data/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PurchaseOrder, POStatus, Project, Supplier, Client, TeamMember, Milestone, ExternalLink, ExternalLinkType } from '@/types';
import { Edit, Plus, Trash2, Download, FileArchive, Link2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

// Mock data for clients and team members
const clients: Client[] = [
  { id: 'c1', name: 'Global Motors', contactPerson: 'John Smith', email: 'john@globalmotors.com', phone: '+1-555-1234', country: 'USA' },
  { id: 'c2', name: 'EuroTech Industries', contactPerson: 'Maria Rodriguez', email: 'maria@eurotech.eu', phone: '+44-20-7123-4567', country: 'UK' },
  { id: 'c3', name: 'Asia Pacific Electronics', contactPerson: 'Chen Wei', email: 'chen@apelectronics.com', phone: '+81-3-1234-5678', country: 'Japan' }
];

const teamMembers: TeamMember[] = [
  { id: 't1', name: 'Sarah Johnson', role: 'Project Manager', email: 'sarah@aseps.com', department: 'Project Management' },
  { id: 't2', name: 'David Chen', role: 'Manufacturing Manager', email: 'david@aseps.com', department: 'Manufacturing' },
  { id: 't3', name: 'Lisa Wong', role: 'Quality Control Specialist', email: 'lisa@aseps.com', department: 'Quality Assurance' }
];

// Mock external links data
const externalLinks: ExternalLink[] = [
  {
    id: "link1",
    title: "Weekly Report - Project Alpha",
    url: "https://example.com/reports/alpha-week-12",
    type: "weekly-report",
    projectId: "p1",
    dateAdded: "2025-04-28"
  },
  {
    id: "link2",
    title: "Manufacturing Photos - Chassis Components",
    url: "https://example.com/manufacturing/photos/chassis",
    type: "manufacturing-control",
    projectId: "p2",
    poId: "po2",
    dateAdded: "2025-04-25"
  }
];

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const [projectsList, setProjectsList] = useState<Project[]>([...projects]);
  const [suppliersList, setSuppliersList] = useState<Supplier[]>([...suppliers]);
  const [poList, setPOList] = useState<PurchaseOrder[]>([...purchaseOrders]);
  const [clientsList, setClientsList] = useState<Client[]>([...clients]);
  const [teamList, setTeamList] = useState<TeamMember[]>([...teamMembers]);
  const [milestonesList, setMilestonesList] = useState<Milestone[]>([]);
  const [linksList, setLinksList] = useState<ExternalLink[]>([...externalLinks]);
  
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const [editPO, setEditPO] = useState<PurchaseOrder | null>(null);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [editTeamMember, setEditTeamMember] = useState<TeamMember | null>(null);
  const [editMilestone, setEditMilestone] = useState<Milestone | null>(null);
  const [selectedProjectForMilestones, setSelectedProjectForMilestones] = useState<string>("");
  const [editLink, setEditLink] = useState<ExternalLink | null>(null);
  
  const [isNewProject, setIsNewProject] = useState(false);
  const [isNewPO, setIsNewPO] = useState(false);
  const [isNewSupplier, setIsNewSupplier] = useState(false);
  const [isNewClient, setIsNewClient] = useState(false);
  const [isNewTeamMember, setIsNewTeamMember] = useState(false);
  const [isNewMilestone, setIsNewMilestone] = useState(false);
  const [isNewLink, setIsNewLink] = useState(false);
  
  // Export settings
  const [exportDateFrom, setExportDateFrom] = useState<string>("");
  const [exportDateTo, setExportDateTo] = useState<string>("");
  const [exportSupplier, setExportSupplier] = useState<string>("");
  const [exportClient, setExportClient] = useState<string>("");
  const [exportProject, setExportProject] = useState<string>("");
  
  useEffect(() => {
    // Load milestones when a project is selected
    if (selectedProjectForMilestones) {
      const project = projectsList.find(p => p.id === selectedProjectForMilestones);
      if (project) {
        setMilestonesList(project.milestones || []);
      }
    }
  }, [selectedProjectForMilestones, projectsList]);
  
  const handleLogin = () => {
    if (password === '1234') {
      setAuthenticated(true);
      toast.success('Successfully logged in to admin panel');
    } else {
      toast.error('Incorrect password');
    }
  };

  const handleAddNewProject = () => {
    const newProject: Project = {
      id: '',
      name: 'New Project',
      status: 'pending',
      progress: 0,
      startDate: new Date().toISOString().split('T')[0],
      deadline: '',
      supplierId: suppliersList[0]?.id || '',
      location: '',
      description: '',
      budget: 0,
      milestones: [],
      projectManager: '',
      manufacturingManager: ''
    };
    
    setEditProject(newProject);
    setIsNewProject(true);
  };

  const handleAddNewSupplier = () => {
    const newSupplier: Supplier = {
      id: '',
      name: 'New Supplier',
      country: '',
      contactPerson: '',
      email: '',
      phone: '',
      rating: 3.0,
      onTimeDeliveryRate: 0,
      comments: [], // Add the missing comments array
      location: ''  // Add the missing location property
    };
    
    setEditSupplier(newSupplier);
    setIsNewSupplier(true);
  };

  const handleSaveProject = () => {
    if (!editProject) return;
    
    let updatedProjects;
    
    if (isNewProject) {
      // Generate new ID for new project
      const newId = `p${projectsList.length + 1}`;
      updatedProjects = [...projectsList, { ...editProject, id: newId }];
      toast.success('New project added!');
    } else {
      updatedProjects = projectsList.map(project => 
        project.id === editProject.id ? editProject : project
      );
      toast.success('Project changes saved!');
    }
    
    setProjectsList(updatedProjects);
    setEditProject(null);
    setIsNewProject(false);
    
    // Update the global projects array for other components to use
    Object.assign(projects, updatedProjects);
  };

  const handleSaveSupplier = () => {
    if (!editSupplier) return;
    
    let updatedSuppliers;
    
    if (isNewSupplier) {
      // Generate new ID for new supplier
      const newId = `s${suppliersList.length + 1}`;
      updatedSuppliers = [...suppliersList, { ...editSupplier, id: newId }];
      toast.success('New supplier added!');
    } else {
      updatedSuppliers = suppliersList.map(supplier => 
        supplier.id === editSupplier.id ? editSupplier : supplier
      );
      toast.success('Supplier changes saved!');
    }
    
    setSuppliersList(updatedSuppliers);
    setEditSupplier(null);
    setIsNewSupplier(false);
    
    // Update the global suppliers array for other components to use
    Object.assign(suppliers, updatedSuppliers);
  };

  const handleSavePO = () => {
    if (!editPO) return;
    
    let updatedPOs;
    
    if (isNewPO) {
      // Generate new ID for new PO
      const newId = `po${poList.length + 1}`;
      updatedPOs = [...poList, { ...editPO, id: newId }];
      toast.success('New purchase order added!');
    } else {
      updatedPOs = poList.map(po => 
        po.id === editPO.id ? editPO : po
      );
      toast.success('Purchase order changes saved!');
    }
    
    setPOList(updatedPOs);
    setEditPO(null);
    setIsNewPO(false);
    
    // Update the global purchaseOrders array for other components to use
    purchaseOrders.length = 0;
    purchaseOrders.push(...updatedPOs);
  };

  const handleAddNewPO = () => {
    const newPO: PurchaseOrder = {
      id: '', // Will be set when saved
      poNumber: `PO-${new Date().getFullYear()}-${String(poList.length + 1).padStart(3, '0')}`,
      projectId: projects[0].id,
      partName: '',
      quantity: 0,
      supplierId: suppliers[0].id,
      clientId: clients[0].id,
      clientName: clients[0].name,
      dateCreated: new Date().toISOString().split('T')[0],
      contractualDeadline: new Date().toISOString().split('T')[0], // Add the required contractualDeadline field
      placedBy: '',
      status: 'active',
      progress: 0
    };
    setEditPO(newPO);
    setIsNewPO(true);
  };

  const handleDeletePO = (id: string) => {
    const updatedPOs = poList.filter(po => po.id !== id);
    setPOList(updatedPOs);
    
    // Update the global purchaseOrders array
    purchaseOrders.length = 0;
    purchaseOrders.push(...updatedPOs);
    
    toast.success('Purchase order deleted!');
  };

  const handleAddNewClient = () => {
    const newClient: Client = {
      id: '',
      name: 'New Client',
      contactPerson: '',
      email: '',
      phone: '',
      country: ''
    };
    
    setEditClient(newClient);
    setIsNewClient(true);
  };

  const handleSaveClient = () => {
    if (!editClient) return;
    
    let updatedClients;
    
    if (isNewClient) {
      // Generate new ID for new client
      const newId = `c${clientsList.length + 1}`;
      updatedClients = [...clientsList, { ...editClient, id: newId }];
      toast.success('New client added!');
    } else {
      updatedClients = clientsList.map(client => 
        client.id === editClient.id ? editClient : client
      );
      toast.success('Client changes saved!');
    }
    
    setClientsList(updatedClients);
    setEditClient(null);
    setIsNewClient(false);
  };
  
  const handleAddNewTeamMember = () => {
    const newTeamMember: TeamMember = {
      id: '',
      name: 'New Team Member',
      role: '',
      email: '',
      department: ''
    };
    
    setEditTeamMember(newTeamMember);
    setIsNewTeamMember(true);
  };

  const handleSaveTeamMember = () => {
    if (!editTeamMember) return;
    
    let updatedTeam;
    
    if (isNewTeamMember) {
      // Generate new ID for new team member
      const newId = `t${teamList.length + 1}`;
      updatedTeam = [...teamList, { ...editTeamMember, id: newId }];
      toast.success('New team member added!');
    } else {
      updatedTeam = teamList.map(member => 
        member.id === editTeamMember.id ? editTeamMember : member
      );
      toast.success('Team member changes saved!');
    }
    
    setTeamList(updatedTeam);
    setEditTeamMember(null);
    setIsNewTeamMember(false);
  };

  const handleAddNewMilestone = () => {
    if (!selectedProjectForMilestones) {
      toast.error('Please select a project first');
      return;
    }
    
    const newMilestone: Milestone = {
      id: '',
      title: 'New Milestone',
      dueDate: new Date().toISOString().split('T')[0],
      completed: false,
      projectId: selectedProjectForMilestones
    };
    
    setEditMilestone(newMilestone);
    setIsNewMilestone(true);
  };

  const handleSaveMilestone = () => {
    if (!editMilestone || !selectedProjectForMilestones) return;
    
    let updatedMilestones;
    
    if (isNewMilestone) {
      // Generate new ID for new milestone
      const newId = `m${milestonesList.length + 1}p${selectedProjectForMilestones.slice(1)}`;
      updatedMilestones = [...milestonesList, { ...editMilestone, id: newId }];
      toast.success('New milestone added!');
    } else {
      updatedMilestones = milestonesList.map(milestone => 
        milestone.id === editMilestone.id ? editMilestone : milestone
      );
      toast.success('Milestone changes saved!');
    }
    
    setMilestonesList(updatedMilestones);
    
    // Update the milestone in the project
    const updatedProjects = projectsList.map(project => {
      if (project.id === selectedProjectForMilestones) {
        return { ...project, milestones: updatedMilestones };
      }
      return project;
    });
    
    setProjectsList(updatedProjects);
    
    // Update the global projects array
    Object.assign(projects, updatedProjects);
    
    setEditMilestone(null);
    setIsNewMilestone(false);
  };

  const handleAddNewLink = () => {
    const newLink: ExternalLink = {
      id: '',
      title: 'New External Link',
      url: '',
      type: 'weekly-report',
      dateAdded: new Date().toISOString().split('T')[0]
    };
    
    setEditLink(newLink);
    setIsNewLink(true);
  };

  const handleSaveLink = () => {
    if (!editLink) return;
    
    let updatedLinks;
    
    if (isNewLink) {
      // Generate new ID for new link
      const newId = `link${linksList.length + 1}`;
      updatedLinks = [...linksList, { ...editLink, id: newId }];
      toast.success('New external link added!');
    } else {
      updatedLinks = linksList.map(link => 
        link.id === editLink.id ? editLink : link
      );
      toast.success('External link changes saved!');
    }
    
    setLinksList(updatedLinks);
    setEditLink(null);
    setIsNewLink(false);
  };

  const handleDeleteLink = (id: string) => {
    const updatedLinks = linksList.filter(link => link.id !== id);
    setLinksList(updatedLinks);
    toast.success('External link deleted!');
  };

  const handleExportData = (format: 'csv' | 'excel') => {
    // Filter data based on export settings
    let dataToExport = [...poList];
    
    if (exportDateFrom) {
      dataToExport = dataToExport.filter(po => 
        new Date(po.dateCreated) >= new Date(exportDateFrom)
      );
    }
    
    if (exportDateTo) {
      dataToExport = dataToExport.filter(po => 
        new Date(po.dateCreated) <= new Date(exportDateTo)
      );
    }
    
    if (exportSupplier) {
      dataToExport = dataToExport.filter(po => po.supplierId === exportSupplier);
    }
    
    if (exportClient) {
      dataToExport = dataToExport.filter(po => po.clientId === exportClient);
    }
    
    if (exportProject) {
      dataToExport = dataToExport.filter(po => po.projectId === exportProject);
    }
    
    // Convert data to CSV or create Excel file
    if (format === 'csv') {
      const headers = ['ID', 'PO Number', 'Project', 'Part Name', 'Quantity', 'Supplier', 'Client', 'Date Created', 'Contractual Deadline', 'Status', 'Progress'];
      
      const csvContent = [
        headers.join(','),
        ...dataToExport.map(po => {
          const project = projectsList.find(p => p.id === po.projectId);
          const supplier = suppliersList.find(s => s.id === po.supplierId);
          
          return [
            po.id,
            po.poNumber,
            project?.name || 'N/A',
            po.partName,
            po.quantity,
            supplier?.name || 'N/A',
            po.clientName,
            po.dateCreated,
            po.contractualDeadline || 'N/A',
            po.status,
            po.progress || 0
          ].join(',');
        })
      ].join('\n');
      
      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `aseps_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Exported ${dataToExport.length} records to CSV`);
    } else {
      toast.info('Excel export functionality would be implemented with a library like xlsx');
    }
  };
  
  // Calculate on-time delivery rate
  const calculateOnTimeDeliveryRate = (supplierId: string) => {
    const supplierPOs = poList.filter(po => po.supplierId === supplierId && po.status === 'completed');
    
    if (supplierPOs.length === 0) return 0;
    
    const onTimePOs = supplierPOs.filter(po => {
      if (!po.contractualDeadline || !po.shipmentDate) return false;
      return new Date(po.shipmentDate) <= new Date(po.contractualDeadline);
    });
    
    return Math.round((onTimePOs.length / supplierPOs.length) * 100);
  };
  
  // Update supplier delivery rates
  const updateSupplierRatings = () => {
    const updatedSuppliers = suppliersList.map(supplier => ({
      ...supplier,
      onTimeDeliveryRate: calculateOnTimeDeliveryRate(supplier.id)
    }));
    
    setSuppliersList(updatedSuppliers);
    Object.assign(suppliers, updatedSuppliers);
    toast.success('Supplier delivery rates updated');
  };

  if (!authenticated) {
    return (
      <div className="container mx-auto max-w-md my-20">
        <Card>
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleLogin();
                    }
                  }}
                />
              </div>
              <Button onClick={handleLogin} className="w-full">Login</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
      </div>
      
      <Tabs defaultValue="projects">
        <TabsList className="mb-4 flex flex-wrap">
          <TabsTrigger value="projects">Manage Projects</TabsTrigger>
          <TabsTrigger value="suppliers">Manage Suppliers</TabsTrigger>
          <TabsTrigger value="pos">Manage Purchase Orders</TabsTrigger>
          <TabsTrigger value="clients">Manage Clients</TabsTrigger>
          <TabsTrigger value="team">Manage ASEPS Team</TabsTrigger>
          <TabsTrigger value="milestones">Manage Milestones</TabsTrigger>
          <TabsTrigger value="links">Manage External Links</TabsTrigger>
          <TabsTrigger value="export">Export Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Projects Management</CardTitle>
                <Button variant="outline" onClick={handleAddNewProject}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Project
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {editProject ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{isNewProject ? 'Add New' : 'Edit'} Project</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="projectName">Project Name</Label>
                      <Input 
                        id="projectName" 
                        value={editProject.name} 
                        onChange={(e) => setEditProject({...editProject, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="projectStatus">Status</Label>
                      <Select 
                        value={editProject.status}
                        onValueChange={(value) => setEditProject({...editProject, status: value as any})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="delayed">Delayed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="projectProgress">Progress (%)</Label>
                      <Input 
                        id="projectProgress" 
                        type="number" 
                        value={editProject.progress} 
                        onChange={(e) => setEditProject({...editProject, progress: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="projectBudget">Budget</Label>
                      <Input 
                        id="projectBudget" 
                        type="number" 
                        value={editProject.budget} 
                        onChange={(e) => setEditProject({...editProject, budget: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="projectManager">Project Manager</Label>
                      <Select
                        value={editProject.projectManager || ""}
                        onValueChange={(value) => setEditProject({...editProject, projectManager: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Project Manager" />
                        </SelectTrigger>
                        <SelectContent>
                          {teamList.filter(m => m.role.includes('Project Manager')).map(member => (
                            <SelectItem key={member.id} value={member.name}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="manufacturingManager">Manufacturing Manager</Label>
                      <Select
                        value={editProject.manufacturingManager || ""}
                        onValueChange={(value) => setEditProject({...editProject, manufacturingManager: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Manufacturing Manager" />
                        </SelectTrigger>
                        <SelectContent>
                          {teamList.filter(m => m.role.includes('Manufacturing')).map(member => (
                            <SelectItem key={member.id} value={member.name}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="projectSupplier">Supplier</Label>
                      <Select
                        value={editProject.supplierId}
                        onValueChange={(value) => setEditProject({...editProject, supplierId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {suppliersList.map(supplier => (
                            <SelectItem key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="projectLocation">Location</Label>
                      <Input 
                        id="projectLocation" 
                        value={editProject.location} 
                        onChange={(e) => setEditProject({...editProject, location: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="projectDescription">Description</Label>
                      <Textarea
                        id="projectDescription"
                        value={editProject.description}
                        onChange={(e) => setEditProject({...editProject, description: e.target.value})}
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => {
                      setEditProject(null);
                      setIsNewProject(false);
                    }}>Cancel</Button>
                    <Button onClick={handleSaveProject}>Save Changes</Button>
                  </div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectsList.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell>{project.name}</TableCell>
                        <TableCell>{project.status}</TableCell>
                        <TableCell>{project.progress}%</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setEditProject(project)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="suppliers">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Suppliers Management</CardTitle>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={updateSupplierRatings}>
                    Update Delivery Ratings
                  </Button>
                  <Button variant="outline" onClick={handleAddNewSupplier}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Supplier
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {editSupplier ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{isNewSupplier ? 'Add New' : 'Edit'} Supplier</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="supplierName">Supplier Name</Label>
                      <Input 
                        id="supplierName" 
                        value={editSupplier.name} 
                        onChange={(e) => setEditSupplier({...editSupplier, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="supplierCountry">Country</Label>
                      <Input 
                        id="supplierCountry" 
                        value={editSupplier.country} 
                        onChange={(e) => setEditSupplier({...editSupplier, country: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="supplierContact">Contact Person</Label>
                      <Input 
                        id="supplierContact" 
                        value={editSupplier.contactPerson} 
                        onChange={(e) => setEditSupplier({...editSupplier, contactPerson: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="supplierEmail">Email</Label>
                      <Input 
                        id="supplierEmail" 
                        type="email" 
                        value={editSupplier.email} 
                        onChange={(e) => setEditSupplier({...editSupplier, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="supplierPhone">Phone</Label>
                      <Input 
                        id="supplierPhone" 
                        value={editSupplier.phone} 
                        onChange={(e) => setEditSupplier({...editSupplier, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="supplierRating">Rating (1-5)</Label>
                      <Input 
                        id="supplierRating" 
                        type="number" 
                        min="1" 
                        max="5"
                        step="0.1" 
                        value={editSupplier.rating} 
                        onChange={(e) => setEditSupplier({...editSupplier, rating: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="deliveryRate">On-time Delivery Rate (%)</Label>
                      <Input 
                        id="deliveryRate" 
                        type="number" 
                        min="0" 
                        max="100" 
                        value={editSupplier.onTimeDeliveryRate} 
                        onChange={(e) => setEditSupplier({...editSupplier, onTimeDeliveryRate: parseFloat(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => {
                      setEditSupplier(null);
                      setIsNewSupplier(false);
                    }}>Cancel</Button>
                    <Button onClick={handleSaveSupplier}>Save Changes</Button>
                  </div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>On-Time Delivery</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suppliersList.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell>{supplier.name}</TableCell>
                        <TableCell>{supplier.country}</TableCell>
                        <TableCell>{supplier.contactPerson}</TableCell>
                        <TableCell>{supplier.onTimeDeliveryRate}%</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setEditSupplier(supplier)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pos">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Purchase Orders Management</CardTitle>
                <Button variant="outline" onClick={handleAddNewPO}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New PO
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {editPO ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{isNewPO ? 'Add New' : 'Edit'} Purchase Order</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="poNumber">PO Number</Label>
                      <Input 
                        id="poNumber" 
                        value={editPO.poNumber} 
                        onChange={(e) => setEditPO({...editPO, poNumber: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="project">Project</Label>
                      <Select 
                        value={editPO.projectId}
                        onValueChange={(value) => setEditPO({...editPO, projectId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {projectsList.map(project => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="supplier">Supplier</Label>
                      <Select 
                        value={editPO.supplierId}
                        onValueChange={(value) => setEditPO({...editPO, supplierId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {suppliersList.map(supplier => (
                            <SelectItem key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="partName">Part Name</Label>
                      <Input 
                        id="partName" 
                        value={editPO.partName} 
                        onChange={(e) => setEditPO({...editPO, partName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input 
                        id="quantity" 
                        type="number" 
                        value={editPO.quantity} 
                        onChange={(e) => setEditPO({...editPO, quantity: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="client">Client</Label>
                      <Select 
                        value={editPO.clientId}
                        onValueChange={(value) => {
                          const client = clientsList.find(c => c.id === value);
                          setEditPO({
                            ...editPO, 
                            clientId: value,
                            clientName: client?.name || 'Unknown'
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {clientsList.map(client => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="placedBy">Placed By</Label>
                      <Select 
                        value={editPO.placedBy}
                        onValueChange={(value) => setEditPO({...editPO, placedBy: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {teamList.map(member => (
                            <SelectItem key={member.id} value={member.name}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dateCreated">Date Created</Label>
                      <Input 
                        id="dateCreated" 
                        type="date" 
                        value={editPO.dateCreated} 
                        onChange={(e) => setEditPO({...editPO, dateCreated: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contractualDeadline">Contractual Deadline</Label>
                      <Input 
                        id="contractualDeadline" 
                        type="date" 
                        value={editPO.contractualDeadline || ''} 
                        onChange={(e) => setEditPO({...editPO, contractualDeadline: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="shipmentDate">Shipment Date</Label>
                      <Input 
                        id="shipmentDate" 
                        type="date" 
                        value={editPO.shipmentDate || ''} 
                        onChange={(e) => setEditPO({...editPO, shipmentDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="poStatus">Status</Label>
                      <Select 
                        value={editPO.status}
                        onValueChange={(value) => setEditPO({...editPO, status: value as POStatus})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="canceled">Canceled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="poProgress">Progress (%)</Label>
                      <Input 
                        id="poProgress" 
                        type="number" 
                        min="0"
                        max="100"
                        value={editPO.progress || 0} 
                        onChange={(e) => setEditPO({...editPO, progress: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="md:col-span-3">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea 
                        id="notes" 
                        value={editPO.notes || ''} 
                        onChange={(e) => setEditPO({...editPO, notes: e.target.value})}
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => {
                      setEditPO(null);
                      setIsNewPO(false);
                    }}>Cancel</Button>
                    <Button onClick={handleSavePO}>Save Changes</Button>
                  </div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PO Number</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Part Name</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {poList.map((po) => {
                      const project = projectsList.find(p => p.id === po.projectId);
                      const supplier = suppliersList.find(s => s.id === po.supplierId);
                      
                      return (
                        <TableRow key={po.id}>
                          <TableCell>{po.poNumber}</TableCell>
                          <TableCell>{project?.name || 'N/A'}</TableCell>
                          <TableCell>{po.partName}</TableCell>
                          <TableCell>{supplier?.name || 'N/A'}</TableCell>
                          <TableCell>{po.clientName}</TableCell>
                          <TableCell>{po.progress || 0}%</TableCell>
                          <TableCell>
                            <div className={
                              po.status === 'completed' ? 'text-status-completed' :
                              po.status === 'active' ? 'text-status-in-progress' :
                              'text-status-delayed'
                            }>
                              {po.status}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setEditPO(po)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-status-delayed"
                                onClick={() => handleDeletePO(po.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Clients Management</CardTitle>
                <Button variant="outline" onClick={handleAddNewClient}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Client
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {editClient ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{isNewClient ? 'Add New' : 'Edit'} Client</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clientName">Client Name</Label>
                      <Input 
                        id="clientName" 
                        value={editClient.name} 
                        onChange={(e) => setEditClient({...editClient, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactPerson">Contact Person</Label>
                      <Input 
                        id="contactPerson" 
                        value={editClient.contactPerson} 
                        onChange={(e) => setEditClient({...editClient, contactPerson: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientEmail">Email</Label>
                      <Input 
                        id="clientEmail" 
                        type="email" 
                        value={editClient.email} 
                        onChange={(e) => setEditClient({...editClient, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientPhone">Phone</Label>
                      <Input 
                        id="clientPhone" 
                        value={editClient.phone} 
                        onChange={(e) => setEditClient({...editClient, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientCountry">Country</Label>
                      <Input 
                        id="clientCountry" 
                        value={editClient.country || ''} 
                        onChange={(e) => setEditClient({...editClient, country: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientAddress">Address</Label>
                      <Textarea 
                        id="clientAddress" 
                        value={editClient.address || ''} 
                        onChange={(e) => setEditClient({...editClient, address: e.target.value})}
                        rows={3}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="clientNotes">Notes</Label>
                      <Textarea 
                        id="clientNotes" 
                        value={editClient.notes || ''} 
                        onChange={(e) => setEditClient({...editClient, notes: e.target.value})}
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => {
                      setEditClient(null);
                      setIsNewClient(false);
                    }}>Cancel</Button>
                    <Button onClick={handleSaveClient}>Save Changes</Button>
                  </div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact Person</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientsList.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell>{client.name}</TableCell>
                        <TableCell>{client.contactPerson}</TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>{client.phone}</TableCell>
                        <TableCell>{client.country}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setEditClient(client)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>ASEPS Team Management</CardTitle>
                <Button variant="outline" onClick={handleAddNewTeamMember}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Team Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {editTeamMember ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{isNewTeamMember ? 'Add New' : 'Edit'} Team Member</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="memberName">Name</Label>
                      <Input 
                        id="memberName" 
                        value={editTeamMember.name} 
                        onChange={(e) => setEditTeamMember({...editTeamMember, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="memberRole">Role</Label>
                      <Input 
                        id="memberRole" 
                        value={editTeamMember.role} 
                        onChange={(e) => setEditTeamMember({...editTeamMember, role: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="memberEmail">Email</Label>
                      <Input 
                        id="memberEmail" 
                        type="email" 
                        value={editTeamMember.email} 
                        onChange={(e) => setEditTeamMember({...editTeamMember, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="memberPhone">Phone</Label>
                      <Input 
                        id="memberPhone" 
                        value={editTeamMember.phone || ''} 
                        onChange={(e) => setEditTeamMember({...editTeamMember, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="memberDepartment">Department</Label>
                      <Input 
                        id="memberDepartment" 
                        value={editTeamMember.department || ''} 
                        onChange={(e) => setEditTeamMember({...editTeamMember, department: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => {
                      setEditTeamMember(null);
                      setIsNewTeamMember(false);
                    }}>Cancel</Button>
                    <Button onClick={handleSaveTeamMember}>Save Changes</Button>
                  </div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamList.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>{member.name}</TableCell>
                        <TableCell>{member.role}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.department}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setEditTeamMember(member)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="milestones">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Milestones Management</CardTitle>
                <div className="flex gap-2">
                  <Select
                    value={selectedProjectForMilestones}
                    onValueChange={setSelectedProjectForMilestones}
                  >
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectsList.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    onClick={handleAddNewMilestone}
                    disabled={!selectedProjectForMilestones}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Milestone
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!selectedProjectForMilestones ? (
                <div className="text-center py-10 text-muted-foreground">
                  Please select a project to manage its milestones
                </div>
              ) : editMilestone ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{isNewMilestone ? 'Add New' : 'Edit'} Milestone</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="milestoneTitle">Title</Label>
                      <Input 
                        id="milestoneTitle" 
                        value={editMilestone.title} 
                        onChange={(e) => setEditMilestone({...editMilestone, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="milestoneDueDate">Due Date</Label>
                      <Input 
                        id="milestoneDueDate" 
                        type="date" 
                        value={editMilestone.dueDate} 
                        onChange={(e) => setEditMilestone({...editMilestone, dueDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="milestoneCompleted">Status</Label>
                      <Select 
                        value={editMilestone.completed ? "completed" : "pending"}
                        onValueChange={(value) => setEditMilestone({
                          ...editMilestone, 
                          completed: value === "completed"
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => {
                      setEditMilestone(null);
                      setIsNewMilestone(false);
                    }}>Cancel</Button>
                    <Button onClick={handleSaveMilestone}>Save Changes</Button>
                  </div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {milestonesList.map((milestone) => (
                      <TableRow key={milestone.id}>
                        <TableCell>{milestone.title}</TableCell>
                        <TableCell>{milestone.dueDate}</TableCell>
                        <TableCell>
                          <div className={milestone.completed ? 'text-status-completed' : 'text-status-in-progress'}>
                            {milestone.completed ? 'Completed' : 'Pending'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setEditMilestone(milestone)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {milestonesList.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                          No milestones found for this project
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="links">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>External Links Management</CardTitle>
                <Button variant="outline" onClick={handleAddNewLink}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New External Link
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {editLink ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{isNewLink ? 'Add New' : 'Edit'} External Link</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="linkTitle">Title</Label>
                      <Input 
                        id="linkTitle" 
                        value={editLink.title} 
                        onChange={(e) => setEditLink({...editLink, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkType">Type</Label>
                      <Select 
                        value={editLink.type}
                        onValueChange={(value) => setEditLink({...editLink, type: value as ExternalLinkType})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly-report">Weekly Report</SelectItem>
                          <SelectItem value="manufacturing-control">Manufacturing Control</SelectItem>
                          <SelectItem value="shipment">Shipment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="linkUrl">URL</Label>
                      <Input 
                        id="linkUrl" 
                        value={editLink.url} 
                        onChange={(e) => setEditLink({...editLink, url: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkProject">Related Project (Optional)</Label>
                      <Select 
                        value={editLink.projectId || ""}
                        onValueChange={(value) => setEditLink({
                          ...editLink, 
                          projectId: value === "" ? undefined : value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {projectsList.map(project => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="linkPO">Related PO (Optional)</Label>
                      <Select 
                        value={editLink.poId || ""}
                        onValueChange={(value) => setEditLink({
                          ...editLink, 
                          poId: value === "" ? undefined : value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a PO" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {poList.map(po => (
                            <SelectItem key={po.id} value={po.id}>
                              {po.poNumber} - {po.partName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="linkDescription">Description</Label>
                      <Textarea 
                        id="linkDescription" 
                        value={editLink.description || ''} 
                        onChange={(e) => setEditLink({...editLink, description: e.target.value})}
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => {
                      setEditLink(null);
                      setIsNewLink(false);
                    }}>Cancel</Button>
                    <Button onClick={handleSaveLink}>Save Changes</Button>
                  </div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {linksList.map((link) => {
                      const project = projectsList.find(p => p.id === link.projectId);
                      
                      return (
                        <TableRow key={link.id}>
                          <TableCell>{link.title}</TableCell>
                          <TableCell>
                            {link.type.replace("-", " ")}
                          </TableCell>
                          <TableCell>{project?.name || 'N/A'}</TableCell>
                          <TableCell>
                            <a 
                              href={link.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {link.url.length > 30 ? `${link.url.substring(0, 30)}...` : link.url}
                            </a>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setEditLink(link)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-status-delayed"
                                onClick={() => handleDeleteLink(link.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    
                    {linksList.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          No external links found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle>Export Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Date Range</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <Label htmlFor="dateFrom" className="text-sm">From</Label>
                        <Input 
                          id="dateFrom" 
                          type="date" 
                          value={exportDateFrom} 
                          onChange={(e) => setExportDateFrom(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateTo" className="text-sm">To</Label>
                        <Input 
                          id="dateTo" 
                          type="date" 
                          value={exportDateTo} 
                          onChange={(e) => setExportDateTo(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="exportSupplier">Filter by Supplier</Label>
                    <Select 
                      value={exportSupplier}
                      onValueChange={setExportSupplier}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Suppliers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Suppliers</SelectItem>
                        {suppliersList.map(supplier => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="exportClient">Filter by Client</Label>
                    <Select 
                      value={exportClient}
                      onValueChange={setExportClient}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Clients" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Clients</SelectItem>
                        {clientsList.map(client => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="exportProject">Filter by Project</Label>
                    <Select 
                      value={exportProject}
                      onValueChange={setExportProject}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Projects" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Projects</SelectItem>
                        {projectsList.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex gap-4 justify-end mt-6">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setExportDateFrom("");
                      setExportDateTo("");
                      setExportSupplier("");
                      setExportClient("");
                      setExportProject("");
                    }}
                  >
                    Clear Filters
                  </Button>
                  <Button onClick={() => handleExportData('csv')} className="flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    Export to CSV
                  </Button>
                  <Button onClick={() => handleExportData('excel')} className="flex items-center">
                    <FileArchive className="h-4 w-4 mr-2" />
                    Export to Excel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
