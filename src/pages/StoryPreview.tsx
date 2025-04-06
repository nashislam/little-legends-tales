
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import StoryDisplay from "@/components/StoryDisplay";
import { Button } from "@/components/ui/button";

const StoryPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract data from location state
  const { story, formData } = location.state || {};
  
  // Redirect to create page if no story data exists
  useEffect(() => {
    if (!story || !formData) {
      navigate('/create');
    }
  }, [story, formData, navigate]);
  
  // If no data, show loading
  if (!story || !formData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-display mb-4 text-legend-blue">
              Your Story is Ready!
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              Here's the personalized story we created just for {formData.childName}
            </p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/create')}
              className="border-legend-blue text-legend-blue hover:bg-legend-blue hover:text-white"
            >
              Create Another Story
            </Button>
          </div>
          
          <StoryDisplay 
            story={story} 
            childName={formData.childName} 
            artStyle={formData.artStyle} 
          />
        </div>
      </div>
    </div>
  );
};

export default StoryPreview;
