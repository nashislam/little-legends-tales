
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      
      <footer className="bg-white py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 mb-4 md:mb-0">© 2025 Little Legends. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="/privacy-policy" className="text-gray-500 hover:text-legend-blue transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
          <p className="text-sm text-gray-400 text-center md:text-left mt-4">
            Creating magical personalized stories for children using AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
