import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../utils/db';
import { comparePassword, generateToken, setCookie } from '../../../utils/auth';
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
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
    }

    console.log('Login attempt for:', email);

    // Find user
    const user = db.getUserByEmail(email);
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid email or password' 
      });
    }

    console.log('User found, comparing passwords...');

    // Check password
    const isValid = await comparePassword(password, user.password);
    console.log('Password valid:', isValid);

    if (!isValid) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid email or password' 
      });
    }

    // Generate token
    const token = generateToken(user.id);
    console.log('Token generated for user:', user.id);

    // Set cookie - this creates the persistent session
    res.setHeader('Set-Cookie', setCookie(token));

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    return res.status(200).json({
      success: true,
      user: userWithoutPassword,
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error. Please try again.' 
    });
  }
}