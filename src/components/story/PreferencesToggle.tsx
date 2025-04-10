
import { useAuth } from '@/lib/auth';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PreferencesToggleProps {
  savePreferences: boolean;
  setSavePreferences: (value: boolean) => void;
}

const PreferencesToggle = ({ savePreferences, setSavePreferences }: PreferencesToggleProps) => {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
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
  );
};

export default PreferencesToggle;
