/* =========================================================
   GITALK SOCIAL
   STEP 3 — COMPLETE SCRIPT.JS
   Navigation + Posts UI + Chat UI + Profile + Settings
========================================================= */

import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore
} from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    getStorage
} from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";


/* =========================================================
   FIREBASE CONFIG
========================================================= */

const firebaseConfig = {
    apiKey: "AIzaSyBDz7YkD4ivdet",
    authDomain: "gitalk-social-3a85a.firebaseapp.com",
    projectId: "gitalk-social-3a85a",
    storageBucket: "gitalk-social-3a85a.firebasestorage.app",
    messagingSenderId: "",
    appId: ""
};


/*
   IMPORTANT:
   If your Firebase console contains a complete config,
   replace the values above with your exact Web App config.
*/


/* =========================================================
   INITIALIZE FIREBASE
========================================================= */

let app;
let auth;
let db;
let storage;

try {

    app = initializeApp(firebaseConfig);

    auth = getAuth(app);

    db = getFirestore(app);

    storage = getStorage(app);

    console.log("Firebase initialized successfully.");

} catch(error){

    console.error("Firebase initialization error:", error);

}


/* =========================================================
   GLOBAL STATE
========================================================= */

let currentUser = null;

let selectedPhoto = null;

let selectedVideo = null;

let currentChatUser = null;

let darkMode = false;


/* =========================================================
   AUTH STATE
========================================================= */

if(auth){

    onAuthStateChanged(auth, (user) => {

        currentUser = user;

        if(user){

            console.log("Logged in:", user.email);

            updateUserInterface(user);

        }else{

            console.log("No user logged in.");

        }

    });

}


/* =========================================================
   UPDATE USER INTERFACE
========================================================= */

function updateUserInterface(user){

    const name =
        user.displayName ||
        user.email?.split("@")[0] ||
        "Gitalk User";

    const photo =
        user.photoURL || "";


    const profileName =
        document.getElementById("profileName");

    const postAuthorName =
        document.getElementById("postAuthorName");


    if(profileName){

        profileName.textContent = name;

    }


    if(postAuthorName){

        postAuthorName.textContent = name;

    }


    const avatars = [

        document.getElementById("profileAvatar"),

        document.getElementById("currentUserAvatar")

    ];


    avatars.forEach(avatar => {

        if(!avatar) return;


        if(photo){

            avatar.innerHTML =
                `<img src="${photo}" alt="Profile">`;

        }else{

            avatar.textContent = "👤";

        }

    });

}


/* =========================================================
   PAGE NAVIGATION
========================================================= */

window.showPage = function(page){

    const pages = [

        "home",
        "chat",
        "notifications",
        "profile",
        "settings"

    ];


    pages.forEach(name => {

        const element =
            document.getElementById(name + "Page");

        if(element){

            element.classList.remove("active");

        }

    });


    const target =
        document.getElementById(page + "Page");


    if(target){

        target.classList.add("active");

    }


    /* Bottom navigation */

    document.querySelectorAll(".nav-item")
        .forEach(item => {

            item.classList.remove("active");

        });


    const nav =
        document.getElementById("nav" + capitalize(page));


    if(nav){

        nav.classList.add("active");

    }


    window.scrollTo({

        top:0,
        behavior:"smooth"

    });

};


/* =========================================================
   CAPITALIZE
========================================================= */

function capitalize(text){

    return text.charAt(0).toUpperCase() +
           text.slice(1);

}


/* =========================================================
   SEARCH
========================================================= */

window.openSearch = function(){

    const box =
        document.getElementById("searchBox");

    if(box){

        box.classList.remove("hidden");

    }


    const input =
        document.getElementById("searchInput");

    if(input){

        setTimeout(() => input.focus(),100);

    }

};


window.closeSearch = function(){

    const box =
        document.getElementById("searchBox");

    if(box){

        box.classList.add("hidden");

    }

};


const searchInput =
    document.getElementById("searchInput");


if(searchInput){

    searchInput.addEventListener("input", () => {

        const query =
            searchInput.value.trim().toLowerCase();

        const results =
            document.getElementById("searchResults");


        if(!results) return;


        if(!query){

            results.innerHTML = "";

            return;

        }


        results.innerHTML = `

            <div class="empty-state">

                🔎

                <p>
                    Search feature will connect to
                    Firebase in the next step.
                </p>

            </div>

        `;

    });

}


/* =========================================================
   CREATE POST MODAL
========================================================= */

window.openCreatePost = function(type = ""){

    const modal =
        document.getElementById("createPostModal");


    if(!modal) return;


    modal.classList.remove("hidden");


    const textarea =
        document.getElementById("postText");


    if(textarea){

        textarea.focus();

    }


    if(type === "photo"){

        document.getElementById("photoInput")?.click();

    }


    if(type === "video"){

        document.getElementById("videoInput")?.click();

    }

};


