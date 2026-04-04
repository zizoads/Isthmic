
export class StrictLayerEnforcer {
  /**
   * التأكد من نقاء طبقة الـ Domain (يمنع استيراد أي مكاتب خارجية داخل الـ types أو الـ logic الصافي)
   */
  static validateDomainPurity(fileName: string, content: string) {
    const forbiddenPatterns = [
      /import.*from.*'axios'/,
      /import.*from.*'react'/,
      /fetch\(/,
      /localStorage\./
    ];

    for (const pattern of forbiddenPatterns) {
      if (pattern.test(content)) {
        throw new Error(`[LAYER_VIOLATION] Domain purity breached in ${fileName}: Forbidden external dependency detected.`);
      }
    }
  }

  /**
   * مراقبة التبعيات بين الطبقات
   */
  static checkDependency(source: string, target: string) {
    const rules: Record<string, string[]> = {
      'UI': ['APPLICATION', 'DOMAIN'],
      'APPLICATION': ['DOMAIN'],
      'INFRA': ['APPLICATION', 'DOMAIN'],
      'DOMAIN': [] // لا يعتمد على شيء
    };

    if (!rules[source].includes(target)) {
       console.error(`[ARCHITECTURE_WARNING] Invalid dependency: ${source} -> ${target}`);
    }
  }
}
