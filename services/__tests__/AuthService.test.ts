
import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from '../AuthService';
import { SovereignShield } from '../SovereignShield';
import { UserProfile } from '../../types';

describe('AuthService', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it('should create a profile during signup', async () => {
    const result = await AuthService.signup('Test User', 'test@example.com', 'pass123');

    expect(result.success).toBe(true);
    
    const stored = await SovereignShield.recover<UserProfile>('profile');
    expect(stored?.email).toBe('test@example.com');
    expect(stored?.name).toBe('Test User');
  });

  it('should verify OTP correctly', async () => {
    const isValid = await AuthService.verify('user-123', 'test@example.com', '123456');
    expect(isValid).toBe(true);
  });
});
