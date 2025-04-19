
import { useState, useEffect } from "react";
import Logo from "./navbar/Logo";
import DesktopNav from "./navbar/DesktopNav";
import MobileNav from "./navbar/MobileNav";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navClasses = scrolled 
    ? "bg-white/95 backdrop-blur-md shadow-sm"
    : "bg-white";
  
  if (!mounted) {
    return (
      <nav className={`w-full py-4 px-6 sticky top-0 z-50 border-b border-gray-100 ${navClasses} transition-all duration-300`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Logo />
          <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`w-full py-4 px-6 sticky top-0 z-50 border-b border-gray-100 ${navClasses} transition-all duration-300`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Logo />
        <DesktopNav />
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
