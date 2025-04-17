
import { useEffect } from 'react';
import { useVersionCheck } from "@/hooks/useVersionCheck";
import { toast } from "@/components/ui/use-toast";

const VersionChecker = () => {
  // Check very frequently during troubleshooting - every 10 seconds
  useVersionCheck(10000);
  
  useEffect(() => {
    console.log("VersionChecker mounted - checking for updates and CSS");
    
    // Add a CSS check indicator
    const cssCheckIndicator = document.createElement('div');
    cssCheckIndicator.style.position = 'fixed';
    cssCheckIndicator.style.bottom = '15px';
    cssCheckIndicator.style.right = '2px';
    cssCheckIndicator.style.fontSize = '8px';
    cssCheckIndicator.style.color = '#0000ff';
    cssCheckIndicator.style.zIndex = '10000';
    cssCheckIndicator.textContent = 'CSS ✓';
    document.body.appendChild(cssCheckIndicator);
    
    // Force a quick CSS reload by removing and re-adding stylesheet
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    stylesheets.forEach(sheet => {
      const parent = sheet.parentNode;
      if (parent) {
        const href = sheet.getAttribute('href');
        if (href && !href.includes('fonts.googleapis')) {
          const newSheet = document.createElement('link');
          newSheet.rel = 'stylesheet';
          newSheet.href = href + '?v=' + Date.now();
          parent.replaceChild(newSheet, sheet);
          console.log("Forced reload of stylesheet:", href);
        }
      }
    });
    
    // Create inline style to ensure basic styling is present
    const inlineStyle = document.createElement('style');
    inlineStyle.textContent = `
      body { 
        font-family: 'Open Sans', sans-serif; 
        background-color: #f5fafd;
        color: #2d3748;
      }
      .font-display { 
        font-family: 'Fredoka One', cursive; 
      }
      .bg-legend-blue {
        background-color: #7CC6FE;
      }
      .text-legend-blue {
        color: #7CC6FE;
      }
      .bg-legend-pink {
        background-color: #FF9CC2;
      }
      .text-legend-pink {
        color: #FF9CC2;
      }
    `;
    document.head.appendChild(inlineStyle);
    console.log("Added emergency inline styles");
    
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
    versionIndicator.textContent = `v1.0.7`;
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
    
    // Clear any application caches
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
          console.log('Cache deleted:', cacheName);
        });
      });
    }
    
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      if (document.body.contains(versionIndicator)) {
        document.body.removeChild(versionIndicator);
      }
      if (document.body.contains(cssCheckIndicator)) {
        document.body.removeChild(cssCheckIndicator);
      }
      if (document.head.contains(inlineStyle)) {
        document.head.removeChild(inlineStyle);
      }
    };
  }, []);
  
  return null;
};

export default VersionChecker;
