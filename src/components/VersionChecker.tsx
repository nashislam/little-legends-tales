
import { useEffect } from 'react';
import { useVersionCheck } from "@/hooks/useVersionCheck";
import { toast } from "@/components/ui/use-toast";

const VersionChecker = () => {
  // Check more frequently - every 15 seconds
  useVersionCheck(15000); 
  
  useEffect(() => {
    // Force a version check on first load with aggressive cache busting
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
          // Force reload on first visit to ensure latest assets
          window.location.reload();
        } else if (storedVersion !== data.version) {
          localStorage.setItem('appVersion', data.version);
          toast({
            title: "Updated to version " + data.version,
            description: "Application has been updated with the latest features.",
            duration: 5000,
          });
          
          // Force reload to get fresh assets
          setTimeout(() => window.location.reload(), 1000);
        }
      } catch (error) {
        console.error('Initial version check failed:', error);
      }
    };
    
    checkInitialVersion();
    
    // Check if this is a fresh page load (not from bfcache)
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // Page was restored from bfcache, force a refresh
        window.location.reload();
      }
    };
    
    // Add a small visible version indicator to help debug cache issues
    const versionIndicator = document.createElement('div');
    versionIndicator.style.position = 'fixed';
    versionIndicator.style.bottom = '2px';
    versionIndicator.style.right = '2px';
    versionIndicator.style.fontSize = '8px';
    versionIndicator.style.color = '#aaa';
    versionIndicator.style.zIndex = '9999';
    versionIndicator.textContent = `v1.0.5`;
    document.body.appendChild(versionIndicator);
    
    window.addEventListener('pageshow', handlePageShow);
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      document.body.removeChild(versionIndicator);
    };
  }, []);
  
  return null;
};

export default VersionChecker;
