export class SecurityOperationsCenter {
  private isMonitoring = false;

  startMonitoring() {
    if (this.isMonitoring) return;
    this.isMonitoring = true;
    console.log('📡 [SOC] Security Operations Center monitoring active.');
    
    // Basic monitoring of unhandled rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('🚨 [SOC] Unhandled Promise Rejection Detected:', event.reason);
    });

    // Basic monitoring of global errors
    window.addEventListener('error', (event) => {
      console.error('🚨 [SOC] Global Error Detected:', event.message, 'at', event.filename, ':', event.lineno);
    });
  }

  stopMonitoring() {
    this.isMonitoring = false;
    console.log('📡 [SOC] Security Operations Center monitoring stopped.');
  }
}

export const SOC = new SecurityOperationsCenter();
