
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="w-full py-4 px-4 md:px-8">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-legend-blue" />
          <span className="font-display text-2xl text-foreground">Little Legends</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="font-semibold hover:text-legend-blue transition-colors">
            Home
          </Link>
          <Link to="/how-it-works" className="font-semibold hover:text-legend-blue transition-colors">
            How It Works
          </Link>
          <Link to="/create">
            <Button className="bg-legend-blue hover:bg-blue-500 text-white rounded-full px-6">
              Create Story
            </Button>
          </Link>
        </div>
        
        <Link to="/create" className="md:hidden">
          <Button className="bg-legend-blue hover:bg-blue-500 text-white rounded-full">
            Create
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
