import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../utils/db';
import { verifyToken } from '../../../utils/auth';
import { AuthResponse } from '../../../types/user';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthResponse>
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    console.log('🔍 Auth check - All cookies:', req.cookies);
    
    const token = req.cookies.auth_token;

    if (!token) {
      console.log('❌ No auth token found');
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }

    console.log('✅ Token found, verifying...');
    const payload = verifyToken(token);
    
    if (!payload) {
      console.log('❌ Invalid token');
      // Clear invalid token
      res.setHeader('Set-Cookie', 'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; HttpOnly; SameSite=Lax');
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    console.log('✅ Token valid for user ID:', payload.userId);
    
    const user = db.getUserById(payload.userId);
    if (!user) {
      console.log('❌ User not found for ID:', payload.userId);
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    console.log('✅ User authenticated:', user.email);
    
    // Don't send password back
    const { password, ...userWithoutPassword } = user;
    
    return res.status(200).json({
      success: true,
      user: userWithoutPassword,
    });

  } catch (error) {
    console.error('❌ Auth check error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}