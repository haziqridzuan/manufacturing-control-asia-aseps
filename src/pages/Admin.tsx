
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
import { PurchaseOrder, POStatus, Project, Supplier } from '@/types';
import { Edit, Plus, Trash2 } from 'lucide-react';

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const [projectsList, setProjectsList] = useState<Project[]>([...projects]);
  const [suppliersList, setSuppliersList] = useState<Supplier[]>([...suppliers]);
  const [poList, setPOList] = useState<PurchaseOrder[]>([...purchaseOrders]);
  
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const [editPO, setEditPO] = useState<PurchaseOrder | null>(null);
  const [isNewPO, setIsNewPO] = useState(false);
  
  const handleLogin = () => {
    if (password === '1234') {
      setAuthenticated(true);
      toast.success('Successfully logged in to admin panel');
    } else {
      toast.error('Incorrect password');
    }
  };

  const handleSaveProject = () => {
    if (!editProject) return;
    
    const updatedProjects = projectsList.map(project => 
      project.id === editProject.id ? editProject : project
    );
    
    setProjectsList(updatedProjects);
    toast.success('Project changes saved!');
    setEditProject(null);
    
    // Update the global projects array for other components to use
    Object.assign(projects, updatedProjects);
  };

  const handleSaveSupplier = () => {
    if (!editSupplier) return;
    
    const updatedSuppliers = suppliersList.map(supplier => 
      supplier.id === editSupplier.id ? editSupplier : supplier
    );
    
    setSuppliersList(updatedSuppliers);
    toast.success('Supplier changes saved!');
    setEditSupplier(null);
    
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
      clientName: '',
      dateCreated: new Date().toISOString().split('T')[0],
      placedBy: '',
      status: 'active'
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
        <TabsList className="mb-4">
          <TabsTrigger value="projects">Manage Projects</TabsTrigger>
          <TabsTrigger value="suppliers">Manage Suppliers</TabsTrigger>
          <TabsTrigger value="pos">Manage Purchase Orders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Projects Management</CardTitle>
                <Button variant="outline">Add New Project</Button>
              </div>
            </CardHeader>
            <CardContent>
              {editProject ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Edit Project</h3>
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
                      <Input 
                        id="projectManager" 
                        value={editProject.projectManager || ''} 
                        onChange={(e) => setEditProject({...editProject, projectManager: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="manufacturingManager">Manufacturing Manager</Label>
                      <Input 
                        id="manufacturingManager" 
                        value={editProject.manufacturingManager || ''} 
                        onChange={(e) => setEditProject({...editProject, manufacturingManager: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setEditProject(null)}>Cancel</Button>
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
                <Button variant="outline">Add New Supplier</Button>
              </div>
            </CardHeader>
            <CardContent>
              {editSupplier ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Edit Supplier</h3>
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
                    <Button variant="outline" onClick={() => setEditSupplier(null)}>Cancel</Button>
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
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suppliersList.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell>{supplier.name}</TableCell>
                        <TableCell>{supplier.country}</TableCell>
                        <TableCell>{supplier.contactPerson}</TableCell>
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
                      <Label htmlFor="clientName">Client Name</Label>
                      <Input 
                        id="clientName" 
                        value={editPO.clientName} 
                        onChange={(e) => setEditPO({...editPO, clientName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="placedBy">Placed By</Label>
                      <Input 
                        id="placedBy" 
                        value={editPO.placedBy} 
                        onChange={(e) => setEditPO({...editPO, placedBy: e.target.value})}
                      />
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
                      <Label htmlFor="deadline">Deadline</Label>
                      <Input 
                        id="deadline" 
                        type="date" 
                        value={editPO.deadline || ''} 
                        onChange={(e) => setEditPO({...editPO, deadline: e.target.value})}
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
                    <div className="md:col-span-3">
                      <Label htmlFor="notes">Notes</Label>
                      <Input 
                        id="notes" 
                        value={editPO.notes || ''} 
                        onChange={(e) => setEditPO({...editPO, notes: e.target.value})}
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
      </Tabs>
    </div>
  );
};

export default Admin;
