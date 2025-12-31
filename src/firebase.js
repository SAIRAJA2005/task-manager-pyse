import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCTmmi-DUxvitLGRTkXwSo5tF60kseX5-s",
  authDomain: "task-manager-pyse.firebaseapp.com",
  projectId: "task-manager-pyse",
  storageBucket: "task-manager-pyse.firebasestorage.app",
  messagingSenderId: "874884031336",
  appId: "1:874884031336:web:d79f24a4fd13518e762cdd",
  measurementId: "G-26QSV5GQKX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
