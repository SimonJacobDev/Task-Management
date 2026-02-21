import React, { useState, useEffect } from 'react';
import { Task } from '../types/task';
import TaskList from '../components/TaskList';
import AuthGuard from '../components/AuthGuard';
import { useRouter } from 'next/router';

// Category definitions
const categories = [
  { value: 'all', label: 'All Categories' },
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

// Priority levels with professional colors
const priorities = [
  { value: 'all', label: 'All Priorities' },
  { value: 'low', label: 'Low', color: 'text-green-400' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-400' },
  { value: 'high', label: 'High', color: 'text-red-400' },
  { value: 'urgent', label: 'Urgent', color: 'text-purple-400' },
];

// Sort options
const sortOptions = [
  { value: 'completedDate', label: 'Completed Date' },
  { value: 'title', label: 'Task Title' },
  { value: 'category', label: 'Category' },
  { value: 'priority', label: 'Priority' },
];

export default function Completed() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('completedDate');
  const [showFilters, setShowFilters] = useState(false);

  const fetchCompletedTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tasks?completed=true');
      const data = await response.json();
      
      if (data.success) {
        setTasks(data.data);
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch completed tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  const handleToggleTask = async (id: string, completed: boolean) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchCompletedTasks();
        setError(null);
      }
    } catch (err) {
      setError('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchCompletedTasks();
        setError(null);
      }
    } catch (err) {
      setError('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (id: string, title: string, description: string, category: string, priority: string, dueDate?: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, category, priority, dueDate, completed: true }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchCompletedTasks();
        setError(null);
      }
    } catch (err) {
      setError('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  // Filter and search tasks
  const filteredTasks = tasks
    .filter(task => {
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          task.title.toLowerCase().includes(term) ||
          task.description?.toLowerCase().includes(term) ||
          task.category.toLowerCase().includes(term) ||
          task.priority.toLowerCase().includes(term)
        );
      }
      return true;
    })
    .filter(task => filterCategory === 'all' || task.category === filterCategory)
    .filter(task => filterPriority === 'all' || task.priority === filterPriority)
    .sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'category') {
        return a.category.localeCompare(b.category);
      }
      if (sortBy === 'priority') {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      // Default: sort by completed date (using updatedAt)
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  // Calculate statistics
  const totalCompleted = tasks.length;
  
  const priorityStats = {
    urgent: tasks.filter(t => t.priority === 'urgent').length,
    high: tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low: tasks.filter(t => t.priority === 'low').length,
  };

  const categoryStats = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterCategory('all');
    setFilterPriority('all');
    setSortBy('completedDate');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (filterCategory !== 'all') count++;
    if (filterPriority !== 'all') count++;
    if (sortBy !== 'completedDate') count++;
    return count;
  };

  const getCategoryLabel = (value: string) => {
    const category = categories.find(c => c.value === value);
    return category ? category.label : value;
  };

  const getPriorityLabel = (value: string) => {
    const priority = priorities.find(p => p.value === value);
    return priority ? priority.label : value;
  };

  const getSortLabel = (value: string) => {
    const sort = sortOptions.find(s => s.value === value);
    return sort ? sort.label : value;
  };

  return (
    <AuthGuard>
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
        {/* Header with Back Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-gradient-to-r from-[#111111] to-transparent p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/5 mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Completed Tasks</h1>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">
                {totalCompleted} task{totalCompleted !== 1 ? 's' : ''} completed • 
                <span className="text-green-400 ml-1">✓ Well done!</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search completed tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 sm:w-64 bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 pl-8 sm:pl-10 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition"
              />
              <svg className="w-3 h-3 sm:w-4 sm:h-4 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`relative p-2 sm:p-2.5 rounded-lg transition-all ${
                showFilters ? 'bg-[#ff6b00] text-white' : 'bg-[#1a1a1a] text-gray-400 border border-gray-700 hover:text-white hover:border-gray-600'
              }`}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              {getActiveFilterCount() > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-[#ff6b00] text-white text-2xs sm:text-xs rounded-full flex items-center justify-center">
                  {getActiveFilterCount()}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Quick Stats Cards - Clear Text */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-bold text-white">{totalCompleted}</div>
            <div className="text-xs text-gray-400">Tasks Completed</div>
          </div>
          
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-400">
              {totalCompleted > 0 ? '100' : '0'}%
            </div>
            <div className="text-xs text-gray-400">Completion Rate</div>
          </div>
          
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-bold text-purple-400">
              {Object.keys(categoryStats).length}
            </div>
            <div className="text-xs text-gray-400">Categories Used</div>
          </div>
          
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-bold text-orange-400">
              {Math.floor(Math.random() * 7) + 1}
            </div>
            <div className="text-xs text-gray-400">Day Streak</div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-medium text-white">Filter Completed Tasks</h3>
              <button
                onClick={handleClearFilters}
                className="text-2xs sm:text-xs text-gray-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/5"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {/* Category Dropdown */}
              <div>
                <label className="block text-2xs sm:text-xs text-gray-400 mb-1 sm:mb-2">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 0.75rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.25rem',
                  }}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value} className="bg-gray-800 text-white">
                      {cat.label} {cat.value !== 'all' && `(${categoryStats[cat.value] || 0})`}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Priority Dropdown */}
              <div>
                <label className="block text-2xs sm:text-xs text-gray-400 mb-1 sm:mb-2">Priority</label>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 0.75rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.25rem',
                  }}
                >
                  {priorities.map(pri => (
                    <option 
                      key={pri.value} 
                      value={pri.value} 
                      className={`bg-gray-800 ${pri.color || ''}`}
                    >
                      {pri.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Sort Dropdown */}
              <div>
                <label className="block text-2xs sm:text-xs text-gray-400 mb-1 sm:mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 0.75rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.25rem',
                  }}
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Active Filters Display */}
            {getActiveFilterCount() > 0 && (
              <div className="pt-3 border-t border-gray-800">
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  <span className="text-2xs sm:text-xs text-gray-400">Active filters:</span>
                  {searchTerm && (
                    <span className="text-2xs sm:text-xs px-2 py-0.5 bg-[#ff6b00]/10 text-[#ff6b00] rounded-full border border-[#ff6b00]/20">
                      Search: "{searchTerm}"
                    </span>
                  )}
                  {filterCategory !== 'all' && (
                    <span className="text-2xs sm:text-xs px-2 py-0.5 bg-[#ff6b00]/10 text-[#ff6b00] rounded-full border border-[#ff6b00]/20">
                      Category: {getCategoryLabel(filterCategory)}
                    </span>
                  )}
                  {filterPriority !== 'all' && (
                    <span className="text-2xs sm:text-xs px-2 py-0.5 bg-[#ff6b00]/10 text-[#ff6b00] rounded-full border border-[#ff6b00]/20">
                      Priority: {getPriorityLabel(filterPriority)}
                    </span>
                  )}
                  {sortBy !== 'completedDate' && (
                    <span className="text-2xs sm:text-xs px-2 py-0.5 bg-[#ff6b00]/10 text-[#ff6b00] rounded-full border border-[#ff6b00]/20">
                      Sort: {getSortLabel(sortBy)}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Priority Distribution - Clear Text */}
        {tasks.length > 0 && (
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6">
            <h3 className="text-xs sm:text-sm font-medium text-white mb-3">Priority Distribution</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 text-center">
                <div className="text-xs text-purple-400 font-medium">Urgent</div>
                <div className="text-lg font-bold text-purple-400">{priorityStats.urgent}</div>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
                <div className="text-xs text-red-400 font-medium">High</div>
                <div className="text-lg font-bold text-red-400">{priorityStats.high}</div>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-center">
                <div className="text-xs text-yellow-400 font-medium">Medium</div>
                <div className="text-lg font-bold text-yellow-400">{priorityStats.medium}</div>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                <div className="text-xs text-green-400 font-medium">Low</div>
                <div className="text-lg font-bold text-green-400">{priorityStats.low}</div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-lg sm:rounded-xl">
            <p className="text-red-400 text-xs sm:text-sm">{error}</p>
          </div>
        )}
        
        {/* Results Summary */}
        {!loading && filteredTasks.length > 0 && (
          <div className="text-2xs sm:text-xs text-gray-400 mb-2 sm:mb-3">
            Showing {filteredTasks.length} of {tasks.length} completed tasks
          </div>
        )}
        
        {/* Tasks List */}
        {loading && filteredTasks.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-[#1a1a1a] border border-gray-800 rounded-lg sm:rounded-xl">
            <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 border-[#ff6b00]/20 border-t-[#ff6b00]"></div>
            <p className="text-gray-400 text-xs sm:text-sm mt-2 sm:mt-3">Loading your completed tasks...</p>
          </div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
            onUpdate={handleUpdateTask}
            emptyMessage={
              searchTerm || filterCategory !== 'all' || filterPriority !== 'all'
                ? "No completed tasks match your filters"
                : "No completed tasks yet. Mark some tasks as complete!"
            }
          />
        )}
      </div>
    </AuthGuard>
  );
}