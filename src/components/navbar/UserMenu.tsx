
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { BookMarked, LogOut, Settings, User } from "lucide-react";

interface UserMenuProps {
  email: string;
  isAdmin: boolean;
}

const UserMenu = ({ email, isAdmin }: UserMenuProps) => {
  const auth = useAuth();
  
  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarFallback className="bg-legend-blue text-white">
            {getInitials(email)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>{email}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center gap-2" asChild>
          <Link to="/my-stories">
            <BookMarked className="h-4 w-4" />
            <span>My Saved Stories</span>
          </Link>
        </DropdownMenuItem>
        
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2" asChild>
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
          onClick={() => auth.signOut()}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
