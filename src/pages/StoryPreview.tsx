
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import StoryBook from "@/components/StoryBook";
import StoryActions from "@/components/story/StoryActions";
import { useStoryState } from "@/hooks/useStoryState";
import { useStorySave } from "@/hooks/useStorySave";

const StoryPreview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);
  
  const { storyData, formData, storyPages } = useStoryState();
  const { saving, storySaved, handleSaveStory } = useStorySave(storyData, formData);

  const downloadAsPdf = () => {
    setDownloading(true);
    
    setTimeout(() => {
      setDownloading(false);
      
      toast({
        title: "PDF Downloaded",
        description: "Your story has been downloaded as a PDF.",
      });
      
      const element = document.createElement('a');
      const storyText = storyData?.story || storyPages.map(p => p.content).join('\n\n');
      const file = new Blob([`${formData?.childName || "Child"}'s Adventure\n\n${storyText}`], {type: 'text/plain'});
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
              storyText={storyData?.story || ""}
            />
          )}
          
          <StoryActions
            onSave={handleSaveStory}
            onDownload={downloadAsPdf}
            saving={saving}
            downloading={downloading}
            storySaved={storySaved}
          />
        </div>
      </div>
    </div>
  );
};

export default StoryPreview;