window.closeCreatePost = function(){

    const modal =
        document.getElementById("createPostModal");


    if(modal){

        modal.classList.add("hidden");

    }


    resetPostForm();

};


/* =========================================================
   RESET POST FORM
========================================================= */

function resetPostForm(){

    const text =
        document.getElementById("postText");

    const photo =
        document.getElementById("photoInput");

    const video =
        document.getElementById("videoInput");

    const preview =
        document.getElementById("postPreview");


    if(text){

        text.value = "";

    }


    if(photo){

        photo.value = "";

    }


    if(video){

        video.value = "";

    }


    if(preview){

        preview.innerHTML = "";

    }


    selectedPhoto = null;

    selectedVideo = null;

}


/* =========================================================
   PHOTO PREVIEW
========================================================= */

window.previewPhoto = function(event){

    const file =
        event.target.files?.[0];


    if(!file) return;


    selectedPhoto = file;

    selectedVideo = null;


    const preview =
        document.getElementById("postPreview");


    if(!preview) return;


    const url =
        URL.createObjectURL(file);


    preview.innerHTML = `

        <img
            src="${url}"
            alt="Photo preview"
        >

    `;

};


/* =========================================================
   VIDEO PREVIEW
========================================================= */

window.previewVideo = function(event){

    const file =
        event.target.files?.[0];


    if(!file) return;


    selectedVideo = file;

    selectedPhoto = null;


    const preview =
        document.getElementById("postPreview");


    if(!preview) return;


    const url =
        URL.createObjectURL(file);


    preview.innerHTML = `

        <video
            src="${url}"
            controls
        ></video>

    `;

};


/* =========================================================
   PUBLISH POST
========================================================= */

