// PHOTO PICKER
window.selectPhoto = function () {
    const input = document.getElementById("photoInput");

    if (!input) {
        alert("Photo input नहीं मिला!");
        return;
    }

    input.click();
};


// VIDEO PICKER
window.selectVideo = function () {
    const input = document.getElementById("videoInput");

    if (!input) {
        alert("Video input नहीं मिला!");
        return;
    }

    input.click();
};


// PHOTO SELECTED
window.handlePhoto = function (event) {

    const file = event.target.files[0];

    if (!file) {
        return;
    }

    alert("Photo selected: " + file.name);

};


// VIDEO SELECTED
window.handleVideo = function (event) {

    const file = event.target.files[0];

    if (!file) {
        return;
    }

    alert("Video selected: " + file.name);

};
// ==========================================
// Gitalk Social
// Firebase Social App
// Posts + Photos + Videos + Likes + Comments
// ==========================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth,
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
    updateDoc,
    increment,
    arrayUnion
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-storage.js";


// ==========================================
// FIREBASE CONFIG
// ==========================================

const firebaseConfig = {

    apiKey: "AIzaSyBDz7YkD4ivdet3kjJ1HcmfCUbS8WOc25I",

    authDomain: "gitalk-social-3a85a.firebaseapp.com",

    projectId: "gitalk-social-3a85a",

    storageBucket: "gitalk-social-3a85a.firebasestorage.app",

    messagingSenderId: "553434284005",

    appId: "1:553434097f7f7228d2b8b90c"
};


// ==========================================
// INITIALIZE FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);

let currentUser = null;


// ==========================================
// AUTH STATE
// ==========================================

onAuthStateChanged(auth, (user) => {

    currentUser = user;

    if (user) {

        loadPosts();

    }

});


// ==========================================
// CREATE TEXT POST
// ==========================================

window.createPost = async function () {

    if (!currentUser) {

        alert("🔐 Please login first.");

        return;
    }


    const input =
        document.getElementById("postText");

    const text =
        input.value.trim();


    if (!text) {

        alert("✍️ Please write something first.");

        return;
    }


    try {

        await addDoc(
            collection(db, "posts"),
            {

                uid: currentUser.uid,

                email: currentUser.email,

                text: text,

                mediaType: "",

                mediaUrl: "",

                likes: 0,

                comments: 0,

                likedBy: [],

                createdAt: serverTimestamp()

            }
        );


        input.value = "";

        alert("🎉 Post published!");

    } catch (error) {

        console.error(error);

        alert(
            "❌ Post failed: " +
            error.message
        );

    }

};


// ==========================================
// SELECT PHOTO
// ==========================================

window.selectPhoto = function () {

    const input =
        document.getElementById("photoInput");

    if (input) {

        input.click();

    } else {

        alert(
            "❌ Photo input not found."
        );

    }

};


// ==========================================
// SELECT VIDEO
// ==========================================

window.selectVideo = function () {

    const input =
        document.getElementById("videoInput");

    if (input) {

        input.click();

    } else {

        alert(
            "❌ Video input not found."
        );

    }

};


// ==========================================
// PHOTO UPLOAD
// ==========================================

window.handlePhoto = async function (event) {

    const file =
        event.target.files[0];


    if (!file) {

        return;

    }


    if (!currentUser) {

        alert("🔐 Please login first.");

        return;
    }


    if (!file.type.startsWith("image/")) {

        alert("❌ Please select an image file.");

        return;
    }


    // 10 MB limit

    if (file.size > 10 * 1024 * 1024) {

        alert(
            "❌ Photo must be smaller than 10 MB."
        );

        event.target.value = "";

        return;
    }


    try {

        alert("📷 Uploading photo...");


        const safeFileName =
            createSafeFileName(file.name);


        const filePath =
            "posts/" +
            currentUser.uid +
            "/" +
            Date.now() +
            "_" +
            safeFileName;


        const storageRef =
            ref(
                storage,
                filePath
            );


        await uploadBytes(
            storageRef,
            file
        );


        const imageURL =
            await getDownloadURL(
                storageRef
            );


        const captionInput =
            document.getElementById("postText");


        const caption =
            captionInput
                ? captionInput.value.trim()
                : "";


        await addDoc(
            collection(db, "posts"),
            {

                uid: currentUser.uid,

                email: currentUser.email,

                text: caption,

                mediaType: "image",

                mediaUrl: imageURL,

                likes: 0,

                comments: 0,

                likedBy: [],

                createdAt: serverTimestamp()

            }
        );


        if (captionInput) {

            captionInput.value = "";

        }


        alert(
            "✅ Photo posted successfully!"
        );


        event.target.value = "";


    } catch (error) {

        console.error(error);

        alert(
            "❌ Photo upload failed: " +
            error.message
        );

    }

};


