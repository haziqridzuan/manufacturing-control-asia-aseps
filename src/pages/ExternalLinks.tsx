
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, ExternalLinkType } from "@/types";
import { FileArchive, FileText, Link2 } from "lucide-react";

// Mock data for external links - in a real app, this would come from the API
const externalLinks: ExternalLink[] = [
  {
    id: "link1",
    title: "Weekly Report - Project Alpha",
    url: "https://example.com/reports/alpha-week-12",
    type: "weekly-report",
    projectId: "p1",
    dateAdded: "2025-04-28"
  },
  {
    id: "link2",
    title: "Manufacturing Photos - Chassis Components",
    url: "https://example.com/manufacturing/photos/chassis",
    type: "manufacturing-control",
    projectId: "p2",
    poId: "po2",
    dateAdded: "2025-04-25"
  },
  {
    id: "link3",
    title: "Shipment Tracking - Engine Parts",
    url: "https://example.com/shipment/tracking/engine-parts",
    type: "shipment",
    projectId: "p1",
    poId: "po1",
    dateAdded: "2025-04-22"
  }
];

const ExternalLinks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<ExternalLinkType | "all">("all");
  
  // Filter links based on search term and type
  const filteredLinks = externalLinks.filter(link => {
    const matchesSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          link.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || link.type === filterType;
    
    return matchesSearch && matchesType;
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
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">External Links & Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
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
