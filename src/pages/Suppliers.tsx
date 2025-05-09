
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { suppliers, getProjectsBySupplierId } from "@/data/mockData";
import { cn } from "@/lib/utils";

const Suppliers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Apply search
  const filteredSuppliers = suppliers.filter((supplier) => {
    // Search term filter
    if (
      searchTerm &&
      !supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !supplier.country.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
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
                {filteredSuppliers.map((supplier) => {
                  const supplierProjects = getProjectsBySupplierId(supplier.id);
                  const activeProjects = supplierProjects.filter(p => p.status !== "completed").length;
                  
                  return (
                    <tr key={supplier.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <Link to={`/supplier/${supplier.id}`} className="font-medium hover:underline">
                          {supplier.name}
                        </Link>
                      </td>
                      <td className="py-3 px-4">{supplier.country}</td>
                      <td className="py-3 px-4">{supplier.contactPerson}</td>
                      <td className="py-3 px-4">
                        <div>{supplier.email}</div>
                        <div className="text-xs text-muted-foreground">{supplier.phone}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg
                              key={i}
                              className={cn(
                                "h-4 w-4",
                                i < Math.floor(supplier.rating) ? "text-yellow-400" : "text-gray-300"
                              )}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                              />
                            </svg>
                          ))}
                          <span className="ml-1 text-sm">{supplier.rating}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className={cn(
                          "text-sm font-medium",
                          supplier.onTimeDeliveryRate >= 90 ? "text-status-completed" :
                          supplier.onTimeDeliveryRate >= 75 ? "text-status-in-progress" :
                          "text-status-delayed"
                        )}>
                          {supplier.onTimeDeliveryRate}%
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/projects?supplier=${supplier.id}`}>
                            {activeProjects} Projects
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                
                {filteredSuppliers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-muted-foreground">
                      No suppliers found matching the current search.
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
