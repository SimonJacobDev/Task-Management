import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading, login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form states
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      await login(loginData.email, loginData.password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const result = await register(registerData.name, registerData.email, registerData.password);
      setSuccessMessage(result.message || 'Account created successfully! Please login.');
      setIsLogin(true);
      setRegisterData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      setLoginData({
        email: registerData.email,
        password: '',
      });
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccessMessage('');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-[#ff6b00]/20 border-t-[#ff6b00] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm sm:text-base">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center relative overflow-hidden px-4 py-8">
      
      {/* Background Glows */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-[#ff6b00]/10 to-transparent pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-5%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#ff6b00]/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Logo with Image - ENLARGED IN SAME POSITION */}
      <header className="absolute top-4 sm:top-8 left-4 sm:left-8 md:left-16">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Image Logo - Made Larger (increased from w-24/sm:w-32 to w-32/sm:w-40) */}
          <div className="relative w-32 sm:w-40 h-10 sm:h-12">
            <Image 
              src="/logo-white.png" 
              alt="Indium Logo" 
              fill
              priority
              className="object-contain"
              sizes="(max-width: 640px) 128px, 160px"
            />
          </div>
          <div className="h-5 sm:h-7 w-px bg-white/10"></div>
          <span className="text-[8px] sm:text-[10px] font-bold tracking-[0.2em] sm:tracking-[0.3em] text-gray-600 uppercase whitespace-nowrap">
            TASK MANAGER
          </span>
        </div>
      </header>

      {/* Form Card */}
      <main className="z-10 w-full max-w-sm sm:max-w-md px-4">
        <div className="text-center mb-6 sm:mb-10">
          {/* Optional: Add a smaller logo here if needed */}
          <div className="flex justify-center mb-4 sm:mb-6">

          </div>
          
          <p className="text-[#ff6b00] text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-2 sm:mb-3">
            {isLogin ? "WELCOME BACK" : "CREATE ACCOUNT"}
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight">
            {isLogin ? (
              <>Manage your tasks <br className="hidden sm:block" /> <span className="text-[#ff6b00]">efficiently</span></>
            ) : (
              <>Start organizing <br className="hidden sm:block" /> <span className="text-[#ff6b00]">your workflow</span></>
            )}
          </h1>
        </div>

        <div className="bg-[#111111] border border-white/5 p-6 sm:p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-500 text-xs sm:text-sm text-center">{error}</p>
            </div>
          )}
          
          {successMessage && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-500 text-xs sm:text-sm text-center">{successMessage}</p>
            </div>
          )}

          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b00] transition text-sm"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b00] transition text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#ff6b00] text-white py-3 px-4 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-[#e05e00] transition disabled:opacity-50 flex items-center justify-center space-x-3"
              >
                <span>{loading ? 'Processing...' : 'Secure Login'}</span>
                {!loading && (
                  <div className="bg-black/30 rounded-full p-2 group-hover:translate-x-1 transition-transform">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                )}
              </button>

              <p className="text-center text-gray-500 text-xs sm:text-sm pt-2">
                New here?{' '}
                <button type="button" onClick={toggleForm} className="text-[#ff6b00] font-bold hover:underline">
                  Create Account
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3 sm:space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={registerData.name}
                  onChange={handleRegisterChange}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b00] transition text-sm"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b00] transition text-sm"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b00] transition text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b00] transition text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#ff6b00] text-white py-3 px-4 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-[#e05e00] transition disabled:opacity-50 flex items-center justify-center space-x-3"
              >
                <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                {!loading && (
                  <div className="bg-black/30 rounded-full p-2 group-hover:translate-x-1 transition-transform">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                )}
              </button>

              <p className="text-center text-gray-500 text-xs sm:text-sm pt-2">
                Already have an account?{' '}
                <button type="button" onClick={toggleForm} className="text-[#ff6b00] font-bold hover:underline">
                  Login
                </button>
              </p>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-4 sm:bottom-8 w-full text-center px-4">
        <div className="flex justify-center space-x-4 sm:space-x-6 text-[8px] sm:text-[10px] uppercase tracking-widest text-gray-700 font-bold">
          <span className="hover:text-[#ff6b00] cursor-pointer transition-colors">Privacy</span>
          <span className="hover:text-[#ff6b00] cursor-pointer transition-colors">Terms</span>
          <span className="hover:text-[#ff6b00] cursor-pointer transition-colors">Help</span>
        </div>
      </footer>
    </div>
  );
}