import { Check, CheckCircle2, Circle, Pencil, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Todo, TodoPriority } from '../types/todo';
import { normalizeDate } from '../utils/date';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (
    id: string,
    content: string,
    priority: TodoPriority,
    date: string
  ) => void;
}

const priorityMeta: Record<
  TodoPriority,
  {
    label: string;
    badgeClass: string;
    borderClass: string;
  }
> = {
  high: {
    label: '高',
    badgeClass: 'bg-red-100 text-red-700 border-red-200',
    borderClass: 'border-l-red-500',
  },
  medium: {
    label: '中',
    badgeClass: 'bg-amber-100 text-amber-700 border-amber-200',
    borderClass: 'border-l-amber-500',
  },
  low: {
    label: '低',
    badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    borderClass: 'border-l-emerald-500',
  },
};

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(todo.content);
  const [editPriority, setEditPriority] = useState<TodoPriority>(todo.priority);
  const [editDate, setEditDate] = useState(todo.date);

  const meta = priorityMeta[todo.priority];

  const startEdit = () => {
    setEditContent(todo.content);
    setEditPriority(todo.priority);
    setEditDate(todo.date);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setEditContent(todo.content);
    setEditPriority(todo.priority);
    setEditDate(todo.date);
    setIsEditing(false);
  };

  const saveEdit = () => {
    const content = editContent.trim();
    if (!content) {
      return;
    }

    onEdit(todo.id, content, editPriority, normalizeDate(editDate));
    setIsEditing(false);
  };

  return (
    <div
      className={`group flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200 border-l-4 ${meta.borderClass} hover:border-blue-300 hover:shadow-md transition-all`}
    >
      <button
        onClick={() => onToggle(todo.id)}
        className="mt-1 flex-shrink-0 text-gray-400 hover:text-blue-500 transition-colors focus:outline-none"
        aria-label={todo.completed ? '标记为未完成' : '标记为完成'}
      >
        {todo.completed ? (
          <CheckCircle2 size={24} className="text-green-500" />
        ) : (
          <Circle size={24} />
        )}
      </button>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="space-y-2">
            <input
              type="text"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="编辑任务"
            />
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">优先级</span>
                <select
                  value={editPriority}
                  onChange={(e) =>
                    setEditPriority(e.target.value as TodoPriority)
                  }
                  className="px-2 py-1 rounded-md border border-gray-300 text-sm"
                >
                  <option value="high">高</option>
                  <option value="medium">中</option>
                  <option value="low">低</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">日期</span>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="px-2 py-1 rounded-md border border-gray-300 text-sm"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div
              className={`text-base break-words transition-all ${
                todo.completed ? 'line-through text-gray-400' : 'text-gray-700'
              }`}
            >
              {todo.content}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${meta.badgeClass}`}
              >
                {meta.label}优先级
              </span>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                {todo.date}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        {isEditing ? (
          <>
            <button
              onClick={saveEdit}
              disabled={!editContent.trim()}
              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="保存编辑"
            >
              <Check size={18} />
            </button>
            <button
              onClick={cancelEdit}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-all"
              aria-label="取消编辑"
            >
              <X size={18} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={startEdit}
              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md opacity-0 group-hover:opacity-100 transition-all focus:outline-none focus:opacity-100"
              aria-label="编辑任务"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all focus:outline-none focus:opacity-100"
              aria-label="删除任务"
            >
              <Trash2 size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
