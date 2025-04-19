
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import UserMenu from "./UserMenu";

const MobileNav = () => {
  const { user } = useAuth();

  return (
    <div className="md:hidden flex items-center gap-4">
      <Link to="/create">
        <Button className="bg-primary-teal hover:bg-primary-teal/90 text-white font-semibold text-base px-4 py-2 rounded-xl shadow-sm">
          Create Story
        </Button>
      </Link>
      
      {user ? (
        <UserMenu email={user.email || 'User'} isAdmin={user.email === 'nasheet.islam@gmail.com'} />
      ) : (
        <Link to="/auth" className="text-gray-600 font-medium text-base">
          Login
        </Link>
      )}
    </div>
  );
};

export default MobileNav;
