
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <BookOpen className="h-6 w-6 text-purple-500" />
      <span className="font-display text-xl text-purple-500">Little Legends</span>
    </Link>
  );
};

export default Logo;
