import {
  auth,
  db,
  storage
} from "./firebase-config.js";


import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


import {
  ref,
  uploadBytes,
  getDownloadURL
} from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";



/* =========================================
   AUTH STATE
========================================= */

onAuthStateChanged(
  auth,
  async (user) => {

    if(user){

      document.getElementById(
        "authPage"
      ).style.display="none";


      document.getElementById(
        "appPage"
      ).style.display="block";


      document.getElementById(
        "userEmail"
      ).innerText =
        user.email || "";


      await loadProfile(user.uid);


    }else{

      document.getElementById(
        "authPage"
      ).style.display="flex";


      document.getElementById(
        "appPage"
      ).style.display="none";

    }

  }
);



/* =========================================
   SHOW LOGIN
========================================= */

window.showLogin=function(){

  document.getElementById(
    "loginBox"
  ).style.display="block";


  document.getElementById(
    "signupBox"
  ).style.display="none";

};



/* =========================================
   SHOW SIGNUP
========================================= */

window.showSignup=function(){

  document.getElementById(
    "loginBox"
  ).style.display="none";


  document.getElementById(
    "signupBox"
  ).style.display="block";

};



/* =========================================
   SIGNUP
========================================= */

window.signup=async function(){

  const name=
    document.getElementById(
      "signupName"
    ).value.trim();


  const email=
    document.getElementById(
      "signupEmail"
    ).value.trim();


  const password=
    document.getElementById(
      "signupPassword"
    ).value;


  if(!name){

    alert("Please enter your name.");

    return;

  }


  if(!email){

    alert("Please enter your email.");

    return;

  }


  if(password.length<6){

    alert(
      "Password must be at least 6 characters."
    );

    return;

  }


  try{

    const result=
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );


    const user=result.user;


    const username=
      "@" +
      name
      .toLowerCase()
      .replace(/[^a-z0-9]/g,"");


    await setDoc(
      doc(
        db,
        "users",
        user.uid
      ),
      {

        uid:user.uid,

        name:name,

        username:username,

        email:user.email,

        bio:
          "Welcome to Gitalk Social ❤️",

        location:"",

        website:"",

        photo:"",

        notifications:true,

        privateAccount:false,

        messages:true,

        createdAt:
          serverTimestamp()

      }
    );


    alert(
      "Account created successfully ❤️"
    );


  }catch(error){

    console.error(error);


    let message=
      error.message;


    if(
      error.code ===
      "auth/email-already-in-use"
    ){

      message=
        "This email is already registered.";

    }


    alert(
      "Signup Error: " +
      message
    );

  }

};



/* =========================================
   LOGIN
========================================= */

window.login=async function(){

  const email=
    document.getElementById(
      "loginEmail"
    ).value.trim();


  const password=
    document.getElementById(
      "loginPassword"
    ).value;


  if(!email || !password){

    alert(
      "Please enter email and password."
    );

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


    let message=
      error.message;


    if(
      error.code ===
      "auth/invalid-credential"
    ){

      message=
        "Email or password is incorrect.";

    }


    alert(
      "Login Error: " +
      message
    );

  }

};



/* =========================================
   LOGOUT
========================================= */

window.logout=async function(){

  try{

    await signOut(auth);

  }catch(error){

    alert(
      "Logout Error: " +
      error.message
    );

  }

};



/* =========================================
   LOAD PROFILE
========================================= */

