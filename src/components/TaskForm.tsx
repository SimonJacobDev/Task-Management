import React, { useState } from 'react';
import { TaskFormData } from '../types/task';

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<TaskFormData>;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel, initialData = {} }) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    category: 'development',
    priority: 'medium',
    dueDate: '',
    ...initialData
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TaskFormData, string>> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    
    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
      if (!initialData.title) {
        setFormData({
          title: '',
          description: '',
          category: 'development',
          priority: 'medium',
          dueDate: '',
        });
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof TaskFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const setCategory = (category: TaskFormData['category']) => {
    setFormData(prev => ({ ...prev, category }));
  };

  const setPriority = (priority: TaskFormData['priority']) => {
    setFormData(prev => ({ ...prev, priority }));
  };

  // Company-relevant categories as buttons
  const categories = [
    { value: 'development', label: '💻 Development', color: 'blue' },
    { value: 'design', label: '🎨 Design', color: 'purple' },
    { value: 'marketing', label: '📢 Marketing', color: 'pink' },
    { value: 'sales', label: '💰 Sales', color: 'green' },
    { value: 'hr', label: '👥 HR', color: 'yellow' },
    { value: 'finance', label: '📊 Finance', color: 'emerald' },
    { value: 'meeting', label: '📅 Meeting', color: 'indigo' },
    { value: 'planning', label: '📋 Planning', color: 'orange' },
    { value: 'review', label: '🔍 Review', color: 'red' },
    { value: 'other', label: '📌 Other', color: 'gray' },
  ];

  // Priority levels as buttons
  const priorities = [
    { value: 'low', label: '🟢 Low', color: 'green', bg: 'bg-green-500/20', text: 'text-green-400' },
    { value: 'medium', label: '🟡 Medium', color: 'yellow', bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
    { value: 'high', label: '🔴 High', color: 'red', bg: 'bg-red-500/20', text: 'text-red-400' },
    { value: 'urgent', label: '⚡ Urgent', color: 'purple', bg: 'bg-purple-500/20', text: 'text-purple-400' },
  ];

  // Quick date options
  const quickDates = [
    { label: 'Today', days: 0 },
    { label: 'Tomorrow', days: 1 },
    { label: 'This Week', days: 7 },
    { label: 'Next Week', days: 14 },
  ];

  const setQuickDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    const formattedDate = date.toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, dueDate: formattedDate }));
  };

  return (
    <div className="glass-panel mb-6 md:mb-8">
      <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center">
        <span className="text-[#ff6b00] mr-2">✦</span>
        {initialData.title ? 'Edit Task' : 'Create New Task'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Field */}
        <div>
          <label className="text-xs uppercase tracking-wider text-gray-500 font-bold block mb-2">
            Task Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full bg-black/30 border ${errors.title ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition text-sm`}
            placeholder="e.g., Complete Q4 financial report"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-500">{errors.title}</p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <label className="text-xs uppercase tracking-wider text-gray-500 font-bold block mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition text-sm resize-none"
            placeholder="Add details, requirements, or notes..."
          />
        </div>

        {/* Categories as Button Grid - NO DROPDOWN */}
        <div>
          <label className="text-xs uppercase tracking-wider text-gray-500 font-bold block mb-3">
            Department / Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {categories.map(cat => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value as any)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  formData.category === cat.value
                    ? `bg-${cat.color}-500/20 text-${cat.color}-400 border border-${cat.color}-500/30`
                    : 'bg-black/30 text-gray-400 border border-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Priority as Button Grid - WITH VISIBLE COLORS */}
        <div>
          <label className="text-xs uppercase tracking-wider text-gray-500 font-bold block mb-3">
            Priority Level
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {priorities.map(pri => (
              <button
                key={pri.value}
                type="button"
                onClick={() => setPriority(pri.value as any)}
                className={`px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                  formData.priority === pri.value
                    ? `${pri.bg} ${pri.text} border border-white/10 ring-2 ring-white/20`
                    : 'bg-black/30 text-gray-400 border border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>{pri.label}</span>
                  {formData.priority === pri.value && (
                    <span className="text-xs">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
          {/* Color indicator bar */}
          <div className="flex h-1 mt-3 rounded-full overflow-hidden">
            {priorities.map(pri => (
              <div 
                key={pri.value}
                className={`flex-1 h-full transition-all ${
                  formData.priority === pri.value 
                    ? `${pri.bg} opacity-100` 
                    : 'bg-white/5'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Due Date - Simplified with Quick Options */}
        <div>
          <label className="text-xs uppercase tracking-wider text-gray-500 font-bold block mb-3">
            Due Date
          </label>
          
          {/* Quick date buttons */}
          <div className="flex flex-wrap gap-2 mb-3">
            {quickDates.map(option => (
              <button
                key={option.label}
                type="button"
                onClick={() => setQuickDate(option.days)}
                className="px-3 py-1.5 bg-black/30 border border-white/10 rounded-lg text-xs text-gray-400 hover:text-white hover:border-white/20 transition-colors"
              >
                {option.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, dueDate: '' }))}
              className="px-3 py-1.5 bg-black/30 border border-white/10 rounded-lg text-xs text-gray-400 hover:text-white hover:border-white/20 transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Date input - more compact */}
          <div className="relative">
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full bg-black/30 border ${errors.dueDate ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition text-sm`}
              style={{
                colorScheme: 'dark'
              }}
            />
            {formData.dueDate && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                {new Date(formData.dueDate).toLocaleDateString('en-GB', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            )}
          </div>
          {errors.dueDate && (
            <p className="mt-1 text-xs text-red-500">{errors.dueDate}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
          <button type="submit" className="btn-primary group flex-1">
            <span>{initialData.title ? 'Update Task' : 'Create Task'}</span>
            <div className="bg-black/30 rounded-full p-2 group-hover:translate-x-1 transition-transform">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="px-6 py-3 bg-black/30 border border-white/5 rounded-lg text-sm text-gray-400 hover:text-white transition-colors">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TaskForm;