import { useState } from 'react';
import { Plus } from 'lucide-react';

interface TodoInputProps {
  onAddTodo: (content: string) => void;
}

export function TodoInput({ onAddTodo }: TodoInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onAddTodo(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="今天要做什么？"
        className="flex-1 px-4 py-3 rounded-lg border-2 border-blue-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 active:scale-95 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
      >
        <Plus size={20} />
        <span className="hidden sm:inline">添加任务</span>
      </button>
    </form>
  );
}
