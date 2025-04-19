
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import UserMenu from "./UserMenu";

const DesktopNav = () => {
  const { user } = useAuth();

  return (
    <div className="hidden md:flex items-center gap-6">
      <Link to="/" className="text-purple-900 hover:text-purple-700 font-medium transition-colors text-sm">
        Home
      </Link>
      <Link to="/how-it-works" className="text-purple-900 hover:text-purple-700 font-medium transition-colors text-sm">
        How It Works
      </Link>
      
      <Link to="/create">
        <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 font-medium">
          Create Story
        </Button>
      </Link>
      
      {user ? (
        <UserMenu email={user.email || 'User'} isAdmin={user.email === 'nasheet.islam@gmail.com'} />
      ) : (
        <Link to="/auth">
          <Button variant="ghost" className="text-purple-900 font-medium hover:text-purple-700 hover:bg-purple-50">
            Login
          </Button>
        </Link>
      )}
    </div>
  );
};

export default DesktopNav;
