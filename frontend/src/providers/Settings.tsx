import React, { createContext, useEffect, useState } from 'react';

interface ContextProps {
  device: 'mobile' | 'desktop';
}

const SettingsContext = createContext<ContextProps | undefined>(undefined);

interface SettingsProps {
  children: React.ReactNode;
}

const SettingsProvider: React.FC<SettingsProps> = ({children}) => {
  function getScreenType() {
    const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    return screenWidth < 1024 ? 'mobile' : 'desktop';
  }

  const [screenType, setScreenType] = useState<'mobile' | 'desktop'>(getScreenType);
  useEffect(() => {
    function handleResize() {
      setScreenType(getScreenType());
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <SettingsContext.Provider value={{ device: screenType }}>
      {children}
    </SettingsContext.Provider>
  );
};

export { SettingsProvider, SettingsContext };
