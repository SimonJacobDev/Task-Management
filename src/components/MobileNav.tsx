import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { FaTasks, FaCheckCircle, FaPlusCircle, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const MobileNav: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const isActive = (path: string) => router.pathname === path;

  const handleLogout = async () => {
    await logout();
  };

  const navItems = [
    { path: '/', icon: FaTasks, label: 'Tasks' },
    { path: '/completed', icon: FaCheckCircle, label: 'Completed' },
    { path: '/add-task', icon: FaPlusCircle, label: 'Add' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#111111] border-t border-white/10 z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex flex-col items-center justify-center px-3 py-1 rounded-lg transition-colors ${
              isActive(item.path) ? 'text-[#ff6b00]' : 'text-gray-500 hover:text-white'
            }`}
          >
            <item.icon className="text-xl" />
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </Link>
        ))}
        
        {/* User menu for mobile with icon logo */}
        <div className="relative group">
          <button className="flex flex-col items-center justify-center px-3 py-1 text-gray-500 hover:text-white">
            <div className="relative w-6 h-6">
              <Image 
                src="/sidebar-logo.png" 
                alt="Logo" 
                fill
                className="object-contain"
                sizes="24px"
              />
            </div>
            <span className="text-[10px] mt-1 font-medium">Menu</span>
          </button>
          
          {/* Dropdown menu */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-32 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl hidden group-hover:block">
            <div className="px-3 py-2 text-xs text-gray-400 border-b border-white/10 flex items-center gap-2">
              <div className="relative w-4 h-4">
                <Image 
                  src="/sidebar-logo.png" 
                  alt="Logo" 
                  fill
                  className="object-contain"
                  sizes="16px"
                />
              </div>
              {user?.name || 'User'}
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-3 py-2 text-xs text-red-400 hover:bg-white/5 flex items-center space-x-2"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MobileNav;