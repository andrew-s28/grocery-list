// User storage utility with fallback from localStorage to cookies
export const userStorage = {
  set: (name: string, value: string) => {
    try {
      // Try localStorage first (more reliable for development)
      if (typeof Storage !== 'undefined') {
        localStorage.setItem(name, value);
        return;
      }
    } catch (e) {
      // Fallback to cookies if localStorage fails
    }
    
    // Fallback to cookies
    try {
      const expires = new Date();
      expires.setTime(expires.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days
      const cookieString = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
      document.cookie = cookieString;
    } catch (e) {
      console.error('Failed to save user data:', e);
    }
  },

  get: (name: string): string | null => {
    // Try localStorage first
    try {
      if (typeof Storage !== 'undefined') {
        const value = localStorage.getItem(name);
        if (value !== null) {
          return value;
        }
      }
    } catch (e) {
      // Fallback to cookies if localStorage fails
    }
    
    // Fallback to cookies
    try {
      const nameEQ = `${name}=`;
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) {
          return decodeURIComponent(c.substring(nameEQ.length));
        }
      }
    } catch (e) {
      console.error('Failed to retrieve user data:', e);
    }
    
    return null;
  },

  remove: (name: string) => {
    // Remove from localStorage
    try {
      if (typeof Storage !== 'undefined') {
        localStorage.removeItem(name);
      }
    } catch (e) {
      // Continue to cookies even if localStorage fails
    }
    
    // Remove from cookies
    try {
      const cookieString = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax`;
      document.cookie = cookieString;
    } catch (e) {
      console.error('Failed to remove user data:', e);
    }
  }
};

// Keep the old cookies export for backward compatibility
export const cookies = userStorage;
