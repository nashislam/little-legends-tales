
import Navbar from "@/components/Navbar";
import Hero from "@/components/landing/Hero";
import BookCarousel from "@/components/landing/BookCarousel";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#1A1F2C] starry-bg">
      <Navbar />
      
      <main className="flex-1 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-32 relative z-10">
          <Hero />
          
          <div className="mt-20 relative z-10">
            <BookCarousel />
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl floating" />
        <div className="absolute bottom-32 right-12 w-32 h-32 bg-pink-500/20 rounded-full blur-xl floating" />
      </main>

      <footer className="bg-white/5 backdrop-blur-md border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-purple-200 mb-4 md:mb-0">© 2025 Little Legends. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="/privacy-policy" className="text-purple-200 hover:text-purple-100 transition-colors">
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
