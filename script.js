import { auth, db, storage } from "./firebase-config.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  doc, setDoc, getDoc, updateDoc, collection, addDoc,
  query, orderBy, limit, onSnapshot, serverTimestamp,
  arrayUnion, arrayRemove, getDocs, where, deleteDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
  ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";

let currentUser = null;
let currentProfile = null;
let selectedPhoto = null;
let selectedVideo = null;
let feedUnsubscribe = null;

function $(id){return document.getElementById(id)}
function setText(id,value){const el=$(id);if(el)el.textContent=value??""}
function setImage(id,url){const el=$(id);if(!el)return;el.src=url||"https://ui-avatars.com/api/?name=Gitalk&background=random&size=300"}
function escapeHTML(value){if(value===undefined||value===null)return"";return String(value).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}
function formatDate(timestamp){
  if(!timestamp)return"Just now";
  let date;
  try{date=timestamp.toDate?timestamp.toDate():typeof timestamp==="number"?new Date(timestamp):new Date(timestamp)}
  catch{return"Just now"}
  return date.toLocaleString("en-IN",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})
}
function showAuthMessage(message,type="info"){
  const el=$("authMessage");if(!el)return;
  el.textContent=message;el.style.display="block";
  el.style.color=type==="error"?"#d93025":type==="success"?"#188038":"";
}

window.showLogin=function(){
  if($("loginBox"))$("loginBox").style.display="block";
  if($("signupBox"))$("signupBox").style.display="none";
  showAuthMessage("");
}
window.showSignup=function(){
  if($("loginBox"))$("loginBox").style.display="none";
  if($("signupBox"))$("signupBox").style.display="block";
  showAuthMessage("");
}

window.signup=async function(){
  const name=$("signupName")?.value.trim();
  const email=$("signupEmail")?.value.trim();
  const password=$("signupPassword")?.value;
  if(!name||!email||!password)return showAuthMessage("Please fill all fields.","error");
  if(password.length<6)return showAuthMessage("Password must be at least 6 characters.","error");
  try{
    showAuthMessage("Creating your Gitalk account...");
    const result=await createUserWithEmailAndPassword(auth,email,password);
    const user=result.user;
    const cleanName=name.toLowerCase().replace(/[^a-z0-9]/g,"").substring(0,15);
    const username="@"+(cleanName||"user")+Math.floor(1000+Math.random()*9000);
    await setDoc(doc(db,"users",user.uid),{
      uid:user.uid,name,username,email,bio:"",location:"",website:"",photoURL:"",
      followersCount:0,followingCount:0,createdAt:serverTimestamp()
    });
    showAuthMessage("Account created successfully ❤️","success");
  }catch(error){console.error("Signup Error:",error);showAuthMessage(firebaseErrorMessage(error),"error")}
}

window.login=async function(){
  const email=$("loginEmail")?.value.trim();
  const password=$("loginPassword")?.value;
  if(!email||!password)return showAuthMessage("Please enter email and password.","error");
  try{
    showAuthMessage("Logging in...");
    await signInWithEmailAndPassword(auth,email,password);
    showAuthMessage("Login successful ❤️","success");
  }catch(error){console.error("Login Error:",error);showAuthMessage(firebaseErrorMessage(error),"error")}
}

window.logout=async function(){
  try{await signOut(auth)}catch(error){console.error("Logout Error:",error);alert("Logout failed. Please try again.")}
}

function firebaseErrorMessage(error){
  switch(error?.code||""){
    case"auth/invalid-email":return"Invalid email address.";
    case"auth/user-not-found":return"No account found with this email.";
    case"auth/wrong-password":return"Incorrect password.";
    case"auth/invalid-credential":return"Email or password is incorrect.";
    case"auth/email-already-in-use":return"This email is already registered.";
    case"auth/weak-password":return"Password is too weak.";
    case"auth/too-many-requests":return"Too many attempts. Please try again later.";
    case"auth/network-request-failed":return"Internet connection problem.";
    default:return error?.message||"Something went wrong.";
  }
}

