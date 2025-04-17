
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
  interval: number = 10000, // Check frequently during troubleshooting
  showToast: boolean = true
) => {
  useEffect(() => {
    console.log(`Setting up version check interval: ${interval}ms`);
    
    // Add cache-busting parameter to URL
    const cacheBuster = () => `?_=${Date.now()}-${Math.random()}`;
    
    const checkVersion = async () => {
      try {
        console.log("Checking for application updates...");
        
        // Force bypass of cache
        const res = await fetch(`/version.json${cacheBuster()}`, {
          method: 'GET',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
        
        if (!res.ok) {
          console.warn(`Could not check for updates - version.json not available (${res.status})`);
          return;
        }
        
        const data = await res.json();
        
        // Validate the data has the expected structure
        if (!data || typeof data.version !== 'string') {
          console.error('Invalid version.json format', data);
          return;
        }
        
        const currentVersion = localStorage.getItem('appVersion');
        console.log(`Version check: current=${currentVersion}, latest=${data.version}, buildTime=${data.buildTime}`);
        
        // If first load or version has changed
        if (!currentVersion) {
          localStorage.setItem('appVersion', data.version);
          console.log("First version check - setting initial version");
        } else if (currentVersion !== data.version) {
          // Update stored version
          localStorage.setItem('appVersion', data.version);
          console.log(`Version changed from ${currentVersion} to ${data.version}`);
          
          if (showToast) {
            toast({
              title: "New version available",
              description: "Reloading to get the latest updates...",
              duration: 3000,
            });
            
            // Give the toast time to display before reloading
            setTimeout(() => {
              console.log("Forcing reload to apply updates...");
              
              // Clear browser caches through service worker if available
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(registrations => {
                  registrations.forEach(registration => {
                    registration.update();
                  });
                });
              }
              
              if ('caches' in window) {
                caches.keys().then(names => {
                  names.forEach(name => {
                    caches.delete(name);
                  });
                });
              }
              
              // Force reload with aggressive cache busting
              window.location.href = window.location.href.split('?')[0] + 
                '?fresh=' + Date.now();
            }, 1000);
          } else {
            console.log("Silent reload initiated");
            window.location.reload();
          }
        }
      } catch (error) {
        console.error('Failed to check for app version:', error);
      }
    };

    // Check immediately on component mount
    checkVersion();
    
    // Set interval for periodic checks
    const intervalId = setInterval(checkVersion, interval);
    
    return () => {
      console.log("Cleaning up version check interval");
      clearInterval(intervalId);
    };
  }, [interval, showToast]);
};
