
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface StoryDisplayProps {
  story: string;
  childName: string;
  artStyle: string;
}

const StoryDisplay = ({ story, childName, artStyle }: StoryDisplayProps) => {
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const { toast } = useToast();

  // Simple function to convert the story to a downloadable PDF
  const downloadAsPdf = () => {
    setIsPdfLoading(true);
    
    // Simulate PDF generation delay
    setTimeout(() => {
      setIsPdfLoading(false);
      
      // In a real implementation, this would generate and download an actual PDF
      toast({
        title: "PDF Downloaded",
        description: "Your story has been downloaded as a PDF.",
      });
      
      // For now, create a text file as a placeholder
      const element = document.createElement('a');
      const file = new Blob([`${childName}'s Adventure\n\n${story}`], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${childName}'s Adventure.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 2000);
  };

  // Format the story by splitting paragraphs
  const formattedStory = story.split('\n').filter(paragraph => paragraph.trim() !== '');

  return (
    <div className="container-card max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-display text-center mb-2 text-legend-blue">
          {childName}'s Magical Adventure
        </h2>
        <p className="text-center text-gray-500 italic">Art style: {artStyle}</p>
      </div>
      
      <div className="story-content mb-8">
        {/* Placeholder for story illustration */}
        <div className="bg-gray-100 rounded-xl p-8 mb-6 text-center">
          <p className="text-gray-500 italic">
            [Story illustration would appear here in the full version]
          </p>
        </div>
        
        {/* Story text */}
        <div className="story-text space-y-4">
          {formattedStory.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button
          onClick={downloadAsPdf}
          className="btn-primary flex items-center gap-2"
          disabled={isPdfLoading}
        >
          <Download size={18} />
          {isPdfLoading ? "Preparing PDF..." : "Download PDF"}
        </Button>
        <Button
          variant="outline"
          className="border-2 border-legend-pink text-legend-pink hover:bg-legend-pink hover:text-white"
        >
          Order Printed Book
        </Button>
      </div>
    </div>
  );
};

export default StoryDisplay;
