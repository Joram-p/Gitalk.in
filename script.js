// ==========================================
// Gitalk Social
// Firebase Posts + Likes + Comments
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
// FIREBASE START
// ==========================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

let currentUser = null;


// ==========================================
// LOGIN STATE
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

        alert(
            "❌ Post failed: " +
            error.message
        );

    }

};


// ==========================================
// LOAD POSTS - REAL TIME
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

            snapshot.forEach((postDoc) => {

                createPostElement(
                    postDoc.id,
                    postDoc.data()
                );

            });

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

    const article =
        document.createElement("article");

    article.className = "post";

    const likes =
        post.likes || 0;

    const comments =
        post.comments || 0;

    const liked =
        currentUser &&
        Array.isArray(post.likedBy) &&
        post.likedBy.includes(currentUser.uid);

    article.innerHTML = `

        <div class="post-header">

            <div class="small-avatar">
                G
            </div>

            <div>

                <strong>
                    ${escapeHTML(
                        post.email || "Gitalk User"
                    )}
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
// LIKE
// ==========================================

window.likePost = async function (postId) {

    if (!currentUser) {

        alert("🔐 Please login first.");

        return;
    }

    try {

        await updateDoc(
            doc(db, "posts", postId),
            {
                likes: increment(1),

                likedBy:
                    arrayUnion(currentUser.uid)
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
        prompt("💬 Write your comment:");

    if (!comment || !comment.trim()) {

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
                uid: currentUser.uid,

                email: currentUser.email,

                text: comment.trim(),

                createdAt:
                    serverTimestamp()
            }
        );


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
            "❌ Comment failed: " +
            error.message
        );

    }

};


// ==========================================
// LOAD COMMENTS - REAL TIME
// ==========================================

function loadComments(postId) {

    const commentsBox =
        document.getElementById(
            "comments-" + postId
        );

    if (!commentsBox) return;

    const commentsQuery =
        query(
            collection(
                db,
                "posts",
                postId,
                "comments"
            ),
            orderBy("createdAt", "asc")
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
                        document.createElement("div");


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
                                comment.text || ""
                            )}
                        </p>

                    `;


                    commentsBox.appendChild(div);

                }
            );

        },
        (error) => {

            console.error(
                "Comment loading error:",
                error
            );

        }
    );

}


// ==========================================
// SHARE
// ==========================================

window.sharePost = async function () {

    const shareText =
        "Check out Gitalk Social 💜";


    if (navigator.share) {

        try {

            await navigator.share({

                title: "Gitalk Social",

                text: shareText,

                url: window.location.href

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
// OTHER BUTTONS
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
