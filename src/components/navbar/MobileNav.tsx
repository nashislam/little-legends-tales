
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import UserMenu from "./UserMenu";

const MobileNav = () => {
  const { user } = useAuth();

  return (
    <div className="md:hidden flex items-center gap-2">
      <Link to="/create">
        <Button className="bg-blue-500 hover:bg-blue-600 text-white" size="sm">
          Create
        </Button>
      </Link>
      
      {user ? (
        <UserMenu email={user.email || 'User'} isAdmin={user.email === 'nasheet.islam@gmail.com'} />
      ) : (
        <Link to="/auth" className="md:hidden">
          <Button variant="outline" className="border border-gray-300 text-gray-600" size="sm">
            Login
          </Button>
        </Link>
      )}
    </div>
  );
};

export default MobileNav;