onAuthStateChanged(auth,async(user)=>{
  currentUser=user;
  if(user){
    if($("authSection"))$("authSection").style.display="none";
    if($("appSection"))$("appSection").style.display="block";
    setText("userEmail",user.email);
    await loadProfile(user.uid);
    startFeedListener();
    showPage("homePage");
  }else{
    if($("authSection"))$("authSection").style.display="block";
    if($("appSection"))$("appSection").style.display="none";
    if(feedUnsubscribe){feedUnsubscribe();feedUnsubscribe=null}
    currentProfile=null;
    showLogin();
  }
});

async function loadProfile(uid){
  try{
    const snapshot=await getDoc(doc(db,"users",uid));
    if(!snapshot.exists()){
      currentProfile={uid,name:currentUser?.email?.split("@")[0]||"Gitalk User",username:"@user",email:currentUser?.email||"",bio:"",location:"",website:"",photoURL:""};
      updateProfileUI();
      return;
    }
    currentProfile={uid,...snapshot.data()};
    updateProfileUI();
    await loadProfileStats(uid);
  }catch(error){console.error("Load Profile Error:",error);showAuthMessage("Profile could not be loaded.","error")}
}

function updateProfileUI(){
  if(!currentProfile)return;
  const p=currentProfile;
  setText("profileName",p.name||"Gitalk User");
  setText("profileUsername",p.username||"@user");
  setText("profileBio",p.bio||"Welcome to Gitalk ❤️");
  setText("profileLocation",p.location||"");
  setText("profileWebsite",p.website||"");
  setText("homeUserName",p.name||"Gitalk User");
  setText("homeUsername",p.username||"@user");
  setText("editUserName",p.name||"");
  setText("editUsername",p.username||"");
  setImage("homePhoto",p.photoURL);setImage("profilePhoto",p.photoURL);setImage("editProfilePhoto",p.photoURL);
  if($("nameInput"))$("nameInput").value=p.name||"";
  if($("usernameInput"))$("usernameInput").value=p.username||"";
  if($("bioInput"))$("bioInput").value=p.bio||"";
  if($("locationInput"))$("locationInput").value=p.location||"";
  if($("websiteInput"))$("websiteInput").value=p.website||"";
}

window.previewProfileImage=function(event){
  const file=event?.target?.files?.[0];if(!file)return;
  if(!file.type.startsWith("image/")){setText("profileUploadStatus","Please select an image file.");return}
  if(file.size>5*1024*1024){setText("profileUploadStatus","Image must be under 5 MB.");event.target.value="";return}
  const reader=new FileReader();
  reader.onload=e=>setImage("editProfilePhoto",e.target.result);
  reader.readAsDataURL(file);
  setText("profileUploadStatus","Photo selected. Click Save Profile.");
}

window.saveFirebaseProfile=async function(){
  if(!currentUser)return alert("Please login first.");
  try{
    const name=$("nameInput")?.value.trim()||"";
    const username=$("usernameInput")?.value.trim()||"";
    const bio=$("bioInput")?.value.trim()||"";
    const location=$("locationInput")?.value.trim()||"";
    const website=$("websiteInput")?.value.trim()||"";
    if(!name){setText("profileUploadStatus","Name is required.");return}
    setText("profileUploadStatus","Saving profile...");
    let photoURL=currentProfile?.photoURL||"";
    const file=$("profileImageInput")?.files?.[0];
    if(file){
      const extension=file.name.split(".").pop();
      const imageRef=ref(storage,`profilePhotos/${currentUser.uid}/profile_${Date.now()}.${extension}`);
      await uploadBytes(imageRef,file);
      photoURL=await getDownloadURL(imageRef);
    }
    const profileData={uid:currentUser.uid,name,username:username||currentProfile?.username||"@user",email:currentUser.email||"",bio,location,website,photoURL,updatedAt:serverTimestamp()};
    await setDoc(doc(db,"users",currentUser.uid),profileData,{merge:true});
    currentProfile={...currentProfile,...profileData};
    updateProfileUI();
    if($("profileImageInput"))$("profileImageInput").value="";
    setText("profileUploadStatus","Profile saved successfully ❤️");
  }catch(error){console.error("Save Profile Error:",error);setText("profileUploadStatus","Profile save failed: "+error.message)}
}

