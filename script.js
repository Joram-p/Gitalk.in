// ==========================================
// Gitalk Social
// Firebase Firestore - Real Posts + Live Feed
// ==========================================

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
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


// ==========================================
// FIREBASE CONFIG
// ==========================================

const firebaseConfig = {

    apiKey: "AIzaSyBDz7YkD4ivdet3kjJ1HcmfCUbS8WOc25I",

    authDomain: "gitalk-social-3a85a.firebaseapp.com",

    projectId: "gitalk-social-3a85a",

    storageBucket: "gitalk-social-3a85a.firebasestorage.app",

    messagingSenderId: "553434284005",

    appId: "1:553434284005:web:e934097f7f7228d2b8b90c"

};


// ==========================================
// INITIALIZE
// ==========================================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

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
// CREATE POST
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

        alert("❌ Post failed: " + error.message);

    }

};


// ==========================================
// LOAD REAL-TIME POSTS
// ==========================================

function loadPosts() {

    const feed =
        document.getElementById("feed");


    const postsQuery =
        query(
            collection(db, "posts"),
            orderBy("createdAt", "desc")
        );


    onSnapshot(
        postsQuery,
        (snapshot) => {

            feed.innerHTML = "";


            snapshot.forEach(
                (postDoc) => {

                    const post =
                        postDoc.data();

                    const postId =
                        postDoc.id;


                    createPostElement(
                        postId,
                        post
                    );

                }
            );

        },
        (error) => {

            console.error(error);

            alert(
                "❌ Unable to load posts: "
                + error.message
            );

        }
    );

}


// ==========================================
// CREATE POST HTML
// ==========================================

function createPostElement(postId, post) {

    const feed =
        document.getElementById("feed");


    const article =
        document.createElement("article");


    article.className = "post";


    const likes =
        post.likes || 0;


    const comments =
        post.comments || 0;


    const liked =
        currentUser &&
        post.likedBy &&
        post.likedBy.includes(currentUser.uid);


    article.innerHTML = `

        <div class="post-header">

            <div class="small-avatar">
                G
            </div>

            <div>

                <strong>
                    ${escapeHTML(post.email || "Gitalk User")}
                </strong>

                <p>
                    Gitalk Social
                </p>

            </div>

        </div>


        <p class="post-text">
            ${escapeHTML(post.text || "")}
        </p>


        <div class="post-stats">

            <span>
                ${likes}
                ${likes === 1 ? " Like" : " Likes"}
            </span>

            <span>
                ${comments}
                ${comments === 1 ? " Comment" : " Comments"}
            </span>

        </div>


        <div class="post-buttons">

            <button
                onclick="likePost('${postId}')"
                ${liked ? "disabled" : ""}
            >
                ${liked ? "❤️ Liked" : "❤️ Like"}
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

    `;


    feed.appendChild(article);

}


// ==========================================
// LIKE POST
// ==========================================

window.likePost = async function (postId) {

    if (!currentUser) {

        alert("🔐 Please login first.");

        return;
    }


    const postRef =
        doc(db, "posts", postId);


    try {

        await updateDoc(
            postRef,
            {

                likes: increment(1),

                likedBy:
                    arrayUnion(currentUser.uid)

            }
        );

    } catch (error) {

        console.error(error);

        alert(
            "❌ Like failed: "
            + error.message
        );

    }

};


// ==========================================
// COMMENT
// ==========================================

window.commentPost = async function (postId) {

    if (!currentUser) {

        alert("🔐 Please login first.");

        return;
    }


    const comment =
        prompt("💬 Write your comment:");


    if (!comment || !comment.trim()) {

        return;
    }


    try {

        await updateDoc(
            doc(db, "posts", postId),
            {

                comments: increment(1)

            }
        );


        alert("💬 Comment added!");

    } catch (error) {

        console.error(error);

        alert(
            "❌ Comment failed: "
            + error.message
        );

    }

};


// ==========================================
// SHARE
// ==========================================

window.sharePost = async function (postId) {

    const shareText =
        "Check out this post on Gitalk Social 💜";


    if (navigator.share) {

        try {

            await navigator.share({

                title: "Gitalk Social",

                text: shareText,

                url: window.location.href

            });

        } catch (error) {

            console.log("Share cancelled.");

        }

    } else {

        try {

            await navigator.clipboard.writeText(
                window.location.href
            );

            alert(
                "🔗 Link copied! Share it with your friends."
            );

        } catch (error) {

            alert(
                "Please copy the website link manually."
            );

        }

    }

};


// ==========================================
// PHOTO
// ==========================================

window.addPhoto = function () {

    alert(
        "📷 Photo upload will be added next."
    );

};


// ==========================================
// VIDEO
// ==========================================

window.addVideo = function () {

    alert(
        "🎥 Video upload will be added next."
    );

};


// ==========================================
// NAVIGATION
// ==========================================

window.showMessage = function (name) {

    alert(
        name +
        " feature is coming soon! 🚀"
    );

};


window.goHome = function () {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

};


// ==========================================
// SECURITY
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}
