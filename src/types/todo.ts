export type TodoPriority = 'high' | 'medium' | 'low';

export interface Todo {
  id: string;
  content: string;
  completed: boolean;
  priority: TodoPriority;
  date: string;
  createdAt: number;
}
