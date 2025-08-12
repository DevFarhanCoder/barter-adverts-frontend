import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Paste your Firebase web config from Console → Project settings → Your apps (</>)
const firebaseConfig = {
apiKey: "AIzaSyCViBuN9f_uNcH8n-hLA30vaKyi1CCnve0",
  authDomain: "barter-advert.firebaseapp.com",
  projectId: "barter-advert",
  storageBucket: "barter-advert.firebasestorage.app",
  messagingSenderId: "981572944903",
  appId: "1:981572944903:web:b0b5cd50c73c7be48fd6a2",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
