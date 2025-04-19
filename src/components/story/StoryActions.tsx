
import { Button } from "@/components/ui/button";
import { Download, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StoryActionsProps {
  onSave: () => void;
  onDownload: () => void;
  saving: boolean;
  downloading: boolean;
  storySaved: boolean;
}

const StoryActions = ({ 
  onSave, 
  onDownload, 
  saving, 
  downloading, 
  storySaved 
}: StoryActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
      <Button 
        onClick={onSave}
        className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 font-medium"
        disabled={saving || storySaved}
      >
        <Save size={18} />
        {saving ? "Saving..." : storySaved ? "Story Saved" : "Save Story"}
      </Button>
      
      <Button 
        onClick={onDownload}
        className="flex items-center gap-2 font-medium"
        variant="outline"
        disabled={downloading}
      >
        <Download size={18} />
        {downloading ? "Preparing PDF..." : "Download PDF"}
      </Button>
      
      <Button 
        onClick={() => navigate("/create")}
        variant="outline"
        className="border-2 border-purple-200 text-purple-800 hover:bg-purple-50 hover:text-purple-700 font-medium"
      >
        Create Another Story
      </Button>
    </div>
  );
};

export default StoryActions;
