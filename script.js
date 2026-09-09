import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";


// =====================================
// FIREBASE CONFIG
// =====================================

const firebaseConfig = {

  apiKey:
    "AIzaSyBDz7YkD4ivdet3kjJ1HcmfCUbS8WOc25I",

  authDomain:
    "gitalk-social-3a85a.firebaseapp.com",

  projectId:
    "gitalk-social-3a85a",

  storageBucket:
    "gitalk-social-3a85a.firebasestorage.app",

  messagingSenderId:
    "553434284005",

  appId:
    "1:553434284005:web:e934097f7f7228d2b8b90c"

};


// =====================================
// INITIALIZE
// =====================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);


let currentUser = null;

let selectedFile = null;


// =====================================
// ELEMENTS
// =====================================

const authPage =
  document.getElementById("authPage");

const socialPage =
  document.getElementById("socialPage");

const loginBox =
  document.getElementById("loginBox");

const registerBox =
  document.getElementById("registerBox");


// =====================================
// SWITCH LOGIN / REGISTER
// =====================================

document
  .getElementById("showRegister")
  .onclick = () => {

    loginBox.classList.add("hidden");

    registerBox.classList.remove("hidden");

  };


document
  .getElementById("showLogin")
  .onclick = () => {

    registerBox.classList.add("hidden");

    loginBox.classList.remove("hidden");

  };


// =====================================
// REGISTER
// =====================================

document
  .getElementById("registerBtn")
  .onclick = async () => {

    const name =
      document
        .getElementById("registerName")
        .value
        .trim();

    const email =
      document
        .getElementById("registerEmail")
        .value
        .trim();

    const password =
      document
        .getElementById("registerPassword")
        .value;

    const msg =
      document.getElementById("registerMsg");


    if (!name || !email || !password) {

      msg.innerText =
        "Please fill all fields.";

      return;

    }


    if (password.length < 6) {

      msg.innerText =
        "Password must be at least 6 characters.";

      return;

    }


    try {

      msg.innerText =
        "Creating account...";


      const result =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );


      await setDoc(
        doc(db, "users", result.user.uid),
        {

          uid: result.user.uid,

          name: name,

          email: email,

          createdAt: new Date().toISOString()

        }
      );


      msg.innerText =
        "Account created ❤️";

    }

    catch(error) {

      msg.innerText =
        firebaseError(error.code);

    }

  };


// =====================================
// LOGIN
// =====================================

document
  .getElementById("loginBtn")
  .onclick = async () => {

    const email =
      document
        .getElementById("loginEmail")
        .value
        .trim();

    const password =
      document
        .getElementById("loginPassword")
        .value;

    const msg =
      document.getElementById("loginMsg");


    if (!email || !password) {

      msg.innerText =
        "Enter email and password.";

      return;

    }


    try {

      msg.innerText =
        "Logging in...";


      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

    }

    catch(error) {

      msg.innerText =
        firebaseError(error.code);

    }

  };


// =====================================
// AUTH STATE
// =====================================

onAuthStateChanged(
  auth,
  async user => {

    if (user) {

      currentUser = user;

      authPage.classList.add("hidden");

      socialPage.classList.remove("hidden");

      await loadUser();

      loadPosts();

    }

    else {

      currentUser = null;

      socialPage.classList.add("hidden");

      authPage.classList.remove("hidden");

    }

  }
);


// =====================================
// LOAD USER
// =====================================

async function loadUser(){

  if (!currentUser) return;


  const userRef =
    doc(
      db,
      "users",
      currentUser.uid
    );


  const snap =
    await getDoc(userRef);


  let name =
    currentUser.email.split("@")[0];


  if (snap.exists()) {

    name =
      snap.data().name || name;

  }


  document.getElementById(
    "userName"
  ).innerText = name;


  document.getElementById(
    "userEmail"
  ).innerText =
    currentUser.email;


  document.getElementById(
    "userAvatar"
  ).innerText =
    name.charAt(0).toUpperCase();


  document.getElementById(
    "profileName"
  ).innerText = name;


  document.getElementById(
    "profileEmail"
  ).innerText =
    currentUser.email;


  document.getElementById(
    "profileAvatar"
  ).innerText =
    name.charAt(0).toUpperCase();

}


// =====================================
// PHOTO SELECT
// =====================================