async function loadProfile(uid){

  try{

    const profileRef=
      doc(
        db,
        "users",
        uid
      );


    const snapshot=
      await getDoc(profileRef);


    if(!snapshot.exists()){

      return;

    }


    const data=
      snapshot.data();


    /* HOME */

    setText(
      "homeName",
      data.name || "Gitalk User"
    );


    setText(
      "homeUsername",
      data.username || "@username"
    );


    setText(
      "homeBio",
      data.bio ||
      "Welcome to Gitalk Social ❤️"
    );


    /* PROFILE */

    setText(
      "profilePageName",
      data.name || "Gitalk User"
    );


    setText(
      "profilePageUsername",
      data.username || "@username"
    );


    setText(
      "profilePageBio",
      data.bio || ""
    );


    setText(
      "profilePageLocation",
      data.location
      ? "📍 " + data.location
      : ""
    );


    /* WEBSITE */

    const website=
      document.getElementById(
        "profilePageWebsite"
      );


    if(data.website){

      let url=
        data.website.trim();


      if(
        !url.startsWith("http://") &&
        !url.startsWith("https://")
      ){

        url=
          "https://" + url;

      }


      website.href=url;

      website.innerText=
        "🌐 " + data.website;

      website.style.display=
        "inline-block";

    }else{

      website.style.display=
        "none";

    }


    /* PHOTO */

    if(data.photo){

      setImage(
        "homePhoto",
        data.photo
      );


      setImage(
        "profilePhoto",
        data.photo
      );


      setImage(
        "editProfilePhoto",
        data.photo
      );

    }


    /* EDIT FORM */

    document.getElementById(
      "nameInput"
    ).value=
      data.name || "";


    document.getElementById(
      "usernameInput"
    ).value=
      data.username || "";


    document.getElementById(
      "bioInput"
    ).value=
      data.bio || "";


    document.getElementById(
      "locationInput"
    ).value=
      data.location || "";


    document.getElementById(
      "websiteInput"
    ).value=
      data.website || "";


    /* SETTINGS */

    document.getElementById(
      "notificationsToggle"
    ).checked=
      data.notifications !== false;


    document.getElementById(
      "privateToggle"
    ).checked=
      data.privateAccount === true;


    document.getElementById(
      "messagesToggle"
    ).checked=
      data.messages !== false;


  }catch(error){

    console.error(
      "Load profile error:",
      error
    );

  }

}



/* =========================================
   PREVIEW PROFILE PHOTO
========================================= */

window.previewProfileImage=
function(event){

  const file=
    event.target.files[0];


  if(!file){

    return;

  }


  if(!file.type.startsWith("image/")){

    alert(
      "Please select an image file."
    );

    event.target.value="";

    return;

  }


  /* 5 MB */

  if(file.size >
     5 * 1024 * 1024){

    alert(
      "Photo must be less than 5 MB."
    );

    event.target.value="";

    return;

  }


  const reader=
    new FileReader();


  reader.onload=
    function(e){

      document.getElementById(
        "editProfilePhoto"
      ).src=
        e.target.result;


      document.getElementById(
        "uploadStatus"
      ).innerText=
        "Photo selected ✓";

    };


  reader.readAsDataURL(file);

};



/* =========================================
   SAVE PROFILE
========================================= */

window.saveFirebaseProfile=
async function(){

  const user=
    auth.currentUser;


  if(!user){

    alert(
      "Please login first."
    );

    return;

  }


  const name=
    document.getElementById(
      "nameInput"
    ).value.trim();


  const username=
    document.getElementById(
      "usernameInput"
    ).value.trim();


  const bio=
    document.getElementById(
      "bioInput"
    ).value.trim();


  const location=
    document.getElementById(
      "locationInput"
    ).value.trim();


  const website=
    document.getElementById(
      "websiteInput"
    ).value.trim();


  const imageInput=
    document.getElementById(
      "profileImageInput"
    );


  const status=
    document.getElementById(
      "uploadStatus"
    );


  if(!name){

    alert(
      "Please enter your name."
    );

    return;

  }


  try{

    status.innerText=
      "Saving profile...";


    /* GET OLD PROFILE */

    const oldSnapshot=
      await getDoc(
        doc(
          db,
          "users",
          user.uid
        )
      );


    let photoURL="";


    if(oldSnapshot.exists()){

      photoURL=
        oldSnapshot.data().photo || "";

    }


    /* =====================================
       UPLOAD NEW PHOTO
    ===================================== */

    if(
      imageInput.files &&
      imageInput.files.length>0
    ){

      const file=
        imageInput.files[0];


      status.innerText=
        "📤 Uploading photo...";


      const extension=
        file.name
        .split(".")
        .pop()
        .toLowerCase();


      const storagePath=
        "profilePhotos/" +
        user.uid +
        "/profile." +
        extension;


      const storageRef=
        ref(
          storage,
          storagePath
        );


      await uploadBytes(
        storageRef,
        file
      );


      status.innerText=
        "☁️ Getting photo URL...";


      photoURL=
        await getDownloadURL(
          storageRef
        );

    }


    /* =====================================
       FIRESTORE SAVE
    ===================================== */

    status.innerText=
      "💾 Saving profile...";


    await setDoc(
      doc(
        db,
        "users",
        user.uid
      ),
      {

        uid:user.uid,

        name:name,

        username:
          username || "@username",

        email:user.email,

        bio:bio,

        location:location,

        website:website,

        photo:photoURL,

        updatedAt:
          serverTimestamp()

      },
      {
        merge:true
      }
    );


    /* CLEAR FILE INPUT */

    imageInput.value="";


    status.innerText=
      "✅ Profile saved successfully";


    /* RELOAD PROFILE */

    await loadProfile(
      user.uid
    );


    alert(
      "Profile saved successfully ❤️"
    );


    showPage(
      "profilePage"
    );


  }catch(error){

    console.error(
      "Save profile error:",
      error
    );


    status.innerText=
      "❌ Upload failed";


    alert(
      "Profile Error: " +
      error.message
    );

  }

};



