import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../utils/db';
import { Task, ApiResponse } from '../../../types/task';
import { verifyToken } from '../../../utils/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Task>>
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

    const { id } = req.query;
    
    if (typeof id !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid task ID' 
      });
    }

    switch (req.method) {
      case 'GET':
        const task = db.getTaskById(id, userId);
        
        if (!task) {
          return res.status(404).json({ 
            success: false, 
            error: 'Task not found' 
          });
        }
        
        return res.status(200).json({ success: true, data: task });

      case 'PUT':
        const updates = req.body;
        const updatedTask = db.updateTask(id, updates, userId);
        
        if (!updatedTask) {
          return res.status(404).json({ 
            success: false, 
            error: 'Task not found or you do not have permission' 
          });
        }
        
        return res.status(200).json({ success: true, data: updatedTask });

      case 'DELETE':
        const deleted = db.deleteTask(id, userId);
        
        if (!deleted) {
          return res.status(404).json({ 
            success: false, 
            error: 'Task not found or you do not have permission' 
          });
        }
        
        return res.status(200).json({ success: true, data: { id } as Task });

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ 
          success: false, 
          error: `Method ${req.method} Not Allowed` 
        });
    }
  } catch (error) {
    console.error('Task API error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}