import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, setLogLevel } from 'firebase/firestore';

// Suppress Firestore idle stream warnings
setLogLevel('error');

// Import the Firebase configuration as the source of truth
import firebaseConfigData from './firebase-applet-config.json';

const getEnvVar = (key: string): string | undefined => {
  const meta = import.meta as any;
  if (typeof meta !== 'undefined' && meta.env) {
    return meta.env[key] || meta.env[`VITE_${key}`];
  }
  if (typeof process !== 'undefined' && process.env) {
    return (process.env as any)[key] || (process.env as any)[`VITE_${key}`];
  }
  return undefined;
};

// Merge JSON config with environment variables (env vars take precedence if they exist)
const firebaseConfig = {
  apiKey: getEnvVar('FIREBASE_API_KEY') || getEnvVar('VITE_FIREBASE_API_KEY') || firebaseConfigData.apiKey,
  authDomain: getEnvVar('FIREBASE_AUTH_DOMAIN') || getEnvVar('VITE_FIREBASE_AUTH_DOMAIN') || firebaseConfigData.authDomain,
  projectId: getEnvVar('FIREBASE_PROJECT_ID') || getEnvVar('VITE_FIREBASE_PROJECT_ID') || firebaseConfigData.projectId,
  storageBucket: getEnvVar('FIREBASE_STORAGE_BUCKET') || getEnvVar('VITE_FIREBASE_STORAGE_BUCKET') || firebaseConfigData.storageBucket,
  messagingSenderId: getEnvVar('FIREBASE_MESSAGING_SENDER_ID') || getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID') || firebaseConfigData.messagingSenderId,
  appId: getEnvVar('FIREBASE_APP_ID') || getEnvVar('VITE_FIREBASE_APP_ID') || firebaseConfigData.appId,
  measurementId: getEnvVar('FIREBASE_MEASUREMENT_ID') || getEnvVar('VITE_FIREBASE_MEASUREMENT_ID') || firebaseConfigData.measurementId
};

// Validate required config
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error("FIREBASE_CRITICAL_ERROR: Missing or invalid Firebase configuration. Check firebase-applet-config.json and environment variables.");
}

let auth: any;
let db: any;

try {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  // Use default database if firestoreDatabaseId is "(default)" or not provided
  const dbId = (firebaseConfigData as any).firestoreDatabaseId;
  db = getFirestore(app, dbId === "(default)" ? undefined : dbId);
} catch (error) {
  console.error("FIREBASE_INIT_ERROR: Failed to initialize Firebase. App will run in degraded mode.", error);
  // Provide mock objects with required methods to prevent crashes
  auth = { 
    currentUser: null,
    onAuthStateChanged: (cb: any) => { cb(null); return () => {}; },
    signOut: async () => {},
    signInWithPopup: async () => { throw new Error("Firebase not initialized"); }
  } as any;
  db = {
    type: 'mock'
  } as any;
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
      providerInfo: auth.currentUser?.providerData?.map((provider: any) => ({
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
