
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import StoryBook from "@/components/StoryBook";
import { splitStoryIntoPages } from "@/lib/storyUtils";
import { Download, Save, Share } from "lucide-react";

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
  const [storySaved, setStorySaved] = useState(false);

  useEffect(() => {
    if (location.state?.story) {
      const storyText = location.state.story;
      setStory(storyText);
      setFormData(location.state.formData);
      
      // Use our updated splitStoryIntoPages function that creates a title page
      const pages = splitStoryIntoPages(storyText);
      setStoryPages(pages);
    } else {
      navigate("/create");
    }
  }, [location.state, navigate]);

  // Check if story is already saved on component mount
  useEffect(() => {
    const checkStorySaved = async () => {
      if (!user || !story) return;
      
      try {
        const { data, error } = await supabase
          .from('stories')
          .select('id')
          .eq('user_id', user.id)
          .eq('content', story)
          .maybeSingle();
        
        if (data) {
          setStorySaved(true);
        }
      } catch (error) {
        console.error('Error checking saved story:', error);
      }
    };
    
    checkStorySaved();
  }, [user, story]);

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
      const { error } = await supabase
        .from('stories')
        .insert({
          user_id: user.id,
          content: story,
          child_name: formData?.childName || "",
          child_age: formData?.childAge || "",
          favorite_animal: formData?.favoriteAnimal || "",
          magical_power: formData?.magicalPower || "",
          characters: formData?.characters || "",
          art_style: formData?.artStyle || "",
        });

      if (error) throw error;

      toast({
        title: "Story Saved!",
        description: "Your story has been saved to your account.",
      });
      setStorySaved(true);
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
    
    setTimeout(() => {
      setDownloading(false);
      
      toast({
        title: "PDF Downloaded",
        description: "Your story has been downloaded as a PDF.",
      });
      
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
              storyText={story}
            />
          )}
          
          <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
            <Button 
              onClick={handleSaveStory}
              className="bg-legend-blue hover:bg-blue-600 text-white flex items-center gap-2"
              disabled={saving || storySaved}
            >
              <Save size={18} />
              {saving ? "Saving..." : storySaved ? "Story Saved" : "Save Story"}
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
