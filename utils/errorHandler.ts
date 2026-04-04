
export class SovereignError extends Error {
  constructor(
    public code: string,
    message: string,
    public retryable: boolean = false,
    public metadata?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'SovereignError';
  }
}

export const ErrorCodes = {
  // Auth Errors
  AUTH_INVALID_CREDENTIALS: 'AUTH_001',
  AUTH_SESSION_EXPIRED: 'AUTH_002',
  AUTH_UNAUTHORIZED: 'AUTH_003',
  
  // API Errors
  API_RATE_LIMIT: 'API_001',
  API_TIMEOUT: 'API_002',
  API_INVALID_RESPONSE: 'API_003',
  
  // Network Errors
  NETWORK_OFFLINE: 'NET_001',
  NETWORK_TIMEOUT: 'NET_002',
  
  // Data Errors
  DATA_VALIDATION: 'DATA_001',
  DATA_NOT_FOUND: 'DATA_002',
  
  // System Errors
  SYSTEM_UNKNOWN: 'SYS_001',
  SYSTEM_MAINTENANCE: 'SYS_002',
} as const;

export const handleError = (error: unknown): SovereignError => {
  if (error instanceof SovereignError) {
    return error;
  }

  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    
    // Network errors
    if (msg.includes('fetch') || msg.includes('network')) {
      return new SovereignError(
        ErrorCodes.NETWORK_OFFLINE,
        'Connection lost. Please check your internet connection.',
        true
      );
    }

    // Timeout errors
    if (msg.includes('timeout') || msg.includes('abort')) {
      return new SovereignError(
        ErrorCodes.API_TIMEOUT,
        'Request timed out. Please try again.',
        true
      );
    }

    // Rate limit
    if (msg.includes('rate limit') || msg.includes('429')) {
      return new SovereignError(
        ErrorCodes.API_RATE_LIMIT,
        'Too many requests. High demand on Sovereign nodes. Please wait.',
        true
      );
    }

    // Default
    return new SovereignError(
      ErrorCodes.SYSTEM_UNKNOWN,
      error.message || 'An unexpected error occurred.',
      false
    );
  }

  return new SovereignError(
    ErrorCodes.SYSTEM_UNKNOWN,
    'An unrecognized error occurred.',
    false
  );
};

export const getErrorMessage = (code: string): string => {
  const messages: Record<string, string> = {
    [ErrorCodes.AUTH_INVALID_CREDENTIALS]: 'Invalid credentials.',
    [ErrorCodes.AUTH_SESSION_EXPIRED]: 'Session expired. Re-authenticate.',
    [ErrorCodes.API_RATE_LIMIT]: 'Slow down. AI neurons need cooling.',
    [ErrorCodes.NETWORK_OFFLINE]: 'System offline. Check uplink.',
  };
  
  return messages[code] || 'Structural instability detected.';
};
