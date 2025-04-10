
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-legend-yellow rounded-full opacity-70 animate-bounce-slow"></div>
      <div className="absolute top-40 right-10 w-16 h-16 bg-legend-blue rounded-full opacity-50 animate-float"></div>
      <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-legend-green rounded-full opacity-60 animate-pulse"></div>
      
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-display mb-6 leading-tight">
            Create Magical Storybooks 
            <span className="text-legend-blue"> Just For Your Child</span>
          </h1>
          
          <p className="text-lg md:text-xl mb-8 text-gray-600 max-w-2xl mx-auto">
            Craft personalized adventures featuring your child as the hero, 
            with their favorite animals and magical powers. Generated with AI, cherished forever.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/create">
              <Button className="btn-primary text-lg">
                Create Your Story
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="outline" className="text-lg border-2 border-legend-blue text-legend-blue hover:bg-legend-blue hover:text-white rounded-full py-2 px-6">
                See How It Works
              </Button>
            </Link>
          </div>
          
          <div className="mt-16 md:mt-24 max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-legend-pink/20 to-legend-blue/20 rounded-3xl transform rotate-1"></div>
              <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                {/* Featured image - replaced with the uploaded illustration */}
                <img
                  src="/lovable-uploads/390b8016-b246-4925-8265-8571a9a2969a.png"
                  alt="Two children reading a magical storybook together"
                  className="rounded-2xl w-full max-w-2xl mx-auto object-contain aspect-square mb-6"
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
