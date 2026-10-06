// Converts technical Firebase errors into user-friendly messages

const AUTH_ERRORS = {
  'auth/invalid-email': 'The email address you entered is not valid. Please check it and try again.',
  'auth/missing-email': 'Please enter your email address.',
  'auth/missing-password': 'Please enter your password.',
  'auth/user-not-found': 'No account was found with this email address.',
  'auth/wrong-password': 'The password you entered is incorrect. Please try again.',
  'auth/invalid-credential': 'The email address or password you entered is incorrect. Please try again.',
  'auth/email-already-in-use': 'An account with this email address already exists. Please sign in instead.',
  'auth/weak-password': 'Your password is too weak. Please use at least 6 characters.',
  'auth/user-disabled': 'This account has been disabled. Please contact support for assistance.',
  'auth/too-many-requests': 'Too many unsuccessful attempts. Please wait a few minutes and try again.',
  'auth/network-request-failed': 'Unable to connect. Please check your internet connection and try again.',
  'auth/operation-not-allowed': 'Email sign-in is currently unavailable. Please try again later.',
};

const FIRESTORE_ERRORS = {
  'permission-denied': 'You do not have permission to perform this action. Please sign in again.',
  'unauthenticated': 'Your session has expired. Please sign in again.',
  'unavailable': 'The service is temporarily unavailable. Please check your connection and try again.',
  'not-found': 'This note could not be found. It may have been deleted.',
  'deadline-exceeded': 'The request timed out. Please try again.',
  'resource-exhausted': 'The service is busy right now. Please try again later.',
};

const DEFAULT_MESSAGE = 'Something went wrong. Please try again.';

export function getErrorMessage(error) {
  const code = error?.code || '';
  if (AUTH_ERRORS[code]) return AUTH_ERRORS[code];

  const firestoreCode = code.replace('firestore/', '');
  if (FIRESTORE_ERRORS[firestoreCode]) return FIRESTORE_ERRORS[firestoreCode];

  return DEFAULT_MESSAGE;
}