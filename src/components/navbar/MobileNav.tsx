
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import UserMenu from "./UserMenu";

const MobileNav = () => {
  const { user } = useAuth();

  return (
    <div className="md:hidden flex items-center gap-4">
      <Link to="/create">
        <Button className="bg-[#7CC6FE] hover:bg-[#60B8F8] text-white rounded-full px-4" size="sm">
          Create
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

export default MobileNav;
