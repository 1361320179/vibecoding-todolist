import { Todo, TodoPriority } from '../types/todo';

const STORAGE_KEY = 'todolist.localhost.todos';
const LEGACY_STORAGE_KEYS = ['todos'];

const isPriority = (value: unknown): value is TodoPriority => {
  return value === 'high' || value === 'medium' || value === 'low';
};

const canUseLocalStorage = (): boolean => {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
};

const readRawTodos = (): string | null => {
  if (!canUseLocalStorage()) {
    return null;
  }

  const current = localStorage.getItem(STORAGE_KEY);
  if (current) {
    return current;
  }

  for (const legacyKey of LEGACY_STORAGE_KEYS) {
    const legacy = localStorage.getItem(legacyKey);
    if (legacy) {
      localStorage.setItem(STORAGE_KEY, legacy);
      localStorage.removeItem(legacyKey);
      return legacy;
    }
  }

  return null;
};

export const loadTodos = (): Todo[] => {
  try {
    const data = readRawTodos();
    if (!data) {
      return [];
    }

    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((item) => item && typeof item === 'object')
      .map((item) => {
        const content = typeof item.content === 'string' ? item.content : '';

        return {
          id: typeof item.id === 'string' ? item.id : Date.now().toString(),
          content,
          completed: Boolean(item.completed),
          priority: isPriority(item.priority) ? item.priority : 'medium',
          createdAt:
            typeof item.createdAt === 'number' ? item.createdAt : Date.now(),
        } satisfies Todo;
      })
      .filter((todo) => todo.content.trim().length > 0);
  } catch {
    return [];
  }
};

export const saveTodos = (todos: Todo[]): void => {
  if (!canUseLocalStorage()) {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
};
