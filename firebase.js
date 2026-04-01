// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDuUSIrLlX-ucEDNdEDXW0Uyl2PRLtCC7w",
  authDomain: "talentedge-f5a91.firebaseapp.com",
  projectId: "talentedge-f5a91",
  storageBucket: "talentedge-f5a91.firebasestorage.app",
  messagingSenderId: "845456474817",
  appId: "1:845456474817:web:33eb048166e91d47618a40"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);