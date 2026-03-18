import { useEffect, useState } from 'react';
import { CheckCircle2, Trash2 } from 'lucide-react';
import { Todo, TodoPriority } from './types/todo';
import { loadTodos, saveTodos } from './utils/storage';
import { TodoInput } from './components/TodoInput';
import { TodoItem } from './components/TodoItem';
import { TodoStats } from './components/TodoStats';
import { EmptyState } from './components/EmptyState';

function App() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const addTodo = (content: string, priority: TodoPriority) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      content,
      completed: false,
      priority,
      createdAt: Date.now(),
    };

    setTodos((prev) => [newTodo, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const editTodo = (id: string, content: string, priority: TodoPriority) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, content, priority } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  const clearAll = () => {
    const confirmed = window.confirm('确认要清空全部任务吗？该操作无法撤销。');
    if (!confirmed) {
      return;
    }

    setTodos([]);
  };

  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
              <CheckCircle2 size={28} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">我的待办清单</h1>
          </div>
          <p className="text-gray-600 ml-14">
            {todos.length === 0
              ? '开始添加你的第一个任务吧'
              : `你当前有 ${todos.length} 个任务`}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <TodoInput onAddTodo={addTodo} />

          <TodoStats completed={completedCount} total={todos.length} />

          <div className="space-y-2">
            {todos.length === 0 ? (
              <EmptyState />
            ) : (
              todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onEdit={editTodo}
                />
              ))
            )}
          </div>
        </div>

        {todos.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 active:scale-95 transition-all shadow-md hover:shadow-lg"
              >
                <Trash2 size={16} />
                清空已完成
              </button>
            )}

            <button
              onClick={clearAll}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white text-sm font-medium rounded-lg hover:bg-gray-800 active:scale-95 transition-all shadow-md hover:shadow-lg"
            >
              <Trash2 size={16} />
              全部清空
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
