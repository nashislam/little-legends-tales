
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Play, Book } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function PromptEditor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [systemMessage, setSystemMessage] = useState(
    "You are an expert children's book author who creates engaging, age-appropriate stories."
  );
  const [userMessage, setUserMessage] = useState("");
  const [output, setOutput] = useState("");

  const handleTest = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase.functions.invoke('generate-story', {
        body: { 
          systemMessage,
          userMessage,
          model: "gpt-4o",
        }
      });

      if (error) throw error;
      setOutput(data.story || "No output generated");
      
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase.from('prompt_templates').insert({
        name,
        description,
        system_message: systemMessage,
        user_message: userMessage,
        created_by: user?.id
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Prompt template saved successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card className="p-4">
          <div className="space-y-4">
            <div>
              <Label>Template Name</Label>
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="E.g., Adventure Story v1"
              />
            </div>
            
            <div>
              <Label>Description</Label>
              <Textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the purpose of this prompt template..."
                rows={2}
              />
            </div>

            <div>
              <Label>System Message</Label>
              <Textarea 
                value={systemMessage}
                onChange={(e) => setSystemMessage(e.target.value)}
                placeholder="Instructions for the AI model..."
                rows={4}
              />
            </div>

            <div>
              <Label>User Message</Label>
              <Textarea 
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="The actual prompt template..."
                rows={6}
              />
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleTest} 
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Testing</>
                ) : (
                  <><Play className="mr-2 h-4 w-4" /> Test</>
                )}
              </Button>
              <Button 
                onClick={handleSave}
                variant="outline"
                className="flex-1"
              >
                <Save className="mr-2 h-4 w-4" /> Save Template
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Book className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Output Preview</h3>
          </div>
          <div className="min-h-[200px] p-4 bg-muted rounded-md font-mono text-sm whitespace-pre-wrap">
            {output || "Output will appear here..."}
          </div>
        </Card>
      </div>
    </div>
  );
}
