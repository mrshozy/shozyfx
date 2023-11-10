import React, {createContext, useEffect, useState} from 'react';


interface ContextType {

}

const SettingsContext = createContext<ContextType | undefined>(undefined);
interface SettingsProps {
    children: React.ReactNode
}

const Settings: React.FC<SettingsProps> = ({children}) => {

  return (
    <SettingsContext.Provider value={{}}>
        {children}
    </SettingsContext.Provider>
  );
};

export {Settings, SettingsContext};