window.saveSettings=async function(){
  if(!currentUser)return;
  try{
    const notifications=$("notificationsToggle")?.checked??true;
    const privateAccount=$("privateToggle")?.checked??false;
    const messages=$("messagesToggle")?.checked??true;
    await setDoc(doc(db,"users",currentUser.uid),{
      notificationsEnabled:notifications,privateAccount,messagesEnabled:messages,updatedAt:serverTimestamp()
    },{merge:true});
    if(currentProfile){
      currentProfile.notificationsEnabled=notifications;
      currentProfile.privateAccount=privateAccount;
      currentProfile.messagesEnabled=messages;
    }
    alert("Settings saved ❤️");
  }catch(error){console.error("Settings Error:",error);alert("Settings save failed: "+error.message)}
}

window.toggleDarkMode=function(){
  const enabled=$("darkToggle")?.checked||false;
  document.body.classList.toggle("darkMode",enabled);
  localStorage.setItem("gitalkDarkMode",enabled?"true":"false");
}

(function restoreDarkMode(){
  const enabled=localStorage.getItem("gitalkDarkMode")==="true";
  if(enabled){
    document.body.classList.add("darkMode");
    setTimeout(()=>{if($("darkToggle"))$("darkToggle").checked=true},100);
  }
})();

function loadSettings(){
  if(!currentProfile)return;
  if($("notificationsToggle"))$("notificationsToggle").checked=currentProfile.notificationsEnabled!==false;
  if($("privateToggle"))$("privateToggle").checked=currentProfile.privateAccount===true;
  if($("messagesToggle"))$("messagesToggle").checked=currentProfile.messagesEnabled!==false;
  if($("darkToggle"))$("darkToggle").checked=document.body.classList.contains("darkMode");
}

window.showPage=function(pageId){
  document.querySelectorAll(".appPage").forEach(page=>page.style.display=page.id===pageId?"block":"none");
  if(pageId==="settingsPage")loadSettings();
  if(pageId==="profilePage")loadProfileStats(currentUser?.uid);
  window.scrollTo({top:0,behavior:"smooth"});
}

window.handlePhotoSelect=function(event){
  const file=event?.target?.files?.[0];if(!file)return;
  selectedPhoto=file;selectedVideo=null;
  if($("videoInput"))$("videoInput").value="";
  if(!file.type.startsWith("image/")){selectedPhoto=null;setText("uploadStatus","Please select a valid image.");return}
  if(file.size>10*1024*1024){selectedPhoto=null;event.target.value="";setText("uploadStatus","Photo must be under 10 MB.");return}
  setText("uploadStatus",`Photo selected: ${file.name}`);
}

window.handleVideoSelect=function(event){
  const file=event?.target?.files?.[0];if(!file)return;
  selectedVideo=file;selectedPhoto=null;
  if($("photoInput"))$("photoInput").value="";
  if(!file.type.startsWith("video/")){selectedVideo=null;setText("uploadStatus","Please select a valid video.");return}
  if(file.size>100*1024*1024){selectedVideo=null;event.target.value="";setText("uploadStatus","Video must be under 100 MB.");return}
  setText("uploadStatus",`Video selected: ${file.name}`);
}

window.createPost=async function(){
  if(!currentUser)return alert("Please login first.");
  const text=$("postText")?.value.trim()||"";
  if(!text&&!selectedPhoto&&!selectedVideo){setText("uploadStatus","Write something or select a photo/video.");return}
  const createButton=document.querySelector(".createBtn");
  try{
    if(createButton){createButton.disabled=true;createButton.textContent="Posting..."}
    setText("uploadStatus","Uploading...");
    let mediaUrl="",mediaType="";
    const file=selectedPhoto||selectedVideo;
    if(file){
      const extension=file.name.split(".").pop();
      const mediaRef=ref(storage,`posts/${currentUser.uid}/${Date.now()}_${Math.random().toString(36).substring(2)}.${extension}`);
      await uploadBytes(mediaRef,file);
      mediaUrl=await getDownloadURL(mediaRef);
      mediaType=selectedPhoto?"image":"video";
    }
    const profile=currentProfile||{};
    await addDoc(collection(db,"posts"),{
      uid:currentUser.uid,name:profile.name||currentUser.email?.split("@")[0]||"Gitalk User",
      username:profile.username||"@user",photoURL:profile.photoURL||"",text,mediaUrl,mediaType,
      likes:[],comments:[],createdAt:serverTimestamp()
    });
    if($("postText"))$("postText").value="";
    if($("photoInput"))$("photoInput").value="";
    if($("videoInput"))$("videoInput").value="";
    selectedPhoto=null;selectedVideo=null;
    setText("uploadStatus","Post published successfully ❤️");
  }catch(error){console.error("Create Post Error:",error);setText("uploadStatus","Post failed: "+error.message)}
  finally{if(createButton){createButton.disabled=false;createButton.textContent="Post"}}
}

