import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { TaskFormData } from '../types/task';
import TaskForm from '../components/TaskForm';
import AuthGuard from '../components/AuthGuard';

export default function AddTaskPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddTask = async (formData: TaskFormData) => {
    try {
      setLoading(true);
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        router.push('/');
      } else {
        setError(data.error || 'Failed to add task');
      }
    } catch (err) {
      setError('Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">
          Create New <span className="text-[#ff6b00]">Task</span>
        </h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}
        
        <TaskForm 
          onSubmit={handleAddTask} 
          onCancel={() => router.push('/')}
        />
      </div>
    </AuthGuard>
  );
}