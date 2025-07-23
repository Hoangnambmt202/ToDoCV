export interface Task {
  id: number;
  title: string;
  description: string;
  due_date: string;
  status: 'to-do' | 'doing' | 'completed';
}

export interface CreateTaskDto {
  title: string;
  status: 'to-do' |'doing' |'completed';
  user_id: number;
}

export interface UpdateTaskDto {
  title?: string;
  status?: 'to-do' |'doing' |'completed';
}