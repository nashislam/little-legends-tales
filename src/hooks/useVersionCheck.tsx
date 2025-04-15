
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
  interval: number = 15000, // Default to 15 seconds
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
        console.log(`Checking version: current=${currentVersion}, latest=${data.version}`);
        
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
              
              // Force reload with cache clearing
              window.location.href = window.location.href.split('?')[0] + 
                '?cache=' + Date.now();
            }, 1000);
          } else {
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
    return () => clearInterval(intervalId);
  }, [interval, showToast]);
};
