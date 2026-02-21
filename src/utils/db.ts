import { Task } from '../types/task';
import { User } from '../types/user';
import fs from 'fs';
import path from 'path';

// Define the database file path
const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Load data from file
const loadData = (): { users: User[]; tasks: Task[] } => {
  try {
    ensureDataDir();
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading database:', error);
  }
  
  // Return default data if file doesn't exist
  return {
    users: [
      {
        id: '1',
        name: 'Demo User',
        email: 'demo@example.com',
        // Password: "password123" - you'll need to hash this properly
        password: '$2a$10$YourHashedPasswordHere',
        createdAt: new Date().toISOString(),
      },
    ],
    tasks: [
      {
        id: '1',
        title: 'Welcome to Task Manager',
        description: 'This is your first task. Try adding more!',
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: '1',
        category: 'development',
        priority: 'medium',
        dueDate: new Date(Date.now() + 86400000).toISOString()
      },
      {
        id: '2',
        title: 'Complete Q1 Report',
        description: 'Prepare quarterly financial report',
        completed: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: '1',
        category: 'finance',
        priority: 'high',
        dueDate: new Date(Date.now() + 172800000).toISOString()
      },
    ],
  };
};

// Save data to file
const saveData = (data: { users: User[]; tasks: Task[] }) => {
  try {
    ensureDataDir();
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving database:', error);
  }
};

// Initialize database
let database = loadData();

// Export database methods
export const db = {
  // ============= USER METHODS =============
  getUsers: (): User[] => {
    return [...database.users];
  },

  getUserByEmail: (email: string): User | undefined => {
    return database.users.find(user => user.email === email);
  },

  getUserById: (id: string): User | undefined => {
    return database.users.find(user => user.id === id);
  },

  createUser: (userData: Omit<User, 'id' | 'createdAt'>): User => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    database.users.push(newUser);
    saveData(database); // Save to file immediately
    
    console.log('User created and saved:', { 
      id: newUser.id, 
      email: newUser.email,
      totalUsers: database.users.length 
    });
    
    return newUser;
  },

  // ============= TASK METHODS =============
  getTasks: (userId?: string): Task[] => {
    if (userId) {
      return database.tasks.filter(task => task.userId === userId);
    }
    return [...database.tasks];
  },

  getTaskById: (id: string, userId?: string): Task | undefined => {
    const task = database.tasks.find(task => task.id === id);
    if (task && userId && task.userId !== userId) return undefined;
    return task;
  },

  getTasksByCompletion: (completed: boolean, userId?: string): Task[] => {
    let filteredTasks = database.tasks.filter(task => task.completed === completed);
    if (userId) {
      filteredTasks = filteredTasks.filter(task => task.userId === userId);
    }
    return filteredTasks;
  },

  getTasksByCategory: (category: string, userId?: string): Task[] => {
    let filteredTasks = database.tasks.filter(task => task.category === category);
    if (userId) {
      filteredTasks = filteredTasks.filter(task => task.userId === userId);
    }
    return filteredTasks;
  },

  getTasksByPriority: (priority: string, userId?: string): Task[] => {
    let filteredTasks = database.tasks.filter(task => task.priority === priority);
    if (userId) {
      filteredTasks = filteredTasks.filter(task => task.userId === userId);
    }
    return filteredTasks;
  },

  createTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Task => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    database.tasks.push(newTask);
    saveData(database); // Save to file immediately
    
    return newTask;
  },

  updateTask: (id: string, updates: Partial<Task>, userId?: string): Task | null => {
    const index = database.tasks.findIndex(task => task.id === id);
    if (index === -1) return null;
    
    if (userId && database.tasks[index].userId !== userId) return null;

    database.tasks[index] = {
      ...database.tasks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    saveData(database); // Save to file immediately
    
    return database.tasks[index];
  },

  deleteTask: (id: string, userId?: string): boolean => {
    const index = database.tasks.findIndex(task => task.id === id);
    if (index === -1) return false;
    
    if (userId && database.tasks[index].userId !== userId) return false;
    
    database.tasks = database.tasks.filter(task => task.id !== id);
    saveData(database); // Save to file immediately
    
    return true;
  },
};