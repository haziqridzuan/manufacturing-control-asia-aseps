
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPurchaseOrders, getPurchaseOrderById, getPurchaseOrdersByProjectId, createPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder } from '@/services/purchaseOrderService';
import { PurchaseOrderInsert } from '@/types/supabaseTypes';
import { toast } from 'sonner';

export function usePurchaseOrdersData() {
  const queryClient = useQueryClient();

  const purchaseOrders = useQuery({
    queryKey: ['purchaseOrders'],
    queryFn: getPurchaseOrders,
  });

  const createPurchaseOrderMutation = useMutation({
    mutationFn: (newPO: PurchaseOrderInsert) => createPurchaseOrder(newPO),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      // Also invalidate related queries that might be affected
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Purchase order created successfully');
    },
    onError: (error) => {
      toast.error(`Error creating purchase order: ${error.message}`);
    },
  });

  const updatePurchaseOrderMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PurchaseOrderInsert> }) => 
      updatePurchaseOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      // Also invalidate related queries that might be affected
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Purchase order updated successfully');
    },
    onError: (error) => {
      toast.error(`Error updating purchase order: ${error.message}`);
    },
  });

  const deletePurchaseOrderMutation = useMutation({
    mutationFn: deletePurchaseOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      // Also invalidate related queries that might be affected
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Purchase order deleted successfully');
    },
    onError: (error) => {
      toast.error(`Error deleting purchase order: ${error.message}`);
    },
  });

  return {
    purchaseOrders,
    createPurchaseOrder: createPurchaseOrderMutation.mutate,
    updatePurchaseOrder: updatePurchaseOrderMutation.mutate,
    deletePurchaseOrder: deletePurchaseOrderMutation.mutate,
    isLoading: purchaseOrders.isLoading || 
      createPurchaseOrderMutation.isPending || 
      updatePurchaseOrderMutation.isPending || 
      deletePurchaseOrderMutation.isPending,
    refetch: purchaseOrders.refetch,
  };
}

export function usePurchaseOrderData(id: string | undefined) {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['purchaseOrder', id],
    queryFn: () => id ? getPurchaseOrderById(id) : null,
    enabled: !!id,
  });

  // Update the cache separately
  const data = query.data;
  if (data && id) {
    queryClient.setQueryData(['purchaseOrders'], (oldData: any) => {
      if (!oldData) return oldData;
      
      const purchaseOrders = oldData.filter((po: any) => po.id !== id);
      return [...purchaseOrders, data];
    });
  }
  
  return query;
}

export function useProjectPurchaseOrdersData(projectId: string | undefined) {
  return useQuery({
    queryKey: ['projectPurchaseOrders', projectId],
    queryFn: () => projectId ? getPurchaseOrdersByProjectId(projectId) : [],
    enabled: !!projectId,
  });
}
