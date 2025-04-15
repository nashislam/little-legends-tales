
import Navbar from "@/components/Navbar";
import StoryBook from "@/components/StoryBook";
import StoryActions from "@/components/story/StoryActions";
import { useStoryState } from "@/hooks/useStoryState";
import { useStorySave } from "@/hooks/useStorySave";
import { useStoryDownload } from "@/hooks/useStoryDownload";

const StoryPreview = () => {
  const { storyData, formData, storyPages } = useStoryState();
  const { saving, storySaved, handleSaveStory } = useStorySave(storyData, formData);
  const { downloading, handleDownload } = useStoryDownload(storyData, formData);

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
            onDownload={handleDownload}
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
