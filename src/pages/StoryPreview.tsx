import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const StoryPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [story, setStory] = useState<string>("");
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    // Check if we have story data in location state
    if (location.state?.story) {
      setStory(location.state.story);
      setFormData(location.state.formData);
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
      const { error } = await supabase.from("stories").insert({
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

  const paragraphs = story.split("\n\n").filter(p => p.trim() !== "");

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-display mb-4 text-legend-blue">
              Your Magical Story
            </h1>
            <p className="text-lg text-gray-600">
              Here's the personalized story we created just for you
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-10 mb-8">
            {paragraphs.map((paragraph, index) => (
              <p 
                key={index} 
                className={`mb-4 text-lg leading-relaxed ${index === 0 ? "font-semibold text-xl" : ""}`}
              >
                {paragraph}
              </p>
            ))}
          </div>
          
          <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
            <Button 
              onClick={handleSaveStory}
              className="bg-legend-blue hover:bg-blue-600 text-white px-8 py-2"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Story"}
            </Button>
            
            <Button 
              onClick={() => navigate("/create")}
              variant="outline"
              className="px-8 py-2"
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
