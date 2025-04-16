import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup,
  User,
  signInWithCustomToken
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import app, { db } from '../firebase';
import toast from 'react-hot-toast';
import AuthError from '../components/AuthError';

// Initialize auth with error handling
let auth;
try {
  auth = getAuth(app);
} catch (error) {
  console.error("Auth initialization error:", error);
  auth = { currentUser: null } as any;
}

interface UserData {
  uid: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  companyRole?: string;
  registrationDate: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  error: Error | null;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string, userData: Partial<UserData>) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  loginWithUID: (uid: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);
const googleProvider = new GoogleAuthProvider();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.error('useAuth must be used within an AuthProvider');
    // Return a fallback context instead of throwing
    return {
      user: null,
      userData: null,
      loading: false,
      error: new Error('AuthProvider not found'),
      login: async () => {
        toast.error('Authentication not available');
      },
      signup: async () => {
        toast.error('Authentication not available');
      },
      signInWithGoogle: async () => {
        toast.error('Authentication not available');
      },
      loginWithUID: async () => {
        toast.error('Authentication not available');
      },
      logout: async () => {
        toast.error('Authentication not available');
      },
      updateUserData: async () => {
        toast.error('Authentication not available');
      },
    } as AuthContextType;
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadUserData = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data() as UserData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setError(error as Error);
    }
  };

  useEffect(() => {
    let unsubscribe = () => {};
    
    try {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        try {
          setUser(user);
          if (user) {
            await loadUserData(user.uid);
          } else {
            setUserData(null);
          }
        } catch (err) {
          console.error('Error in auth state change:', err);
          setError(err as Error);
        } finally {
          setLoading(false);
        }
      }, (err) => {
        console.error('Auth state change error:', err);
        setError(err);
        setLoading(false);
      });
    } catch (err) {
      console.error('Setting up auth state listener failed:', err);
      setError(err as Error);
      setLoading(false);
    }

    // Ensure loading is set to false after a timeout (failsafe)
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('Auth loading timeout reached');
        setLoading(false);
      }
    }, 5000);

    return () => {
      clearTimeout(timeout);
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const login = async (emailOrUsername: string, password: string) => {
    try {
      let email = emailOrUsername;
      
      // If input doesn't look like an email, try to find the email by username
      if (!emailOrUsername.includes('@')) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('username', '==', emailOrUsername));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          throw new Error('Username not found');
        }
        
        email = querySnapshot.docs[0].data().email;
      }
      
      const result = await signInWithEmailAndPassword(auth, email, password);
      await loadUserData(result.user.uid);
      toast.success('Successfully logged in!');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    }
  };

  const signup = async (email: string, username: string, password: string, additionalData: Partial<UserData>) => {
    try {
      // Check if username is already taken
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        throw new Error('Username is already taken');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userData: UserData = {
        uid: userCredential.user.uid,
        email,
        username,
        registrationDate: new Date().toISOString(),
        ...additionalData
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      setUserData(userData);
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const updateUserData = async (data: Partial<UserData>) => {
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { ...userData, ...data }, { merge: true });
      setUserData(prev => prev ? { ...prev, ...data } : null);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error('Failed to update profile');
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (!userDoc.exists()) {
        // Create user data for new Google sign-ins
        const userData: UserData = {
          uid: result.user.uid,
          email: result.user.email!,
          username: result.user.email!.split('@')[0], // Default username from email
          registrationDate: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', result.user.uid), userData);
        setUserData(userData);
      } else {
        setUserData(userDoc.data() as UserData);
      }
      
      toast.success('Successfully logged in with Google!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const loginWithUID = async (uid: string) => {
    try {
      // For development/testing purposes only
      // This simulates a login with a specific UID
      setUser({ uid } as User);
      await loadUserData(uid);
      toast.success('Successfully logged in with UID!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserData(null);
      toast.success('Successfully logged out!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userData, 
      loading, 
      error,
      login, 
      signup, 
      signInWithGoogle, 
      loginWithUID,
      logout,
      updateUserData 
    }}>
      {children}
    </AuthContext.Provider>
  );
};