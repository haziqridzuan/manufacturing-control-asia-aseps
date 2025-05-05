
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { projects, suppliers, getProjectsByStatus } from "@/data/mockData";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from "recharts";

const Analytics = () => {
  // Project status distribution for pie chart
  const statusDistribution = [
    { name: 'In Progress', value: getProjectsByStatus('in-progress').length, color: '#3498db' },
    { name: 'Completed', value: getProjectsByStatus('completed').length, color: '#2ecc71' },
    { name: 'Delayed', value: getProjectsByStatus('delayed').length, color: '#e74c3c' },
    { name: 'Pending', value: getProjectsByStatus('pending').length, color: '#95a5a6' },
  ];

  // Budget analysis data
  const budgetData = projects.map(project => ({
    name: project.name.split(' ').slice(0, 2).join(' '), // Shortened name
    budget: project.budget / 1000, // Convert to thousands for readability
    status: project.status
  }));

  // Timeline adherence data (simulated for this example)
  const timelineData = [
    { name: 'Jan', planned: 2, actual: 1 },
    { name: 'Feb', planned: 4, actual: 3 },
    { name: 'Mar', planned: 3, actual: 2 },
    { name: 'Apr', planned: 5, actual: 6 },
    { name: 'May', planned: 6, actual: 5 },
  ];

  // Supplier performance data
  const supplierPerformanceData = suppliers.map(supplier => ({
    name: supplier.name.split(' ')[0], // First word of supplier name
    rating: supplier.rating,
    deliveryRate: supplier.onTimeDeliveryRate
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics</h1>
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
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
                        <Line type="monotone" dataKey="planned" stroke="#3498db" activeDot={{ r: 8 }} name="Planned Completions" />
                        <Line type="monotone" dataKey="actual" stroke="#e74c3c" name="Actual Completions" />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Budget Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Budget Analysis (in thousands)</CardTitle>
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
                        <Bar dataKey="budget" fill="#8884d8">
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
              <p className="text-2xl font-bold">{projects.length}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="text-2xl font-bold">${(projects.reduce((sum, p) => sum + p.budget, 0) / 1000000).toFixed(1)}M</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Suppliers</p>
              <p className="text-2xl font-bold">{suppliers.length}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-2xl font-bold">{Math.round((getProjectsByStatus('completed').length / projects.length) * 100)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
