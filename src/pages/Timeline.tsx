
import { useState } from "react";
import { projects, formatDate, getSupplierById } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/ui/StatusBadge";
import { Project } from "@/types";
import { cn } from "@/lib/utils";

const Timeline = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  
  // Filter projects based on selection
  const displayedProjects = selectedProject
    ? projects.filter(project => project.id === selectedProject)
    : projects;
  
  // Sort projects by start date
  const sortedProjects = [...displayedProjects].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
  
  // Calculate timeline range
  const startDates = sortedProjects.map(project => new Date(project.startDate));
  const endDates = sortedProjects.map(project => new Date(project.deadline));
  
  const minDate = startDates.length > 0 ? new Date(Math.min(...startDates.map(d => d.getTime()))) : new Date();
  const maxDate = endDates.length > 0 ? new Date(Math.max(...endDates.map(d => d.getTime()))) : new Date();
  
  // Add buffer to timeline
  minDate.setMonth(minDate.getMonth() - 1);
  maxDate.setMonth(maxDate.getMonth() + 1);
  
  const timelineRange = maxDate.getTime() - minDate.getTime();
  
  // Function to calculate position on timeline
  const getTimelinePosition = (date: Date): string => {
    const position = ((date.getTime() - minDate.getTime()) / timelineRange) * 100;
    return `${position}%`;
  };
  
  // Function to calculate width on timeline
  const getTimelineWidth = (startDate: Date, endDate: Date): string => {
    const start = startDate.getTime();
    const end = endDate.getTime();
    const width = ((end - start) / timelineRange) * 100;
    return `${width}%`;
  };
  
  // Generate months for timeline header
  const generateMonths = () => {
    const months = [];
    const currentDate = new Date(minDate);
    
    while (currentDate <= maxDate) {
      months.push(new Date(currentDate));
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    return months;
  };
  
  const months = generateMonths();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Timeline View</h1>
        <div className="w-72">
          <Select
            value={selectedProject || ""}
            onValueChange={(value) => setSelectedProject(value || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Project Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedProjects.length > 0 ? (
            <div className="relative">
              {/* Timeline Header - Months */}
              <div className="relative h-10 border-b border-gray-200 mb-4">
                {months.map((month, index) => {
                  const position = getTimelinePosition(month);
                  
                  return (
                    <div 
                      key={index}
                      className="absolute top-0 -ml-12 text-xs"
                      style={{ left: position }}
                    >
                      {month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      <div className="h-2 w-0.5 bg-gray-300 absolute bottom-0 left-12 transform translate-x-0.5"></div>
                    </div>
                  );
                })}
              </div>
              
              {/* Projects Timeline */}
              <div className="space-y-8">
                {sortedProjects.map((project, index) => {
                  const startDate = new Date(project.startDate);
                  const endDate = new Date(project.deadline);
                  const position = getTimelinePosition(startDate);
                  const width = getTimelineWidth(startDate, endDate);
                  const supplier = getSupplierById(project.supplierId);
                  
                  const statusColors = {
                    'pending': 'bg-status-pending border-status-pending',
                    'in-progress': 'bg-status-in-progress border-status-in-progress',
                    'delayed': 'bg-status-delayed border-status-delayed',
                    'completed': 'bg-status-completed border-status-completed',
                  };
                  
                  return (
                    <div key={project.id} className="relative h-16">
                      {/* Project Info */}
                      <div className="absolute top-0 left-0 w-64 pr-4 h-full flex flex-col justify-center">
                        <div className="font-medium truncate">{project.name}</div>
                        <div className="text-xs text-muted-foreground">{supplier?.name}</div>
                      </div>
                      
                      {/* Timeline Bar */}
                      <div 
                        className="absolute h-8 rounded-md border-2"
                        style={{ 
                          left: `calc(${position} + 64px)`, 
                          width: width,
                          top: '50%',
                          transform: 'translateY(-50%)',
                        }}
                      >
                        {/* Render project bar with progress */}
                        <div 
                          className={cn(
                            "h-full rounded-sm opacity-80",
                            statusColors[project.status]
                          )}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                        
                        {/* Render milestones */}
                        {project.milestones.map((milestone, mIndex) => {
                          const milestoneDate = new Date(milestone.dueDate);
                          const milestonePosition = ((milestoneDate.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime())) * 100;
                          
                          if (milestonePosition < 0 || milestonePosition > 100) {
                            return null;
                          }
                          
                          return (
                            <div 
                              key={milestone.id}
                              className={cn(
                                "absolute top-full mt-1 w-3 h-3 rounded-full -ml-1.5 border-2 border-white",
                                milestone.completed ? "bg-status-completed" : "bg-white"
                              )}
                              style={{ left: `${milestonePosition}%` }}
                              title={`${milestone.title} - ${formatDate(milestone.dueDate)}`}
                            ></div>
                          );
                        })}
                        
                        {/* Display project status */}
                        <div className="absolute -bottom-6 left-0 text-xs">
                          <StatusBadge status={project.status} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No projects found for the selected criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Timeline;
