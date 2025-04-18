
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import UserMenu from "./UserMenu";

const DesktopNav = () => {
  const { user } = useAuth();

  return (
    <div className="hidden md:flex items-center gap-4">
      <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
        Home
      </Link>
      <Link to="/how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">
        How It Works
      </Link>
      
      <Link to="/create">
        <Button className="bg-blue-500 hover:bg-blue-600 text-white" size="sm">
          Create Story
        </Button>
      </Link>
      
      {user ? (
        <UserMenu email={user.email || 'User'} isAdmin={user.email === 'nasheet.islam@gmail.com'} />
      ) : (
        <Link to="/auth">
          <Button variant="outline" size="sm" className="border border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500">
            Login
          </Button>
        </Link>
      )}
    </div>
  );
};

export default DesktopNav;
