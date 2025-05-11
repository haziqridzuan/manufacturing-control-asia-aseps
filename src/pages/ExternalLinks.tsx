
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, ExternalLinkType } from "@/types";
import { FileArchive, FileText, Link2 } from "lucide-react";
import { projects, suppliers, clients, purchaseOrders } from "@/data/mockData";

// Mock data for external links - in a real app, this would come from the API
const externalLinks: ExternalLink[] = [
  {
    id: "link1",
    title: "Weekly Report - Project Alpha",
    url: "H:\\Realisation\\01-Projets_En_Cours\\P0664204-I63-FORMULA_UK_Blue Bird Line\\03-ACHAT\\05-Suivi_fabrications\\VIETNAM\\HONG CHAU\\PO966029670 [chaudronnerie asie]\\Weekly report",
    type: "weekly-report",
    projectId: "p1",
    dateAdded: "2025-04-28"
  },
  {
    id: "link2",
    title: "Manufacturing Photos - Chassis Components",
    url: "H:\\Realisation\\01-Projets_En_Cours\\P0664204-I63-FORMULA_UK_Blue Bird Line\\03-ACHAT\\05-Suivi_fabrications\\VIETNAM\\HONG CHAU\\PO966029670 [chaudronnerie asie]\\Manufacturing Photos",
    type: "manufacturing-control",
    projectId: "p2",
    poId: "po2",
    dateAdded: "2025-04-25"
  },
  {
    id: "link3",
    title: "Shipment Tracking - Engine Parts",
    url: "H:\\Realisation\\01-Projets_En_Cours\\P0664204-I63-FORMULA_UK_Blue Bird Line\\03-ACHAT\\05-Suivi_fabrications\\VIETNAM\\HONG CHAU\\PO966029670 [chaudronnerie asie]\\Shipment",
    type: "shipment",
    projectId: "p1",
    poId: "po1",
    dateAdded: "2025-04-22"
  }
];

const ExternalLinks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<ExternalLinkType | "all">("all");
  const [filterProject, setFilterProject] = useState<string | "all">("all");
  const [filterPO, setFilterPO] = useState<string | "all">("all");
  const [filterSupplier, setFilterSupplier] = useState<string | "all">("all");
  const [filterClient, setFilterClient] = useState<string | "all">("all");
  
  // Filter links based on all filters
  const filteredLinks = externalLinks.filter(link => {
    const matchesSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          link.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || link.type === filterType;
    const matchesProject = filterProject === "all" || link.projectId === filterProject;
    const matchesPO = filterPO === "all" || link.poId === filterPO;
    
    // For supplier and client filters, we need to check the related projects/POs
    const matchesSupplier = filterSupplier === "all" || (() => {
      // Check if the link is related to a project with this supplier
      if (link.projectId) {
        const project = projects.find(p => p.id === link.projectId);
        return project?.supplierId === filterSupplier;
      }
      // Or if the link is related to a PO with this supplier
      if (link.poId) {
        const po = purchaseOrders.find(po => po.id === link.poId);
        return po?.supplierId === filterSupplier;
      }
      return false;
    })();
    
    const matchesClient = filterClient === "all" || (() => {
      // Check if the link is related to a project with this client
      if (link.projectId) {
        const project = projects.find(p => p.id === link.projectId);
        return project?.clientId === filterClient;
      }
      // Or if the link is related to a PO with this client
      if (link.poId) {
        const po = purchaseOrders.find(po => po.id === link.poId);
        return po?.clientId === filterClient;
      }
      return false;
    })();
    
    return matchesSearch && matchesType && matchesProject && matchesPO && matchesSupplier && matchesClient;
  });
  
  const getLinkIcon = (type: ExternalLinkType) => {
    switch (type) {
      case "weekly-report":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "manufacturing-control":
        return <FileArchive className="h-5 w-5 text-green-500" />;
      case "shipment":
        return <Link2 className="h-5 w-5 text-amber-500" />;
      default:
        return <Link2 className="h-5 w-5" />;
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setFilterProject("all");
    setFilterPO("all");
    setFilterSupplier("all");
    setFilterClient("all");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">External Resources</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">External Links & Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6">
            {/* Search and filter controls */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search external links..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <Select
                  value={filterType}
                  onValueChange={(value: ExternalLinkType | "all") => setFilterType(value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="weekly-report">Weekly Reports</SelectItem>
                    <SelectItem value="manufacturing-control">Manufacturing Control</SelectItem>
                    <SelectItem value="shipment">Shipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Additional filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Project filter */}
              <Select
                value={filterProject}
                onValueChange={(value) => setFilterProject(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* PO filter */}
              <Select
                value={filterPO}
                onValueChange={(value) => setFilterPO(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Purchase Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All POs</SelectItem>
                  {purchaseOrders.map(po => (
                    <SelectItem key={po.id} value={po.id}>{po.poNumber}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Supplier filter */}
              <Select
                value={filterSupplier}
                onValueChange={(value) => setFilterSupplier(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Suppliers</SelectItem>
                  {suppliers.map(supplier => (
                    <SelectItem key={supplier.id} value={supplier.id}>{supplier.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Client filter */}
              <Select
                value={filterClient}
                onValueChange={(value) => setFilterClient(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Reset filters button */}
            <div className="flex justify-end">
              <Button variant="outline" onClick={resetFilters}>Reset Filters</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLinks.map(link => (
              <Card key={link.id} className="overflow-hidden">
                <div className="p-4 flex items-start space-x-4">
                  <div className="bg-muted p-2 rounded-md">
                    {getLinkIcon(link.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-medium">{link.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {link.description || `${link.type.replace("-", " ")} document`}
                    </p>
                    <p className="text-xs text-muted-foreground">Added: {link.dateAdded}</p>
                  </div>
                </div>
                <div className="border-t p-4">
                  <Button asChild variant="outline" className="w-full">
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      Open Link
                    </a>
                  </Button>
                </div>
              </Card>
            ))}
            
            {filteredLinks.length === 0 && (
              <div className="col-span-full py-10 text-center text-muted-foreground">
                No external links found matching your filters.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExternalLinks;
