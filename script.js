// ======================================================
// GITALK SOCIAL - COMPLETE SCRIPT
// Login / Register / Profile / Posts / Photo Upload
// Edit / Delete / Like / Comment / Share
// ======================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
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
// INITIALIZE
// ======================================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


// ======================================================
// HELPERS
// ======================================================

const $ = id => document.getElementById(id);

function escapeHTML(text = "") {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showMessage(message) {
  alert(message);
}


// ======================================================
// AUTH ELEMENTS
// ======================================================

const authPage = $("authPage");
const socialPage = $("socialPage");

const loginBox = $("loginBox");
const registerBox = $("registerBox");


// ======================================================
// LOGIN
// ======================================================

if ($("loginBtn")) {

  $("loginBtn").onclick = async () => {

    const email = $("loginEmail").value.trim();
    const password = $("loginPassword").value;

    if (!email || !password) {
      showMessage("Email और password डालें.");
      return;
    }

    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      $("loginEmail").value = "";
      $("loginPassword").value = "";

    } catch (error) {

      showMessage(error.message);

    }

  };

}


// ======================================================
// REGISTER
// ======================================================

if ($("registerBtn")) {

  $("registerBtn").onclick = async () => {

    const name = $("registerName").value.trim();
    const email = $("registerEmail").value.trim();
    const password = $("registerPassword").value;

    if (!name || !email || !password) {
      showMessage("सभी details भरें.");
      return;
    }

    if (password.length < 6) {
      showMessage("Password कम से कम 6 characters का होना चाहिए.");
      return;
    }

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
          bio: "",
          photoURL: "",
          coverURL: "",
          followers: [],
          following: [],
          createdAt: serverTimestamp()
        },
        {
          merge: true
        }
      );

      showMessage("Account successfully created ❤️");

      $("registerName").value = "";
      $("registerEmail").value = "";
      $("registerPassword").value = "";

    } catch (error) {

      showMessage(error.message);

    }

  };

}


// ======================================================
// SWITCH LOGIN / REGISTER
// ======================================================

if ($("showRegister")) {

  $("showRegister").onclick = () => {

    loginBox.style.display = "none";
    registerBox.style.display = "block";

  };

}


if ($("showLogin")) {

  $("showLogin").onclick = () => {

    registerBox.style.display = "none";
    loginBox.style.display = "block";

  };

}


// ======================================================
// AUTH STATE
// ======================================================

onAuthStateChanged(auth, async user => {

  if (user) {

    authPage.style.display = "none";
    socialPage.style.display = "block";

    await loadUser();
    await loadFeed();

  } else {

    authPage.style.display = "block";
    socialPage.style.display = "none";

  }

});


// ======================================================
// LOAD USER
// ======================================================

async function loadUser() {

  const user = auth.currentUser;

  if (!user) return;

  const userRef = doc(
    db,
    "users",
    user.uid
  );

  const snap = await getDoc(userRef);

  let data = {};

  if (snap.exists()) {

    data = snap.data();

  }

  const name =
    data.name ||
    user.displayName ||
    "Gitalk User";

  const photo =
    data.photoURL ||
    user.photoURL ||
    "";

  if ($("userName")) {
    $("userName").textContent = name;
  }

  if ($("profileName")) {
    $("profileName").value = name;
  }

  if ($("profileEmail")) {
    $("profileEmail").value =
      data.email || user.email || "";
  }

  if ($("profileBio")) {
    $("profileBio").value =
      data.bio || "";
  }

  setAvatar(
    $("userAvatar"),
    photo,
    name
  );

  setAvatar(
    $("profileAvatar"),
    photo,
    name
  );

  if ($("profileFollowers")) {
    $("profileFollowers").textContent =
      (data.followers || []).length;
  }

  if ($("profileFollowing")) {
    $("profileFollowing").textContent =
      (data.following || []).length;
  }

}


// ======================================================
// AVATAR
// ======================================================

function setAvatar(element, photoURL, name) {

  if (!element) return;

  if (photoURL) {

    element.innerHTML = `
      <img
        src="${escapeHTML(photoURL)}"
        style="
          width:100%;
          height:100%;
          object-fit:cover;
          border-radius:50%;
        "
      >
    `;

  } else {

    element.textContent =
      name
        ? name.charAt(0).toUpperCase()
        : "G";

  }

}


// ======================================================
// CREATE POST
// ======================================================

if ($("postBtn")) {

  $("postBtn").onclick = createPost;

}


