
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { generateStory } from '@/lib/openai';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';
import FormFields, { FormData } from './story/FormFields';
import PreferencesToggle from './story/PreferencesToggle';
import { useUserPreferences } from './story/useUserPreferences';

const initialFormData: FormData = {
  childName: '',
  childAge: '',
  favoriteAnimal: '',
  magicalPower: '',
  characters: '',
  artStyle: 'watercolor',
};

const StoryForm = () => {
  const {
    formData,
    loadingPreferences,
    savingPreferences,
    savePreferences, 
    setSavePreferences,
    handleChange,
    handleSelectChange,
    saveUserPreferences
  } = useUserPreferences(initialFormData);
  
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.childName || !formData.childAge || !formData.favoriteAnimal) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Save preferences if option is checked
      if (user && savePreferences) {
        await saveUserPreferences();
      }
      
      // Call OpenAI API to generate story with structured pages
      const storyResponse = await generateStory(formData);
      
      // Navigate to story preview page with the generated story
      navigate('/preview', { 
        state: { 
          ...storyResponse,
          formData,
          userId: user?.id || null // Allow for anonymous users
        } 
      });
    } catch (error) {
      console.error('Error generating story:', error);
      toast({
        title: "Story Generation Failed",
        description: error instanceof Error ? error.message : "We couldn't generate your story. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="container-card max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl text-center font-display text-legend-blue">
          Create Your Child's Story
        </CardTitle>
        <CardDescription className="text-center text-lg">
          Fill in the details below and we'll create a magical adventure
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loadingPreferences ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-legend-blue" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormFields 
              formData={formData}
              handleChange={handleChange}
              handleSelectChange={handleSelectChange}
            />

            <PreferencesToggle 
              savePreferences={savePreferences}
              setSavePreferences={setSavePreferences}
            />

            <div className="pt-4 text-center">
              <Button 
                type="submit" 
                className="btn-primary w-full max-w-xs"
                disabled={isLoading || savingPreferences}
              >
                {isLoading ? "Creating Your Story..." : "Create Magic!"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default StoryForm;
