
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import Logo from "./navbar/Logo";
import DesktopNav from "./navbar/DesktopNav";
import MobileNav from "./navbar/MobileNav";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return (
      <nav className="w-full py-6 px-6 bg-white sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Logo />
          <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="w-full py-6 px-6 bg-white sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Logo />
        <DesktopNav />
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
