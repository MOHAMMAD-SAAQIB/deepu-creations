import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface IntroContextType {
  showIntro: boolean;
  replayTrigger: number;
  restartIntro: () => void;
  completeIntro: () => void;
}

const IntroContext = createContext<IntroContextType | undefined>(undefined);

export const IntroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Only show the 3D yarn ball entrance overlay on the storefront homepage ('/')
  // Direct navigation to /admin/login, /contact, etc. opens directly without blocking
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname === '/';
    }
    return false;
  });
  const [replayTrigger, setReplayTrigger] = useState<number>(1);
  const lastClickTimeRef = useRef<number>(0);
  const navigate = useNavigate();

  const restartIntro = useCallback(() => {
    const now = Date.now();
    // Debounce rapid overlapping clicks (within 600ms)
    if (now - lastClickTimeRef.current < 600) {
      return;
    }
    lastClickTimeRef.current = now;

    // Navigate to homepage if on another route
    if (window.location.pathname !== '/') {
      navigate('/');
    }

    // Reset timeline & restart sequence cleanly
    setReplayTrigger((prev) => prev + 1);
    setShowIntro(true);
  }, [navigate]);

  const completeIntro = useCallback(() => {
    setShowIntro(false);
  }, []);

  return (
    <IntroContext.Provider
      value={{
        showIntro,
        replayTrigger,
        restartIntro,
        completeIntro,
      }}
    >
      {children}
    </IntroContext.Provider>
  );
};

export const useIntro = () => {
  const context = useContext(IntroContext);
  if (!context) {
    throw new Error('useIntro must be used within an IntroProvider');
  }
  return context;
};
