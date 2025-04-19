
import Navbar from "@/components/Navbar";
import Hero from "@/components/landing/Hero";
import BookCarousel from "@/components/landing/BookCarousel";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 relative">
        <Hero />
        
        <div className="py-20 bg-gradient-to-b from-purple-cloud/50 to-white">
          <div className="container mx-auto max-w-7xl">
            <BookCarousel />
          </div>
        </div>
      </main>

      <footer className="bg-primary-teal/10 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 mb-4 md:mb-0">© 2025 Little Legends. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="/privacy-policy" className="text-primary-teal hover:underline transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
