import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDr-wT6zN6hOfeKFD1v1uEgKw-rgvjDhI8",
  authDomain: "legalease-3a957.firebaseapp.com",
  projectId: "legalease-3a957",
  storageBucket: "legalease-3a957.firebasestorage.app",
  messagingSenderId: "40325275280",
  appId: "1:40325275280:web:7256c210ca8f18ce90c215",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;