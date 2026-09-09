// Gitalk Social
// Step 3 - Basic Social Features


let likes = 0;


// ❤️ LIKE POST

function likePost() {

    likes++;

    document.getElementById("likeCount").innerText =
        likes + (likes === 1 ? " Like" : " Likes");

}


// 💬 COMMENT

function commentPost() {

    const comment = prompt("Write your comment:");

    if (comment && comment.trim() !== "") {

        alert("💬 Comment added!");

    }

}


// ↗️ SHARE

function sharePost() {

    const shareText =
        "Check out Gitalk Social 💜";

    if (navigator.share) {

        navigator.share({
            title: "Gitalk Social",
            text: shareText,
            url: window.location.href
        });

    } else {

        navigator.clipboard.writeText(window.location.href);

        alert("🔗 Link copied! Share it with your friends.");

    }

}


// ➕ CREATE POST

function createPost() {

    const input =
        document.getElementById("postText");

    const text =
        input.value.trim();

    if (text === "") {

        alert("✍️ Please write something first.");

        return;
    }


    const feed =
        document.getElementById("feed");


    const post =
        document.createElement("article");

    post.className = "post";


    post.innerHTML = `

        <div class="post-header">

            <div class="small-avatar">
                G
            </div>

            <div>

                <strong>
                    Gitalk User
                </strong>

                <p>
                    Just now
                </p>

            </div>

        </div>


        <p class="post-text">
            ${escapeHTML(text)}
        </p>


        <div class="post-stats">

            <span>
                0 Likes
            </span>

            <span>
                0 Comments
            </span>

        </div>


        <div class="post-buttons">

            <button onclick="likeNewPost(this)">
                ❤️ Like
            </button>

            <button onclick="commentPost()">
                💬 Comment
            </button>

            <button onclick="sharePost()">
                ↗️ Share
            </button>

        </div>

    `;


    feed.prepend(post);

    input.value = "";

}


// ❤️ LIKE NEW POST

function likeNewPost(button) {

    if (button.dataset.liked === "true") {

        return;
    }


    button.dataset.liked = "true";

    button.innerText = "❤️ Liked";


    const stats =
        button.closest(".post")
        .querySelector(".post-stats span");

    stats.innerText = "1 Like";

}


// 📷 PHOTO BUTTON

function addPhoto() {

    alert(
        "📷 Photo upload feature will be connected in the next version."
    );

}


// 🎥 VIDEO BUTTON

function addVideo() {

    alert(
        "🎥 Video upload feature will be connected in the next version."
    );

}


// 🔍 / 🔔 / PROFILE etc.

function showMessage(name) {

    alert(
        name + " feature is coming soon! 🚀"
    );

}


// 🏠 HOME

function goHome() {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// 🔐 BASIC SECURITY

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}