// ==========================================
// VIDEO UPLOAD
// ==========================================

window.handleVideo = async function (event) {

    const file =
        event.target.files[0];


    if (!file) {

        return;

    }


    if (!currentUser) {

        alert("🔐 Please login first.");

        return;
    }


    if (!file.type.startsWith("video/")) {

        alert("❌ Please select a video file.");

        return;
    }


    // 50 MB limit

    if (file.size > 50 * 1024 * 1024) {

        alert(
            "❌ Video must be smaller than 50 MB."
        );

        event.target.value = "";

        return;
    }


    try {

        alert("🎥 Uploading video...");


        const safeFileName =
            createSafeFileName(file.name);


        const filePath =
            "posts/" +
            currentUser.uid +
            "/" +
            Date.now() +
            "_" +
            safeFileName;


        const storageRef =
            ref(
                storage,
                filePath
            );


        await uploadBytes(
            storageRef,
            file
        );


        const videoURL =
            await getDownloadURL(
                storageRef
            );


        const captionInput =
            document.getElementById("postText");


        const caption =
            captionInput
                ? captionInput.value.trim()
                : "";


        await addDoc(
            collection(db, "posts"),
            {

                uid: currentUser.uid,

                email: currentUser.email,

                text: caption,

                mediaType: "video",

                mediaUrl: videoURL,

                likes: 0,

                comments: 0,

                likedBy: [],

                createdAt: serverTimestamp()

            }
        );


        if (captionInput) {

            captionInput.value = "";

        }


        alert(
            "✅ Video posted successfully!"
        );


        event.target.value = "";


    } catch (error) {

        console.error(error);

        alert(
            "❌ Video upload failed: " +
            error.message
        );

    }

};


// ==========================================
// LOAD POSTS REAL-TIME
// ==========================================

function loadPosts() {

    const feed =
        document.getElementById("feed");


    if (!feed) {

        return;

    }


    const postsQuery =
        query(
            collection(db, "posts"),
            orderBy(
                "createdAt",
                "desc"
            )
        );


    onSnapshot(
        postsQuery,

        (snapshot) => {

            feed.innerHTML = "";


            snapshot.forEach(
                (postDoc) => {

                    createPostElement(
                        postDoc.id,
                        postDoc.data()
                    );

                }
            );


            if (snapshot.empty) {

                feed.innerHTML = `

                    <div class="post">

                        <h3>
                            Welcome to Gitalk Social 💜
                        </h3>

                        <p>
                            Be the first person to create a post!
                        </p>

                    </div>

                `;

            }

        },

        (error) => {

            console.error(error);

            alert(
                "❌ Feed error: " +
                error.message
            );

        }
    );

}


// ==========================================
// CREATE POST CARD
// ==========================================

function createPostElement(postId, post) {

    const feed =
        document.getElementById("feed");


    if (!feed) {

        return;

    }


    const article =
        document.createElement("article");


    article.className =
        "post";


    const likes =
        Number(post.likes || 0);


    const comments =
        Number(post.comments || 0);


    const liked =
        currentUser &&
        Array.isArray(post.likedBy) &&
        post.likedBy.includes(
            currentUser.uid
        );


    let mediaHTML = "";


    // IMAGE

    if (
        post.mediaType === "image" &&
        post.mediaUrl
    ) {

        mediaHTML = `

            <div class="post-image">

                <img
                    src="${escapeAttribute(post.mediaUrl)}"
                    alt="Gitalk Social photo"
                    loading="lazy"
                    style="
                        width:100%;
                        max-height:500px;
                        object-fit:cover;
                        border-radius:12px;
                    "
                >

            </div>

        `;

    }


    // VIDEO

    if (
        post.mediaType === "video" &&
        post.mediaUrl
    ) {

        mediaHTML = `

            <div class="post-video">

                <video
                    controls
                    playsinline
                    preload="metadata"
                    style="
                        width:100%;
                        max-height:500px;
                        border-radius:12px;
                    "
                >

                    <source
                        src="${escapeAttribute(post.mediaUrl)}"
                        type="video/mp4"
                    >

                    Your browser does not support video.

                </video>

            </div>

        `;

    }


    const textHTML =
        post.text
            ? `
                <p class="post-text">
                    ${escapeHTML(post.text)}
                </p>
              `
            : "";


    article.innerHTML = `

        <div class="post-header">

            <div class="small-avatar">
                G
            </div>


            <div>

                <strong>
                    ${escapeHTML(
                        post.email ||
                        "Gitalk User"
                    )}
                </strong>

                <p>
                    Gitalk Social
                </p>

            </div>

        </div>


        ${textHTML}


        ${mediaHTML}


        <div class="post-stats">

            <span>

                ${likes}

                ${likes === 1
                    ? " Like"
                    : " Likes"}

            </span>


            <span>

                ${comments}

                ${comments === 1
                    ? " Comment"
                    : " Comments"}

            </span>

        </div>


        <div class="post-buttons">

            <button
                onclick="likePost('${postId}')"
                ${liked ? "disabled" : ""}
            >

                ${
                    liked
                    ? "❤️ Liked"
                    : "❤️ Like"
                }

            </button>


            <button
                onclick="commentPost('${postId}')"
            >

                💬 Comment

            </button>


            <button
                onclick="sharePost('${postId}')"
            >

                ↗️ Share

            </button>

        </div>


        <div
            id="comments-${postId}"
            class="comments-box"
        >

        </div>

    `;


    feed.appendChild(article);


    loadComments(postId);

}


