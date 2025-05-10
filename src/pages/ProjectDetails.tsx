import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StatusBadge from '@/components/ui/StatusBadge';
import ProgressBar from '@/components/ui/ProgressBar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { projects, suppliers, purchaseOrders, getSupplierById, getMilestonesByProjectId, getPOsByProjectId, formatDate, getDaysRemaining } from '@/data/mockData';
import { PurchaseOrder } from '@/types';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const project = projects.find(p => p.id === id);
  
  if (!project) {
    return <div className="text-center py-16">Project not found</div>;
  }
  
  const supplier = getSupplierById(project.supplierId);
  const milestones = getMilestonesByProjectId(project.id);
  const purchaseOrders = getPOsByProjectId(project.id);
  
  // PO stats
  const activePOs = purchaseOrders.filter(po => po.status === 'active').length;
  const completedPOs = purchaseOrders.filter(po => po.status === 'completed').length;
  const canceledPOs = purchaseOrders.filter(po => po.status === 'cancelled').length; // Changed "canceled" to "cancelled" to match POStatus type
  
  // Chart data
  const poStatusData = [
    { name: 'Active', value: activePOs, color: '#3498db' },
    { name: 'Completed', value: completedPOs, color: '#2ecc71' },
    { name: 'Cancelled', value: canceledPOs, color: '#e74c3c' },
  ];
  
  // Group POs by part type for visualization
  const partData = purchaseOrders.reduce((acc: any[], po) => {
    const existingPart = acc.find(item => item.name === po.partName);
    if (existingPart) {
      existingPart.quantity += po.quantity;
    } else {
      acc.push({ name: po.partName, quantity: po.quantity });
    }
    return acc;
  }, []);

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
                <div className="text-sm text-muted-foreground">Main Supplier</div>
                <div className="font-medium">{supplier?.name}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Project Manager</div>
                <div className="font-medium">{project.projectManager || 'Not assigned'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Manufacturing Manager</div>
                <div className="font-medium">{project.manufacturingManager || 'Not assigned'}</div>
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
                  <div className="text-2xl font-bold">{purchaseOrders.length}</div>
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
                    {purchaseOrders.reduce((sum, po) => sum + po.quantity, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Parts</div>
                </div>
              </div>
              
              {purchaseOrders.length > 0 && (
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
      
      {/* Tabs for Project Detail Data */}
      <Tabs defaultValue="purchase-orders">
        <TabsList className="mb-4">
          <TabsTrigger value="purchase-orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="purchase-orders">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Purchase Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {purchaseOrders.length === 0 ? (
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
                      <TableHead>Shipment Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchaseOrders.map(po => {
                      const poSupplier = getSupplierById(po.supplierId);
                      
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
              <CardTitle className="text-lg">Project Milestones</CardTitle>
            </CardHeader>
            <CardContent>
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
                
                {/* Milestone Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Timeline Adherence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {milestones.map((milestone) => {
                        const dueDate = new Date(milestone.dueDate);
                        const today = new Date();
                        const isOverdue = !milestone.completed && dueDate < today;
                        
                        return (
                          <div key={milestone.id} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{milestone.title}</span>
                              <span className={
                                milestone.completed ? 'text-status-completed' :
                                isOverdue ? 'text-status-delayed' :
                                'text-muted-foreground'
                              }>
                                {formatDate(milestone.dueDate)}
                              </span>
                            </div>
                            <ProgressBar 
                              progress={milestone.completed ? 100 : isOverdue ? 0 : 50} 
                              status={milestone.completed ? 'completed' : isOverdue ? 'delayed' : 'in-progress'} 
                            />
                          </div>
                        );
                      })}
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
