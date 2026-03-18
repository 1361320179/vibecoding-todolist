import { useEffect, useState } from 'react';
import { Todo } from './types/todo';
import { loadTodos, saveTodos } from './utils/storage';
import { TodoInput } from './components/TodoInput';
import { TodoItem } from './components/TodoItem';
import { TodoStats } from './components/TodoStats';
import { EmptyState } from './components/EmptyState';
import { CheckCircle2, Trash2 } from 'lucide-react';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    setTodos(loadTodos());
  }, []);

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const addTodo = (content: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      content,
      completed: false,
      createdAt: Date.now(),
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
              <CheckCircle2 size={28} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">我的待办清单</h1>
          </div>
          <p className="text-gray-600 ml-14">
            {todos.length === 0
              ? '开始添加你的第一个待办事项'
              : `你有 ${todos.length} 个任务`}
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
                />
              ))
            )}
          </div>
        </div>

        {todos.length > 0 && completedCount > 0 && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() =>
                setTodos(todos.filter((todo) => !todo.completed))
              }
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 active:scale-95 transition-all shadow-md hover:shadow-lg"
            >
              <Trash2 size={16} />
              清空已完成任务
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
