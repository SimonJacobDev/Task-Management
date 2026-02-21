import React from 'react';
import { Task } from '../types/task';

interface TaskSummaryProps {
  tasks: Task[];
}

const TaskSummary: React.FC<TaskSummaryProps> = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const highPriorityTasks = tasks.filter(t => t.priority === 'high' && !t.completed).length;
  const overdueTasks = tasks.filter(t => 
    !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
  ).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      <div className="glass-panel p-4 text-center">
        <div className="text-2xl font-bold text-white">{totalTasks}</div>
        <div className="text-xs text-gray-500">Total Tasks</div>
      </div>
      
      <div className="glass-panel p-4 text-center">
        <div className="text-2xl font-bold text-green-500">{completedTasks}</div>
        <div className="text-xs text-gray-500">Completed</div>
      </div>
      
      <div className="glass-panel p-4 text-center">
        <div className="text-2xl font-bold text-yellow-500">{pendingTasks}</div>
        <div className="text-xs text-gray-500">Pending</div>
      </div>
      
      <div className="glass-panel p-4 text-center">
        <div className="text-2xl font-bold text-red-500">{highPriorityTasks}</div>
        <div className="text-xs text-gray-500">High Priority</div>
      </div>
      
      {overdueTasks > 0 && (
        <div className="col-span-full glass-panel p-3 bg-red-500/10 border-red-500/20">
          <p className="text-red-500 text-sm text-center">
            ⚠️ You have {overdueTasks} overdue task{overdueTasks > 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskSummary;