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
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { fetchSuppliersInAsia } from '@/utils/supabaseHelpers';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const project = projects.find(p => p.id === id);
  const [suppliersInAsia, setSuppliersInAsia] = useState<string[]>([]);
  
  useEffect(() => {
    // Fetch suppliers in Asia for this project
    const loadSuppliersInAsia = async () => {
      if (!id) return;
      
      try {
        const supplierNames = await fetchSuppliersInAsia(id);
        setSuppliersInAsia(supplierNames);
      } catch (error) {
        console.error('Error:', error);
        setSuppliersInAsia([]);
      }
    };
    
    loadSuppliersInAsia();
  }, [id]);
  
  if (!project) {
    return <div className="text-center py-16">Project not found</div>;
  }
  
  const supplier = getSupplierById(project.supplierId);
  const milestones = getMilestonesByProjectId(project.id);
  const projectPOs = getPOsByProjectId(project.id);
  
  // PO stats
  const activePOs = projectPOs.filter(po => po.status === 'active').length;
  const completedPOs = projectPOs.filter(po => po.status === 'completed').length;
  const canceledPOs = projectPOs.filter(po => po.status === 'cancelled').length;
  
  // Chart data
  const poStatusData = [
    { name: 'Active', value: activePOs, color: '#3498db' },
    { name: 'Completed', value: completedPOs, color: '#2ecc71' },
    { name: 'Cancelled', value: canceledPOs, color: '#e74c3c' },
  ];

  // Group POs by part type for visualization
  type PartData = Array<{name: string, quantity: number}>;
  
  const partData: PartData = projectPOs.reduce((acc: PartData, po) => {
    const existingPart = acc.find(item => item.name === po.partName);
    if (existingPart) {
      existingPart.quantity += po.quantity;
    } else {
      acc.push({ name: po.partName, quantity: po.quantity });
    }
    return acc;
  }, []);

  // Progress by Supplier data
  interface SupplierProgress {
    [key: string]: {
      name: string;
      progress: number;
      count: number;
    }
  }
  
  const supplierProgressData: SupplierProgress = projectPOs
    .reduce((acc: SupplierProgress, po) => {
      const supplierName = getSupplierById(po.supplierId)?.name || "Unknown";
      if (!acc[po.supplierId]) {
        acc[po.supplierId] = {
          name: supplierName,
          progress: po.progress || 0,
          count: 1
        };
      } else {
        acc[po.supplierId].progress += (po.progress || 0);
        acc[po.supplierId].count += 1;
      }
      return acc;
    }, {});
  
  const supplierProgressChartData = Object.values(supplierProgressData).map(item => ({
    name: item.name,
    progress: Math.round(item.progress / item.count)
  }));

  // Progress by PO data
  const poProgressData = projectPOs
    .map(po => ({
      name: po.poNumber,
      progress: po.progress || 0
    }))
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 5);

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
                <div className="font-medium">{project.clientName || 'Not assigned'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Project Manager</div>
                <div className="font-medium">{project.projectManager || 'Not assigned'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Client Contact Person</div>
                <div className="font-medium">{project.clientId ? 'Contact Person' : 'Not assigned'}</div>
              </div>
              {suppliersInAsia.length > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground">Suppliers in Asia</div>
                  <div className="font-medium">{suppliersInAsia.join(', ')}</div>
                </div>
              )}
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
                  <div className="text-2xl font-bold">{projectPOs.length}</div>
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
                    {projectPOs.reduce((sum, po) => sum + po.quantity, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Parts</div>
                </div>
              </div>
              
              {projectPOs.length > 0 && (
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

      {/* Task #6: New visual sections - Progress by Supplier and Progress by PO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Progress by Supplier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ChartContainer config={{}}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={supplierProgressChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      dataKey="progress" 
                      name="Progress %" 
                      fill="#3498db" 
                      label={{ position: 'top', formatter: (val: number) => `${val}%` }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Progress by PO</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ChartContainer config={{}}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={poProgressData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={80} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      dataKey="progress" 
                      name="Progress %" 
                      fill="#2ecc71"
                      label={{ position: 'right', formatter: (val: number) => `${val}%` }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Task #8: Upcoming PO Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upcoming PO Deadlines</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO Number</TableHead>
                <TableHead>Part Name</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Days Remaining</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectPOs
                .filter(po => po.status !== 'completed' && po.status !== 'cancelled')
                .sort((a, b) => new Date(a.contractualDeadline).getTime() - new Date(b.contractualDeadline).getTime())
                .slice(0, 5)
                .map(po => {
                  const poSupplier = getSupplierById(po.supplierId);
                  const daysRemaining = getDaysRemaining(po.contractualDeadline);
                  
                  return (
                    <TableRow key={po.id}>
                      <TableCell className="font-medium">{po.poNumber}</TableCell>
                      <TableCell>{po.partName}</TableCell>
                      <TableCell>{poSupplier?.name}</TableCell>
                      <TableCell>{formatDate(po.contractualDeadline)}</TableCell>
                      <TableCell className={daysRemaining < 7 ? 'text-status-delayed' : 'text-status-in-progress'}>
                        {daysRemaining} days
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={po.status === 'active' ? 'in-progress' : 'delayed'} />
                      </TableCell>
                    </TableRow>
                  );
                })}
                
                {projectPOs.filter(po => po.status !== 'completed').length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">No upcoming deadlines</TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
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
              {projectPOs.length === 0 ? (
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
                    {projectPOs.map(po => {
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
              <CardTitle className="text-lg">Milestones by PO</CardTitle>
            </CardHeader>
            <CardContent>
              {projectPOs.length > 0 ? (
                <div className="space-y-8">
                  {projectPOs.map(po => (
                    <div key={po.id} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">PO: {po.poNumber}</h3>
                        <StatusBadge status={po.status === 'active' ? 'in-progress' : po.status === 'completed' ? 'completed' : 'delayed'} />
                      </div>
                      
                      {/* For demo purposes, we're showing all milestones for each PO */}
                      {/* In a real implementation, you'd fetch milestones specific to each PO */}
                      <div className="space-y-2 pl-4 border-l-2 border-muted">
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
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No purchase orders found for this project.
                </div>
              )}
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
                
                {/* Budget Spent Analysis - Task #9 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Budget Spent Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ChartContainer config={{}}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { name: 'Budget', value: project.budget },
                              { name: 'Spent', value: project.budget * project.progress / 100 }
                            ]}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar 
                              dataKey="value" 
                              name="Amount ($)" 
                              fill="#2ecc71"
                              label={{ position: 'top', formatter: (val: number) => `$${val.toLocaleString()}` }}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Project Timeline - Task #9 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Project Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Start Date</div>
                          <div>{formatDate(project.startDate)}</div>
                        </div>
                        <div>
                          <div className="font-medium">Deadline</div>
                          <div>{formatDate(project.deadline)}</div>
                        </div>
                      </div>
                      
                      <div className="h-6 w-full bg-muted rounded-full overflow-hidden relative">
                        <div 
                          className="h-full bg-status-in-progress absolute left-0 top-0"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                        
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs font-medium text-white">
                          {project.progress}% Complete
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="font-medium">Milestones</div>
                        {milestones.map((milestone, index) => {
                          const totalDuration = new Date(project.deadline).getTime() - new Date(project.startDate).getTime();
                          const milestonePosition = (new Date(milestone.dueDate).getTime() - new Date(project.startDate).getTime()) / totalDuration * 100;
                          
                          return (
                            <div key={milestone.id} className="relative h-8 w-full bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full w-1 absolute top-0 ${milestone.completed ? 'bg-status-completed' : 'bg-status-pending'}`}
                                style={{ left: `${milestonePosition}%` }}
                              ></div>
                              <div 
                                className="absolute text-xs"
                                style={{ left: `${milestonePosition}%`, transform: 'translateX(-50%)', top: '8px' }}
                              >
                                {milestone.title}
                              </div>
                            </div>
                          );
                        })}
                      </div>
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
