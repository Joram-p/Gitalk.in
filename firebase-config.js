// ======================================================
// GITALK SOCIAL - COMPLETE SCRIPT.JS
// Firebase v12.1.0
// ======================================================

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
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  getDocs,
  where,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";


// ======================================================
// GLOBAL VARIABLES
// ======================================================

let currentUser = null;
let currentProfile = null;
let selectedPhoto = null;
let selectedVideo = null;
let feedUnsubscribe = null;


// ======================================================
// BASIC HELPERS
// ======================================================

function $(id) {
  return document.getElementById(id);
}

function setText(id, value) {
  const el = $(id);
  if (el) el.textContent = value ?? "";
}

function setImage(id, url) {
  const el = $(id);

  if (!el) return;

  if (url) {
    el.src = url;
  } else {
    el.src =
      "https://ui-avatars.com/api/?name=Gitalk&background=random&size=300";
  }
}

function escapeHTML(value) {
  if (value === undefined || value === null) return "";

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(timestamp) {
  if (!timestamp) return "Just now";

  let date;

  try {
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (typeof timestamp === "number") {
      date = new Date(timestamp);
    } else {
      date = new Date(timestamp);
    }
  } catch {
    return "Just now";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function showAuthMessage(message, type = "info") {
  const el = $("authMessage");

  if (!el) return;

  el.textContent = message;
  el.style.display = "block";

  if (type === "error") {
    el.style.color = "#d93025";
  } else if (type === "success") {
    el.style.color = "#188038";
  } else {
    el.style.color = "";
  }
}


// ======================================================
// AUTH SCREEN
// ======================================================

function showLogin() {
  const loginBox = $("loginBox");
  const signupBox = $("signupBox");

  if (loginBox) loginBox.style.display = "block";
  if (signupBox) signupBox.style.display = "none";

  showAuthMessage("");
}

function showSignup() {
  const loginBox = $("loginBox");
  const signupBox = $("signupBox");

  if (loginBox) loginBox.style.display = "none";
  if (signupBox) signupBox.style.display = "block";

  showAuthMessage("");
}


// ======================================================
// SIGN UP
// ======================================================

window.signup = async function () {

  const name = $("signupName")?.value.trim();
  const email = $("signupEmail")?.value.trim();
  const password = $("signupPassword")?.value;

  if (!name || !email || !password) {
    showAuthMessage("Please fill all fields.", "error");
    return;
  }

  if (password.length < 6) {
    showAuthMessage(
      "Password must be at least 6 characters.",
      "error"
    );
    return;
  }

  try {

    showAuthMessage("Creating your Gitalk account...");

    const result =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    const user = result.user;

    const cleanName =
      name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .substring(0, 15);

    const username =
      "@" +
      (cleanName || "user") +
      Math.floor(1000 + Math.random() * 9000);

    const profileData = {

      uid: user.uid,

      name: name,

      username: username,

      email: email,

      bio: "",

      location: "",

      website: "",

      photoURL: "",

      followersCount: 0,

      followingCount: 0,

      createdAt: serverTimestamp()

    };

    await setDoc(
      doc(db, "users", user.uid),
      profileData
    );

    showAuthMessage(
      "Account created successfully ❤️",
      "success"
    );

  } catch (error) {

    console.error("Signup Error:", error);

    showAuthMessage(
      firebaseErrorMessage(error),
      "error"
    );
  }
};


// ======================================================
// LOGIN
// ======================================================

window.login = async function () {

  const email = $("loginEmail")?.value.trim();
  const password = $("loginPassword")?.value;

  if (!email || !password) {
    showAuthMessage(
      "Please enter email and password.",
      "error"
    );
    return;
  }

  try {

    showAuthMessage("Logging in...");

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    showAuthMessage(
      "Login successful ❤️",
      "success"
    );

  } catch (error) {

    console.error("Login Error:", error);

    showAuthMessage(
      firebaseErrorMessage(error),
      "error"
    );
  }
};


// ======================================================
// LOGOUT
// ======================================================

window.logout = async function () {

  try {

    await signOut(auth);

  } catch (error) {

    console.error("Logout Error:", error);

    alert("Logout failed. Please try again.");

  }
};


// ======================================================
// FIREBASE ERROR MESSAGE
// ======================================================

function firebaseErrorMessage(error) {

  const code = error?.code || "";

  switch (code) {

    case "auth/invalid-email":
      return "Invalid email address.";

    case "auth/user-not-found":
      return "No account found with this email.";

    case "auth/wrong-password":
      return "Incorrect password.";

    case "auth/invalid-credential":
      return "Email or password is incorrect.";

    case "auth/email-already-in-use":
      return "This email is already registered.";

    case "auth/weak-password":
      return "Password is too weak.";

    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";

    case "auth/network-request-failed":
      return "Internet connection problem.";

    default:
      return error?.message || "Something went wrong.";
  }
}


// ======================================================
// AUTH STATE
// ======================================================

onAuthStateChanged(auth, async (user) => {

  currentUser = user;

  const authSection = $("authSection");
  const appSection = $("appSection");

  if (user) {

    if (authSection) {
      authSection.style.display = "none";
    }

    if (appSection) {
      appSection.style.display = "block";
    }

    setText("userEmail", user.email);

    await loadProfile(user.uid);

    startFeedListener();

    showPage("homePage");

  } else {

    if (authSection) {
      authSection.style.display = "block";
    }

    if (appSection) {
      appSection.style.display = "none";
    }

    if (feedUnsubscribe) {
      feedUnsubscribe();
      feedUnsubscribe = null;
    }

    currentProfile = null;

    showLogin();
  }

});


// ======================================================
// LOAD PROFILE
// ======================================================

async function loadProfile(uid) {

  try {

    const profileRef = doc(db, "users", uid);

    const snapshot = await getDoc(profileRef);

    if (!snapshot.exists()) {

      currentProfile = {
        uid: uid,
        name: currentUser?.email?.split("@")[0] || "Gitalk User",
        username: "@user",
        email: currentUser?.email || "",
        bio: "",
        location: "",
        website: "",
        photoURL: ""
      };

      return;
    }

    currentProfile = {
      uid: uid,
      ...snapshot.data()
    };

    updateProfileUI();

    await loadProfileStats(uid);

  } catch (error) {

    console.error("Load Profile Error:", error);

    showAuthMessage(
      "Profile could not be loaded.",
      "error"
    );
  }
}


// ======================================================
// UPDATE PROFILE UI
// ======================================================

function updateProfileUI() {

  if (!currentProfile) return;

  const p = currentProfile;

  setText(
    "profileName",
    p.name || "Gitalk User"
  );

  setText(
    "profileUsername",
    p.username || "@user"
  );

  setText(
    "profileBio",
    p.bio || "Welcome to Gitalk ❤️"
  );

  setText(
    "profileLocation",
    p.location || ""
  );

  setText(
    "profileWebsite",
    p.website || ""
  );

  setText(
    "homeUserName",
    p.name || "Gitalk User"
  );

  setText(
    "homeUsername",
    p.username || "@user"
  );

  setText(
    "editUserName",
    p.name || ""
  );

  setText(
    "editUsername",
    p.username || ""
  );

  setImage(
    "homePhoto",
    p.photoURL
  );

  setImage(
    "profilePhoto",
    p.photoURL
  );

  setImage(
    "editProfilePhoto",
    p.photoURL
  );

  const nameInput = $("nameInput");
  const usernameInput = $("usernameInput");
  const bioInput = $("bioInput");
  const locationInput = $("locationInput");
  const websiteInput = $("websiteInput");

  if (nameInput) {
    nameInput.value = p.name || "";
  }

  if (usernameInput) {
    usernameInput.value = p.username || "";
  }

  if (bioInput) {
    bioInput.value = p.bio || "";
  }

  if (locationInput) {
    locationInput.value = p.location || "";
  }

  if (websiteInput) {
    websiteInput.value = p.website || "";
  }
}


// ======================================================
// PROFILE PHOTO PREVIEW
// ======================================================

window.previewProfileImage = function (event) {

  const file =
    event?.target?.files?.[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {

    setText(
      "profileUploadStatus",
      "Please select an image file."
    );

    return;
  }

  if (file.size > 5 * 1024 * 1024) {

    setText(
      "profileUploadStatus",
      "Image must be under 5 MB."
    );

    event.target.value = "";

    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {

    setImage(
      "editProfilePhoto",
      e.target.result
    );

  };

  reader.readAsDataURL(file);

  setText(
    "profileUploadStatus",
    "Photo selected. Click Save Profile."
  );
};


// ======================================================
// SAVE PROFILE
// ======================================================

window.saveFirebaseProfile = async function () {

  if (!currentUser) {

    alert("Please login first.");

    return;
  }

  try {

    const name =
      $("nameInput")?.value.trim() || "";

    const username =
      $("usernameInput")?.value.trim() || "";

    const bio =
      $("bioInput")?.value.trim() || "";

    const location =
      $("locationInput")?.value.trim() || "";

    const website =
      $("websiteInput")?.value.trim() || "";

    if (!name) {

      setText(
        "profileUploadStatus",
        "Name is required."
      );

      return;
    }

    setText(
      "profileUploadStatus",
      "Saving profile..."
    );

    let photoURL =
      currentProfile?.photoURL || "";

    const file =
      $("profileImageInput")?.files?.[0];

    // Upload new profile image
    if (file) {

      const extension =
        file.name.split(".").pop();

      const storagePath =
        `profilePhotos/${currentUser.uid}/profile_${Date.now()}.${extension}`;

      const imageRef =
        ref(storage, storagePath);

      await uploadBytes(
        imageRef,
        file
      );

      photoURL =
        await getDownloadURL(imageRef);
    }

    const profileData = {

      uid: currentUser.uid,

      name: name,

      username:
        username ||
        currentProfile?.username ||
        "@user",

      email:
        currentUser.email || "",

      bio: bio,

      location: location,

      website: website,

      photoURL: photoURL,

      updatedAt: serverTimestamp()

    };

    await setDoc(
      doc(db, "users", currentUser.uid),
      profileData,
      { merge: true }
    );

    currentProfile = {
      ...currentProfile,
      ...profileData
    };

    updateProfileUI();

    const input = $("profileImageInput");

    if (input) {
      input.value = "";
    }

    setText(
      "profileUploadStatus",
      "Profile saved successfully ❤️"
    );

  } catch (error) {

    console.error(
      "Save Profile Error:",
      error
    );

    setText(
      "profileUploadStatus",
      "Profile save failed: " +
      error.message
    );
  }
};


// ======================================================
// SETTINGS
// ======================================================

window.saveSettings = async function () {

  if (!currentUser) return;

  try {

    const notifications =
      $("notificationsToggle")?.checked ?? true;

    const privateAccount =
      $("privateToggle")?.checked ?? false;

    const messages =
      $("messagesToggle")?.checked ?? true;

    await setDoc(
      doc(db, "users", currentUser.uid),
      {

        notificationsEnabled:
          notifications,

        privateAccount:
          privateAccount,

        messagesEnabled:
          messages,

        updatedAt:
          serverTimestamp()

      },
      { merge: true }
    );

    if (currentProfile) {

      currentProfile.notificationsEnabled =
        notifications;

      currentProfile.privateAccount =
        privateAccount;

      currentProfile.messagesEnabled =
        messages;
    }

    alert("Settings saved ❤️");

  } catch (error) {

    console.error(
      "Settings Error:",
      error
    );

    alert(
      "Settings save failed: " +
      error.message
    );
  }
};


// ======================================================
// DARK MODE
// ======================================================

window.toggleDarkMode = function () {

  const toggle =
    $("darkToggle");

  const enabled =
    toggle?.checked || false;

  document.body.classList.toggle(
    "darkMode",
    enabled
  );

  localStorage.setItem(
    "gitalkDarkMode",
    enabled ? "true" : "false"
  );

};


// Restore dark mode
(function restoreDarkMode() {

  const enabled =
    localStorage.getItem(
      "gitalkDarkMode"
    ) === "true";

  if (enabled) {

    document.body.classList.add(
      "darkMode"
    );

    setTimeout(() => {

      const toggle =
        $("darkToggle");

      if (toggle) {
        toggle.checked = true;
      }

    }, 100);
  }

})();


// ======================================================
// LOAD SETTINGS
// ======================================================

function loadSettings() {

  if (!currentProfile) return;

  const notificationToggle =
    $("notificationsToggle");

  const privateToggle =
    $("privateToggle");

  const messagesToggle =
    $("messagesToggle");

  const darkToggle =
    $("darkToggle");

  if (notificationToggle) {

    notificationToggle.checked =
      currentProfile.notificationsEnabled !== false;
  }

  if (privateToggle) {

    privateToggle.checked =
      currentProfile.privateAccount === true;
  }

  if (messagesToggle) {

    messagesToggle.checked =
      currentProfile.messagesEnabled !== false;
  }

  if (darkToggle) {

    darkToggle.checked =
      document.body.classList.contains(
        "darkMode"
      );
  }
}


// ======================================================
// PAGE NAVIGATION
// ======================================================

window.showPage = function (pageId) {

  const pages =
    document.querySelectorAll(
      ".appPage"
    );

  pages.forEach(page => {

    page.style.display =
      page.id === pageId
        ? "block"
        : "none";

  });

  if (pageId === "settingsPage") {

    loadSettings();
  }

  if (pageId === "profilePage") {

    loadProfileStats(
      currentUser?.uid
    );
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

};


// ======================================================
// CREATE POST - PHOTO SELECT
// ======================================================

window.handlePhotoSelect = function (event) {

  const file =
    event?.target?.files?.[0];

  if (!file) return;

  selectedPhoto = file;
  selectedVideo = null;

  const videoInput =
    $("videoInput");

  if (videoInput) {
    videoInput.value = "";
  }

  if (!file.type.startsWith("image/")) {

    selectedPhoto = null;

    setText(
      "uploadStatus",
      "Please select a valid image."
    );

    return;
  }

  if (file.size > 10 * 1024 * 1024) {

    selectedPhoto = null;

    if (event.target) {
      event.target.value = "";
    }

    setText(
      "uploadStatus",
      "Photo must be under 10 MB."
    );

    return;
  }

  setText(
    "uploadStatus",
    `Photo selected: ${file.name}`
  );
};


// ======================================================
// CREATE POST - VIDEO SELECT
// ======================================================

window.handleVideoSelect = function (event) {

  const file =
    event?.target?.files?.[0];

  if (!file) return;

  selectedVideo = file;
  selectedPhoto = null;

  const photoInput =
    $("photoInput");

  if (photoInput) {
    photoInput.value = "";
  }

  if (!file.type.startsWith("video/")) {

    selectedVideo = null;

    setText(
      "uploadStatus",
      "Please select a valid video."
    );

    return;
  }

  if (file.size > 100 * 1024 * 1024) {

    selectedVideo = null;

    if (event.target) {
      event.target.value = "";
    }

    setText(
      "uploadStatus",
      "Video must be under 100 MB."
    );

    return;
  }

  setText(
    "uploadStatus",
    `Video selected: ${file.name}`
  );
};


// ======================================================
// CREATE POST
// ======================================================

window.createPost = async function () {

  if (!currentUser) {

    alert("Please login first.");

    return;
  }

  const text =
    $("postText")?.value.trim() || "";

  if (
    !text &&
    !selectedPhoto &&
    !selectedVideo
  ) {

    setText(
      "uploadStatus",
      "Write something or select a photo/video."
    );

    return;
  }

  const createButton =
    document.querySelector(
      ".createBtn"
    );

  try {

    if (createButton) {
      createButton.disabled = true;
      createButton.textContent =
        "Posting...";
    }

    setText(
      "uploadStatus",
      "Uploading..."
    );

    let mediaUrl = "";
    let mediaType = "";

    const file =
      selectedPhoto || selectedVideo;

    if (file) {

      const extension =
        file.name.split(".").pop();

      const path =
        `posts/${currentUser.uid}/${Date.now()}_${Math.random()
          .toString(36)
          .substring(2)}.${extension}`;

      const mediaRef =
        ref(storage, path);

      await uploadBytes(
        mediaRef,
        file
      );

      mediaUrl =
        await getDownloadURL(mediaRef);

      mediaType =
        selectedPhoto
          ? "image"
          : "video";
    }

    const profile =
      currentProfile || {};

    await addDoc(
      collection(db, "posts"),
      {

        uid:
          currentUser.uid,

   
