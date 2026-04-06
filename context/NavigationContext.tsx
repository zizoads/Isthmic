import React, { createContext, useContext, useState } from 'react';
import { AgentType } from '../types';

interface NavigationContextType {
  activeHub: AgentType;
  setActiveHub: (hub: AgentType) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeHub, setActiveHub] = useState<AgentType>(AgentType.INTELLIGENCE);
  
  return (
    <NavigationContext.Provider value={{ activeHub, setActiveHub }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
