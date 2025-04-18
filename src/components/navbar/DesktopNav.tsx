
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import UserMenu from "./UserMenu";

const DesktopNav = () => {
  const { user } = useAuth();

  return (
    <div className="hidden md:flex items-center gap-6">
      <Link to="/" className="text-gray-600 hover:text-legend-blue transition-colors">
        Home
      </Link>
      <Link to="/how-it-works" className="text-gray-600 hover:text-legend-blue transition-colors">
        How It Works
      </Link>
      
      <Link to="/create">
        <Button className="bg-legend-blue hover:bg-blue-400 text-white rounded-full px-6" size="lg">
          Create Story
        </Button>
      </Link>
      
      {user ? (
        <UserMenu email={user.email || 'User'} isAdmin={user.email === 'nasheet.islam@gmail.com'} />
      ) : (
        <Link to="/auth">
          <Button variant="outline" size="lg" className="rounded-full px-6 border border-gray-300 text-gray-600 hover:border-legend-blue hover:text-legend-blue">
            Login
          </Button>
        </Link>
      )}
    </div>
  );
};

export default DesktopNav;
