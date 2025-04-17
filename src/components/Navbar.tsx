
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, LogOut, User, BookMarked, Settings } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Wait until hydration completes before trying to access auth context
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Early return with simple navbar if not mounted yet
  if (!mounted) {
    return (
      <nav className="w-full py-4 px-4 md:px-8 bg-white sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-legend-blue" />
            <span className="font-display text-2xl text-gray-800">Little Legends</span>
          </Link>
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
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-legend-blue" />
            <span className="font-display text-2xl text-gray-800">Little Legends</span>
          </Link>
          <div className="text-xs text-red-500">Auth error: Reloading in 5s</div>
        </div>
      </nav>
    );
  }

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const isAdmin = user?.email === 'nasheet.islam@gmail.com';

  // Rest of the component can now safely use auth
  return (
    <nav className="w-full py-4 px-4 md:px-8 bg-white sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-legend-blue" />
          <span className="font-display text-xl text-gray-800">Little Legends</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-600 hover:text-legend-blue transition-colors">
            Home
          </Link>
          <Link to="/how-it-works" className="text-gray-600 hover:text-legend-blue transition-colors">
            How It Works
          </Link>
          
          <Link to="/create">
            <Button className="bg-legend-blue hover:bg-blue-400 text-white rounded-full px-6">
              Create Story
            </Button>
          </Link>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarFallback className="bg-legend-blue text-white">
                    {getInitials(user.email || 'User')}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{user.email}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center gap-2" 
                  asChild
                >
                  <Link to="/my-stories">
                    <BookMarked className="h-4 w-4" />
                    <span>My Saved Stories</span>
                  </Link>
                </DropdownMenuItem>
                
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="flex items-center gap-2" 
                      asChild
                    >
                      <Link to="/admin/prompt-lab">
                        <Settings className="h-4 w-4" />
                        <span>Admin</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center gap-2 text-red-600" 
                  onClick={() => {
                    const auth = useAuth();
                    auth.signOut();
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="outline" className="rounded-full px-6 border border-gray-300 text-gray-600 hover:border-legend-blue hover:text-legend-blue">
                Login
              </Button>
            </Link>
          )}
        </div>
        
        <div className="md:hidden flex items-center gap-2">
          <Link to="/create">
            <Button className="bg-legend-blue hover:bg-blue-500 text-white rounded-full">
              Create
            </Button>
          </Link>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarFallback className="bg-legend-blue text-white">
                    {getInitials(user.email || 'User')}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem 
                  asChild
                  className="flex items-center gap-2"
                >
                  <Link to="/my-stories">
                    <BookMarked className="h-4 w-4" />
                    <span>My Saved Stories</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center gap-2 text-red-600" 
                  onClick={() => {
                    const auth = useAuth();
                    auth.signOut();
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth" className="md:hidden">
              <Button variant="outline" className="rounded-full">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
