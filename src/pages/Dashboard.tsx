
import { BarChart, PieChart } from "recharts";
import { Package, Users, Calendar, ArrowRight, Gauge, Clock, Check, Database, ShoppingCart, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ProgressBar from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/button";
import { projects, suppliers, getSupplierById, getDaysRemaining, formatDate, purchaseOrders, getActivePOs, getCompletedPOs } from "@/data/mockData";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Project } from "@/types";

const Dashboard = () => {
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  
  useEffect(() => {
    // In a real app, this would fetch data from Supabase
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('status', 'in-progress');
          
        if (error) {
          console.error('Error fetching active projects:', error);
          return;
        }
        
        if (data) {
          setActiveProjects(data as Project[]);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    // For now, use mock data
    setActiveProjects(projects.filter(p => p.status === 'in-progress'));
    
    // Uncomment when Supabase is connected
    // fetchData();
  }, []);
  
  // Calculate metrics
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === "completed").length;
  const inProgressProjects = projects.filter(p => p.status === "in-progress").length;
  const delayedProjects = projects.filter(p => p.status === "delayed").length;
  const totalSuppliers = suppliers.length;
  
  // PO metrics
  const activePOs = getActivePOs().length;
  const completedPOs = getCompletedPOs().length;
  const totalPOs = purchaseOrders.length;
  
  // Get upcoming deadlines (projects sorted by nearest deadline)
  const upcomingDeadlines = [...projects]
    .filter(p => p.status !== "completed")
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Project Fabrication Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Last updated:</span>
          <span className="text-sm font-medium">{new Date().toLocaleString()}</span>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard 
          title="Total Projects" 
          value={totalProjects} 
          icon={<Package className="h-4 w-4 text-muted-foreground" />} 
        />
        <StatCard 
          title="Active Suppliers" 
          value={totalSuppliers} 
          icon={<Users className="h-4 w-4 text-muted-foreground" />} 
        />
        <StatCard 
          title="Completed Projects" 
          value={completedProjects} 
          icon={<Check className="h-4 w-4 text-muted-foreground" />}
          trend={{ value: Math.round((completedProjects / totalProjects) * 100), positive: true }}
        />
        <StatCard 
          title="Delayed Projects" 
          value={delayedProjects} 
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          trend={{ value: Math.round((delayedProjects / totalProjects) * 100), positive: false }}
        />
        <StatCard 
          title="Active POs" 
          value={activePOs} 
          icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
          trend={{ value: Math.round((activePOs / totalPOs) * 100), positive: true }}
        />
        <StatCard 
          title="Completed POs" 
          value={completedPOs} 
          icon={<Database className="h-4 w-4 text-muted-foreground" />}
          trend={{ value: Math.round((completedPOs / totalPOs) * 100), positive: true }}
        />
      </div>
      
      {/* Task #15: List of Active Projects - Added larger section near top */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">List of Active Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Project Name</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeProjects.map(project => {
                  const daysRemaining = getDaysRemaining(project.deadline);
                  
                  return (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{project.clientName || 'N/A'}</TableCell>
                      <TableCell>{project.location}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <ProgressBar 
                            progress={project.progress} 
                            status={project.status} 
                            className="w-24"
                          />
                          <span>{project.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className={cn(
                        daysRemaining < 7 ? 'text-status-delayed' : ''
                      )}>
                        {formatDate(project.deadline)}
                        <div className="text-xs text-muted-foreground">
                          {daysRemaining} days left
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/project/${project.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                
                {activeProjects.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No active projects found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Project Status and Upcoming Deadlines */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Project Status Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Project Status Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Completed</span>
                <span className="font-medium">{completedProjects}</span>
              </div>
              <ProgressBar 
                progress={Math.round((completedProjects / totalProjects) * 100)} 
                status="completed" 
              />
              
              <div className="flex justify-between">
                <span>In Progress</span>
                <span className="font-medium">{inProgressProjects}</span>
              </div>
              <ProgressBar 
                progress={Math.round((inProgressProjects / totalProjects) * 100)} 
                status="in-progress" 
              />
              
              <div className="flex justify-between">
                <span>Delayed</span>
                <span className="font-medium">{delayedProjects}</span>
              </div>
              <ProgressBar 
                progress={Math.round((delayedProjects / totalProjects) * 100)} 
                status="delayed" 
              />
              
              <div className="flex justify-between">
                <span>Pending</span>
                <span className="font-medium">
                  {totalProjects - (completedProjects + inProgressProjects + delayedProjects)}
                </span>
              </div>
              <ProgressBar 
                progress={Math.round(((totalProjects - (completedProjects + inProgressProjects + delayedProjects)) / totalProjects) * 100)} 
                status="pending" 
              />
              
              <div className="mt-4 text-center">
                <Button variant="outline" asChild>
                  <Link to="/projects">
                    View All Projects <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Upcoming PO Deadline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming PO Deadline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines.map(project => {
                const supplier = getSupplierById(project.supplierId);
                const daysRemaining = getDaysRemaining(project.deadline);
                
                return (
                  <div key={project.id} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{project.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{supplier?.name}</span>
                        <span>•</span>
                        <StatusBadge status={project.status} />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={cn(
                        "font-medium",
                        daysRemaining < 0 ? "text-status-delayed" : 
                        daysRemaining < 7 ? "text-status-in-progress" : 
                        "text-status-pending"
                      )}>
                        {formatDate(project.deadline)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {daysRemaining < 0 
                          ? `${Math.abs(daysRemaining)} days overdue` 
                          : `${daysRemaining} days remaining`
                        }
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {upcomingDeadlines.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No upcoming deadlines
                </div>
              )}
              
              <div className="mt-4 text-center">
                <Button variant="outline" asChild>
                  <Link to="/timeline">
                    View Timeline <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="py-3 px-4 text-left">Project Name</th>
                  <th className="py-3 px-4 text-left">Client Name</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Progress</th>
                  <th className="py-3 px-4 text-left">Deadline</th>
                </tr>
              </thead>
              <tbody>
                {projects.slice(0, 5).map(project => {
                  return (
                    <tr key={project.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <Link to={`/project/${project.id}`} className="font-medium hover:underline">
                          {project.name}
                        </Link>
                      </td>
                      <td className="py-3 px-4">{project.clientName || "N/A"}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={project.status} />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <ProgressBar 
                            progress={project.progress} 
                            status={project.status}
                            className="w-24" 
                          />
                          <span>{project.progress}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{formatDate(project.deadline)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-center">
            <Button variant="outline" asChild>
              <Link to="/projects">
                View All Projects <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
