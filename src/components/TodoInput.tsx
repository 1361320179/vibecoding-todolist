import { useState } from 'react';
import { Plus } from 'lucide-react';
import { TodoPriority } from '../types/todo';

interface TodoInputProps {
  selectedDate: string;
  onSelectedDateChange: (date: string) => void;
  onAddTodo: (content: string, priority: TodoPriority) => void;
}

export function TodoInput({
  selectedDate,
  onSelectedDateChange,
  onAddTodo,
}: TodoInputProps) {
  const [input, setInput] = useState('');
  const [priority, setPriority] = useState<TodoPriority>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const content = input.trim();
    if (!content) {
      return;
    }

    onAddTodo(content, priority);
    setInput('');
    setPriority('medium');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="今天要做什么？"
          className="flex-1 px-4 py-3 rounded-lg border-2 border-blue-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
        />
        <button
          type="submit"
          className="px-5 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 active:scale-95 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">添加任务</span>
        </button>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <label htmlFor="todo-priority" className="text-sm text-gray-600">
            优先级
          </label>
          <select
            id="todo-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TodoPriority)}
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
          >
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="todo-date" className="text-sm text-gray-600">
            日期
          </label>
          <input
            id="todo-date"
            type="date"
            value={selectedDate}
            onChange={(e) => onSelectedDateChange(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
          />
        </div>
      </div>
    </form>
  );
}
