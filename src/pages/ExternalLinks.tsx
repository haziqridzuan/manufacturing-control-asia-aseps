
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, ExternalLinkType } from "@/types";
import { FileArchive, FileText, Link2, Filter } from "lucide-react";
import { projects, clients, suppliers, purchaseOrders } from "@/data/mockData";

// Mock data for external links - in a real app, this would come from the API
const externalLinks: ExternalLink[] = [
  {
    id: "link1",
    title: "Weekly Report - Project Alpha",
    url: "H:\\Realisation\\01-Projets_En_Cours\\P0664204-I63-FORMULA_UK_Blue Bird Line\\03-ACHAT\\05-Suivi_fabrications\\VIETNAM\\HONG CHAU\\PO966029670 [chaudronnerie asie]\\Weekly report",
    type: "weekly-report",
    projectId: "p1",
    supplierId: "s1",
    clientId: "c1",
    dateAdded: "2025-04-28"
  },
  {
    id: "link2",
    title: "Manufacturing Photos - Chassis Components",
    url: "H:\\Realisation\\01-Projets_En_Cours\\P0664204-I63-FORMULA_UK_Blue Bird Line\\03-ACHAT\\05-Suivi_fabrications\\JAPAN\\ASIA TECH\\PO966029671 [manufacturing photos]",
    type: "manufacturing-control",
    projectId: "p2",
    poId: "po2",
    supplierId: "s2",
    clientId: "c2",
    dateAdded: "2025-04-25"
  },
  {
    id: "link3",
    title: "Shipment Tracking - Engine Parts",
    url: "H:\\Realisation\\01-Projets_En_Cours\\P0664204-I63-FORMULA_UK_Blue Bird Line\\03-ACHAT\\05-Suivi_fabrications\\GERMANY\\EUR_FAB\\PO966029672 [shipment tracking]",
    type: "shipment",
    projectId: "p1",
    poId: "po1",
    supplierId: "s3",
    clientId: "c1",
    dateAdded: "2025-04-22"
  }
];

const ExternalLinks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<ExternalLinkType | "all">("all");
  const [filterProject, setFilterProject] = useState<string>("all");
  const [filterPO, setFilterPO] = useState<string>("all");
  const [filterSupplier, setFilterSupplier] = useState<string>("all");
  const [filterClient, setFilterClient] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter links based on all filters
  const filteredLinks = externalLinks.filter(link => {
    // Search filter
    const matchesSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          link.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type filter
    const matchesType = filterType === "all" || link.type === filterType;
    
    // Project filter
    const matchesProject = filterProject === "all" || link.projectId === filterProject;
    
    // PO filter
    const matchesPO = filterPO === "all" || link.poId === filterPO;
    
    // Supplier filter
    const matchesSupplier = filterSupplier === "all" || link.supplierId === filterSupplier;
    
    // Client filter
    const matchesClient = filterClient === "all" || link.clientId === filterClient;
    
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
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">External Resources</h1>
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">External Links & Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search external links..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Link Type</label>
                  <Select
                    value={filterType}
                    onValueChange={(value: ExternalLinkType | "all") => setFilterType(value)}
                  >
                    <SelectTrigger>
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
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Project</label>
                  <Select
                    value={filterProject}
                    onValueChange={(value) => setFilterProject(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      {projects.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Purchase Order</label>
                  <Select
                    value={filterPO}
                    onValueChange={(value) => setFilterPO(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by PO" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All POs</SelectItem>
                      {purchaseOrders.map(po => (
                        <SelectItem key={po.id} value={po.id}>
                          {po.poNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Supplier</label>
                  <Select
                    value={filterSupplier}
                    onValueChange={(value) => setFilterSupplier(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Suppliers</SelectItem>
                      {suppliers.map(supplier => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Client</label>
                  <Select
                    value={filterClient}
                    onValueChange={(value) => setFilterClient(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Clients</SelectItem>
                      {clients.map(client => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLinks.map(link => {
              const project = projects.find(p => p.id === link.projectId);
              const supplier = suppliers.find(s => s.id === link.supplierId);
              const client = clients.find(c => c.id === link.clientId);
              const po = purchaseOrders.find(po => po.id === link.poId);
              
              return (
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
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>Added: {link.dateAdded}</p>
                        {project && <p>Project: {project.name}</p>}
                        {supplier && <p>Supplier: {supplier.name}</p>}
                        {client && <p>Client: {client.name}</p>}
                        {po && <p>PO: {po.poNumber}</p>}
                      </div>
                    </div>
                  </div>
                  <div className="border-t p-4">
                    <Button asChild variant="outline" className="w-full">
                      <a href={`file:///${link.url}`} target="_blank" rel="noopener noreferrer">
                        Open Local File
                      </a>
                    </Button>
                  </div>
                </Card>
              );
            })}
            
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
