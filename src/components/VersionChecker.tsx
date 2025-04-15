
import { useEffect } from 'react';
import { useVersionCheck } from "@/hooks/useVersionCheck";
import { toast } from "@/components/ui/use-toast";

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
    const handlePageShow = (event: PageTransitionEvent) => {
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

export default VersionChecker;
