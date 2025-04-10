
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type FormData = {
  childName: string;
  childAge: string;
  favoriteAnimal: string;
  magicalPower: string;
  characters: string;
  artStyle: string;
};

interface FormFieldsProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: keyof FormData, value: string) => void;
}

export const artStyles = [
  { value: 'watercolor', label: 'Watercolor' },
  { value: 'cartoon', label: 'Cartoon' },
  { value: 'dreamy', label: 'Dreamscape' },
  { value: 'pixel', label: 'Pixel Art' },
  { value: 'comic', label: 'Comic Book' },
  { value: 'storybook', label: 'Classic Storybook' }
];

export const magicalPowers = [
  { value: 'flying', label: 'Flying' },
  { value: 'talking-to-animals', label: 'Talking to Animals' },
  { value: 'invisibility', label: 'Invisibility' },
  { value: 'super-strength', label: 'Super Strength' },
  { value: 'time-travel', label: 'Time Travel' },
  { value: 'shape-shifting', label: 'Shape Shifting' },
  { value: 'healing', label: 'Healing Others' }
];

const FormFields = ({ formData, handleChange, handleSelectChange }: FormFieldsProps) => {
  return (
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
  );
};

export default FormFields;
