
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, LogOut, User } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { user, signOut } = useAuth();

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <nav className="w-full py-4 px-4 md:px-8 border-b">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-legend-blue" />
          <span className="font-display text-2xl text-foreground">Little Legends</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="font-semibold hover:text-legend-blue transition-colors">
            Home
          </Link>
          <Link to="/how-it-works" className="font-semibold hover:text-legend-blue transition-colors">
            How It Works
          </Link>
          
          <Link to="/create">
            <Button className="bg-legend-blue hover:bg-blue-500 text-white rounded-full px-6">
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
                  className="flex items-center gap-2 text-red-600" 
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="outline" className="rounded-full px-6">
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
                  className="flex items-center gap-2 text-red-600" 
                  onClick={() => signOut()}
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
