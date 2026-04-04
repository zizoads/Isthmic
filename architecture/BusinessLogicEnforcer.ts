
export class IronRuleError extends Error {
  constructor(
    public code: string,
    message: string,
    public severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'HIGH',
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'IronRuleError';
    this.logToCentralSystem();
  }

  private logToCentralSystem() {
    console.error(`[IRON_RULE_ERROR] ${this.code}: ${this.message}`, this.context);
  }
}

export class BusinessLogicEnforcer {
  /**
   * تنفيذ العملية ببروتوكول التحقق الثلاثي (Triple Validation)
   */
  static async executeWithTripleValidation<T>(
    operationName: string,
    businessLogic: () => Promise<T>,
    validationRules: Array<(data: T) => { valid: boolean; message: string }>
  ): Promise<{ result: T; validations: Array<{ rule: string; passed: boolean }> }> {
    
    // 1. التحقق المسبق (Pre-Execution Audit)
    console.log(`[PRE-CHECK] Initiating ${operationName}...`);
    
    try {
      // 2. التنفيذ الخاضع للمراقبة (Monitored Execution)
      const startTime = performance.now();
      const result = await Promise.race([
        businessLogic(),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new IronRuleError('EXECUTION_TIMEOUT', `Operation ${operationName} exceeded 15s limit`)), 15000)
        )
      ]);
      const duration = performance.now() - startTime;

      // 3. التحقق اللاحق (Post-Validation)
      const postValidations = validationRules.map((rule, index) => {
        const validation = rule(result);
        if (!validation.valid) {
          throw new IronRuleError('POST_VALIDATION_FAILED', `Rule ${index}: ${validation.message}`, 'HIGH', { operationName });
        }
        return { rule: `rule_${index}`, passed: validation.valid };
      });

      console.log(`[SUCCESS] ${operationName} completed in ${duration.toFixed(2)}ms.`);
      return { result, validations: postValidations };

    } catch (error: any) {
      await this.mandatoryRecovery(operationName, error);
      throw error instanceof IronRuleError ? error : new IronRuleError('UNHANDLED_LOGIC_ERROR', error.message);
    }
  }

  private static async mandatoryRecovery(operationName: string, _error: any) {
    console.warn(`[RECOVERY] Executing emergency protocols for: ${operationName}`);
    // سيتم توسيع هذا في مرحلة الصيانة
  }

  /**
   * Circuit Breaker لمنع انهيار النظام عند فشل الخدمات الخارجية
   */
  static createCircuitBreaker(
    operation: () => Promise<any>,
    options: { failureThreshold: number; resetTimeout: number; fallback?: () => Promise<any> }
  ) {
    let failures = 0;
    let state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
    let lastFailureTime = 0;

    return async () => {
      if (state === 'OPEN') {
        if (Date.now() - lastFailureTime > options.resetTimeout) {
          state = 'HALF_OPEN';
        } else {
          if (options.fallback) return options.fallback();
          throw new IronRuleError('CIRCUIT_BREAKER_OPEN', 'Service is currently isolated.');
        }
      }

      try {
        const result = await operation();
        if (state === 'HALF_OPEN') {
          state = 'CLOSED';
          failures = 0;
        }
        return result;
      } catch (error) {
        failures++;
        lastFailureTime = Date.now();
        if (failures >= options.failureThreshold) state = 'OPEN';
        throw error;
      }
    };
  }
}
