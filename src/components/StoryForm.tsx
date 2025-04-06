
import { useState } from 'react';
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
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
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
      // Call OpenAI API to generate story
      const story = await generateStory(formData);
      
      // Navigate to story preview page with the generated story
      navigate('/preview', { 
        state: { 
          story,
          formData,
          userId: user?.id 
        } 
      });
    } catch (error) {
      console.error('Error generating story:', error);
      toast({
        title: "Something went wrong",
        description: "We couldn't generate your story. Please try again.",
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
          </div>

          <div className="pt-4 text-center">
            <Button 
              type="submit" 
              className="btn-primary w-full max-w-xs"
              disabled={isLoading}
            >
              {isLoading ? "Creating Your Story..." : "Create Magic!"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StoryForm;
