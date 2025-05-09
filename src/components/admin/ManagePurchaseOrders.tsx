
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
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
import { usePurchaseOrdersData } from "@/hooks/usePurchaseOrdersData";
import { useProjectsData } from "@/hooks/useProjectsData";
import { useSuppliersData } from "@/hooks/useSuppliersData";
import StatusBadge from "@/components/ui/StatusBadge";
import { PurchaseOrderInsert } from "@/types/supabaseTypes";
import { Edit, Trash2, Plus } from "lucide-react";
import { formatDate } from "@/utils/formatters";

const ManagePurchaseOrders = () => {
  const { purchaseOrders, createPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder, isLoading } = usePurchaseOrdersData();
  const { projects } = useProjectsData();
  const { suppliers } = useSuppliersData();

  const [openForm, setOpenForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<any | null>(null);
  const [formData, setFormData] = useState<PurchaseOrderInsert>({
    po_number: "",
    part_name: "",
    project_id: "",
    supplier_id: "",
    client_id: "",
    client_name: "",
    quantity: 1,
    status: "pending",
    date_created: new Date().toISOString().split('T')[0],
    placed_by: "",
    progress: 0,
    notes: "",
    contractual_deadline: null,
    shipment_date: null,
  });

  // Populate form with selected PO data
  useEffect(() => {
    if (selectedPO) {
      setFormData({
        po_number: selectedPO.po_number,
        part_name: selectedPO.part_name,
        project_id: selectedPO.project_id,
        supplier_id: selectedPO.supplier_id,
        client_id: selectedPO.client_id,
        client_name: selectedPO.client_name,
        quantity: selectedPO.quantity,
        status: selectedPO.status,
        date_created: selectedPO.date_created,
        placed_by: selectedPO.placed_by,
        progress: selectedPO.progress || 0,
        notes: selectedPO.notes || "",
        contractual_deadline: selectedPO.contractual_deadline || null,
        shipment_date: selectedPO.shipment_date || null,
      });
    }
  }, [selectedPO]);

  const handleOpenForm = (po = null) => {
    if (po) {
      setSelectedPO(po);
    } else {
      setSelectedPO(null);
      setFormData({
        po_number: `PO-${Math.floor(100000 + Math.random() * 900000)}`,
        part_name: "",
        project_id: "",
        supplier_id: "",
        client_id: "default-client-id", // placeholder
        client_name: "Actemium",
        quantity: 1,
        status: "pending",
        date_created: new Date().toISOString().split('T')[0],
        placed_by: "",
        progress: 0,
        notes: "",
        contractual_deadline: null,
        shipment_date: null,
      });
    }
    setOpenForm(true);
  };

  const handleSubmit = () => {
    if (selectedPO) {
      updatePurchaseOrder({
        id: selectedPO.id,
        data: formData,
      });
    } else {
      createPurchaseOrder(formData);
    }
    setOpenForm(false);
  };

  const handleDelete = () => {
    if (selectedPO) {
      deletePurchaseOrder(selectedPO.id);
      setDeleteDialogOpen(false);
    }
  };

  // Update supplier when project changes
  const handleProjectChange = (projectId: string) => {
    const project = projects?.data?.find(p => p.id === projectId);
    if (project) {
      setFormData({
        ...formData,
        project_id: projectId,
        supplier_id: project.supplier_id
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading purchase orders...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Manage Purchase Orders</h2>
        <Button onClick={() => handleOpenForm()} className="flex items-center">
          <Plus size={16} className="mr-1" /> Add PO
        </Button>
      </div>

      {/* POs Table */}
      <div className="rounded-md border dark:border-gray-700 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PO Number</TableHead>
              <TableHead>Part Name</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Date Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchaseOrders?.data && purchaseOrders.data.length > 0 ? (
              purchaseOrders.data.map((po) => {
                const project = projects?.data?.find(p => p.id === po.project_id);
                
                return (
                  <TableRow key={po.id}>
                    <TableCell className="font-medium">{po.po_number}</TableCell>
                    <TableCell>{po.part_name}</TableCell>
                    <TableCell>{project?.name || "Unknown"}</TableCell>
                    <TableCell><StatusBadge status={po.status} /></TableCell>
                    <TableCell>{po.quantity}</TableCell>
                    <TableCell>{formatDate(po.date_created)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleOpenForm(po)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setSelectedPO(po);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No purchase orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit PO Form Dialog */}
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPO ? "Edit Purchase Order" : "Create New Purchase Order"}</DialogTitle>
            <DialogDescription>
              {selectedPO ? "Update the purchase order details below" : "Fill in the details to create a new purchase order"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">PO Number</label>
                <Input
                  value={formData.po_number}
                  onChange={(e) => setFormData({ ...formData, po_number: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Part Name</label>
                <Input
                  value={formData.part_name}
                  onChange={(e) => setFormData({ ...formData, part_name: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project</label>
                <Select 
                  value={formData.project_id} 
                  onValueChange={handleProjectChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects?.data?.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Supplier</label>
                <Select 
                  value={formData.supplier_id} 
                  onValueChange={(value) => setFormData({ ...formData, supplier_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers?.data?.map(supplier => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Client Name</label>
                <Input
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity</label>
                <Input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Progress (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress || 0}
                  onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Created</label>
                <Input
                  type="date"
                  value={formData.date_created}
                  onChange={(e) => setFormData({ ...formData, date_created: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Contractual Deadline</label>
                <Input
                  type="date"
                  value={formData.contractual_deadline || ""}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    contractual_deadline: e.target.value || null 
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Shipment Date</label>
                <Input
                  type="date"
                  value={formData.shipment_date || ""}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    shipment_date: e.target.value || null 
                  })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Placed By</label>
              <Input
                value={formData.placed_by}
                onChange={(e) => setFormData({ ...formData, placed_by: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                value={formData.notes || ""}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {selectedPO ? "Update PO" : "Create PO"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Purchase Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the purchase order "{selectedPO?.po_number}"? This action cannot be undone.
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

export default ManagePurchaseOrders;
