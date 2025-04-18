
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import Logo from "./navbar/Logo";
import DesktopNav from "./navbar/DesktopNav";
import MobileNav from "./navbar/MobileNav";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Early return with simple navbar if not mounted yet
  if (!mounted) {
    return (
      <nav className="w-full py-4 px-4 md:px-8 bg-white sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Logo />
          <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
        </div>
      </nav>
    );
  }
  
  // Now it's safe to access auth context
  let user;
  try {
    const { user: authUser } = useAuth();
    user = authUser;
  } catch (error) {
    console.error("Error accessing auth context:", error);
    setAuthError(error instanceof Error ? error.message : "Auth context error");
    return (
      <nav className="w-full py-4 px-4 md:px-8 bg-white sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Logo />
          <div className="text-xs text-red-500">Auth error: Reloading in 5s</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="w-full py-4 px-4 md:px-8 bg-white sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Logo />
        <DesktopNav />
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
