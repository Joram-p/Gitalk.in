/* =====================================================
   GITALK SOCIAL
   Firebase Auth + Firestore + Storage
   ===================================================== */

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-storage.js";


/* =====================================================
   FIREBASE CONFIG
   ===================================================== */

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


/* =====================================================
   INITIALIZE FIREBASE
   ===================================================== */

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);

let currentUser = null;

let signupMode = false;


/* =====================================================
   AUTH MODE
   ===================================================== */

window.toggleAuth = function () {

  signupMode = !signupMode;

  const title =
    document.getElementById("authTitle");

  const button =
    document.getElementById("authButton");

  const switchText =
    document.getElementById("switchAuth");

  const message =
    document.getElementById("authMessage");

  message.innerText = "";

  if (signupMode) {

    title.innerText =
      "Create Gitalk Account";

    button.innerText =
      "Sign Up";

    button.onclick =
      window.signup;

    switchText.innerText =
      "Already have an account? Login";

  } else {

    title.innerText =
      "Login to Gitalk";

    button.innerText =
      "Login";

    button.onclick =
      window.login;

    switchText.innerText =
      "Create new account";
  }
};


/* =====================================================
   SIGN UP
   ===================================================== */

window.signup = async function () {

  const email =
    document.getElementById("email")
      .value.trim();

  const password =
    document.getElementById("password")
      .value;


  if (!email || !password) {

    showAuthMessage(
      "Email और password डालें."
    );

    return;
  }


  if (password.length < 6) {

    showAuthMessage(
      "Password कम से कम 6 characters का होना चाहिए."
    );

    return;
  }


  try {

    showAuthMessage(
      "Account बनाया जा रहा है..."
    );


    const result =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );


    const user =
      result.user;


    /* USER PROFILE */

    await setDoc(
      doc(db, "users", user.uid),
      {

        uid: user.uid,

        email: user.email,

        displayName:
          "Gitalk User",

        photoURL: "",

        createdAt:
          serverTimestamp()
      }
    );


    showAuthMessage(
      "Account successfully created ❤️"
    );


  } catch (error) {

    console.error(error);

    showAuthMessage(
      getFriendlyError(error)
    );
  }
};


/* =====================================================
   LOGIN
   ===================================================== */

window.login = async function () {

  const email =
    document.getElementById("email")
      .value.trim();

  const password =
    document.getElementById("password")
      .value;


  if (!email || !password) {

    showAuthMessage(
      "Email और password डालें."
    );

    return;
  }


  try {

    showAuthMessage(
      "Login हो रहा है..."
    );


    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );


    showAuthMessage(
      "Login successful ❤️"
    );


  } catch (error) {

    console.error(error);

    showAuthMessage(
      getFriendlyError(error)
    );
  }
};


/* =====================================================
   LOGOUT
   ===================================================== */

window.logout = async function () {

  try {

    await signOut(auth);

  } catch (error) {

    alert(
      getFriendlyError(error)
    );
  }
};


/* =====================================================
   AUTH STATE
   ===================================================== */

onAuthStateChanged(
  auth,
  async function (user) {

    currentUser = user;

    const authSection =
      document.getElementById("authSection");

    const appSection =
      document.getElementById("appSection");

    const logoutBtn =
      document.getElementById("logoutBtn");

    const userEmail =
      document.getElementById("userEmail");


    if (user) {

      authSection.style.display =
        "none";

      appSection.style.display =
        "block";

      logoutBtn.style.display =
        "inline-block";

      userEmail.innerText =
        user.email;

      loadPosts();

    } else {

      authSection.style.display =
        "block";

      appSection.style.display =
        "none";

      logoutBtn.style.display =
        "none";

      userEmail.innerText =
        "";

      currentUser = null;
    }
  }
);


/* =====================================================
   CREATE TEXT POST
   ===================================================== */

