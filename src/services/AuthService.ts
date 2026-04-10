
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../../firebase';
import { UserProfile } from '../types';

export class AuthService {
  private static googleProvider = new GoogleAuthProvider();

  /**
   * Login with Google
   */
  static async loginWithGoogle(): Promise<UserProfile> {
    try {
      const result = await signInWithPopup(auth, this.googleProvider);
      return await this.syncUserProfile(result.user);
    } catch (error: any) {
      if (error?.code === 'auth/popup-closed-by-user') {
        console.warn("AUTH_LOGIN_CANCELLED: User closed the popup.");
      } else {
        console.error("AUTH_LOGIN_FAILURE:", error);
      }
      throw error;
    }
  }

  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  /**
   * Register with Email and Password
   */
  static async registerWithEmail(email: string, password: string, name: string): Promise<UserProfile> {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      return await this.syncUserProfile(result.user);
    } catch (error) {
      console.error("AUTH_REGISTER_FAILURE:", error);
      throw error;
    }
  }

  /**
   * Login with Email and Password
   */
  static async loginWithEmail(email: string, password: string): Promise<UserProfile> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return await this.syncUserProfile(result.user);
    } catch (error) {
      console.error("AUTH_LOGIN_EMAIL_FAILURE:", error);
      throw error;
    }
  }

  /**
   * Sync Firebase User with Firestore Profile
   */
  static async syncUserProfile(user: User): Promise<UserProfile> {
    const userRef = doc(db, 'users', user.uid);
    
    try {
      const docSnap = await getDoc(userRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      } else {
        // Create new profile
        const newProfile: UserProfile = {
          id: user.uid,
          email: user.email || '',
          name: user.displayName || 'Sovereign User',
          role: user.email === 'zizoadszn@gmail.com' || user.email === 'azeddinebeldjilali9@gmail.com' ? 'Admin' : 'User',
          createdAt: new Date().toISOString(),
          avatar: user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`
        };
        
        await setDoc(userRef, {
          ...newProfile,
          updatedAt: serverTimestamp()
        });
        
        return newProfile;
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      throw error;
    }
  }

  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
      throw error;
    }
  }

  static async logout(): Promise<void> {
    await signOut(auth);
  }

  static onAuthChange(callback: (user: User | null) => void) {
    if (!auth || typeof auth.onAuthStateChanged !== 'function') {
      console.warn("AuthService: Firebase Auth not fully initialized. Using mock listener.");
      callback(null);
      return () => {};
    }
    try {
      return onAuthStateChanged(auth, callback);
    } catch (e) {
      console.error("AuthService: Failed to attach auth listener", e);
      callback(null);
      return () => {};
    }
  }
}
