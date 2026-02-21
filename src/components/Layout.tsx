import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <main className={`${isMobile ? 'pb-20' : 'md:ml-24'} min-h-screen`}>
        <div className="container-custom py-4 sm:py-6 md:py-8">
          {children}
        </div>
      </main>
      
      {/* Mobile Bottom Navigation */}
      <MobileNav />
      
      {/* Background Glows - Responsive */}
      <div className="fixed bottom-0 left-0 w-full h-1/4 md:h-1/3 bg-gradient-to-t from-[#ff6b00]/10 to-transparent pointer-events-none"></div>
      <div className="fixed top-[-10%] right-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#ff6b00]/5 rounded-full blur-[120px] pointer-events-none"></div>
    </div>
  );
};

export default Layout;