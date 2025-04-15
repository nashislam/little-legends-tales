
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { useVersionCheck } from "@/hooks/useVersionCheck";
import { toast } from "@/components/ui/use-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import CreateStory from "./pages/CreateStory";
import StoryPreview from "./pages/StoryPreview";
import MySavedStories from "./pages/MySavedStories";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AdminPromptLab from "./pages/AdminPromptLab";

const queryClient = new QueryClient();

// Enhanced version checker component
const VersionChecker = () => {
  useVersionCheck(30000); // Check every 30 seconds
  
  useEffect(() => {
    // Force a version check on first load
    const checkInitialVersion = async () => {
      try {
        const cacheBuster = `?_=${Date.now()}`;
        const res = await fetch(`/version.json${cacheBuster}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        if (!res.ok) return;
        
        const data = await res.json();
        const storedVersion = localStorage.getItem('appVersion');
        
        console.log('Initial version check:', storedVersion, data.version);
        
        if (!storedVersion) {
          localStorage.setItem('appVersion', data.version);
        } else if (storedVersion !== data.version) {
          localStorage.setItem('appVersion', data.version);
          toast({
            title: "Updated to version " + data.version,
            description: "Application has been updated with the latest features.",
            duration: 5000,
          });
        }
      } catch (error) {
        console.error('Initial version check failed:', error);
      }
    };
    
    checkInitialVersion();
    
    // Check if this is a fresh page load (not from bfcache)
    const handlePageShow = (event) => {
      if (event.persisted) {
        // Page was restored from bfcache, force a refresh
        window.location.reload();
      }
    };
    
    window.addEventListener('pageshow', handlePageShow);
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);
  
  return null;
};

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
