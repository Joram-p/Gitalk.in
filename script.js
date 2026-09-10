// ======================================================
// GITALK SOCIAL
// FIREBASE AUTHENTICATION + BASIC APP
// ======================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";


// ======================================================
// FIREBASE CONFIG
// ======================================================

const firebaseConfig = {
  apiKey: "AIzaSyBDz7YkD4ivdet3kjJ1HcmfCUbS8WOc25I",
  authDomain: "gitalk-social-3a85a.firebaseapp.com",
  projectId: "gitalk-social-3a85a",
  storageBucket: "gitalk-social-3a85a.firebasestorage.app",
  messagingSenderId: "553434284005",
  appId: "1:553434284005:web:e934097f7f7228d2b8b90c"
};


// ======================================================
// INITIALIZE FIREBASE
// ======================================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);


// ======================================================
// ELEMENTS
// ======================================================

const authScreen =
  document.getElementById("authScreen");

const appScreen =
  document.getElementById("appScreen");

const loginForm =
  document.getElementById("loginForm");

const registerForm =
  document.getElementById("registerForm");

const loginEmail =
  document.getElementById("loginEmail");

const loginPassword =
  document.getElementById("loginPassword");

const registerName =
  document.getElementById("registerName");

const registerEmail =
  document.getElementById("registerEmail");

const registerPassword =
  document.getElementById("registerPassword");

const registerConfirm =
  document.getElementById("registerConfirm");

const loginBtn =
  document.getElementById("loginBtn");

const registerBtn =
  document.getElementById("registerBtn");

const loginMessage =
  document.getElementById("loginMessage");

const registerMessage =
  document.getElementById("registerMessage");


// ======================================================
// SHOW REGISTER
// ======================================================

document
  .getElementById("showRegisterBtn")
  .addEventListener("click", () => {

    loginForm.style.display = "none";

    registerForm.style.display = "block";

    clearMessages();

  });


// ======================================================
// SHOW LOGIN
// ======================================================

document
  .getElementById("showLoginBtn")
  .addEventListener("click", () => {

    registerForm.style.display = "none";

    loginForm.style.display = "block";

    clearMessages();

  });


// ======================================================
// CLEAR MESSAGES
// ======================================================

function clearMessages() {

  loginMessage.textContent = "";

  registerMessage.textContent = "";

}


// ======================================================
// REGISTER
// ======================================================

registerBtn.addEventListener("click", async () => {

  const name =
    registerName.value.trim();

  const email =
    registerEmail.value.trim();

  const password =
    registerPassword.value;

  const confirm =
    registerConfirm.value;


  if (!name || !email || !password || !confirm) {

    registerMessage.textContent =
      "Please fill all fields.";

    return;

  }


  if (password !== confirm) {

    registerMessage.textContent =
      "Passwords do not match.";

    return;

  }


  if (password.length < 6) {

    registerMessage.textContent =
      "Password must be at least 6 characters.";

    return;

  }


  registerBtn.disabled = true;

  registerBtn.textContent =
    "Creating account...";


  try {

    const result =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );


    const user = result.user;


    await updateProfile(user, {
      displayName: name
    });


    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        name: name,
        email: email,
        photoURL: "",
        createdAt: serverTimestamp()
      }
    );


    registerMessage.textContent =
      "Account created successfully ❤️";


  } catch (error) {

    console.error(error);

    registerMessage.textContent =
      firebaseError(error);

  }


  registerBtn.disabled = false;

  registerBtn.textContent =
    "Create Account";

});


// ======================================================
// LOGIN
// ======================================================

loginBtn.addEventListener("click", async () => {

  const email =
    loginEmail.value.trim();

  const password =
    loginPassword.value;


  if (!email || !password) {

    loginMessage.textContent =
      "Please enter email and password.";

    return;

  }


  loginBtn.disabled = true;

  loginBtn.textContent =
    "Logging in...";


  try {

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );


    loginMessage.textContent =
      "Login successful ❤️";


  } catch (error) {

    console.error(error);

    loginMessage.textContent =
      firebaseError(error);

  }


  loginBtn.disabled = false;

  loginBtn.textContent =
    "Login";

});


// ======================================================
// FIREBASE ERROR MESSAGE
// ======================================================

function firebaseError(error) {

  switch (error.code) {

    case "auth/invalid-email":
      return "Invalid email address.";

    case "auth/user-not-found":
      return "No account found with this email.";

    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password.";

    case "auth/email-already-in-use":
      return "This email is already registered.";

    case "auth/weak-password":
      return "Password is too weak.";

    case "auth/network-request-failed":
      return "Network error. Check your internet.";

    default:
      return error.message || "Something went wrong.";

  }

}


