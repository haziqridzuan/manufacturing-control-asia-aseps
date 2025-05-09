
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { projects, getSupplierById, purchaseOrders } from "@/data/mockData";
import { Project, ProjectStatus, PurchaseOrder } from "@/types";
import { cn } from "@/lib/utils";
import { useProjectsData } from "@/hooks/useProjectsData";
import { useProjectPurchaseOrdersData } from "@/hooks/usePurchaseOrdersData";
import { formatDate } from "@/utils/formatters";
import { ShoppingCart } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";

const Timeline = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [filter, setFilter] = useState<ProjectStatus | "all">("all");
  
  // Fetch project data
  const { projects: projectsData } = useProjectsData();
  const { data: projectPOs } = useProjectPurchaseOrdersData(selectedProject || undefined);
  
  // Get project ID from URL if present
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get("project");
    if (projectId) {
      setSelectedProject(projectId);
    }
  }, []);

  const allProjects = projectsData?.data || projects;
  
  const filteredProjects = allProjects.filter(project => {
    if (filter !== "all" && project.status !== filter) {
      return false;
    }
    return true;
  });

  const projectEvents = selectedProject 
    ? generateProjectTimeline(selectedProject, allProjects)
    : [];
    
  const purchaseOrderEvents = selectedProject && projectPOs
    ? generatePOTimeline(projectPOs, selectedProject)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-actemium-darkBlue">Project Timeline</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-actemium-blue/20">
          <CardHeader className="border-b border-actemium-blue/10">
            <CardTitle className="text-lg text-actemium-blue">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-actemium-darkBlue">Project</label>
              <Select
                value={selectedProject || ""}
                onValueChange={(value) => setSelectedProject(value)}
              >
                <SelectTrigger className="border-actemium-blue/30 focus:ring-actemium-blue/30">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">All Projects</SelectItem>
                  {allProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block text-actemium-darkBlue">Status</label>
              <Select
                value={filter}
                onValueChange={(value) => setFilter(value as ProjectStatus | "all")}
              >
                <SelectTrigger className="border-actemium-blue/30 focus:ring-actemium-blue/30">
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
              className="w-full border-actemium-blue text-actemium-blue hover:bg-actemium-blue hover:text-white"
              onClick={() => {
                setSelectedProject(null);
                setFilter("all");
              }}
            >
              Reset Filters
            </Button>
          </CardContent>
        </Card>
        
        <div className="md:col-span-2 space-y-6">
          <Card className="border-actemium-blue/20">
            <CardHeader className="border-b border-actemium-blue/10">
              <CardTitle className="text-lg text-actemium-blue">
                {selectedProject 
                  ? `Timeline for ${allProjects.find(p => p.id === selectedProject)?.name}` 
                  : "Project Timeline"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-actemium-blue/30"></div>
                
                {/* Timeline events */}
                <div className="space-y-6 pl-12 relative">
                  {projectEvents.length > 0 ? (
                    projectEvents.map((event, index) => (
                      <div key={index} className="relative">
                        {/* Timeline dot */}
                        <div className={cn(
                          "absolute -left-8 w-4 h-4 rounded-full border-2",
                          event.completed ? "bg-actemium-blue border-actemium-darkBlue" : "bg-background border-actemium-blue/50"
                        )}></div>
                        
                        {/* Event content */}
                        <div>
                          <h3 className="font-medium text-actemium-darkBlue">{event.title}</h3>
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
          
          {selectedProject && (
            <Card className="border-actemium-blue/20">
              <CardHeader className="border-b border-actemium-blue/10">
                <CardTitle className="text-lg text-actemium-blue flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Purchase Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {projectPOs && projectPOs.length > 0 ? (
                  <div className="space-y-6">
                    {purchaseOrderEvents.map((event, index) => (
                      <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium text-actemium-darkBlue">{event.poNumber}</h3>
                            <p className="text-sm text-muted-foreground">{event.partName}</p>
                          </div>
                          <StatusBadge status={event.status} />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                          <div>
                            <p className="text-sm font-medium">Order Details:</p>
                            <ul className="text-sm mt-1 space-y-1">
                              <li><span className="text-muted-foreground">Quantity:</span> {event.quantity}</li>
                              <li><span className="text-muted-foreground">Created:</span> {formatDate(event.dateCreated)}</li>
                              <li><span className="text-muted-foreground">Placed by:</span> {event.placedBy}</li>
                              <li><span className="text-muted-foreground">Client:</span> {event.clientName}</li>
                            </ul>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium">Timeline:</p>
                            <ul className="text-sm mt-1 space-y-1">
                              <li>
                                <span className="text-muted-foreground">Order Date:</span> {formatDate(event.dateCreated)}
                              </li>
                              {event.contractualDeadline && (
                                <li>
                                  <span className="text-muted-foreground">Contractual Deadline:</span> {formatDate(event.contractualDeadline)}
                                </li>
                              )}
                              {event.shipmentDate && (
                                <li>
                                  <span className="text-muted-foreground">Shipment Date:</span> {formatDate(event.shipmentDate)}
                                </li>
                              )}
                              {event.progress !== null && (
                                <li>
                                  <span className="text-muted-foreground">Progress:</span> {event.progress}%
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                        
                        {event.notes && (
                          <div className="mt-3">
                            <p className="text-sm font-medium">Notes:</p>
                            <p className="text-sm mt-1">{event.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    No purchase orders found for this project.
                  </div>
                )}
              </CardContent>
            </Card>
          )}
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

interface POTimelineEvent {
  poNumber: string;
  partName: string;
  quantity: number;
  status: string;
  dateCreated: string;
  contractualDeadline: string | null;
  shipmentDate: string | null;
  placedBy: string;
  clientName: string;
  progress: number | null;
  notes: string | null;
}

// Generate mock timeline events for a project
const generateProjectTimeline = (projectId: string, projects: Project[]): TimelineEvent[] => {
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

// Generate timeline events for purchase orders
const generatePOTimeline = (purchaseOrders: any[], projectId: string): POTimelineEvent[] => {
  return purchaseOrders.map(po => ({
    poNumber: po.po_number,
    partName: po.part_name,
    quantity: po.quantity,
    status: po.status,
    dateCreated: po.date_created,
    contractualDeadline: po.contractual_deadline,
    shipmentDate: po.shipment_date,
    placedBy: po.placed_by,
    clientName: po.client_name,
    progress: po.progress,
    notes: po.notes
  }));
};

export default Timeline;
