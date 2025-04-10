
import { useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

/**
 * Hook to periodically check for app updates by comparing the current version
 * with the version in the version.json file.
 * 
 * @param interval - Interval in milliseconds between checks (default: 60000ms / 1 minute)
 * @param showToast - Whether to show a toast notification when an update is available (default: true)
 */
export const useVersionCheck = (
  interval: number = 60000,
  showToast: boolean = true
) => {
  useEffect(() => {
    // Generate a unique cache-busting parameter
    const cacheBuster = () => `?_=${new Date().getTime()}`;
    
    // Initial version check on mount
    const checkVersion = async () => {
      try {
        // Use cache-busting parameter to ensure fresh response
        const res = await fetch(`/version.json${cacheBuster()}`);
        if (!res.ok) return;
        
        const data = await res.json();
        const currentVersion = localStorage.getItem('appVersion');
        
        // If this is the first load or version has changed
        if (!currentVersion) {
          localStorage.setItem('appVersion', data.version);
        } else if (currentVersion !== data.version) {
          // Version has changed, update localStorage
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

    // Check immediately on mount
    checkVersion();
    
    // Set up interval for periodic checks
    const intervalId = setInterval(checkVersion, interval);
    
    // Clean up the interval on unmount
    return () => clearInterval(intervalId);
  }, [interval, showToast]);
};
