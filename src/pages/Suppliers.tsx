
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useSuppliersData } from "@/hooks/useSuppliersData";
import { useProjectsData } from "@/hooks/useProjectsData";
import { Star } from "lucide-react";

const Suppliers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { suppliers, isLoading } = useSuppliersData();
  const { projects } = useProjectsData();
  
  if (isLoading || !suppliers.data) {
    return <div className="flex justify-center py-8">Loading suppliers...</div>;
  }
  
  // Apply search
  const filteredSuppliers = suppliers.data.filter((supplier) => {
    // Search term filter
    if (
      searchTerm &&
      !supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !supplier.country.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !supplier.contact_person.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Suppliers</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Supplier Directory</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6">
            <Input
              placeholder="Search suppliers by name, country, or contact person..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          {/* Suppliers Table */}
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="py-3 px-4 text-left">Supplier Name</th>
                  <th className="py-3 px-4 text-left">Country</th>
                  <th className="py-3 px-4 text-left">Contact Person</th>
                  <th className="py-3 px-4 text-left">Contact Info</th>
                  <th className="py-3 px-4 text-left">Rating</th>
                  <th className="py-3 px-4 text-left">On-Time Delivery</th>
                  <th className="py-3 px-4 text-left">Active Projects</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.length > 0 ? (
                  filteredSuppliers.map((supplier) => {
                    // Get projects for this supplier from the projects query
                    const supplierProjects = projects.data?.filter(p => p.supplier_id === supplier.id) || [];
                    const activeProjects = supplierProjects.filter(p => p.status !== "completed").length;
                    
                    return (
                      <tr key={supplier.id} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <Link to={`/supplier/${supplier.id}`} className="font-medium hover:underline">
                            {supplier.name}
                          </Link>
                        </td>
                        <td className="py-3 px-4">{supplier.country}</td>
                        <td className="py-3 px-4">{supplier.contact_person}</td>
                        <td className="py-3 px-4">
                          <div>{supplier.email}</div>
                          <div className="text-xs text-muted-foreground">{supplier.phone}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={cn(
                                  i < supplier.rating 
                                    ? "text-yellow-500 fill-yellow-500" 
                                    : "text-gray-300 fill-gray-300"
                                )}
                              />
                            ))}
                            <span className="ml-1 text-sm">{supplier.rating}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className={cn(
                            "inline-block px-2 py-1 text-xs font-medium rounded-full",
                            supplier.on_time_delivery_rate >= 90 
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                              : supplier.on_time_delivery_rate >= 75 
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          )}>
                            {supplier.on_time_delivery_rate}%
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium">{activeProjects}</div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      No suppliers found.
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

export default Suppliers;