// ==========================================
// LIKE POST
// ==========================================

window.likePost = async function (postId) {

    if (!currentUser) {

        alert("🔐 Please login first.");

        return;
    }


    try {

        await updateDoc(
            doc(
                db,
                "posts",
                postId
            ),
            {

                likes:
                    increment(1),

                likedBy:
                    arrayUnion(
                        currentUser.uid
                    )

            }
        );

    } catch (error) {

        console.error(error);

        alert(
            "❌ Like failed: " +
            error.message
        );

    }

};


// ==========================================
// ADD COMMENT
// ==========================================

window.commentPost = async function (postId) {

    if (!currentUser) {

        alert("🔐 Please login first.");

        return;
    }


    const comment =
        prompt(
            "💬 Write your comment:"
        );


    if (
        !comment ||
        !comment.trim()
    ) {

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
                    comment.trim(),

                createdAt:
                    serverTimestamp()

            }
        );


        await updateDoc(
            doc(
                db,
                "posts",
                postId
            ),
            {

                comments:
                    increment(1)

            }
        );


        alert(
            "💬 Comment added!"
        );


    } catch (error) {

        console.error(error);

        alert(
            "❌ Comment failed: " +
            error.message
        );

    }

};


// ==========================================
// LOAD COMMENTS
// ==========================================

function loadComments(postId) {

    const commentsBox =
        document.getElementById(
            "comments-" + postId
        );


    if (!commentsBox) {

        return;

    }


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

        (snapshot) => {

            commentsBox.innerHTML = "";


            snapshot.forEach(
                (commentDoc) => {

                    const comment =
                        commentDoc.data();


                    const div =
                        document.createElement(
                            "div"
                        );


                    div.className =
                        "comment";


                    div.innerHTML = `

                        <strong>
                            ${escapeHTML(
                                comment.email ||
                                "User"
                            )}
                        </strong>

                        <p>
                            ${escapeHTML(
                                comment.text ||
                                ""
                            )}
                        </p>

                    `;


                    commentsBox.appendChild(
                        div
                    );

                }
            );

        },

        (error) => {

            console.error(
                "Comments error:",
                error
            );

        }
    );

}


// ==========================================
// SHARE POST
// ==========================================

window.sharePost = async function () {

    const shareText =
        "Check out Gitalk Social 💜";


    if (navigator.share) {

        try {

            await navigator.share({

                title:
                    "Gitalk Social",

                text:
                    shareText,

                url:
                    window.location.href

            });

        } catch (error) {

            console.log(
                "Share cancelled."
            );

        }

    } else {

        try {

            await navigator.clipboard.writeText(
                window.location.href
            );


            alert(
                "🔗 Link copied!"
            );

        } catch (error) {

            alert(
                "Please copy the website link manually."
            );

        }

    }

};


// ==========================================
// SEARCH / NOTIFICATIONS / ETC.
// ==========================================

window.showMessage = function (name) {

    alert(
        name +
        " feature is coming soon! 🚀"
    );

};


// ==========================================
// HOME
// ==========================================

window.goHome = function () {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

};


// ==========================================
// SAFE FILE NAME
// ==========================================

function createSafeFileName(fileName) {

    return fileName
        .replace(/[^a-zA-Z0-9._-]/g, "_")
        .substring(0, 100);

}


// ==========================================
// HTML SECURITY
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        String(text);

    return div.innerHTML;

}


// ==========================================
// ATTRIBUTE SECURITY
// ==========================================

function escapeAttribute(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

                }
