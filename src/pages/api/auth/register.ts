import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../utils/db';
import { hashPassword } from '../../../utils/auth';
import { AuthResponse } from '../../../types/user';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        error: 'Password must be at least 6 characters' 
      });
    }

    // Check if user already exists
    const existingUser = db.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'User already exists' 
      });
    }

    // Hash password and create user
    console.log('Creating user:', email);
    const hashedPassword = await hashPassword(password);
    
    const user = db.createUser({
      name,
      email,
      password: hashedPassword,
    });

    console.log('User created successfully:', { id: user.id, email: user.email });

    // Return success
    const { password: _, ...userWithoutPassword } = user;
    
    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Please login.',
      user: userWithoutPassword,
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error. Please try again.' 
    });
  }
}