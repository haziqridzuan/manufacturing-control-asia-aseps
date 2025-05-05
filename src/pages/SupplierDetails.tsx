
import { useParams } from 'react-router-dom';
import { suppliers, purchaseOrders, projects } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info, MapPin, Calendar, Package } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const SupplierDetails = () => {
  const { id } = useParams();
  const supplier = suppliers.find(s => s.id === id);
  
  if (!supplier) {
    return <div className="p-6">Supplier not found</div>;
  }
  
  // Get all purchase orders for this supplier
  const supplierPOs = purchaseOrders.filter(po => po.supplierId === supplier.id);
  
  // Get all projects this supplier has worked on
  const supplierProjects = [...new Set(supplierPOs.map(po => po.projectId))];
  const projectDetails = projects.filter(project => supplierProjects.includes(project.id));
  
  // Get the latest and oldest PO
  const sortedPOs = [...supplierPOs].sort((a, b) => 
    new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
  );
  const latestPO = sortedPOs[0];
  const oldestPO = sortedPOs[sortedPOs.length - 1];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{supplier.name}</h1>
        <Badge variant="outline" className="text-sm">
          {supplierPOs.length} Purchase Orders
        </Badge>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Info className="h-5 w-5 mr-2" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="font-medium">Contact Person:</dt>
                <dd>{supplier.contactPerson}</dd>
              </div>
              <div>
                <dt className="font-medium">Email:</dt>
                <dd>{supplier.email}</dd>
              </div>
              <div>
                <dt className="font-medium">Phone:</dt>
                <dd>{supplier.phone}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{supplier.location}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              PO Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="font-medium">First PO:</dt>
                <dd>{oldestPO ? new Date(oldestPO.dateCreated).toLocaleDateString() : 'N/A'}</dd>
              </div>
              <div>
                <dt className="font-medium">Latest PO:</dt>
                <dd>{latestPO ? new Date(latestPO.dateCreated).toLocaleDateString() : 'N/A'}</dd>
              </div>
              <div>
                <dt className="font-medium">Total Value:</dt>
                <dd>${supplierPOs.reduce((sum, po) => sum + (po.amount || 0), 0).toLocaleString()}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="projects">Projects ({projectDetails.length})</TabsTrigger>
          <TabsTrigger value="purchaseOrders">Purchase Orders ({supplierPOs.length})</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects" className="border rounded-md p-4 mt-4">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Projects Worked On
          </h3>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>POs Count</TableHead>
                  <TableHead>Total Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectDetails.map(project => {
                  const projectPOs = supplierPOs.filter(po => po.projectId === project.id);
                  const totalValue = projectPOs.reduce((sum, po) => sum + (po.amount || 0), 0);
                  
                  return (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>
                        <Badge variant={
                          project.status === 'completed' ? 'secondary' : 
                          project.status === 'in-progress' ? 'default' : 'outline'
                        }>
                          {project.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{projectPOs.length}</TableCell>
                      <TableCell>${totalValue.toLocaleString()}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="purchaseOrders" className="border rounded-md p-4 mt-4">
          <h3 className="text-lg font-medium mb-4">Purchase Order History</h3>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPOs.map(po => {
                  const project = projects.find(p => p.id === po.projectId);
                  
                  return (
                    <TableRow key={po.id}>
                      <TableCell className="font-medium">{po.poNumber}</TableCell>
                      <TableCell>{project ? project.name : 'Unknown Project'}</TableCell>
                      <TableCell>{new Date(po.dateCreated).toLocaleDateString()}</TableCell>
                      <TableCell>${po.amount ? po.amount.toLocaleString() : 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={
                          po.status === 'completed' ? 'secondary' : 
                          po.status === 'active' ? 'default' : 'outline'
                        }>
                          {po.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="comments" className="border rounded-md p-4 mt-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Positive Feedback</CardTitle>
                <CardDescription>
                  Strengths and good qualities of this supplier
                </CardDescription>
              </CardHeader>
              <CardContent>
                {supplier.comments?.positive ? (
                  <div className="whitespace-pre-line">{supplier.comments.positive}</div>
                ) : (
                  <p className="text-muted-foreground italic">No positive comments have been added yet.</p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Areas for Improvement</CardTitle>
                <CardDescription>
                  Points where this supplier could improve
                </CardDescription>
              </CardHeader>
              <CardContent>
                {supplier.comments?.negative ? (
                  <div className="whitespace-pre-line">{supplier.comments.negative}</div>
                ) : (
                  <p className="text-muted-foreground italic">No improvement suggestions have been added yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupplierDetails;
