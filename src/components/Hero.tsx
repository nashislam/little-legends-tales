
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="relative min-h-[70vh] flex items-center justify-center py-12 bg-white">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-[#FFD966] rounded-full opacity-30"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-[#7CC6FE] rounded-full opacity-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-display mb-6 leading-tight text-[#2D3748]">
            Create Magical{' '}
            <span className="text-[#2D3748] block">Storybooks </span>
            <span className="text-[#7CC6FE] block">Just For Your Child</span>
          </h1>
          
          <p className="text-base md:text-lg mb-8 text-gray-600 max-w-2xl mx-auto">
            Craft personalized adventures featuring your child as the hero, with 
            their favorite animals and magical powers. Generated with AI, cherished forever.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Link to="/create">
              <Button 
                className="bg-[#7CC6FE] hover:bg-[#60B8F8] text-white rounded-full px-8 py-6 text-base"
              >
                Create Your Story
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button 
                variant="outline"
                className="rounded-full px-8 py-6 text-base border-2 border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                See How It Works
              </Button>
            </Link>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="relative bg-[#F7FAFC] p-4 rounded-2xl">
              <div className="rounded-xl overflow-hidden border-2 border-gray-100">
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
