
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Upload, RefreshCw, Database } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useQueryClient } from "@tanstack/react-query";
import { generateSampleData } from "@/utils/sampleDataGenerator";

// Define table names as a type to ensure type safety
type TableName = "clients" | "projects" | "purchase_orders" | "milestones" | 
                "external_links" | "supplier_comments" | "suppliers" | "team_members";

interface TableInfo {
  name: TableName;
  label: string;
}

const Admin = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const queryClient = useQueryClient();
  
  const tables: TableInfo[] = [
    { name: "suppliers", label: "Suppliers" },
    { name: "projects", label: "Projects" },
    { name: "purchase_orders", label: "Purchase Orders" },
    { name: "milestones", label: "Milestones" },
    { name: "external_links", label: "External Links" },
    { name: "supplier_comments", label: "Supplier Comments" },
    { name: "clients", label: "Clients" },
    { name: "team_members", label: "Team Members" },
  ];

  const exportData = async () => {
    try {
      setIsExporting(true);
      
      const exportData: Record<string, any[]> = {};
      
      // Export all tables
      for (const table of tables) {
        const { data, error } = await supabase
          .from(table.name)
          .select('*');
          
        if (error) throw error;
        exportData[table.name] = data || [];
      }
      
      // Create JSON file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      // Download file
      const exportFileDefaultName = `project-fabrication-export-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success('Data exported successfully');
    } catch (error: any) {
      toast.error(`Export failed: ${error.message}`);
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const importData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsImporting(true);
      
      const file = event.target.files?.[0];
      if (!file) {
        toast.error('No file selected');
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const result = e.target?.result as string;
          const importData = JSON.parse(result) as Record<string, any[]>;
          
          // Import each table
          for (const table of tables) {
            const tableData = importData[table.name];
            
            if (Array.isArray(tableData) && tableData.length > 0) {
              // Delete existing data
              const { error: deleteError } = await supabase
                .from(table.name)
                .delete()
                .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows
                
              if (deleteError) throw deleteError;
              
              // Insert new data
              const { error: insertError } = await supabase
                .from(table.name)
                .insert(tableData);
                
              if (insertError) throw insertError;
            }
          }
          
          toast.success('Data imported successfully');
          
          // Refresh all queries
          queryClient.invalidateQueries();
        } catch (error: any) {
          toast.error(`Import failed: ${error.message}`);
          console.error('Import error:', error);
        } finally {
          setIsImporting(false);
        }
      };
      
      reader.readAsText(file);
    } catch (error: any) {
      toast.error(`Import failed: ${error.message}`);
      console.error('Import error:', error);
      setIsImporting(false);
    }
  };

  const refreshCache = () => {
    try {
      setIsRefreshing(true);
      queryClient.invalidateQueries();
      toast.success('Cache refreshed successfully');
    } catch (error: any) {
      toast.error(`Refresh failed: ${error.message}`);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleGenerateSampleData = async () => {
    try {
      setIsGenerating(true);
      
      // First, clear all existing data
      for (const table of tables) {
        const { error } = await supabase
          .from(table.name)
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows
          
        if (error) throw error;
      }
      
      // Generate new sample data
      const result = await generateSampleData();
      
      if (result.success) {
        toast.success(`Sample data generated successfully: ${JSON.stringify(result.counts)}`);
        queryClient.invalidateQueries();
      } else {
        toast.error(`Failed to generate sample data: ${result.message}`);
      }
    } catch (error: any) {
      toast.error(`Sample data generation failed: ${error.message}`);
      console.error('Sample data generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>
      
      <Tabs defaultValue="data-management">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="data-management">Data Management</TabsTrigger>
          <TabsTrigger value="system-info">System Info</TabsTrigger>
        </TabsList>
        
        <TabsContent value="data-management">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Data Management</CardTitle>
              <CardDescription>
                Import, export, or refresh application data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertTitle>Be careful with data operations</AlertTitle>
                <AlertDescription>
                  Importing data will replace all existing data in the system. Make sure to export a backup first.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Export Data</CardTitle>
                    <CardDescription>
                      Download all data as JSON
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <Button 
                      onClick={exportData} 
                      disabled={isExporting} 
                      className="w-full"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {isExporting ? 'Exporting...' : 'Export Data'}
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Import Data</CardTitle>
                    <CardDescription>
                      Upload JSON data to system
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <Button 
                      onClick={() => document.getElementById('file-input')?.click()} 
                      disabled={isImporting}
                      className="w-full"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {isImporting ? 'Importing...' : 'Import Data'}
                    </Button>
                    <input
                      id="file-input"
                      type="file"
                      accept=".json"
                      onChange={importData}
                      style={{ display: 'none' }}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Refresh Cache</CardTitle>
                    <CardDescription>
                      Clear and reload all data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <Button 
                      onClick={refreshCache} 
                      disabled={isRefreshing}
                      className="w-full"
                      variant="outline"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      {isRefreshing ? 'Refreshing...' : 'Refresh Cache'}
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Generate Sample Data</CardTitle>
                    <CardDescription>
                      Create demo data for testing
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <Button 
                      onClick={handleGenerateSampleData}
                      disabled={isGenerating}
                      className="w-full"
                      variant="secondary"
                    >
                      <Database className="mr-2 h-4 w-4" />
                      {isGenerating ? 'Generating...' : 'Generate Data'}
                    </Button>
                  </CardContent>
                  <CardFooter className="pt-0 text-xs text-muted-foreground">
                    Warning: This will clear all existing data
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system-info">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Information</CardTitle>
              <CardDescription>
                Overview of system configuration and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-md">
                    <div className="text-sm text-muted-foreground">Database Status</div>
                    <div className="font-medium">Connected</div>
                  </div>
                  <div className="p-4 border rounded-md">
                    <div className="text-sm text-muted-foreground">Version</div>
                    <div className="font-medium">1.0.0</div>
                  </div>
                  <div className="p-4 border rounded-md">
                    <div className="text-sm text-muted-foreground">Database Provider</div>
                    <div className="font-medium">Supabase</div>
                  </div>
                  <div className="p-4 border rounded-md">
                    <div className="text-sm text-muted-foreground">API Status</div>
                    <div className="font-medium">Online</div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-base font-medium mb-2">Database Tables</h3>
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 border-b text-left">Table Name</th>
                          <th className="py-2 px-4 border-b text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tables.map(table => (
                          <tr key={table.name} className="border-b last:border-0">
                            <td className="py-2 px-4">{table.label}</td>
                            <td className="py-2 px-4">
                              <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                                Available
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
