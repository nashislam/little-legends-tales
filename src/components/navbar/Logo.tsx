
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <BookOpen className="h-7 w-7 text-purple-600" />
      <span className="font-display text-2xl text-purple-600">Little Legends</span>
    </Link>
  );
};

export default Logo;
