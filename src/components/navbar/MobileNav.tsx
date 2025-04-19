
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import UserMenu from "./UserMenu";

const MobileNav = () => {
  const { user } = useAuth();

  return (
    <div className="md:hidden flex items-center gap-4">
      <Link to="/create">
        <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-4 font-medium" size="sm">
          Create
        </Button>
      </Link>
      
      {user ? (
        <UserMenu email={user.email || 'User'} isAdmin={user.email === 'nasheet.islam@gmail.com'} />
      ) : (
        <Link to="/auth">
          <Button variant="ghost" size="sm" className="text-purple-900 font-medium hover:text-purple-700">
            Login
          </Button>
        </Link>
      )}
    </div>
  );
};

export default MobileNav;
