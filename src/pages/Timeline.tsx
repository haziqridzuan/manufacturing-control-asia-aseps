
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { projects, getSupplierById } from "@/data/mockData";
import { Project, ProjectStatus } from "@/types";
import { cn } from "@/lib/utils";

const Timeline = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [filter, setFilter] = useState<ProjectStatus | "all">("all");
  
  // Get project ID from URL if present
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get("project");
    if (projectId) {
      setSelectedProject(projectId);
    }
  }, []);

  const filteredProjects = projects.filter(project => {
    if (filter !== "all" && project.status !== filter) {
      return false;
    }
    return true;
  });

  const projectEvents = selectedProject 
    ? generateProjectTimeline(selectedProject)
    : [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Project Timeline</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Project</label>
              <Select
                value={selectedProject || ""}
                onValueChange={(value) => setSelectedProject(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">All Projects</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select
                value={filter}
                onValueChange={(value) => setFilter(value as ProjectStatus | "all")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setSelectedProject(null);
                setFilter("all");
              }}
            >
              Reset Filters
            </Button>
          </CardContent>
        </Card>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedProject 
                  ? `Timeline for ${projects.find(p => p.id === selectedProject)?.name}` 
                  : "Project Timeline"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
                
                {/* Timeline events */}
                <div className="space-y-6 pl-12 relative">
                  {projectEvents.length > 0 ? (
                    projectEvents.map((event, index) => (
                      <div key={index} className="relative">
                        {/* Timeline dot */}
                        <div className={cn(
                          "absolute -left-8 w-4 h-4 rounded-full border-2",
                          event.completed ? "bg-green-500 border-green-600" : "bg-background border-muted-foreground"
                        )}></div>
                        
                        {/* Event content */}
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">{event.date}</p>
                          <p className="mt-1">{event.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      {selectedProject 
                        ? "No timeline events for this project." 
                        : "Select a project to view its timeline."}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

interface TimelineEvent {
  title: string;
  date: string;
  description: string;
  completed: boolean;
}

// Generate mock timeline events for a project
const generateProjectTimeline = (projectId: string): TimelineEvent[] => {
  const project = projects.find(p => p.id === projectId);
  if (!project) return [];
  
  const supplier = getSupplierById(project.supplierId);
  const events: TimelineEvent[] = [
    {
      title: "Project Created",
      date: "2022-09-15",
      description: `Project ${project.name} was created with ${supplier?.name}.`,
      completed: true
    },
    {
      title: "Design Phase",
      date: "2022-09-30",
      description: "Initial design and specifications were approved.",
      completed: project.progress >= 20
    },
    {
      title: "Material Procurement",
      date: "2022-10-20",
      description: "All necessary materials were ordered and received.",
      completed: project.progress >= 40
    },
    {
      title: "Fabrication Started",
      date: "2022-11-05",
      description: "Production and assembly process began.",
      completed: project.progress >= 60
    },
    {
      title: "Quality Testing",
      date: "2022-12-10",
      description: "Quality assurance tests performed on components.",
      completed: project.progress >= 80
    },
    {
      title: "Project Completion",
      date: project.deadline,
      description: "Final delivery and project handover.",
      completed: project.status === "completed"
    }
  ];
  
  return events;
};

export default Timeline;
