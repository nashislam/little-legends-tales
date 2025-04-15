
import { useAuth } from "@/lib/auth";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PromptEditor from "@/components/admin/PromptEditor";
import ExperimentsList from "@/components/admin/ExperimentsList";
import { useToast } from "@/components/ui/use-toast";

export default function AdminPromptLab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("editor");

  // Check if user is admin
  const isAdmin = user?.email === "nasheet.islam@gmail.com";

  if (!user || !isAdmin) {
    toast({
      title: "Access Denied",
      description: "You don't have permission to access this page.",
      variant: "destructive"
    });
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Prompt Lab</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="editor">Prompt Editor</TabsTrigger>
          <TabsTrigger value="experiments">Experiments</TabsTrigger>
        </TabsList>

        <TabsContent value="editor">
          <PromptEditor />
        </TabsContent>

        <TabsContent value="experiments">
          <ExperimentsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