window.createPost = async function () {

  if (!currentUser) {

    alert("Please login first.");

    return;
  }


  const textarea =
    document.getElementById("postText");

  const text =
    textarea.value.trim();


  if (!text) {

    alert(
      "Post में कुछ लिखें."
    );

    return;
  }


  try {

    setStatus(
      "Post publish हो रहा है..."
    );


    await addDoc(
      collection(db, "posts"),
      {

        uid:
          currentUser.uid,

        email:
          currentUser.email,

        text:
          text,

        mediaType:
          "",

        mediaUrl:
          "",

        contentType:
          "",

        createdAt:
          serverTimestamp()
      }
    );


    textarea.value = "";

    setStatus(
      "Post published successfully ❤️",
      false,
      true
    );


  } catch (error) {

    console.error(error);

    setStatus(
      getFriendlyError(error),
      true
    );
  }
};


/* =====================================================
   PHOTO SELECT
   ===================================================== */

window.selectPhoto = function () {

  const input =
    document.getElementById("photoInput");

  if (!input) {

    alert(
      "Photo input नहीं मिला."
    );

    return;
  }

  input.click();
};


/* =====================================================
   VIDEO SELECT
   ===================================================== */

window.selectVideo = function () {

  const input =
    document.getElementById("videoInput");

  if (!input) {

    alert(
      "Video input नहीं मिला."
    );

    return;
  }

  input.click();
};


/* =====================================================
   PHOTO UPLOAD
   ===================================================== */

window.handlePhoto = async function (event) {

  const file =
    event.target.files[0];


  if (!file) {

    return;
  }


  if (!currentUser) {

    alert(
      "Please login first."
    );

    return;
  }


  /* CHECK IMAGE */

  if (!file.type.startsWith("image/")) {

    alert(
      "Please select an image."
    );

    event.target.value = "";

    return;
  }


  /* 10 MB LIMIT */

  if (
    file.size >
    10 * 1024 * 1024
  ) {

    alert(
      "Photo 10 MB से छोटी होनी चाहिए."
    );

    event.target.value = "";

    return;
  }


  try {

    setStatus(
      "📤 Photo upload हो रही है..."
    );


    const safeName =
      createSafeFileName(
        file.name
      );


    const filePath =
      "posts/" +
      currentUser.uid +
      "/" +
      Date.now() +
      "_" +
      safeName;


    const storageRef =
      ref(
        storage,
        filePath
      );


    /* UPLOAD */

    await uploadBytes(
      storageRef,
      file,
      {
        contentType:
          file.type
      }
    );


    setStatus(
      "Photo upload हो गई... Post बनाया जा रहा है..."
    );


    /* DOWNLOAD URL */

    const downloadURL =
      await getDownloadURL(
        storageRef
      );


    const caption =
      document.getElementById(
        "postText"
      ).value.trim();


    /* FIRESTORE POST */

    await addDoc(
      collection(db, "posts"),
      {

        uid:
          currentUser.uid,

        email:
          currentUser.email,

        text:
          caption,

        mediaType:
          "image",

        mediaUrl:
          downloadURL,

        contentType:
          file.type,

        createdAt:
          serverTimestamp()
      }
    );


    document.getElementById(
      "postText"
    ).value = "";


    event.target.value = "";


    setStatus(
      "✅ Photo posted successfully ❤️",
      false,
      true
    );


  } catch (error) {

    console.error(
      "PHOTO UPLOAD ERROR:",
      error
    );


    setStatus(
      getFriendlyError(error),
      true
    );


    event.target.value = "";
  }
};


/* =====================================================
   VIDEO UPLOAD
   ===================================================== */

