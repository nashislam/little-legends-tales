
import { useEffect } from 'react';
import { useVersionCheck } from "@/hooks/useVersionCheck";
import { toast } from "@/components/ui/use-toast";

const VersionChecker = () => {
  // Check very frequently during troubleshooting - every 10 seconds
  useVersionCheck(10000);
  
  useEffect(() => {
    console.log("VersionChecker mounted - checking for updates");
    
    // Force a version check on first load with aggressive cache busting
    const checkInitialVersion = async () => {
      try {
        // Use a unique timestamp for each request to completely bypass cache
        const cacheBuster = `?_=${Date.now()}-${Math.random()}`;
        const res = await fetch(`/version.json${cacheBuster}`, {
          method: 'GET', // Explicitly set method
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'X-Requested-With': 'XMLHttpRequest' // Some proxies treat XHR differently
          }
        });
        
        if (!res.ok) {
          console.error(`Version check failed: ${res.status} ${res.statusText}`);
          return;
        }
        
        const data = await res.json();
        const storedVersion = localStorage.getItem('appVersion');
        
        console.log('Initial version check:', { 
          stored: storedVersion, 
          latest: data.version,
          buildTime: data.buildTime
        });
        
        if (!storedVersion) {
          localStorage.setItem('appVersion', data.version);
          console.log("First visit - storing version", data.version);
        } else if (storedVersion !== data.version) {
          console.log(`Version changed from ${storedVersion} to ${data.version}`);
          localStorage.setItem('appVersion', data.version);
          
          toast({
            title: "Updated to version " + data.version,
            description: "Application has been updated with the latest features.",
            duration: 5000,
          });
          
          // Force reload to get fresh assets
          console.log("Forcing page reload to apply updates");
          setTimeout(() => {
            // Force hard reload with cache clearing
            window.location.href = window.location.href.split('?')[0] + 
              '?fresh=' + Date.now();
          }, 1500);
        } else {
          console.log("Application is up to date");
        }
      } catch (error) {
        console.error('Initial version check failed:', error);
      }
    };
    
    checkInitialVersion();
    
    // Check if this is a fresh page load (not from bfcache)
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        console.log("Page was restored from back-forward cache, forcing refresh");
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
    versionIndicator.textContent = `v1.0.6`;
    document.body.appendChild(versionIndicator);
    
    window.addEventListener('pageshow', handlePageShow);
    
    // Service worker unregistration to clear any cached assets
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for (let registration of registrations) {
          registration.unregister();
          console.log('Service worker unregistered');
        }
      });
    }
    
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      if (document.body.contains(versionIndicator)) {
        document.body.removeChild(versionIndicator);
      }
    };
  }, []);
  
  return null;
};

export default VersionChecker;
