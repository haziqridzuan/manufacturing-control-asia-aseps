
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProjects, getProjectById, getProjectsBySupplierId, createProject, updateProject, deleteProject } from '@/services/projectService';
import { ProjectInsert } from '@/types/supabaseTypes';
import { toast } from 'sonner';

export function useProjectsData() {
  const queryClient = useQueryClient();

  const projects = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });

  const createProjectMutation = useMutation({
    mutationFn: (newProject: ProjectInsert) => createProject(newProject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project created successfully');
    },
    onError: (error) => {
      toast.error(`Error creating project: ${error.message}`);
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProjectInsert> }) => 
      updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project updated successfully');
    },
    onError: (error) => {
      toast.error(`Error updating project: ${error.message}`);
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted successfully');
    },
    onError: (error) => {
      toast.error(`Error deleting project: ${error.message}`);
    },
  });

  return {
    projects,
    createProject: createProjectMutation.mutate,
    updateProject: updateProjectMutation.mutate,
    deleteProject: deleteProjectMutation.mutate,
    isLoading: projects.isLoading || 
      createProjectMutation.isPending || 
      updateProjectMutation.isPending || 
      deleteProjectMutation.isPending,
  };
}

export function useProjectData(id: string | undefined) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => id ? getProjectById(id) : null,
    enabled: !!id,
  });
}

export function useSupplierProjectsData(supplierId: string | undefined) {
  return useQuery({
    queryKey: ['supplierProjects', supplierId],
    queryFn: () => supplierId ? getProjectsBySupplierId(supplierId) : [],
    enabled: !!supplierId,
  });
}
