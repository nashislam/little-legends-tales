
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import VersionChecker from "@/components/VersionChecker";
import "./App.css";

// Import components
import Navbar from "./components/Navbar";
import Auth from "./pages/Auth";
import CreateStory from "./pages/CreateStory";
import StoryPreview from "./pages/StoryPreview";
import HowItWorks from "./pages/HowItWorks";
import NotFound from "./pages/NotFound";
import AdminPromptLab from "./pages/AdminPromptLab";
import MySavedStories from "./pages/MySavedStories";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <VersionChecker />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/create" element={<CreateStory />} />
        <Route path="/preview" element={<StoryPreview />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/my-stories" element={
          <ProtectedRoute>
            <MySavedStories />
          </ProtectedRoute>
        } />
        <Route path="/admin/prompt-lab" element={
          <ProtectedRoute>
            <AdminPromptLab />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
