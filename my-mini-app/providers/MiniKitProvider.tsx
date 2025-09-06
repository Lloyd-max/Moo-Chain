'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Define what your MiniKit context will store
type MiniKitContextType = {
  isReady: boolean;
  setReady: (ready: boolean) => void;
};

// Create the context
const MiniKitContext = createContext<MiniKitContextType | undefined>(undefined);

// Context Provider component
export const MiniKitContextProvider = ({ children }: { children: ReactNode }) => {
  const [isReady, setReady] = useState(false);

  return (
    <MiniKitContext.Provider value={{ isReady, setReady }}>
      {children}
    </MiniKitContext.Provider>
  );
};

// Custom hook for using the context
export const useMiniKit = () => {
  const context = useContext(MiniKitContext);
  if (!context) {
    throw new Error('useMiniKit must be used within a MiniKitContextProvider');
  }
  return context;
};
