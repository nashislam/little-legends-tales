
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import VersionChecker from "@/components/VersionChecker";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import CreateStory from "./pages/CreateStory";
import StoryPreview from "./pages/StoryPreview";
import MySavedStories from "./pages/MySavedStories";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AdminPromptLab from "./pages/AdminPromptLab";

// Initialize QueryClient outside of component to prevent recreation on re-renders
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 minute
      retry: 1,         // Reduce retry attempts
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <VersionChecker />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/create" element={<CreateStory />} />
            <Route path="/preview" element={<StoryPreview />} />
            <Route 
              path="/my-stories" 
              element={
                <ProtectedRoute>
                  <MySavedStories />
                </ProtectedRoute>
              } 
            />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/admin/prompt-lab" element={<AdminPromptLab />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
