
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  getSupplierById, 
  getProjectsBySupplierId, 
  getPOsByProjectId,
  formatDate
} from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, MapPin, Package, Calendar, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const SupplierDetails = () => {
  const { id } = useParams<{ id: string }>();
  const supplier = getSupplierById(id || "");
  const projects = getProjectsBySupplierId(id || "");
  
  // Get all POs for this supplier's projects
  const purchaseOrders = projects.flatMap(project => 
    getPOsByProjectId(project.id).filter(po => po.supplierId === supplier?.id)
  );
  
  // Sort POs by date to find latest
  const sortedPOs = [...purchaseOrders].sort(
    (a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
  );
  
  const latestPO = sortedPOs.length > 0 ? sortedPOs[0] : null;

  if (!supplier) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center">Supplier Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">The supplier you're looking for does not exist.</p>
            <Button asChild>
              <Link to="/suppliers">Return to Suppliers</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Calculate supplier statistics
  const totalPOs = purchaseOrders.length;
  const completedPOs = purchaseOrders.filter(po => po.status === "completed").length;
  const completionRate = totalPOs > 0 ? Math.round((completedPOs / totalPOs) * 100) : 0;
  const activeProjects = projects.filter(project => project.status !== "completed").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{supplier.name}</h1>
          <div className="flex items-center text-muted-foreground mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{supplier.country}</span>
          </div>
        </div>
        <div>
          <Button variant="outline" asChild className="mr-2">
            <Link to="/suppliers">Back to Suppliers</Link>
          </Button>
          {/* Link to admin supplier management for editing */}
          <Button asChild>
            <Link to={`/admin?tab=suppliers&edit=${supplier.id}`}>
              Edit Supplier
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Supplier Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{supplier.rating}/5.0</div>
              <div className="ml-2 flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={cn(
                      "h-5 w-5",
                      i < Math.floor(supplier.rating) ? "text-yellow-400" : "text-gray-300"
                    )}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">On-Time Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold",
              supplier.onTimeDeliveryRate >= 90 ? "text-status-completed" :
              supplier.onTimeDeliveryRate >= 75 ? "text-status-in-progress" :
              "text-status-delayed"
            )}>
              {supplier.onTimeDeliveryRate}%
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total POs</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Package className="h-5 w-5 mr-2 text-muted-foreground" />
            <div className="text-2xl font-bold">{totalPOs}</div>
            <div className="ml-2 text-sm text-muted-foreground">
              ({completedPOs} completed)
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-muted-foreground" />
            <div className="text-2xl font-bold">{activeProjects}</div>
            <div className="ml-2 text-sm text-muted-foreground">
              of {projects.length}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
            <dt className="text-sm font-medium text-muted-foreground">Contact Person</dt>
            <dd>{supplier.contactPerson}</dd>
            
            <dt className="text-sm font-medium text-muted-foreground">Email</dt>
            <dd>
              <a href={`mailto:${supplier.email}`} className="text-primary hover:underline">
                {supplier.email}
              </a>
            </dd>
            
            <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
            <dd>{supplier.phone}</dd>
            
            <dt className="text-sm font-medium text-muted-foreground">Location</dt>
            <dd>{supplier.location || supplier.country}</dd>
          </dl>
        </CardContent>
      </Card>
      
      {/* Tabs for Projects, POs, and Comments */}
      <Tabs defaultValue="projects">
        <TabsList>
          <TabsTrigger value="projects">Projects ({projects.length})</TabsTrigger>
          <TabsTrigger value="purchaseOrders">Purchase Orders ({purchaseOrders.length})</TabsTrigger>
          <TabsTrigger value="comments">Comments ({supplier.comments?.length || 0})</TabsTrigger>
        </TabsList>
        
        {/* Projects Tab */}
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
            </CardHeader>
            <CardContent>
              {projects.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map(project => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>
                          <Badge variant={
                            project.status === 'completed' ? 'success' :
                            project.status === 'in-progress' ? 'default' :
                            project.status === 'delayed' ? 'destructive' : 'outline'
                          }>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(project.startDate)}</TableCell>
                        <TableCell>{formatDate(project.deadline)}</TableCell>
                        <TableCell>{project.progress}%</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/project/${project.id}`}>View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No projects found for this supplier.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Purchase Orders Tab */}
        <TabsContent value="purchaseOrders">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Purchase Orders</CardTitle>
              {latestPO && (
                <div className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Latest PO: {formatDate(latestPO.dateCreated)} - {latestPO.poNumber}
                </div>
              )}
            </CardHeader>
            <CardContent>
              {purchaseOrders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PO Number</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Part Name</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedPOs.map(po => {
                      const project = projects.find(p => p.id === po.projectId);
                      
                      return (
                        <TableRow key={po.id}>
                          <TableCell className="font-medium">{po.poNumber}</TableCell>
                          <TableCell>
                            {project ? (
                              <Link to={`/project/${project.id}`} className="hover:underline">
                                {project.name}
                              </Link>
                            ) : 'Unknown Project'}
                          </TableCell>
                          <TableCell>{po.partName}</TableCell>
                          <TableCell>{po.quantity}</TableCell>
                          <TableCell>
                            <Badge variant={
                              po.status === 'completed' ? 'success' :
                              po.status === 'active' ? 'default' :
                              'destructive'
                            }>
                              {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{po.contractualDeadline ? formatDate(po.contractualDeadline) : 'N/A'}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No purchase orders found for this supplier.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Comments Tab */}
        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Comments</CardTitle>
            </CardHeader>
            <CardContent>
              {supplier.comments && supplier.comments.length > 0 ? (
                <div className="space-y-4">
                  {supplier.comments.map(comment => (
                    <div key={comment.id} className="border rounded-md p-4">
                      <div className="flex justify-between">
                        <Badge variant={
                          comment.type === 'positive' ? 'success' :
                          comment.type === 'negative' ? 'destructive' : 
                          'outline'
                        }>
                          {comment.type.charAt(0).toUpperCase() + comment.type.slice(1)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(comment.date)}
                          {comment.author && ` by ${comment.author}`}
                        </span>
                      </div>
                      <p className="mt-2">{comment.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No comments have been added for this supplier.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupplierDetails;
