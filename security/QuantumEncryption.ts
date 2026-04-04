
// 🎖️ Military Quantum Encryption System - TOP SECRET Edition (Stable v2.1)
// ⚠️ Updated: Added Persistence Support

export interface QuantumEncryptedData {
  version: string;
  level: 'CONFIDENTIAL' | 'SECRET' | 'TOP_SECRET';
  iv: string;
  data: string;
  signature: string;
  timestamp: number;
  checksum: string;
}

export class QuantumEncryption {
  private static instance: QuantumEncryption;
  private QUANTUM_SEED: Uint8Array;
  private readonly SEED_STORAGE_KEY = 'isthmic_quantum_anchor_v1';
  
  private constructor() {
    this.QUANTUM_SEED = this.initializePersistentSeed();
    this.selfTest();
  }

  static getInstance(): QuantumEncryption {
    if (!QuantumEncryption.instance) {
      QuantumEncryption.instance = new QuantumEncryption();
    }
    return QuantumEncryption.instance;
  }

  /**
   * ⚓ Anchor Encryption
   * Searches for an old seed in storage, and if not found, creates a new one forever.
   */
  private initializePersistentSeed(): Uint8Array {
    const storedSeed = localStorage.getItem(this.SEED_STORAGE_KEY);
    
    if (storedSeed) {
      try {
        return this.base64ToArray(storedSeed);
      } catch (e) {
        console.error("🚨 [SECURITY] Anchor corrupted. Generating new recovery path.");
      }
    }

    const newSeed = this.generateQuantumSeed();
    localStorage.setItem(this.SEED_STORAGE_KEY, this.arrayToBase64(newSeed));
    return newSeed;
  }

  private generateQuantumSeed(): Uint8Array {
    const seed = new Uint8Array(64);
    crypto.getRandomValues(seed);
    // Add a temporal entropy layer
    const timeBytes = new TextEncoder().encode(Date.now().toString());
    for (let i = 0; i < timeBytes.length; i++) {
      seed[i % seed.length] ^= timeBytes[i];
    }
    return seed;
  }

  async encrypt(data: any, level: QuantumEncryptedData['level'] = 'SECRET'): Promise<QuantumEncryptedData> {
    const dataString = JSON.stringify(data);
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(dataString);
    
    const key = await this.generateLevelKey(level);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv as any,
        additionalData: encoder.encode(level) as any
      },
      key,
      dataBuffer as any
    );

    const signature = await this.quantumSign(encrypted, level);

    return {
      version: 'QUANTUM-2.0',
      level: level,
      iv: this.arrayToBase64(iv),
      data: this.arrayToBase64(new Uint8Array(encrypted)),
      signature: this.arrayToBase64(new Uint8Array(signature)),
      timestamp: Date.now(),
      checksum: await this.generateChecksum(encrypted)
    };
  }

  async decrypt(encryptedData: QuantumEncryptedData): Promise<any> {
    if (encryptedData.version !== 'QUANTUM-2.0') {
      throw new Error('ENCRYPTION_VERSION_MISMATCH');
    }

    const dataArray = this.base64ToArray(encryptedData.data);
    const isValid = await this.verifySignature(
      dataArray.buffer as ArrayBuffer,
      this.base64ToArray(encryptedData.signature).buffer as ArrayBuffer,
      encryptedData.level
    );
    
    if (!isValid) throw new Error('QUANTUM_SIGNATURE_INVALID');

    const checksum = await this.generateChecksum(dataArray.buffer as ArrayBuffer);
    if (checksum !== encryptedData.checksum) throw new Error('DATA_CORRUPTION_DETECTED');

    const key = await this.generateLevelKey(encryptedData.level);
    const iv = this.base64ToArray(encryptedData.iv);

    try {
      const decrypted = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv as any,
          additionalData: new TextEncoder().encode(encryptedData.level)
        },
        key,
        dataArray as any
      );

      return JSON.parse(new TextDecoder().decode(decrypted));
    } catch (e) {
      throw new Error('DECRYPTION_FAILED: Possibly due to key rotation or tampering.');
    }
  }

  private async generateLevelKey(level: string): Promise<CryptoKey> {
    const baseKey = await crypto.subtle.importKey(
      'raw', this.QUANTUM_SEED as any, 'PBKDF2', false, ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new TextEncoder().encode(`SALT_${level}`),
        iterations: level === 'TOP_SECRET' ? 500000 : 100000,
        hash: 'SHA-512'
      },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  private async quantumSign(data: ArrayBuffer, _level: string): Promise<ArrayBuffer> {
    const signKey = await crypto.subtle.importKey(
      'raw', this.QUANTUM_SEED as any, { name: 'HMAC', hash: 'SHA-512' } as any, false, ['sign']
    );
    return crypto.subtle.sign('HMAC', signKey, data);
  }

  private async verifySignature(data: ArrayBuffer, signature: ArrayBuffer, _level: string): Promise<boolean> {
    const signKey = await crypto.subtle.importKey(
      'raw', this.QUANTUM_SEED as any, { name: 'HMAC', hash: 'SHA-512' } as any, false, ['verify']
    );
    return crypto.subtle.verify('HMAC', signKey, signature, data);
  }

  private async generateChecksum(data: ArrayBuffer): Promise<string> {
    const hash = await crypto.subtle.digest('SHA-512', data);
    return this.arrayToBase64(new Uint8Array(hash));
  }

  private arrayToBase64(array: Uint8Array): string {
    return btoa(String.fromCharCode(...array));
  }

  private base64ToArray(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  private async selfTest(): Promise<void> {
    try {
      const test = { msg: 'TEST_STABILITY' };
      const enc = await this.encrypt(test);
      const dec = await this.decrypt(enc);
      if (dec.msg !== 'TEST_STABILITY') throw new Error('STABILITY_FAIL');
      console.log('✅ Quantum Engine Persistent State: STABLE');
    } catch (e) {
      console.error('🚨 Quantum Engine Persistent State: UNSTABLE', e);
    }
  }
}

export const QuantumCrypto = QuantumEncryption.getInstance();
