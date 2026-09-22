// Firebase Service with local mock fallback when firebase package is not installed or offline

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyMockKeyForDevelopmentOnly12345",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "carrerpilotai.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "carrerpilotai",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "carrerpilotai.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "118316893039",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:118316893039:web:mockappid12345"
};

// Mock Firebase objects
const app = { name: "[DEFAULT]", options: firebaseConfig };
const auth = { name: "mockAuth" };
const db = { name: "mockDb" };
const storage = { name: "mockStorage" };

class GoogleAuthProvider {
  constructor() {
    this.providerId = "google.com";
  }
}

const googleProvider = new GoogleAuthProvider();

const initializeApp = () => app;
const getApps = () => [app];
const getAuth = () => auth;
const getFirestore = () => db;
const getStorage = () => storage;

const signInWithEmailAndPassword = async (_auth, _email, _password) => {
  throw new Error("Firebase Auth not connected, switching to mock authentication.");
};

const createUserWithEmailAndPassword = async (_auth, _email, _password) => {
  throw new Error("Firebase Auth not connected, switching to mock authentication.");
};

const signOut = async (_auth) => {
  return Promise.resolve();
};

const onAuthStateChanged = (_auth, _callback, errorCb) => {
  if (typeof errorCb === "function") {
    errorCb(new Error("Firebase Auth running in offline/mock mode."));
  }
  return () => {};
};

const signInWithPopup = async (_auth, _provider) => {
  throw new Error("Firebase Auth Google sign-in not connected, switching to mock authentication.");
};

export { 
  app, 
  auth, 
  db, 
  storage, 
  googleProvider,
  initializeApp,
  getApps,
  getAuth,
  getFirestore,
  getStorage,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup
};

