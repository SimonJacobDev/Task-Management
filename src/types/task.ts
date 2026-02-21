export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  category: 'development' | 'design' | 'marketing' | 'sales' | 'hr' | 'finance' | 'meeting' | 'planning' | 'review' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
}

export interface TaskFormData {
  title: string;
  description?: string;
  category: 'development' | 'design' | 'marketing' | 'sales' | 'hr' | 'finance' | 'meeting' | 'planning' | 'review' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}