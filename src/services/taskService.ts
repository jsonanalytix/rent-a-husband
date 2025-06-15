import { supabase, EDGE_FUNCTIONS, getAuthHeaders } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Task = Database['public']['Tables']['tasks']['Row'];
type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
type TaskUpdate = Database['public']['Tables']['tasks']['Update'];
type Application = Database['public']['Tables']['applications']['Row'];
type ApplicationInsert = Database['public']['Tables']['applications']['Insert'];

export interface TaskWithDetails extends Task {
  poster?: {
    name: string;
    avatar_url: string | null;
  };
  applications?: Application[];
  application_count?: number;
}

export interface TaskSearchParams {
  search_term?: string;
  category?: string;
  status?: string;
  min_budget?: number;
  max_budget?: number;
  zip_code?: string;
  radius_miles?: number;
  limit?: number;
  offset?: number;
}

export interface TaskSearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  budget_type: string;
  status: string;
  location: any;
  preferred_date: string;
  created_at: string;
  poster_name: string;
  poster_rating: number;
  application_count: number;
  distance_miles: number;
}

class TaskService {
  // Create a new task
  async createTask(task: Omit<TaskInsert, 'poster_id'>): Promise<{ data: Task | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...task,
          poster_id: user.id,
          status: 'open'
        })
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating task:', error);
      return { data: null, error: error.message || 'Failed to create task' };
    }
  }

  // Get task by ID with details
  async getTaskById(taskId: string): Promise<{ data: TaskWithDetails | null; error: string | null }> {
    try {
      const { data: task, error } = await supabase
        .from('tasks')
        .select(`
          *,
          applications(*)
        `)
        .eq('id', taskId)
        .single();

      if (error) throw error;

      // Fetch poster profile separately
      const { data: posterProfile } = await supabase
        .from('profiles')
        .select('name, avatar_url')
        .eq('user_id', task.poster_id)
        .single();

      const taskWithDetails: TaskWithDetails = {
        ...task,
        poster: posterProfile || undefined,
        applications: task.applications
      };

      return { data: taskWithDetails, error: null };
    } catch (error: any) {
      console.error('Error fetching task:', error);
      return { data: null, error: error.message || 'Failed to fetch task' };
    }
  }

  // Search tasks using the edge function
  async searchTasks(params: TaskSearchParams): Promise<{ data: TaskSearchResult[] | null; error: string | null }> {
    try {
      const response = await fetch(`${EDGE_FUNCTIONS.tasks}/search`, {
        method: 'POST',
        headers: await getAuthHeaders(),
        body: JSON.stringify({
          p_search_term: params.search_term,
          p_category: params.category,
          p_status: params.status,
          p_min_budget: params.min_budget,
          p_max_budget: params.max_budget,
          p_zip_code: params.zip_code,
          p_radius_miles: params.radius_miles,
          p_limit: params.limit || 20,
          p_offset: params.offset || 0
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      console.error('Error searching tasks:', error);
      return { data: null, error: error.message || 'Failed to search tasks' };
    }
  }

  // Get tasks for the current user (as poster)
  async getMyPostedTasks(status?: string): Promise<{ data: TaskWithDetails[] | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      let query = supabase
        .from('tasks')
        .select('*')
        .eq('poster_id', user.id)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data: tasks, error } = await query;

      if (error) throw error;

      // Get application counts for each task
      const tasksWithCounts = await Promise.all(
        tasks.map(async (task) => {
          const { count } = await supabase
            .from('applications')
            .select('*', { count: 'exact', head: true })
            .eq('task_id', task.id);
          
          return {
            ...task,
            application_count: count || 0
          };
        })
      );

      return { data: tasksWithCounts, error: null };
    } catch (error: any) {
      console.error('Error fetching posted tasks:', error);
      return { data: null, error: error.message || 'Failed to fetch posted tasks' };
    }
  }

  // Get tasks the helper has applied to
  async getMyApplications(status?: string): Promise<{ data: Application[] | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      let query = supabase
        .from('applications')
        .select(`
          *,
          task:tasks(*)
        `)
        .eq('helper_id', user.id)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      return { data: null, error: error.message || 'Failed to fetch applications' };
    }
  }

  // Apply to a task
  async applyToTask(taskId: string, application: Omit<ApplicationInsert, 'task_id' | 'helper_id'>): Promise<{ data: Application | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      // Check if already applied
      const { data: existing } = await supabase
        .from('applications')
        .select('id')
        .eq('task_id', taskId)
        .eq('helper_id', user.id)
        .single();

      if (existing) {
        return { data: null, error: 'You have already applied to this task' };
      }

      const { data, error } = await supabase
        .from('applications')
        .insert({
          ...application,
          task_id: taskId,
          helper_id: user.id,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      console.error('Error applying to task:', error);
      return { data: null, error: error.message || 'Failed to apply to task' };
    }
  }

  // Accept an application
  async acceptApplication(applicationId: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Update application status
      const { data: application, error: updateError } = await supabase
        .from('applications')
        .update({ status: 'accepted' })
        .eq('id', applicationId)
        .select('*, task:tasks(*)')
        .single();

      if (updateError) throw updateError;

      // The database trigger will automatically update the task status and reject other applications

      return { success: true, error: null };
    } catch (error: any) {
      console.error('Error accepting application:', error);
      return { success: false, error: error.message || 'Failed to accept application' };
    }
  }

  // Update task status
  async updateTaskStatus(taskId: string, status: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', taskId);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error: any) {
      console.error('Error updating task status:', error);
      return { success: false, error: error.message || 'Failed to update task status' };
    }
  }

  // Mark task as completed
  async completeTask(taskId: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const response = await fetch(`${EDGE_FUNCTIONS.tasks}/${taskId}/complete`, {
        method: 'POST',
        headers: await getAuthHeaders()
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      return { success: true, error: null };
    } catch (error: any) {
      console.error('Error completing task:', error);
      return { success: false, error: error.message || 'Failed to complete task' };
    }
  }

  // Get task categories
  async getCategories(): Promise<{ data: any[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('task_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      return { data: null, error: error.message || 'Failed to fetch categories' };
    }
  }

  // Subscribe to task updates
  subscribeToTaskUpdates(taskId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`task-${taskId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `id=eq.${taskId}`
        },
        callback
      )
      .subscribe();
  }

  // Subscribe to applications for a task
  subscribeToApplications(taskId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`applications-${taskId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
          filter: `task_id=eq.${taskId}`
        },
        callback
      )
      .subscribe();
  }
}

export const taskService = new TaskService(); 