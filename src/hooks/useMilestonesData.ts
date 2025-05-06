
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMilestonesByProjectId, createMilestone, updateMilestone, deleteMilestone } from '@/services/milestoneService';
import { MilestoneInsert } from '@/types/supabaseTypes';
import { toast } from 'sonner';

export function useMilestonesData(projectId: string | undefined) {
  const queryClient = useQueryClient();

  const milestones = useQuery({
    queryKey: ['milestones', projectId],
    queryFn: () => projectId ? getMilestonesByProjectId(projectId) : [],
    enabled: !!projectId,
  });

  const createMilestoneMutation = useMutation({
    mutationFn: (newMilestone: MilestoneInsert) => createMilestone(newMilestone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones', projectId] });
      toast.success('Milestone created successfully');
    },
    onError: (error) => {
      toast.error(`Error creating milestone: ${error.message}`);
    },
  });

  const updateMilestoneMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MilestoneInsert> }) => 
      updateMilestone(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones', projectId] });
      toast.success('Milestone updated successfully');
    },
    onError: (error) => {
      toast.error(`Error updating milestone: ${error.message}`);
    },
  });

  const deleteMilestoneMutation = useMutation({
    mutationFn: deleteMilestone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones', projectId] });
      toast.success('Milestone deleted successfully');
    },
    onError: (error) => {
      toast.error(`Error deleting milestone: ${error.message}`);
    },
  });

  return {
    milestones,
    createMilestone: createMilestoneMutation.mutate,
    updateMilestone: updateMilestoneMutation.mutate,
    deleteMilestone: deleteMilestoneMutation.mutate,
    isLoading: milestones.isLoading || 
      createMilestoneMutation.isPending || 
      updateMilestoneMutation.isPending || 
      deleteMilestoneMutation.isPending,
  };
}
