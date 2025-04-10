
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import StoryBook from "@/components/StoryBook";
import { splitStoryIntoPages, generatePlaceholderImage } from "@/lib/storyUtils";
import { Download } from "lucide-react";

const StoryPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [story, setStory] = useState<string>("");
  const [formData, setFormData] = useState<any>(null);
  const [storyPages, setStoryPages] = useState<any[]>([]);

  useEffect(() => {
    // Check if we have story data in location state
    if (location.state?.story) {
      const storyText = location.state.story;
      setStory(storyText);
      setFormData(location.state.formData);
      
      // Process the story into pages
      const pages = splitStoryIntoPages(storyText);
      
      // Add placeholder images to each page
      // In a production app, this would be replaced with AI-generated images
      const pagesWithImages = pages.map((page, index) => ({
        ...page,
        image: generatePlaceholderImage(index, location.state.formData?.artStyle || 'watercolor')
      }));
      
      setStoryPages(pagesWithImages);
    } else {
      // If no story data, redirect to create page
      navigate("/create");
    }
  }, [location.state, navigate]);

  const handleSaveStory = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login or create an account to save your story.",
        variant: "default",
        action: (
          <Button onClick={() => navigate("/auth")}>Login</Button>
        ),
      });
      return;
    }

    setSaving(true);
    try {
      // Specifically cast the from() method to handle TypeScript error
      const { error } = await supabase
        .from('stories' as any)
        .insert({
          user_id: user.id,
          content: story,
          child_name: formData?.childName || "",
          child_age: formData?.childAge || "",
          favorite_animal: formData?.favoriteAnimal || "",
          magical_power: formData?.magicalPower || "",
          characters: formData?.characters || "",
          art_style: formData?.artStyle || "",
        } as any);

      if (error) throw error;

      toast({
        title: "Story Saved!",
        description: "Your story has been saved to your account.",
      });
    } catch (error) {
      console.error("Error saving story:", error);
      toast({
        title: "Failed to Save",
        description: "There was an error saving your story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const downloadAsPdf = () => {
    setDownloading(true);
    
    // Simulate PDF generation delay
    setTimeout(() => {
      setDownloading(false);
      
      // In a real implementation, this would generate and download an actual PDF
      toast({
        title: "PDF Downloaded",
        description: "Your story has been downloaded as a PDF.",
      });
      
      // For now, create a text file as a placeholder
      const element = document.createElement('a');
      const file = new Blob([`${formData?.childName || "Child"}'s Adventure\n\n${story}`], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${formData?.childName || "Child"}'s Adventure.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-display mb-4 text-legend-blue">
              Your Magical Story
            </h1>
            <p className="text-lg text-gray-600">
              Here's the personalized story we created just for {formData?.childName || "your child"}
            </p>
          </div>
          
          {storyPages.length > 0 && (
            <StoryBook 
              childName={formData?.childName || "Child"} 
              pages={storyPages} 
              artStyle={formData?.artStyle || "watercolor"} 
            />
          )}
          
          <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
            <Button 
              onClick={handleSaveStory}
              className="bg-legend-blue hover:bg-blue-600 text-white"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Story"}
            </Button>
            
            <Button 
              onClick={downloadAsPdf}
              className="flex items-center gap-2"
              variant="outline"
              disabled={downloading}
            >
              <Download size={18} />
              {downloading ? "Preparing PDF..." : "Download PDF"}
            </Button>
            
            <Button 
              onClick={() => navigate("/create")}
              variant="outline"
              className="border-2 border-legend-pink text-legend-pink hover:bg-legend-pink hover:text-white"
            >
              Create Another Story
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryPreview;