window.handleVideo = async function (event) {

  const file =
    event.target.files[0];


  if (!file) {

    return;
  }


  if (!currentUser) {

    alert(
      "Please login first."
    );

    return;
  }


  /* CHECK VIDEO */

  if (!file.type.startsWith("video/")) {

    alert(
      "Please select a video."
    );

    event.target.value = "";

    return;
  }


  /* 50 MB LIMIT */

  if (
    file.size >
    50 * 1024 * 1024
  ) {

    alert(
      "Video 50 MB से छोटी होनी चाहिए."
    );

    event.target.value = "";

    return;
  }


  try {

    setStatus(
      "📤 Video upload हो रही है..."
    );


    const safeName =
      createSafeFileName(
        file.name
      );


    const filePath =
      "posts/" +
      currentUser.uid +
      "/" +
      Date.now() +
      "_" +
      safeName;


    const storageRef =
      ref(
        storage,
        filePath
      );


    await uploadBytes(
      storageRef,
      file,
      {
        contentType:
          file.type
      }
    );


    setStatus(
      "Video upload हो गई... Post बनाया जा रहा है..."
    );


    const downloadURL =
      await getDownloadURL(
        storageRef
      );


    const caption =
      document.getElementById(
        "postText"
      ).value.trim();


    await addDoc(
      collection(db, "posts"),
      {

        uid:
          currentUser.uid,

        email:
          currentUser.email,

        text:
          caption,

        mediaType:
          "video",

        mediaUrl:
          downloadURL,

        contentType:
          file.type,

        createdAt:
          serverTimestamp()
      }
    );


    document.getElementById(
      "postText"
    ).value = "";


    event.target.value = "";


    setStatus(
      "✅ Video posted successfully ❤️",
      false,
      true
    );


  } catch (error) {

    console.error(
      "VIDEO UPLOAD ERROR:",
      error
    );


    setStatus(
      getFriendlyError(error),
      true
    );


    event.target.value = "";
  }
};


/* =====================================================
   LOAD POSTS
   ===================================================== */

let postsUnsubscribe = null;