async function createPost() {

  const user = auth.currentUser;

  if (!user) return;

  const text =
    $("postText")?.value.trim() || "";

  const photoInput =
    $("postImage");

  const file =
    photoInput?.files?.[0];

  if (!text && !file) {

    showMessage(
      "Post में text या photo डालें."
    );

    return;

  }

  try {

    let imageURL = "";

    if (file) {

      if (!file.type.startsWith("image/")) {

        showMessage(
          "केवल image upload करें."
        );

        return;

      }

      if (file.size > 10 * 1024 * 1024) {

        showMessage(
          "Image maximum 10MB हो सकती है."
        );

        return;

      }

      const fileName =
        Date.now() + "_" +
        file.name.replace(/\s+/g, "_");

      const imageRef =
        ref(
          storage,
          `posts/${user.uid}/${fileName}`
        );

      await uploadBytes(
        imageRef,
        file
      );

      imageURL =
        await getDownloadURL(imageRef);

    }

    const userSnap =
      await getDoc(
        doc(db, "users", user.uid)
      );

    const userData =
      userSnap.exists()
        ? userSnap.data()
        : {};

    await addDoc(
      collection(db, "posts"),
      {
        uid: user.uid,
        name:
          userData.name ||
          user.displayName ||
          "Gitalk User",

        photoURL:
          userData.photoURL ||
          user.photoURL ||
          "",

        text: text,
        imageURL: imageURL,

        likes: [],
        comments: [],

        createdAt:
          serverTimestamp()
      }
    );

    if ($("postText")) {
      $("postText").value = "";
    }

    if ($("postImage")) {
      $("postImage").value = "";
    }

    await loadFeed();

    showMessage(
      "Post published ❤️"
    );

  } catch (error) {

    console.error(error);
    showMessage(error.message);

  }

}


// ======================================================
// LOAD FEED
// ======================================================

async function loadFeed() {

  const feed =
    $("feed");

  if (!feed) return;

  feed.innerHTML =
    "<p>Loading posts...</p>";

  try {

    const postsQuery =
      query(
        collection(db, "posts"),
        orderBy(
          "createdAt",
          "desc"
        )
      );

    const snapshot =
      await getDocs(postsQuery);

    feed.innerHTML = "";

    if (snapshot.empty) {

      feed.innerHTML = `
        <div class="post">
          <p>अभी कोई post नहीं है ❤️</p>
        </div>
      `;

      return;

    }

    snapshot.forEach(postDoc => {

      renderPost(
        feed,
        postDoc.id,
        postDoc.data()
      );

    });

  } catch (error) {

    console.error(error);

    feed.innerHTML = `
      <div class="post">
        <p>Posts load नहीं हो सके.</p>
      </div>
    `;

  }

}


// ======================================================
// RENDER POST
// ======================================================

function renderPost(
  container,
  postId,
  post
) {

  const user =
    auth.currentUser;

  const likes =
    post.likes || [];

  const comments =
    post.comments || [];

  const liked =
    user &&
    likes.includes(user.uid);

  const ownPost =
    user &&
    user.uid === post.uid;

  const avatar =
    post.photoURL
      ? `
        <img
          src="${escapeHTML(post.photoURL)}"
          style="
            width:45px;
            height:45px;
            border-radius:50%;
            object-fit:cover;
          "
        >
      `
      : `
        <div class="avatar">
          ${escapeHTML(
            (post.name || "G")
              .charAt(0)
              .toUpperCase()
          )}
        </div>
      `;

  const div =
    document.createElement("div");

  div.className = "post";

  div.innerHTML = `

    <div class="post-header">

      ${avatar}

      <div>
        <strong>
          ${escapeHTML(
            post.name || "Gitalk User"
          )}
        </strong>

        <small>
          Gitalk Social
        </small>
      </div>

      ${
        ownPost
          ? `
            <div style="margin-left:auto">
              <button
                onclick="editPost('${postId}')"
              >
                ✏️
              </button>

              <button
                onclick="deletePost('${postId}')"
              >
                🗑️
              </button>
            </div>
          `
          : ""
      }

    </div>

    ${
      post.text
        ? `
          <p class="post-text">
            ${escapeHTML(post.text)}
          </p>
        `
        : ""
    }

    ${
      post.imageURL
        ? `
          <img
            class="post-image"
            src="${escapeHTML(post.imageURL)}"
            alt="Post image"
          >
        `
        : ""
    }

    <div class="post-actions">

      <button
        onclick="toggleLike('${postId}')"
      >
        ${liked ? "❤️" : "🤍"}
        ${likes.length}
      </button>

      <button
        onclick="showComments('${postId}')"
      >
        💬 ${comments.length}
      </button>

      <button
        onclick="sharePost('${postId}')"
      >
        🔗 Share
      </button>

    </div>

    <div
      id="comments-${postId}"
      class="comments"
    ></div>

  `;

  container.appendChild(div);

}


