
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from "sonner";
import { Database, FileExport } from 'lucide-react';

const ExportData = () => {
  const [dataType, setDataType] = useState('all');
  const [format, setFormat] = useState('excel');
  const [includeArchived, setIncludeArchived] = useState(false);

  const handleExport = () => {
    // This would connect to a real export functionality in a production app
    toast.success(`Exporting ${dataType} data in ${format} format`, {
      description: `${includeArchived ? 'Including' : 'Excluding'} archived items`
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Export Data</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileExport className="h-5 w-5" />
              Export System Data
            </CardTitle>
            <CardDescription>
              Export your data in various formats for reporting or backup purposes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Type</label>
              <Select value={dataType} onValueChange={setDataType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select data type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Data</SelectItem>
                  <SelectItem value="projects">Projects Only</SelectItem>
                  <SelectItem value="clients">Clients Only</SelectItem>
                  <SelectItem value="suppliers">Suppliers Only</SelectItem>
                  <SelectItem value="purchase-orders">Purchase Orders Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Export Format</label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="archived" 
                checked={includeArchived} 
                onCheckedChange={(checked) => setIncludeArchived(!!checked)} 
              />
              <label 
                htmlFor="archived" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Include archived items
              </label>
            </div>
            
            <Button onClick={handleExport} className="w-full">
              <Database className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Backup
            </CardTitle>
            <CardDescription>
              Create a complete backup of your system data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              A complete backup includes all system data, configurations, and user settings.
              This option is recommended for complete system restoration.
            </p>
            
            <Button variant="outline" className="w-full">
              <Database className="mr-2 h-4 w-4" />
              Create Full Backup
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExportData;
