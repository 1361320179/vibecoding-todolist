import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ListChecks, Trash2 } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { TodoInput } from '../components/TodoInput';
import { TodoItem } from '../components/TodoItem';
import { TodoStats } from '../components/TodoStats';
import { Todo, TodoPriority } from '../types/todo';
import { getTodayDate, normalizeDate } from '../utils/date';
import { loadTodos, saveTodos } from '../utils/storage';

export function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const navigate = useNavigate();

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const visibleTodos = useMemo(
    () => todos.filter((todo) => todo.date === selectedDate),
    [todos, selectedDate]
  );

  const addTodo = (content: string, priority: TodoPriority) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      content,
      completed: false,
      priority,
      date: selectedDate,
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

  const editTodo = (
    id: string,
    content: string,
    priority: TodoPriority,
    date: string
  ) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, content, priority, date } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos((prev) =>
      prev.filter((todo) => todo.date !== selectedDate || !todo.completed)
    );
  };

  const clearAll = () => {
    const confirmed = window.confirm(
      `确认要清空 ${selectedDate} 的全部任务吗？该操作无法撤销。`
    );
    if (!confirmed) {
      return;
    }

    setTodos((prev) => prev.filter((todo) => todo.date !== selectedDate));
  };

  const completedCount = visibleTodos.filter((todo) => todo.completed).length;

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
            当前日期：{selectedDate}，共 {visibleTodos.length} 个任务
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <TodoInput
            selectedDate={selectedDate}
            onSelectedDateChange={(date) => setSelectedDate(normalizeDate(date))}
            onAddTodo={addTodo}
          />

          <TodoStats completed={completedCount} total={visibleTodos.length} />

          <div className="space-y-2">
            {visibleTodos.length === 0 ? (
              <EmptyState />
            ) : (
              visibleTodos.map((todo) => (
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

        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => navigate('/history')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-md hover:shadow-lg"
          >
            <ListChecks size={16} />
            查看任务清单
          </button>

          {visibleTodos.length > 0 && completedCount > 0 && (
            <button
              onClick={clearCompleted}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 active:scale-95 transition-all shadow-md hover:shadow-lg"
            >
              <Trash2 size={16} />
              清空当日已完成
            </button>
          )}

          {visibleTodos.length > 0 && (
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white text-sm font-medium rounded-lg hover:bg-gray-800 active:scale-95 transition-all shadow-md hover:shadow-lg"
            >
              <Trash2 size={16} />
              清空当日全部
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
