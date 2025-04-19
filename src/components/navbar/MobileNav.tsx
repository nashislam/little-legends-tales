
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import UserMenu from "./UserMenu";

const MobileNav = () => {
  const { user } = useAuth();

  return (
    <div className="md:hidden flex items-center gap-4">
      <Link to="/create">
        <Button className="bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-medium text-base px-4 py-2 rounded-full">
          Create Story
        </Button>
      </Link>
      
      {user ? (
        <UserMenu email={user.email || 'User'} isAdmin={user.email === 'nashtyrhymes@gmail.com'} />
      ) : (
        <Link to="/auth" className="text-gray-600 font-medium text-base">
          Login
        </Link>
      )}
    </div>
  );
};

export default MobileNav;
