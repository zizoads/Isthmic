import React, { createContext, useContext, useState } from 'react';
import { AgentType } from '../types';

interface NavigationContextType {
  activeHub: AgentType;
  setActiveHub: (hub: AgentType) => void;
}

export const NavigationContext = createContext<NavigationContextType>({
  activeHub: AgentType.BRAND_INTELLIGENCE,
  setActiveHub: () => {}
});

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeHub, setActiveHub] = useState<AgentType>(AgentType.BRAND_INTELLIGENCE);

  return (
    <NavigationContext.Provider value={{ activeHub, setActiveHub }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
