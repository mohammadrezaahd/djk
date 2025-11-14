// Safe localStorage access for SSR environments
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  },
  
  setItem: (key: string, value: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  },
  
  removeItem: (key: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  },
  
  clear: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  }
};

// Helper to check if we're on the client side
export const isClient = () => typeof window !== 'undefined';