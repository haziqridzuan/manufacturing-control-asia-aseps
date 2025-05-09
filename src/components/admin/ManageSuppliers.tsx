
import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSuppliersData } from "@/hooks/useSuppliersData";
import { SupplierInsert } from "@/types/supabaseTypes";
import { Edit, Trash2, Plus, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const ManageSuppliers = () => {
  const { suppliers, createSupplier, updateSupplier, deleteSupplier, isLoading } = useSuppliersData();

  const [openForm, setOpenForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any | null>(null);
  const [formData, setFormData] = useState<SupplierInsert>({
    name: "",
    contact_person: "",
    email: "",
    phone: "",
    country: "",
    location: "",
    rating: 0,
    on_time_delivery_rate: 0,
  });

  // Populate form with selected supplier data
  useEffect(() => {
    if (selectedSupplier) {
      setFormData({
        name: selectedSupplier.name,
        contact_person: selectedSupplier.contact_person,
        email: selectedSupplier.email,
        phone: selectedSupplier.phone,
        country: selectedSupplier.country,
        location: selectedSupplier.location || "",
        rating: selectedSupplier.rating,
        on_time_delivery_rate: selectedSupplier.on_time_delivery_rate,
      });
    }
  }, [selectedSupplier]);

  const handleOpenForm = (supplier = null) => {
    if (supplier) {
      setSelectedSupplier(supplier);
    } else {
      setSelectedSupplier(null);
      setFormData({
        name: "",
        contact_person: "",
        email: "",
        phone: "",
        country: "",
        location: "",
        rating: 0,
        on_time_delivery_rate: 0,
      });
    }
    setOpenForm(true);
  };

  const handleSubmit = () => {
    if (selectedSupplier) {
      updateSupplier({
        id: selectedSupplier.id,
        data: formData,
      });
    } else {
      createSupplier(formData);
    }
    setOpenForm(false);
  };

  const handleDelete = () => {
    if (selectedSupplier) {
      deleteSupplier(selectedSupplier.id);
      setDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading suppliers...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Manage Suppliers</h2>
        <Button onClick={() => handleOpenForm()} className="flex items-center">
          <Plus size={16} className="mr-1" /> Add Supplier
        </Button>
      </div>

      {/* Suppliers Table */}
      <div className="rounded-md border dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>On-Time Delivery</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers?.data && suppliers.data.length > 0 ? (
              suppliers.data.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>
                    <div>{supplier.contact_person}</div>
                    <div className="text-xs text-muted-foreground">{supplier.email}</div>
                  </TableCell>
                  <TableCell>{supplier.country}</TableCell>
                  <TableCell>
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
                    </div>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleOpenForm(supplier)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setSelectedSupplier(supplier);
                          setDeleteDialogOpen(true);
                        }}
                        className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No suppliers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Supplier Form Dialog */}
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedSupplier ? "Edit Supplier" : "Create New Supplier"}</DialogTitle>
            <DialogDescription>
              {selectedSupplier ? "Update the supplier details below" : "Fill in the supplier details to create a new supplier"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Supplier Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Contact Person</label>
                <Input
                  value={formData.contact_person}
                  onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Country</label>
                <Input
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Location (City/Address)</label>
              <Input
                value={formData.location || ""}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Rating (1-5)</label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">On-Time Delivery (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.on_time_delivery_rate}
                  onChange={(e) => setFormData({ ...formData, on_time_delivery_rate: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {selectedSupplier ? "Update Supplier" : "Create Supplier"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Supplier</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the supplier "{selectedSupplier?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageSuppliers;