// ======================================================
// LIKE
// ======================================================

window.toggleLike =
  async function(postId) {

    const user =
      auth.currentUser;

    if (!user) return;

    const postRef =
      doc(db, "posts", postId);

    const snap =
      await getDoc(postRef);

    if (!snap.exists()) return;

    const post =
      snap.data();

    const likes =
      post.likes || [];

    if (likes.includes(user.uid)) {

      await updateDoc(
        postRef,
        {
          likes:
            arrayRemove(user.uid)
        }
      );

    } else {

      await updateDoc(
        postRef,
        {
          likes:
            arrayUnion(user.uid)
        }
      );

    }

    await loadFeed();

  };


// ======================================================
// COMMENTS
// ======================================================

window.showComments =
  async function(postId) {

    const box =
      $(`comments-${postId}`);

    if (!box) return;

    const comment =
      prompt(
        "अपना comment लिखें:"
      );

    if (!comment || !comment.trim()) {
      return;
    }

    const user =
      auth.currentUser;

    if (!user) return;

    const userSnap =
      await getDoc(
        doc(db, "users", user.uid)
      );

    const userData =
      userSnap.exists()
        ? userSnap.data()
        : {};

    const commentObject = {

      uid: user.uid,

      name:
        userData.name ||
        user.displayName ||
        "Gitalk User",

      text:
        comment.trim(),

      time:
        new Date().toISOString()

    };

    await updateDoc(
      doc(db, "posts", postId),
      {
        comments:
          arrayUnion(commentObject)
      }
    );

    await loadFeed();

  };


// ======================================================
// SHARE
// ======================================================

window.sharePost =
  async function(postId) {

    const shareURL =
      window.location.origin +
      window.location.pathname +
      "?post=" +
      postId;

    if (
      navigator.share
    ) {

      try {

        await navigator.share({
          title: "Gitalk Social",
          text: "Check this post on Gitalk Social",
          url: shareURL
        });

      } catch (error) {}

    } else {

      try {

        await navigator.clipboard.writeText(
          shareURL
        );

        showMessage(
          "Post link copied ❤️"
        );

      } catch (error) {

        prompt(
          "Copy this link:",
          shareURL
        );

      }

    }

  };


// ======================================================
// DELETE POST
// ======================================================

window.deletePost =
  async function(postId) {

    const user =
      auth.currentUser;

    if (!user) return;

    const postRef =
      doc(db, "posts", postId);

    const snap =
      await getDoc(postRef);

    if (!snap.exists()) return;

    const post =
      snap.data();

    if (post.uid !== user.uid) {

      showMessage(
        "आप केवल अपना post delete कर सकते हैं."
      );

      return;

    }

    const confirmDelete =
      confirm(
        "क्या आप यह post delete करना चाहते हैं?"
      );

    if (!confirmDelete) return;

    try {

      if (post.imageURL) {

        try {

          const imageRef =
            ref(
              storage,
              post.imageURL
            );

          await deleteObject(
            imageRef
          );

        } catch (error) {

          console.log(
            "Image delete skipped"
          );

        }

      }

      await deleteDoc(postRef);

      await loadFeed();

      showMessage(
        "Post deleted."
      );

    } catch (error) {

      showMessage(
        error.message
      );

    }

  };


// ======================================================
// EDIT POST
// ======================================================

window.editPost =
  async function(postId) {

    const user =
      auth.currentUser;

    if (!user) return;

    const postRef =
      doc(db, "posts", postId);

    const snap =
      await getDoc(postRef);

    if (!snap.exists()) return;

    const post =
      snap.data();

    if (post.uid !== user.uid) {

      showMessage(
        "आप केवल अपना post edit कर सकते हैं."
      );

      return;

    }

    const newText =
      prompt(
        "Post edit करें:",
        post.text || ""
      );

    if (
      newText === null
    ) {
      return;
    }

    await updateDoc(
      postRef,
      {
        text: newText.trim()
      }
    );

    await loadFeed();

  };


// ======================================================
// PROFILE OPEN
// ======================================================

if ($("profileBtn")) {

  $("profileBtn").onclick =
    async () => {

      const modal =
        $("profileModal");

      if (modal) {

        modal.style.display =
          "flex";

        await loadUser();
        await loadMyPosts();

      }

    };

}


// ======================================================
// PROFILE PHOTO PREVIEW
// ======================================================