// ======================================================
// AUTH STATE
// ======================================================

onAuthStateChanged(auth, async (user) => {

  if (user) {

    authScreen.style.display = "none";

    appScreen.style.display = "block";

    await loadUserProfile(user);

    loadPosts();

  } else {

    authScreen.style.display = "flex";

    appScreen.style.display = "none";

  }

});


// ======================================================
// LOAD USER PROFILE
// ======================================================

async function loadUserProfile(user) {

  let name =
    user.displayName || "Gitalk User";


  const welcome =
    document.getElementById("welcomeTitle");

  const profileName =
    document.getElementById("profileName");

  const profileEmail =
    document.getElementById("profileEmail");

  const editName =
    document.getElementById("editName");


  welcome.textContent =
    `Welcome ${name} ❤️`;


  profileName.textContent =
    name;


  profileEmail.textContent =
    user.email || "";


  editName.value =
    name;


  if (user.photoURL) {

    document.getElementById(
      "currentUserAvatar"
    ).innerHTML =
      `<img src="${escapeHTML(user.photoURL)}">`;


    document.getElementById(
      "profileAvatar"
    ).innerHTML =
      `<img src="${escapeHTML(user.photoURL)}">`;

  }

}


// ======================================================
// NAVIGATION
// ======================================================

document
  .querySelectorAll(".nav-btn")
  .forEach(button => {

    button.addEventListener("click", () => {

      const page =
        button.dataset.page;


      document
        .querySelectorAll(".page")
        .forEach(p => {

          p.classList.remove("active-page");

        });


      const selected =
        document.getElementById(page);


      if (selected) {

        selected.classList.add(
          "active-page"
        );

      }


      document
        .querySelectorAll(".nav-btn")
        .forEach(btn => {

          btn.classList.remove("active");

        });


      button.classList.add("active");

    });

  });


// ======================================================
// PROFILE HEADER BUTTON
// ======================================================

document
  .getElementById("headerProfileBtn")
  .addEventListener("click", () => {

    openPage("profilePage");

  });


// ======================================================
// OPEN PAGE
// ======================================================

function openPage(pageId) {

  document
    .querySelectorAll(".page")
    .forEach(page => {

      page.classList.remove(
        "active-page"
      );

    });


  const page =
    document.getElementById(pageId);


  if (page) {

    page.classList.add(
      "active-page"
    );

  }


  document
    .querySelectorAll(".nav-btn")
    .forEach(btn => {

      btn.classList.toggle(
        "active",
        btn.dataset.page === pageId
      );

    });

}


// ======================================================
// LOGOUT
// ======================================================

document
  .getElementById("logoutBtn")
  .addEventListener("click", async () => {

    try {

      await signOut(auth);

    } catch (error) {

      console.error(error);

      alert("Logout failed.");

    }

  });


// ======================================================
// CREATE POST MODAL
// ======================================================

const postModal =
  document.getElementById("postModal");

const postText =
  document.getElementById("postText");

const photoInput =
  document.getElementById("postPhotoInput");

const videoInput =
  document.getElementById("postVideoInput");

const mediaPreview =
  document.getElementById("mediaPreview");


function openPostModal() {

  postModal.classList.add("show");

}


function closePostModal() {

  postModal.classList.remove("show");

}


document
  .getElementById("openPostBtn")
  .addEventListener(
    "click",
    openPostModal
  );


document
  .getElementById("textPostBtn")
  .addEventListener(
    "click",
    openPostModal
  );


document
  .getElementById("photoPostBtn")
  .addEventListener(
    "click",
    () => {

      openPostModal();

      photoInput.click();

    }
  );


document
  .getElementById("videoPostBtn")
  .addEventListener(
    "click",
    () => {

      openPostModal();

      videoInput.click();

    }
  );


document
  .getElementById("closePostBtn")
  .addEventListener(
    "click",
    closePostModal
  );


document
  .getElementById("selectPhotoBtn")
  .addEventListener(
    "click",
    () => photoInput.click()
  );


document
  .getElementById("selectVideoBtn")
  .addEventListener(
    "click",
    () => videoInput.click()
  );


// ======================================================
// PHOTO PREVIEW
// ======================================================

photoInput.addEventListener(
  "change",
  () => {

    const file =
      photoInput.files[0];


    if (!file) return;


    videoInput.value = "";


    const url =
      URL.createObjectURL(file);


    mediaPreview.innerHTML =
      `<img src="${url}" alt="Preview">`;

  }
);


