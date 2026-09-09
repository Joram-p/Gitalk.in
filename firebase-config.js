import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import { getAuth } from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import { getFirestore } from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBDz7YkD4ivdet3kjJ1HcmfCUbS8WOc25I",
  authDomain: "gitalk-social-3a85a.firebaseapp.com",
  projectId: "gitalk-social-3a85a",
  storageBucket: "gitalk-social-3a85a.firebasestorage.app",
  messagingSenderId: "553434284005",
  appId: "1:553434284005:web:e934097f7f7228d2b8b90c"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export {
  app,
  auth,
  db
};
