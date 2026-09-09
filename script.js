* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, Helvetica, sans-serif;
  background: #f4f6f8;
  color: #222;
  min-height: 100vh;
}

button,
input,
textarea {
  font-family: inherit;
}

button {
  cursor: pointer;
}


/* ================= AUTH ================= */

#authSection {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.authCard {
  width: 100%;
  max-width: 430px;
  background: white;
  padding: 35px 25px;
  border-radius: 22px;
  box-shadow: 0 15px 50px rgba(0,0,0,.25);
  text-align: center;
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.logo h1 {
  font-size: 34px;
}

.logoIcon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #667eea;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
}

.tagline {
  color: #777;
  margin: 8px 0 25px;
}

.authCard h2 {
  margin-bottom: 20px;
}

.authCard input,
.editCard input,
.editCard textarea {
  width: 100%;
  padding: 14px;
  margin: 7px 0;
  border: 1px solid #ddd;
  border-radius: 12px;
  outline: none;
  font-size: 15px;
}

.authCard input:focus,
.editCard input:focus,
.editCard textarea:focus {
  border-color: #667eea;
}

.authBtn,
.saveBtn,
.createBtn,
.editBtn {
  border: none;
  border-radius: 12px;
  padding: 14px 20px;
  font-weight: bold;
  color: white;
  background: #667eea;
  width: 100%;
  margin-top: 12px;
}

.authBtn:hover,
.saveBtn:hover,
.createBtn:hover,
.editBtn:hover {
  opacity: .9;
}

.switchText {
  margin-top: 18px;
  color: #666;
  font-size: 14px;
}

.switchText button {
  border: none;
  background: none;
  color: #667eea;
  font-weight: bold;
}

#authMessage {
  margin-top: 15px;
  color: #d33;
}


/* ================= APP ================= */

#appSection {
  min-height: 100vh;
  padding-bottom: 80px;
}

.topBar {
  height: 65px;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,.08);
  position: sticky;
  top: 0;
  z-index: 10;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 22px;
  font-weight: bold;
}

.brandLogo {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #667eea;
  color: white;
}

.topUser {
  display: flex;
  align-items: center;
  gap: 10px;
}

#userEmail {
  font-size: 12px;
  color: #777;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
}

#logoutBtn {
  border: none;
  background: #ef4444;
  color: white;
  padding: 9px 13px;
  border-radius: 9px;
}


/* ================= PAGES ================= */

.appPage {
  width: 100%;
  max-width: 700px;
  margin: auto;
  padding: 25px 15px;
}

.pageTitle {
  margin-bottom: 18px;
}

.pageTitle h2 {
  font-size: 26px;
}

.pageTitle p {
  color: #777;
  margin-top: 5px;
}


/* ================= CREATE POST ================= */

.createPost {
  background: white;
  padding: 18px;
  border-radius: 16px;
  box-shadow: 0 3px 15px rgba(0,0,0,.07);
  margin-bottom: 20px;
}

#postText {
  width: 100%;
  min-height: 100px;
  resize: vertical;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 14px;
  outline: none;
  font-size: 15px;
}

.mediaButtons {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

.mediaButton {
  flex: 1;
  text-align: center;
  padding: 12px;
  border-radius: 10px;
  background: #f1f3f8;
  cursor: pointer;
  font-weight: bold;
}

#uploadStatus,
#profileUploadStatus {
  margin-top: 10px;
  font-size: 13px;
  color: #667eea;
}


/* ================= POST ================= */

.post {
  background: white;
  border-radius: 16px;
  padding: 17px;
  margin-bottom: 15px;
  box-shadow: 0 3px 15px rgba(0,0,0,.07);
}

.postHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.postUser {
  font-weight: bold;
}

.postDate {
  color: #888;
  font-size: 12px;
}

.postText {
  margin: 15px 0;
  line-height: 1.5;
  white-space: pre-wrap;
}

.post img,
.post video {
  width: 100%;
  max-height: 550px;
  object-fit: contain;
  border-radius: 12px;
  margin-top: 10px;
  background: #111;
}

.postActions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.postActions button {
  border: none;
  background: #f1f3f8;
  padding: 9px 12px;
  border-radius: 9px;
}

.comments {
  margin-top: 12px;
}

.comment {
  background: #f5f5f5;
  padding: 8px 10px;
  border-radius: 8px;
  margin-top: 5px;
}

.commentUser {
  font-weight: bold;
  font-size: 13px;
}

.emptyFeed {
  background: white;
  padding: 35px;
  text-align: center;
  border-radius: 15px;
  color: #777;
}


/* ================= PROFILE ================= */

.profileCard,
.editCard,
.settingsCard {
  background: white;
  border-radius: 18px;
  padding: 25px;
  box-shadow: 0 3px 15px rgba(0,0,0,.07);
}

.profileCard {
  text-align: center;
}

.profilePhoto,
.editPhoto {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #667eea;
}

.profileCard h2 {
  margin-top: 15px;
}

#profileUsername {
  color: #667eea;
  margin-top: 5px;
}

#profileBio {
  margin: 15px 0;
  color: #666;
}

.profileInfo {
  display: flex;
  flex-direction: column;
  gap: 7px;
  color: #666;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 60px;
  margin: 25px 0;
}

.stats div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stats strong {
  font-size: 22px;
}

.stats span {
  color: #777;
}


/* ================= EDIT ================= */

.editCard h2,
.settingsCard h2 {
  margin-bottom: 20px;
}

.profileUpload {
  text-align: center;
  margin-bottom: 15px;
}

.uploadPhotoBtn {
  display: block;
  margin: 12px auto;
  width: fit-content;
  padding: 10px 15px;
  background: #667eea;
  color: white;
  border-radius: 10px;
  cursor: pointer;
}

.editCard textarea {
  min-height: 100px;
  resize: vertical;
}


/* ================= SETTINGS ================= */

.settingRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 0;
  border-bottom: 1px solid #eee;
}

.settingRow div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.settingRow small {
  color: #888;
}

.settingRow input[type="checkbox"] {
  width: 22px;
  height: 22px;
}


/* ================= BOTTOM NAV ================= */

.bottomNav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 65px;
  background: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2px 12px rgba(0,0,0,.1);
  z-index: 20;
}

.bottomNav button {
  border: none;
  background: none;
  color: #555;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  font-size: 18px;
}

.bottomNav span {
  font-size: 11px;
}


/* ================= DARK MODE ================= */

body.dark {
  background: #121212;
  color: #eee;
}

body.dark .topBar,
body.dark .bottomNav,
body.dark .createPost,
body.dark .post,
body.dark .profileCard,
body.dark .editCard,
body.dark .settingsCard,
body.dark .emptyFeed {
  background: #1e1e1e;
  color: #eee;
}

body.dark input,
body.dark textarea {
  background: #292929;
  color: white;
  border-color: #444;
}

body.dark .mediaButton,
body.dark .postActions button,
body.dark .comment {
  background: #292929;
  color: white;
}

body.dark .bottomNav button {
  color: #ddd;
}


/* ================= MOBILE ================= */

@media (max-width: 600px) {

  .topBar {
    padding: 0 12px;
  }

  #userEmail {
    display: none;
  }

  .appPage {
    padding: 18px 10px;
  }

  .authCard {
    padding: 28px 18px;
  }

  .stats {
    gap: 40px;
  }

    }
