import {
  auth,
  db
} from "./firebase-config.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* =========================
   AUTH STATE
========================= */

onAuthStateChanged(auth, async (user) => {

  if (user) {

    console.log("Logged in:", user.email);

    document.getElementById("authPage").style.display = "none";
    document.getElementById("appPage").style.display = "block";

    document.getElementById("userEmail").innerText =
      user.email;

    await loadFirebaseProfile(user.uid);

  } else {

    document.getElementById("authPage").style.display = "flex";
    document.getElementById("appPage").style.display = "none";

  }

});


/* =========================
   SIGNUP
========================= */

window.signup = async function(){

  const name =
    document.getElementById("signupName").value.trim();

  const email =
    document.getElementById("signupEmail").value.trim();

  const password =
    document.getElementById("signupPassword").value;

  if(!name || !email || !password){

    alert("Please fill all fields.");
    return;

  }

  if(password.length < 6){

    alert("Password must be at least 6 characters.");
    return;

  }

  try{

    const result =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    const user = result.user;

    await setDoc(
      doc(db,"users",user.uid),
      {
        uid:user.uid,
        name:name,
        email:user.email,
        username:"@" +
          name.toLowerCase().replace(/\s+/g,""),
        bio:"Welcome to Gitalk Social ❤️",
        location:"",
        website:"",
        photo:"",
        createdAt:serverTimestamp()
      }
    );

    alert("Account created successfully ❤️");

  }catch(error){

    console.error(error);

    alert(
      "Signup Error: " +
      error.message
    );

  }

};


/* =========================
   LOGIN
========================= */

window.login = async function(){

  const email =
    document.getElementById("loginEmail").value.trim();

  const password =
    document.getElementById("loginPassword").value;

  if(!email || !password){

    alert("Enter email and password.");
    return;

  }

  try{

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  }catch(error){

    console.error(error);

    alert(
      "Login Error: " +
      error.message
    );

  }

};


/* =========================
   LOGOUT
========================= */

window.logout = async function(){

  try{

    await signOut(auth);

  }catch(error){

    alert(error.message);

  }

};


/* =========================
   LOAD PROFILE
========================= */

async function loadFirebaseProfile(uid){

  try{

    const profileRef =
      doc(db,"users",uid);

    const profileSnap =
      await getDoc(profileRef);

    if(profileSnap.exists()){

      const data =
        profileSnap.data();

      setValue("profileName",
        data.name || "Gitalk User");

      setValue("profileUsername",
        data.username || "");

      setValue("profileBio",
        data.bio || "");

      setValue("profileLocation",
        data.location || "India");

      setValue("profileWebsite",
        data.website || "");

      setValue("userEmail",
        data.email || "");

      document.getElementById(
        "nameInput"
      ).value =
        data.name || "";

      document.getElementById(
        "usernameInput"
      ).value =
        data.username || "";

      document.getElementById(
        "bioInput"
      ).value =
        data.bio || "";

      document.getElementById(
        "locationInput"
      ).value =
        data.location || "";

      document.getElementById(
        "websiteInput"
      ).value =
        data.website || "";

      if(data.photo){

        document.getElementById(
          "profilePhoto"
        ).src = data.photo;

        document.getElementById(
          "homePhoto"
        ).src = data.photo;

      }

    }

  }catch(error){

    console.error(
      "Profile loading error:",
      error
    );

  }

}


/* =========================
   SAVE PROFILE
========================= */

window.saveFirebaseProfile =
async function(){

  const user = auth.currentUser;

  if(!user){

    alert("Please login first.");
    return;

  }

  const name =
    document.getElementById(
      "nameInput"
    ).value.trim();

  const username =
    document.getElementById(
      "usernameInput"
    ).value.trim();

  const bio =
    document.getElementById(
      "bioInput"
    ).value.trim();

  const location =
    document.getElementById(
      "locationInput"
    ).value.trim();

  const website =
    document.getElementById(
      "websiteInput"
    ).value.trim();

  try{

    await setDoc(
      doc(db,"users",user.uid),
      {
        uid:user.uid,
        name:name,
        username:username,
        email:user.email,
        bio:bio,
        location:location,
        website:website,
        updatedAt:serverTimestamp()
      },
      {
        merge:true
      }
    );

    await loadFirebaseProfile(user.uid);

    alert("Profile saved successfully ❤️");

  }catch(error){

    console.error(error);

    alert(
      "Profile save error: " +
      error.message
    );

  }

};


/* =========================
   HELPERS
========================= */

function setValue(id,value){

  const element =
    document.getElementById(id);

  if(element){

    element.innerText = value;

  }

}


/* =========================
   AUTH SCREEN
========================= */

window.showSignup =
function(){

  document.getElementById(
    "loginBox"
  ).style.display="none";

  document.getElementById(
    "signupBox"
  ).style.display="block";

};


window.showLogin =
function(){

  document.getElementById(
    "signupBox"
  ).style.display="none";

  document.getElementById(
    "loginBox"
  ).style.display="block";

};
