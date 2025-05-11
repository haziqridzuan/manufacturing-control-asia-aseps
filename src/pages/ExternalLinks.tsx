import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, ExternalLinkType } from "@/types";
import { FileArchive, FileText, Link2, Filter } from "lucide-react";
import { projects, purchaseOrders, suppliers } from "@/data/mockData";
import { supabase } from "@/integrations/supabase/client";
import { adaptExternalLink } from "@/utils/typeAdapters";

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
    url: "H:\\Realisation\\01-Projets_En_Cours\\P0664204-I63-FORMULA_UK_Blue Bird Line\\03-ACHAT\\05-Suivi_fabrications\\Manufacturing Photos",
    type: "manufacturing-control",
    projectId: "p2",
    poId: "po2",
    dateAdded: "2025-04-25"
  },
  {
    id: "link3",
    title: "Shipment Tracking - Engine Parts",
    url: "H:\\Realisation\\01-Projets_En_Cours\\P0664204-I63-FORMULA_UK_Blue Bird Line\\03-ACHAT\\05-Suivi_fabrications\\Shipment\\engine-parts",
    type: "shipment",
    projectId: "p1",
    poId: "po1",
    dateAdded: "2025-04-22"
  }
];

const ExternalLinks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<ExternalLinkType | "all">("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [poFilter, setPoFilter] = useState<string>("all");
  const [supplierFilter, setSupplierFilter] = useState<string>("all");
  const [clientFilter, setClientFilter] = useState<string>("all");
  const [links, setLinks] = useState<ExternalLink[]>(externalLinks);
  
  useEffect(() => {
    // In a real app, this would fetch data from Supabase
    const fetchLinks = async () => {
      try {
        const { data, error } = await supabase
          .from('external_links')
          .select('*');
          
        if (error) {
          console.error('Error fetching external links:', error);
          return;
        }
        
        if (data && data.length > 0) {
          // Convert Supabase row format to our app format
          const adaptedLinks = data.map(adaptExternalLink);
          setLinks(adaptedLinks);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    // Uncomment when Supabase is connected
    // fetchLinks();
  }, []);
  
  // Filter links based on search term and filters
  const filteredLinks = links.filter(link => {
    const matchesSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          link.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || link.type === filterType;
    const matchesProject = projectFilter === "all" || link.projectId === projectFilter;
    const matchesPO = poFilter === "all" || link.poId === poFilter;
    
    // For supplier and client filters, we'd need to join with PO and project data
    // This is a simplified version - in real app, this would be done in the database query
    const po = link.poId ? purchaseOrders.find(p => p.id === link.poId) : null;
    const matchesSupplier = supplierFilter === "all" || (po && po.supplierId === supplierFilter);
    const matchesClient = clientFilter === "all" || (po && po.clientId === clientFilter);
    
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
      case "photos":
        return <FileArchive className="h-5 w-5 text-purple-500" />;
      case "tracking":
        return <Link2 className="h-5 w-5 text-orange-500" />;
      default:
        return <Link2 className="h-5 w-5" />;
    }
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
          {/* Enhanced filters for task #12 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="weekly-report">Weekly Reports</SelectItem>
                  <SelectItem value="manufacturing-control">Manufacturing Photos</SelectItem>
                  <SelectItem value="shipment">Shipment Tracking</SelectItem>
                  <SelectItem value="photos">Photos</SelectItem>
                  <SelectItem value="tracking">Tracking</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select
                value={projectFilter}
                onValueChange={setProjectFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Project" />
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
              <Select
                value={poFilter}
                onValueChange={setPoFilter}
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
              <Select
                value={supplierFilter}
                onValueChange={setSupplierFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Supplier" />
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
              <Select
                value={clientFilter}
                onValueChange={setClientFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  {Array.from(new Set(projects.map(p => p.clientId))).map(clientId => (
                    <SelectItem key={clientId} value={clientId || ""}>
                      {projects.find(p => p.clientId === clientId)?.clientName || "Unknown"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-2 lg:col-span-3 flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
                  setProjectFilter("all");
                  setPoFilter("all");
                  setSupplierFilter("all");
                  setClientFilter("all");
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                Reset Filters
              </Button>
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
                    {/* Show related project and PO if available */}
                    {link.projectId && (
                      <p className="text-xs text-muted-foreground">
                        Project: {projects.find(p => p.id === link.projectId)?.name || link.projectId}
                      </p>
                    )}
                    {link.poId && (
                      <p className="text-xs text-muted-foreground">
                        PO: {purchaseOrders.find(po => po.id === link.poId)?.poNumber || link.poId}
                      </p>
                    )}
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
                No external links found matching your search.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExternalLinks;
