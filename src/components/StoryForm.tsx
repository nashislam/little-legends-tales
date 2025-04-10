
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { supabase } from '@/integrations/supabase/client';
import { Switch } from "@/components/ui/switch";
import { Loader2 } from 'lucide-react';

type FormData = {
  childName: string;
  childAge: string;
  favoriteAnimal: string;
  magicalPower: string;
  characters: string;
  artStyle: string;
};

const initialFormData: FormData = {
  childName: '',
  childAge: '',
  favoriteAnimal: '',
  magicalPower: '',
  characters: '',
  artStyle: 'watercolor',
};

const StoryForm = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPreferences, setLoadingPreferences] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [savePreferences, setSavePreferences] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // Load user preferences on component mount if user is logged in
  useEffect(() => {
    const loadUserPreferences = async () => {
      if (!user) return;
      
      setLoadingPreferences(true);
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('Error fetching user preferences:', error);
          return;
        }
        
        if (data) {
          setFormData({
            childName: data.child_name || '',
            childAge: data.child_age || '',
            favoriteAnimal: data.favorite_animal || '',
            magicalPower: data.preferred_magical_power || '',
            characters: data.favorite_characters || '',
            artStyle: data.preferred_art_style || 'watercolor',
          });
          setSavePreferences(true);
        }
      } catch (error) {
        console.error('Error loading user preferences:', error);
      } finally {
        setLoadingPreferences(false);
      }
    };
    
    loadUserPreferences();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const saveUserPreferences = async () => {
    if (!user) return;
    
    setSavingPreferences(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('user_id', user.id)
        .single();
        
      const preferences = {
        user_id: user.id,
        child_name: formData.childName,
        child_age: formData.childAge,
        favorite_animal: formData.favoriteAnimal,
        preferred_magical_power: formData.magicalPower,
        favorite_characters: formData.characters,
        preferred_art_style: formData.artStyle,
        updated_at: new Date().toISOString(),
      };
      
      let error;
      if (data) {
        // Update existing preferences
        const { error: updateError } = await supabase
          .from('user_preferences')
          .update(preferences)
          .eq('id', data.id);
        error = updateError;
      } else {
        // Insert new preferences
        const { error: insertError } = await supabase
          .from('user_preferences')
          .insert([preferences]);
        error = insertError;
      }
      
      if (error) throw error;
      
      toast({
        title: "Preferences Saved",
        description: "We'll remember your story settings for next time.",
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Failed to Save",
        description: "We couldn't save your preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSavingPreferences(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      
      // Call OpenAI API to generate story
      const story = await generateStory(formData);
      
      // Navigate to story preview page with the generated story
      navigate('/preview', { 
        state: { 
          story,
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

  const artStyles = [
    { value: 'watercolor', label: 'Watercolor' },
    { value: 'cartoon', label: 'Cartoon' },
    { value: 'dreamy', label: 'Dreamscape' },
    { value: 'pixel', label: 'Pixel Art' },
    { value: 'comic', label: 'Comic Book' },
    { value: 'storybook', label: 'Classic Storybook' }
  ];

  const magicalPowers = [
    { value: 'flying', label: 'Flying' },
    { value: 'talking-to-animals', label: 'Talking to Animals' },
    { value: 'invisibility', label: 'Invisibility' },
    { value: 'super-strength', label: 'Super Strength' },
    { value: 'time-travel', label: 'Time Travel' },
    { value: 'shape-shifting', label: 'Shape Shifting' },
    { value: 'healing', label: 'Healing Others' }
  ];

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
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="childName">Child's Name*</Label>
                  <Input
                    id="childName"
                    name="childName"
                    value={formData.childName}
                    onChange={handleChange}
                    placeholder="Enter your child's name"
                    className="input-field"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="childAge">Child's Age*</Label>
                  <Input
                    id="childAge"
                    name="childAge"
                    value={formData.childAge}
                    onChange={handleChange}
                    placeholder="How old is your child?"
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="favoriteAnimal">Favorite Animal*</Label>
                <Input
                  id="favoriteAnimal"
                  name="favoriteAnimal"
                  value={formData.favoriteAnimal}
                  onChange={handleChange}
                  placeholder="What's their favorite animal?"
                  className="input-field"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="magicalPower">Magical Power</Label>
                <Select 
                  value={formData.magicalPower} 
                  onValueChange={(value) => handleSelectChange('magicalPower', value)}
                >
                  <SelectTrigger className="input-field">
                    <SelectValue placeholder="Choose a magical power" />
                  </SelectTrigger>
                  <SelectContent>
                    {magicalPowers.map(power => (
                      <SelectItem key={power.value} value={power.value}>{power.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="characters">Characters to Include</Label>
                <Input
                  id="characters"
                  name="characters"
                  value={formData.characters}
                  onChange={handleChange}
                  placeholder="Mom, Dad, Sister, Brother, etc."
                  className="input-field"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="artStyle">Art Style</Label>
                <Select 
                  value={formData.artStyle} 
                  onValueChange={(value) => handleSelectChange('artStyle', value)}
                >
                  <SelectTrigger className="input-field">
                    <SelectValue placeholder="Choose an art style" />
                  </SelectTrigger>
                  <SelectContent>
                    {artStyles.map(style => (
                      <SelectItem key={style.value} value={style.value}>{style.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {user && (
                <div className="flex items-center justify-between pt-2 pb-1">
                  <Label htmlFor="save-preferences" className="cursor-pointer">
                    Remember these details for next time
                  </Label>
                  <Switch
                    id="save-preferences"
                    checked={savePreferences}
                    onCheckedChange={setSavePreferences}
                  />
                </div>
              )}
            </div>

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
