
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { projects, suppliers } from "@/data/mockData";
import WorldMap from "@/components/WorldMap";

const GlobalMap = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'ongoing' | 'completed'>('all');
  
  // Calculate counts by region
  const regions = {
    'North America': { ongoing: 0, completed: 0 },
    'Europe': { ongoing: 0, completed: 0 },
    'Asia': { ongoing: 0, completed: 0 },
    'South America': { ongoing: 0, completed: 0 },
    'Africa': { ongoing: 0, completed: 0 },
    'Middle East': { ongoing: 0, completed: 0 }
  };
  
  // Assign projects to regions based on location
  projects.forEach(project => {
    if (project.location.includes("USA") || project.location.includes("United States") || project.location.includes("New York")) {
      if (project.status === 'completed') {
        regions['North America'].completed++;
      } else {
        regions['North America'].ongoing++;
      }
    } else if (project.location.includes("Germany") || project.location.includes("Berlin")) {
      if (project.status === 'completed') {
        regions['Europe'].completed++;
      } else {
        regions['Europe'].ongoing++;
      }
    } else if (project.location.includes("Japan") || project.location.includes("Tokyo")) {
      if (project.status === 'completed') {
        regions['Asia'].completed++;
      } else {
        regions['Asia'].ongoing++;
      }
    } else if (project.location.includes("Brazil") || project.location.includes("São Paulo")) {
      if (project.status === 'completed') {
        regions['South America'].completed++;
      } else {
        regions['South America'].ongoing++;
      }
    } else if (project.location.includes("Africa") || project.location.includes("South Africa")) {
      if (project.status === 'completed') {
        regions['Africa'].completed++;
      } else {
        regions['Africa'].ongoing++;
      }
    } else if (project.location.includes("Dubai") || project.location.includes("UAE")) {
      if (project.status === 'completed') {
        regions['Middle East'].completed++;
      } else {
        regions['Middle East'].ongoing++;
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Global Map</h1>
        <div className="flex gap-2">
          <Badge 
            variant={selectedFilter === 'all' ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedFilter('all')}
          >
            All Projects
          </Badge>
          <Badge 
            variant={selectedFilter === 'ongoing' ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedFilter('ongoing')}
          >
            Ongoing
          </Badge>
          <Badge 
            variant={selectedFilter === 'completed' ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedFilter('completed')}
          >
            Completed
          </Badge>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Project & Supplier Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg bg-muted/30 p-4 h-96 mb-6">
            <WorldMap regions={regions} selectedFilter={selectedFilter} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
            {Object.entries(regions).map(([region, data]) => (
              <Card key={region} className="overflow-hidden">
                <CardContent className="p-4">
                  <h3 className="font-medium text-md">{region}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Ongoing</p>
                      <p className="font-semibold text-lg">{data.ongoing}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Completed</p>
                      <p className="font-semibold text-lg">{data.completed}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total</p>
                      <p className="font-semibold text-lg">{data.ongoing + data.completed}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <h3 className="font-medium text-lg mt-6 mb-3">Supplier Locations</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
