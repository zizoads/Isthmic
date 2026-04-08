
import React from 'react';
import { AgentType, Domain, PlatformStats } from '../../../types';
import AlphaMineHub from '../hubs/AlphaMineHub';
import { BrandIntelligenceHub } from '../hubs/BrandIntelligenceHub';
import AdminHub from '../hubs/AdminHub';
import { UserProfileHub } from '../hubs/UserProfileHub';
import { useNavigation } from '../../../context/NavigationContext';

interface Props {
  domains: Domain[];
  stats: PlatformStats;
  addLog: (agent: string, message: string, type?: 'info' | 'success' | 'warning' | 'critical', payload?: any) => void;
}

const HubRenderer: React.FC<Props> = ({ 
  domains, stats 
}) => {
  const { activeHub } = useNavigation();

  const renderContent = () => {
    switch (activeHub) {
      case AgentType.ALPHA_MINE:
        return <AlphaMineHub stats={stats} domains={domains} />;
      
      case AgentType.BRAND_INTELLIGENCE:
        return <BrandIntelligenceHub />;

      case AgentType.ADMIN_CONTROL:
        return <AdminHub />;

      case AgentType.USER_PROFILE:
        return <UserProfileHub />;

      default:
        return <AlphaMineHub stats={stats} domains={domains} />;
    }
  };

  return <div className="w-full min-h-screen">{renderContent()}</div>;
};

export default HubRenderer;
