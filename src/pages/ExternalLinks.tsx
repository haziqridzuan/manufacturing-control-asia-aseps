
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLinkType } from "@/types";
import { FileArchive, FileText, Link2, Plus } from "lucide-react";
import { useExternalLinksData } from "@/hooks/useExternalLinksData";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format, parseISO } from "date-fns";
import { useForm, Controller } from "react-hook-form";
import { ExternalLinkInsert } from "@/types/supabaseTypes";

const ExternalLinks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<ExternalLinkType | "all">("all");
  const { externalLinks, isLoading, createExternalLink } = useExternalLinksData();

  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<ExternalLinkInsert>({
    defaultValues: {
      title: '',
      url: '',
      type: 'weekly-report',
      description: ''
    }
  });

  const onSubmit = (data: ExternalLinkInsert) => {
    createExternalLink({
      ...data,
      date_added: new Date().toISOString()
    });
    reset();
    setDialogOpen(false);
  };
  
  const externalLinksData = externalLinks.data || [];
  
  // Filter links based on search term and type
  const filteredLinks = externalLinksData.filter(link => {
    const matchesSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (link.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesType = filterType === "all" || link.type === filterType;
    
    return matchesSearch && matchesType;
  });
  
  const getLinkIcon = (type: string) => {
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
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading external links...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">External Resources</h1>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add External Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Add New External Link</DialogTitle>
                <DialogDescription>
                  Add a link to an external resource or document related to your projects.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    {...register("title", { required: "Title is required" })}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title.message}</p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="url">URL</Label>
                  <Input 
                    id="url" 
                    {...register("url", { 
                      required: "URL is required",
                      pattern: {
                        value: /^https?:\/\/.+/i,
                        message: "Please enter a valid URL starting with http:// or https://"
                      }
                    })}
                  />
                  {errors.url && (
                    <p className="text-sm text-red-500">{errors.url.message}</p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="type">Type</Label>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly-report">Weekly Report</SelectItem>
                          <SelectItem value="manufacturing-control">Manufacturing Control</SelectItem>
                          <SelectItem value="shipment">Shipment</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea 
                    id="description" 
                    {...register("description")}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Link</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
                    <p className="text-xs text-muted-foreground">
                      Added: {format(parseISO(link.date_added), 'MMM d, yyyy')}
                    </p>
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
