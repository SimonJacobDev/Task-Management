import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { TaskFormData } from '../types/task';
import AuthGuard from '../components/AuthGuard';
import { useAuth } from '../context/AuthContext';

// Professional categories for corporate environment - NO EMOJIS
const categories = [
  { value: 'development', label: 'Development' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'finance', label: 'Finance' },
  { value: 'operations', label: 'Operations' },
  { value: 'legal', label: 'Legal' },
  { value: 'research', label: 'Research' },
  { value: 'other', label: 'Other' },
];

// Priority levels
const priorities = [
  { value: 'low', label: 'Low', color: 'bg-gray-500/20 text-gray-400' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500/20 text-yellow-400' },
  { value: 'high', label: 'High', color: 'bg-red-500/20 text-red-400' },
  { value: 'urgent', label: 'Urgent', color: 'bg-purple-500/20 text-purple-400' },
];

export default function CreateTaskPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'development',
    priority: 'medium',
    dueDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        router.push('/'); // Navigate to home page after successful creation
      } else {
        setError(data.error || 'Failed to create task');
      }
    } catch (err) {
      setError('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCancel = () => {
    router.push('/'); // Always navigate to home page
  };

  return (
    <AuthGuard>
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
        {/* Header - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-gradient-to-r from-[#111111] to-transparent p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/5 mb-4 sm:mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Create New Task</h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">Add a new task to your workspace</p>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 bg-black/20 px-3 py-1.5 rounded-lg sm:bg-transparent sm:px-0 sm:py-0">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="truncate max-w-[150px] sm:max-w-none">Creating as {user?.name}</span>
          </div>
        </div>

        {/* Error Message - Mobile Optimized */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-lg sm:rounded-xl">
            <p className="text-red-400 text-xs sm:text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Task Title - Mobile Optimized */}
          <div className="bg-gradient-to-r from-[#111111] to-transparent border border-white/5 rounded-lg sm:rounded-xl p-4 sm:p-6">
            <label className="block mb-1.5 sm:mb-2 text-xs sm:text-sm font-medium text-gray-400">
              Task Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Complete quarterly report"
              className={`w-full bg-black/30 border ${errors.title ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b00] transition`}
            />
            {errors.title && (
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-400">{errors.title}</p>
            )}
            <div className="mt-1.5 sm:mt-2 text-2xs sm:text-xs text-gray-600 text-right">
              {formData.title.length}/100
            </div>
          </div>

          {/* Description - Mobile Optimized with Better Touch Targets */}
          <div className="bg-gradient-to-r from-[#111111] to-transparent border border-white/5 rounded-lg sm:rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <label className="text-xs sm:text-sm font-medium text-gray-400">
                Description <span className="text-gray-500 text-2xs sm:text-xs ml-1 sm:ml-2">(optional)</span>
              </label>
              <button
                type="button"
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="text-gray-500 hover:text-gray-300 text-2xs sm:text-xs flex items-center gap-1 px-2 py-1.5 sm:px-2 sm:py-1 rounded-lg active:bg-white/5 touch-manipulation"
              >
                {isDescriptionExpanded ? 'Collapse' : 'Expand'}
                <svg 
                  className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${isDescriptionExpanded ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={isDescriptionExpanded ? 6 : 3}
              placeholder="Add details about this task..."
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b00] transition resize-none"
            />
          </div>

          {/* Category and Priority - Stack on Mobile, Grid on Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Category - Mobile Optimized */}
            <div className="bg-gradient-to-r from-[#111111] to-transparent border border-white/5 rounded-lg sm:rounded-xl p-4 sm:p-6">
              <label className="block mb-1.5 sm:mb-3 text-xs sm:text-sm font-medium text-gray-400">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:border-[#ff6b00] transition appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 0.75rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.25rem',
                }}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value} className="bg-gray-800 text-sm sm:text-base py-2">
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority - Mobile Optimized with Better Touch Targets */}
            <div className="bg-gradient-to-r from-[#111111] to-transparent border border-white/5 rounded-lg sm:rounded-xl p-4 sm:p-6">
              <label className="block mb-1.5 sm:mb-3 text-xs sm:text-sm font-medium text-gray-400">
                Priority
              </label>
              <div className="grid grid-cols-2 sm:flex sm:gap-2 gap-1.5">
                {priorities.map(pri => (
                  <button
                    key={pri.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, priority: pri.value }))}
                    className={`py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-all touch-manipulation ${
                      formData.priority === pri.value
                        ? pri.color + ' border border-white/10'
                        : 'bg-black/30 text-gray-500 border border-white/5 hover:text-gray-300 active:bg-black/50'
                    }`}
                  >
                    {pri.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Due Date - Mobile Optimized */}
          <div className="bg-gradient-to-r from-[#111111] to-transparent border border-white/5 rounded-lg sm:rounded-xl p-4 sm:p-6">
            <label className="block mb-1.5 sm:mb-3 text-xs sm:text-sm font-medium text-gray-400">
              Due Date <span className="text-gray-500 text-2xs sm:text-xs ml-1 sm:ml-2">(optional)</span>
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:border-[#ff6b00] transition"
              style={{ colorScheme: 'dark' }}
            />
            {formData.dueDate && (
              <p className="mt-1.5 sm:mt-2 text-2xs sm:text-xs text-gray-500">
                {new Date(formData.dueDate).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric'
                })}
              </p>
            )}
          </div>

          {/* Action Buttons - Stack on Mobile */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
            <button
              type="button"
              onClick={handleCancel} // Using handleCancel instead of router.back()
              className="w-full sm:w-auto px-4 sm:px-8 py-3 sm:py-3 bg-black/30 border border-white/10 rounded-lg text-sm sm:text-base text-gray-400 hover:text-white hover:border-white/20 transition active:bg-black/50 touch-manipulation"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:flex-1 bg-[#ff6b00] text-white py-3 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold text-sm sm:text-base hover:bg-[#e05e00] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#ff6b00]/20 touch-manipulation"
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </AuthGuard>
  );
}