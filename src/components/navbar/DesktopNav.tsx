
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import UserMenu from "./UserMenu";

const DesktopNav = () => {
  const { user } = useAuth();

  return (
    <div className="hidden md:flex items-center gap-8">
      <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
        Home
      </Link>
      <Link to="/how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
        How It Works
      </Link>
      
      <Link to="/create">
        <Button className="bg-[#7CC6FE] hover:bg-[#60B8F8] text-white rounded-full px-6" size="sm">
          Create Story
        </Button>
      </Link>
      
      {user ? (
        <UserMenu email={user.email || 'User'} isAdmin={user.email === 'nasheet.islam@gmail.com'} />
      ) : (
        <Link to="/auth">
          <Button variant="ghost" size="sm" className="text-gray-600">
            Login
          </Button>
        </Link>
      )}
    </div>
  );
};

export default DesktopNav;