function startFeedListener(){
  if(feedUnsubscribe){feedUnsubscribe();feedUnsubscribe=null}
  const feed=$("feed");if(!feed)return;
  feed.innerHTML=`<div class="emptyFeed">Loading posts...</div>`;
  const postsQuery=query(collection(db,"posts"),orderBy("createdAt","desc"),limit(50));
  feedUnsubscribe=onSnapshot(postsQuery,async snapshot=>{
    if(snapshot.empty){
      feed.innerHTML=`<div class="emptyFeed">No posts yet ❤️<br>Be the first to create a post!</div>`;
      await loadProfileStats(currentUser?.uid);return;
    }
    renderFeed(snapshot.docs);await loadProfileStats(currentUser?.uid);
  },error=>{
    console.error("Feed Error:",error);
    feed.innerHTML=`<div class="emptyFeed">Feed could not be loaded.<br>${escapeHTML(error.message)}</div>`;
  });
}

function renderFeed(docs){
  const feed=$("feed");if(!feed)return;
  let html="";
  docs.forEach(docSnap=>{
    const post=docSnap.data(),postId=docSnap.id;
    const likes=Array.isArray(post.likes)?post.likes:[];
    const comments=Array.isArray(post.comments)?post.comments:[];
    const liked=currentUser&&likes.includes(currentUser.uid);
    const name=post.name||"Gitalk User",username=post.username||"@user";
    const photoURL=post.photoURL||`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
    let mediaHTML="";
    if(post.mediaType==="image"&&post.mediaUrl)mediaHTML=`<img src="${escapeHTML(post.mediaUrl)}" alt="Gitalk Post" loading="lazy">`;
    if(post.mediaType==="video"&&post.mediaUrl)mediaHTML=`<video src="${escapeHTML(post.mediaUrl)}" controls preload="metadata"></video>`;
    let commentsHTML="";
    comments.slice(-10).forEach(comment=>commentsHTML+=`<div class="comment"><strong class="commentUser">${escapeHTML(comment.name||"User")}</strong><span>${escapeHTML(comment.text||"")}</span></div>`);
    const deleteButton=currentUser&&post.uid===currentUser.uid?`<button class="postDeleteBtn" onclick="deletePost('${postId}')">🗑️</button>`:"";
    html+=`<article class="post" id="post-${postId}">
      <div class="postHeader"><div class="postUser"><img src="${escapeHTML(photoURL)}" alt="Profile" class="postAvatar"><div><strong>${escapeHTML(name)}</strong><div>${escapeHTML(username)}</div></div></div><div class="postDate">${escapeHTML(formatDate(post.createdAt))}${deleteButton}</div></div>
      ${post.text?`<div class="postText">${escapeHTML(post.text)}</div>`:""}
      ${mediaHTML?`<div class="postMedia">${mediaHTML}</div>`:""}
      <div class="postActions">
        <button onclick="toggleLike('${postId}')">${liked?"❤️":"🤍"} ${likes.length}</button>
        <button onclick="focusComment('${postId}')">💬 ${comments.length}</button>
        <button onclick="sharePost('${postId}')">🔗 Share</button>
      </div>
      <div class="comments">${commentsHTML}
        <div class="commentInputBox" style="display:flex;gap:8px;margin-top:10px">
          <input id="comment-${postId}" type="text" placeholder="Write a comment..." maxlength="500" style="flex:1;padding:10px;border-radius:20px;border:1px solid #ccc">
          <button onclick="addComment('${postId}')" style="border:0;border-radius:20px;padding:8px 14px;cursor:pointer">Send</button>
        </div>
      </div>
    </article>`;
  });
  feed.innerHTML=html;
}

window.toggleLike=async function(postId){
  if(!currentUser)return alert("Please login first.");
  try{
    const postRef=doc(db,"posts",postId),snapshot=await getDoc(postRef);
    if(!snapshot.exists())return;
    const likes=Array.isArray(snapshot.data().likes)?snapshot.data().likes:[];
    await updateDoc(postRef,{likes:likes.includes(currentUser.uid)?arrayRemove(currentUser.uid):arrayUnion(currentUser.uid)});
  }catch(error){console.error("Like Error:",error);alert("Like failed: "+error.message)}
}

window.addComment=async function(postId){
  if(!currentUser)return alert("Please login first.");
  const input=$(`comment-${postId}`);if(!input)return;
  const text=input.value.trim();if(!text)return;
  try{
    const profile=currentProfile||{};
    await updateDoc(doc(db,"posts",postId),{
      comments:arrayUnion({uid:currentUser.uid,name:profile.name||currentUser.email?.split("@")[0]||"User",username:profile.username||"@user",text,createdAt:Date.now()})
    });
    input.value="";
  }catch(error){console.error("Comment Error:",error);alert("Comment failed: "+error.message)}
}

window.focusComment=function(postId){
  const input=$(`comment-${postId}`);if(!input)return;
  input.focus();input.scrollIntoView({behavior:"smooth",block:"center"});
}

window.sharePost=async function(postId){
  const shareUrl=`${window.location.origin}${window.location.pathname}#post-${postId}`;
  try{
    if(navigator.share)await navigator.share({title:"Gitalk Social",text:"Check this post on Gitalk ❤️",url:shareUrl});
    else if(navigator.clipboard){await navigator.clipboard.writeText(shareUrl);alert("Post link copied ❤️")}
    else prompt("Copy this link:",shareUrl);
  }catch(error){console.log("Share cancelled.")}
}

window.deletePost=async function(postId){
  if(!currentUser)return;
  if(!confirm("Delete this post?"))return;
  try{
    const postRef=doc(db,"posts",postId),snapshot=await getDoc(postRef);
    if(!snapshot.exists())return;
    if(snapshot.data().uid!==currentUser.uid)return alert("You can delete only your own posts.");
    await deleteDoc(postRef);
  }catch(error){console.error("Delete Error:",error);alert("Delete failed: "+error.message)}
}

async function loadProfileStats(uid){
  if(!uid)return;
  try{
    const snapshot=await getDocs(query(collection(db,"posts"),where("uid","==",uid)));
    let postsCount=0,likesCount=0;
    snapshot.forEach(docSnap=>{
      const data=docSnap.data();postsCount++;
      if(Array.isArray(data.likes))likesCount+=data.likes.length;
    });
    setText("postsCount",postsCount);setText("likesCount",likesCount);
    setText("followersCount",currentProfile?.followersCount||0);
  }catch(error){console.error("Stats Error:",error)}
}

window.focusPost=function(){
  showPage("homePage");
  setTimeout(()=>{const textarea=$("postText");if(textarea){textarea.focus();textarea.scrollIntoView({behavior:"smooth",block:"center")}}},300);
}

window.comingSoon=function(feature){alert(`${feature||"This feature"} is coming soon ❤️`)}

document.addEventListener("DOMContentLoaded",()=>{
  showLogin();
  const darkToggle=$("darkToggle");if(darkToggle)darkToggle.addEventListener("change",toggleDarkMode);
  const photoInput=$("photoInput");if(photoInput)photoInput.addEventListener("change",handlePhotoSelect);
  const videoInput=$("videoInput");if(videoInput)videoInput.addEventListener("change",handleVideoSelect);
});

console.log("Gitalk Social script.js loaded successfully ❤️");
