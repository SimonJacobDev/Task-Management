import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { FaPlusCircle, FaTasks, FaCheckCircle, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const isActive = (path: string) => router.pathname === path;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="fixed top-4 left-4 h-[calc(100vh-2rem)] w-20 flex flex-col bg-[#111111] border border-white/5 rounded-3xl shadow-2xl backdrop-blur-sm py-6">
      {/* Logo */}
      <Link href="/" className="flex justify-center mb-8 group">
        <div className="relative w-10 h-10">
          <Image 
            src="/sidebar-logo.png" 
            alt="Indium Icon" 
            fill
            className="object-contain group-hover:scale-110 transition-transform"
            sizes="40px"
          />
        </div>
      </Link>

      {/* Create Task Button */}
      <Link 
        href="/create-task" 
        className={`relative flex items-center justify-center h-12 w-12 mx-auto rounded-2xl transition-all duration-300 group ${
          isActive('/create-task') 
            ? 'bg-[#ff6b00] text-white' 
            : 'bg-[#111111] text-[#ff6b00] hover:bg-[#ff6b00] hover:text-white border border-white/5'
        }`}
      >
        <FaPlusCircle className="text-xl" />
        <span className="absolute w-auto p-2 min-w-max left-14 rounded-md shadow-md text-white bg-black/90 text-xs font-bold transition-all duration-100 scale-0 origin-left group-hover:scale-100 border border-white/10 whitespace-nowrap">
          Create New Task
        </span>
      </Link>

      <div className="w-8 h-px bg-white/10 mx-auto my-4"></div>

      {/* All Tasks Button */}
      <Link 
        href="/" 
        className={`relative flex items-center justify-center h-12 w-12 mx-auto rounded-2xl transition-all duration-300 group mb-2 ${
          isActive('/') && !isActive('/completed')
            ? 'bg-[#ff6b00] text-white' 
            : 'bg-[#111111] text-[#ff6b00] hover:bg-[#ff6b00] hover:text-white border border-white/5'
        }`}
      >
        <FaTasks className="text-xl" />
        <span className="absolute w-auto p-2 min-w-max left-14 rounded-md shadow-md text-white bg-black/90 text-xs font-bold transition-all duration-100 scale-0 origin-left group-hover:scale-100 border border-white/10 whitespace-nowrap">
          All Tasks
        </span>
      </Link>

      {/* Completed Tasks Button */}
      <Link 
        href="/completed" 
        className={`relative flex items-center justify-center h-12 w-12 mx-auto rounded-2xl transition-all duration-300 group ${
          isActive('/completed') 
            ? 'bg-[#ff6b00] text-white' 
            : 'bg-[#111111] text-[#ff6b00] hover:bg-[#ff6b00] hover:text-white border border-white/5'
        }`}
      >
        <FaCheckCircle className="text-xl" />
        <span className="absolute w-auto p-2 min-w-max left-14 rounded-md shadow-md text-white bg-black/90 text-xs font-bold transition-all duration-100 scale-0 origin-left group-hover:scale-100 border border-white/10 whitespace-nowrap">
          Completed Tasks
        </span>
      </Link>

      <div className="flex-1"></div>

      {/* User Section */}
      <div className="flex flex-col items-center space-y-2">
        {user && (
          <div className="relative flex items-center justify-center h-12 w-12 mx-auto bg-[#111111] text-[#ff6b00] rounded-2xl border border-white/5 group">
            <div className="w-6 h-6 bg-[#ff6b00] rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="absolute w-auto p-2 min-w-max left-14 rounded-md shadow-md text-white bg-black/90 text-xs font-bold transition-all duration-100 scale-0 origin-left group-hover:scale-100 border border-white/10 whitespace-nowrap">
              {user.name}
            </span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="relative flex items-center justify-center h-12 w-12 mx-auto bg-[#111111] text-[#ff6b00] hover:bg-[#ff6b00] hover:text-white rounded-2xl transition-all duration-300 border border-white/5 group"
        >
          <FaSignOutAlt className="text-xl" />
          <span className="absolute w-auto p-2 min-w-max left-14 rounded-md shadow-md text-white bg-black/90 text-xs font-bold transition-all duration-100 scale-0 origin-left group-hover:scale-100 border border-white/10 whitespace-nowrap">
            Logout
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;