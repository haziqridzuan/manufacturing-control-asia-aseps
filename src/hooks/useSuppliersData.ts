
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier } from '@/services/supplierService';
import { SupplierInsert } from '@/types/supabaseTypes';
import { toast } from 'sonner';

export function useSuppliersData() {
  const queryClient = useQueryClient();

  const suppliers = useQuery({
    queryKey: ['suppliers'],
    queryFn: getSuppliers,
  });

  const createSupplierMutation = useMutation({
    mutationFn: (newSupplier: SupplierInsert) => createSupplier(newSupplier),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('Supplier created successfully');
    },
    onError: (error) => {
      toast.error(`Error creating supplier: ${error.message}`);
    },
  });

  const updateSupplierMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SupplierInsert> }) => 
      updateSupplier(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('Supplier updated successfully');
    },
    onError: (error) => {
      toast.error(`Error updating supplier: ${error.message}`);
    },
  });

  const deleteSupplierMutation = useMutation({
    mutationFn: deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('Supplier deleted successfully');
    },
    onError: (error) => {
      toast.error(`Error deleting supplier: ${error.message}`);
    },
  });

  return {
    suppliers,
    createSupplier: createSupplierMutation.mutate,
    updateSupplier: updateSupplierMutation.mutate,
    deleteSupplier: deleteSupplierMutation.mutate,
    isLoading: suppliers.isLoading || 
      createSupplierMutation.isPending || 
      updateSupplierMutation.isPending || 
      deleteSupplierMutation.isPending,
  };
}

export function useSupplierData(id: string | undefined) {
  return useQuery({
    queryKey: ['supplier', id],
    queryFn: () => id ? getSupplierById(id) : null,
    enabled: !!id,
  });
}
