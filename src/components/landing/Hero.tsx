
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="relative text-center space-y-6 z-10">
      <h1 className="text-5xl md:text-7xl font-display text-white leading-tight">
        Every Child is a
        <span className="block bg-gradient-to-r from-purple-300 to-pink-300 text-transparent bg-clip-text">
          Legend
        </span>
      </h1>
      
      <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto px-4">
        Create magical, personalized storybooks starring your child. Each tale is uniquely crafted to inspire wonder and joy.
      </p>
      
      <div className="flex flex-wrap gap-4 justify-center">
        <Link to="/create">
          <Button size="lg" className="bg-purple-500 hover:bg-purple-600 text-white rounded-full px-8">
            Create Your Story
          </Button>
        </Link>
        <Link to="/how-it-works">
          <Button 
            variant="outline" 
            size="lg"
            className="rounded-full px-8 border-2 border-purple-300 text-purple-100 hover:bg-purple-900/30"
          >
            See How It Works
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