window.publishPost = async function(){

    const textElement =
        document.getElementById("postText");


    const text =
        textElement?.value.trim() || "";


    if(!text && !selectedPhoto && !selectedVideo){

        alert("Please write something or select a photo/video.");

        return;

    }


    /*
       Firebase Firestore + Storage publishing
       will be added in the next Firebase data step.
    */


    const feed =
        document.getElementById("feed");


    if(feed){

        const empty =
            feed.querySelector(".empty-feed");

        if(empty){

            empty.remove();

        }


        const name =
            currentUser?.displayName ||
            currentUser?.email?.split("@")[0] ||
            "You";


        let mediaHTML = "";


        if(selectedPhoto){

            const url =
                URL.createObjectURL(selectedPhoto);

            mediaHTML = `

                <img
                    class="post-media"
                    src="${url}"
                    alt="Post photo"
                >

            `;

        }


        if(selectedVideo){

            const url =
                URL.createObjectURL(selectedVideo);

            mediaHTML = `

                <video
                    class="post-media"
                    src="${url}"
                    controls
                ></video>

            `;

        }


        const post =
            document.createElement("article");


        post.className = "post";


        post.innerHTML = `

            <div class="post-header">

                <div class="avatar">
                    👤
                </div>

                <div class="post-author">

                    <strong>
                        ${escapeHTML(name)}
                    </strong>

                    <small>
                        Just now
                    </small>

                </div>

                <button class="post-menu">
                    ⋯
                </button>

            </div>


            <div class="post-body">

                ${
                    text
                    ?
                    `<div class="post-text">
                        ${escapeHTML(text)}
                    </div>`
                    :
                    ""
                }

                ${mediaHTML}

            </div>


            <div class="post-stats">

                <span>❤️ 0 likes</span>

                <span>0 comments</span>

            </div>


            <div class="post-actions">

                <button onclick="likePost(this)">
                    ❤️ Like
                </button>

                <button onclick="commentPost(this)">
                    💬 Comment
                </button>

                <button onclick="sharePost()">
                    🔄 Share
                </button>

                <button onclick="savePost(this)">
                    🔖 Save
                </button>

            </div>


            <div class="comments">

                <div class="comment-input">

                    <input
                        type="text"
                        placeholder="Write a comment..."
                    >

                    <button
                        onclick="addComment(this)"
                    >
                        ➤
                    </button>

                </div>

            </div>

        `;


        feed.prepend(post);

    }


    closeCreatePost();


    alert(
        "Post added to the screen. Firebase saving will be enabled next."
    );

};


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(text){

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* =========================================================
   LIKE POST
========================================================= */

window.likePost = function(button){

    if(!button) return;


    button.classList.toggle("liked");


    const stats =
        button.closest(".post")
              ?.querySelector(".post-stats span");


    if(!stats) return;


    const liked =
        button.classList.contains("liked");


    stats.textContent =
        liked
        ? "❤️ 1 like"
        : "❤️ 0 likes";

};


/* =========================================================
   COMMENT POST
========================================================= */

window.commentPost = function(button){

    const post =
        button.closest(".post");


    if(!post) return;


    const input =
        post.querySelector(".comment-input input");


    if(input){

        input.focus();

    }

};


/* =========================================================
   ADD COMMENT
========================================================= */

window.addComment = function(button){

    const container =
        button.closest(".comments");


    const input =
        container?.querySelector("input");


    if(!input) return;


    const text =
        input.value.trim();


    if(!text) return;


    const comment =
        document.createElement("div");


    comment.className = "comment";


    const name =
        currentUser?.displayName ||
        "You";


    comment.innerHTML = `

        <div class="avatar">
            👤
        </div>

        <div class="comment-content">

            <strong>
                ${escapeHTML(name)}
            </strong>

            <p>
                ${escapeHTML(text)}
            </p>

        </div>

    `;


    container.insertBefore(
        comment,
        container.querySelector(".comment-input")
    );


    input.value = "";

};


/* =========================================================
   SHARE POST
========================================================= */

window.sharePost = async function(){

    const shareData = {

        title:"Gitalk Social",

        text:"Check out this post on Gitalk Social."

    };


    try{

        if(navigator.share){

            await navigator.share(shareData);

        }else{

            await navigator.clipboard.writeText(
                window.location.href
            );

            alert("Link copied!");

        }

    }catch(error){

        console.log("Share cancelled.");

    }

};


/* =========================================================
   SAVE POST
========================================================= */

window.savePost = function(button){

    if(!button) return;


    const saved =
        button.dataset.saved === "true";


    button.dataset.saved =
        saved ? "false" : "true";


    button.innerHTML =
        saved
        ? "🔖 Save"
        : "✅ Saved";

};


/* =========================================================
   CHAT
========================================================= */

window.startNewChat = function(){

    const name =
        prompt("Enter the name of the person you want to chat with:");


    if(!name) return;


    openChatWindow({

        name:name

    });

};


function openChatWindow(user){

    currentChatUser = user;


    const modal =
        document.getElementById("chatModal");


    if(!modal) return;


    modal.classList.remove("hidden");


    const name =
        document.getElementById("chatUserName");


    if(name){

        name.textContent =
            user.name || "User";

    }


    const status =
        document.getElementById("chatStatus");


    if(status){

        status.textContent =
            "Online";

    }


    const messages =
        document.getElementById("messages");


    if(messages){

        messages.innerHTML = `

            <div class="empty-state">

                <div class="large-icon">
                    💬
                </div>

                <h3>
                    Start your conversation
                </h3>

                <p>
                    Send a message below.
                </p>

            </div>

        `;

    }

}


window.closeChat = function(){

    const modal =
        document.getElementById("chatModal");


    if(modal){

        modal.classList.add("hidden");

    }

};


/* =========================================================
   SEND MESSAGE
========================================================= */

window.sendMessage = function(){

    const input =
        document.getElementById("messageInput");


    const messages =
        document.getElementById("messages");


    if(!input || !messages) return;


    const text =
        input.value.trim();


    if(!text) return;


    const empty =
        messages.querySelector(".empty-state");


    if(empty){

        empty.remove();

    }


    const message =
        document.createElement("div");


    message.className =
        "message sent";


    message.innerHTML = `

        ${escapeHTML(text)}

        <span class="message-time">
            Just now
        </span>

    `;


    messages.appendChild(message);


    input.value = "";


    messages.scrollTop =
        messages.scrollHeight;

};


/* =========================================================
   ENTER TO SEND
========================================================= */

window.handleMessageKey = function(event){

    if(event.key === "Enter"){

        event.preventDefault();

        sendMessage();

    }

};


/* =========================================================
   CHAT IMAGE
========================================================= */

window.selectChatImage = function(){

    const input =
        document.createElement("input");


    input.type = "file";

    input.accept = "image/*";


    input.onchange = () => {

        const file =
            input.files?.[0];


        if(file){

            alert(
                "Image selected. Firebase chat image upload will be enabled next."
            );

        }

    };


    input.click();

};


/* =========================================================
   PROFILE
========================================================= */

window.openEditProfile = function(){

    const modal =
        document.getElementById("editProfileModal");


    if(!modal) return;


    modal.classList.remove("hidden");


    const name =
        document.getElementById("editName");


    const bio =
        document.getElementById("editBio");


    const currentName =
        document.getElementById("profileName");


    const currentBio =
        document.getElementById("profileBio");


    if(name){

        name.value =
            currentName?.textContent || "";

    }


    if(bio){

        bio.value =
            currentBio?.textContent || "";

    }

};


window.closeEditProfile = function(){

    const modal =
        document.getElementById("editProfileModal");


    if(modal){

        modal.classList.add("hidden");

    }

};


/* =========================================================
   SAVE PROFILE
========================================================= */

window.saveProfile = function(){

    const name =
        document.getElementById("editName")
        ?.value.trim();


    const bio =
        document.getElementById("editBio")
        ?.value.trim();


    if(!name){

        alert("Please enter your name.");

        return;

    }


    const profileName =
        document.getElementById("profileName");


    const profileBio =
        document.getElementById("profileBio");


    if(profileName){

        profileName.textContent =
            name;

    }


    if(profileBio){

        profileBio.textContent =
            bio || "Welcome to my Gitalk profile.";

    }


    const author =
        document.getElementById("postAuthorName");


    if(author){

        author.textContent =
            name;

    }


    closeEditProfile();


    alert(
        "Profile updated on this device. Firebase profile saving will be added next."
    );

};


/* =========================================================
   PROFILE PHOTO
========================================================= */

window.editProfilePhoto = function(){

    const input =
        document.createElement("input");


    input.type = "file";

    input.accept = "image/*";


    input.onchange = () => {

        const file =
            input.files?.[0];


        if(!file) return;


        const url =
            URL.createObjectURL(file);


        const avatar =
            document.getElementById("profileAvatar");


        if(avatar){

            avatar.innerHTML =
                `<img src="${url}" alt="Profile">`;

        }


        const smallAvatar =
            document.getElementById("currentUserAvatar");


        if(smallAvatar){

            smallAvatar.innerHTML =
                `<img src="${url}" alt="Profile">`;

        }

    };


    input.click();

};


window.editCoverPhoto = function(){

    alert(
        "Cover photo upload will be connected to Firebase Storage next."
    );

};


/* =========================================================
   SETTINGS
========================================================= */

window.toggleDarkMode = function(){

    darkMode =
        !darkMode;


    document.body.classList.toggle(
        "dark-mode",
        darkMode
    );


    const status =
        document.getElementById("darkModeStatus");


    if(status){

        status.textContent =
            darkMode ? "On" : "Off";

    }


    localStorage.setItem(
        "gitalkDarkMode",
        darkMode ? "on" : "off"
    );

};


/* =========================================================
   LOAD DARK MODE
========================================================= */

if(localStorage.getItem("gitalkDarkMode") === "on"){

    darkMode = true;

    document.body.classList.add("dark-mode");


    const status =
        document.getElementById("darkModeStatus");


    if(status){

        status.textContent = "On";

    }

}


/* =========================================================
   SETTINGS PLACEHOLDERS
========================================================= */

window.openPasswordSettings = function(){

    alert(
        "Password & Security will be connected to Firebase Authentication."
    );

};


window.openPrivacySettings = function(){

    alert(
        "Privacy settings are coming in the next module."
    );

};


window.openBlockedUsers = function(){

    alert(
        "Blocked users management is coming in the next module."
    );

};


window.openNotificationSettings = function(){

    alert(
        "Notification settings will be connected to Firebase."
    );

};


window.openHelp = function(){

    alert(
        "Gitalk Social Help Center"
    );

};


window.openAbout = function(){

    alert(
        "Gitalk Social\nVersion 1.0"
    );

};


window.showSavedPosts = function(){

    alert(
        "Saved posts will appear here after Firebase integration."
    );

};


window.showMediaPosts = function(){

    alert(
        "Your photos and videos will appear here."
    );

};


window.markNotificationsRead = function(){

    alert(
        "Notifications marked as read."
    );

};


/* =========================================================
   LOGOUT
========================================================= */

window.logoutUser = async function(){

    if(!auth){

        alert("Firebase Authentication is not initialized.");

        return;

    }


    const confirmed =
        confirm("Are you sure you want to logout?");


    if(!confirmed) return;


    try{

        await signOut(auth);

        alert("Logged out successfully.");

        window.location.reload();

    }catch(error){

        console.error(error);

        alert(
            "Logout failed: " + error.message
        );

    }

};


/* =========================================================
   INITIAL PAGE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    showPage("home");

    console.log(
        "Gitalk Social UI loaded successfully."
    );

});


/* =========================================================
   PREVENT MODAL BACKGROUND SCROLL
========================================================= */

const observer =
    new MutationObserver(() => {

        const modalOpen =
            document.querySelector(
                ".modal:not(.hidden)"
            );


        document.body.style.overflow =
            modalOpen ? "hidden" : "";

    });


observer.observe(
    document.body,
    {
        subtree:true,
        attributes:true,
        attributeFilter:["class"]
    }
);


/* =========================================================
   END
========================================================= */

console.log(
    "Gitalk Social Step 3 loaded."
);
