
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="relative min-h-[70vh] flex items-center justify-center py-12 bg-white">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-30"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-blue-300 rounded-full opacity-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-display mb-6 leading-tight">
            Create Magical{' '}
            <span className="block">Storybooks </span>
            <span className="text-blue-400 block">Just For Your Child</span>
          </h1>
          
          <p className="text-base md:text-lg mb-6 text-gray-600 max-w-2xl mx-auto">
            Craft personalized adventures featuring your child as the hero, with 
            their favorite animals and magical powers. Generated with AI, cherished forever.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center mb-10">
            <Link to="/create">
              <Button 
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Create Your Story
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button 
                variant="outline" 
                className="border border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500"
              >
                See How It Works
              </Button>
            </Link>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="relative bg-green-50 p-4 rounded-lg">
              <div className="shadow-xl rounded-lg overflow-hidden border-2 border-gray-200">
                <img
                  src="/lovable-uploads/390b8016-b246-4925-8265-8571a9a2969a.png"
                  alt="Two children reading a magical storybook together"
                  className="w-full max-w-2xl mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
