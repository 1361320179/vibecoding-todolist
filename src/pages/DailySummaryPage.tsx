import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye } from 'lucide-react';
import {
  Button,
  Card,
  Empty,
  List,
  Modal,
  Progress,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Todo } from '../types/todo';
import { getTodayDate } from '../utils/date';
import { loadTodos } from '../utils/storage';

interface SummaryRow {
  key: string;
  date: string;
  completed: number;
  pending: number;
  completionRate: number;
}

const buildSummaryRows = (todos: Todo[]): SummaryRow[] => {
  const bucket = new Map<string, { completed: number; pending: number }>();

  for (const todo of todos) {
    const current = bucket.get(todo.date) ?? { completed: 0, pending: 0 };
    if (todo.completed) {
      current.completed += 1;
    } else {
      current.pending += 1;
    }
    bucket.set(todo.date, current);
  }

  return Array.from(bucket.entries())
    .map(([date, value]) => {
      const total = value.completed + value.pending;
      const completionRate = total === 0 ? 0 : (value.completed / total) * 100;

      return {
        key: date,
        date,
        completed: value.completed,
        pending: value.pending,
        completionRate,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
};

const getPriorityLabel = (priority: Todo['priority']): string => {
  if (priority === 'high') {
    return '高';
  }
  if (priority === 'medium') {
    return '中';
  }
  return '低';
};

const getPriorityColor = (priority: Todo['priority']): string => {
  if (priority === 'high') {
    return 'red';
  }
  if (priority === 'medium') {
    return 'gold';
  }
  return 'green';
};

export function DailySummaryPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [activeDate, setActiveDate] = useState(getTodayDate());

  const todos = useMemo(() => loadTodos(), []);
  const rows = useMemo(() => buildSummaryRows(todos), [todos]);
  const today = getTodayDate();

  const openDateDetails = (date: string) => {
    setActiveDate(date);
    setOpen(true);
  };

  const dateTodos = useMemo(
    () => todos.filter((todo) => todo.date === activeDate),
    [todos, activeDate]
  );
  const completedTodos = dateTodos.filter((todo) => todo.completed);
  const pendingTodos = dateTodos.filter((todo) => !todo.completed);

  const columns: ColumnsType<SummaryRow> = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => a.date.localeCompare(b.date),
      defaultSortOrder: 'descend',
    },
    {
      title: '已完成',
      dataIndex: 'completed',
      key: 'completed',
      align: 'center',
      render: (value: number) => <Tag color="success">{value}</Tag>,
      sorter: (a, b) => a.completed - b.completed,
    },
    {
      title: '未完成',
      dataIndex: 'pending',
      key: 'pending',
      align: 'center',
      render: (value: number) => <Tag color="warning">{value}</Tag>,
      sorter: (a, b) => a.pending - b.pending,
    },
    {
      title: '完成率',
      dataIndex: 'completionRate',
      key: 'completionRate',
      render: (value: number) => (
        <Progress
          percent={Number(value.toFixed(0))}
          size="small"
          status="active"
          format={(percent) => `${percent}%`}
        />
      ),
      sorter: (a, b) => a.completionRate - b.completionRate,
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Button type="link" onClick={() => openDateDetails(record.date)}>
          查看详情
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Typography.Title level={3} style={{ margin: 0 }}>
            每日任务统计
          </Typography.Title>

          <div className="flex items-center gap-2">
            <Button
              type="default"
              icon={<Eye size={14} />}
              onClick={() => openDateDetails(today)}
            >
              查看今日详情
            </Button>
            <Button
              type="primary"
              icon={<ArrowLeft size={14} />}
              onClick={() => navigate('/')}
            >
              返回待办页
            </Button>
          </div>
        </div>

        <Card>
          <Table
            columns={columns}
            dataSource={rows}
            pagination={{ pageSize: 10, showSizeChanger: false }}
            locale={{
              emptyText: (
                <Empty
                  description="暂无记录，请先回到待办页添加任务"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
          />
        </Card>
      </div>

      <Modal
        title={`任务详情（${activeDate}）`}
        open={open}
        onCancel={() => setOpen(false)}
        footer={[
          <Button key="close" onClick={() => setOpen(false)}>
            关闭
          </Button>,
        ]}
        width={760}
      >
        {dateTodos.length === 0 ? (
          <Empty description="该日期暂无任务" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <Card size="small" title={`已完成（${completedTodos.length}）`} bordered>
              <List
                locale={{ emptyText: '暂无已完成任务' }}
                dataSource={completedTodos}
                renderItem={(item) => (
                  <List.Item>
                    <div className="w-full flex items-center justify-between gap-2">
                      <span className="text-slate-700 break-all">{item.content}</span>
                      <Tag color={getPriorityColor(item.priority)}>
                        {getPriorityLabel(item.priority)}
                      </Tag>
                    </div>
                  </List.Item>
                )}
              />
            </Card>

            <Card size="small" title={`未完成（${pendingTodos.length}）`} bordered>
              <List
                locale={{ emptyText: '暂无未完成任务' }}
                dataSource={pendingTodos}
                renderItem={(item) => (
                  <List.Item>
                    <div className="w-full flex items-center justify-between gap-2">
                      <span className="text-slate-700 break-all">{item.content}</span>
                      <Tag color={getPriorityColor(item.priority)}>
                        {getPriorityLabel(item.priority)}
                      </Tag>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
}
