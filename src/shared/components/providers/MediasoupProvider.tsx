'use client'
import { useMediasoup } from '@/shared/hooks/useMediasoup';
import { createContext, useContext } from 'react';
const MediasoupContext = createContext<ReturnType<typeof useMediasoup> | null>(null);

export const MediasoupProvider = ({ children }: { children: React.ReactNode }) => {
  const mediasoup = useMediasoup();
  return (
    <MediasoupContext.Provider value={mediasoup}>
      {children}
    </MediasoupContext.Provider>
  );
};

export const useMediasoupContext = () => {
  const context = useContext(MediasoupContext);
  if (!context) throw new Error('useMediasoupContext must be used within MediasoupProvider');
  return context;
};