document
  .getElementById("photoInput")
  .addEventListener(
    "change",
    event => {

      selectedFile =
        event.target.files[0];


      const preview =
        document.getElementById(
          "imagePreview"
        );


      preview.innerHTML = "";


      if (!selectedFile) return;


      if (!selectedFile.type.startsWith("image/")) {

        alert("Please select an image.");

        selectedFile = null;

        return;

      }


      const reader =
        new FileReader();


      reader.onload = e => {

        preview.innerHTML =
          `<img src="${e.target.result}">`;

      };


      reader.readAsDataURL(selectedFile);

    }
  );


// =====================================
// CREATE POST
// =====================================

document
  .getElementById("postBtn")
  .onclick = async () => {

    if (!currentUser) {

      alert("Please login.");

      return;

    }


    const text =
      document
        .getElementById("postText")
        .value
        .trim();

    const msg =
      document.getElementById("postMsg");


    if (!text && !selectedFile) {

      msg.innerText =
        "Write something or select a photo.";

      return;

    }


    try {

      msg.innerText =
        "Posting...";


      let imageUrl = "";


      // Upload photo
      if (selectedFile) {

        const fileName =
          Date.now() +
          "_" +
          selectedFile.name;


        const storageRef =
          ref(
            storage,
            "posts/" +
            currentUser.uid +
            "/" +
            fileName
          );


        await uploadBytes(
          storageRef,
          selectedFile
        );


        imageUrl =
          await getDownloadURL(
            storageRef
          );

      }


      // Get username
      const userSnap =
        await getDoc(
          doc(
            db,
            "users",
            currentUser.uid
          )
        );


      let name =
        currentUser.email.split("@")[0];


      if (userSnap.exists()) {

        name =
          userSnap.data().name || name;

      }


      // Save post
      await addDoc(
        collection(db, "posts"),
        {

          uid: currentUser.uid,

          userName: name,

          text: text,

          image: imageUrl,

          likes: [],

          comments: [],

          createdAt:
            new Date().toISOString()

        }
      );


      document.getElementById(
        "postText"
      ).value = "";


      document.getElementById(
        "photoInput"
      ).value = "";


      document.getElementById(
        "imagePreview"
      ).innerHTML = "";


      selectedFile = null;


      msg.innerText =
        "Post published ❤️";


      loadPosts();

    }

    catch(error) {

      console.error(error);

      msg.innerText =
        "Post failed: " +
        error.message;

    }

  };


// =====================================
// LOAD POSTS
// =====================================

async function loadPosts(){

  const feed =
    document.getElementById("feed");


  feed.innerHTML =
    `<div class="loading">
      Loading posts...
    </div>`;


  try {

    const postsQuery =
      query(
        collection(db, "posts"),
        orderBy("createdAt", "desc")
      );


    const snapshot =
      await getDocs(postsQuery);


    if (snapshot.empty) {

      feed.innerHTML =
        `<div class="post">
          No posts yet. Be the first ❤️
        </div>`;

      return;

    }


    feed.innerHTML = "";


    snapshot.forEach(
      postDoc => {

        const post =
          postDoc.data();


        feed.innerHTML +=
          createPostHTML(
            postDoc.id,
            post
          );

      }
    );

  }

  catch(error) {

    console.error(error);

    feed.innerHTML =
      `<div class="post">
        Unable to load posts.
      </div>`;

  }

}


// =====================================
// POST HTML
// =====================================

function createPostHTML(id, post){

  const likes =
    post.likes || [];


  const comments =
    post.comments || [];


  const liked =
    currentUser &&
    likes.includes(
      currentUser.uid
    );


  const date =
    post.createdAt
      ?
      new Date(
        post.createdAt
      ).toLocaleString()
      :
      "";


  const avatar =
    (post.userName || "U")
      .charAt(0)
      .toUpperCase();


  let commentsHTML = "";


  comments.forEach(
    comment => {

      commentsHTML +=
        `<div class="comment">
          <b>${escapeHTML(comment.name)}</b>
          <br>
          ${escapeHTML(comment.text)}
        </div>`;

    }
  );


  return `

  <article class="post">

    <div class="post-header">

      <div class="avatar">
        ${avatar}
      </div>

      <div>

        <div class="post-user">
          ${escapeHTML(post.userName || "User")}
        </div>

        <div class="post-time">
          ${date}
        </div>

      </div>

    </div>


    ${
      post.text
      ?
      `<div class="post-text">
        ${escapeHTML(post.text)}
      </div>`
      :
      ""
    }


    ${
      post.image
      ?
      `<img
        class="post-image"
        src="${post.image}"
        loading="lazy"
      >`
      :
      ""
    }


    <div class="post-actions">

      <button
        class="like ${liked ? "active" : ""}"
        onclick="toggleLike('${id}')">

        ${liked ? "❤️" : "🤍"}
        ${likes.length}

      </button>


      <button
        onclick="toggleComments('${id}')">

        💬
        ${comments.length}

      </button>


      <button
        onclick="sharePost('${id}')">

        🔗 Share

      </button>

    </div>


    <div
      id="comments-${id}"
      class="comment-box">

      <input
        id="commentInput-${id}"
        placeholder="Write a comment..."
        onkeydown="commentEnter(event,'${id}')"
      >

      <div class="comments">
        ${commentsHTML}
      </div>

    </div>

  </article>

  `;

}


