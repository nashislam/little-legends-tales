
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
      </main>
      
      <footer className="bg-white py-8 border-t">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 mb-4 md:mb-0">© 2025 Little Legends. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="/privacy-policy" className="text-gray-500 hover:text-purple-600 transition-colors">
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
