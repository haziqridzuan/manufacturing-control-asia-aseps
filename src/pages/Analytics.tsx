
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { projects, suppliers } from "@/data/mockData";

const Analytics = () => {
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
            <div className="p-6 border rounded-lg bg-muted/30">
              <h3 className="text-lg font-medium mb-4">Project Status Distribution</h3>
              <div className="text-center text-muted-foreground">
                Charts and detailed analytics will be available soon
              </div>
            </div>
            
            <div className="p-6 border rounded-lg bg-muted/30">
              <h3 className="text-lg font-medium mb-4">Supplier Performance</h3>
              <div className="text-center text-muted-foreground">
                Charts and detailed analytics will be available soon
              </div>
            </div>
            
            <div className="p-6 border rounded-lg bg-muted/30">
              <h3 className="text-lg font-medium mb-4">Timeline Adherence</h3>
              <div className="text-center text-muted-foreground">
                Charts and detailed analytics will be available soon
              </div>
            </div>
            
            <div className="p-6 border rounded-lg bg-muted/30">
              <h3 className="text-lg font-medium mb-4">Budget Analysis</h3>
              <div className="text-center text-muted-foreground">
                Charts and detailed analytics will be available soon
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
