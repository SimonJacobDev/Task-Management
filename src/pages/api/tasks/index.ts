import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../utils/db';
import { Task, ApiResponse } from '../../../types/task';
import { verifyToken } from '../../../utils/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Task | Task[]>>
) {
  try {
    // Get user ID from token
    const token = req.cookies.auth_token;
    const payload = token ? verifyToken(token) : null;
    const userId = payload?.userId;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        error: 'Not authenticated' 
      });
    }

    switch (req.method) {
      case 'GET':
        const { completed, category, priority } = req.query;
        let tasks;
        
        if (completed === 'true') {
          tasks = db.getTasksByCompletion(true, userId);
        } else if (completed === 'false') {
          tasks = db.getTasksByCompletion(false, userId);
        } else if (category && typeof category === 'string') {
          tasks = db.getTasksByCategory(category, userId);
        } else if (priority && typeof priority === 'string') {
          tasks = db.getTasksByPriority(priority, userId);
        } else {
          tasks = db.getTasks(userId);
        }
        
        return res.status(200).json({ success: true, data: tasks });

      case 'POST':
        const { title, description, category: taskCategory, priority: taskPriority, dueDate } = req.body;
        
        if (!title) {
          return res.status(400).json({ 
            success: false, 
            error: 'Title is required' 
          });
        }

        const newTask = db.createTask({
          title,
          description: description || '',
          completed: false,
          category: taskCategory || 'other',
          priority: taskPriority || 'medium',
          dueDate: dueDate || undefined,
        }, userId);

        return res.status(201).json({ success: true, data: newTask });

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ 
          success: false, 
          error: `Method ${req.method} Not Allowed` 
        });
    }
  } catch (error) {
    console.error('Tasks API error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}