// ======================================================
// VIDEO PREVIEW
// ======================================================

videoInput.addEventListener(
  "change",
  () => {

    const file =
      videoInput.files[0];


    if (!file) return;


    photoInput.value = "";


    const url =
      URL.createObjectURL(file);


    mediaPreview.innerHTML =
      `<video src="${url}" controls></video>`;

  }
);


// ======================================================
// PUBLISH POST
// ======================================================

document
  .getElementById("publishPostBtn")
  .addEventListener(
    "click",
    publishPost
  );


async function publishPost() {

  const user =
    auth.currentUser;


  if (!user) {

    alert("Please login first.");

    return;

  }


  const text =
    postText.value.trim();


  const photo =
    photoInput.files[0];


  const video =
    videoInput.files[0];


  if (!text && !photo && !video) {

    document.getElementById(
      "postMessage"
    ).textContent =
      "Write something or select a photo/video.";

    return;

  }


  const publishBtn =
    document.getElementById(
      "publishPostBtn"
    );


  publishBtn.disabled = true;

  publishBtn.textContent =
    "Posting...";


  try {

    let mediaURL = "";

    let mediaType = "";


    const file =
      photo || video;


    if (file) {

      mediaType =
        photo ? "image" : "video";


      const fileName =
        `${Date.now()}_${file.name}`;


      const storageRef =
        ref(
          storage,
          `posts/${user.uid}/${fileName}`
        );


      const snapshot =
        await uploadBytes(
          storageRef,
          file
        );


      mediaURL =
        await getDownloadURL(
          snapshot.ref
        );

    }


    await addDoc(
      collection(db, "posts"),
      {

        uid: user.uid,

        author:
          user.displayName ||
          "Gitalk User",

        authorEmail:
          user.email || "",

        text: text,

        mediaURL: mediaURL,

        mediaType: mediaType,

        likes: 0,

        comments: 0,

        shares: 0,

        createdAt:
          serverTimestamp()

      }
    );


    postText.value = "";

    photoInput.value = "";

    videoInput.value = "";

    mediaPreview.innerHTML = "";

    closePostModal();


    document.getElementById(
      "postMessage"
    ).textContent = "";


  } catch (error) {

    console.error(error);

    document.getElementById(
      "postMessage"
    ).textContent =
      "Post failed: " + error.message;

  }


  publishBtn.disabled = false;

  publishBtn.textContent =
    "Post";

}


// ======================================================
// LOAD POSTS
// ======================================================

let unsubscribePosts = null;


function loadPosts() {

  if (unsubscribePosts) {

    unsubscribePosts();

  }


  const feed =
    document.getElementById("feed");


  const postsQuery =
    query(
      collection(db, "posts"),
      orderBy(
        "createdAt",
        "desc"
      )
    );


  unsubscribePosts =
    onSnapshot(
      postsQuery,
      snapshot => {

        feed.innerHTML = "";


        if (snapshot.empty) {

          feed.innerHTML = `
            <div class="empty-state">
              <h3>No posts yet</h3>
              <p>Be the first to create a post ❤️</p>
            </div>
          `;

          return;

        }


        let count = 0;


        snapshot.forEach(
          docSnap => {

            const post =
              docSnap.data();


            count++;


            feed.appendChild(
              createPostElement(
                docSnap.id,
                post
              )
            );

          }
        );


        document.getElementById(
          "postCount"
        ).textContent =
          count;

      },
      error => {

        console.error(error);

        feed.innerHTML = `
          <div class="empty-state">
            <h3>Unable to load posts</h3>
            <p>${escapeHTML(error.message)}</p>
          </div>
        `;

      }
    );

}


// ======================================================
// CREATE POST ELEMENT
// ======================================================

