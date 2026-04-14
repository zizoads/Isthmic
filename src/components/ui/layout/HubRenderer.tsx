import React from 'react';
import { AgentType, Domain, PlatformStats } from '../../../types';
import { useNavigation } from '../../../context/NavigationContext';
import { BrandForgeHub } from '../BrandForgeHub';
import { UserProfileHub } from '../hubs/UserProfileHub';
import AdminHub from '../hubs/AdminHub';

import { BrandIntelligenceHub } from '../hubs/BrandIntelligenceHub';
import { ConceptLabHub } from '../hubs/ConceptLabHub';

interface HubRendererProps {
  domains: Domain[];
  stats: PlatformStats;
  addLog: (agent: string, message: string, type?: 'info' | 'success' | 'warning' | 'critical', payload?: any) => void;
}

const HubRenderer: React.FC<HubRendererProps> = () => {
  const { activeHub } = useNavigation();

  switch (activeHub) {
    case AgentType.BRAND_INTELLIGENCE:
      return <BrandForgeHub />;
    case AgentType.USER_PROFILE:
      return <UserProfileHub />;
    case AgentType.ADMIN_CONTROL:
      return <AdminHub />;
    case AgentType.ALPHA_MINE:
      return <BrandIntelligenceHub />;
    case AgentType.CONCEPT_LAB:
      return <ConceptLabHub trends={[]} />;
    default:
      return (
        <div className="p-8 flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-white">System Hub</h2>
            <p className="text-slate-400">System is currently undergoing maintenance.</p>
          </div>
        </div>
      );
  }
};

export default HubRenderer;
