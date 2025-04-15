
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { type StoryResponse } from "@/lib/openai";

export const useStoryDownload = (storyData: StoryResponse | null, formData: any) => {
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    if (!storyData && !formData) {
      toast({
        title: "Error",
        description: "No story data available to download.",
        variant: "destructive"
      });
      return;
    }

    setDownloading(true);
    
    setTimeout(() => {
      setDownloading(false);
      
      toast({
        title: "PDF Downloaded",
        description: "Your story has been downloaded as a PDF.",
      });
      
      const storyText = storyData?.story || "";
      const childName = formData?.childName || "Child";
      const element = document.createElement('a');
      const file = new Blob([`${childName}'s Adventure\n\n${storyText}`], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${childName}'s Adventure.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 2000);
  };

  return {
    downloading,
    handleDownload
  };
};
