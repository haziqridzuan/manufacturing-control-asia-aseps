import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StatusBadge from '@/components/ui/StatusBadge';
import { Supplier, Project, PurchaseOrder, Client, TeamMember, ExternalLink, ExternalLinkType, ProjectStatus, POStatus } from '@/types';
import { suppliers, projects, clients, teamMembers, purchaseOrders } from '@/data/mockData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { adaptSupabaseSupplierToApp, adaptSupabaseProjectToApp, adaptSupabasePOToApp } from '@/utils/typeAdapters';

const Admin = () => {
  // Suppliers state
  const [suppliersList, setSuppliersList] = useState<Supplier[]>(suppliers);
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  
  // Projects state
  const [projectsList, setProjectsList] = useState<Project[]>(projects);
  const [showAddProject, setShowAddProject] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  
  // POs state
  const [posList, setPosList] = useState<PurchaseOrder[]>(purchaseOrders);
  const [showAddPO, setShowAddPO] = useState(false);
  const [editPO, setEditPO] = useState<PurchaseOrder | null>(null);
  
  // Clients state
  const [clientsList, setClientsList] = useState<Client[]>(clients);
  const [showAddClient, setShowAddClient] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  
  // Team members state
  const [teamMembersList, setTeamMembersList] = useState<TeamMember[]>(teamMembers);
  const [showAddTeamMember, setShowAddTeamMember] = useState(false);
  const [editTeamMember, setEditTeamMember] = useState<TeamMember | null>(null);
  
  useEffect(() => {
    // In a real app, this would fetch data from Supabase
    const fetchData = async () => {
      try {
        // Fetch suppliers
        const { data: suppliersData, error: suppliersError } = await supabase
          .from('suppliers')
          .select('*');
          
        if (suppliersError) {
          console.error('Error fetching suppliers:', suppliersError);
        } else if (suppliersData) {
          // Convert Supabase data to app format
          const adaptedSuppliers = suppliersData.map(adaptSupabaseSupplierToApp);
          setSuppliersList(adaptedSuppliers);
        }
        
        // Fetch projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*');
          
        if (projectsError) {
          console.error('Error fetching projects:', projectsError);
        } else if (projectsData) {
          // Convert Supabase data to app format
          const adaptedProjects = projectsData.map(adaptSupabaseProjectToApp);
          setProjectsList(adaptedProjects);
        }
        
        // Fetch purchase orders
        const { data: posData, error: posError } = await supabase
          .from('purchase_orders')
          .select('*');
          
        if (posError) {
          console.error('Error fetching purchase orders:', posError);
        } else if (posData) {
          // Convert Supabase data to app format
          const adaptedPOs = posData.map(adaptSupabasePOToApp);
          setPosList(adaptedPOs);
        }
        
        // Fetch clients and team members similarly
        
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    // Uncomment when Supabase is connected
    // fetchData();
  }, []);
  
  // Create new supplier
  const createNewSupplier = () => {
    const newSupplier: Supplier = {
      id: `s${suppliersList.length + 1}`,
      name: '',
      country: '',
      contactPerson: '',
      email: '',
      phone: '',
      rating: 3.0,
      onTimeDeliveryRate: 0,
      comments: [],
      location: ''
    };
    
    setEditSupplier(newSupplier);
    setShowAddSupplier(true);
  };
  
  // Save supplier
  const saveSupplier = async () => {
    if (!editSupplier) return;
    
    try {
      if (editSupplier.id.startsWith('s')) {
        // New supplier - convert to Supabase format
        const supabaseSupplier = {
          name: editSupplier.name,
          country: editSupplier.country,
          contact_person: editSupplier.contactPerson,
          email: editSupplier.email,
          phone: editSupplier.phone,
          rating: editSupplier.rating,
          on_time_delivery_rate: editSupplier.onTimeDeliveryRate,
          location: editSupplier.location
        };
        
        const { data, error } = await supabase
          .from('suppliers')
          .insert([supabaseSupplier]);
          
        if (error) {
          console.error('Error adding supplier:', error);
          toast({
            title: "Error",
            description: "Failed to add supplier",
            variant: "destructive",
          });
          return;
        }
        
        setSuppliersList([...suppliersList, editSupplier]);
        toast({
          title: "Success",
          description: "Supplier added successfully",
        });
      } else {
        // Update existing supplier - convert to Supabase format
        const supabaseSupplier = {
          id: editSupplier.id,
          name: editSupplier.name,
          country: editSupplier.country,
          contact_person: editSupplier.contactPerson,
          email: editSupplier.email,
          phone: editSupplier.phone,
          rating: editSupplier.rating,
          on_time_delivery_rate: editSupplier.onTimeDeliveryRate,
          location: editSupplier.location
        };
        
        const { error } = await supabase
          .from('suppliers')
          .update(supabaseSupplier)
          .eq('id', editSupplier.id);
          
        if (error) {
          console.error('Error updating supplier:', error);
          toast({
            title: "Error",
            description: "Failed to update supplier",
            variant: "destructive",
          });
          return;
        }
        
        setSuppliersList(suppliersList.map(s => 
          s.id === editSupplier.id ? editSupplier : s
        ));
        toast({
          title: "Success",
          description: "Supplier updated successfully",
        });
      }
      
      setShowAddSupplier(false);
      setEditSupplier(null);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };
  
  // Create new project
  const createNewProject = () => {
    const newProject: Project = {
      id: `p${projectsList.length + 1}`,
      name: '',
      description: '',
      status: 'pending',
      progress: 0,
      startDate: new Date().toISOString().split('T')[0],
      deadline: new Date().toISOString().split('T')[0],
      budget: 0,
      supplierId: suppliers[0].id,
      location: '',
      milestones: [],
      clientName: '',
      clientId: clients[0].id,
      projectManager: ''
    };
    
    setEditProject(newProject);
    setShowAddProject(true);
  };
  
  // Save project
  const saveProject = async () => {
    if (!editProject) return;
    
    try {
      if (editProject.id.startsWith('p')) {
        // New project - convert to Supabase format
        const supabaseProject = {
          name: editProject.name,
          description: editProject.description,
          status: editProject.status,
          progress: editProject.progress,
          start_date: editProject.startDate,
          deadline: editProject.deadline,
          budget: editProject.budget,
          supplier_id: editProject.supplierId,
          location: editProject.location,
          project_manager: editProject.projectManager,
          client_name: editProject.clientName,
          client_id: editProject.clientId
        };
        
        const { data, error } = await supabase
          .from('projects')
          .insert([supabaseProject]);
          
        if (error) {
          console.error('Error adding project:', error);
          toast({
            title: "Error",
            description: "Failed to add project",
            variant: "destructive",
          });
          return;
        }
        
        setProjectsList([...projectsList, editProject]);
        toast({
          title: "Success",
          description: "Project added successfully",
        });
      } else {
        // Update existing project - convert to Supabase format
        const supabaseProject = {
          id: editProject.id,
          name: editProject.name,
          description: editProject.description,
          status: editProject.status,
          progress: editProject.progress,
          start_date: editProject.startDate,
          deadline: editProject.deadline,
          budget: editProject.budget,
          supplier_id: editProject.supplierId,
          location: editProject.location,
          project_manager: editProject.projectManager,
          client_name: editProject.clientName,
          client_id: editProject.clientId
        };
        
        const { error } = await supabase
          .from('projects')
          .update(supabaseProject)
          .eq('id', editProject.id);
          
        if (error) {
          console.error('Error updating project:', error);
          toast({
            title: "Error",
            description: "Failed to update project",
            variant: "destructive",
          });
          return;
        }
        
        setProjectsList(projectsList.map(p => 
          p.id === editProject.id ? editProject : p
        ));
        toast({
          title: "Success",
          description: "Project updated successfully",
        });
      }
      
      setShowAddProject(false);
      setEditProject(null);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };
  
  // Create new PO
  const createNewPO = () => {
    const newPO: PurchaseOrder = {
      id: `po${posList.length + 1}`,
      poNumber: `PO-${new Date().getTime().toString().slice(-6)}`,
      projectId: projects[0].id,
      partName: '',
      quantity: 0,
      supplierId: suppliers[0].id,
      clientId: clients[0].id,
      clientName: clients[0].name,
      dateCreated: new Date().toISOString().split('T')[0],
      contractualDeadline: new Date().toISOString().split('T')[0],
      placedBy: '',
      status: 'active',
      progress: 0
    };
    
    setEditPO(newPO);
    setShowAddPO(true);
  };
  
  // Save PO
  const savePO = async () => {
    if (!editPO) return;
    
    try {
      if (editPO.id.startsWith('po')) {
        // New PO - convert to Supabase format
        const supabasePO = {
          po_number: editPO.poNumber,
          project_id: editPO.projectId,
          part_name: editPO.partName,
          quantity: editPO.quantity,
          supplier_id: editPO.supplierId,
          client_id: editPO.clientId,
          client_name: editPO.clientName,
          date_created: editPO.dateCreated,
          contractual_deadline: editPO.contractualDeadline,
          placed_by: editPO.placedBy,
          status: editPO.status,
          progress: editPO.progress || 0
        };
        
        const { data, error } = await supabase
          .from('purchase_orders')
          .insert([supabasePO]);
          
        if (error) {
          console.error('Error adding PO:', error);
          toast({
            title: "Error",
            description: "Failed to add purchase order",
            variant: "destructive",
          });
          return;
        }
        
        setPosList([...posList, editPO]);
        toast({
          title: "Success",
          description: "Purchase order added successfully",
        });
      } else {
        // Update existing PO - convert to Supabase format
        const supabasePO = {
          id: editPO.id,
          po_number: editPO.poNumber,
          project_id: editPO.projectId,
          part_name: editPO.partName,
          quantity: editPO.quantity,
          supplier_id: editPO.supplierId,
          client_id: editPO.clientId,
          client_name: editPO.clientName,
          date_created: editPO.dateCreated,
          contractual_deadline: editPO.contractualDeadline,
          placed_by: editPO.placedBy,
          status: editPO.status,
          progress: editPO.progress || 0
        };
        
        const { error } = await supabase
          .from('purchase_orders')
          .update(supabasePO)
          .eq('id', editPO.id);
          
        if (error) {
          console.error('Error updating PO:', error);
          toast({
            title: "Error",
            description: "Failed to update purchase order",
            variant: "destructive",
          });
          return;
        }
        
        setPosList(posList.map(p => 
          p.id === editPO.id ? editPO : p
        ));
        toast({
          title: "Success",
          description: "Purchase order updated successfully",
        });
      }
      
      setShowAddPO(false);
      setEditPO(null);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
      </div>
      
      <Tabs defaultValue="projects">
        <TabsList className="mb-4">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="purchaseOrders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>
        
        {/* Projects Tab */}
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Manage Projects</CardTitle>
                <Button onClick={createNewProject}>Add New Project</Button>
              </div>
            </CardHeader>
            <CardContent>
              {showAddProject ? (
                <div className="space-y-4 border p-4 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Project Name</Label>
                      <Input 
                        id="name" 
                        value={editProject?.name || ''} 
                        onChange={e => setEditProject(prev => prev ? {...prev, name: e.target.value} : null)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location" 
                        value={editProject?.location || ''} 
                        onChange={e => setEditProject(prev => prev ? {...prev, location: e.target.value} : null)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client">Client</Label>
                      <Select 
                        value={editProject?.clientId} 
                        onValueChange={value => setEditProject(prev => prev ? {...prev, clientId: value} : null)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map(client => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input 
                        id="startDate" 
                        type="date" 
                        value={editProject?.startDate || ''} 
                        onChange={e => setEditProject(prev => prev ? {...prev, startDate: e.target.value} : null)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deadline">Deadline</Label>
                      <Input 
                        id="deadline" 
                        type="date" 
                        value={editProject?.deadline || ''} 
                        onChange={e => setEditProject(prev => prev ? {...prev, deadline: e.target.value} : null)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget Spent</Label>
                      <Input 
                        id="budget" 
                        type="number" 
                        value={editProject?.budget || 0} 
                        onChange={e => setEditProject(prev => prev ? {...prev, budget: Number(e.target.value)} : null)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        value={editProject?.status} 
                        onValueChange={value => setEditProject(prev => prev ? {...prev, status: value as ProjectStatus} : null)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="delayed">Delayed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="progress">Progress (%)</Label>
                      <Input 
                        id="progress" 
                        type="number" 
                        min="0"
                        max="100"
                        value={editProject?.progress || 0} 
                        onChange={e => setEditProject(prev => prev ? {...prev, progress: Number(e.target.value)} : null)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="projectManager">Project Manager</Label>
                      <Input 
                        id="projectManager" 
                        value={editProject?.projectManager || ''} 
                        onChange={e => setEditProject(prev => prev ? {...prev, projectManager: e.target.value} : null)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPerson">Client Contact Person</Label>
                      <Input 
                        id="contactPerson" 
                        value={editProject?.clientName || ''} 
                        onChange={e => setEditProject(prev => prev ? {...prev, clientName: e.target.value} : null)} 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input 
                      id="description" 
                      value={editProject?.description || ''} 
                      onChange={e => setEditProject(prev => prev ? {...prev, description: e.target.value} : null)} 
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => {
                      setShowAddProject(false);
                      setEditProject(null);
                    }}>Cancel</Button>
                    <Button onClick={saveProject}>Save Project</Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="py-3 px-4 text-left">Project Name</th>
                        <th className="py-3 px-4 text-left">Client</th>
                        <th className="py-3 px-4 text-left">Client Contact</th>
                        <th className="py-3 px-4 text-left">Status</th>
                        <th className="py-3 px-4 text-left">Progress</th>
                        <th className="py-3 px-4 text-left">Budget Spent</th>
                        <th className="py-3 px-4 text-left">Deadline</th>
                        <th className="py-3 px-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectsList.map(project => (
                        <tr key={project.id} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{project.name}</td>
                          <td className="py-3 px-4">{project.clientName || "N/A"}</td>
                          <td className="py-3 px-4">{project.clientId ? "Contact Person" : "N/A"}</td>
                          <td className="py-3 px-4">
                            <StatusBadge status={project.status} />
                          </td>
                          <td className="py-3 px-4">{project.progress}%</td>
                          <td className="py-3 px-4">${project.budget.toLocaleString()}</td>
                          <td className="py-3 px-4">{project.deadline}</td>
                          <td className="py-3 px-4">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setEditProject(project);
                                setShowAddProject(true);
                              }}
                            >
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Suppliers Tab */}
        <TabsContent value="suppliers">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Manage Suppliers</CardTitle>
                <Button onClick={createNewSupplier}>Add New Supplier</Button>
              </div>
            </CardHeader>
            <CardContent>
              {showAddSupplier ? (
                <div className="space-y-4 border p-4 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Supplier Name</Label>
                      <Input
                        id="name"
                        value={editSupplier?.name || ''}
                        onChange={e => setEditSupplier(prev => prev ? { ...prev, name: e.target.value } : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={editSupplier?.country || ''}
                        onChange={e => setEditSupplier(prev => prev ? { ...prev, country: e.target.value } : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPerson">Contact Person</Label>
                      <Input
                        id="contactPerson"
                        value={editSupplier?.contactPerson || ''}
                        onChange={e => setEditSupplier(prev => prev ? { ...prev, contactPerson: e.target.value } : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editSupplier?.email || ''}
                        onChange={e => setEditSupplier(prev => prev ? { ...prev, email: e.target.value } : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={editSupplier?.phone || ''}
                        onChange={e => setEditSupplier(prev => prev ? { ...prev, phone: e.target.value } : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rating">Rating (1-5)</Label>
                      <Input
                        id="rating"
                        type="number"
                        min="1"
                        max="5"
                        step="0.1"
                        value={editSupplier?.rating || 3.0}
                        onChange={e => setEditSupplier(prev => prev ? { ...prev, rating: Number(e.target.value) } : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="onTimeDeliveryRate">On-Time Delivery Rate (%)</Label>
                      <Input
                        id="onTimeDeliveryRate"
                        type="number"
                        min="0"
                        max="100"
                        value={editSupplier?.onTimeDeliveryRate || 0}
                        onChange={e => setEditSupplier(prev => prev ? { ...prev, onTimeDeliveryRate: Number(e.target.value) } : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={editSupplier?.location || ''}
                        onChange={e => setEditSupplier(prev => prev ? { ...prev, location: e.target.value } : null)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => {
                      setShowAddSupplier(false);
                      setEditSupplier(null);
                    }}>Cancel</Button>
                    <Button onClick={saveSupplier}>Save Supplier</Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="py-3 px-4 text-left">Supplier Name</th>
                        <th className="py-3 px-4 text-left">Country</th>
                        <th className="py-3 px-4 text-left">Contact Person</th>
                        <th className="py-3 px-4 text-left">Email</th>
                        <th className="py-3 px-4 text-left">Phone</th>
                        <th className="py-3 px-4 text-left">Rating</th>
                        <th className="py-3 px-4 text-left">On-Time Delivery</th>
                        <th className="py-3 px-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suppliersList.map(supplier => (
                        <tr key={supplier.id} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{supplier.name}</td>
                          <td className="py-3 px-4">{supplier.country}</td>
                          <td className="py-3 px-4">{supplier.contactPerson}</td>
                          <td className="py-3 px-4">{supplier.email}</td>
                          <td className="py-3 px-4">{supplier.phone}</td>
                          <td className="py-3 px-4">{supplier.rating}</td>
                          <td className="py-3 px-4">{supplier.onTimeDeliveryRate}%</td>
                          <td className="py-3 px-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditSupplier(supplier);
                                setShowAddSupplier(true);
                              }}
                            >
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Clients Tab */}
        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Manage Clients</CardTitle>
                <Button onClick={() => setShowAddClient(true)}>Add New Client</Button>
              </div>
            </CardHeader>
            <CardContent>
              {showAddClient ? (
                <div className="space-y-4 border p-4 rounded-md">
                  {/* Add Client Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Client Name</Label>
                      <Input id="name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPerson">Contact Person</Label>
                      <Input id="contactPerson" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" type="tel" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Input id="notes" />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowAddClient(false)}>Cancel</Button>
                    <Button>Save Client</Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="py-3 px-4 text-left">Client Name</th>
                        <th className="py-3 px-4 text-left">Contact Person</th>
                        <th className="py-3 px-4 text-left">Email</th>
                        <th className="py-3 px-4 text-left">Phone</th>
                        <th className="py-3 px-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientsList.map(client => (
                        <tr key={client.id} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{client.name}</td>
                          <td className="py-3 px-4">{client.contactPerson}</td>
                          <td className="py-3 px-4">{client.email}</td>
                          <td className="py-3 px-4">{client.phone}</td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Purchase Orders Tab */}
        <TabsContent value="purchaseOrders">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Manage Purchase Orders</CardTitle>
                <Button onClick={createNewPO}>Add New Purchase Order</Button>
              </div>
            </CardHeader>
            <CardContent>
              {showAddPO ? (
                <div className="space-y-4 border p-4 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="poNumber">PO Number</Label>
                      <Input 
                        id="poNumber" 
                        value={editPO?.poNumber || ''} 
                        onChange={e => setEditPO(prev => prev ? {...prev, poNumber: e.target.value} : null)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="projectId">Project</Label>
                      <Select 
                        value={editPO?.projectId} 
                        onValueChange={value => setEditPO(prev => prev ? {...prev, projectId: value} : null)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map(project => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="partName">Part Name</Label>
                      <Input 
                        id="partName" 
                        value={editPO?.partName || ''} 
                        onChange={e => setEditPO(prev => prev ? {...prev, partName: e.target.value} : null)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input 
                        id="quantity" 
                        type="number"
                        value={editPO?.quantity || 0} 
                        onChange={e => setEditPO(prev => prev ? {...prev, quantity: Number(e.target.value)} : null)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supplierId">Supplier</Label>
                      <Select 
                        value={editPO?.supplierId} 
                        onValueChange={value => setEditPO(prev => prev ? {...prev, supplierId: value} : null)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select supplier" />
                        </SelectTrigger>
                        <SelectContent>
                          {suppliers.map(supplier => (
                            <SelectItem key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateCreated">Date Created</Label>
                      <Input 
                        id="dateCreated" 
                        type="date"
                        value={editPO?.dateCreated || ''} 
                        onChange={e => setEditPO(prev => prev ? {...prev, dateCreated: e.target.value} : null)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contractualDeadline">Deadline</Label>
                      <Input 
                        id="contractualDeadline" 
                        type="date"
                        value={editPO?.contractualDeadline || ''} 
                        onChange={e => setEditPO(prev => prev ? {...prev, contractualDeadline: e.target.value} : null)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="placedBy">Placed By</Label>
                      <Input 
                        id="placedBy" 
                        value={editPO?.placedBy || ''} 
                        onChange={e => setEditPO(prev => prev ? {...prev, placedBy: e.target.value} : null)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        value={editPO?.status} 
                        onValueChange={value => setEditPO(prev => prev ? {...prev, status: value as POStatus} : null)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => {
                      setShowAddPO(false);
                      setEditPO(null);
                    }}>Cancel</Button>
                    <Button onClick={savePO}>Save Purchase Order</Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="py-3 px-4 text-left">PO Number</th>
                        <th className="py-3 px-4 text-left">Project</th>
                        <th className="py-3 px-4 text-left">Supplier</th>
                        <th className="py-3 px-4 text-left">Part Name</th>
                        <th className="py-3 px-4 text-left">Quantity</th>
                        <th className="py-3 px-4 text-left">Deadline</th>
                        <th className="py-3 px-4 text-left">Status</th>
                        <th className="py-3 px-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {posList.map(po => (
                        <tr key={po.id} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{po.poNumber}</td>
                          <td className="py-3 px-4">{projects.find(p => p.id === po.projectId)?.name || "N/A"}</td>
                          <td className="py-3 px-4">{suppliers.find(s => s.id === po.supplierId)?.name || "N/A"}</td>
                          <td className="py-3 px-4">{po.partName}</td>
                          <td className="py-3 px-4">{po.quantity}</td>
                          <td className="py-3 px-4">{po.contractualDeadline}</td>
                          <td className="py-3 px-4">{po.status}</td>
                          <td className="py-3 px-4">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setEditPO(po);
                                setShowAddPO(true);
                              }}
                            >
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Team Tab */}
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Manage Team Members</CardTitle>
                <Button onClick={() => setShowAddTeamMember(true)}>Add New Team Member</Button>
              </div>
            </CardHeader>
            <CardContent>
              {showAddTeamMember ? (
                <div className="space-y-4 border p-4 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input id="role" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" type="tel" />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowAddTeamMember(false)}>Cancel</Button>
                    <Button>Save Team Member</Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="py-3 px-4 text-left">Name</th>
                        <th className="py-3 px-4 text-left">Role</th>
                        <th className="py-3 px-4 text-left">Email</th>
                        <th className="py-3 px-4 text-left">Phone</th>
                        <th className="py-3 px-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamMembersList.map(member => (
                        <tr key={member.id} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{member.name}</td>
                          <td className="py-3 px-4">{member.role}</td>
                          <td className="py-3 px-4">{member.email}</td>
                          <td className="py-3 px-4">{member.phone}</td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
