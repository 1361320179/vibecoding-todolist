import { Trash2, CheckCircle2, Circle } from 'lucide-react';
import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="group flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
      <button
        onClick={() => onToggle(todo.id)}
        className="flex-shrink-0 text-gray-400 hover:text-blue-500 transition-colors focus:outline-none"
        aria-label={todo.completed ? '标记未完成' : '标记完成'}
      >
        {todo.completed ? (
          <CheckCircle2 size={24} className="text-green-500" />
        ) : (
          <Circle size={24} />
        )}
      </button>

      <span
        className={`flex-1 text-base transition-all ${
          todo.completed
            ? 'line-through text-gray-400'
            : 'text-gray-700'
        }`}
      >
        {todo.content}
      </span>

      <button
        onClick={() => onDelete(todo.id)}
        className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all focus:outline-none focus:opacity-100"
        aria-label="删除任务"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}
