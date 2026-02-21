import type { NextApiRequest, NextApiResponse } from 'next';
import { clearCookie } from '../../../utils/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Clear the session cookie
    res.setHeader('Set-Cookie', clearCookie());
    return res.status(200).json({ success: true });
    
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ success: false, error: 'Logout failed' });
  }
}