/* =========================================
   SETTINGS SAVE
========================================= */

async function saveSettings(){

  const user=
    auth.currentUser;


  if(!user){

    return;

  }


  try{

    await setDoc(
      doc(
        db,
        "users",
        user.uid
      ),
      {

        notifications:
          document.getElementById(
            "notificationsToggle"
          ).checked,

        privateAccount:
          document.getElementById(
            "privateToggle"
          ).checked,

        messages:
          document.getElementById(
            "messagesToggle"
          ).checked,

        updatedAt:
          serverTimestamp()

      },
      {
        merge:true
      }
    );


  }catch(error){

    console.error(
      "Settings error:",
      error
    );

  }

}


/* AUTO SAVE SETTINGS */

document.addEventListener(
  "change",
  function(event){

    if(
      event.target.id ===
      "notificationsToggle" ||

      event.target.id ===
      "privateToggle" ||

      event.target.id ===
      "messagesToggle"
    ){

      saveSettings();

    }

  }
);



/* =========================================
   PAGE NAVIGATION
========================================= */

window.showPage=
function(pageId){

  document
    .querySelectorAll(".page")
    .forEach(
      page=>{
        page.classList.remove(
          "active"
        );
      }
    );


  const page=
    document.getElementById(
      pageId
    );


  if(page){

    page.classList.add(
      "active"
    );

  }


  window.scrollTo({
    top:0,
    behavior:"smooth"
  });

};



/* =========================================
   FOCUS POST
========================================= */

window.focusPost=
function(){

  setTimeout(
    ()=>{
      const textarea=
        document.querySelector(
          ".postTextarea"
        );

      if(textarea){

        textarea.focus();

      }

    },
    200
  );

};



/* =========================================
   DARK MODE
========================================= */

window.toggleDarkMode=
function(){

  const enabled=
    document.getElementById(
      "darkToggle"
    ).checked;


  document.body.classList.toggle(
    "dark",
    enabled
  );


  localStorage.setItem(
    "gitalkDarkMode",
    enabled
  );

};



/* =========================================
   RESTORE DARK MODE
========================================= */

const savedDark=
  localStorage.getItem(
    "gitalkDarkMode"
  );


if(savedDark==="true"){

  document.body.classList.add(
    "dark"
  );


  setTimeout(
    ()=>{
      const toggle=
        document.getElementById(
          "darkToggle"
        );

      if(toggle){

        toggle.checked=true;

      }

    },
    100
  );

}



/* =========================================
   COMING SOON
========================================= */

window.comingSoon=
function(){

  alert(
    "Post system is our next step ❤️"
  );

};



/* =========================================
   HELPERS
========================================= */

function setText(
  id,
  value
){

  const element=
    document.getElementById(id);


  if(element){

    element.innerText=
      value;

  }

}


function setImage(
  id,
  url
){

  const element=
    document.getElementById(id);


  if(element){

    element.src=
      url;

  }

  }
