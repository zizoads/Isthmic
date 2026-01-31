
import { Domain, IntelligenceReport, PlatformStats, ReportSection } from '../types';

export class ReportService {
  static assembleBriefing(stats: PlatformStats, domains: Domain[], sections: string[]): Partial<IntelligenceReport> {
    const reportSections: ReportSection[] = [
      { id: 'financials', title: 'Financial Ledger', included: sections.includes('financials'), content: stats },
      { id: 'assets', title: 'Asset Inventory', included: sections.includes('assets'), content: domains },
      { id: 'forensics', title: 'Forensic DNA Audit', included: sections.includes('forensics'), content: domains.map(d => d.technicalMetrics) }
    ];

    return {
      id: `SIB-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'synthesized',
      sections: reportSections
    };
  }

  static async exportToCSV(domains: Domain[]) {
    const headers = ['Name', 'Price', 'Status', 'Sector', 'Integrity'];
    const rows = domains.map(d => [d.name, d.price, d.status, d.sector, d.integrityScore]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `isthmic_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  static printDossier() {
    window.print();
  }
}
