export interface Task {
  id: number;
  title: string;
  description: string;
  due_date: Date | null;
  important: boolean;
  categories: string[]; // Danh sách tên danh mục
  status: 'to-do' | 'doing' | 'completed';
}

export interface CreateTaskDto {
  title: string;
  status: 'to-do' |'doing' |'completed';
  description?: string;
  important?: boolean;
  due_date?: Date | null;

}

export interface UpdateTaskDto {
  title?: string;
  status?: 'to-do' |'doing' |'completed';
  description?: string;
  due_date?: Date | null;
  important?: boolean;
  user_id?: number;
  category_names?: string[]; // Danh sách tên danh mục
}