function loadPosts() {

  if (postsUnsubscribe) {

    postsUnsubscribe();
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


  postsUnsubscribe =
    onSnapshot(
      postsQuery,
      function (snapshot) {

        feed.innerHTML = "";


        if (snapshot.empty) {

          feed.innerHTML =
            `
            <div class="emptyFeed">
              <h3>Welcome to Gitalk Social ❤️</h3>
              <p>Be the first person to create a post.</p>
            </div>
            `;

          return;
        }


        snapshot.forEach(
          function (docSnapshot) {

            const post =
              {
                id:
                  docSnapshot.id,

                ...docSnapshot.data()
              };


            feed.appendChild(
              createPostElement(post)
            );
          }
        );

      },

      function (error) {

        console.error(error);

        feed.innerHTML =
          `
          <div class="emptyFeed">
            ⚠️ Feed load error<br><br>
            ${escapeHTML(
              getFriendlyError(error)
            )}
          </div>
          `;
      }
    );
}


/* =====================================================
   CREATE POST HTML
   ===================================================== */

function createPostElement(post) {

  const article =
    document.createElement("article");

  article.className =
    "post";


  const date =
    formatDate(
      post.createdAt
    );


  let mediaHTML = "";


  /* IMAGE */

  if (
    post.mediaType === "image" &&
    post.mediaUrl
  ) {

    mediaHTML =
      `
      <img
        src="${escapeAttribute(post.mediaUrl)}"
        alt="Gitalk post image"
        loading="lazy"
      >
      `;
  }


  /* VIDEO */

  if (
    post.mediaType === "video" &&
    post.mediaUrl
  ) {

    mediaHTML =
      `
      <video
        controls
        playsinline
        preload="metadata"
      >
        <source
          src="${escapeAttribute(post.mediaUrl)}"
          type="${escapeAttribute(
            post.contentType || "video/mp4"
          )}"
        >
        Your browser does not support video.
      </video>
      `;
  }


  article.innerHTML =
    `
    <div class="postHeader">

      <div class="postUser">
        👤 ${escapeHTML(
          post.email || "Gitalk User"
        )}
      </div>

      <div class="postDate">
        ${escapeHTML(date)}
      </div>

    </div>


    ${
      post.text
        ?
        `
        <div class="postText">
          ${escapeHTML(post.text)}
        </div>
        `
        :
        ""
    }


    ${mediaHTML}


    <div class="postActions">

      <button
        class="likeBtn"
        data-post-id="${escapeAttribute(post.id)}"
      >
        ❤️ Like
      </button>

      <button
        class="commentBtn"
        data-post-id="${escapeAttribute(post.id)}"
      >
        💬 Comment
      </button>

      <button
        class="shareBtn"
        data-post-id="${escapeAttribute(post.id)}"
      >
        🔗 Share
      </button>

    </div>


    <div
      class="comments"
      id="comments-${escapeAttribute(post.id)}"
    ></div>
    `;


  /* LIKE */

  const likeButton =
    article.querySelector(
      ".likeBtn"
    );

  likeButton.onclick =
    function () {

      likePost(post.id);
    };


  /* COMMENT */

  const commentButton =
    article.querySelector(
      ".commentBtn"
    );

  commentButton.onclick =
    function () {

      commentPost(post.id);
    };


  /* SHARE */

  const shareButton =
    article.querySelector(
      ".shareBtn"
    );

  shareButton.onclick =
    function () {

      sharePost(post);
    };


  /* LOAD COMMENTS */

  loadComments(
    post.id,
    article.querySelector(".comments")
  );


  return article;
}


/* =====================================================
   LIKE SYSTEM
   ===================================================== */

async function likePost(postId) {

  if (!currentUser) {

    alert(
      "Please login first."
    );

    return;
  }


  try {

    const likeRef =
      doc(
        db,
        "posts",
        postId,
        "likes",
        currentUser.uid
      );


    const existing =
      await getDoc(
        likeRef
      );


    if (existing.exists()) {

      /* UNLIKE */

      await deleteDoc(
        likeRef
      );

    } else {

      /* LIKE */

      await setDoc(
        likeRef,
        {

          uid:
            currentUser.uid,

          email:
            currentUser.email,

          createdAt:
            serverTimestamp()
        }
      );
    }


  } catch (error) {

    console.error(error);

    alert(
      getFriendlyError(error)
    );
  }
}


/* =====================================================
   COMMENT
   ===================================================== */

async function commentPost(postId) {

  if (!currentUser) {

    alert(
      "Please login first."
    );

    return;
  }


  const text =
    prompt(
      "Write your comment:"
    );


  if (!text) {

    return;
  }


  const cleanText =
    text.trim();


  if (!cleanText) {

    return;
  }


  try {

    await addDoc(
      collection(
        db,
        "posts",
        postId,
        "comments"
      ),
      {

        uid:
          currentUser.uid,

        email:
          currentUser.email,

        text:
          cleanText,

        createdAt:
          serverTimestamp()
      }
    );


  } catch (error) {

    console.error(error);

    alert(
      getFriendlyError(error)
    );
  }
}


/* =====================================================
   LOAD COMMENTS
   ===================================================== */

function loadComments(
  postId,
  container
) {

  const commentsQuery =
    query(
      collection(
        db,
        "posts",
        postId,
        "comments"
      ),
      orderBy(
        "createdAt",
        "asc"
      )
    );


  onSnapshot(
    commentsQuery,
    function (snapshot) {

      container.innerHTML = "";


      snapshot.forEach(
        function (commentDoc) {

          const comment =
            commentDoc.data();


          const div =
            document.createElement(
              "div"
            );


          div.className =
            "comment";


          div.innerHTML =
            `
            <span class="commentUser">
              ${escapeHTML(
                comment.email ||
                "User"
              )}
            </span>

            :
            ${escapeHTML(
              comment.text || ""
            )}
            `;


          container.appendChild(div);
        }
      );

    },

    function (error) {

      console.error(
        "COMMENTS ERROR:",
        error
      );
    }
  );
}


/* =====================================================
   SHARE
   ===================================================== */

async function sharePost(post) {

  const shareText =
    "Check this post on Gitalk Social ❤️";


  try {

    if (
      navigator.share
    ) {

      await navigator.share({

        title:
          "Gitalk Social",

        text:
          shareText,

        url:
          window.location.href
      });

    } else {

      await navigator.clipboard.writeText(
        window.location.href
      );

      alert(
        "Link copied! अब आप share कर सकते हैं."
      );
    }

  } catch (error) {

    console.log(
      "Share cancelled."
    );
  }
}


/* =====================================================
   NAVIGATION
   ===================================================== */

window.goHome = function () {

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};


window.goProfile = function () {

  alert(
    "Profile feature जल्द आ रहा है ❤️"
  );
};


win
