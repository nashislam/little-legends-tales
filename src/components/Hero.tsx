
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center py-12 bg-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-200 rounded-full opacity-30 animate-float"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-purple-200 rounded-full opacity-20 animate-float"></div>
      
      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-display mb-8 leading-tight text-purple-900">
            Create Magical{' '}
            <span className="text-purple-900 block">Storybooks </span>
            <span className="text-purple-600 block">Just For Your Child</span>
          </h1>
          
          <p className="text-base md:text-lg mb-8 text-gray-600 max-w-2xl mx-auto">
            Craft personalized adventures featuring your child as the hero, with 
            their favorite animals and magical powers. Generated with AI, cherished forever.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <Link to="/create">
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 py-6 text-base font-semibold shadow-md"
              >
                Create Your Story
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button 
                variant="outline"
                className="rounded-full px-8 py-6 text-base border-2 border-purple-200 text-purple-800 hover:bg-purple-50 font-semibold"
              >
                See How It Works
              </Button>
            </Link>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-white p-4 rounded-2xl shadow-lg">
              <div className="rounded-xl overflow-hidden border-2 border-purple-100">
                <img
                  src="/lovable-uploads/390b8016-b246-4925-8265-8571a9a2969a.png"
                  alt="Two children reading a magical storybook together"
                  className="w-full"
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
