/**
 * Development Authentication Utilities
 * 
 * This file contains utilities for development authentication purposes.
 * These functions should NOT be used in production.
 */

import { getAuth } from 'firebase/auth';
import app from '../firebase';

// The specific user UID provided
const DEV_USER_UID = 'NpyoqK8NPXXa3dTbHC6s9DGJ6Kr2';

// Get auth from the existing Firebase app
const auth = getAuth(app);

/**
 * Authenticate with a specific user UID for development purposes
 * This is useful for testing specific user scenarios
 */
export const authenticateWithUID = async () => {
  try {
    // This is a simplified approach for development
    // In a real implementation, you would need to generate a custom token on the server
    // and then sign in with that token
    
    // For now, we'll just simulate the authentication by setting the UID in localStorage
    localStorage.setItem('dev_user_uid', DEV_USER_UID);
    
    return {
      success: true,
      uid: DEV_USER_UID
    };
  } catch (error) {
    console.error('Development authentication error:', error);
    return {
      success: false,
      error
    };
  }
};

/**
 * Check if we're using development authentication
 */
export const isUsingDevAuth = () => {
  return localStorage.getItem('dev_user_uid') === DEV_USER_UID;
};

/**
 * Clear development authentication
 */
export const clearDevAuth = () => {
  localStorage.removeItem('dev_user_uid');
};