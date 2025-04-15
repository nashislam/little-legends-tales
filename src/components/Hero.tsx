
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-white to-gray-50">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-legend-yellow/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-legend-blue/20 rounded-full blur-lg"></div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-display mb-6 leading-tight text-gray-800">
            Create Magical Storybooks{' '}
            <span className="text-legend-blue block md:inline">Just For Your Child</span>
          </h1>
          
          <p className="text-lg md:text-xl mb-8 text-gray-600 max-w-2xl mx-auto">
            Craft personalized adventures featuring your child as the hero, 
            with their favorite animals and magical powers. Generated with AI, cherished forever.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <Link to="/create">
              <Button 
                className="bg-legend-blue hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-full text-lg"
              >
                Create Your Story
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button 
                variant="outline" 
                className="border-2 border-legend-blue text-legend-blue hover:bg-legend-blue hover:text-white rounded-full py-2 px-6 text-lg"
              >
                See How It Works
              </Button>
            </Link>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-legend-pink/10 to-legend-blue/10 rounded-3xl transform rotate-1"></div>
              <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <img
                  src="/lovable-uploads/390b8016-b246-4925-8265-8571a9a2969a.png"
                  alt="Two children reading a magical storybook together"
                  className="rounded-2xl w-full max-w-2xl mx-auto aspect-video object-cover mb-8"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="space-y-2">
                    <h3 className="font-display text-xl text-legend-blue">Personalized</h3>
                    <p className="text-gray-600">Stories starring your child and their interests</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display text-xl text-legend-pink">Magical</h3>
                    <p className="text-gray-600">Whimsical adventures with their favorite characters</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display text-xl text-legend-green">Meaningful</h3>
                    <p className="text-gray-600">Keepsakes they'll treasure for years to come</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
