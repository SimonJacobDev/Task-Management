import React, { useState } from 'react';
import { Task } from '../types/task';
import { FaCheck, FaTrash, FaEdit, FaCalendar, FaFlag } from 'react-icons/fa';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, title: string, description: string, category: string, priority: string, dueDate?: string) => void;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const getPriorityColor = (priority: string) => {
  switch(priority) {
    case 'urgent': return 'text-purple-400 bg-purple-500/10 border border-purple-500/20';
    case 'high': return 'text-red-400 bg-red-500/10 border border-red-500/20';
    case 'medium': return 'text-yellow-400 bg-yellow-500/10 border border-yellow-500/20';
    case 'low': return 'text-green-400 bg-green-500/10 border border-green-500/20';
    default: return 'text-gray-400 bg-gray-500/10 border border-gray-500/20';
  }
};

const getCategoryColor = (category: string) => {
  switch(category) {
    case 'development': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    case 'design': return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
    case 'marketing': return 'bg-pink-500/10 text-pink-400 border border-pink-500/20';
    case 'sales': return 'bg-green-500/10 text-green-400 border border-green-500/20';
    case 'hr': return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
    case 'finance': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    case 'operations': return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
    case 'legal': return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
    case 'research': return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20';
    case 'it': return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    case 'customer': return 'bg-teal-500/10 text-teal-400 border border-teal-500/20';
    case 'executive': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    case 'training': return 'bg-lime-500/10 text-lime-400 border border-lime-500/20';
    case 'quality': return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
    default: return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
  }
};

// Company-focused categories for dropdown
const companyCategories = [
  { value: 'development', label: 'Development' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'finance', label: 'Finance' },
  { value: 'operations', label: 'Operations' },
  { value: 'legal', label: 'Legal' },
  { value: 'research', label: 'R&D' },
  { value: 'it', label: 'IT Infrastructure' },
  { value: 'customer', label: 'Customer Support' },
  { value: 'executive', label: 'Executive' },
  { value: 'training', label: 'Training' },
  { value: 'quality', label: 'Quality Assurance' },
  { value: 'other', label: 'Other' },
];

// Priority options for dropdown
const priorityOptions = [
  { value: 'low', label: 'Low', color: 'text-green-400' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-400' },
  { value: 'high', label: 'High', color: 'text-red-400' },
  { value: 'urgent', label: 'Urgent', color: 'text-purple-400' },
];

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description || '');
  const [editedCategory, setEditedCategory] = useState(task.category);
  const [editedPriority, setEditedPriority] = useState(task.priority);
  const [editedDueDate, setEditedDueDate] = useState(task.dueDate || '');

  const handleUpdate = () => {
    if (editedTitle.trim()) {
      onUpdate(task.id, editedTitle, editedDescription, editedCategory, editedPriority, editedDueDate);
      setIsEditing(false);
    }
  };

  const isOverdue = () => {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date();
  };

  if (isEditing) {
    return (
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-5">
        <div className="space-y-4">
          {/* Title Input */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Task Title</label>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition"
              placeholder="Enter task title"
              autoFocus
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Description</label>
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition resize-none"
              placeholder="Task description"
              rows={3}
            />
          </div>
          
          {/* Category and Priority Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Dropdown - Company Focused */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Department</label>
              <select
                value={editedCategory}
                onChange={(e) => setEditedCategory(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 1rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.25rem',
                }}
              >
                {companyCategories.map(cat => (
                  <option key={cat.value} value={cat.value} className="bg-gray-800 text-white py-2">
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Priority Dropdown */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Priority</label>
              <select
                value={editedPriority}
                onChange={(e) => setEditedPriority(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 1rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.25rem',
                }}
              >
                {priorityOptions.map(pri => (
                  <option 
                    key={pri.value} 
                    value={pri.value} 
                    className={`bg-gray-800 ${pri.color}`}
                  >
                    {pri.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Due Date Input */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Due Date (Optional)</label>
            <input
              type="date"
              value={editedDueDate}
              onChange={(e) => setEditedDueDate(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition"
              style={{ colorScheme: 'dark' }}
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <button
              onClick={handleUpdate}
              className="px-6 py-2.5 bg-[#ff6b00] text-white rounded-lg text-sm font-medium hover:bg-[#e05e00] transition-colors w-full sm:w-auto"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-2.5 bg-[#1a1a1a] border border-gray-700 rounded-lg text-sm text-gray-400 hover:text-white hover:border-gray-600 transition-colors w-full sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-[#1a1a1a] border ${isOverdue() ? 'border-red-500/30' : 'border-gray-800'} rounded-xl p-5 hover:border-gray-700 transition-colors ${task.completed ? 'opacity-75' : ''}`}>
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id, !task.completed)}
          className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
            task.completed
              ? 'bg-[#ff6b00] border-[#ff6b00] text-white'
              : 'border-gray-600 hover:border-[#ff6b00]'
          }`}
        >
          {task.completed && <FaCheck className="text-[10px]" />}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`text-base sm:text-lg font-medium break-words ${
              task.completed ? 'line-through text-gray-500' : 'text-white'
            }`}
          >
            {task.title}
          </h3>
          
          {task.description && (
            <p className={`text-sm mt-1.5 break-words leading-relaxed ${task.completed ? 'text-gray-600' : 'text-gray-400'}`}>
              {task.description}
            </p>
          )}
          
          {/* Tags Section - Company Focused */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {/* Category Tag - Company Style */}
            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${getCategoryColor(task.category)}`}>
              <span className="capitalize">{companyCategories.find(c => c.value === task.category)?.label || task.category}</span>
            </span>
            
            {/* Priority Tag */}
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${getPriorityColor(task.priority)}`}>
              <FaFlag className="text-[10px]" />
              <span className="capitalize">{task.priority}</span>
            </span>
            
            {/* Due Date Tag */}
            {task.dueDate && (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                isOverdue() && !task.completed
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                  : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
              }`}>
                <FaCalendar className="text-[10px]" />
                <span>{formatDate(task.dueDate)}</span>
                {isOverdue() && !task.completed && <span className="ml-1">(Overdue)</span>}
              </span>
            )}
          </div>
          
          {/* Created Date */}
          <div className="mt-3 text-[10px] text-gray-600">
            Created: {formatDate(task.createdAt)}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-500 hover:text-[#ff6b00] hover:bg-white/5 rounded-lg transition-colors"
            title="Edit task"
          >
            <FaEdit className="text-sm" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-gray-500 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
            title="Delete task"
          >
            <FaTrash className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;