import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as services from '@/services';

// Projects
export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: services.fetchProjects
  });
}

export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => id ? services.fetchProjectById(id) : null,
    enabled: !!id
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: services.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, project }: { id: string, project: any }) => 
      services.updateProject(id, project),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['projects', data.id] });
      }
    }
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: services.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });
}

// Suppliers
export function useSuppliers() {
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: services.fetchSuppliers
  });
}

export function useSupplier(id: string | undefined) {
  return useQuery({
    queryKey: ['suppliers', id],
    queryFn: () => id ? services.fetchSupplierById(id) : null,
    enabled: !!id
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: services.createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    }
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, supplier }: { id: string, supplier: any }) => 
      services.updateSupplier(id, supplier),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['suppliers', data.id] });
      }
    }
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: services.deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    }
  });
}

// Purchase Orders
export function usePurchaseOrders() {
  return useQuery({
    queryKey: ['purchaseOrders'],
    queryFn: services.fetchPurchaseOrders
  });
}

export function usePurchaseOrder(id: string | undefined) {
  return useQuery({
    queryKey: ['purchaseOrders', id],
    queryFn: () => id ? services.fetchPurchaseOrderById(id) : null,
    enabled: !!id
  });
}

export function useProjectPurchaseOrders(projectId: string | undefined) {
  return useQuery({
    queryKey: ['projects', projectId, 'purchaseOrders'],
    queryFn: () => projectId ? services.fetchPurchaseOrdersByProject(projectId) : [],
    enabled: !!projectId
  });
}

export function useSupplierPurchaseOrders(supplierId: string | undefined) {
  return useQuery({
    queryKey: ['suppliers', supplierId, 'purchaseOrders'],
    queryFn: () => supplierId ? services.fetchPurchaseOrdersBySupplier(supplierId) : [],
    enabled: !!supplierId
  });
}

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: services.createPurchaseOrder,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['projects', data.projectId, 'purchaseOrders'] });
        queryClient.invalidateQueries({ queryKey: ['suppliers', data.supplierId, 'purchaseOrders'] });
      }
    }
  });
}

export function useUpdatePurchaseOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, po }: { id: string, po: any }) => 
      services.updatePurchaseOrder(id, po),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['purchaseOrders', data.id] });
        queryClient.invalidateQueries({ queryKey: ['projects', data.projectId, 'purchaseOrders'] });
        queryClient.invalidateQueries({ queryKey: ['suppliers', data.supplierId, 'purchaseOrders'] });
      }
    }
  });
}

export function useDeletePurchaseOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: services.deletePurchaseOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
    }
  });
}

// Clients
export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: services.fetchClients
  });
}

export function useClient(id: string | undefined) {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => id ? services.fetchClientById(id) : null,
    enabled: !!id
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: services.createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    }
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, client }: { id: string, client: any }) => 
      services.updateClient(id, client),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['clients', data.id] });
      }
    }
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: services.deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    }
  });
}

// Other hooks for milestones, external links, etc. follow the same pattern