if ($("profilePhoto")) {

  $("profilePhoto").onchange =
    event => {

      const file =
        event.target.files[0];

      if (!file) return;

      if (!file.type.startsWith("image/")) {

        showMessage(
          "केवल image select करें."
        );

        return;

      }

      const url =
        URL.createObjectURL(file);

      if ($("profileAvatar")) {

        $("profileAvatar").innerHTML = `
          <img
            src="${url}"
            style="
              width:100%;
              height:100%;
              border-radius:50%;
              object-fit:cover;
            "
          >
        `;

      }

    };

}


// ======================================================
// SAVE PROFILE
// ======================================================

if ($("saveProfileBtn")) {

  $("saveProfileBtn").onclick =
    saveProfile;

}


async function saveProfile() {

  const user =
    auth.currentUser;

  if (!user) return;

  const name =
    $("profileName")?.value.trim()
    || "Gitalk User";

  const bio =
    $("profileBio")?.value.trim()
    || "";

  const photoFile =
    $("profilePhoto")?.files?.[0];

  try {

    let photoURL = "";

    const oldSnap =
      await getDoc(
        doc(db, "users", user.uid)
      );

    const oldData =
      oldSnap.exists()
        ? oldSnap.data()
        : {};

    photoURL =
      oldData.photoURL ||
      user.photoURL ||
      "";

    if (photoFile) {

      if (photoFile.size > 10 * 1024 * 1024) {

        showMessage(
          "Profile photo maximum 10MB हो सकती है."
        );

        return;

      }

      const fileName =
        Date.now() +
        "_" +
        photoFile.name.replace(
          /\s+/g,
          "_"
        );

      const photoRef =
        ref(
          storage,
          `profiles/${user.uid}/${fileName}`
        );

      await uploadBytes(
        photoRef,
        photoFile
      );

      photoURL =
        await getDownloadURL(
          photoRef
        );

    }

    await updateProfile(
      user,
      {
        displayName: name,
        photoURL: photoURL
      }
    );

    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        name: name,
  email: user.email,
        bio: bio,
        photoURL: photoURL,
        updatedAt: serverTimestamp()
      },
      {
        merge: true
      }
    );

    await loadUser();
    await loadFeed();

    showMessage(
      "Profile updated successfully ❤️"
    );

  } catch (error) {

    console.error(error);

    showMessage(
      error.message
    );

  }

}


// ======================================================
// MY POSTS
// ======================================================
		  async function loadMyPosts() {

  const user =
    auth.currentUser;

  const box =
    $("myPosts");

  if (!user || !box) return;

  box.innerHTML =
    "<p>Loading your posts...</p>";

  try {

    const snapshot =
      await getDocs(
        collection(db, "posts")
      );

    box.innerHTML = "";

    let count = 0;

    snapshot.forEach(
      postDoc => {

        const post =
          postDoc.data();

        if (
          post.uid === user.uid
        ) {

          count++;

          const div =
            document.createElement(
              "div"
            );

          div.className =
            "post";

          div.innerHTML = `

            ${
              post.text
                ? `
                  <p>
                    ${escapeHTML(
                      post.text
                    )}
                  </p>
                `
                : ""
            }

            ${
              post.imageURL
                ? `
                  <img
                    src="${escapeHTML(
                      post.imageURL
                    )}"
                    style="
                      width:100%;
                      border-radius:12px;
                      margin-top:10px;
                    "
                  >
                `
                : ""
            }

            <div
              style="
                margin-top:10px;
                display:flex;
                gap:8px;
              "
            >

              <button
                onclick="editPost('${postDoc.id}')"
              >
                ✏️ Edit
              </button>

              <button
                onclick="deletePost('${postDoc.id}')"
              >
                🗑️ Delete
              </button>

            </div>

          `;

          box.appendChild(div);

        }

      }
    );

    if (count === 0) {

      box.innerHTML =
        "<p>आपने अभी कोई post नहीं बनाया.</p>";

    }

  } catch (error) {

    console.error(error);

    box.innerHTML =
      "<p>My Posts load नहीं हुए.</p>";

  }

}


// ======================================================
// CLOSE PROFILE
// ======================================================

if ($("closeProfile")) {

  $("closeProfile").onclick =
    () => {

      const modal =
        $("profileModal");

      if (modal) {

        modal.style.display =
          "none";

      }

    };

}


// ======================================================
// LOGOUT
// ======================================================

if ($("logoutBtn")) {

  $("logoutBtn").onclick =
    async () => {

      try {

        await signOut(auth);

      } catch (error) {

        showMessage(
          error.message
        );

      }

    };

	}
