
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { projects, suppliers, getProjectsByStatus, purchaseOrders } from "@/data/mockData";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from "recharts";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const Analytics = () => {
  // State for date range filter - update type to use DateRange from react-day-picker
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  
  useEffect(() => {
    // In a real app, this would fetch data from Supabase
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*');
          
        if (error) {
          console.error('Error fetching projects:', error);
          return;
        }
        
        // Process the data
        console.log('Projects fetched from Supabase:', data);
        
        // In a real implementation, you would update state with this data
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    // Uncomment when Supabase is connected
    // fetchData();
  }, []);
  
  // Date filter function
  const filterDataByDate = (data: any[], dateField: string) => {
    if (!dateRange?.from && !dateRange?.to) return data;
    
    return data.filter(item => {
      const itemDate = new Date(item[dateField]);
      const isAfterFrom = !dateRange.from || itemDate >= dateRange.from;
      const isBeforeTo = !dateRange.to || itemDate <= dateRange.to;
      return isAfterFrom && isBeforeTo;
    });
  };
  
  // Filtered data
  const filteredProjects = filterDataByDate(projects, 'startDate');
  const filteredPOs = filterDataByDate(purchaseOrders, 'dateCreated');
  
  // Project status distribution for pie chart
  const statusDistribution = [
    { name: 'In Progress', value: getProjectsByStatus('in-progress').filter(p => filterDataByDate([p], 'startDate').length > 0).length, color: '#3498db' },
    { name: 'Completed', value: getProjectsByStatus('completed').filter(p => filterDataByDate([p], 'startDate').length > 0).length, color: '#2ecc71' },
    { name: 'Delayed', value: getProjectsByStatus('delayed').filter(p => filterDataByDate([p], 'startDate').length > 0).length, color: '#e74c3c' },
    { name: 'Pending', value: getProjectsByStatus('pending').filter(p => filterDataByDate([p], 'startDate').length > 0).length, color: '#95a5a6' },
  ];

  // Budget analysis data
  const budgetData = filteredProjects.map(project => ({
    name: project.name.split(' ').slice(0, 2).join(' '), // Shortened name
    budget: project.budget / 1000, // Convert to thousands for readability
    status: project.status
  }));

  // Timeline data based on POs
  const getMonthlyPOData = () => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();
    
    const monthlyData = monthNames.map(month => ({
      name: month,
      planned: 0,
      actual: 0
    }));
    
    filteredPOs.forEach(po => {
      const createdDate = new Date(po.dateCreated);
      if (createdDate.getFullYear() === currentYear) {
        const monthIndex = createdDate.getMonth();
        monthlyData[monthIndex].planned++;
        
        if (po.status === 'completed') {
          monthlyData[monthIndex].actual++;
        }
      }
    });
    
    return monthlyData;
  };
  
  const timelineData = getMonthlyPOData();

  // Supplier performance data
  const supplierPerformanceData = suppliers
    .filter(supplier => {
      // Check if this supplier has any POs in the filtered range
      const supplierHasFilteredPOs = filteredPOs.some(po => po.supplierId === supplier.id);
      return supplierHasFilteredPOs;
    })
    .map(supplier => ({
      name: supplier.name.split(' ')[0], // First word of supplier name
      rating: supplier.rating,
      deliveryRate: supplier.onTimeDeliveryRate
    }));

  // Project Timeline data - Added for task #9
  const projectTimelineData = filteredProjects.map(project => {
    const startDate = new Date(project.startDate);
    const deadline = new Date(project.deadline);
    const today = new Date();
    
    // Calculate days elapsed and total days
    const totalDays = Math.ceil((deadline.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      name: project.name.split(' ').slice(0, 2).join(' '), // Shortened name
      elapsed: elapsedDays < 0 ? 0 : elapsedDays,
      remaining: remainingDays < 0 ? 0 : remainingDays,
      total: totalDays,
      progress: project.progress
    };
  }).sort((a, b) => b.progress - a.progress).slice(0, 5); // Top 5 projects by progress

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics</h1>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>All Time</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
            <div className="flex items-center justify-between p-3 border-t">
              <Button
                variant="ghost"
                onClick={() => setDateRange(undefined)}
              >
                Clear
              </Button>
              <Button
                onClick={() => document.querySelector('[data-radix-popper-content-wrapper]')?.dispatchEvent(
                  new KeyboardEvent('keydown', { key: 'Escape' })
                )}
              >
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Project Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer config={{}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Pie
                          data={statusDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => percent > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
                        >
                          {statusDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Supplier Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Supplier Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer config={{}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={supplierPerformanceData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 30,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="rating" name="Rating (1-5)" fill="#3498db" />
                        <Bar dataKey="deliveryRate" name="On-time Delivery %" fill="#2ecc71" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Timeline Adherence */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Timeline Adherence</CardTitle>
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
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line type="monotone" dataKey="planned" stroke="#3498db" activeDot={{ r: 8 }} name="Planned POs" />
                        <Line type="monotone" dataKey="actual" stroke="#e74c3c" name="Completed POs" />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Budget Spent Analysis - Changed from Budget Analysis for task #14 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Budget Spent Analysis (in thousands)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer config={{}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={budgetData}
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
                        <Bar dataKey="budget" name="Budget Spent (thousands)" fill="#8884d8">
                          {budgetData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={
                                entry.status === 'completed' ? '#2ecc71' : 
                                entry.status === 'in-progress' ? '#3498db' : 
                                entry.status === 'delayed' ? '#e74c3c' : 
                                '#95a5a6'
                              } 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Project Timeline Chart - Added for task #9 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Project Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer config={{}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={projectTimelineData}
                        layout="vertical"
                        margin={{
                          top: 20,
                          right: 30,
                          left: 50,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="elapsed" stackId="a" name="Days Elapsed" fill="#3498db" />
                        <Bar dataKey="remaining" stackId="a" name="Days Remaining" fill="#95a5a6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Summary Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Total Projects</p>
              <p className="text-2xl font-bold">{filteredProjects.length}</p>
            </div>
            {/* Changed label from "Total Budget" to "Total Budget Spent" for task #13 */}
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Total Budget Spent</p>
              <p className="text-2xl font-bold">${(filteredProjects.reduce((sum, p) => sum + (p.budget * p.progress / 100), 0) / 1000000).toFixed(1)}M</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Total Purchase Orders</p>
              <p className="text-2xl font-bold">{filteredPOs.length}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-2xl font-bold">
                {filteredProjects.length > 0 
                  ? Math.round((filteredProjects.filter(p => p.status === 'completed').length / filteredProjects.length) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
