export interface Task {
  id: number;
  title: string;
  description: string;
  due_date: Date | null;
  status: 'to-do' | 'doing' | 'completed';
}

export interface CreateTaskDto {
  title: string;
  status: 'to-do' |'doing' |'completed';
  description?: string;
  due_date?: Date | null;

}

export interface UpdateTaskDto {
  title?: string;
  status?: 'to-do' |'doing' |'completed';
  description?: string;
  due_date?: Date | null;
  user_id?: number;
}