// =====================================
// LIKE
// =====================================

window.toggleLike =
  async function(id){

    if (!currentUser) return;


    const postRef =
      doc(
        db,
        "posts",
        id
      );


    const snap =
      await getDoc(postRef);


    if (!snap.exists()) return;


    const post =
      snap.data();


    const likes =
      post.likes || [];


    if (
      likes.includes(
        currentUser.uid
      )
    ) {

      await updateDoc(
        postRef,
        {

          likes:
            arrayRemove(
              currentUser.uid
            )

        }
      );

    }

    else {

      await updateDoc(
        postRef,
        {

          likes:
            arrayUnion(
              currentUser.uid
            )

        }
      );

    }


    loadPosts();

  };


// =====================================
// COMMENTS
// =====================================

window.toggleComments =
  function(id){

    const box =
      document.getElementById(
        "comments-" + id
      );


    if(
      box.style.display === "block"
    ){

      box.style.display = "none";

    }

    else {

      box.style.display = "block";

    }

  };


window.commentEnter =
  async function(event,id){

    if(event.key !== "Enter") return;


    const input =
      document.getElementById(
        "commentInput-" + id
      );


    const text =
      input.value.trim();


    if(!text) return;


    const userSnap =
      await getDoc(
        doc(
          db,
          "users",
          currentUser.uid
        )
      );


    let name =
      currentUser.email.split("@")[0];


    if(userSnap.exists()){

      name =
        userSnap.data().name || name;

    }


    const postRef =
      doc(
        db,
        "posts",
        id
      );


    await updateDoc(
      postRef,
      {

        comments:
          arrayUnion({

            uid:
              currentUser.uid,

            name:name,

            text:text,

            time:
              new Date().toISOString()

          })

      }
    );


    input.value = "";


    loadPosts();

  };


// =====================================
// SHARE
// =====================================

window.sharePost =
  async function(id){

    const url =
      window.location.href +
      "#post-" +
      id;


    if(navigator.share){

      try{

        await navigator.share({

          title:
            "Gitalk Social",

          text:
            "Check this post on Gitalk Social ❤️",

          url:url

        });

      }

      catch(e){}

    }

    else{

      try{

        await navigator.clipboard.writeText(
          url
        );

        alert(
          "Post link copied!"
        );

      }

      catch(e){

        prompt(
          "Copy this link:",
          url
        );

      }

    }

  };


// =====================================
// LOGOUT
// =====================================

document
  .getElementById("logoutBtn")
  .onclick =
  async () => {

    await signOut(auth);

  };


// =====================================
// PROFILE
// =====================================

document
  .getElementById("profileBtn")
  .onclick =
  () => {

    document
      .getElementById("profileModal")
      .classList.remove(
        "hidden"
      );

  };


function closeProfile(){

  document
    .getElementById("profileModal")
    .classList.add(
      "hidden"
    );

}


document
  .getElementById("closeProfile")
  .onclick =
  closeProfile;


document
  .getElementById("closeProfile2")
  .onclick =
  closeProfile;


// =====================================
// FIREBASE ERROR
// =====================================

function firebaseError(code){

  switch(code){

    case "auth/email-already-in-use":
      return "Email already registered.";

    case "auth/invalid-email":
      return "Invalid email address.";

    case "auth/weak-password":
      return "Password is too weak.";

    case "auth/invalid-credential":
      return "Invalid email or password.";

    case "auth/user-not-found":
      return "User not found.";

    case "auth/wrong-password":
      return "Wrong password.";

    default:
      return "Error: " + code;

  }

}


// =====================================
// ESCAPE HTML
// =====================================

function escapeHTML(text){

  const div =
    document.createElement("div");

  div.textContent =
    text || "";

  return div.innerHTML;

  }
