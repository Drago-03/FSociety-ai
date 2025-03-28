import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

// Generic type for database items
interface DatabaseItem {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Generic database operations
export const DatabaseOperations = {
  // Create a new document in a collection
  create: async <T extends DatabaseItem>(
    collectionPath: string, 
    data: T
  ): Promise<string> => {
    try {
      const collectionRef = collection(db, collectionPath);
      const docRef = await addDoc(collectionRef, {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  },

  // Get a single document by ID
  get: async <T extends DatabaseItem>(
    collectionPath: string, 
    docId: string
  ): Promise<T | null> => {
    try {
      const docRef = doc(db, collectionPath, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  },

  // Query documents in a collection
  query: async <T extends DatabaseItem>(
    collectionPath: string,
    conditions: {
      field: string;
      operator: '==' | '>' | '<' | '>=' | '<=';
      value: any;
    }[],
    orderByField?: string,
    orderDirection?: 'asc' | 'desc',
    limitCount?: number
  ): Promise<T[]> => {
    try {
      let q = collection(db, collectionPath);
      
      // Apply where conditions
      conditions.forEach(condition => {
        q = query(q, where(condition.field, condition.operator, condition.value));
      });
      
      // Apply ordering if specified
      if (orderByField) {
        q = query(q, orderBy(orderByField, orderDirection || 'desc'));
      }
      
      // Apply limit if specified
      if (limitCount) {
        q = query(q, limit(limitCount));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
    } catch (error) {
      console.error('Error querying documents:', error);
      throw error;
    }
  },

  // Update a document
  update: async <T extends DatabaseItem>(
    collectionPath: string, 
    docId: string, 
    data: Partial<T>
  ): Promise<void> => {
    try {
      const docRef = doc(db, collectionPath, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  },

  // Delete a document
  delete: async (
    collectionPath: string, 
    docId: string
  ): Promise<void> => {
    try {
      const docRef = doc(db, collectionPath, docId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }
}; 