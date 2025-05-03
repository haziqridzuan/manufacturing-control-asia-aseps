
import { useState } from "react";
import { Link } from "react-router-dom";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/ui/StatusBadge";
import ProgressBar from "@/components/ui/ProgressBar";
import { projects, getSupplierById, formatDate, getDaysRemaining } from "@/data/mockData";
import { FilterOptions, Project, ProjectStatus } from "@/types";
import { cn } from "@/lib/utils";

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({});
  
  // Apply filters and search
  const filteredProjects = projects.filter((project) => {
    // Search term filter
    if (
      searchTerm &&
      !project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !project.location.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    
    // Status filter
    if (filters.status && project.status !== filters.status) {
      return false;
    }
    
    // Supplier filter
    if (filters.supplier && project.supplierId !== filters.supplier) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button>New Project</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Project List</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search projects by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={filters.status}
                onValueChange={(value: ProjectStatus | undefined) => 
                  setFilters({ ...filters, status: value as ProjectStatus })
                }
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Reset Filters */}
              <Button variant="outline" onClick={() => {
                setFilters({});
                setSearchTerm("");
              }}>
                Reset
              </Button>
            </div>
          </div>
          
          {/* Projects Table */}
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="py-3 px-4 text-left">Project Name</th>
                  <th className="py-3 px-4 text-left">Supplier</th>
                  <th className="py-3 px-4 text-left">Location</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Progress</th>
                  <th className="py-3 px-4 text-left">Deadline</th>
                  <th className="py-3 px-4 text-left">Timeline</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => {
                  const supplier = getSupplierById(project.supplierId);
                  const daysRemaining = getDaysRemaining(project.deadline);
                  
                  return (
                    <tr key={project.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <Link to={`/projects/${project.id}`} className="font-medium hover:underline">
                          {project.name}
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <Link to={`/suppliers/${supplier?.id}`} className="hover:underline">
                          {supplier?.name}
                        </Link>
                      </td>
                      <td className="py-3 px-4">{project.location}</td>
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
                      <td className="py-3 px-4">
                        <div className={cn(
                          daysRemaining < 0 ? "text-status-delayed" : 
                          daysRemaining < 7 ? "text-status-in-progress" : ""
                        )}>
                          {formatDate(project.deadline)}
                          <div className="text-xs text-muted-foreground">
                            {daysRemaining < 0 
                              ? `${Math.abs(daysRemaining)} days overdue` 
                              : `${daysRemaining} days remaining`
                            }
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/timeline?project=${project.id}`}>
                            View
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                
                {filteredProjects.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-muted-foreground">
                      No projects found matching the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Projects;
