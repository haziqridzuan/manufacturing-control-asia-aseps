
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { projects, suppliers } from '@/data/mockData';

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [editProject, setEditProject] = useState<any>(null);
  const [editSupplier, setEditSupplier] = useState<any>(null);
  
  const handleLogin = () => {
    if (password === '1234') {
      setAuthenticated(true);
      toast.success('Successfully logged in to admin panel');
    } else {
      toast.error('Incorrect password');
    }
  };

  const handleSaveProject = () => {
    // In a real app, this would update the project data
    toast.success('Project changes saved!');
    setEditProject(null);
  };

  const handleSaveSupplier = () => {
    // In a real app, this would update the supplier data
    toast.success('Supplier changes saved!');
    setEditSupplier(null);
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
                      <Input 
                        id="projectStatus" 
                        value={editProject.status} 
                        onChange={(e) => setEditProject({...editProject, status: e.target.value})}
                      />
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
                    {projects.slice(0, 5).map((project) => (
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
                    {suppliers.map((supplier) => (
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
      </Tabs>
    </div>
  );
};

export default Admin;
