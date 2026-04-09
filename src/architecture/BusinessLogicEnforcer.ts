export class BusinessLogicEnforcer {
  static async executeWithTripleValidation<T>(
    operationName: string,
    operation: () => Promise<T>,
    validators?: Array<(res: T) => { valid: boolean; message: string }>
  ): Promise<{ result: T }> {
    console.log(`🛡️ [BUSINESS_LOGIC] Executing ${operationName} with validation...`);
    try {
      const result = await operation();
      
      if (validators) {
        for (const validator of validators) {
          const { valid, message } = validator(result);
          if (!valid) {
            throw new Error(`Validation failed: ${message}`);
          }
        }
      }

      console.log(`🛡️ [BUSINESS_LOGIC] ${operationName} validated successfully.`);
      return { result };
    } catch (error) {
      console.error(`❌ [BUSINESS_LOGIC] Validation failed for ${operationName}:`, error);
      throw error;
    }
  }
}
