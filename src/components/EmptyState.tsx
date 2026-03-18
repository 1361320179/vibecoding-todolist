import { CheckCircle2 } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 p-4 bg-blue-100 rounded-full">
        <CheckCircle2 size={32} className="text-blue-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">还没有任务</h3>
      <p className="text-gray-500">点击上方输入框，添加你的第一条待办事项吧。</p>
    </div>
  );
}
