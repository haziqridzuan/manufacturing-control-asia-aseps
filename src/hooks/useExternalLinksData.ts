
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getExternalLinks, getExternalLinkById, getExternalLinksByProjectId, createExternalLink, updateExternalLink, deleteExternalLink } from '@/services/externalLinkService';
import { ExternalLinkInsert } from '@/types/supabaseTypes';
import { toast } from 'sonner';

export function useExternalLinksData() {
  const queryClient = useQueryClient();

  const externalLinks = useQuery({
    queryKey: ['externalLinks'],
    queryFn: getExternalLinks,
  });

  const createExternalLinkMutation = useMutation({
    mutationFn: (newLink: ExternalLinkInsert) => createExternalLink(newLink),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['externalLinks'] });
      toast.success('External link created successfully');
    },
    onError: (error) => {
      toast.error(`Error creating external link: ${error.message}`);
    },
  });

  const updateExternalLinkMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ExternalLinkInsert> }) => 
      updateExternalLink(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['externalLinks'] });
      toast.success('External link updated successfully');
    },
    onError: (error) => {
      toast.error(`Error updating external link: ${error.message}`);
    },
  });

  const deleteExternalLinkMutation = useMutation({
    mutationFn: deleteExternalLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['externalLinks'] });
      toast.success('External link deleted successfully');
    },
    onError: (error) => {
      toast.error(`Error deleting external link: ${error.message}`);
    },
  });

  return {
    externalLinks,
    createExternalLink: createExternalLinkMutation.mutate,
    updateExternalLink: updateExternalLinkMutation.mutate,
    deleteExternalLink: deleteExternalLinkMutation.mutate,
    isLoading: externalLinks.isLoading || 
      createExternalLinkMutation.isPending || 
      updateExternalLinkMutation.isPending || 
      deleteExternalLinkMutation.isPending,
  };
}

export function useExternalLinkData(id: string | undefined) {
  return useQuery({
    queryKey: ['externalLink', id],
    queryFn: () => id ? getExternalLinkById(id) : null,
    enabled: !!id,
  });
}

export function useProjectExternalLinksData(projectId: string | undefined) {
  return useQuery({
    queryKey: ['projectExternalLinks', projectId],
    queryFn: () => projectId ? getExternalLinksByProjectId(projectId) : [],
    enabled: !!projectId,
  });
}
