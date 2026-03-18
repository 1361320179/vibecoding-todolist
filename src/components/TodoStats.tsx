import { CheckCircle2, Circle } from 'lucide-react';

interface TodoStatsProps {
  completed: number;
  total: number;
}

export function TodoStats({ completed, total }: TodoStatsProps) {
  const pending = total - completed;

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center gap-2 mb-1">
          <Circle size={18} className="text-blue-500" />
          <span className="text-sm font-medium text-gray-600">未完成</span>
        </div>
        <div className="text-3xl font-bold text-blue-600">{pending}</div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle2 size={18} className="text-green-500" />
          <span className="text-sm font-medium text-gray-600">已完成</span>
        </div>
        <div className="text-3xl font-bold text-green-600">{completed}</div>
      </div>
    </div>
  );
}
