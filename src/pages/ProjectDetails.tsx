
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StatusBadge from '@/components/ui/StatusBadge';
import ProgressBar from '@/components/ui/ProgressBar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';
import { 
  projects, 
  suppliers, 
  purchaseOrders, 
  getSupplierById, 
  getMilestonesByProjectId, 
  getPOsByProjectId, 
  formatDate, 
  getDaysRemaining,
  getClientByProjectId,
  getProjectSuppliers,
  getSupplierProgress
} from '@/data/mockData';
import { PurchaseOrder, ProjectStatus } from '@/types';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const project = projects.find(p => p.id === id);
  
  if (!project) {
    return <div className="text-center py-16">Project not found</div>;
  }
  
  const supplier = getSupplierById(project.supplierId);
  const client = getClientByProjectId(project.id);
  const milestones = getMilestonesByProjectId(project.id);
  const projectPurchaseOrders = getPOsByProjectId(project.id);
  const projectSuppliers = getProjectSuppliers(project.id);
  
  // PO stats
  const activePOs = projectPurchaseOrders.filter(po => po.status === 'active').length;
  const completedPOs = projectPurchaseOrders.filter(po => po.status === 'completed').length;
  const canceledPOs = projectPurchaseOrders.filter(po => po.status === 'canceled').length;
  
  // Chart data
  const poStatusData = [
    { name: 'Active', value: activePOs, color: '#3498db' },
    { name: 'Completed', value: completedPOs, color: '#2ecc71' },
    { name: 'Canceled', value: canceledPOs, color: '#e74c3c' },
  ];
  
  // Group POs by part type for visualization
  const partData = projectPurchaseOrders.reduce((acc: any[], po) => {
    const existingPart = acc.find(item => item.name === po.partName);
    if (existingPart) {
      existingPart.quantity += po.quantity;
    } else {
      acc.push({ name: po.partName, quantity: po.quantity });
    }
    return acc;
  }, []);
  
  // Supplier progress data
  const supplierProgressData = projectSuppliers.map(supplier => ({
    name: supplier.name,
    progress: getSupplierProgress(supplier.id)
  }));
  
  // Budget spent analysis data (mock data for now)
  const budgetAnalysisData = [
    { name: 'Jan', spent: 25000 },
    { name: 'Feb', spent: 48000 },
    { name: 'Mar', spent: 65000 },
    { name: 'Apr', spent: 87000 },
    { name: 'May', spent: 120000 }
  ];
  
  // Timeline analysis data (mock data)
  const timelineData = [
    { name: 'Week 1', planned: 10, actual: 8 },
    { name: 'Week 2', planned: 20, actual: 15 },
    { name: 'Week 3', planned: 30, actual: 25 },
    { name: 'Week 4', planned: 40, actual: 32 },
    { name: 'Week 5', planned: 50, actual: 45 },
  ];
  
  // Group milestones by PO
  const milestonesByPO = projectPurchaseOrders.map(po => {
    const poMilestones = milestones.filter(m => m.poId === po.id) || [];
    return {
      po,
      milestones: poMilestones,
      // If no milestones are specifically linked to this PO, create default ones
      hasMilestones: poMilestones.length > 0
    };
  });

  // Helper function to map POStatus to ProjectStatus
  const mapPOStatusToProjectStatus = (poStatus: 'active' | 'completed' | 'canceled'): ProjectStatus => {
    if (poStatus === 'active') return 'in-progress';
    if (poStatus === 'completed') return 'completed';
    if (poStatus === 'canceled') return 'delayed';
    return 'pending';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <StatusBadge status={project.status} />
          </div>
          <div className="text-muted-foreground mt-1">{project.description}</div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-sm">
            <div className="font-medium">Start Date</div>
            <div>{formatDate(project.startDate)}</div>
          </div>
          <div className="text-sm">
            <div className="font-medium">Deadline</div>
            <div>{formatDate(project.deadline)}</div>
          </div>
          <div className="text-sm">
            <div className="font-medium">Budget</div>
            <div>${project.budget.toLocaleString()}</div>
          </div>
        </div>
      </div>
      
      {/* Project Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Project Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{project.progress}%</span>
                </div>
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle 
                    cx="50" cy="50" r="45" 
                    fill="none" 
                    stroke="#f1f5f9" 
                    strokeWidth="10" 
                  />
                  <circle 
                    cx="50" cy="50" r="45" 
                    fill="none" 
                    stroke={
                      project.status === 'completed' ? '#2ecc71' : 
                      project.status === 'in-progress' ? '#3498db' : 
                      project.status === 'delayed' ? '#e74c3c' : '#95a5a6'
                    } 
                    strokeWidth="10" 
                    strokeDasharray={`${project.progress * 2.83} ${283 - project.progress * 2.83}`} 
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)" 
                  />
                </svg>
              </div>
              <div>
                <div className="font-medium">Days Remaining</div>
                <div className="text-xl text-center">
                  {getDaysRemaining(project.deadline)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Project Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Location</div>
                <div className="font-medium">{project.location}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Client</div>
                <div className="font-medium">{client?.name || 'Not assigned'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Client Contact Person</div>
                <div className="font-medium">{client?.contactPerson || 'Not assigned'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Project Manager</div>
                <div className="font-medium">{project.projectManager || 'Not assigned'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Suppliers in Asia Involved</div>
                <div className="font-medium">
                  {projectSuppliers
                    .filter(s => ['Japan', 'China', 'Vietnam', 'Thailand', 'Malaysia', 'Singapore', 'Indonesia', 'Philippines', 'South Korea', 'Taiwan'].includes(s.country))
                    .map(s => s.name)
                    .join(', ') || 'None'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Purchase Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-3 rounded-md text-center">
                  <div className="text-2xl font-bold">{projectPurchaseOrders.length}</div>
                  <div className="text-sm text-muted-foreground">Total POs</div>
                </div>
                <div className="bg-muted p-3 rounded-md text-center">
                  <div className="text-2xl font-bold text-status-in-progress">{activePOs}</div>
                  <div className="text-sm text-muted-foreground">Active POs</div>
                </div>
                <div className="bg-muted p-3 rounded-md text-center">
                  <div className="text-2xl font-bold text-status-completed">{completedPOs}</div>
                  <div className="text-sm text-muted-foreground">Completed POs</div>
                </div>
                <div className="bg-muted p-3 rounded-md text-center">
                  <div className="text-2xl font-bold text-muted-foreground">
                    {projectPurchaseOrders.reduce((sum, po) => sum + po.quantity, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Parts</div>
                </div>
              </div>
              
              {projectPurchaseOrders.length > 0 && (
                <div className="h-[120px]">
                  <ChartContainer config={{}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Pie
                          data={poStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={50}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {poStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Progress by Supplier */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Progress by Supplier</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer config={{}}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={supplierProgressData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 60,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="progress" name="Completion %" fill="#3498db" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Upcoming PO Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upcoming PO Deadlines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="py-3 px-4 text-left">PO Number</th>
                  <th className="py-3 px-4 text-left">Part Name</th>
                  <th className="py-3 px-4 text-left">Supplier</th>
                  <th className="py-3 px-4 text-left">Deadline</th>
                  <th className="py-3 px-4 text-left">Days Remaining</th>
                  <th className="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {projectPurchaseOrders
                  .filter(po => po.status === 'active' && po.contractualDeadline)
                  .sort((a, b) => {
                    const dateA = a.contractualDeadline ? new Date(a.contractualDeadline).getTime() : Infinity;
                    const dateB = b.contractualDeadline ? new Date(b.contractualDeadline).getTime() : Infinity;
                    return dateA - dateB;
                  })
                  .map(po => {
                    const supplier = getSupplierById(po.supplierId);
                    const daysRemaining = po.contractualDeadline ? getDaysRemaining(po.contractualDeadline) : 0;
                    
                    return (
                      <tr key={po.id} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{po.poNumber}</td>
                        <td className="py-3 px-4">{po.partName}</td>
                        <td className="py-3 px-4">{supplier?.name}</td>
                        <td className="py-3 px-4">
                          {po.contractualDeadline && formatDate(po.contractualDeadline)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={cn(
                            "font-medium",
                            daysRemaining < 0 ? "text-status-delayed" : 
                            daysRemaining < 7 ? "text-status-in-progress" : 
                            "text-status-pending"
                          )}>
                            {daysRemaining < 0 
                              ? `${Math.abs(daysRemaining)} days overdue` 
                              : `${daysRemaining} days remaining`
                            }
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={
                            daysRemaining < 0 ? "delayed" : 
                            po.status === "completed" ? "completed" : "in-progress"
                          } />
                        </td>
                      </tr>
                    );
                  })}
                  
                {projectPurchaseOrders.filter(po => po.status === 'active' && po.contractualDeadline).length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-muted-foreground">
                      No upcoming PO deadlines for this project.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Tabs for Project Detail Data */}
      <Tabs defaultValue="purchase-orders">
        <TabsList className="mb-4">
          <TabsTrigger value="purchase-orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="milestones">Milestones by PO</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="purchase-orders">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Purchase Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {projectPurchaseOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No purchase orders found for this project.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PO Number</TableHead>
                      <TableHead>Part Name</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Placed By</TableHead>
                      <TableHead>Date Created</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Shipment Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectPurchaseOrders.map(po => {
                      const poSupplier = getSupplierById(po.supplierId);
                      const mappedStatus = mapPOStatusToProjectStatus(po.status);
                      
                      return (
                        <TableRow key={po.id}>
                          <TableCell className="font-medium">{po.poNumber}</TableCell>
                          <TableCell>{po.partName}</TableCell>
                          <TableCell>{po.quantity.toLocaleString()}</TableCell>
                          <TableCell>{poSupplier?.name}</TableCell>
                          <TableCell>{po.placedBy}</TableCell>
                          <TableCell>{formatDate(po.dateCreated)}</TableCell>
                          <TableCell>
                            <Badge className={
                              po.status === 'completed' ? 'bg-status-completed' :
                              po.status === 'active' ? 'bg-status-in-progress' :
                              'bg-status-delayed'
                            }>
                              {po.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <ProgressBar 
                                progress={po.progress || 0} 
                                status={mappedStatus}
                                className="w-24" 
                              />
                              <span>{po.progress || 0}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{po.shipmentDate ? formatDate(po.shipmentDate) : 'Not shipped'}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="milestones">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Milestones by Purchase Order</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {milestonesByPO.map(({ po, milestones, hasMilestones }) => (
                  <div key={po.id} className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-2">PO: {po.poNumber} - {po.partName}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Supplier: {getSupplierById(po.supplierId)?.name} | 
                      Status: {po.status} | 
                      Created: {formatDate(po.dateCreated)}
                    </p>
                    
                    {hasMilestones ? (
                      <div className="space-y-4">
                        {milestones.map((milestone, index) => (
                          <div 
                            key={milestone.id} 
                            className="flex items-center gap-4 p-3 rounded-lg border"
                          >
                            <div className={`
                              w-8 h-8 rounded-full flex items-center justify-center text-white
                              ${milestone.completed ? 'bg-status-completed' : 'bg-muted-foreground'}
                            `}>
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{milestone.title}</div>
                              <div className="text-sm text-muted-foreground">Due: {formatDate(milestone.dueDate)}</div>
                            </div>
                            <div>
                              {milestone.completed ? (
                                <Badge className="bg-status-completed">Completed</Badge>
                              ) : (
                                <Badge variant="outline">Pending</Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center p-6 text-muted-foreground">
                        No specific milestones set for this PO
                      </div>
                    )}
                  </div>
                ))}
                
                {projectPurchaseOrders.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No purchase orders found for this project.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Parts Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Parts Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ChartContainer config={{}}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={partData}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 60,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar 
                              dataKey="quantity" 
                              name="Quantity" 
                              fill="#3498db" 
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Budget Spent Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Budget Spent Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ChartContainer config={{}}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={budgetAnalysisData}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 60,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar 
                              dataKey="spent" 
                              name="Budget Spent ($)" 
                              fill="#e74c3c" 
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Timeline Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Timeline Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ChartContainer config={{}}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={timelineData}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 20,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="planned" 
                              stroke="#8884d8" 
                              activeDot={{ r: 8 }} 
                              name="Planned Progress"
                            />
                            <Line 
                              type="monotone" 
                              dataKey="actual" 
                              stroke="#82ca9d" 
                              name="Actual Progress"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Progress by PO */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Progress by Purchase Order</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {projectPurchaseOrders.map(po => (
                        <div key={po.id} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{po.poNumber}: {po.partName}</span>
                            <span className={
                              po.status === 'completed' ? 'text-status-completed' :
                              po.status === 'canceled' ? 'text-status-delayed' :
                              'text-status-in-progress'
                            }>
                              {po.progress || 0}%
                            </span>
                          </div>
                          <ProgressBar 
                            progress={po.progress || 0} 
                            status={mapPOStatusToProjectStatus(po.status)} 
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetails;
