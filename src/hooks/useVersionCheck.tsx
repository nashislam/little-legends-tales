
import { useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

/**
 * Hook to check for app updates by comparing the current version
 * with the version in the version.json file.
 * 
 * @param interval - Interval in milliseconds between checks
 * @param showToast - Whether to show a toast notification when an update is available
 */
export const useVersionCheck = (
  interval: number = 30000, // More frequent checks (30 seconds)
  showToast: boolean = true
) => {
  useEffect(() => {
    // Add cache-busting parameter to URL
    const cacheBuster = () => `?_=${Date.now()}`;
    
    const checkVersion = async () => {
      try {
        // Force bypass of cache
        const res = await fetch(`/version.json${cacheBuster()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        if (!res.ok) {
          console.warn('Could not check for updates - version.json not available');
          return;
        }
        
        const data = await res.json();
        
        // Validate the data has the expected structure
        if (!data || typeof data.version !== 'string') {
          console.error('Invalid version.json format');
          return;
        }
        
        const currentVersion = localStorage.getItem('appVersion');
        console.log('Current version:', currentVersion, 'Server version:', data.version);
        
        // If first load or version has changed
        if (!currentVersion) {
          localStorage.setItem('appVersion', data.version);
        } else if (currentVersion !== data.version) {
          // Update stored version
          localStorage.setItem('appVersion', data.version);
          
          if (showToast) {
            toast({
              title: "New version available",
              description: "Reloading to get the latest updates...",
              duration: 3000,
            });
            
            // Give the toast time to display before reloading
            setTimeout(() => {
              // Clear cache before reload
              clearBrowserCache();
              window.location.reload(true); // Force reload from server
            }, 2000);
          } else {
            clearBrowserCache();
            window.location.reload(true); // Force reload from server
          }
        }
      } catch (error) {
        console.error('Failed to check for app version:', error);
      }
    };

    // Clear browser cache function
    const clearBrowserCache = () => {
      // Clear application cache if available
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => {
            caches.delete(name);
          });
        });
      }
      
      // Clear local storage except appVersion
      const appVersion = localStorage.getItem('appVersion');
      localStorage.clear();
      if (appVersion) {
        localStorage.setItem('appVersion', appVersion);
      }
      
      // Try to clear session storage
      try {
        sessionStorage.clear();
      } catch (e) {
        console.warn('Could not clear session storage', e);
      }
    };

    // Check immediately on component mount
    checkVersion();
    // Set interval for periodic checks
    const intervalId = setInterval(checkVersion, interval);
    return () => clearInterval(intervalId);
  }, [interval, showToast]);
};
