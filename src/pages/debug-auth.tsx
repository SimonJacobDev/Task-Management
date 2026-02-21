import React, { useEffect, useState } from 'react';

export default function DebugAuth() {
  const [cookies, setCookies] = useState<string>('');
  const [authStatus, setAuthStatus] = useState<any>(null);

  useEffect(() => {
    // Check document cookies
    setCookies(document.cookie);
    
    // Check auth endpoint
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setAuthStatus(data))
      .catch(err => setAuthStatus({ error: err.message }));
  }, []);

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">🔍 Auth Debug Page</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Document Cookies:</h2>
          <pre className="text-sm text-gray-300">{cookies || 'No cookies found'}</pre>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Auth Status:</h2>
          <pre className="text-sm text-gray-300">
            {JSON.stringify(authStatus, null, 2)}
          </pre>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 rounded"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
}