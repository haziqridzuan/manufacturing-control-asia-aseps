
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { suppliers } from "@/data/mockData";

const GlobalMap = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Global Map</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Project & Supplier Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg bg-muted/30 p-12 text-center">
            <h3 className="text-xl font-medium mb-4">Interactive Global Map</h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              An interactive map showing supplier locations and project sites across the globe will be displayed here. The map will provide geographical insights into your manufacturing and fabrication network.
            </p>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {suppliers.map(supplier => (
              <div key={supplier.id} className="border p-4 rounded-lg">
                <h4 className="font-medium">{supplier.name}</h4>
                <p className="text-muted-foreground">{supplier.country}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalMap;