function createPostElement(
  id,
  post
) {

  const card =
    document.createElement("article");


  card.className =
    "post-card";


  let media = "";


  if (
    post.mediaURL &&
    post.mediaType === "image"
  ) {

    media = `
      <img
        class="post-media"
        src="${escapeHTML(post.mediaURL)}"
        alt="Post image"
      >
    `;

  }


  if (
    post.mediaURL &&
    post.mediaType === "video"
  ) {

    media = `
      <video
        class="post-media"
        src="${escapeHTML(post.mediaURL)}"
        controls
      ></video>
    `;

  }


  card.innerHTML = `

    <div class="post-header">

      <div class="avatar">
        👤
      </div>

      <div class="post-author">

        <strong>
          ${escapeHTML(
            post.author ||
            "Gitalk User"
          )}
        </strong>

        <small>
          Gitalk Social
        </small>

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

    ${media}

    <div class="post-buttons">

      <button data-action="like">
        ❤️ Like
      </button>

      <button data-action="comment">
        💬 Comment
      </button>

      <button data-action="share">
        🔗 Share
      </button>

    </div>

  `;


  card
    .querySelector(
      '[data-action="like"]'
    )
    .addEventListener(
      "click",
      () => {

        alert("Like feature next step ❤️");

      }
    );


  card
    .querySelector(
      '[data-action="comment"]'
    )
    .addEventListener(
      "click",
      () => {

        alert("Comment feature next step 💬");

      }
    );


  card
    .querySelector(
      '[data-action="share"]'
    )
    .addEventListener(
      "click",
      async () => {

        const shareText =
          post.text ||
          "Check this post on Gitalk Social";


        if (
          navigator.share
        ) {

          try {

            await navigator.share({
              title: "Gitalk Social",
              text: shareText
            });

          } catch {}

        } else {

          await navigator.clipboard.writeText(
            shareText
          );

          alert(
            "Post text copied!"
          );

        }

      }
    );


  return card;

}


// ======================================================
// EDIT PROFILE
// ======================================================

const profileModal =
  document.getElementById(
    "profileModal"
  );


document
  .getElementById(
    "editProfileBtn"
  )
  .addEventListener(
    "click",
    () => {

      profileModal.classList.add(
        "show"
      );

    }
  );


document
  .getElementById(
    "closeProfileBtn"
  )
  .addEventListener(
    "click",
    () => {

      profileModal.classList.remove(
        "show"
      );

    }
  );


document
  .getElementById(
    "saveProfileBtn"
  )
  .addEventListener(
    "click",
    async () => {

      const user =
        auth.currentUser;


      if (!user) return;


      const name =
        document
          .getElementById(
            "editName"
          )
          .value.trim();


      if (!name) {

        return;

      }


      try {

        await updateProfile(
          user,
          {
            displayName: name
          }
        );


        await setDoc(
          doc(
            db,
            "users",
            user.uid
          ),
          {
            name: name
          },
          {
            merge: true
          }
        );


        await loadUserProfile(
          user
        );


        profileModal.classList.remove(
          "show"
        );


      } catch (error) {

        console.error(error);

        document.getElementById(
          "profileMessage"
        ).textContent =
          error.message;

      }

    }
  );


// ======================================================
// DARK MODE
// ======================================================

document
  .getElementById(
    "darkModeBtn"
  )
  .addEventListener(
    "click",
    () => {

      document.body.classList.toggle(
        "dark-mode"
      );


      localStorage.setItem(
        "gitalkDarkMode",
        document.body.classList.contains(
          "dark-mode"
        )
      );

    }
  );


if (
  localStorage.getItem(
    "gitalkDarkMode"
  ) === "true"
) {

  document.body.classList.add(
    "dark-mode"
  );

}


// ======================================================
// SEARCH
// ======================================================

document
  .getElementById(
    "searchInput"
  )
  .addEventListener(
    "input",
    event => {

      const value =
        event.target.value
          .toLowerCase()
          .trim();


      document
        .querySelectorAll(
          ".post-card"
        )
        .forEach(post => {

          post.style.display =
            !value ||
            post.textContent
              .toLowerCase()
              .includes(value)
              ?
              ""
              :
              "none";

        });

    }
  );


// ======================================================
// EMPTY SETTINGS BUTTONS
// ======================================================

document
  .getElementById(
    "accountSettingsBtn"
  )
  .addEventListener(
    "click",
    () => {

      openPage("profilePage");

    }
  );


document
  .getElementById(
    "privacyBtn"
  )
  .addEventListener(
    "click",
    () => {

      alert(
        "Privacy controls will be added in the next step."
      );

    }
  );


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHTML(value) {

  if (value === null ||
      value === undefined) {

    return "";

  }


  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


// ======================================================
// GLOBAL MODAL CLOSE
// ======================================================

window.addEventListener(
  "click",
  event => {

    if (
      event.target === postModal
    ) {

      closePostModal();

    }


    if (
      event.target === profileModal
    ) {

      profileModal.classList.remove(
        "show"
      );

    }

  }
);


// ======================================================
// GITALK SOCIAL READY
// ======================================================

console.log(
  "Gitalk Social Firebase initialized successfully ❤️"
);
