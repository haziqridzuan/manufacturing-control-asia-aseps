
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FileText, Download, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ExportData = () => {
  const [selectedFormat, setSelectedFormat] = useState("csv");
  const [includeProjects, setIncludeProjects] = useState(true);
  const [includeSuppliers, setIncludeSuppliers] = useState(true);
  const [includePOs, setIncludePOs] = useState(true);
  const [dateRange, setDateRange] = useState("all");

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Export Data</h1>
      
      <Tabs defaultValue="standard" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="standard">Standard Reports</TabsTrigger>
          <TabsTrigger value="custom">Custom Exports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Exports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="standard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Projects Summary
                </CardTitle>
                <CardDescription>Complete overview of all projects</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <div className="space-x-2">
                  <Select defaultValue="csv">
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Suppliers Report
                </CardTitle>
                <CardDescription>Complete supplier performance data</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <div className="space-x-2">
                  <Select defaultValue="csv">
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  PO Status Report
                </CardTitle>
                <CardDescription>All purchase orders with status</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <div className="space-x-2">
                  <Select defaultValue="csv">
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Data Export</CardTitle>
              <CardDescription>Select the data you want to export</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Include in export:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="projects" 
                      checked={includeProjects}
                      onCheckedChange={(checked) => setIncludeProjects(!!checked)} 
                    />
                    <Label htmlFor="projects">Projects</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="suppliers" 
                      checked={includeSuppliers}
                      onCheckedChange={(checked) => setIncludeSuppliers(!!checked)} 
                    />
                    <Label htmlFor="suppliers">Suppliers</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="pos" 
                      checked={includePOs}
                      onCheckedChange={(checked) => setIncludePOs(!!checked)} 
                    />
                    <Label htmlFor="pos">Purchase Orders</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Date range:</h3>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Select 
                      value={dateRange}
                      onValueChange={setDateRange}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All time</SelectItem>
                        <SelectItem value="this-month">This month</SelectItem>
                        <SelectItem value="last-month">Last month</SelectItem>
                        <SelectItem value="this-quarter">This quarter</SelectItem>
                        <SelectItem value="last-quarter">Last quarter</SelectItem>
                        <SelectItem value="this-year">This year</SelectItem>
                        <SelectItem value="custom">Custom range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {dateRange === 'custom' && (
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        Select dates
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Export format:</h3>
                <div className="flex flex-wrap gap-4">
                  <Select 
                    value={selectedFormat}
                    onValueChange={setSelectedFormat}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="pt-4">
                <Button>
                  <Download className="h-4 w-4 mr-1" />
                  Generate and Download Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Configure automatic data exports</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Set up recurring exports to be automatically sent to your email or a shared folder.</p>
              <Button>Configure Scheduled Exports</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExportData;
