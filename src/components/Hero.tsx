
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-white">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-legend-yellow rounded-full opacity-30"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-legend-blue rounded-full opacity-20"></div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-display mb-6 leading-tight">
            Create Magical{' '}
            <span className="block">Storybooks </span>
            <span className="text-legend-blue block">Just For Your Child</span>
          </h1>
          
          <p className="text-lg md:text-xl mb-8 text-gray-600 max-w-2xl mx-auto">
            Craft personalized adventures featuring your child as the hero, with 
            their favorite animals and magical powers. Generated with AI, cherished forever.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <Link to="/create">
              <Button 
                className="bg-legend-blue hover:bg-blue-400 text-white font-semibold py-2 px-8 rounded-full text-lg shadow-md"
              >
                Create Your Story
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button 
                variant="outline" 
                className="border-2 border-gray-300 text-gray-600 hover:border-legend-blue hover:text-legend-blue rounded-full py-2 px-8 text-lg"
              >
                See How It Works
              </Button>
            </Link>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="shadow-2xl rounded-3xl overflow-hidden border border-gray-200">
                <img
                  src="/lovable-uploads/390b8016-b246-4925-8265-8571a9a2969a.png"
                  alt="Two children reading a magical storybook together"
                  className="rounded-3xl w-full max-w-2xl mx-auto object-cover"
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
