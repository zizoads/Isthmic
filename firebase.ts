import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

const getEnvVar = (key: string) => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || import.meta.env[`VITE_${key}`];
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || process.env[`VITE_${key}`];
  }
  return undefined;
};

const firebaseConfig = {
  apiKey: getEnvVar('FIREBASE_API_KEY') || getEnvVar('VITE_FIREBASE_API_KEY'),
  authDomain: getEnvVar('FIREBASE_AUTH_DOMAIN') || getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('FIREBASE_PROJECT_ID') || getEnvVar('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('FIREBASE_STORAGE_BUCKET') || getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('FIREBASE_MESSAGING_SENDER_ID') || getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('FIREBASE_APP_ID') || getEnvVar('VITE_FIREBASE_APP_ID'),
  measurementId: getEnvVar('FIREBASE_MEASUREMENT_ID') || getEnvVar('VITE_FIREBASE_MEASUREMENT_ID')
};

// Validate required config
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error("FIREBASE_CRITICAL_ERROR: Missing required Firebase configuration. Check environment variables.");
}

let app;
let auth: any;
let db: any;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  // Use default database if firestoreDatabaseId is "(default)" or not provided
  db = getFirestore(app);
} catch (error) {
  console.error("FIREBASE_INIT_ERROR: Failed to initialize Firebase. App will run in degraded mode.", error);
  // Provide mock objects to prevent immediate crashes in components
  auth = { currentUser: null } as any;
  db = {} as any;
}

export { auth, db };

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    if (!db || !db.type) {
      console.warn("Skipping Firebase connection test: db is not fully initialized.");
      return;
    }
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. The client is offline.");
    }
    // Skip logging for other errors, as this is simply a connection test.
  }
}

if (typeof window !== 'undefined') {
  testConnection();
}
