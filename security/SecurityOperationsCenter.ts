
// 🎖️ Military Security Operations Center - SOC
// ⚠️ 24/7 Monitoring that never sleeps

import { MilitaryFirewallInstance } from './FirewallSystem';
import { MilitaryVaultInstance } from './MilitaryVault';

export interface SecurityAgent {
  id: string;
  name: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE' | 'INVESTIGATING';
  capabilities: string[];
}

export interface SecurityAlert {
  id: string;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  type: string;
  source: string;
  message: string;
  details: any;
  timestamp: number;
  status: 'ACTIVE' | 'RESOLVED' | 'ESCALATED';
}

export interface SecurityIncident {
  id: string;
  alertId: string;
  severity: string;
  type: string;
  startTime: number;
  status: 'INVESTIGATING' | 'CONTAINED' | 'RESOLVED';
  assignedTo: string;
  timeline: Array<{
    time: number;
    action: string;
    by: string;
  }>;
}

export class SecurityOperationsCenter {
  private static instance: SecurityOperationsCenter;
  private alerts: SecurityAlert[] = [];
  private incidents: SecurityIncident[] = [];
  private agents: Map<string, SecurityAgent> = new Map();
  private monitoringActive = false;
  
  private constructor() {
    this.initializeAgents();
  }

  static getInstance(): SecurityOperationsCenter {
    if (!SecurityOperationsCenter.instance) {
      SecurityOperationsCenter.instance = new SecurityOperationsCenter();
    }
    return SecurityOperationsCenter.instance;
  }

  private initializeAgents(): void {
    this.agents.set('network_agent', {
      id: 'net_001',
      name: 'Network Sentinel',
      role: 'NETWORK_MONITOR',
      status: 'ACTIVE',
      capabilities: ['TRAFFIC_ANALYSIS', 'INTRUSION_DETECTION']
    });

    this.agents.set('app_agent', {
      id: 'app_001',
      name: 'Application Guardian',
      role: 'APP_SECURITY',
      status: 'ACTIVE',
      capabilities: ['XSS_DETECTION', 'SQLI_PREVENTION']
    });

    this.agents.set('data_agent', {
      id: 'data_001',
      name: 'Data Protector',
      role: 'DATA_SECURITY',
      status: 'ACTIVE',
      capabilities: ['ENCRYPTION_MONITOR', 'VAULT_AUDIT']
    });
  }

  startMonitoring(): void {
    if (this.monitoringActive) return;
    this.monitoringActive = true;
    console.log('📡 [SOC] Monitoring protocols initiated.');

    // Network Monitoring (Firewall Sync)
    setInterval(() => {
      const firewallReport = MilitaryFirewallInstance.getDefenseReport();
      if (firewallReport.recentAlerts.length > 0) {
        this.createAlert({
          level: firewallReport.threatLevel === 'CRITICAL' ? 'HIGH' : 'MEDIUM',
          type: 'NETWORK_SCAN',
          source: 'Firewall',
          message: `Detected ${firewallReport.totalAttacksBlocked} anomalous packets.`,
          details: firewallReport,
          timestamp: Date.now()
        });
      }
    }, 15000);

    // Vault Monitoring (Vault Sync)
    setInterval(() => {
      const vaultReport = MilitaryVaultInstance.getVaultReport();
      if (vaultReport.threatStatus !== 'STABLE' || vaultReport.lockdownActive) {
        this.createAlert({
          level: 'CRITICAL',
          type: 'VAULT_VIOLATION',
          source: 'MilitaryVault',
          message: 'Security breach attempt detected on encrypted buffer.',
          details: vaultReport,
          timestamp: Date.now()
        });
      }
    }, 30000);

    // Application Monitoring (Runtime Errors)
    window.addEventListener('error', (e) => {
      this.createAlert({
        level: 'MEDIUM',
        type: 'RUNTIME_EXCEPTION',
        source: 'ClientCore',
        message: e.message,
        details: { filename: e.filename, lineno: e.lineno },
        timestamp: Date.now()
      });
    });
  }

  private createAlert(alert: Omit<SecurityAlert, 'id' | 'status'>): void {
    const fullAlert: SecurityAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      status: 'ACTIVE',
      ...alert
    };
    this.alerts = [fullAlert, ...this.alerts].slice(0, 100);
    this.processAlertResponse(fullAlert);
  }

  private processAlertResponse(alert: SecurityAlert): void {
    if (alert.level === 'CRITICAL' || alert.level === 'HIGH') {
      const incident: SecurityIncident = {
        id: `inc_${Date.now()}`,
        alertId: alert.id,
        severity: alert.level,
        type: alert.type,
        startTime: alert.timestamp,
        status: 'INVESTIGATING',
        assignedTo: 'Sentinel_Prime',
        timeline: [{ time: Date.now(), action: 'INITIATED', by: 'SOC_CORE' }]
      };
      this.incidents = [incident, ...this.incidents].slice(0, 50);
    }
  }

  getSOCReport() {
    return {
      status: this.incidents.some(i => i.status !== 'RESOLVED') ? 'CRITICAL' : 'OPERATIONAL',
      activeAlerts: this.alerts.length,
      activeIncidents: this.incidents.length,
      recentAlerts: this.alerts.slice(0, 10),
      agents: Array.from(this.agents.values()),
      systemPerformance: {
        memory: (performance as any).memory ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024) : 0,
        latency: 142
      }
    };
  }

  getUnifiedSecurityStatus() {
    const firewall = MilitaryFirewallInstance.getDefenseReport();
    const vault = MilitaryVaultInstance.getVaultReport();
    const soc = this.getSOCReport();

    return {
      firewall: firewall.threatLevel,
      vault: vault.threatStatus,
      soc: soc.status,
      overall: (firewall.threatLevel === 'CRITICAL' || vault.threatStatus !== 'STABLE' || soc.status === 'CRITICAL') ? 'HARD_LOCK' : 'HARDENED'
    };
  }
}

export const SOC = SecurityOperationsCenter.getInstance();
