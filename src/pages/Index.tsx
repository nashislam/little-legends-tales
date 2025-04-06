
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      
      <footer className="bg-white py-12 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 mb-4">© 2025 Little Legends. All rights reserved.</p>
          <p className="text-sm text-gray-400">
            Creating magical personalized stories for children using AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
