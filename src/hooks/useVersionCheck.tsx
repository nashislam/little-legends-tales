
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
  interval: number = 30000,
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
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (!res.ok) return;
        
        const data = await res.json();
        const currentVersion = localStorage.getItem('appVersion');
        
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
              window.location.reload();
            }, 2000);
          } else {
            window.location.reload();
          }
        }
      } catch (error) {
        console.error('Failed to check for app version:', error);
      }
    };

    // Check immediately and set interval
    checkVersion();
    const intervalId = setInterval(checkVersion, interval);
    return () => clearInterval(intervalId);
  }, [interval, showToast]);
};
