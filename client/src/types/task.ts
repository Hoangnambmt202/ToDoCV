export interface Task {
  id: number;
  title: string;
  description: string;
  due_date: string;
  status: 'To Do' | 'In Progress' | 'Completed';
}

export interface CreateTaskDto {
  title: string;
  status: 'pending' | 'completed';
  user_id: number;
}

export interface UpdateTaskDto {
  title?: string;
  status?: 'pending' | 'completed';
}