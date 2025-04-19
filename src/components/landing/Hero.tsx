
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 starry-bg">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-pink-cloud rounded-full opacity-30 animate-float"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-purple-cloud rounded-full opacity-20 animate-float delay-1000"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-accent-yellow rounded-full opacity-10 animate-float delay-500"></div>
      
      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-black mb-8 leading-tight text-white">
            Every Child is a{' '}
            <span className="bg-gradient-to-r from-pink-cloud to-purple-cloud text-transparent bg-clip-text">
              Legend
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto font-sans">
            Create magical, personalized storybooks starring your child. Each tale is uniquely crafted to inspire wonder and joy.
          </p>
          
          <div className="flex flex-wrap gap-6 justify-center mb-16">
            <Link to="/create">
              <Button 
                className="bg-primary-teal hover:bg-primary-teal/90 text-white rounded-2xl px-8 py-6 text-xl font-bold shadow-card"
              >
                Create Your Story
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button 
                variant="outline"
                className="rounded-2xl px-8 py-6 text-xl border-2 border-white bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 font-bold"
              >
                See How It Works
              </Button>
            </Link>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-white p-4 rounded-2xl shadow-card">
              <div className="rounded-xl overflow-hidden border-2 border-purple-cloud">
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
