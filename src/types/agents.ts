
export enum AgentType { 
  ALPHA_MINE = 'ALPHA_MINE',
  BRAND_INTELLIGENCE = 'BRAND_INTELLIGENCE',
  ADMIN_CONTROL = 'ADMIN_CONTROL',
  USER_PROFILE = 'USER_PROFILE',
  
  // Legacy Aliases
  INTELLIGENCE = 'ALPHA_MINE',
  ACQUISITION = 'ALPHA_MINE',
  ADMIN = 'ADMIN_CONTROL',
  WORKFLOW = 'ALPHA_MINE',
  EXECUTIVE = 'ALPHA_MINE',
  SOVEREIGN_INTELLIGENCE = 'ALPHA_MINE'
}

export enum AgentRole {
  ANALYZER = 'ANALYZER',
  EXECUTOR = 'EXECUTOR',
  STRATEGIST = 'STRATEGIST',
  AUDITOR = 'AUDITOR',
  PLANNER = 'PLANNER'
}

export interface AgentThought {
  role: AgentRole | string;
  message: string;
  timestamp: string;
  status: 'thinking' | 'resolved';
}

export interface SystemThought {
  id: string;
  agent: string;
  thought: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
}
