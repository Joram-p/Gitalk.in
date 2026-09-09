import {initializeApp,getApps,getApp} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import {getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import {getFirestore,collection,addDoc,query,orderBy,onSnapshot,serverTimestamp,doc,getDoc,setDoc,deleteDoc} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";
import {getStorage,ref,uploadBytes,getDownloadURL} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-storage.js";

const firebaseConfig={
 apiKey:"AIzaSyBDz7YkD4ivdet3kjJ1HcmfCUbS8WOc25I",
 authDomain:"gitalk-social-3a85a.firebaseapp.com",
 projectId:"gitalk-social-3a85a",
 storageBucket:"gitalk-social-3a85a.firebasestorage.app",
 messagingSenderId:"553434284005",
 appId:"1:553434284005:web:e934097f7f7228d2b8b90c"
};

const app=getApps().length?getApp():initializeApp(firebaseConfig);
const auth=getAuth(app),db=getFirestore(app),storage=getStorage(app);
let currentUser=null,signupMode=false,postsUnsubscribe=null;

window.toggleAuth=()=>{
 signupMode=!signupMode;
 const title=document.getElementById("authTitle"),btn=document.getElementById("authButton"),sw=document.getElementById("switchAuth");
 document.getElementById("authMessage").innerText="";
 if(signupMode){title.innerText="Create Gitalk Account";btn.innerText="Sign Up";btn.onclick=window.signup;sw.innerText="Already have an account? Login"}
 else{title.innerText="Login to Gitalk";btn.innerText="Login";btn.onclick=window.login;sw.innerText="Create new account"}
};

window.signup=async()=>{
 const email=document.getElementById("email").value.trim(),password=document.getElementById("password").value;
 if(!email||!password)return showAuthMessage("Email और password डालें.");
 if(password.length<6)return showAuthMessage("Password कम से कम 6 characters का होना चाहिए.");
 try{
  showAuthMessage("Account बनाया जा रहा है...");
  const r=await createUserWithEmailAndPassword(auth,email,password),u=r.user;
  await setDoc(doc(db,"users",u.uid),{uid:u.uid,email:u.email,displayName:"Gitalk User",photoURL:"",createdAt:serverTimestamp()});
  showAuthMessage("Account successfully created ❤️");
 }catch(e){console.error(e);showAuthMessage(getFriendlyError(e))}
};

window.login=async()=>{
 const email=document.getElementById("email").value.trim(),password=document.getElementById("password").value;
 if(!email||!password)return showAuthMessage("Email और password डालें.");
 try{showAuthMessage("Login हो रहा है...");await signInWithEmailAndPassword(auth,email,password);showAuthMessage("Login successful ❤️")}
 catch(e){console.error(e);showAuthMessage(getFriendlyError(e))}
};

window.logout=async()=>{try{await signOut(auth)}catch(e){alert(getFriendlyError(e))}};

onAuthStateChanged(auth,user=>{
 currentUser=user;
 const a=document.getElementById("authSection"),s=document.getElementById("appSection"),l=document.getElementById("logoutBtn"),em=document.getElementById("userEmail");
 if(user){a.style.display="none";s.style.display="block";l.style.display="inline-block";em.innerText=user.email;loadPosts()}
 else{a.style.display="block";s.style.display="none";l.style.display="none";em.innerText="";if(postsUnsubscribe)postsUnsubscribe();currentUser=null}
});

window.createPost=async()=>{
 if(!currentUser)return alert("Please login first.");
 const ta=document.getElementById("postText"),text=ta.value.trim();
 if(!text)return alert("Post में कुछ लिखें.");
 try{
  setStatus("Post publish हो रहा है...");
  await addDoc(collection(db,"posts"),{uid:currentUser.uid,email:currentUser.email,text,mediaType:"",mediaUrl:"",contentType:"",createdAt:serverTimestamp()});
  ta.value="";setStatus("Post published successfully ❤️",false,true);
 }catch(e){console.error(e);setStatus(getFriendlyError(e),true)}
};

window.selectPhoto=()=>document.getElementById("photoInput")?.click();
window.selectVideo=()=>document.getElementById("videoInput")?.click();

window.handlePhoto=async event=>{
 const file=event.target.files[0];if(!file)return;
 if(!currentUser){alert("Please login first.");return}
 if(!file.type.startsWith("image/")){alert("Please select an image.");event.target.value="";return}
 if(file.size>10*1024*1024){alert("Photo 10 MB से छोटी होनी चाहिए.");event.target.value="";return}
 try{
  setStatus("📤 Photo upload हो रही है...");
  const storageRef=ref(storage,`posts/${currentUser.uid}/${Date.now()}_${createSafeFileName(file.name)}`);
  await uploadBytes(storageRef,file,{contentType:file.type});
  setStatus("Photo upload हो गई... Post बनाया जा रहा है...");
  const url=await getDownloadURL(storageRef),caption=document.getElementById("postText").value.trim();
  await addDoc(collection(db,"posts"),{uid:currentUser.uid,email:currentUser.email,text:caption,mediaType:"image",mediaUrl:url,contentType:file.type,createdAt:serverTimestamp()});
  document.getElementById("postText").value="";event.target.value="";
  setStatus("✅ Photo posted successfully ❤️",false,true);
 }catch(e){console.error("PHOTO UPLOAD ERROR:",e);setStatus(getFriendlyError(e),true);event.target.value=""}
};

window.handleVideo=async event=>{
 const file=event.target.files[0];if(!file)return;
 if(!currentUser){alert("Please login first.");return}
 if(!file.type.startsWith("video/")){alert("Please select a video.");event.target.value="";return}
 if(file.size>50*1024*1024){alert("Video 50 MB से छोटी होनी चाहिए.");event.target.value="";return}
 try{
  setStatus("📤 Video upload हो रही है...");
  const storageRef=ref(storage,`posts/${currentUser.uid}/${Date.now()}_${createSafeFileName(file.name)}`);
  await uploadBytes(storageRef,file,{contentType:file.type});
  setStatus("Video upload हो गई... Post बनाया जा रहा है...");
  const url=await getDownloadURL(storageRef),caption=document.getElementById("postText").value.trim();
  await addDoc(collection(db,"posts"),{uid:currentUser.uid,email:currentUser.email,text:caption,mediaType:"video",mediaUrl:url,contentType:file.type,createdAt:serverTimestamp()});
  document.getElementById("postText").value="";event.target.value="";
  setStatus("✅ Video posted successfully ❤️",false,true);
 }catch(e){console.error("VIDEO UPLOAD ERROR:",e);setStatus(getFriendlyError(e),true);event.target.value=""}
};

function loadPosts(){
 if(postsUnsubscribe)postsUnsubscribe();
 const feed=document.getElementById("feed");
 const q=query(collection(db,"posts"),orderBy("createdAt","desc"));
 postsUnsubscribe=onSnapshot(q,snap=>{
  feed.innerHTML="";
  if(snap.empty){feed.innerHTML='<div class="emptyFeed"><h3>Welcome to Gitalk Social ❤️</h3><p>Be the first person to create a post.</p></div>';return}
  snap.forEach(d=>feed.appendChild(createPostElement({id:d.id,...d.data()})));
 },e=>{console.error(e);feed.innerHTML=`<div class="emptyFeed">⚠️ Feed load error<br><br>${escapeHTML(getFriendlyError(e))}</div>`});
}

function createPostElement(post){
 const article=document.createElement("article");article.className="post";
 let media="";
 if(post.mediaType==="image"&&post.mediaUrl)media=`<img src="${escapeAttribute(post.mediaUrl)}" alt="Gitalk post image" loading="lazy">`;
 if(post.mediaType==="video"&&post.mediaUrl)media=`<video controls playsinline preload="metadata"><source src="${escapeAttribute(post.mediaUrl)}" type="${escapeAttribute(post.contentType||"video/mp4")}">Your browser does not support video.</video>`;
 article.innerHTML=`
 <div class="postHeader"><div class="postUser">👤 ${escapeHTML(post.email||"Gitalk User")}</div><div class="postDate">${escapeHTML(formatDate(post.createdAt))}</div></div>
 ${post.text?`<div class="postText">${escapeHTML(post.text)}</div>`:""}${media}
 <div class="postActions">
 <button class="likeBtn">❤️ Like</button><button class="commentBtn">💬 Comment</button><button class="shareBtn">🔗 Share</button>
 </div><div class="comments"></div>`;
 article.querySelector(".likeBtn").onclick=()=>likePost(post.id);
 article.querySelector(".commentBtn").onclick=()=>commentPost(post.id);
 article.querySelector(".shareBtn").onclick=()=>sharePost(post);
 loadComments(post.id,article.querySelector(".comments"));
 return article;
}

async function likePost(postId){
 if(!currentUser)return alert("Please login first.");
 try{
  const r=doc(db,"posts",postId,"likes",currentUser.uid),x=await getDoc(r);
  if(x.exists())await deleteDoc(r);else await setDoc(r,{uid:currentUser.uid,email:currentUser.email,createdAt:serverTimestamp()});
 }catch(e){console.error(e);alert(getFriendlyError(e))}
}

async function commentPost(postId){
 if(!currentUser)return alert("Please login first.");
 const text=prompt("Write your comment:");if(!text||!text.trim())return;
 try{await addDoc(collection(db,"posts",postId,"comments"),{uid:currentUser.uid,email:currentUser.email,text:text.trim(),createdAt:serverTimestamp()})}
 catch(e){console.error(e);alert(getFriendlyError(e))}
}

function loadComments(postId,container){
 const q=query(collection(db,"posts",postId,"comments"),orderBy("createdAt","asc"));
 onSnapshot(q,snap=>{
  container.innerHTML="";
  snap.forEach(d=>{const c=d.data(),div=document.createElement("div");div.className="comment";div.innerHTML=`<span class="commentUser">${escapeHTML(c.email||"User")}</span> : ${escapeHTML(c.text||"")}`;container.appendChild(div)})
 },e=>console.error("COMMENTS ERROR:",e));
}

async function sharePost(){
 try{
  if(navigator.share)await navigator.share({title:"Gitalk Social",text:"Check this post on Gitalk Social ❤️",url:location.href});
  else{await navigator.clipboard.writeText(location.href);alert("Link copied!")}
 }catch(e){console.log("Share cancelled.")}
}

window.goHome=()=>window.scrollTo({top:0,behavior:"smooth"});
window.goProfile=()=>alert("Profile feature जल्द आ रहा है ❤️");
window.goFriends=()=>alert("Friends feature जल्द आ रहा है 👥");
window.goMessages=()=>alert("Messages feature जल्द आ रहा है 💬");
window.goSettings=()=>alert("Settings feature जल्द आ रहा है ⚙️");

function setStatus(message,isError=false,autoHide=false){
 const s=document.getElementById("uploadStatus");s.style.display="block";s.innerText=message;
 s.style.color=isError?"#d93025":"#1877f2";s.style.background=isError?"#fff0f0":"#eef5ff";
 if(autoHide)setTimeout(()=>s.style.display="none",4000);
}
function showAuthMessage(message){document.getElementById("authMessage").innerText=message}
function getFriendlyError(e){
 const c=e?.code||"";
 if(c.includes("permission-denied"))return "Firebase permission denied. Rules check करें.";
 if(c.includes("storage/unauthorized"))return "Storage permission denied. Firebase Storage Rules check करें.";
 if(c.includes("storage/unknown"))return "Storage error. Firebase Storage enabled है या नहीं check करें.";
 if(c.includes("auth/email-already-in-use"))return "यह email पहले से registered है.";
 if(c.includes("auth/invalid-credential"))return "Email या password गलत है.";
 if(c.includes("auth/invalid-email"))return "Email address सही नहीं है.";
 return e?.message||"Something went wrong.";
}
function createSafeFileName(n){return n.replace(/[^a-zA-Z0-9._-]/g,"_")}
function escapeHTML(v){return String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}
function escapeAttribute(v){return escapeHTML(v)}
function formatDate(t){return t?.toDate?t.toDate().toLocaleString("en-IN"):"Just now"}
